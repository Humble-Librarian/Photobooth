// Toast.jsx
// Toast notification component for user feedback.

import React from 'react';
import { useEffect } from 'react';
import { cn } from '../../lib/utils';

export default function Toast({ message, visible, onClose, duration = 4000 }) {
  // Auto-dismiss the toast after the specified duration
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  if (!visible) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-8 left-1/2 -translate-x-1/2 z-50',
        'bg-primary text-white px-6 py-3 rounded-2xl shadow-lg font-bold text-lg animate-fadeIn'
      )}
      tabIndex={0}
    >
      {message}
      <button
        onClick={onClose}
        className="ml-4 text-cloud/80 hover:text-white focus:outline-none"
        aria-label="Close toast"
      >
        ×
      </button>
    </div>
  );
} 