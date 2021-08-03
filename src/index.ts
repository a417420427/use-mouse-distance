import { useState, useCallback, useEffect } from 'react';

export interface MouseDistance {
  distanceX: number;
  distanceY: number;
}
export const useMouseDistance = (container: HTMLElement) => {
  const [mouseDistance, setMouseDistance] = useState<MouseDistance>({
    distanceX: 0,
    distanceY: 0,
  });
  const [startPosition, setStartPosition] = useState({
    clientX: 0,
    clientY: 0,
  });
  const [endPosition, setEndPosition] = useState({
    clientX: 0,
    clientY: 0,
  });

  const onTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setMouseDistance({
      distanceX: 0,
      distanceY: 0,
    });
    setStartPosition({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    setEndPosition({
      clientX: touch.clientX,
      clientY: touch.clientY,
    });
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!endPosition.clientX && !endPosition.clientY) {
      return;
    }
    setMouseDistance({
      distanceX: endPosition.clientX - startPosition.clientX,
      distanceY: endPosition.clientY - startPosition.clientY,
    });
    setEndPosition({
      clientX: 0,
      clientY: 0,
    });
  }, [startPosition, endPosition]);

  const initEvents = useCallback(() => {
    const target = container || document.body;
    target.addEventListener('touchstart', onTouchStart);
    target.addEventListener('touchmove', onTouchMove);
    target.addEventListener('touchend', onTouchEnd);
    return () => {
      target.removeEventListener('touchstart', onTouchStart);
      target.removeEventListener('touchend', onTouchEnd);
      target.removeEventListener('touchmove', onTouchMove);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd, container]);
  useEffect(() => {
    return initEvents();
  }, [initEvents]);

  return mouseDistance;
};
