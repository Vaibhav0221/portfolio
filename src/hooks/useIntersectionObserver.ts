import { useEffect, useRef, useState, useCallback } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefCallback<Element>, boolean, IntersectionObserverEntry | null] {
  const { triggerOnce = false, ...observerOptions } = options;
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null);
  const elementRef = useRef<Element | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: Element | null) => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    elementRef.current = node;

    if (node) {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          setIsIntersecting(entry.isIntersecting);
          setEntry(entry);

          if (triggerOnce && entry.isIntersecting && observerRef.current) {
            observerRef.current.unobserve(node);
          }
        },
        observerOptions
      );

      observerRef.current.observe(node);
    }
  }, [triggerOnce, observerOptions]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [setRef, isIntersecting, entry];
}

export function useIntersectionObserverMultiple(
  targets: Element[],
  options: IntersectionObserverInit = {}
): Map<Element, boolean> {
  const [intersections, setIntersections] = useState<Map<Element, boolean>>(new Map());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setIntersections(prev => {
          const next = new Map(prev);
          entries.forEach(entry => {
            next.set(entry.target, entry.isIntersecting);
          });
          return next;
        });
      },
      options
    );

    targets.forEach(target => observer.observe(target));

    return () => observer.disconnect();
  }, [targets, options]);

  return intersections;
}