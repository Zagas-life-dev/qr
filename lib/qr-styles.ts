import QRCode from 'qrcode';

// Colors from the UP design system (tokens.json)
export const UP = {
  surfacePage: '#FBFAF7',
  surfaceCard: '#FFFFFF',
  navy: '#0B1233',
  orange: '#FF6A00',
  orangeInk: '#B8551E',
  lime: '#D6FF3F',
  coral: '#FF4D6D',
};

export type ColorId = 'navy' | 'cream' | 'orange' | 'orangeInk' | 'coral' | 'lime';

export const PALETTE: { id: ColorId; label: string; hex: string }[] = [
  { id: 'navy', label: 'Navy', hex: UP.navy },
  { id: 'cream', label: 'Cream', hex: UP.surfacePage },
  { id: 'orange', label: 'Orange', hex: UP.orange },
  { id: 'orangeInk', label: 'Burnt orange', hex: UP.orangeInk },
  { id: 'coral', label: 'Coral', hex: UP.coral },
  { id: 'lime', label: 'Lime', hex: UP.lime },
];

export const hex = (id: ColorId) => PALETTE.find((p) => p.id === id)!.hex;

export type QRThemeId = 'navy' | 'cream' | 'orange' | 'lime' | 'coral';
export type QRShapeId = 'dots' | 'lines' | 'bars' | 'liquid' | 'network' | 'sparkle' | 'rounded' | 'square';
export type EyeFrameId = 'square' | 'rounded' | 'circle' | 'leaf' | 'cut';
export type EyeBallId = 'square' | 'rounded' | 'circle' | 'leaf' | 'diamond' | 'star';

// A background plus the colors that start with it
export interface QRTheme {
  id: QRThemeId;
  label: string;
  background: ColorId;
  modules: ColorId;
  eyeFrame: ColorId;
  eyeBall: ColorId;
  badgeRing: ColorId;
  caption: ColorId;
}

export const QR_THEMES: QRTheme[] = [
  { id: 'navy', label: 'Navy', background: 'navy', modules: 'orange', eyeFrame: 'cream', eyeBall: 'orange', badgeRing: 'orange', caption: 'cream' },
  { id: 'cream', label: 'Cream', background: 'cream', modules: 'navy', eyeFrame: 'navy', eyeBall: 'orangeInk', badgeRing: 'orange', caption: 'navy' },
  { id: 'orange', label: 'Orange', background: 'orange', modules: 'navy', eyeFrame: 'navy', eyeBall: 'navy', badgeRing: 'cream', caption: 'navy' },
  { id: 'lime', label: 'Lime', background: 'lime', modules: 'navy', eyeFrame: 'navy', eyeBall: 'orangeInk', badgeRing: 'orange', caption: 'navy' },
  { id: 'coral', label: 'Coral', background: 'coral', modules: 'navy', eyeFrame: 'navy', eyeBall: 'navy', badgeRing: 'cream', caption: 'navy' },
];

export const QR_SHAPES: { id: QRShapeId; label: string }[] = [
  { id: 'dots', label: 'Dots' },
  { id: 'lines', label: 'Lines' },
  { id: 'bars', label: 'Bars' },
  { id: 'liquid', label: 'Liquid' },
  { id: 'network', label: 'Network' },
  { id: 'sparkle', label: 'Sparkle' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'square', label: 'Square' },
];

export const EYE_FRAMES: { id: EyeFrameId; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
  { id: 'leaf', label: 'Leaf' },
  { id: 'cut', label: 'Cut' },
];

