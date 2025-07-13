import React from 'react';
import { useState } from 'react';
import Button from './ui/Button';

function Cloud({ className = '', style = {} }) {
  return (
    <div
      className={`absolute bg-cloud/70 rounded-full blur-2xl ${className}`}
      style={style}
    />
  );
}

export default function WelcomeCurtain({ onOpen }) {
  const [open, setOpen] = useState(false);

  const handleInsertCoin = () => {
    setOpen(true);
    setTimeout(() => {
      if (onOpen) onOpen();
    }, 1200); // match curtain animation duration
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary to-accent transition-all duration-1000 ${open ? 'pointer-events-none' : ''}`}
      aria-modal="true"
      role="dialog"
    >
      {/* Animated Clouds */}
      <Cloud className="w-40 h-20 top-10 left-10 animate-cloud1" style={{ opacity: 0.7 }} />
      <Cloud className="w-32 h-16 top-1/3 right-20 animate-cloud2" style={{ opacity: 0.5 }} />
      <Cloud className="w-24 h-12 bottom-20 left-1/4 animate-cloud3" style={{ opacity: 0.6 }} />
      <Cloud className="w-28 h-14 bottom-10 right-1/3 animate-cloud4" style={{ opacity: 0.4 }} />
      {/* Curtain Panels */}
      <div
        className={`absolute top-0 left-0 h-full w-1/2 bg-primary transition-transform duration-1000 ${open ? '-translate-x-full' : 'translate-x-0'} rounded-r-3xl shadow-xl`}
        style={{ zIndex: 2 }}
      />
      <div
        className={`absolute top-0 right-0 h-full w-1/2 bg-primary transition-transform duration-1000 ${open ? 'translate-x-full' : 'translate-x-0'} rounded-l-3xl shadow-xl`}
        style={{ zIndex: 2 }}
      />
      {/* Center Content */}
      <div className={`relative z-30 flex flex-col items-center justify-center transition-opacity duration-700 ${open ? 'opacity-0' : 'opacity-100'}`}>
        <h1 className="text-4xl md:text-5xl font-bold text-cloud drop-shadow mb-8 text-center">
          Welcome To <br /> Photobooth
        </h1>
        <Button
          size="lg"
          className="bg-yellow-400 text-primary rounded-full px-12 py-6 text-2xl shadow-xl border-4 border-cloud hover:scale-105 active:scale-95 transition-all cursor-pointer"
          onClick={handleInsertCoin}
          aria-label="Insert Coin to Start Photobooth"
        >
          Insert Coin Here
        </Button>
      </div>
      {/* Animations for clouds */}
      <style>{`
        @keyframes cloud1 { 0%{transform:translateY(0);} 50%{transform:translateY(-20px);} 100%{transform:translateY(0);} }
        @keyframes cloud2 { 0%{transform:translateX(0);} 50%{transform:translateX(30px);} 100%{transform:translateX(0);} }
        @keyframes cloud3 { 0%{transform:scale(1);} 50%{transform:scale(1.1);} 100%{transform:scale(1);} }
        @keyframes cloud4 { 0%{transform:translateY(0);} 50%{transform:translateY(15px);} 100%{transform:translateY(0);} }
        .animate-cloud1 { animation: cloud1 7s ease-in-out infinite; }
        .animate-cloud2 { animation: cloud2 9s ease-in-out infinite; }
        .animate-cloud3 { animation: cloud3 6s ease-in-out infinite; }
        .animate-cloud4 { animation: cloud4 8s ease-in-out infinite; }
      `}</style>
    </div>
  );
} 