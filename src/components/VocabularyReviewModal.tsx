import React, { useState } from 'react';
import { BookOpen, Volume2, Sparkles, X, ChevronRight } from 'lucide-react';
import { VocabularyWord } from '../types';
import { VOCABULARY_LIST } from '../data/vocabulary';
import { AudioButton } from './AudioButton';
import { sound } from '../utils/audio';

interface VocabularyReviewModalProps {
  onPracticeWord?: (wordId: string) => void;
  onClose: () => void;
}

export const VocabularyReviewModal: React.FC<VocabularyReviewModalProps> = ({
  onPracticeWord,
  onClose,
}) => {
  const [selectedWord, setSelectedWord] = useState<VocabularyWord>(VOCABULARY_LIST[0]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-3xl bg-[#061c16]/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(6,28,22,0.95)] border border-emerald-500/30 overflow-hidden flex flex-col p-5 sm:p-6 text-[#f8fafc] max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]">
              <BookOpen size={22} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                10大核心词汇宝典 (Vocabulary Codex)
              </h3>
              <p className="text-xs text-white/50">
                Study exact definitions, authentic sentences, audio, and usage notes
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

        {/* 2-Column Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
          {/* Left Column: Word List */}
          <div className="space-y-1.5 overflow-y-auto max-h-[55vh] md:max-h-[60vh] pr-1">
            {VOCABULARY_LIST.map((word) => {
              const isSelected = selectedWord.id === word.id;
              return (
                <button
                  key={word.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedWord(word);
                  }}
                  className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{word.crystalIcon}</span>
                    <div>
                      <span className="font-black text-base text-white">
                        {word.hanzi}
                      </span>
                      <span className="block text-[11px] text-emerald-400 font-bold">
                        {word.pinyin}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-white/50 max-w-[90px] truncate text-right">
                    {word.english}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Column: Detailed Card for Selected Word */}
          <div className="md:col-span-2 p-5 bg-emerald-950/40 border border-emerald-500/25 rounded-3xl flex flex-col justify-between overflow-y-auto max-h-[60vh]">
            <div>
              {/* Header Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-16 h-16 rounded-2xl bg-black/40 border border-emerald-400/60 flex items-center justify-center text-4xl shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    {selectedWord.crystalIcon}
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                      {selectedWord.hanzi}
                    </h2>
                    <p className="text-sm sm:text-base font-bold text-emerald-300">
                      {selectedWord.pinyin}
                    </p>
                    <p className="text-xs sm:text-sm text-white/70">
                      "{selectedWord.english}"
                    </p>
                  </div>
                </div>

                <AudioButton text={selectedWord.hanzi} size="lg" label="Listen" />
              </div>

              {/* Example Sentence Box */}
              <div className="p-4 bg-black/40 border border-white/10 rounded-2xl shadow-xs mb-4">
                <div className="text-[10px] font-mono font-bold text-emerald-400/80 uppercase tracking-wider mb-1">
                  Authentic Example Sentence • 地道例句
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-lg sm:text-xl font-black text-white">
                    {selectedWord.exampleChinese}
                  </div>
                  <AudioButton text={selectedWord.exampleChinese} size="sm" />
                </div>
                <div className="text-xs font-bold text-emerald-400 mt-0.5">
                  {selectedWord.examplePinyin}
                </div>
                <div className="text-xs text-white/60 italic mt-0.5">
                  "{selectedWord.exampleEnglish}"
                </div>
              </div>

              {/* Grammar & Usage Note */}
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                <div className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider mb-1">
                  Grammar & Context • 用法指南
                </div>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-medium">
                  {selectedWord.grammarNote}
                </p>
              </div>
            </div>

            {/* Quick action button */}
            <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  sound.speakChinese(
                    `${selectedWord.hanzi}。${selectedWord.exampleChinese}`
                  );
                }}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-black rounded-xl text-xs flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95 transition-all"
              >
                <Volume2 size={16} />
                <span>Play Word + Sentence Audio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