export const EYE_BALLS: { id: EyeBallId; label: string }[] = [
  { id: 'square', label: 'Square' },
  { id: 'rounded', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
  { id: 'leaf', label: 'Leaf' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'star', label: 'Star' },
];

// Everything that describes how a code looks
export interface QRDesign {
  theme: QRThemeId;
  shape: QRShapeId;
  eyeFrame: EyeFrameId;
  eyeBall: EyeBallId;
  moduleColor: ColorId;
  eyeFrameColor: ColorId;
  eyeBallColor: ColorId;
  // Blends the pattern from moduleColor (top-left) into eyeBallColor (bottom-right)
  gradient: boolean;
}

export const DEFAULT_DESIGN: QRDesign = {
  theme: 'navy',
  shape: 'dots',
  eyeFrame: 'circle',
  eyeBall: 'circle',
  moduleColor: 'orange',
  eyeFrameColor: 'cream',
  eyeBallColor: 'orange',
  gradient: false,
};

export const QR_PRESETS: { id: string; label: string; design: QRDesign }[] = [
  { id: 'classic', label: 'Classic', design: DEFAULT_DESIGN },
  {
    id: 'sunset',
    label: 'Sunset',
    design: { theme: 'navy', shape: 'liquid', eyeFrame: 'rounded', eyeBall: 'circle', moduleColor: 'orange', eyeFrameColor: 'orange', eyeBallColor: 'coral', gradient: true },
  },
  {
    id: 'neon',
    label: 'Neon',
    design: { theme: 'navy', shape: 'lines', eyeFrame: 'leaf', eyeBall: 'diamond', moduleColor: 'lime', eyeFrameColor: 'lime', eyeBallColor: 'orange', gradient: true },
  },
  {
    id: 'paper',
    label: 'Paper',
    design: { theme: 'cream', shape: 'rounded', eyeFrame: 'cut', eyeBall: 'star', moduleColor: 'navy', eyeFrameColor: 'navy', eyeBallColor: 'orangeInk', gradient: false },
  },
  {
    id: 'ember',
    label: 'Ember',
    design: { theme: 'cream', shape: 'network', eyeFrame: 'circle', eyeBall: 'circle', moduleColor: 'navy', eyeFrameColor: 'orangeInk', eyeBallColor: 'orangeInk', gradient: true },
  },
  {
    id: 'zest',
    label: 'Zest',
    design: { theme: 'lime', shape: 'sparkle', eyeFrame: 'leaf', eyeBall: 'leaf', moduleColor: 'navy', eyeFrameColor: 'navy', eyeBallColor: 'orangeInk', gradient: true },
  },
  {
    id: 'pop',
    label: 'Pop',
    design: { theme: 'coral', shape: 'bars', eyeFrame: 'circle', eyeBall: 'diamond', moduleColor: 'navy', eyeFrameColor: 'navy', eyeBallColor: 'navy', gradient: false },
  },
  {
    id: 'blaze',
    label: 'Blaze',
    design: { theme: 'orange', shape: 'liquid', eyeFrame: 'leaf', eyeBall: 'star', moduleColor: 'navy', eyeFrameColor: 'navy', eyeBallColor: 'navy', gradient: false },
  },
];

export function getTheme(id: string | null | undefined): QRTheme {
  return QR_THEMES.find((t) => t.id === id) || QR_THEMES[0];
}

// Switching background resets colors to that background's defaults, keeping shapes
export function designForTheme(design: QRDesign, themeId: QRThemeId): QRDesign {
  const t = getTheme(themeId);
  return { ...design, theme: t.id, moduleColor: t.modules, eyeFrameColor: t.eyeFrame, eyeBallColor: t.eyeBall };
}

/* ---------- Scannability: contrast against the background ---------- */

function luminance(hexColor: string) {
  const n = parseInt(hexColor.slice(1), 16);
  const ch = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const MIN_CONTRAST = 3;

// A color can draw code parts on this background if it contrasts enough and keeps the
// background's polarity (dark marks on light backgrounds, light marks on navy)
export function colorWorksOn(themeId: QRThemeId, color: ColorId) {
  const t = getTheme(themeId);
  const bg = hex(t.background);
  const darkMarks = luminance(hex(t.modules)) < luminance(bg);
  const c = hex(color);
  return contrast(c, bg) >= MIN_CONTRAST && luminance(c) < luminance(bg) === darkMarks;
}

/* ---------- URL / storage (de)serialization ---------- */

const pick = <T extends string>(value: string | null | undefined, options: { id: T }[], fallback: T): T =>
  options.find((o) => o.id === value)?.id ?? fallback;

export function parseDesign(get: (key: string) => string | null | undefined): QRDesign {
  const theme = pick(get('theme'), QR_THEMES, DEFAULT_DESIGN.theme);
  const base = designForTheme(DEFAULT_DESIGN, theme);
  const color = (key: string, fallback: ColorId) => {
    const c = pick(get(key), PALETTE, fallback);
    return colorWorksOn(theme, c) ? c : fallback;
  };
  return {
    theme,
    shape: pick(get('shape'), QR_SHAPES, base.shape),
    eyeFrame: pick(get('eyeFrame'), EYE_FRAMES, base.eyeFrame),
    eyeBall: pick(get('eyeBall'), EYE_BALLS, base.eyeBall),
    moduleColor: color('moduleColor', base.moduleColor),
    eyeFrameColor: color('eyeFrameColor', base.eyeFrameColor),
    eyeBallColor: color('eyeBallColor', base.eyeBallColor),
    gradient: get('gradient') === 'true' || get('gradient') === '1',
  };
}

export function designToParams(design: QRDesign): Record<string, string> {
  return { ...design, gradient: design.gradient ? '1' : '0' };
}

/* ---------- Shape paths (shared by canvas and SVG icons) ---------- */

type Corner = 'tl' | 'tr' | 'br' | 'bl';

function cornerRect(x: number, y: number, w: number, h: number, [tl, tr, br, bl]: number[]) {
  return (
    `M${x + tl},${y}H${x + w - tr}A${tr},${tr} 0 0 1 ${x + w},${y + tr}` +
    `V${y + h - br}A${br},${br} 0 0 1 ${x + w - br},${y + h}` +
    `H${x + bl}A${bl},${bl} 0 0 1 ${x},${y + h - bl}` +
    `V${y + tl}A${tl},${tl} 0 0 1 ${x + tl},${y}Z`
  );
}

// SVG path for a corner frame or center shape filling the square (x, y, s).
// `sharp` names the corner that points toward the middle of the code (used by leaf).
export function shapePath(kind: EyeFrameId | EyeBallId, x: number, y: number, s: number, sharp: Corner = 'br') {
  const mx = x + s / 2;
  const my = y + s / 2;
  switch (kind) {
    case 'rounded':
      return cornerRect(x, y, s, s, [s * 0.3, s * 0.3, s * 0.3, s * 0.3]);
    case 'circle':
      return cornerRect(x, y, s, s, [s / 2, s / 2, s / 2, s / 2]);
    case 'leaf': {
      const order: Corner[] = ['tl', 'tr', 'br', 'bl'];
      return cornerRect(x, y, s, s, order.map((c) => (c === sharp ? s * 0.08 : s / 2)));
    }
    case 'cut': {
      const c = s * 0.28;
      return `M${x + c},${y}H${x + s - c}L${x + s},${y + c}V${y + s - c}L${x + s - c},${y + s}H${x + c}L${x},${y + s - c}V${y + c}Z`;
    }
    case 'diamond': {
      const h = s * 0.64;
      return `M${mx},${my - h}L${mx + h},${my}L${mx},${my + h}L${mx - h},${my}Z`;
    }
    case 'star': {
      const h = s * 0.64;
      const p = s * 0.22;
      return (
        `M${mx},${my - h}Q${mx + p},${my - p} ${mx + h},${my}Q${mx + p},${my + p} ${mx},${my + h}` +
        `Q${mx - p},${my + p} ${mx - h},${my}Q${mx - p},${my - p} ${mx},${my - h}Z`
      );
    }
    default:
      return `M${x},${y}H${x + s}V${y + s}H${x}Z`;
  }
}

/* ---------- Rendering ---------- */

export interface RenderQROptions {
  value: string;
  size: number;
  design: QRDesign;
  logoSrc?: string;
  caption?: string;
}

const QUIET_ZONE = 3; // modules of padding, so downloaded PNGs scan on their own

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

type ModuleTest = (r: number, c: number) => boolean;

// Draws the data modules in the chosen pattern. Fill and stroke style are set by the caller.
function drawModules(
  ctx: CanvasRenderingContext2D,
  shape: QRShapeId,
  count: number,
  cell: number,
  offset: number,
  on: ModuleTest
) {
  const x = (c: number) => offset + c * cell;
  const y = (r: number) => offset + r * cell;
  const cx = (c: number) => x(c) + cell / 2;
  const cy = (r: number) => y(r) + cell / 2;
  const each = (fn: (r: number, c: number) => void) => {
    for (let r = 0; r < count; r++) for (let c = 0; c < count; c++) if (on(r, c)) fn(r, c);
  };

  // Joins each horizontal (or vertical) run of modules into one pill-shaped stroke
  const drawRuns = (vertical: boolean) => {
    const inset = cell * 0.1;
    const thick = cell - inset * 2;
    for (let a = 0; a < count; a++) {
      let b = 0;
      while (b < count) {
        const isOn = (i: number) => (vertical ? on(i, a) : on(a, i));
        if (!isOn(b)) {
          b++;
          continue;
        }
        const start = b;
        while (b < count && isOn(b)) b++;
        const len = (b - start) * cell - inset * 2;
        if (vertical) roundRect(ctx, x(a) + inset, y(start) + inset, thick, len, thick / 2);
        else roundRect(ctx, x(start) + inset, y(a) + inset, len, thick, thick / 2);
        ctx.fill();
      }
    }
  };

  switch (shape) {
    case 'lines':
      return drawRuns(false);

    case 'bars':
      return drawRuns(true);

    case 'liquid':
      // Every module is a full-size disc; neighbors are bridged so clusters melt together
      return each((r, c) => {
        ctx.beginPath();
        ctx.arc(cx(c), cy(r), cell / 2, 0, Math.PI * 2);
        ctx.fill();
        if (on(r, c + 1)) ctx.fillRect(cx(c), y(r), cell, cell);
        if (on(r + 1, c)) ctx.fillRect(x(c), cy(r), cell, cell);
        if (on(r, c + 1) && on(r + 1, c) && on(r + 1, c + 1)) ctx.fillRect(cx(c), cy(r), cell, cell);
      });

    case 'network':
      // Nodes joined to their right and lower neighbors by round-capped strokes.
      // Thick enough that every module still reads as dark to a scanner.
      ctx.lineCap = 'round';
      ctx.lineWidth = cell * 0.5;
      ctx.beginPath();
      each((r, c) => {
        if (on(r, c + 1)) {
          ctx.moveTo(cx(c), cy(r));
          ctx.lineTo(cx(c + 1), cy(r));
        }
        if (on(r + 1, c)) {
          ctx.moveTo(cx(c), cy(r));
          ctx.lineTo(cx(c), cy(r + 1));
        }
      });
      ctx.stroke();
      return each((r, c) => {
        ctx.beginPath();
        ctx.arc(cx(c), cy(r), cell * 0.42, 0, Math.PI * 2);
        ctx.fill();
      });

    case 'sparkle':
      // Fat four-point stars, echoing the UP icon set
      return each((r, c) => ctx.fill(new Path2D(shapePath('star', x(c), y(r), cell * 1.05))));

    case 'dots':
      return each((r, c) => {
        ctx.beginPath();
        ctx.arc(cx(c), cy(r), cell * 0.42, 0, Math.PI * 2);
        ctx.fill();
      });

    case 'rounded':
      return each((r, c) => {
        roundRect(ctx, x(c) + cell * 0.06, y(r) + cell * 0.06, cell * 0.88, cell * 0.88, cell * 0.32);
        ctx.fill();
      });

    default:
      return each((r, c) => ctx.fillRect(x(c), y(r), cell + 0.5, cell + 0.5));
  }
}

// Height the caption strip adds below the code, as a share of the QR size
export function captionHeight(size: number, caption?: string) {
  return caption ? Math.round(size * 0.16) : 0;
}

export async function renderStyledQR(canvas: HTMLCanvasElement, opts: RenderQROptions) {
  const { value, size, design, logoSrc, caption } = opts;
  const theme = getTheme(design.theme);
  const bg = hex(theme.background);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const extra = captionHeight(size, caption);
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 3) : 1;
  canvas.width = size * dpr;
  canvas.height = (size + extra) * dpr;
  // Height follows the bitmap's aspect ratio, so max-width scaling never distorts the code
  canvas.style.width = `${size}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const qr = QRCode.create(value, { errorCorrectionLevel: 'H' });
  const modules = qr.modules;
  const count = modules.size;
  const cell = size / (count + QUIET_ZONE * 2);
  const offset = QUIET_ZONE * cell;
  const span = count * cell;

  // Background card (rounded, matching radius-xl at 280px scale)
  ctx.clearRect(0, 0, size, size + extra);
  ctx.fillStyle = bg;
  roundRect(ctx, 0, 0, size, size + extra, size * 0.07);
  ctx.fill();

  // Center badge area to keep clear for the logo
  const center = offset + span / 2;
  const badgeRadius = span * 0.13;

  const isEye = (r: number, c: number) =>
    (r < 7 && c < 7) || (r < 7 && c >= count - 7) || (r >= count - 7 && c < 7);

  // "on" means a dark module that isn't part of an eye or under the logo badge
  const on = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= count || c >= count) return false;
    if (!modules.get(r, c) || isEye(r, c)) return false;
    if (logoSrc) {
      const d = Math.hypot(offset + (c + 0.5) * cell - center, offset + (r + 0.5) * cell - center);
      if (d < badgeRadius + cell) return false;
    }
    return true;
  };

  let paint: string | CanvasGradient = hex(design.moduleColor);
  if (design.gradient && design.moduleColor !== design.eyeBallColor) {
    const g = ctx.createLinearGradient(offset, offset, offset + span, offset + span);
    g.addColorStop(0, hex(design.moduleColor));
    g.addColorStop(1, hex(design.eyeBallColor));
    paint = g;
  }
  ctx.fillStyle = paint;
  ctx.strokeStyle = paint;
  drawModules(ctx, design.shape, count, cell, offset, on);

  // Finder patterns ("eyes"): frame with a background-colored hole, then the center
  const drawEye = (r: number, c: number, sharp: Corner) => {
    const x = offset + c * cell;
    const y = offset + r * cell;
    ctx.fillStyle = hex(design.eyeFrameColor);
    ctx.fill(new Path2D(shapePath(design.eyeFrame, x, y, cell * 7, sharp)));
    ctx.fillStyle = bg;
    ctx.fill(new Path2D(shapePath(design.eyeFrame, x + cell, y + cell, cell * 5, sharp)));
    ctx.fillStyle = hex(design.eyeBallColor);
    ctx.fill(new Path2D(shapePath(design.eyeBall, x + cell * 2, y + cell * 2, cell * 3, sharp)));
  };
  drawEye(0, 0, 'br');
  drawEye(0, count - 7, 'bl');
  drawEye(count - 7, 0, 'tr');

  // Logo badge
  if (logoSrc) {
    ctx.fillStyle = UP.navy;
    ctx.beginPath();
    ctx.arc(center, center, badgeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = hex(theme.badgeRing);
    ctx.lineWidth = Math.max(2, cell * 0.5);
    ctx.beginPath();
    ctx.arc(center, center, badgeRadius - ctx.lineWidth / 2, 0, Math.PI * 2);
    ctx.stroke();

    const logo = await loadImage(logoSrc);
    if (logo) {
      const s = badgeRadius * 1.5;
      ctx.drawImage(logo, center - s / 2, center - s / 2, s, s);
    }
  }

  // Caption strip in Unbounded (display face)
  if (caption) {
    const fontSize = Math.round(size * 0.055);
    const font = `700 ${fontSize}px Unbounded, sans-serif`;
    try {
      await document.fonts.load(font);
    } catch {
      // fall back to sans-serif
    }
    ctx.fillStyle = hex(theme.caption);
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(caption.toUpperCase(), size / 2, size + extra / 2 - cell);
  }
}
