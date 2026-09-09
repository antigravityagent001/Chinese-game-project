import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, AlertCircle, HelpCircle, RotateCcw, Volume2, ArrowRight, X } from 'lucide-react';
import { Challenge, GameSettings, VocabularyWord } from '../types';
import { VOCABULARY_MAP } from '../data/vocabulary';
import { AudioButton } from './AudioButton';
import { sound } from '../utils/audio';

interface ChallengeModalProps {
  challenge: Challenge;
  settings: GameSettings;
  onSuccess: (targetWordId: string, xp: number) => void;
  onClose: () => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  challenge,
  settings,
  onSuccess,
  onClose,
}) => {
  const targetWord = VOCABULARY_MAP[challenge.targetWordId];

  // Feedback states
  const [feedback, setFeedback] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [showHint, setShowHint] = useState<boolean>(false);

  // Type 1: Multiple Choice
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Type 2: Word Order
  const [availableTokens, setAvailableTokens] = useState<string[]>([]);
  const [selectedTokens, setSelectedTokens] = useState<string[]>([]);

  // Type 3: Fill in Blank
  const [selectedBlank, setSelectedBlank] = useState<string | null>(null);

  // Type 4: Match
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedChineseMatch, setSelectedChineseMatch] = useState<string | null>(null);
  const [selectedEnglishMatch, setSelectedEnglishMatch] = useState<string | null>(null);

  // Type 5: Dialogue
  const [selectedReplyId, setSelectedReplyId] = useState<string | null>(null);
  const [dialogueReaction, setDialogueReaction] = useState<string | null>(null);

  // Initialize word ordering tokens if applicable
  useEffect(() => {
    if (challenge.type === 'word-order' && challenge.wordTokens) {
      const shuffled = [...challenge.wordTokens].sort(() => Math.random() - 0.5);
      setAvailableTokens(shuffled);
      setSelectedTokens([]);
    }
  }, [challenge]);

  // Handle Type 1: Option Choice Submit
  const handleOptionSubmit = (optionId: string) => {
    setSelectedOptionId(optionId);
    const option = challenge.options?.find((o) => o.id === optionId);
    if (option?.isCorrect) {
      sound.playCorrect();
      setFeedback('correct');
      setFeedbackMsg(challenge.explanation);
    } else {
      sound.playIncorrect();
      setFeedback('incorrect');
      setFeedbackMsg('Not quite! ' + challenge.hint);
    }
  };

  // Handle Type 2: Token Add/Remove
  const handleAddToken = (token: string, idx: number) => {
    sound.playClick();
    const newAvail = [...availableTokens];
    newAvail.splice(idx, 1);
    setAvailableTokens(newAvail);
    setSelectedTokens([...selectedTokens, token]);
  };

  const handleRemoveToken = (token: string, idx: number) => {
    sound.playClick();
    const newSelected = [...selectedTokens];
    newSelected.splice(idx, 1);
    setSelectedTokens(newSelected);
    setAvailableTokens([...availableTokens, token]);
  };

  const handleCheckWordOrder = () => {
    if (!challenge.correctOrder) return;
    const isOrderCorrect =
      selectedTokens.length === challenge.correctOrder.length &&
      selectedTokens.every((token, index) => token === challenge.correctOrder![index]);

    if (isOrderCorrect) {
      sound.playCorrect();
      setFeedback('correct');
      setFeedbackMsg(challenge.explanation);
    } else {
      sound.playIncorrect();
      setFeedback('incorrect');
      setFeedbackMsg('Check the word sequence! ' + challenge.hint);
    }
  };

  // Handle Type 3: Fill Blank
  const handleSelectBlank = (opt: string) => {
    sound.playClick();
    setSelectedBlank(opt);
    if (opt === challenge.correctBlank) {
      sound.playCorrect();
      setFeedback('correct');
      setFeedbackMsg(challenge.explanation);
    } else {
      sound.playIncorrect();
      setFeedback('incorrect');
      setFeedbackMsg('Try again! ' + challenge.hint);
    }
  };

  // Handle Type 4: Matching logic
  const handleSelectChinese = (pairId: string) => {
    sound.playClick();
    setSelectedChineseMatch(pairId);
    if (selectedEnglishMatch) {
      checkMatch(pairId, selectedEnglishMatch);
    }
  };

  const handleSelectEnglish = (pairId: string) => {
    sound.playClick();
    setSelectedEnglishMatch(pairId);
    if (selectedChineseMatch) {
      checkMatch(selectedChineseMatch, pairId);
    }
  };

  const checkMatch = (cnId: string, enId: string) => {
    if (cnId === enId) {
      sound.playCorrect();
      const newMatched = [...matchedPairs, cnId];
      setMatchedPairs(newMatched);
      setSelectedChineseMatch(null);
      setSelectedEnglishMatch(null);

      if (challenge.matchPairs && newMatched.length === challenge.matchPairs.length) {
        setFeedback('correct');
        setFeedbackMsg(challenge.explanation);
      }
    } else {
      sound.playIncorrect();
      setTimeout(() => {
        setSelectedChineseMatch(null);
        setSelectedEnglishMatch(null);
      }, 500);
    }
  };

  // Handle Type 5: Dialogue choice
  const handleSelectReply = (replyId: string) => {
    setSelectedReplyId(replyId);
    const reply = challenge.dialogueReplies?.find((r) => r.id === replyId);
    if (reply) {
      setDialogueReaction(reply.reaction);
      if (reply.isCorrect) {
        sound.playCorrect();
        setFeedback('correct');
        setFeedbackMsg(challenge.explanation);
      } else {
        sound.playIncorrect();
        setFeedback('incorrect');
        setFeedbackMsg(challenge.hint);
      }
    }
  };

  // On Complete & Claim Reward
  const handleClaim = () => {
    sound.playCrystalCollect();
    onSuccess(challenge.targetWordId, challenge.xpReward);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="relative w-full max-w-2xl bg-[#061c16]/95 backdrop-blur-2xl rounded-3xl shadow-[0_0_60px_rgba(6,28,22,0.95)] border border-emerald-500/30 overflow-hidden flex flex-col p-5 sm:p-7 text-[#f8fafc] animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        {/* Header with target word crystal badge */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-3xl shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {targetWord?.crystalIcon || '⭐'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {challenge.title}
                </h3>
                <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                  +{challenge.xpReward} XP
                </span>
              </div>
              <p className="text-xs text-emerald-400 font-bold mt-0.5">
                Target Word: {targetWord?.hanzi} ({targetWord?.pinyin}) — {targetWord?.english}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white border border-white/10 cursor-pointer transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Challenge Instruction */}
        <div className="mb-4">
          <p className="text-sm sm:text-base font-semibold text-white/90 leading-relaxed">
            {challenge.instruction}
          </p>
          {challenge.instructionCn && (
            <p className="text-xs font-bold text-emerald-400 mt-0.5">
              {challenge.instructionCn}
            </p>
          )}
        </div>

        {/* Prompt Card */}
        <div className="bg-emerald-950/40 border border-emerald-500/25 rounded-2xl p-4 mb-5 flex items-center justify-between gap-3 shadow-inner">
          <div>
            <div className="text-base sm:text-lg font-black text-white">
              {challenge.prompt}
            </div>
            {settings.showPinyin && challenge.promptPinyin && (
              <div className="text-xs font-bold text-emerald-400 mt-0.5">
                {challenge.promptPinyin}
              </div>
            )}
          </div>
          <AudioButton text={challenge.prompt} size="md" label="Pronounce" />
        </div>

        {/* --- CHALLENGE TYPE 1: MULTIPLE CHOICE --- */}
        {challenge.type === 'choice' && challenge.options && (
          <div className="space-y-2.5 mb-5">
            {challenge.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <button
                  key={opt.id}
                  id={`opt-${opt.id}`}
                  type="button"
                  onClick={() => handleOptionSubmit(opt.id)}
                  disabled={feedback === 'correct'}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                    isSelected && feedback === 'correct'
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold ring-2 ring-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : isSelected && feedback === 'incorrect'
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                      : 'bg-white/5 hover:bg-emerald-500/15 border-white/10 hover:border-emerald-500/40 text-white'
                  }`}
                >
                  <div>
                    <span className="text-base sm:text-lg font-black">
                      {opt.text}
                    </span>
                    {settings.showPinyin && opt.pinyin && (
                      <span className="block text-xs font-bold text-emerald-400">
                        {opt.pinyin}
                      </span>
                    )}
                    {settings.showEnglish && opt.english && (
                      <span className="block text-xs text-white/50 italic">
                        {opt.english}
                      </span>
                    )}
                  </div>
                  <AudioButton text={opt.text} size="sm" />
                </button>
              );
            })}
          </div>
        )}

        {/* --- CHALLENGE TYPE 2: WORD ORDER --- */}
        {challenge.type === 'word-order' && (
          <div className="space-y-4 mb-5">
            {/* Selected Sequence Box */}
            <div className="p-4 bg-black/40 border border-dashed border-emerald-500/30 rounded-2xl min-h-[64px] flex flex-wrap items-center gap-2">
              {selectedTokens.length === 0 ? (
                <span className="text-xs text-white/40 italic">
                  Tap word tokens below in the correct order...
                </span>
              ) : (
                selectedTokens.map((token, idx) => (
                  <button
                    key={`${token}-${idx}`}
                    type="button"
                    onClick={() => handleRemoveToken(token, idx)}
                    disabled={feedback === 'correct'}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-sm sm:text-base shadow-[0_0_10px_rgba(16,185,129,0.4)] flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{token}</span>
                    <span className="text-xs opacity-70">✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Available Tokens to Tap */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {availableTokens.map((token, idx) => (
                <button
                  key={`${token}-${idx}`}
                  type="button"
                  onClick={() => handleAddToken(token, idx)}
                  disabled={feedback === 'correct'}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-white font-bold text-sm sm:text-base shadow-sm active:scale-95 cursor-pointer transition-all"
                >
                  {token}
                </button>
              ))}
            </div>

            {/* Submit Sequence Button */}
            {feedback !== 'correct' && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    if (challenge.wordTokens) {
                      setAvailableTokens([...challenge.wordTokens]);
                      setSelectedTokens([]);
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-white/50 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>
                <button
                  type="button"
                  onClick={handleCheckWordOrder}
                  disabled={selectedTokens.length === 0}
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 disabled:from-white/10 disabled:to-white/10 disabled:text-white/30 text-black font-black rounded-xl text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer active:scale-95 transition-all"
                >
                  Check Sentence / 检查句子
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- CHALLENGE TYPE 3: FILL IN THE BLANK --- */}
        {challenge.type === 'fill-blank' && (
          <div className="space-y-4 mb-5">
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/25 rounded-2xl text-center">
              <span className="text-lg sm:text-xl font-black text-emerald-200">
                {challenge.blankSentence?.replace('______', selectedBlank || '______')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {challenge.blankOptions?.map((opt) => {
                const isSelected = selectedBlank === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => handleSelectBlank(opt)}
                    disabled={feedback === 'correct'}
                    className={`p-3 rounded-xl border text-center font-black text-base sm:text-lg transition-all cursor-pointer ${
                      isSelected && feedback === 'correct'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40'
                        : isSelected && feedback === 'incorrect'
                        ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                        : 'bg-white/5 hover:bg-emerald-500/15 border-white/10 hover:border-emerald-500/40 text-white'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* --- CHALLENGE TYPE 4: MATCHING --- */}
        {challenge.type === 'match' && challenge.matchPairs && (
          <div className="space-y-4 mb-5">
            <div className="grid grid-cols-2 gap-3">
              {/* Chinese column */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400/80">
                  Chinese / 中文
                </span>
                {challenge.matchPairs.map((pair) => {
                  const isMatched = matchedPairs.includes(pair.id);
                  const isSelected = selectedChineseMatch === pair.id;
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      onClick={() => !isMatched && handleSelectChinese(pair.id)}
                      disabled={isMatched}
                      className={`w-full p-2.5 rounded-xl border text-left font-black text-sm sm:text-base flex items-center justify-between cursor-pointer transition-all ${
                        isMatched
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400/50 opacity-40'
                          : isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      <span>{pair.chinese}</span>
                      <AudioButton text={pair.chinese} size="sm" />
                    </button>
                  );
                })}
              </div>

              {/* English column */}
              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400/80">
                  English / 英文
                </span>
                {challenge.matchPairs.map((pair) => {
                  const isMatched = matchedPairs.includes(pair.id);
                  const isSelected = selectedEnglishMatch === pair.id;
                  return (
                    <button
                      key={pair.id}
                      type="button"
                      onClick={() => !isMatched && handleSelectEnglish(pair.id)}
                      disabled={isMatched}
                      className={`w-full p-2.5 rounded-xl border text-left font-bold text-xs sm:text-sm cursor-pointer transition-all ${
                        isMatched
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400/50 opacity-40'
                          : isSelected
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-2 ring-emerald-400/40'
                          : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                      }`}
                    >
                      {pair.english}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- CHALLENGE TYPE 5: DIALOGUE REPLIES --- */}
        {challenge.type === 'dialogue' && challenge.dialogueReplies && (
          <div className="space-y-3 mb-5">
            {/* NPC Prompt Box */}
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/25 rounded-2xl flex items-start gap-3">
              <span className="text-3xl">{challenge.dialogueSpeakerAvatar || '🪞'}</span>
              <div>
                <div className="text-xs font-bold text-emerald-400">
                  {challenge.dialogueSpeaker}
                </div>
                <div className="text-base font-bold text-white">
                  {challenge.dialoguePrompt}
                </div>
              </div>
            </div>

            {/* Reaction if chosen */}
            {dialogueReaction && (
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white/80 italic">
                {dialogueReaction}
              </div>
            )}

            {/* Player replies */}
            <div className="space-y-2">
              {challenge.dialogueReplies.map((reply) => {
                const isSelected = selectedReplyId === reply.id;
                return (
                  <button
                    key={reply.id}
                    type="button"
                    onClick={() => handleSelectReply(reply.id)}
                    disabled={feedback === 'correct'}
                    className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected && reply.isCorrect
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-bold ring-2 ring-emerald-400/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                        : isSelected && !reply.isCorrect
                        ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                        : 'bg-white/5 hover:bg-emerald-500/15 border-white/10 hover:border-emerald-500/40 text-white'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm sm:text-base">
                        {reply.text}
                      </span>
                      {settings.showPinyin && reply.pinyin && (
                        <span className="block text-xs text-emerald-400 font-semibold">
                          {reply.pinyin}
                        </span>
                      )}
                      {settings.showEnglish && reply.english && (
                        <span className="block text-xs text-white/50 italic">
                          {reply.english}
                        </span>
                      )}
                    </div>
                    <AudioButton text={reply.text} size="sm" />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Feedback Section */}
        {feedback !== 'idle' && (
          <div
            className={`p-3.5 rounded-2xl mb-4 flex items-start gap-2.5 ${
              feedback === 'correct'
                ? 'bg-emerald-500/20 border border-emerald-400/60 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'bg-rose-950/40 border border-rose-500/50 text-rose-200'
            }`}
          >
            {feedback === 'correct' ? (
              <CheckCircle2 size={20} className="text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle size={20} className="text-rose-400 mt-0.5 shrink-0" />
            )}
            <div className="text-xs sm:text-sm font-semibold">{feedbackMsg}</div>
          </div>
        )}

        {/* Bottom Actions: Hint toggle & Claim Button */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <HelpCircle size={14} />
            <span>{showHint ? 'Hide Hint' : 'Need a Hint? (提示)'}</span>
          </button>

          {feedback === 'correct' ? (
            <button
              type="button"
              id="challenge-claim-btn"
              onClick={handleClaim}
              className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 text-black font-black text-sm sm:text-base shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center gap-2 cursor-pointer active:scale-95 animate-pulse transition-all"
            >
              <Sparkles size={18} />
              <span>Claim Crystal & Rewards / 领取奖励</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-white/40 hover:text-white cursor-pointer transition-colors"
            >
              Try Later (稍后再试)
            </button>
          )}
        </div>

        {/* Hint Box */}
        {showHint && (
          <div className="mt-3 p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white/70 italic">
            💡 Hint: {challenge.hint}
          </div>
        )}
      </div>
    </div>
  );
};
