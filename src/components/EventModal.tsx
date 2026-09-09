import React from 'react';
import { Sparkles, AlertTriangle, ShieldAlert, ArrowRight } from 'lucide-react';
import { Challenge, GameSettings } from '../types';
import { GAME_CHALLENGES } from '../data/challenges';
import { ChallengeModal } from './ChallengeModal';

interface EventModalProps {
  eventId: string;
  settings: GameSettings;
  onSuccess: (targetWordId: string, xp: number) => void;
  onClose: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  eventId,
  settings,
  onSuccess,
  onClose,
}) => {
  const challenge = GAME_CHALLENGES[eventId];

  if (!challenge) return null;

  return (
    <ChallengeModal
      challenge={challenge}
      settings={settings}
      onSuccess={(wId, xp) => {
        onSuccess(wId, xp);
      }}
      onClose={onClose}
    />
  );
};
