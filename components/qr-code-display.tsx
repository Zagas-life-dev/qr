'use client';

import { Download, Share2, Copy, Check, Maximize2 } from 'lucide-react';
import { useState, useEffect, ReactNode } from 'react';
import { StyledQRCode } from '@/components/styled-qr-code';
import {
  ColorId,
  DEFAULT_DESIGN,
  EYE_BALLS,
  EYE_FRAMES,
  PALETTE,
  QRDesign,
  QR_PRESETS,
  QR_SHAPES,
  QR_THEMES,
  colorWorksOn,
  designForTheme,
  designToParams,
  getTheme,
  hex,
  parseDesign,
  renderStyledQR,
  shapePath,
} from '@/lib/qr-styles';

interface QRCodeDisplayProps {
  qrCodeUrl: string;
  userId: string;
}

const LOGO_SRC = '/logo-icon-transparent.svg';
const CAPTION = 'Scan to connect';
const STORAGE_KEY = 'qrDesign';

type Tab = 'designs' | 'pattern' | 'corners' | 'colors';
const TABS: { id: Tab; label: string }[] = [
  { id: 'designs', label: 'Designs' },
  { id: 'pattern', label: 'Pattern' },
  { id: 'corners', label: 'Corners' },
  { id: 'colors', label: 'Colors' },
];

function readSaved(): { design: QRDesign; frame: boolean } {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { design: parseDesign((k) => saved[k]), frame: saved.frame !== false };
  } catch {
    return { design: DEFAULT_DESIGN, frame: true };
  }
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[13px] font-medium text-up-muted mb-2">{children}</p>;
}

// Row of palette swatches; colors too faint to scan on the current background are disabled
function Swatches({ value, themeId, onChange }: { value: ColorId; themeId: QRDesign['theme']; onChange: (c: ColorId) => void }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {PALETTE.map((p) => {
        const ok = colorWorksOn(themeId, p.id);
        const selected = p.id === value;
        return (
          <button
            key={p.id}
            type="button"
            disabled={!ok}
            onClick={() => onChange(p.id)}
            aria-pressed={selected}
            aria-label={ok ? p.label : `${p.label} (too faint to scan on this background)`}
            title={ok ? p.label : `${p.label}: too faint to scan on this background`}
            className={`relative w-8 h-8 rounded-full border transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-up-navy focus-visible:ring-offset-2 ${
              selected ? 'ring-2 ring-up-navy ring-offset-2 border-transparent' : 'border-up-border'
            } ${ok ? 'hover:scale-105' : 'opacity-30 cursor-not-allowed'}`}
            style={{ backgroundColor: p.hex }}
          >
            {!ok && <span className="absolute inset-0 m-auto w-[130%] h-[1.5px] -translate-x-[12%] rotate-45 bg-up-navy" />}
          </button>
        );
      })}
    </div>
  );
}

