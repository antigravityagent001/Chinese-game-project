export type CharacterId = 'fox' | 'panda' | 'bunny';

export type AreaId = 'beach' | 'forest' | 'mountain' | 'temple' | 'cave';

export type Difficulty = 'easy' | 'normal' | 'master';

export interface VocabularyWord {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  crystalIcon: string;
  crystalName: string;
  color: string;
  exampleChinese: string;
  examplePinyin: string;
  exampleEnglish: string;
  grammarNote: string;
}

export type ChallengeType = 
  | 'choice'
  | 'word-order'
  | 'fill-blank'
  | 'match'
  | 'dialogue'
  | 'speech-listen';

export interface ChallengeOption {
  id: string;
  text: string;
  pinyin?: string;
  english?: string;
  isCorrect: boolean;
}

export interface MatchPair {
  id: string;
  chinese: string;
  english: string;
  pinyin: string;
}

export interface Challenge {
  id: string;
  title: string;
  instruction: string;
  instructionCn?: string;
  targetWordId: string;
  type: ChallengeType;
  prompt: string;
  promptPinyin?: string;
  options?: ChallengeOption[];
  wordTokens?: string[]; // for word ordering
  correctOrder?: string[];
  blankSentence?: string; // with "____"
  blankOptions?: string[];
  correctBlank?: string;
  matchPairs?: MatchPair[];
  dialogueSpeaker?: string;
  dialogueSpeakerAvatar?: string;
  dialogueContext?: string;
  dialoguePrompt?: string;
  dialogueReplies?: {
    id: string;
    text: string;
    pinyin?: string;
    english?: string;
    reaction: string;
    isCorrect: boolean;
  }[];
  listenPhrase?: string;
  listenPinyin?: string;
  listenEnglish?: string;
  hint: string;
  explanation: string;
  xpReward: number;
}

export interface ClothingItem {
  id: string;
  nameCn: string;
  nameEn: string;
  pinyin: string;
  type: 'shirt' | 'dress' | 'pants' | 'shoes' | 'jacket';
  icon: string;
  description: string;
  fitDescriptionCn: string; // e.g. "看起来有点儿大" or "正合身！"
  isPerfectFit: boolean;
}

export interface InventoryItem {
  id: string;
  nameCn: string;
  nameEn: string;
  pinyin: string;
  category: 'crystal' | 'clothing' | 'key' | 'treasure';
  icon: string;
  description: string;
  collectedAt?: number;
}

export interface NPCData {
  id: string;
  nameCn: string;
  nameEn: string;
  role: string;
  avatar: string;
  x: number;
  y: number;
  areaId: AreaId;
  initialDialogue: {
    textCn: string;
    textEn: string;
    pinyin: string;
  };
  questId?: string;
  challengeId?: string;
}

export interface InteractiveObject {
  id: string;
  nameCn: string;
  nameEn: string;
  type: 'door' | 'chest' | 'mirror' | 'heart_stone' | 'portal' | 'altar';
  x: number;
  y: number;
  areaId: AreaId;
  icon: string;
  isLocked: boolean;
  requiresCrystal?: string;
  challengeId?: string;
  completedText?: string;
}

export interface AreaInfo {
  id: AreaId;
  nameCn: string;
  nameEn: string;
  pinyin: string;
  icon: string;
  bgGradient: string;
  description: string;
  targetWords: string[]; // word ids
  recommendedLevel: number;
  mapX: number; // For island world map display (0-100%)
  mapY: number;
}

export interface Quest {
  id: string;
  titleCn: string;
  titleEn: string;
  areaId: AreaId;
  description: string;
  targetWordId: string;
  xp: number;
  isCompleted: boolean;
  order: number;
}

export interface GameSettings {
  difficulty: Difficulty;
  showPinyin: boolean;
  showEnglish: boolean;
  soundEnabled: boolean;
  voiceSpeed: number; // 0.8, 1.0, 1.2
}

export interface GameState {
  hasStarted: boolean;
  characterId: CharacterId;
  characterName: string;
  currentArea: AreaId;
  playerPos: { x: number; y: number };
  playerDirection: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
  xp: number;
  unlockedAreas: AreaId[];
  collectedCrystals: string[]; // list of target word ids collected
  equippedClothing: string | null;
  clothingInventory: ClothingItem[];
  keysInventory: InventoryItem[];
  treasuresInventory: InventoryItem[];
  completedQuests: string[];
  completedChallenges: string[];
  unlockedObjects: string[];
  currentQuestIndex: number;
  gameCompleted: boolean;
  settings: GameSettings;
  activeCosmetic: string;
  unlockedCosmetics: string[];
  totalEncounters: number;
}
