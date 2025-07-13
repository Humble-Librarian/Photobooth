import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { cn } from '../../lib/utils';

export default function Dialog({ open, onOpenChange, title, description, children }) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <RadixDialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-background rounded-2xl shadow-xl p-8 max-w-md w-full">
          <RadixDialog.Title className="text-xl font-bold mb-2">{title}</RadixDialog.Title>
          {description && <RadixDialog.Description className="mb-4 text-cloud/80">{description}</RadixDialog.Description>}
          {children}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
} 