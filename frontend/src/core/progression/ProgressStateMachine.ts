export type LessonState = 'LOCKED' | 'AVAILABLE' | 'STARTED' | 'DEBUGGING' | 'VALIDATED' | 'COMPLETED';
export type BossState = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';
export type RegionState = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'BOSS_UNLOCKED' | 'COMPLETED';

export class ProgressStateMachine {
  /**
   * Validates if a transition between lesson states is allowed.
   */
  static validateLessonTransition(from: LessonState, to: LessonState): boolean {
    if (from === to) return true;

    switch (from) {
      case 'LOCKED':
        return to === 'AVAILABLE';
      case 'AVAILABLE':
        return to === 'STARTED';
      case 'STARTED':
        return to === 'DEBUGGING' || to === 'AVAILABLE';
      case 'DEBUGGING':
        return to === 'VALIDATED' || to === 'STARTED' || to === 'AVAILABLE';
      case 'VALIDATED':
        return to === 'COMPLETED' || to === 'DEBUGGING' || to === 'STARTED';
      case 'COMPLETED':
        // Once completed, it cannot go back to any other state
        return false;
      default:
        return false;
    }
  }

  /**
   * Validates if a transition between boss states is allowed.
   */
  static validateBossTransition(from: BossState, to: BossState): boolean {
    if (from === to) return true;

    switch (from) {
      case 'LOCKED':
        return to === 'AVAILABLE';
      case 'AVAILABLE':
        return to === 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return to === 'COMPLETED' || to === 'AVAILABLE';
      case 'COMPLETED':
        // Boss completed remains completed
        return false;
      default:
        return false;
    }
  }

  /**
   * Validates if a transition between region states is allowed.
   */
  static validateRegionTransition(from: RegionState, to: RegionState): boolean {
    if (from === to) return true;

    switch (from) {
      case 'LOCKED':
        return to === 'AVAILABLE';
      case 'AVAILABLE':
        return to === 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return to === 'BOSS_UNLOCKED' || to === 'AVAILABLE';
      case 'BOSS_UNLOCKED':
        return to === 'COMPLETED' || to === 'IN_PROGRESS';
      case 'COMPLETED':
        // Region completed remains completed
        return false;
      default:
        return false;
    }
  }
}
