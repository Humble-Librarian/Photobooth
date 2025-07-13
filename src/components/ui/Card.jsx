// Card.jsx
// Simple card component for consistent container styling.

import React from 'react';
import { cn } from '../../lib/utils';

export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={cn(
        'bg-white dark:bg-background rounded-2xl shadow-lg p-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 