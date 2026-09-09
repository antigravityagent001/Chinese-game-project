import React from 'react';
import { Map, Lock, ChevronRight, X } from 'lucide-react';
import { AreaId, GameState } from '../types';
import { AREAS, AREA_ORDER } from '../data/areas';
import { sound } from '../utils/audio';

interface WorldMapModalProps {
  state: GameState;
  onSelectArea: (areaId: AreaId) => void;
  onClose: () => void;
}

export const WorldMapModal: React.FC<WorldMapModalProps> = ({
  state,
  onSelectArea,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-2xl bg-[#061c16]/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(6,28,22,0.95)] border border-emerald-500/30 overflow-hidden flex flex-col p-5 sm:p-6 text-[#f8fafc]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <Map size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                快乐冒险岛全图 (Island World Map)
              </h3>
              <p className="text-xs text-white/50">
                Explore the 5 areas in sequence to uncover the Happy Treasure
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

        {/* Map Zone List with Connection Flow */}
        <div className="space-y-3 overflow-y-auto max-h-[60vh] pr-1">
          {AREA_ORDER.map((areaId, idx) => {
            const area = AREAS[areaId];
            const isUnlocked = state.unlockedAreas.includes(areaId);
            const isCurrent = state.currentArea === areaId;

            return (
              <div key={areaId} className="relative">
                {/* Connector Line */}
                {idx < AREA_ORDER.length - 1 && (
                  <div className="absolute left-7 top-14 bottom-[-14px] w-0.5 border-l-2 border-dashed border-emerald-500/30 z-0" />
                )}

                <div
                  className={`relative z-10 p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                    isCurrent
                      ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.25)]'
                      : isUnlocked
                      ? 'bg-white/5 hover:bg-emerald-500/10 border-white/10 hover:border-emerald-500/40'
                      : 'bg-black/30 border-white/5 opacity-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs border ${
                        isUnlocked
                          ? 'bg-emerald-950/80 border-emerald-500/50'
                          : 'bg-black/50 border-white/10 grayscale'
                      }`}
                    >
                      {area.icon}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-base text-white">
                          {idx + 1}. {area.nameCn}
                        </span>
                        <span className="text-xs text-white/50">
                          ({area.nameEn})
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] bg-emerald-500 text-black font-black px-2 py-0.2 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]">
                            Current Location
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
                        {area.description}
                      </p>

                      <div className="flex items-center gap-1.5 mt-1 text-[11px] font-semibold text-emerald-400">
                        <span>Keywords:</span>
                        {area.targetWords.map((wId) => (
                          <span
                            key={wId}
                            className="bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.2 rounded text-[10px] text-emerald-300 font-mono"
                          >
                            {wId}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    {isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => {
                          sound.playDoorOpen();
                          onSelectArea(areaId);
                        }}
                        className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95 ${
                          isCurrent
                            ? 'bg-white/10 text-white/40 cursor-default'
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        }`}
                      >
                        <span>{isCurrent ? 'Here' : 'Travel (前往)'}</span>
                        {!isCurrent && <ChevronRight size={14} />}
                      </button>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-white/40 font-bold px-2 py-1 bg-white/5 rounded-lg border border-white/5">
                        <Lock size={12} />
                        <span>Locked</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
