import React from 'react';
import { Backpack, Map, BookOpen, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { GameState, AreaId } from '../types';
import { AREAS } from '../data/areas';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { CHARACTERS, getRankByXP } from '../utils/storage';
import { sound } from '../utils/audio';

interface NavbarProps {
  state: GameState;
  onOpenInventory: () => void;
  onOpenMap: () => void;
  onOpenVocab: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  state,
  onOpenInventory,
  onOpenMap,
  onOpenVocab,
  onOpenSettings,
}) => {
  const currentAreaInfo = AREAS[state.currentArea];
  const char = CHARACTERS[state.characterId];
  const rank = getRankByXP(state.xp);
  const xpCurrentLevel = state.xp - rank.minXP;
  const xpTargetLevel = rank.nextXP - rank.minXP;
  const xpPercent = Math.min(100, Math.max(0, (xpCurrentLevel / xpTargetLevel) * 100));

  return (
    <header className="w-full bg-black/50 backdrop-blur-xl border-b border-emerald-500/20 shadow-[0_4px_25px_rgba(0,0,0,0.5)] px-3 sm:px-6 py-2.5 select-none sticky top-0 z-30 text-[#f8fafc]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Left Section: Character info & Area */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3.5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-2xl shadow-[0_0_12px_rgba(16,185,129,0.3)]">
                {char?.avatar || '🦊'}
              </div>
              <span className="absolute -bottom-1 -right-1 text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-black font-black px-1.5 py-0.2 rounded-md shadow-xs border border-emerald-300/40">
                L{rank.level}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  {state.characterName}
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                  {rank.title}
                </span>
              </div>

              {/* Current Area Badge */}
              <div className="flex items-center gap-1 text-xs text-emerald-400/90 font-medium mt-0.5">
                <span>{currentAreaInfo?.icon}</span>
                <span>{currentAreaInfo?.nameCn}</span>
                <span className="text-white/40 text-[11px]">({currentAreaInfo?.nameEn})</span>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="hidden sm:flex flex-col min-w-[130px] max-w-[170px]">
            <div className="flex justify-between text-[10px] font-mono uppercase text-emerald-400/80 font-bold mb-1">
              <span>XP {state.xp}</span>
              <span>{Math.round(xpPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-emerald-500/20">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.6)] transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Middle Section: 10 Magic Crystals Quick Tracker */}
        <div className="flex items-center gap-2 bg-emerald-950/40 px-3 py-1.5 rounded-2xl border border-emerald-500/20 shadow-inner">
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/70 hidden lg:inline mr-0.5">
            Crystals ({state.collectedCrystals.length}/10):
          </span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {VOCABULARY_LIST.map((word) => {
              const isCollected = state.collectedCrystals.includes(word.id);
              return (
                <div
                  key={word.id}
                  id={`crystal-socket-${word.id}`}
                  title={`${word.crystalName}: ${word.hanzi} (${word.english})`}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-xl flex items-center justify-center text-xs transition-all duration-300 ${
                    isCollected
                      ? 'bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 border border-emerald-400/60 shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-105 text-emerald-200'
                      : 'bg-white/5 border border-white/10 opacity-30 grayscale text-white/40'
                  }`}
                >
                  <span className="text-sm">{word.crystalIcon}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section: Interactive Tool Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Backpack / Inventory */}
          <button
            type="button"
            id="nav-btn-inventory"
            onClick={() => {
              sound.playClick();
              onOpenInventory();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-white/90 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-xs active:scale-95"
          >
            <Backpack size={16} className="text-emerald-400" />
            <span>背包</span>
            <span className="text-[10px] font-semibold text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-1.5 rounded-full">
              {state.clothingInventory.length}
            </span>
          </button>

          {/* World Map */}
          <button
            type="button"
            id="nav-btn-map"
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-white/90 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/40 font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-xs active:scale-95"
          >
            <Map size={16} className="text-cyan-400" />
            <span>地图</span>
          </button>

          {/* Vocabulary Book */}
          <button
            type="button"
            id="nav-btn-vocab"
            onClick={() => {
              sound.playClick();
              onOpenVocab();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 text-white/90 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 font-bold text-xs sm:text-sm cursor-pointer transition-all shadow-xs active:scale-95"
          >
            <BookOpen size={16} className="text-emerald-400" />
            <span>词汇</span>
          </button>

          {/* Settings */}
          <button
            type="button"
            id="nav-btn-settings"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            aria-label="Game Settings"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 cursor-pointer transition-all active:scale-95"
          >
            <SettingsIcon size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
