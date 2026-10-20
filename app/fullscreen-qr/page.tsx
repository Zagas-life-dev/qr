'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { StyledQRCode } from '@/components/styled-qr-code';
import { UP, getTheme, parseDesign } from '@/lib/qr-styles';

export default function FullscreenQRPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-up-navy" />}>
      <FullscreenQRContent />
    </Suspense>
  );
}

function FullscreenQRContent() {
  const searchParams = useSearchParams();
  const value = searchParams.get('value') || '';
  const design = parseDesign((key) => searchParams.get(key));
  const theme = getTheme(design.theme);

  if (!value) {
    return (
      <div className="font-body min-h-screen flex items-center justify-center bg-up-navy">
        <p className="text-[18px]" style={{ color: 'rgba(251,250,247,0.65)' }}>No QR code data provided.</p>
      </div>
    );
  }

  // Navy codes sit on a cream page; every other theme sits on navy so the code stands out
  const pageBg = theme.id === 'navy' ? UP.surfacePage : UP.navy;
  const onNavy = pageBg === UP.navy;

  return (
    <div
      className="font-body min-h-screen flex flex-col items-center justify-center gap-8 px-4"
      style={{ backgroundColor: pageBg }}
    >
      <p
        className="font-display text-[22px] leading-[1.3] font-bold text-center"
        style={{ color: onNavy ? UP.surfacePage : UP.navy }}
      >
        Scan to connect
      </p>

      <StyledQRCode
        value={value}
        size={340}
        design={design}
        logoSrc="/logo-icon-transparent.svg"
        className="max-w-full h-auto"
      />

      <p
        className="text-[13px] font-bold uppercase tracking-[0.06em]"
        style={{ color: onNavy ? 'rgba(251,250,247,0.65)' : '#5B5847' }}
      >
        Powered by <span style={{ color: onNavy ? UP.orange : '#B8551E' }}>Glow Up Channel</span>
      </p>
    </div>
  );
}
