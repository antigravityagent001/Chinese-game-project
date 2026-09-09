import React, { useState } from 'react';
import { Compass, Sparkles, Play, Shield } from 'lucide-react';
import { CharacterId, Difficulty, GameState } from '../types';
import { CHARACTERS } from '../utils/storage';
import { sound } from '../utils/audio';

interface StartScreenProps {
  onStartGame: (characterId: CharacterId, difficulty: Difficulty) => void;
  savedGame: GameState | null;
  onResumeGame: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartGame,
  savedGame,
  onResumeGame,
}) => {
  const [selectedChar, setSelectedChar] = useState<CharacterId>('fox');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const hasSave = savedGame && (savedGame.xp > 0 || savedGame.collectedCrystals.length > 0);

  const characterKeys: CharacterId[] = ['fox', 'panda', 'bunny'];

  const handleStart = () => {
    sound.playClick();
    sound.playCrystalCollect();
    onStartGame(selectedChar, selectedDifficulty);
  };

  const handleResume = () => {
    sound.playClick();
    sound.playDoorOpen();
    onResumeGame();
  };

  return (
    <div className="relative min-h-screen w-full bg-[#061c16] text-[#f8fafc] flex items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Immersive UI Radial Gradient Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(20,184,166,0.18)_0%,_transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-[#061c16] via-[#061c16]/80 to-transparent pointer-events-none" />

      {/* Floating Ambient Runes & Island Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-12 left-1/4 w-72 h-72 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-12 right-1/4 w-96 h-96 rounded-full bg-cyan-500/5 blur-3xl" />

        <div className="absolute top-16 left-12 text-4xl opacity-20 animate-pulse">🌴</div>
        <div className="absolute top-24 right-16 text-4xl opacity-20 animate-pulse delay-700">✨</div>
        <div className="absolute bottom-12 left-16 text-4xl opacity-20">🏝️</div>
        <div className="absolute bottom-16 right-20 text-4xl opacity-20">🗝️</div>
      </div>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-2xl bg-black/60 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(6,28,22,0.9)] border border-emerald-500/25 p-6 sm:p-8 text-[#f8fafc]">
        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-semibold mb-2 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
            <Sparkles size={14} className="text-emerald-400" />
            <span className="uppercase tracking-widest text-[11px]">Chinese Language Learning RPG</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight drop-shadow-sm flex items-center justify-center gap-2.5">
            <span className="text-3xl sm:text-4xl">🌴</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              快乐冒险岛
            </span>
          </h1>
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80 font-medium mt-1">
            Happy Adventure Island
          </p>
          <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto mt-2 leading-relaxed">
            Journey across 5 mysterious island areas. Uncover <span className="font-bold text-emerald-300">10 Magic Word Crystals</span> by mastering core Chinese vocabulary to unlock the ancient <span className="font-bold text-cyan-300">快乐宝藏 (Happy Treasure)</span>!
          </p>
        </div>

        {/* Character Selection */}
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400/80 font-bold mb-2.5 flex items-center gap-1.5">
            <Compass size={16} className="text-emerald-400" />
            <span>Choose Your Adventurer • 选择角色</span>
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {characterKeys.map((key) => {
              const char = CHARACTERS[key];
              const isSelected = selectedChar === key;
              return (
                <button
                  key={key}
                  id={`char-select-${key}`}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedChar(key);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 text-center flex flex-col items-center cursor-pointer ${
                    isSelected
                      ? 'border-emerald-400 bg-emerald-950/60 ring-2 ring-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-102'
                      : 'border-white/10 hover:border-emerald-500/40 bg-white/5 hover:bg-emerald-500/10 text-white/80'
                  }`}
                >
                  <span className="text-4xl sm:text-5xl mb-1.5 filter drop-shadow-[0_0_12px_rgba(255,255,255,0.2)] transition-transform duration-200 group-hover:scale-110">
                    {char.avatar}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-white">
                    {char.name}
                  </span>
                  <span className="text-[10px] text-white/50 line-clamp-1 mt-0.5">
                    {char.title}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-white/60 italic mt-2 text-center bg-white/5 py-1.5 px-3 rounded-xl border border-white/10">
            "{CHARACTERS[selectedChar].desc}"
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="mb-6">
          <h2 className="text-xs uppercase tracking-widest text-emerald-400/80 font-bold mb-2.5 flex items-center gap-1.5">
            <Shield size={16} className="text-emerald-400" />
            <span>Select Difficulty • 难度等级</span>
          </h2>
          <div className="grid grid-cols-3 gap-2.5">
            <button
              type="button"
              id="diff-easy"
              onClick={() => {
                sound.playClick();
                setSelectedDifficulty('easy');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedDifficulty === 'easy'
                  ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold ring-2 ring-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-emerald-500/30 hover:bg-white/10'
              }`}
            >
              <div className="text-xs font-bold text-emerald-300">🟢 简单 Easy</div>
              <div className="text-[10px] text-white/50 mt-0.5">Pinyin + English hints</div>
            </button>

            <button
              type="button"
              id="diff-normal"
              onClick={() => {
                sound.playClick();
                setSelectedDifficulty('normal');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedDifficulty === 'normal'
                  ? 'bg-amber-950/40 border-amber-400 text-amber-200 font-bold ring-2 ring-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-amber-500/30 hover:bg-white/10'
              }`}
            >
              <div className="text-xs font-bold text-amber-300">🟡 普通 Normal</div>
              <div className="text-[10px] text-white/50 mt-0.5">Chinese focus + tiles</div>
            </button>

            <button
              type="button"
              id="diff-master"
              onClick={() => {
                sound.playClick();
                setSelectedDifficulty('master');
              }}
              className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                selectedDifficulty === 'master'
                  ? 'bg-rose-950/40 border-rose-400 text-rose-200 font-bold ring-2 ring-rose-400/30 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                  : 'bg-white/5 border-white/10 text-white/70 hover:border-rose-500/30 hover:bg-white/10'
              }`}
            >
              <div className="text-xs font-bold text-rose-300">🔴 快乐大师 Master</div>
              <div className="text-[10px] text-white/50 mt-0.5">Full immersion challenge</div>
            </button>
          </div>
        </div>

        {/* 10 Target Words Preview Banner */}
        <div className="mb-6 p-3.5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl">
          <div className="text-[10px] uppercase tracking-widest font-mono text-emerald-400/80 mb-2 flex items-center justify-between">
            <span>Core Quest Words (10 Words)</span>
            <span className="text-white/40">100% Genuine Vocabulary</span>
          </div>
          <div className="flex flex-wrap gap-1.5 items-center justify-center text-xs font-bold">
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">🔑 打开</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">👕 穿</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">🧪 试试</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">👀 看起来</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">🌙 有点儿</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">⭐ 正</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">💎 合身</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">❤️ 爱</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">🎁 祝</span>
            <span className="px-2 py-0.5 bg-white/5 border border-emerald-500/30 rounded-md text-emerald-200">☀️ 快乐</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {hasSave && (
            <button
              id="btn-resume-adventure"
              type="button"
              onClick={handleResume}
              className="flex-1 py-3 px-5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/20 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer active:scale-98 transition-all"
            >
              <Play size={18} fill="currentColor" />
              <span>Continue Adventure ({savedGame.collectedCrystals.length}/10 Crystals)</span>
            </button>
          )}

          <button
            id="btn-start-adventure"
            type="button"
            onClick={handleStart}
            className="flex-1 py-3 px-5 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-[#061c16] font-black rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer active:scale-98 transition-all"
          >
            <Sparkles size={18} />
            <span>{hasSave ? 'New Adventure' : 'Start Adventure • 启程'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
