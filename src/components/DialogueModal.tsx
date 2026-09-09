import React from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { NPCData, GameSettings } from '../types';
import { AudioButton } from './AudioButton';
import { sound } from '../utils/audio';

interface DialogueModalProps {
  npc: NPCData;
  settings: GameSettings;
  onClose: () => void;
  onStartChallenge: (challengeId: string) => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({
  npc,
  settings,
  onClose,
  onStartChallenge,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
      <div className="relative w-full max-w-xl bg-black/75 backdrop-blur-2xl rounded-3xl shadow-[0_0_50px_rgba(6,28,22,0.9)] border border-emerald-500/30 overflow-hidden flex flex-col p-6 text-[#f8fafc] animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          aria-label="Close dialogue"
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/10 cursor-pointer transition-all"
        >
          <X size={18} />
        </button>

        {/* NPC Profile Header */}
        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            {npc.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">{npc.nameCn}</h3>
              <span className="text-xs font-bold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 uppercase tracking-wider">
                {npc.role}
              </span>
            </div>
            <p className="text-xs text-white/50">{npc.nameEn}</p>
          </div>
        </div>

        {/* Speech Bubble */}
        <div className="relative p-5 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl mb-6 shadow-inner">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              {/* Chinese sentence */}
              <p className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                {npc.initialDialogue.textCn}
              </p>

              {/* Pinyin if enabled */}
              {settings.showPinyin && (
                <p className="text-xs sm:text-sm font-semibold text-emerald-400 mt-1">
                  {npc.initialDialogue.pinyin}
                </p>
              )}

              {/* English translation if enabled */}
              {settings.showEnglish && (
                <p className="text-xs sm:text-sm text-white/60 mt-1 italic">
                  "{npc.initialDialogue.textEn}"
                </p>
              )}
            </div>

            {/* Listen Button */}
            <AudioButton text={npc.initialDialogue.textCn} size="md" label="Listen" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 mt-auto">
          <button
            type="button"
            id="dialogue-btn-leave"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 font-bold cursor-pointer text-sm transition-all"
          >
            离开 (Leave)
          </button>

          {npc.challengeId && (
            <button
              type="button"
              id="dialogue-btn-challenge"
              onClick={() => {
                sound.playClick();
                onStartChallenge(npc.challengeId!);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-[#061c16] font-black shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 cursor-pointer text-sm active:scale-95 transition-all"
            >
              <Sparkles size={16} />
              <span>开始挑战 (Start Challenge)</span>
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
