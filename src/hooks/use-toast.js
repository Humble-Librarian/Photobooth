import { useState, useCallback, useRef } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);
  const timeoutRef = useRef();

  const showToast = useCallback((message, options = {}) => {
    setToast({ message, ...options });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToast(null), options.duration || 4000);
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { toast, showToast, hideToast };
} 