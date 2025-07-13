import React from 'react';
import { useEffect, useRef, useState } from 'react';
import Button from './ui/Button';
import { Tabs, TabsList, TabsTrigger } from './ui/Tabs';
import PhotoStrip from './PhotoStrip';

const FILTERS = [
  { key: '90s', label: '90s' },
  { key: '2000s', label: '2000s' },
  { key: 'noir', label: 'Noir' },
  { key: 'fisheye', label: 'Fisheye' },
  { key: 'rainbow', label: 'Rainbow' },
  { key: 'glitch', label: 'Glitch' },
  { key: 'crosshatch', label: 'Crosshatch' },
];

function getFilterStyle(filter) {
  switch (filter) {
    case '90s':
      return 'sepia saturate-150 hue-rotate-10 brightness-110';
    case '2000s':
      return 'saturate-200 contrast-125 brightness-110 hue-rotate-20';
    case 'noir':
      return 'grayscale contrast-150 brightness-75';
    case 'fisheye':
      return 'contrast-125 saturate-150'; // Fisheye effect will be handled later
    case 'rainbow':
      return 'hue-rotate-90 saturate-200 brightness-110';
    case 'glitch':
      return 'hue-rotate-180 saturate-200 contrast-200';
    case 'crosshatch':
      return 'contrast-125 brightness-75 saturate-50';
    default:
      return '';
  }
}

const COUNTDOWN_SEQUENCE = ['3', '2', '1', 'Smile!'];

export default function Photobooth({ maxPhotos = 3, showToast }) {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [filter, setFilter] = useState('90s');
  const [cameraError, setCameraError] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [countdownIdx, setCountdownIdx] = useState(null);
  const [isCounting, setIsCounting] = useState(false);
  const [showStrip, setShowStrip] = useState(false);

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
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Handle countdown and capture
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

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    // Mirror horizontally
    ctx.save();
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    ctx.restore();
    // Get image data
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setPhotos((prev) => {
      const next = [...prev, { dataUrl, filter }];
      if (next.length === maxPhotos) {
        setTimeout(() => setShowStrip(true), 500);
      }
      return next;
    });
  };

  const canShoot = !isCounting && !cameraError && photos.length < maxPhotos;

  const handleReshoot = () => {
    setPhotos([]);
    setShowStrip(false);
    if (showToast) showToast('Photobooth reset!');
  };

  const handleDownload = () => {
    if (showToast) showToast('Photo strip downloaded!');
  };

  return showStrip ? (
    <PhotoStrip photos={photos} onReshoot={handleReshoot} onDownload={handleDownload} />
  ) : (
    <div className="w-full max-w-md mx-auto flex flex-col items-center gap-6 py-8">
      <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl bg-cloud flex items-center justify-center">
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
        <div className="absolute top-3 right-4 bg-cloud/80 text-primary font-bold px-4 py-1 rounded-full shadow text-lg">
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
        <TabsList>
          {FILTERS.map((f) => (
            <TabsTrigger key={f.key} value={f.key} className="capitalize">
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