import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, BookOpen, Compass, Award, Volume2 } from 'lucide-react';
import { GameState } from '../types';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { AudioButton } from './AudioButton';
import { sound } from '../utils/audio';

interface VictoryScreenProps {
  state: GameState;
  onPlayAgain: () => void;
  onReviewVocab: () => void;
  onExploreIsland: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({
  state,
  onPlayAgain,
  onReviewVocab,
  onExploreIsland,
}) => {
  useEffect(() => {
    sound.playVictory();

    // Trigger colorful confetti shower
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        particleCount,
        spread: 360,
        startVelocity: 30,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#10b981', '#06b6d4', '#34d399', '#f59e0b', '#a78bfa'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#061c16]/90 backdrop-blur-md overflow-y-auto select-none">
      {/* Radial glow background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,_rgba(20,184,166,0.25)_0%,_transparent_70%)] pointer-events-none" />

      <div className="relative w-full max-w-2xl bg-black/75 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(6,28,22,0.95)] border border-emerald-500/30 p-6 sm:p-8 text-center text-[#f8fafc] my-auto animate-in zoom-in-95 duration-300">
        {/* Floating Glowing Sparkles Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono font-bold text-xs sm:text-sm mb-3 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
          <Sparkles size={16} className="text-emerald-400" />
          <span>Island Legend Unlocked!</span>
        </div>

        {/* Animated Treasure Chest */}
        <div className="relative my-2 flex justify-center">
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-emerald-950/60 border-2 border-emerald-400/80 flex items-center justify-center text-7xl sm:text-8xl shadow-[0_0_35px_rgba(16,185,129,0.5)] animate-pulse">
            👑
          </div>
          <span className="absolute -bottom-2 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black text-xs px-3.5 py-1 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.6)]">
            💎 快乐宝藏
          </span>
        </div>

        {/* Victory Headlines */}
        <h1 className="text-4xl sm:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 tracking-tight mt-4">
          🎉 恭喜！
        </h1>
        <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
          你找到了快乐宝藏！
        </h2>
        <p className="text-sm sm:text-base font-bold text-emerald-400 mt-1">
          You collected 10/10 Magic Word Crystals!
        </p>

        {/* Player Stats Bar */}
        <div className="grid grid-cols-3 gap-2 my-5 p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl">
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono font-bold text-white/50">XP Earned</div>
            <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">{state.xp}</div>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="text-[10px] uppercase font-mono font-bold text-white/50">Crystals</div>
            <div className="text-base sm:text-lg font-black text-cyan-300 font-mono">10 / 10</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase font-mono font-bold text-white/50">Adventurer</div>
            <div className="text-base sm:text-lg font-black text-emerald-400">快乐大师</div>
          </div>
        </div>

        {/* 10 Magic Vocabulary Showcase Grid */}
        <div className="mb-6 text-left">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400/80 mb-2 flex items-center justify-between">
            <span>The 10 Island Words Mastered:</span>
            <span className="text-emerald-300 font-bold">100% Mastery</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {VOCABULARY_LIST.map((word) => (
              <div
                key={word.id}
                className="p-2.5 bg-white/5 rounded-xl border border-emerald-500/20 hover:border-emerald-500/50 shadow-xs flex flex-col items-center text-center transition-colors"
              >
                <span className="text-xl mb-0.5">{word.crystalIcon}</span>
                <span className="font-black text-sm text-white">{word.hanzi}</span>
                <span className="text-[10px] font-semibold text-emerald-400">{word.pinyin}</span>
                <span className="text-[10px] text-white/50 truncate w-full">
                  {word.english}
                </span>
                <div className="mt-1">
                  <AudioButton text={word.hanzi} size="sm" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            id="victory-btn-play-again"
            onClick={() => {
              sound.playClick();
              onPlayAgain();
            }}
            className="py-3 px-4 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-black text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <RotateCcw size={16} />
            <span>Play Again (再玩一次)</span>
          </button>

          <button
            type="button"
            id="victory-btn-review"
            onClick={() => {
              sound.playClick();
              onReviewVocab();
            }}
            className="py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-emerald-500/30 text-emerald-300 font-black text-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <BookOpen size={16} />
            <span>Review Vocabulary (复习)</span>
          </button>

          <button
            type="button"
            id="victory-btn-explore"
            onClick={() => {
              sound.playClick();
              onExploreIsland();
            }}
            className="py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black font-black text-sm shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Compass size={16} />
            <span>Explore Island (继续探索)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
