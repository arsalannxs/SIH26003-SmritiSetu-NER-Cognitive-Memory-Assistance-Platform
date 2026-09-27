import { DifficultyLevel, GameResult } from '../types';

export interface DifficultyEvaluation {
  currentDifficulty: DifficultyLevel;
  suggestedDifficulty: DifficultyLevel;
  reason: string;
  recentAccuracyAverage: number;
  recentSessionsCount: number;
}

const DIFFICULTY_HIERARCHY: DifficultyLevel[] = ['easy', 'easy_plus', 'medium', 'hard'];

export const adaptiveDifficultyEngine = {
  /**
   * Evaluates recent performance (e.g. last 3-5 sessions) and calculates the gentle next activity difficulty.
   * STRICT SAFETY RULE: This is an activity engagement adjustment, NOT a clinical dementia assessment.
   */
  evaluateDifficulty(
    current: DifficultyLevel,
    recentResults: GameResult[]
  ): DifficultyEvaluation {
    if (recentResults.length === 0) {
      return {
        currentDifficulty: current,
        suggestedDifficulty: current,
        reason: 'Initial comforting starting level selected.',
        recentAccuracyAverage: 80,
        recentSessionsCount: 0,
      };
    }

    const recent = recentResults.slice(0, 5);
    const avgAccuracy = Math.round(
      recent.reduce((sum, r) => sum + r.accuracy, 0) / recent.length
    );
    const currentIndex = DIFFICULTY_HIERARCHY.indexOf(current);

    let suggested = current;
    let reason = 'Comfortable pace maintained.';

    // If consistently high accuracy (>= 85%) and completed without excessive attempts
    if (avgAccuracy >= 85 && recent.length >= 2) {
      if (currentIndex < DIFFICULTY_HIERARCHY.length - 1) {
        suggested = DIFFICULTY_HIERARCHY[currentIndex + 1];
        reason = `Recent focus was steady (${avgAccuracy}% accuracy). Gently stepping up to ${suggested.replace('_', ' ')}.`;
      } else {
        reason = `Excellent focus maintained at highest engagement level (${avgAccuracy}%).`;
      }
    } 
    // If user struggled (accuracy < 60%) or high attempts
    else if (avgAccuracy < 60 && currentIndex > 0) {
      suggested = DIFFICULTY_HIERARCHY[currentIndex - 1];
      reason = `Easing activity difficulty to ensure a calm, relaxing experience.`;
    }

    return {
      currentDifficulty: current,
      suggestedDifficulty: suggested,
      reason,
      recentAccuracyAverage: avgAccuracy,
      recentSessionsCount: recent.length,
    };
  },

  getDifficultyLabel(level: DifficultyLevel): string {
    switch (level) {
      case 'easy':
        return 'Gentle (Easy)';
      case 'easy_plus':
        return 'Mild (Easy+)';
      case 'medium':
        return 'Engaging (Medium)';
      case 'hard':
        return 'Advanced (Hard)';
      default:
        return 'Gentle';
    }
  },
};
