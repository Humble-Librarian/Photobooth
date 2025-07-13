// page.jsx
// Main app page: handles welcome curtain, photobooth, and toast notifications.

import React, { useState } from 'react';
import WelcomeCurtain from '../components/WelcomeCurtain.jsx';
import Photobooth from '../components/Photobooth.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useToast } from '../hooks/use-toast.js';

export default function App() {
  // State to control whether the welcome curtain is open
  const [curtainOpen, setCurtainOpen] = useState(false);
  // Toast state and handlers from custom hook
  const { toast, showToast, hideToast } = useToast();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-accent">
      {/* Show welcome curtain until user starts the app */}
      {!curtainOpen && <WelcomeCurtain onOpen={() => setCurtainOpen(true)} />}
      {/* Show photobooth after curtain is opened */}
      {curtainOpen && <Photobooth photoCount={0} showToast={showToast} />}
      {/* Toast notifications for user feedback */}
      <Toast message={toast?.message} visible={!!toast} onClose={hideToast} />
    </main>
  );
} 