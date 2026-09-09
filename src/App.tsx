import React, { useState, useEffect, useCallback } from 'react';
import {
  GameState,
  CharacterId,
  Difficulty,
  AreaId,
  NPCData,
  InteractiveObject,
  GameSettings,
} from './types';
import {
  loadSavedGame,
  saveGameState,
  clearGameState,
  INITIAL_GAME_STATE,
  CHARACTERS,
} from './utils/storage';
import { VOCABULARY_MAP, VOCABULARY_LIST } from './data/vocabulary';
import { CLOTHING_ITEMS } from './data/clothing';
import { GAME_CHALLENGES } from './data/challenges';
import { INITIAL_QUESTS, AREAS, AREA_ORDER } from './data/areas';
import { sound } from './utils/audio';

// Components
import { StartScreen } from './components/StartScreen';
import { Navbar } from './components/Navbar';
import { GameCanvas } from './components/GameCanvas';
import { DialogueModal } from './components/DialogueModal';
import { ChallengeModal } from './components/ChallengeModal';
import { CrystalRewardModal } from './components/CrystalRewardModal';
import { InventoryModal } from './components/InventoryModal';
import { WorldMapModal } from './components/WorldMapModal';
import { EventModal } from './components/EventModal';
import { SettingsModal } from './components/SettingsModal';
import { VictoryScreen } from './components/VictoryScreen';
import { VocabularyReviewModal } from './components/VocabularyReviewModal';

