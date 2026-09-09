import { VocabularyWord } from '../types';

export const VOCABULARY_LIST: VocabularyWord[] = [
  {
    id: 'dakai',
    hanzi: '打开',
    pinyin: 'dǎ kāi',
    english: 'open',
    crystalIcon: '🔑',
    crystalName: '打开 Crystal',
    color: '#0284c7', // Sky blue
    exampleChinese: '打开门。',
    examplePinyin: 'Dǎ kāi mén.',
    exampleEnglish: 'Open the door.',
    grammarNote: '“打” (hit/do) + “开” (open) forms a result complement meaning "to open up". Used for doors, books, boxes, and eyes.',
  },
  {
    id: 'chuan',
    hanzi: '穿',
    pinyin: 'chuān',
    english: 'wear / put on',
    crystalIcon: '👕',
    crystalName: '穿 Crystal',
    color: '#10b981', // Emerald
    exampleChinese: '我穿这件衣服。',
    examplePinyin: 'Wǒ chuān zhè jiàn yīfu.',
    exampleEnglish: 'I wear this piece of clothing.',
    grammarNote: 'Used for clothes, shoes, and socks that you put on your body or step through.',
  },
  {
    id: 'shishi',
    hanzi: '试试',
    pinyin: 'shì shi',
    english: 'try / have a try',
    crystalIcon: '🧪',
    crystalName: '试试 Crystal',
    color: '#8b5cf6', // Purple
    exampleChinese: '我穿这件衣服试试。',
    examplePinyin: 'Wǒ chuān zhè jiàn yīfu shì shi.',
    exampleEnglish: 'I will try on this piece of clothing.',
    grammarNote: 'Duplication of the verb “试” (shì) softens the tone, meaning "to give it a quick try".',
  },
  {
    id: 'kanqilai',
    hanzi: '看起来',
    pinyin: 'kàn qǐ lai',
    english: 'looks / seems',
    crystalIcon: '👀',
    crystalName: '看起来 Crystal',
    color: '#f59e0b', // Amber
    exampleChinese: '看起来有点儿大。',
    examplePinyin: 'Kàn qǐ lai yǒu diǎnr dà.',
    exampleEnglish: 'It looks a little big.',
    grammarNote: 'Placed before adjectives or phrases to express an impression based on what you see: "looks like...".',
  },
  {
    id: 'youdianr',
    hanzi: '有点儿',
    pinyin: 'yǒu diǎnr',
    english: 'a little / somewhat',
    crystalIcon: '🌙',
    crystalName: '有点儿 Crystal',
    color: '#ec4899', // Pink
    exampleChinese: '这件衣服有点儿小。',
    examplePinyin: 'Zhè jiàn yīfu yǒu diǎnr xiǎo.',
    exampleEnglish: 'This clothing is a little small.',
    grammarNote: 'Used before an adjective, usually implying a slightly negative or unfavorable degree (e.g., a little too big/small).',
  },
  {
    id: 'zheng',
    hanzi: '正',
    pinyin: 'zhèng',
    english: 'exactly / perfectly',
    crystalIcon: '⭐',
    crystalName: '正 Crystal',
    color: '#eab308', // Gold
    exampleChinese: '正合身！',
    examplePinyin: 'Zhèng hé shēn!',
    exampleEnglish: 'Fits perfectly!',
    grammarNote: 'An adverb meaning "just right", "exactly", or "perfectly", often paired with "好" or "合身".',
  },
  {
    id: 'heshen',
    hanzi: '合身',
    pinyin: 'hé shēn',
    english: 'fits well / good fit',
    crystalIcon: '💎',
    crystalName: '合身 Crystal',
    color: '#06b6d4', // Cyan
    exampleChinese: '这条裤子很合身。',
    examplePinyin: 'Zhè tiáo kùzi hěn hé shēn.',
    exampleEnglish: 'These pants fit well.',
    grammarNote: '“合” (match/conform) + “身” (body). Describes clothing that fits the body accurately.',
  },
  {
    id: 'ai',
    hanzi: '爱',
    pinyin: 'ài',
    english: 'like / love',
    crystalIcon: '❤️',
    crystalName: '爱 Crystal',
    color: '#ef4444', // Red
    exampleChinese: '我爱这件衣服！',
    examplePinyin: 'Wǒ ài zhè jiàn yīfu!',
    exampleEnglish: 'I love this clothing!',
    grammarNote: 'Expresses deep affection or strong liking for a person, hobby, or treasured item.',
  },
  {
    id: 'zhu',
    hanzi: '祝',
    pinyin: 'zhù',
    english: 'wish / express good wishes',
    crystalIcon: '🎁',
    crystalName: '祝 Crystal',
    color: '#f97316', // Orange
    exampleChinese: '祝你快乐！',
    examplePinyin: 'Zhù nǐ kuài lè!',
    exampleEnglish: 'Wish you happiness!',
    grammarNote: 'Used to begin blessings or greetings: 祝 (wish) + [person] + [blessing phrase].',
  },
  {
    id: 'kuaile',
    hanzi: '快乐',
    pinyin: 'kuài lè',
    english: 'happy / joy',
    crystalIcon: '☀️',
    crystalName: '快乐 Crystal',
    color: '#84cc16', // Lime green
    exampleChinese: '祝你每天都快乐！',
    examplePinyin: 'Zhù nǐ měi tiān dōu kuài lè!',
    exampleEnglish: 'Wish you happy every day!',
    grammarNote: 'Can be an adjective ("happy") or a noun ("happiness"). Core part of festival greetings.',
  },
];

export const VOCABULARY_MAP: Record<string, VocabularyWord> = VOCABULARY_LIST.reduce(
  (acc, word) => {
    acc[word.id] = word;
    return acc;
  },
  {} as Record<string, VocabularyWord>
);
