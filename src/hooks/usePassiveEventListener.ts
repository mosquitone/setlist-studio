import { useEffect, useRef } from 'react';

/**
 * Custom hook for adding passive event listeners
 * Improves scroll and touch performance
 */
export function usePassiveEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void,
  element: Window | Document | HTMLElement | null = window,
  options: AddEventListenerOptions = {},
) {
  const savedHandler = useRef<((event: WindowEventMap[K]) => void) | undefined>(undefined);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!element || !element.addEventListener) {
      return;
    }

    const eventListener = (event: Event) => {
      if (savedHandler.current) {
        savedHandler.current(event as WindowEventMap[K]);
      }
    };

    const listenerOptions: AddEventListenerOptions = {
      passive: true,
      ...options,
    };

    element.addEventListener(eventName, eventListener, listenerOptions);

    return () => {
      element.removeEventListener(eventName, eventListener, listenerOptions);
    };
  }, [eventName, element, options]);
}
