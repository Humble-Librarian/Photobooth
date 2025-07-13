import React, { useState } from 'react';
import WelcomeCurtain from '../components/WelcomeCurtain.jsx';
import Photobooth from '../components/Photobooth.jsx';
import Toast from '../components/ui/Toast.jsx';
import { useToast } from '../hooks/use-toast.js';

export default function App() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-primary to-accent">
      {!curtainOpen && <WelcomeCurtain onOpen={() => setCurtainOpen(true)} />}
      {curtainOpen && <Photobooth photoCount={0} showToast={showToast} />}
      <Toast message={toast?.message} visible={!!toast} onClose={hideToast} />
    </main>
  );
} 