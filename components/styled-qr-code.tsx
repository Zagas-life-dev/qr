'use client';

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { QRDesign, renderStyledQR } from '@/lib/qr-styles';

interface StyledQRCodeProps {
  value: string;
  size: number;
  design: QRDesign;
  logoSrc?: string;
  caption?: string;
  className?: string;
}

export const StyledQRCode = forwardRef<HTMLCanvasElement | null, StyledQRCodeProps>(function StyledQRCode(
  { value, size, design, logoSrc, caption, className },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);
  // Re-render only when a design field actually changes, not on every new object
  const designKey = JSON.stringify(design);

  useEffect(() => {
    if (canvasRef.current) {
      renderStyledQR(canvasRef.current, { value, size, design, logoSrc, caption });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, size, designKey, logoSrc, caption]);

  return <canvas ref={canvasRef} className={className} aria-label="QR code" role="img" />;
});