// Icon chips for corner frame / center shapes, drawn from the same paths as the code
function ShapeChips<T extends string>({
  options,
  value,
  onChange,
  frame,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  frame?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const selected = o.id === value;
        const d = frame
          ? shapePath(o.id as never, 2, 2, 20) + shapePath(o.id as never, 6, 6, 12)
          : shapePath(o.id as never, 5, 5, 14);
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            aria-pressed={selected}
            title={o.label}
            className={`flex items-center gap-1.5 pl-2 pr-3 py-1.5 rounded-full border text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-up-navy ${
              selected ? 'bg-up-navy text-up-page border-up-navy' : 'bg-up-card text-up-navy border-up-border hover:border-up-navy'
            }`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
              <path d={d} fill="currentColor" fillRule="evenodd" />
            </svg>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function Toggle({ checked, onChange, label, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  return (
    <label className={`flex items-center justify-between gap-3 ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}>
      <span className="text-[14px] font-medium">{label}</span>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative shrink-0 w-11 h-6 rounded-full bg-up-border transition-colors peer-checked:bg-up-orange peer-focus-visible:ring-2 peer-focus-visible:ring-up-navy after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
    </label>
  );
}

export function QRCodeDisplay({ qrCodeUrl, userId }: QRCodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [design, setDesign] = useState<QRDesign>(DEFAULT_DESIGN);
  const [frame, setFrame] = useState(true);
  const [tab, setTab] = useState<Tab>('designs');
  const [canShare, setCanShare] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const update = (patch: Partial<QRDesign>) => setDesign((d) => ({ ...d, ...patch }));

  useEffect(() => {
    const saved = readSaved();
    setDesign(saved.design);
    setFrame(saved.frame);
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...designToParams(design), frame }));
    } catch {
      // storage unavailable; design just won't persist
    }
  }, [design, frame, loaded]);

  const handleDownload = async () => {
    // Render a high-resolution copy for the PNG instead of the on-screen canvas
    const canvas = document.createElement('canvas');
    await renderStyledQR(canvas, {
      value: qrCodeUrl,
      size: 1024,
      design,
      logoSrc: LOGO_SRC,
      caption: frame ? CAPTION : undefined,
    });
    const downloadLink = document.createElement('a');
    downloadLink.download = `qrcode-${userId}.png`;
    downloadLink.href = canvas.toDataURL('image/png');
    downloadLink.click();
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: 'My QR Code',
        text: 'Scan this QR code to view my profile',
        url: qrCodeUrl,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrCodeUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Error copying:', err);
    }
  };

  const handleFullscreen = () => {
    const params = new URLSearchParams({ value: qrCodeUrl, ...designToParams(design) });
    window.open(`/fullscreen-qr?${params}`, '_blank', 'noopener,noreferrer');
  };

  const activePreset = QR_PRESETS.find((p) => JSON.stringify(p.design) === JSON.stringify(design))?.id;

  return (
    <div className="font-body bg-up-card rounded-up-xl p-6 border border-up-border text-up-navy">
      <div className="flex flex-col items-center gap-6">
        <div className="w-full">
          <p className="text-[13px] leading-[1.4] font-bold uppercase tracking-[0.06em] text-up-orange-ink">Your code</p>
          <h2 className="font-display text-[19px] leading-[1.3] font-bold">Make it yours</h2>
        </div>

        <StyledQRCode
          value={qrCodeUrl}
          size={256}
          design={design}
          logoSrc={LOGO_SRC}
          caption={frame ? CAPTION : undefined}
          className="max-w-full h-auto"
        />

        {/* Designer */}
        <div className="w-full">
          <div role="tablist" className="grid grid-cols-4 p-1 mb-4 rounded-full bg-up-page border border-up-border">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`py-1.5 rounded-full text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-up-navy ${
                  tab === t.id ? 'bg-up-navy text-up-page' : 'text-up-muted hover:text-up-navy'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div role="tabpanel" className="space-y-4 min-h-[180px]">
            {tab === 'designs' && (
              <div className="grid grid-cols-4 gap-2">
                {QR_PRESETS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setDesign(p.design)}
                    aria-pressed={activePreset === p.id}
                    className={`flex flex-col items-center gap-1.5 p-1.5 pb-2 rounded-up-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-up-navy ${
                      activePreset === p.id ? 'border-up-navy bg-up-page' : 'border-up-border hover:border-up-navy'
                    }`}
                  >
                    <StyledQRCode value={qrCodeUrl} size={120} design={p.design} className="!w-full h-auto" />
                    <span className="text-[12px] font-semibold leading-none">{p.label}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === 'pattern' && (
              <div className="grid grid-cols-4 gap-2">
                {QR_SHAPES.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => update({ shape: s.id })}
                    aria-pressed={s.id === design.shape}
                    className={`flex flex-col items-center gap-1.5 p-1.5 pb-2 rounded-up-md border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-up-navy ${
                      s.id === design.shape ? 'border-up-navy bg-up-page' : 'border-up-border hover:border-up-navy'
                    }`}
                  >
                    {/* Zoomed-in corner of the real code, so each tile previews the actual pattern */}
                    <span className="block w-full aspect-square overflow-hidden rounded-up-sm">
                      <StyledQRCode value={qrCodeUrl} size={150} design={{ ...design, shape: s.id }} className="max-w-none" />
                    </span>
                    <span className="text-[12px] font-semibold leading-none">{s.label}</span>
                  </button>
                ))}
              </div>
            )}

            {tab === 'corners' && (
              <>
                <div>
                  <Label>Corner frame</Label>
                  <ShapeChips options={EYE_FRAMES} value={design.eyeFrame} onChange={(v) => update({ eyeFrame: v })} frame />
                </div>
                <div>
                  <Label>Corner center</Label>
                  <ShapeChips options={EYE_BALLS} value={design.eyeBall} onChange={(v) => update({ eyeBall: v })} />
                </div>
                <div>
                  <Label>Frame color</Label>
                  <Swatches value={design.eyeFrameColor} themeId={design.theme} onChange={(c) => update({ eyeFrameColor: c })} />
                </div>
                <div>
                  <Label>Center color</Label>
                  <Swatches value={design.eyeBallColor} themeId={design.theme} onChange={(c) => update({ eyeBallColor: c })} />
                </div>
              </>
            )}

            {tab === 'colors' && (
              <>
                <div>
                  <Label>Background</Label>
                  <div className="flex flex-wrap gap-2.5">
                    {QR_THEMES.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setDesign((d) => designForTheme(d, t.id))}
                        aria-label={`${t.label} background`}
                        aria-pressed={t.id === design.theme}
                        title={t.label}
                        className={`relative w-10 h-10 rounded-full border transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-up-navy focus-visible:ring-offset-2 ${
                          t.id === design.theme ? 'ring-2 ring-up-navy ring-offset-2 border-transparent' : 'border-up-border'
                        }`}
                        style={{ backgroundColor: hex(t.background) }}
                      >
                        <span className="absolute inset-0 m-auto w-3.5 h-3.5 rounded-full" style={{ backgroundColor: hex(t.modules) }} />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Pattern color</Label>
                  <Swatches value={design.moduleColor} themeId={design.theme} onChange={(c) => update({ moduleColor: c })} />
                </div>
                <Toggle
                  label="Gradient into corner center color"
                  checked={design.gradient}
                  disabled={design.moduleColor === design.eyeBallColor}
                  onChange={(v) => update({ gradient: v })}
                />
                <p className="text-[13px] leading-[1.4] text-up-muted">
                  Crossed-out colors are too faint on a {getTheme(design.theme).label.toLowerCase()} background for phones to scan.
                </p>
              </>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-up-border">
            <Toggle label="Add “Scan to connect” label" checked={frame} onChange={setFrame} />
          </div>
        </div>

        <div className="w-full space-y-3">
          <div className="flex items-center gap-2 pl-4 pr-1 py-1 bg-up-page border border-up-border rounded-full">
            <input
              type="text"
              value={qrCodeUrl}
              readOnly
              aria-label="Profile link"
              className="flex-1 min-w-0 bg-transparent text-[14px] text-up-muted outline-none"
            />
            <button
              onClick={handleCopy}
              className="p-2 rounded-full hover:bg-up-border transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-up-navy" /> : <Copy className="w-4 h-4 text-up-muted" />}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-up-orange text-up-navy rounded-full text-[16px] leading-none font-bold hover:brightness-105 transition"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            {canShare && (
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-up-card border border-up-border text-up-navy rounded-full text-[16px] leading-none font-bold hover:border-up-navy transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            )}
            <button
              onClick={handleFullscreen}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-up-navy text-up-page rounded-full text-[16px] leading-none font-bold hover:opacity-90 transition-opacity"
            >
              <Maximize2 className="w-4 h-4" />
              <span>Display QR</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
