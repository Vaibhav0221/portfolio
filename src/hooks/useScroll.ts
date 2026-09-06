import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

export function useScroll(): ScrollPosition {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });

  useEffect(() => {
    let ticking = false;
    let lastKnownScrollPosition: ScrollPosition = { x: 0, y: 0 };

    const throttledScroll = () => {
      lastKnownScrollPosition = { x: window.scrollX, y: window.scrollY };
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollPosition(lastKnownScrollPosition);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => window.removeEventListener('scroll', throttledScroll);
  }, []);

  return scrollPosition;
}

export function useScrollDirection(): 'up' | 'down' | null {
  const [direction, setDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return direction;
}