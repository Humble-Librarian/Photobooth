// PhotoStrip.jsx
// Component to display and download the final photo strip after photos are taken.

import React from 'react';
import { useRef } from 'react';
import Button from './ui/Button';

// Utility to get today's date as a string
function getToday() {
  return new Date().toLocaleDateString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

// Map filter key to canvas filter string for drawing
function getCanvasFilterStyle(filter) {
  switch (filter) {
    case '90s':
      return 'sepia(1) saturate(1.5) hue-rotate(10deg) brightness(1.1)';
    case '2000s':
      return 'saturate(2) contrast(1.25) brightness(1.1) hue-rotate(20deg)';
    case 'noir':
      return 'grayscale(1) contrast(1.5) brightness(0.75)';
    case 'rainbow':
      return 'hue-rotate(90deg) saturate(2) brightness(1.1)';
    case 'glitch':
      return 'hue-rotate(180deg) saturate(2) contrast(2)';
    case 'crosshatch':
      return 'contrast(1.25) brightness(0.75) saturate(0.5)';
    default:
      return '';
  }
}

// Simple fisheye effect for canvas
function fisheyeCanvas(ctx, img, x, y, w, h) {
  // Draw image to temp canvas
  const temp = document.createElement('canvas');
  temp.width = w;
  temp.height = h;
  const tctx = temp.getContext('2d');
  tctx.drawImage(img, 0, 0, w, h);
  const src = tctx.getImageData(0, 0, w, h);
  const dst = tctx.createImageData(w, h);
  const cx = w / 2, cy = h / 2, r = Math.min(cx, cy);
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const dx = i - cx, dy = j - cy;
      const d = Math.sqrt(dx * dx + dy * dy);
      let r2 = d / r;
      if (r2 < 1) {
        const theta = Math.atan2(dy, dx);
        const rn = Math.pow(r2, 1.5);
        const sx = Math.round(cx + rn * r * Math.cos(theta));
        const sy = Math.round(cy + rn * r * Math.sin(theta));
        if (sx >= 0 && sx < w && sy >= 0 && sy < h) {
          const si = (sy * w + sx) * 4;
          const di = (j * w + i) * 4;
          dst.data[di] = src.data[si];
          dst.data[di + 1] = src.data[si + 1];
          dst.data[di + 2] = src.data[si + 2];
          dst.data[di + 3] = src.data[si + 3];
        }
      }
    }
  }
  ctx.putImageData(dst, x, y);
}

export default function PhotoStrip({ photos, onReshoot, onDownload }) {
  const canvasRef = useRef();

  // Compose the strip for download as a single image
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const stripW = 400;
    const stripH = 3 * 300 + 60; // 3 photos + caption
    const ctx = canvasRef.current.getContext('2d');
    canvasRef.current.width = stripW;
    canvasRef.current.height = stripH;
    // Draw background gradient
    const grad = ctx.createLinearGradient(0, 0, stripW, stripH);
    grad.addColorStop(0, '#FFF5E1');
    grad.addColorStop(1, '#FFB6B9');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, stripW, stripH);
    // Draw each photo with its filter
    let loaded = 0;
    photos.forEach((photo, i) => {
      const img = new window.Image();
      img.src = photo.dataUrl;
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(20, 20 + i * 300, 360, 240, 32);
        ctx.clip();
        if (photo.filter === 'fisheye') {
          fisheyeCanvas(ctx, img, 20, 20 + i * 300, 360, 240);
        } else {
          ctx.filter = getCanvasFilterStyle(photo.filter);
          ctx.drawImage(img, 20, 20 + i * 300, 360, 240);
          ctx.filter = 'none';
        }
        ctx.restore();
        // Draw white border
        ctx.save();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.roundRect(20, 20 + i * 300, 360, 240, 32);
        ctx.stroke();
        ctx.restore();
        // If last photo, draw caption
        loaded++;
        if (i === 2) {
          ctx.save();
          ctx.font = 'bold 1.2rem Inter, sans-serif';
          ctx.fillStyle = '#222';
          ctx.textAlign = 'center';
          ctx.shadowColor = '#fff';
          ctx.shadowBlur = 2;
          ctx.fillText(`Photobooth • ${getToday()}`, stripW / 2, stripH - 20);
          ctx.restore();
        }
        // After all images loaded, trigger download
        if (loaded === photos.length && onDownload) {
          setTimeout(() => {
            const url = canvasRef.current.toDataURL('image/jpeg', 0.95);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Photobooth-strip-${Date.now()}.jpg`;
            a.click();
          }, 200);
        }
      };
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Photo Strip Preview */}
      <div className="relative bg-gradient-to-b from-cloud to-accent rounded-3xl shadow-2xl p-4 flex flex-col items-center" style={{ minWidth: 220 }}>
        <div className="flex flex-col gap-4">
          {photos.map((photo, i) => (
            <img
              key={i}
              src={photo.dataUrl}
              alt={`Photobooth ${i + 1}`}
              className="w-48 h-32 object-cover rounded-2xl border-4 border-white shadow-lg bg-cloud"
              style={{ filter: 'none' }}
            />
          ))}
        </div>
        {/* Caption */}
        <div className="mt-4 text-center text-lg font-bold text-white bg-secondary/80 px-6 py-2 rounded-xl shadow-lg" style={{ textShadow: '0 2px 8px #23294699' }}>
          {getToday()}
        </div>
      </div>
      {/* Actions: Reshoot and Download */}
      <div className="flex gap-4">
        <Button variant="outline" onClick={onReshoot}>
          Reshoot
        </Button>
        <Button variant="primary" onClick={handleDownload}>
          Download Strip
        </Button>
      </div>
      {/* Hidden canvas for composing strip */}
      <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
    </div>
  );
} 