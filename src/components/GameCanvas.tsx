import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Hand, Navigation, Compass } from 'lucide-react';
import { GameState, AreaId, NPCData, InteractiveObject } from '../types';
import { AREAS, NPCS_BY_AREA, OBJECTS_BY_AREA, INITIAL_QUESTS } from '../data/areas';
import { CHARACTERS } from '../utils/storage';
import { sound } from '../utils/audio';

interface GameCanvasProps {
  state: GameState;
  onMovePlayer: (x: number, y: number, direction: 'up' | 'down' | 'left' | 'right') => void;
  onInteractNPC: (npc: NPCData) => void;
  onInteractObject: (obj: InteractiveObject) => void;
  onTriggerRandomEvent: () => void;
}

const GRID_COLS = 10;
const GRID_ROWS = 7;

export const GameCanvas: React.FC<GameCanvasProps> = ({
  state,
  onMovePlayer,
  onInteractNPC,
  onInteractObject,
  onTriggerRandomEvent,
}) => {
  const currentArea = state.currentArea;
  const areaInfo = AREAS[currentArea];
  const char = CHARACTERS[state.characterId];
  const npcs = NPCS_BY_AREA[currentArea] || [];
  const objects = OBJECTS_BY_AREA[currentArea] || [];
  const [nearbyTarget, setNearbyTarget] = useState<{
    type: 'npc' | 'object';
    data: NPCData | InteractiveObject;
  } | null>(null);

  // Active Quest Finder
  const activeQuest = INITIAL_QUESTS.find(
    (q) => !state.completedQuests.includes(q.id)
  ) || INITIAL_QUESTS[INITIAL_QUESTS.length - 1];

  // Check nearby interactables whenever player position changes
  const checkNearby = useCallback(
    (px: number, py: number) => {
      // Check NPCs within 1 tile
      for (const npc of npcs) {
        if (Math.abs(npc.x - px) <= 1 && Math.abs(npc.y - py) <= 1) {
          return { type: 'npc' as const, data: npc };
        }
      }
      // Check Objects within 1 tile
      for (const obj of objects) {
        if (Math.abs(obj.x - px) <= 1 && Math.abs(obj.y - py) <= 1) {
          return { type: 'object' as const, data: obj };
        }
      }
      return null;
    },
    [npcs, objects]
  );

  useEffect(() => {
    const nearby = checkNearby(state.playerPos.x, state.playerPos.y);
    setNearbyTarget(nearby);
  }, [state.playerPos, checkNearby]);

  // Movement handler with collision and boundaries
  const tryMove = useCallback(
    (dx: number, dy: number, dir: 'up' | 'down' | 'left' | 'right') => {
      const newX = Math.max(1, Math.min(GRID_COLS - 2, state.playerPos.x + dx));
      const newY = Math.max(1, Math.min(GRID_ROWS - 2, state.playerPos.y + dy));

      // Check if target tile has blocking door object
      const isBlockedByObj = objects.some(
        (obj) => obj.x === newX && obj.y === newY && obj.type === 'door' && !state.unlockedObjects.includes(obj.id)
      );

      if (isBlockedByObj) {
        sound.playTone(180, 0.1, 'square', 0.05);
        return;
      }

      sound.playStep();
      onMovePlayer(newX, newY, dir);

      // 8% chance of triggering an island event during exploration
      if (Math.random() < 0.08 && state.collectedCrystals.length >= 1) {
        onTriggerRandomEvent();
      }
    },
    [state.playerPos, objects, state.unlockedObjects, state.collectedCrystals.length, onMovePlayer, onTriggerRandomEvent]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((document.activeElement?.tagName || '').toLowerCase())) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          tryMove(0, -1, 'up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          tryMove(0, 1, 'down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          tryMove(-1, 0, 'left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          tryMove(1, 0, 'right');
          break;
        case 'e':
        case 'E':
        case ' ':
        case 'Enter':
          e.preventDefault();
          if (nearbyTarget) {
            handleInteract();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tryMove, nearbyTarget]);

  const handleInteract = () => {
    if (!nearbyTarget) return;
    sound.playClick();
    if (nearbyTarget.type === 'npc') {
      onInteractNPC(nearbyTarget.data as NPCData);
    } else {
      onInteractObject(nearbyTarget.data as InteractiveObject);
    }
  };

  // Direct tile click to walk
  const handleTileClick = (x: number, y: number) => {
    const dx = x - state.playerPos.x;
    const dy = y - state.playerPos.y;

    if (Math.abs(dx) === 0 && Math.abs(dy) === 0) {
      if (nearbyTarget) handleInteract();
      return;
    }

    let dir: 'up' | 'down' | 'left' | 'right' = 'down';
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left';
      tryMove(dx > 0 ? 1 : -1, 0, dir);
    } else {
      dir = dy > 0 ? 'down' : 'up';
      tryMove(0, dy > 0 ? 1 : -1, dir);
    }
  };

  // Thematic background terrain styles for Immersive UI
  const getThemeBg = () => {
    switch (currentArea) {
      case 'beach':
        return 'bg-gradient-to-b from-[#0b3328] via-[#09261e] to-[#061c16] border-emerald-500/30';
      case 'forest':
        return 'bg-gradient-to-b from-[#042c1c] via-[#032014] to-[#02170e] border-emerald-500/30';
      case 'mountain':
        return 'bg-gradient-to-b from-[#0f242c] via-[#091a20] to-[#061418] border-cyan-500/30';
      case 'temple':
        return 'bg-gradient-to-b from-[#2e1c0d] via-[#1f1207] to-[#120a03] border-amber-500/30';
      case 'cave':
        return 'bg-gradient-to-b from-[#1a0f2e] via-[#10091d] to-[#08040f] border-purple-500/30';
      default:
        return 'bg-[#061c16] border-emerald-500/30';
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto flex flex-col items-center select-none pb-2 sm:pb-4 text-[#f8fafc]">
      {/* Active Quest Banner - Immersive UI Card */}
      <div className="w-full flex items-center justify-between bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-xl rounded-2xl px-4 py-2.5 mb-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center font-bold text-sm shadow-[0_0_10px_rgba(16,185,129,0.3)]">
            🎯
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-emerald-400/80">
              Current Quest • 当前任务: {activeQuest.titleCn}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white/90 line-clamp-1">
              {activeQuest.description}
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-400/80 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/30">
          <span>Target Word:</span>
          <span className="text-sm font-bold text-emerald-300">
            {activeQuest.targetWordId === 'dakai' ? '打开' : 
             activeQuest.targetWordId === 'shishi' ? '试试 / 穿' : 
             activeQuest.targetWordId === 'ai' ? '看起来 / 爱' : 
             activeQuest.targetWordId === 'kuaile' ? '祝 / 快乐' : '快乐宝藏'}
          </span>
        </div>
      </div>

      {/* Main Tile Stage Container */}
      <div
        id="game-exploration-stage"
        className={`relative w-full aspect-[10/7] rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(6,28,22,0.8)] border-2 ${getThemeBg()} transition-colors duration-500`}
      >
        {/* Subtle grid pattern texture */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Animated Background Atmosphere */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {currentArea === 'beach' && (
            <>
              <div className="absolute -bottom-6 inset-x-0 h-16 bg-cyan-500/10 rounded-t-full blur-md animate-pulse" />
              <div className="absolute top-2 left-6 text-3xl opacity-40">🌴</div>
              <div className="absolute top-3 right-8 text-3xl opacity-40">🌴</div>
              <div className="absolute bottom-4 left-1/4 text-xl opacity-50">🐚</div>
              <div className="absolute bottom-5 right-1/3 text-xl opacity-50">⭐</div>
            </>
          )}

          {currentArea === 'forest' && (
            <>
              <div className="absolute top-2 left-4 text-3xl opacity-50">🌲</div>
              <div className="absolute top-4 right-6 text-3xl opacity-50">🌳</div>
              <div className="absolute bottom-3 left-10 text-2xl opacity-60">🍄</div>
              <div className="absolute top-1/2 left-3 text-2xl opacity-40 animate-pulse">✨</div>
              <div className="absolute top-1/3 right-4 text-2xl opacity-40 animate-pulse delay-500">✨</div>
            </>
          )}

          {currentArea === 'mountain' && (
            <>
              <div className="absolute top-2 inset-x-0 flex justify-around text-2xl opacity-30">
                <span>☁️</span>
                <span>☁️</span>
                <span>☁️</span>
              </div>
              <div className="absolute bottom-2 right-4 text-3xl opacity-40">⛰️</div>
              <div className="absolute top-4 left-6 text-2xl opacity-40">🪨</div>
            </>
          )}

          {currentArea === 'temple' && (
            <>
              <div className="absolute top-2 inset-x-0 flex justify-around text-xl opacity-60">
                <span>🏮</span>
                <span>🏮</span>
                <span>🏮</span>
                <span>🏮</span>
              </div>
              <div className="absolute bottom-3 left-4 text-3xl opacity-50">🎋</div>
              <div className="absolute bottom-2 right-6 text-3xl opacity-50">🌸</div>
            </>
          )}

          {currentArea === 'cave' && (
            <>
              <div className="absolute inset-0 bg-radial from-cyan-500/10 via-purple-900/20 to-black/60 pointer-events-none" />
              <div className="absolute top-2 left-8 text-2xl animate-pulse">💎</div>
              <div className="absolute top-3 right-10 text-2xl animate-pulse">✨</div>
              <div className="absolute bottom-4 left-1/3 text-2xl animate-pulse">⭐</div>
            </>
          )}
        </div>

        {/* 10x7 Interactive Grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-7 p-2 sm:p-4">
          {Array.from({ length: GRID_ROWS }).map((_, row) =>
            Array.from({ length: GRID_COLS }).map((_, col) => {
              const isWall =
                row === 0 ||
                row === GRID_ROWS - 1 ||
                col === 0 ||
                col === GRID_COLS - 1;

              return (
                <div
                  key={`${col}-${row}`}
                  onClick={() => !isWall && handleTileClick(col, row)}
                  className={`relative flex items-center justify-center transition-all cursor-pointer ${
                    isWall
                      ? 'border border-black/20 bg-black/20 opacity-40 cursor-not-allowed'
                      : 'hover:bg-emerald-400/10 active:bg-emerald-400/20'
                  }`}
                />
              );
            })
          )}
        </div>

        {/* Render Interactive Objects */}
        {objects.map((obj) => {
          const isUnlocked = state.unlockedObjects.includes(obj.id);
          const leftPercent = (obj.x / GRID_COLS) * 100;
          const topPercent = (obj.y / GRID_ROWS) * 100;

          return (
            <div
              key={obj.id}
              id={`obj-${obj.id}`}
              onClick={() => onInteractObject(obj)}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${100 / GRID_COLS}%`,
                height: `${100 / GRID_ROWS}%`,
              }}
              className="absolute flex flex-col items-center justify-center cursor-pointer group z-10 transition-transform duration-200 hover:scale-110"
            >
              <div
                className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-xl border transition-all ${
                  isUnlocked
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'bg-black/60 border-white/20 ring-2 ring-white/10 hover:border-emerald-400/60 shadow-[0_0_15px_rgba(0,0,0,0.6)]'
                }`}
              >
                {obj.icon}
              </div>
              <div className="text-[10px] sm:text-xs font-bold bg-black/80 text-white px-2 py-0.5 rounded-md mt-1 backdrop-blur-md border border-white/10 whitespace-nowrap shadow-xs opacity-90 group-hover:opacity-100">
                {obj.nameCn}
              </div>
            </div>
          );
        })}

        {/* Render NPCs */}
        {npcs.map((npc) => {
          const leftPercent = (npc.x / GRID_COLS) * 100;
          const topPercent = (npc.y / GRID_ROWS) * 100;

          return (
            <div
              key={npc.id}
              id={`npc-${npc.id}`}
              onClick={() => onInteractNPC(npc)}
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${100 / GRID_COLS}%`,
                height: `${100 / GRID_ROWS}%`,
              }}
              className="absolute flex flex-col items-center justify-center cursor-pointer group z-10 transition-transform duration-200 hover:scale-115"
            >
              {/* NPC Quest Attention Indicator */}
              <div className="absolute -top-3 w-5 h-5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black font-black rounded-full flex items-center justify-center text-xs animate-bounce shadow-[0_0_10px_rgba(16,185,129,0.8)] border border-white">
                !
              </div>

              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-black/60 border border-emerald-500/40 flex items-center justify-center text-2xl sm:text-3xl shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-2 ring-emerald-400/20 backdrop-blur-md">
                {npc.avatar}
              </div>
              <div className="text-[10px] sm:text-xs font-bold bg-black/80 text-emerald-300 px-2 py-0.5 rounded-md mt-1 backdrop-blur-md border border-emerald-500/20 whitespace-nowrap shadow-xs">
                {npc.nameCn}
              </div>
            </div>
          );
        })}

        {/* Render Player Character */}
        {(() => {
          const leftPercent = (state.playerPos.x / GRID_COLS) * 100;
          const topPercent = (state.playerPos.y / GRID_ROWS) * 100;

          return (
            <div
              id="player-character-avatar"
              style={{
                left: `${leftPercent}%`,
                top: `${topPercent}%`,
                width: `${100 / GRID_COLS}%`,
                height: `${100 / GRID_ROWS}%`,
                transition: 'left 0.18s ease-out, top 0.18s ease-out',
              }}
              className="absolute flex flex-col items-center justify-center z-20 pointer-events-none"
            >
              {/* Character speech hint if near interactable */}
              {nearbyTarget && (
                <div className="absolute -top-8 px-2.5 py-0.5 bg-emerald-400 text-black rounded-full font-black text-[10px] shadow-[0_0_15px_rgba(52,211,153,0.8)] animate-pulse whitespace-nowrap border border-white">
                  {nearbyTarget.type === 'npc' ? '💬 对话 Talk' : '✨ 探索 Interact'}
                </div>
              )}

              {/* Character Box */}
              <div
                className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-950/70 border-2 border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-center text-3xl sm:text-4xl transition-transform duration-150 backdrop-blur-xs ${
                  state.playerDirection === 'left' ? '-scale-x-100' : 'scale-x-100'
                }`}
              >
                <span>{char?.avatar || '🦊'}</span>

                {/* Equipped Clothing Badge */}
                {state.equippedClothing && (
                  <span className="absolute -bottom-1 -right-1 text-xs bg-emerald-500 text-black rounded-md p-0.5 shadow-xs border border-white font-bold">
                    👕
                  </span>
                )}
              </div>

              <div className="text-[10px] font-bold bg-emerald-500 text-black px-2 py-0.2 rounded-full mt-0.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                {state.characterName}
              </div>
            </div>
          );
        })()}
      </div>

      {/* Control Bar: Keyboard guide + Mobile On-Screen D-Pad / Touch Buttons */}
      <div className="w-full mt-3 flex flex-col sm:flex-row items-center justify-between gap-3 bg-black/60 backdrop-blur-2xl rounded-3xl p-4 border border-white/10 shadow-2xl">
        {/* Desktop Helper */}
        <div className="hidden sm:flex items-center gap-3 text-xs text-white/60 font-medium">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
            <span className="font-bold text-emerald-400 font-mono">WASD</span> or <span className="font-bold text-emerald-400 font-mono">Arrow Keys</span>: Move
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-xl border border-white/10">
            <span className="font-bold text-cyan-400 font-mono">Click Tile</span>: Walk
          </div>
          <div className="flex items-center gap-1.5 bg-emerald-500/15 text-emerald-300 px-2.5 py-1 rounded-xl border border-emerald-500/30 font-bold">
            <span className="bg-emerald-500 text-black px-1.5 py-0.2 rounded shadow-2xs font-mono font-black">E</span>: Interact
          </div>
        </div>

        {/* Mobile / Tablet Touch Controls */}
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-3">
          {/* Virtual D-Pad */}
          <div className="grid grid-cols-3 gap-1.5 w-32 h-24">
            <div />
            <button
              id="dpad-up"
              type="button"
              onClick={() => tryMove(0, -1, 'up')}
              aria-label="Move Up"
              className="bg-white/5 hover:bg-emerald-500/20 active:bg-emerald-500/40 border border-white/10 hover:border-emerald-500/40 rounded-xl flex items-center justify-center text-white/90 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ArrowUp size={18} />
            </button>
            <div />

            <button
              id="dpad-left"
              type="button"
              onClick={() => tryMove(-1, 0, 'left')}
              aria-label="Move Left"
              className="bg-white/5 hover:bg-emerald-500/20 active:bg-emerald-500/40 border border-white/10 hover:border-emerald-500/40 rounded-xl flex items-center justify-center text-white/90 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              id="dpad-down"
              type="button"
              onClick={() => tryMove(0, 1, 'down')}
              aria-label="Move Down"
              className="bg-white/5 hover:bg-emerald-500/20 active:bg-emerald-500/40 border border-white/10 hover:border-emerald-500/40 rounded-xl flex items-center justify-center text-white/90 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ArrowDown size={18} />
            </button>
            <button
              id="dpad-right"
              type="button"
              onClick={() => tryMove(1, 0, 'right')}
              aria-label="Move Right"
              className="bg-white/5 hover:bg-emerald-500/20 active:bg-emerald-500/40 border border-white/10 hover:border-emerald-500/40 rounded-xl flex items-center justify-center text-white/90 shadow-xs cursor-pointer active:scale-95 transition-all"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Action Button */}
          <button
            id="btn-interact-action"
            type="button"
            onClick={handleInteract}
            disabled={!nearbyTarget}
            className={`px-5 py-3 rounded-2xl font-black text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer active:scale-95 ${
              nearbyTarget
                ? 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-black shadow-[0_0_25px_rgba(16,185,129,0.5)] animate-pulse'
                : 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed shadow-none'
            }`}
          >
            <Hand size={18} />
            <span>
              {nearbyTarget ? (nearbyTarget.type === 'npc' ? '对话 Talk' : '探索 Open') : '靠近交互'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
