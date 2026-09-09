import React, { useState } from 'react';
import { Backpack, Sparkles, Shirt, Key, Trophy, X, Check, Volume2 } from 'lucide-react';
import { GameState, ClothingItem } from '../types';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { CLOTHING_ITEMS } from '../data/clothing';
import { AudioButton } from './AudioButton';
import { sound } from '../utils/audio';

interface InventoryModalProps {
  state: GameState;
  onEquipClothing: (clothingId: string) => void;
  onClose: () => void;
}

type TabType = 'crystals' | 'clothing' | 'keys' | 'treasures';

export const InventoryModal: React.FC<InventoryModalProps> = ({
  state,
  onEquipClothing,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('crystals');

  const handleTabChange = (tab: TabType) => {
    sound.playClick();
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-2xl bg-[#061c16]/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(6,28,22,0.95)] border border-emerald-500/30 overflow-hidden flex flex-col p-5 sm:p-6 text-[#f8fafc] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <Backpack size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                探险背包 (Adventurer Backpack)
              </h3>
              <p className="text-xs text-white/50">
                Inspect collected crystals, equip magic gear, and view treasures
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close inventory"
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 cursor-pointer transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl mb-4">
          <button
            type="button"
            onClick={() => handleTabChange('crystals')}
            className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'crystals'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>💎 水晶</span>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1 rounded-full font-mono">
              {state.collectedCrystals.length}/10
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('clothing')}
            className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'clothing'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>👕 服装</span>
            <span className="text-[10px] bg-emerald-500/30 text-emerald-200 px-1 rounded-full font-mono">
              {state.clothingInventory.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('keys')}
            className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'keys'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>🗝️ 钥匙</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('treasures')}
            className={`py-2 px-1 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'treasures'
                ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <span>🏆 珍宝</span>
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* CRYSTALS TAB */}
          {activeTab === 'crystals' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {VOCABULARY_LIST.map((word) => {
                const isCollected = state.collectedCrystals.includes(word.id);
                return (
                  <div
                    key={word.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCollected
                        ? 'bg-emerald-950/40 border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'bg-white/5 border-white/10 opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-xs border ${
                          isCollected
                            ? 'bg-emerald-950/60 border-emerald-400 text-emerald-200'
                            : 'bg-black/40 border-white/10 grayscale'
                        }`}
                      >
                        {word.crystalIcon}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-black text-white">
                            {word.hanzi}
                          </span>
                          {isCollected && <AudioButton text={word.hanzi} size="sm" />}
                        </div>
                        <div className="text-xs font-bold text-emerald-400">
                          {word.pinyin}
                        </div>
                        <div className="text-xs text-white/50 italic">
                          {word.english}
                        </div>

                        {isCollected ? (
                          <div className="mt-2 pt-1.5 border-t border-emerald-500/20 text-[11px] text-white/70">
                            <span className="font-bold text-emerald-400">例句: </span>
                            <span>{word.exampleChinese}</span>
                          </div>
                        ) : (
                          <div className="mt-2 text-[10px] font-bold text-white/40">
                            🔒 Locked — Explore island to find
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* CLOTHING TAB */}
          {activeTab === 'clothing' && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-white/70 bg-white/5 p-2.5 rounded-xl border border-white/10 flex items-center justify-between">
                <span>
                  Equip clothes to test with the mountain Talking Mirror!
                </span>
                <span className="font-bold text-emerald-300">
                  Currently Wearing:{' '}
                  {CLOTHING_ITEMS.find((c) => c.id === state.equippedClothing)?.nameCn ||
                    '探险便服'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {state.clothingInventory.map((item) => {
                  const isEquipped = state.equippedClothing === item.id;
                  return (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between transition-all ${
                        isEquipped
                          ? 'bg-emerald-950/60 border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                          : 'bg-white/5 border-white/10 hover:border-emerald-500/40'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <div className="w-12 h-12 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-3xl shadow-xs">
                          {item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-base text-white">
                              {item.nameCn}
                            </span>
                            <AudioButton text={item.nameCn} size="sm" />
                          </div>
                          <div className="text-xs font-bold text-emerald-400">
                            {item.pinyin}
                          </div>
                          <div className="text-xs text-white/50">
                            {item.nameEn}
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-white/60 line-clamp-2 mb-2">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                          {item.fitDescriptionCn}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            sound.playClick();
                            onEquipClothing(item.id);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold cursor-pointer transition-all ${
                            isEquipped
                              ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                              : 'bg-white/10 hover:bg-emerald-500/20 text-white/80 hover:text-white'
                          }`}
                        >
                          {isEquipped ? '✓ Equipped (已穿上)' : '穿上 (Wear)'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* KEYS TAB */}
          {activeTab === 'keys' && (
            <div className="p-4 text-center">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-left">
                  <div className="text-2xl mb-1">🗝️</div>
                  <div className="font-bold text-sm text-white">
                    海滩古铜钥匙 (Beach Key)
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    Given by Captain Tao to open the forest trail.
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl text-left">
                  <div className="text-2xl mb-1">⛩️</div>
                  <div className="font-bold text-sm text-white">
                    神殿通行符印 (Temple Seal)
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    Sacred seal granted by Happiness Village.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TREASURES TAB */}
          {activeTab === 'treasures' && (
            <div className="p-4 text-center">
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl mb-1">🐚</span>
                  <span className="font-bold text-xs text-white">海歌彩贝</span>
                  <span className="text-[10px] text-white/50">Island Shell</span>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl mb-1">🪙</span>
                  <span className="font-bold text-xs text-white">远古金币</span>
                  <span className="text-[10px] text-white/50">Ancient Coin</span>
                </div>

                <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
                  <span className="text-3xl mb-1">⭐</span>
                  <span className="font-bold text-xs text-white">探险徽章</span>
                  <span className="text-[10px] text-white/50">Star Badge</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
