import React, { useState } from 'react';
import { Settings as SettingsIcon, RotateCcw, X, AlertTriangle } from 'lucide-react';
import { Difficulty, GameSettings } from '../types';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg bg-[#061c16]/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(6,28,22,0.95)] border border-emerald-500/30 overflow-hidden flex flex-col p-6 text-[#f8fafc]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <SettingsIcon size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                游戏设置 (Game Settings)
              </h3>
              <p className="text-xs text-white/50">
                Customize learning difficulty, audio, and language display
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 cursor-pointer transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Difficulty setting */}
          <div>
            <label className="text-xs font-mono font-bold text-emerald-400/80 uppercase tracking-wider block mb-2">
              难度等级 (Difficulty Level)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['easy', 'normal', 'master'] as Difficulty[]).map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    onUpdateSettings({ difficulty: d });
                  }}
                  className={`py-2.5 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    settings.difficulty === d
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/30 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {d === 'easy' && '🟢 简单 Easy'}
                  {d === 'normal' && '🟡 普通 Normal'}
                  {d === 'master' && '🔴 快乐大师 Master'}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-white/10">
            {/* Pinyin Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">
                  显示拼音 (Show Pinyin)
                </div>
                <div className="text-xs text-white/50">
                  Displays phonetic pronunciation guides above characters
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showPinyin}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ showPinyin: e.target.checked });
                }}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* English Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">
                  显示英文翻译 (Show English Hints)
                </div>
                <div className="text-xs text-white/50">
                  Shows English meanings beside dialogue and options
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.showEnglish}
                onChange={(e) => {
                  sound.playClick();
                  onUpdateSettings({ showEnglish: e.target.checked });
                }}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Sound FX Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-white">
                  音效开关 (Sound Effects)
                </div>
                <div className="text-xs text-white/50">
                  Play musical chimes and game sound feedback
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => {
                  const val = e.target.checked;
                  sound.soundEnabled = val;
                  onUpdateSettings({ soundEnabled: val });
                }}
                className="w-5 h-5 accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-3 border-t border-white/10">
            {!showConfirmReset ? (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-950/30 hover:bg-rose-900/40 text-rose-300 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw size={14} />
                <span>重置游戏进度 (Reset All Progress)</span>
              </button>
            ) : (
              <div className="p-3 bg-rose-950/40 border border-rose-500/40 rounded-2xl">
                <div className="flex items-center gap-2 text-rose-200 font-bold text-xs mb-1">
                  <AlertTriangle size={16} />
                  <span>Are you absolutely sure? This will wipe all crystals and progress.</span>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playTone(150, 0.3, 'sawtooth');
                      onResetProgress();
                      setShowConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
