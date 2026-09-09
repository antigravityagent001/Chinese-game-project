import { GameState, CharacterId } from '../types';
import { CLOTHING_ITEMS } from '../data/clothing';

export const STORAGE_KEY = 'kuaile_adventure_save_v1';

export const CHARACTERS: Record<CharacterId, { name: string; title: string; avatar: string; color: string; desc: string }> = {
  fox: {
    name: '小狐狸阿飞',
    title: 'Felix the Agile Fox',
    avatar: '🦊',
    color: '#f97316',
    desc: 'Clever, curious, and quick on his feet. Always ready to explore new trails!',
  },
  panda: {
    name: '熊猫阿宝',
    title: 'Bao the Wise Panda',
    avatar: '🐼',
    color: '#0284c7',
    desc: 'Gentle, thoughtful, and deeply fascinated by ancient island mysteries and tea.',
  },
  bunny: {
    name: '星兔露娜',
    title: 'Luna the Star Bunny',
    avatar: '🐰',
    color: '#ec4899',
    desc: 'Energetic, cheerful, and loves collecting shining crystals and colorful clothes.',
  },
};

export const INITIAL_GAME_STATE: GameState = {
  hasStarted: false,
  characterId: 'fox',
  characterName: '小狐狸阿飞',
  currentArea: 'beach',
  playerPos: { x: 4, y: 5 },
  playerDirection: 'down',
  isMoving: false,
  xp: 0,
  unlockedAreas: ['beach'],
  collectedCrystals: [],
  equippedClothing: 'magic_shirt',
  clothingInventory: [CLOTHING_ITEMS[0]], // Start with magic shirt in bag
  keysInventory: [],
  treasuresInventory: [],
  completedQuests: [],
  completedChallenges: [],
  unlockedObjects: [],
  currentQuestIndex: 0,
  gameCompleted: false,
  settings: {
    difficulty: 'easy',
    showPinyin: true,
    showEnglish: true,
    soundEnabled: true,
    voiceSpeed: 0.9,
  },
  activeCosmetic: 'default',
  unlockedCosmetics: ['default'],
  totalEncounters: 0,
};

export function loadSavedGame(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_GAME_STATE;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_GAME_STATE,
      ...parsed,
      settings: {
        ...INITIAL_GAME_STATE.settings,
        ...(parsed.settings || {}),
      },
    };
  } catch (err) {
    console.warn('Failed to load saved state, using default:', err);
    return INITIAL_GAME_STATE;
  }
}

export function saveGameState(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('Failed to save state to localStorage:', err);
  }
}

export function clearGameState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear state:', err);
  }
}

export function getRankByXP(xp: number): { title: string; icon: string; minXP: number; nextXP: number; level: number } {
  if (xp >= 700) return { title: '👑 快乐大师 (Happy Master)', icon: '👑', minXP: 700, nextXP: 1000, level: 5 };
  if (xp >= 450) return { title: '⭐ Language Master', icon: '⭐', minXP: 450, nextXP: 700, level: 4 };
  if (xp >= 250) return { title: '⚔️ Adventure Hero', icon: '⚔️', minXP: 250, nextXP: 450, level: 3 };
  if (xp >= 100) return { title: '🧭 Explorer', icon: '🧭', minXP: 100, nextXP: 250, level: 2 };
  return { title: '🌱 Island Beginner', icon: '🌱', minXP: 0, nextXP: 100, level: 1 };
}
