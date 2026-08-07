import React, { useState } from 'react';

interface BadgeIconProps {
  badgeId?: string;
  badgeName?: string;
  spriteUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  earned?: boolean;
  className?: string;
}

export const BadgeIcon: React.FC<BadgeIconProps> = ({
  badgeId = '',
  badgeName = '',
  spriteUrl,
  size = 'md',
  earned = true,
  className = ''
}) => {
  const [imgError, setImgError] = useState(false);

  // Determine numeric pixel size
  let pxSize = 24;
  if (typeof size === 'number') {
    pxSize = size;
  } else {
    switch (size) {
      case 'xs': pxSize = 16; break;
      case 'sm': pxSize = 20; break;
      case 'md': pxSize = 28; break;
      case 'lg': pxSize = 40; break;
      case 'xl': pxSize = 56; break;
    }
  }

  // Normalize badge ID / name
  const idLower = (badgeId || badgeName).toLowerCase();

  // If sprite URL provided and no load error, render img
  if (spriteUrl && !imgError) {
    return (
      <img
        src={spriteUrl}
        alt={badgeName || 'Medalla'}
        onError={() => setImgError(true)}
        className={`object-contain [image-rendering:pixelated] transition-all filter drop-shadow ${
          earned ? 'brightness-105' : 'grayscale opacity-35'
        } ${className}`}
        style={{ width: `${pxSize}px`, height: `${pxSize}px` }}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback SVG Badge vectors tailored to exact Kanto designs
  const svgContent = getKantoBadgeSvg(idLower, earned);

  return (
    <div
      className={`inline-flex items-center justify-center shrink-0 ${
        earned ? 'filter drop-shadow-sm' : 'grayscale opacity-40'
      } ${className}`}
      style={{ width: `${pxSize}px`, height: `${pxSize}px` }}
      title={badgeName}
    >
      {svgContent}
    </div>
  );
};

function getKantoBadgeSvg(idStr: string, earned: boolean): React.ReactNode {
  // 1. Boulder Badge (Roca) - Octagon grey stone
  if (idStr.includes('roca') || idStr.includes('boulder')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <polygon points="10,2 22,2 30,10 30,22 22,30 10,30 2,22 2,10" fill="#9CA3AF" stroke="#1F2937" strokeWidth="2" />
        <polygon points="12,5 20,5 27,12 27,20 20,27 12,27 5,20 5,12" fill="#D1D5DB" />
        <polygon points="13,7 19,7 25,13 25,19 19,25 13,25 7,19 7,13" fill="#E5E7EB" />
        <polygon points="10,2 12,5 20,5 22,2" fill="#F3F4F6" />
      </svg>
    );
  }

  // 2. Cascade Badge (Cascada) - Sky blue water drop
  if (idStr.includes('cascada') || idStr.includes('cascade')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path d="M16 2 C16 2, 4 14, 4 21 C4 27 9 30 16 30 C23 30 28 27 28 21 C28 14, 16 2, 16 2 Z" fill="#38BDF8" stroke="#0F172A" strokeWidth="2" />
        <path d="M16 5 C16 5, 7 15, 7 21 C7 25 11 27.5 16 27.5 C21 27.5 25 25 25 21 C25 15, 16 5, 16 5 Z" fill="#0EA5E9" />
        <path d="M12 14 C12 14, 9 18, 9 21 C9 23, 10.5 24, 12 24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  // 3. Thunder Badge (Trueno) - Orange/Yellow sunburst ray star
  if (idStr.includes('trueno') || idStr.includes('thunder')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        {/* Rays */}
        <path d="M16 1 L19 11 L29 6 L22 14 L31 19 L20 20 L24 30 L16 22 L8 30 L12 20 L1 19 L10 14 L3 6 L13 11 Z" fill="#F59E0B" stroke="#1F2937" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="8" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="5" fill="#FEF08A" />
      </svg>
    );
  }

  // 4. Rainbow Badge (Arcoíris) - Flower with multi-color petals
  if (idStr.includes('arcoiris') || idStr.includes('rainbow')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="6" r="4.5" fill="#EF4444" stroke="#1F2937" strokeWidth="1" />
        <circle cx="23" cy="9" r="4.5" fill="#F97316" stroke="#1F2937" strokeWidth="1" />
        <circle cx="26" cy="16" r="4.5" fill="#FACC15" stroke="#1F2937" strokeWidth="1" />
        <circle cx="23" cy="23" r="4.5" fill="#22C55E" stroke="#1F2937" strokeWidth="1" />
        <circle cx="16" cy="26" r="4.5" fill="#06B6D4" stroke="#1F2937" strokeWidth="1" />
        <circle cx="9" cy="23" r="4.5" fill="#3B82F6" stroke="#1F2937" strokeWidth="1" />
        <circle cx="6" cy="16" r="4.5" fill="#8B5CF6" stroke="#1F2937" strokeWidth="1" />
        <circle cx="9" cy="9" r="4.5" fill="#EC4899" stroke="#1F2937" strokeWidth="1" />
        <circle cx="16" cy="16" r="6" fill="#FFFFFF" stroke="#1F2937" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="3" fill="#38BDF8" />
      </svg>
    );
  }

  // 5. Soul Badge (Alma) - Purple drop / heart shape
  if (idStr.includes('alma') || idStr.includes('soul')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path d="M16 3 C10 10, 3 16, 3 22 C3 27.5 8.5 30 16 30 C23.5 30 29 27.5 29 22 C29 16, 22 10, 16 3 Z" fill="#A855F7" stroke="#1F2937" strokeWidth="2" />
        <path d="M16 7 C12 13, 6 18, 6 22 C6 26 10 28 16 28 C22 28 26 26 26 22 C26 18, 20 13, 16 7 Z" fill="#C084FC" />
        <path d="M16 12 C14 16, 10 19, 10 22 C10 24 12.5 25.5 16 25.5 C19.5 25.5 22 24 22 22 C22 19, 18 16, 16 12 Z" fill="#F0ABFC" />
      </svg>
    );
  }

  // 6. Marsh Badge (Pantano) - Gold double concentric circles
  if (idStr.includes('pantano') || idStr.includes('marsh')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <circle cx="16" cy="16" r="14" fill="#EAB308" stroke="#1F2937" strokeWidth="2" />
        <circle cx="16" cy="16" r="10" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
        <circle cx="16" cy="16" r="5" fill="#EAB308" stroke="#1F2937" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="2" fill="#FFFFFF" />
      </svg>
    );
  }

  // 7. Volcano Badge (Volcán) - Red flame shape
  if (idStr.includes('volcan') || idStr.includes('volcano')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path d="M16 2 C16 2, 22 8, 22 13 C22 15, 27 18, 27 23 C27 28, 22 30, 16 30 C10 30, 5 28, 5 23 C5 18, 10 15, 10 13 C10 8, 16 2, 16 2 Z" fill="#EF4444" stroke="#1F2937" strokeWidth="2" />
        <path d="M16 6 C16 6, 20 11, 20 15 C20 17, 24 19.5, 24 23.5 C24 27, 20 28.5, 16 28.5 C12 28.5, 8 27, 8 23.5 C8 19.5, 12 17, 12 15 C12 11, 16 6, 16 6 Z" fill="#F97316" />
        <path d="M16 12 C16 12, 18 15, 18 18 C18 19.5, 20 21, 20 23.5 C20 25.5, 18 26.5, 16 26.5 C14 26.5, 12 25.5, 12 23.5 C12 21, 14 19.5, 14 18 C14 15, 16 12, 16 12 Z" fill="#FACC15" />
      </svg>
    );
  }

  // 8. Earth Badge (Tierra) - Green plant / feather
  if (idStr.includes('tierra') || idStr.includes('earth')) {
    return (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <path d="M16 2 C8 10, 4 20, 6 29 L16 25 L26 29 C28 20, 24 10, 16 2 Z" fill="#22C55E" stroke="#1F2937" strokeWidth="2" />
        <path d="M16 6 C10 13, 7 20, 8.5 26 L16 23 L23.5 26 C25 20, 22 13, 16 6 Z" fill="#4ADE80" />
        <line x1="16" y1="2" x2="16" y2="28" stroke="#15803D" strokeWidth="2" />
        <line x1="16" y1="10" x2="21" y2="14" stroke="#15803D" strokeWidth="1.5" />
        <line x1="16" y1="10" x2="11" y2="14" stroke="#15803D" strokeWidth="1.5" />
        <line x1="16" y1="17" x2="22" y2="21" stroke="#15803D" strokeWidth="1.5" />
        <line x1="16" y1="17" x2="10" y2="21" stroke="#15803D" strokeWidth="1.5" />
      </svg>
    );
  }

  // 9. Master / Crown Badge
  return (
    <svg viewBox="0 0 32 32" className="w-full h-full">
      <path d="M4 24 L2 10 L10 16 L16 6 L22 16 L30 10 L28 24 Z" fill="#FACC15" stroke="#1F2937" strokeWidth="2" />
      <rect x="4" y="24" width="24" height="5" rx="1" fill="#EAB308" stroke="#1F2937" strokeWidth="1.5" />
      <circle cx="16" cy="18" r="2.5" fill="#EF4444" />
      <circle cx="10" cy="20" r="1.5" fill="#3B82F6" />
      <circle cx="22" cy="20" r="1.5" fill="#22C55E" />
    </svg>
  );
}
