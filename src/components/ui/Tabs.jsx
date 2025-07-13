// Tabs.jsx
// UI components for tabbed navigation using Radix UI Tabs.

import React from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { cn } from '../../lib/utils';

// Tabs root component
export function Tabs({ value, onValueChange, children, className = '' }) {
  return (
    <RadixTabs.Root value={value} onValueChange={onValueChange} className={className}>
      {children}
    </RadixTabs.Root>
  );
}

// Tabs list container
export function TabsList({ children, className = '' }) {
  return (
    <RadixTabs.List
      className={cn(
        'flex justify-center gap-4 w-full my-2',
        className
      )}
    >
      {children}
    </RadixTabs.List>
  );
}

// Individual tab trigger/button
export function TabsTrigger({ value, children, className = '' }) {
  return (
    <RadixTabs.Trigger
      value={value}
      className={cn(
        // Boxed, white, rounded, shadow, transition
        'px-6 py-2 rounded-2xl font-bold bg-white shadow-md border-2 border-transparent transition-all duration-200',
        // Selected: colored border/background, text
        'data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white',
        // Not selected: on hover/active, bg-accent and force text-white
        'data-[state=inactive]:text-primary/70 hover:bg-accent hover:!text-white active:bg-accent active:!text-white',
        className
      )}
    >
      {children}
    </RadixTabs.Trigger>
  );
} 