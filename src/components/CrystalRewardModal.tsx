import React, { useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { VocabularyWord } from '../types';
import { AudioButton } from './AudioButton';
import { sound } from '../utils/audio';

interface CrystalRewardModalProps {
  word: VocabularyWord;
  xpEarned: number;
  totalCollected: number;
  onClose: () => void;
}

export const CrystalRewardModal: React.FC<CrystalRewardModalProps> = ({
  word,
  xpEarned,
  totalCollected,
  onClose,
}) => {
  useEffect(() => {
    sound.playCrystalCollect();
    // Auto-pronounce target word
    setTimeout(() => {
      sound.speakChinese(word.hanzi);
    }, 400);
  }, [word]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#061c16]/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(6,28,22,0.95)] border border-emerald-500/30 overflow-hidden flex flex-col items-center p-6 sm:p-7 text-[#f8fafc] text-center animate-in zoom-in-95 duration-250">
        {/* Immersive glow backdrop */}
        <div className="absolute top-0 inset-x-0 h-44 bg-[radial-gradient(circle_at_50%_0%,_rgba(20,184,166,0.3)_0%,_transparent_75%)] pointer-events-none" />

        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold mb-3 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <Sparkles size={14} className="text-emerald-400" />
          <span>New Magic Word Crystal Unlocked!</span>
        </div>

        {/* Crystal Giant Icon */}
        <div className="relative my-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-emerald-950/60 border-2 border-emerald-400/80 flex items-center justify-center text-6xl sm:text-7xl shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-bounce duration-1000">
            {word.crystalIcon}
          </div>
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black text-xs px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)]">
            +{xpEarned} XP
          </span>
        </div>

        {/* Word Display */}
        <div className="mt-2 mb-4">
          <h2 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 tracking-wide">
            {word.hanzi}
          </h2>
          <p className="text-base sm:text-lg font-bold text-emerald-300 mt-1">
            {word.pinyin}
          </p>
          <p className="text-sm text-white/70 mt-0.5">
            "{word.english}"
          </p>
          <div className="mt-2.5">
            <AudioButton text={word.hanzi} size="lg" label="Listen Pronunciation" />
          </div>
        </div>

        {/* Example Sentence Card */}
        <div className="w-full bg-emerald-950/40 border border-emerald-500/25 rounded-2xl p-3.5 mb-5 text-left shadow-inner">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400/80 mb-1">
            Example Sentence • 例句
          </div>
          <div className="text-base font-black text-white flex items-center justify-between">
            <span>{word.exampleChinese}</span>
            <AudioButton text={word.exampleChinese} size="sm" />
          </div>
          <div className="text-xs font-semibold text-emerald-400 mt-0.5">
            {word.examplePinyin}
          </div>
          <div className="text-xs text-white/60 italic mt-0.5">
            "{word.exampleEnglish}"
          </div>
        </div>

        {/* Progress status */}
        <div className="text-xs font-medium text-white/60 mb-5">
          Island Crystals Collected:{' '}
          <span className="text-emerald-300 font-bold font-mono">{totalCollected} / 10</span>
        </div>

        {/* Continue Button */}
        <button
          type="button"
          id="crystal-reward-continue-btn"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black font-black text-base shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <span>Awesome! Continue Adventure (继续探险)</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
