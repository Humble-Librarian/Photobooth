// Photobooth.jsx
// Main component for the photobooth experience: handles camera, filters, photo capture, and photo strip creation.

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import PhotoStrip from './PhotoStrip';

// List of available photo filters
const FILTERS = [
  { key: '90s', label: '90s' },
  { key: '2000s', label: '2000s' },
  { key: 'noir', label: 'Noir' },
  { key: 'crosshatch', label: 'Crosshatch' },
  { key: 'teal_orange', label: 'Teal & Orange' },
  { key: 'neo_tokyo', label: 'Neo-Tokyo' },
  { key: 'bleach_bypass', label: 'Bleach Bypass' },
  { key: 'sunset_fade', label: 'Sunset Fade' },
  { key: 'high_drama', label: 'High Drama' },
  { key: 'muted_earth', label: 'Muted Earth' },
  { key: 'grayscale_punch', label: 'Grayscale Punch' },
];

// Returns Tailwind classes for each filter effect
function getFilterStyle(filter) {
  switch (filter) {
    case '90s':
      return 'sepia saturate-150 hue-rotate-10 brightness-110';
    case '2000s':
      return 'saturate-200 contrast-125 brightness-110 hue-rotate-20';
    case 'noir':
      return 'grayscale contrast-150 brightness-75';
    case 'crosshatch':
      return 'contrast-125 brightness-75 saturate-50';
    case 'teal_orange':
      return 'brightness-105 contrast-125 saturate-150 hue-rotate-20';
    case 'neo_tokyo':
      return 'brightness-120 contrast-130 saturate-250 hue-rotate-270';
    case 'bleach_bypass':
      return 'brightness-110 contrast-150 saturate-30';
    case 'sunset_fade':
      return 'brightness-115 contrast-120 saturate-160 hue-rotate-25';
    case 'high_drama':
      return 'brightness-100 contrast-150 saturate-200';
    case 'muted_earth':
      return 'brightness-95 contrast-130 saturate-50 hue-rotate-30';
    case 'grayscale_punch':
      return 'brightness-105 contrast-140 saturate-0';
    default:
      return '';
  }
}

// Countdown sequence before taking a photo
const COUNTDOWN_SEQUENCE = ['3', '2', '1', 'Smile!'];

export default function Photobooth({ maxPhotos = 3, showToast }) {
  // Refs for video and canvas elements
  const videoRef = useRef();
  const canvasRef = useRef();
  // State for filter, camera error, captured photos, countdown, and UI
  const [filter, setFilter] = useState('90s');
  const [cameraError, setCameraError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [countdownIdx, setCountdownIdx] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [showStrip, setShowStrip] = useState(false);

  // Request camera access on mount
  useEffect(() => {
    let stream;
    async function getCamera() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setCameraError('Could not access camera. Please check your permissions and try again.');
      }
    }
    getCamera();
    // Cleanup: stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Start countdown before capturing a photo
  const startCountdown = () => {
    setIsCounting(true);
    setCountdownIdx(0);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx < COUNTDOWN_SEQUENCE.length) {
        setCountdownIdx(idx);
      } else {
        clearInterval(interval);
        setCountdownIdx(null);
        setIsCounting(false);
        capturePhoto();
      }
    }, 700);
  };

  // Capture a photo from the video stream and save it
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    // Mirror the image horizontally
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();
    // Get image data as JPEG
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setPhotos((prev) => {
      const next = [...prev, { dataUrl, filter }];
      // If all photos taken, show the photo strip
      if (next.length === maxPhotos) {
        setTimeout(() => setShowStrip(true), 500);
      }
      return next;
    });
  };

  // Can the user take another photo?
  const canShoot = !isCounting && !cameraError && photos.length < maxPhotos;

  // Reset the photobooth to take new photos
  const handleReshoot = () => {
    setPhotos([]);
    setShowStrip(false);
    if (showToast) showToast('Photobooth reset!');
  };

  // Show a toast when the photo strip is downloaded
  const handleDownload = () => {
    if (showToast) showToast('Photo strip downloaded!');
  };

  // Render either the photo strip or the camera UI
  return showStrip ? (
    <PhotoStrip photos={photos} onReshoot={handleReshoot} onDownload={handleDownload} />
  ) : (
    <div className="w-full flex flex-col items-center gap-6 py-8">
      <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-cloud flex items-center justify-center">
        {cameraError ? (
          <div className="text-center text-red-600 p-6">
            <p className="font-bold">Camera Error</p>
            <p className="text-sm mt-2">{cameraError}</p>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover rounded-3xl ${getFilterStyle(filter)} scale-x-[-1]`}
            style={{ background: '#eee' }}
            aria-label="Live camera preview"
          />
        )}
        {/* Photo Counter */}
        <div className="absolute top-3 right-4 bg-white text-black font-bold px-4 py-1 rounded-full shadow text-lg">
          {photos.length + 1}/{maxPhotos}
        </div>
        {/* Countdown Overlay */}
        {isCounting && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <span className="text-6xl md:text-7xl font-extrabold text-cloud drop-shadow animate-pulse" aria-live="assertive">
              {COUNTDOWN_SEQUENCE[countdownIdx]}
            </span>
          </div>
        )}
        {/* Hidden canvas for capture */}
        <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
      </div>
      {/* Filter Selection */}
      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="flex flex-wrap justify-center gap-3 p-3 bg-transparent rounded-xl w-full max-w-2xl mx-auto">
          {FILTERS.map((f) => (
            <TabsTrigger 
              key={f.key} 
              value={f.key} 
              className="capitalize px-4 py-2 rounded-lg transition-all hover:bg-gray-200 data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      {/* Shutter Button */}
      <Button
        size="lg"
        variant="primary"
        className="w-40 h-16 rounded-xl text-2xl flex items-center justify-center shadow-lg border-4 border-accent font-bold transition-all bg-primary text-secondary hover:bg-secondary hover:text-white active:bg-secondary/80 active:text-white"
        aria-label="Take Photo"
        disabled={!canShoot}
        onClick={startCountdown}
      >
        Capture
      </Button>
    </div>
  );
}