// use-toast.js
// Custom React hook to manage toast notifications (show/hide with timeout).

import { useState, useCallback, useRef } from 'react';

export function useToast() {
  // State for the current toast message
  const [toast, setToast] = useState(null);
  // Ref to store the timeout ID
  const timeoutRef = useRef();

  // Show a toast with a message and optional duration
  const showToast = useCallback((message, options = {}) => {
    setToast({ message, ...options });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setToast(null), options.duration || 4000);
  }, []);

  // Hide the toast immediately
  const hideToast = useCallback(() => {
    setToast(null);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  return { toast, showToast, hideToast };
} 