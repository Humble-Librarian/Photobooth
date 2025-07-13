// Button.jsx
// Reusable button component with variants and sizes for consistent styling.

import React from 'react';
import { cn } from '../../lib/utils';

export default function Button({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  ...props
}) {
  // Base styles for all buttons
  const base = 'inline-flex items-center justify-center font-bold rounded-xl transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  // Style variants for different button types
  const variants = {
    primary: 'bg-primary text-secondary font-bold hover:bg-primary/90 active:bg-primary/80',
    secondary: 'bg-secondary text-primary font-bold hover:bg-accent active:bg-accent',
    outline: 'bg-white border-2 border-primary text-primary font-bold hover:bg-primary hover:text-secondary active:bg-primary/80 active:text-secondary',
  };
  // Size options
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-7 py-3 text-lg',
  };
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
} 