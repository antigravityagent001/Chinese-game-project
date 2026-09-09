import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

interface AudioButtonProps {
  text: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  className = '',
  size = 'md',
  label,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;

    setIsPlaying(true);
    sound.speakChinese(text, () => {
      setIsPlaying(false);
    });
  };

  const sizeClasses = {
    sm: 'p-1 text-xs',
    md: 'p-1.5 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
  };

  return (
    <button
      type="button"
      id={`audio-btn-${text.slice(0, 8)}`}
      onClick={handleClick}
      aria-label={`Listen to pronunciation of ${text}`}
      className={`inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-200 cursor-pointer ${
        isPlaying
          ? 'bg-emerald-400 text-[#061c16] scale-105 shadow-[0_0_12px_rgba(52,211,153,0.8)] animate-pulse font-bold'
          : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 hover:border-emerald-400/60 active:scale-95 shadow-[0_0_8px_rgba(16,185,129,0.15)]'
      } ${sizeClasses[size]} ${className}`}
      title="Click to listen to Chinese pronunciation"
    >
      <Volume2
        size={iconSizes[size]}
        className={isPlaying ? 'animate-bounce text-[#061c16]' : 'text-emerald-400'}
      />
      {label && <span className="font-semibold select-none">{label}</span>}
    </button>
  );
};