export default function App() {
  const [state, setState] = useState<GameState>(() => loadSavedGame());

  // Active Modals
  const [activeNPC, setActiveNPC] = useState<NPCData | null>(null);
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(null);
  const [newlyUnlockedCrystalId, setNewlyUnlockedCrystalId] = useState<string | null>(null);
  const [recentXpEarned, setRecentXpEarned] = useState<number>(0);
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isMapOpen, setIsMapOpen] = useState<boolean>(false);
  const [isVocabOpen, setIsVocabOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Auto-save state changes
  useEffect(() => {
    saveGameState(state);
    sound.soundEnabled = state.settings.soundEnabled;
    sound.voiceSpeed = state.settings.voiceSpeed;
  }, [state]);

  // Flash notification helper
  const showToast = useCallback((msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 3500);
  }, []);

  // --- START / RESUME GAME ---
  const handleStartGame = (characterId: CharacterId, difficulty: Difficulty) => {
    const char = CHARACTERS[characterId];
    setState({
      ...INITIAL_GAME_STATE,
      hasStarted: true,
      characterId,
      characterName: char.name,
      settings: {
        ...INITIAL_GAME_STATE.settings,
        difficulty,
      },
    });
    showToast(`欢迎来到快乐冒险岛，${char.name}！`);
  };

  const handleResumeGame = () => {
    setState((prev) => ({ ...prev, hasStarted: true }));
    showToast(`欢迎回来，继续快乐探险！`);
  };

  // --- PLAYER MOVEMENT ---
  const handleMovePlayer = (
    x: number,
    y: number,
    direction: 'up' | 'down' | 'left' | 'right'
  ) => {
    setState((prev) => ({
      ...prev,
      playerPos: { x, y },
      playerDirection: direction,
    }));
  };

  // --- INTERACTION: NPC ---
  const handleInteractNPC = (npc: NPCData) => {
    setActiveNPC(npc);
  };

  // --- INTERACTION: OBJECT (DOOR / CHEST / PORTAL / MIRROR / ALTAR) ---
  const handleInteractObject = (obj: InteractiveObject) => {
    // Handle Portals to next area
    if (obj.type === 'portal') {
      if (obj.requiresCrystal && !state.collectedCrystals.includes(obj.requiresCrystal)) {
        const reqWord = VOCABULARY_MAP[obj.requiresCrystal];
        sound.playIncorrect();
        showToast(
          `🔒 前方道路被封印！你需要先找到 “${reqWord?.hanzi}” 水晶才能前往下一区域。`
        );
        return;
      }

      // Transition to next area
      sound.playDoorOpen();
      let nextArea: AreaId = 'beach';
      if (state.currentArea === 'beach') nextArea = 'forest';
      else if (state.currentArea === 'forest') nextArea = 'mountain';
      else if (state.currentArea === 'mountain') nextArea = 'temple';
      else if (state.currentArea === 'temple') nextArea = 'cave';

      setState((prev) => ({
        ...prev,
        currentArea: nextArea,
        playerPos: { x: 2, y: 4 },
        unlockedAreas: prev.unlockedAreas.includes(nextArea)
          ? prev.unlockedAreas
          : [...prev.unlockedAreas, nextArea],
      }));
      showToast(`✨ 进入了新区域：${AREAS[nextArea].nameCn} (${AREAS[nextArea].nameEn})！`);
      return;
    }

    // Handle interactive challenge objects
    if (obj.challengeId) {
      sound.playClick();
      setActiveChallengeId(obj.challengeId);
      return;
    }

    if (obj.completedText) {
      showToast(obj.completedText);
    }
  };

  // --- CHALLENGE SUCCESS HANDLER ---
  const handleChallengeSuccess = (targetWordId: string, xpEarned: number) => {
    setActiveChallengeId(null);
    setActiveNPC(null);
    setActiveEventId(null);

    const isNewCrystal = !state.collectedCrystals.includes(targetWordId);
    setRecentXpEarned(xpEarned);

    setState((prev) => {
      const newCrystals = isNewCrystal
        ? [...prev.collectedCrystals, targetWordId]
        : prev.collectedCrystals;

      // Add clothes to inventory if tailor quest
      let newClothing = [...prev.clothingInventory];
      if (
        (targetWordId === 'chuan' || targetWordId === 'shishi') &&
        newClothing.length < CLOTHING_ITEMS.length
      ) {
        newClothing = [...CLOTHING_ITEMS];
      }

      // Check unlocking objects
      const newUnlockedObjs = [...prev.unlockedObjects];
      if (targetWordId === 'dakai') {
        newUnlockedObjs.push('beach_gate', 'temple_gate_obj');
      }

      // Update quests
      const newQuests = [...prev.completedQuests];
      INITIAL_QUESTS.forEach((q) => {
        if (q.targetWordId === targetWordId && !newQuests.includes(q.id)) {
          newQuests.push(q.id);
        }
      });

      // Check if all 10 crystals collected & final cave open
      const allCrystalsCollected = newCrystals.length >= 10;
      const isFinalTreasureOpen =
        allCrystalsCollected &&
        (activeChallengeId === 'cave_final_open_treasure' ||
          activeChallengeId === 'cave_final_gate_part4' ||
          prev.currentArea === 'cave');

      return {
        ...prev,
        xp: prev.xp + xpEarned,
        collectedCrystals: newCrystals,
        clothingInventory: newClothing,
        unlockedObjects: newUnlockedObjs,
        completedQuests: newQuests,
        gameCompleted: isFinalTreasureOpen ? true : prev.gameCompleted,
      };
    });

    if (isNewCrystal && VOCABULARY_MAP[targetWordId]) {
      setNewlyUnlockedCrystalId(targetWordId);
    } else {
      showToast(`🎉 挑战完成！获得 +${xpEarned} XP！`);
    }

    // Step-by-step sequencing inside final cave
    if (activeChallengeId === 'cave_final_gate_part1') {
      setTimeout(() => setActiveChallengeId('cave_final_gate_part2'), 500);
    } else if (activeChallengeId === 'cave_final_gate_part2') {
      setTimeout(() => setActiveChallengeId('cave_final_gate_part3'), 500);
    } else if (activeChallengeId === 'cave_final_gate_part3') {
      setTimeout(() => setActiveChallengeId('cave_final_gate_part4'), 500);
    } else if (activeChallengeId === 'cave_final_gate_part4') {
      setTimeout(() => setActiveChallengeId('cave_final_open_treasure'), 500);
    }
  };

  // --- RANDOM EXPLORATION EVENT TRIGGER ---
  const handleTriggerRandomEvent = () => {
    const events = [
      'event_clothing_monster',
      'event_magic_storm',
      'event_magic_mirror_glimmer',
      'event_ancient_door_shortcut',
    ];
    const picked = events[Math.floor(Math.random() * events.length)];
    setActiveEventId(picked);
  };

  // --- CLOTHING EQUIP ---
  const handleEquipClothing = (clothingId: string) => {
    setState((prev) => ({ ...prev, equippedClothing: clothingId }));
    const item = CLOTHING_ITEMS.find((c) => c.id === clothingId);
    showToast(`👕 穿上了 ${item?.nameCn}！${item?.fitDescriptionCn}`);
  };

  // --- AREA TRAVEL VIA WORLD MAP ---
  const handleSelectArea = (areaId: AreaId) => {
    setIsMapOpen(false);
    setState((prev) => ({
      ...prev,
      currentArea: areaId,
      playerPos: { x: 3, y: 4 },
    }));
    showToast(`✨ 来到了 ${AREAS[areaId].nameCn}！`);
  };

  // --- RESET GAME ---
  const handleResetProgress = () => {
    clearGameState();
    setState(INITIAL_GAME_STATE);
    showToast('游戏进度已重置。新的一天，新的冒险！');
  };

  // If game hasn't started, render welcome start screen
  if (!state.hasStarted) {
    return (
      <StartScreen
        onStartGame={handleStartGame}
        savedGame={loadSavedGame()}
        onResumeGame={handleResumeGame}
      />
    );
  }

  const currentChallenge = activeChallengeId
    ? GAME_CHALLENGES[activeChallengeId]
    : null;

  return (
    <div className="min-h-screen w-full bg-[#061c16] text-[#f8fafc] flex flex-col items-center select-none font-sans relative overflow-x-hidden">
      {/* Immersive UI Ambient Radial Lighting */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_30%,_rgba(20,184,166,0.12)_0%,_transparent_70%)] pointer-events-none" />

      {/* Toast Notification Banner */}
      {notification && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-black/80 backdrop-blur-xl text-white border border-emerald-500/40 px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] text-xs sm:text-sm font-bold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-4 duration-200">
          <span className="text-emerald-400">✨</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Island Top Navigation Bar */}
      <Navbar
        state={state}
        onOpenInventory={() => setIsInventoryOpen(true)}
        onOpenMap={() => setIsMapOpen(true)}
        onOpenVocab={() => setIsVocabOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main Adventure Stage */}
      <main className="w-full flex-1 flex items-center justify-center p-2 sm:p-4">
        <GameCanvas
          state={state}
          onMovePlayer={handleMovePlayer}
          onInteractNPC={handleInteractNPC}
          onInteractObject={handleInteractObject}
          onTriggerRandomEvent={handleTriggerRandomEvent}
        />
      </main>

      {/* NPC Dialogue Modal */}
      {activeNPC && (
        <DialogueModal
          npc={activeNPC}
          settings={state.settings}
          onClose={() => setActiveNPC(null)}
          onStartChallenge={(challengeId) => {
            setActiveNPC(null);
            setActiveChallengeId(challengeId);
          }}
        />
      )}

      {/* Chinese Learning Challenge Modal */}
      {currentChallenge && (
        <ChallengeModal
          challenge={currentChallenge}
          settings={state.settings}
          onSuccess={handleChallengeSuccess}
          onClose={() => setActiveChallengeId(null)}
        />
      )}

      {/* Random Island Event Card */}
      {activeEventId && (
        <EventModal
          eventId={activeEventId}
          settings={state.settings}
          onSuccess={handleChallengeSuccess}
          onClose={() => setActiveEventId(null)}
        />
      )}

      {/* New Magic Word Crystal Celebration Modal */}
      {newlyUnlockedCrystalId && VOCABULARY_MAP[newlyUnlockedCrystalId] && (
        <CrystalRewardModal
          word={VOCABULARY_MAP[newlyUnlockedCrystalId]}
          xpEarned={recentXpEarned}
          totalCollected={state.collectedCrystals.length}
          onClose={() => setNewlyUnlockedCrystalId(null)}
        />
      )}

      {/* Backpack & Inventory Modal */}
      {isInventoryOpen && (
        <InventoryModal
          state={state}
          onEquipClothing={handleEquipClothing}
          onClose={() => setIsInventoryOpen(false)}
        />
      )}

      {/* World Map Fast Travel Modal */}
      {isMapOpen && (
        <WorldMapModal
          state={state}
          onSelectArea={handleSelectArea}
          onClose={() => setIsMapOpen(false)}
        />
      )}

      {/* 10 Words Vocabulary Codex Review Modal */}
      {isVocabOpen && (
        <VocabularyReviewModal
          onClose={() => setIsVocabOpen(false)}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          settings={state.settings}
          onUpdateSettings={(newSettings) =>
            setState((prev) => ({
              ...prev,
              settings: { ...prev.settings, ...newSettings },
            }))
          }
          onResetProgress={handleResetProgress}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}

      {/* Grand Victory Screen */}
      {state.gameCompleted && (
        <VictoryScreen
          state={state}
          onPlayAgain={handleResetProgress}
          onReviewVocab={() => {
            setState((prev) => ({ ...prev, gameCompleted: false }));
            setIsVocabOpen(true);
          }}
          onExploreIsland={() => {
            setState((prev) => ({ ...prev, gameCompleted: false }));
          }}
        />
      )}
    </div>
  );
}
