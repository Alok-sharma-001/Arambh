import { ProgressStateMachine, LessonState, BossState, RegionState } from './ProgressStateMachine';
import { ProgressValidator } from './ProgressValidator';
import { XPService } from './XPService';
import { UnlockService } from './UnlockService';
import { ProgressPersistence } from './ProgressPersistence';
import { useRegionStore } from '../../store/regionStore';
import { regions as regionDefinitions } from '../../data/regions';

export class ProgressEngine {
  /**
   * Initializes the progression engine on app start, restoring progress and running migrations.
   */
  static init(): void {
    ProgressPersistence.restore();
  }

  /**
   * Safe entry point to start a lesson. Validates that the lesson is unlocked.
   */
  static startLesson(regionId: string, lessonId: string): boolean {
    if (!ProgressValidator.isLessonUnlocked(regionId, lessonId)) {
      console.warn(`ProgressEngine: Blocked attempt to start locked lesson ${lessonId} in ${regionId}`);
      return false;
    }

    console.log(`ProgressEngine: Starting lesson ${lessonId} in region ${regionId}`);
    // Transition to STARTED / IN_PROGRESS
    ProgressPersistence.save();
    return true;
  }

  /**
   * Completes a lesson, granting XP, saving progress, and unlocking the next progression step.
   * Prevents duplicate completions and XP farming.
   */
  static async completeLesson(regionId: string, lessonId: string, xpReward: number): Promise<boolean> {
    // 1. Enforce sequence validation
    if (!ProgressValidator.isLessonUnlocked(regionId, lessonId)) {
      console.warn(`ProgressEngine: Blocked attempt to complete locked lesson ${lessonId}`);
      return false;
    }

    // 2. Grant XP via XPService (checks for duplicate rewards)
    const xpGranted = await XPService.grantLessonXP(regionId, lessonId, xpReward);

    // 3. Mark completed in the region store
    const store = useRegionStore.getState();
    store.completeLesson(regionId, lessonId);

    // 4. Unlock next lesson or boss
    UnlockService.unlockNextLesson(regionId, lessonId);

    // 5. Centralized save
    ProgressPersistence.save();
    return true;
  }

  /**
   * Starts a boss battle. Validates that the boss is unlocked.
   */
  static startBoss(regionId: string): boolean {
    if (!ProgressValidator.isBossUnlocked(regionId)) {
      console.warn(`ProgressEngine: Blocked attempt to start locked boss in ${regionId}`);
      return false;
    }

    console.log(`ProgressEngine: Starting boss in region ${regionId}`);
    ProgressPersistence.save();
    return true;
  }

  /**
   * Completes a boss battle, granting XP, unlocking next region, and saving progress.
   */
  static async completeBoss(regionId: string, xpReward: number): Promise<boolean> {
    if (!ProgressValidator.isBossUnlocked(regionId)) {
      console.warn(`ProgressEngine: Blocked attempt to complete locked boss in ${regionId}`);
      return false;
    }

    // 1. Grant XP safely
    await XPService.grantBossXP(regionId, xpReward);

    // 2. Mark boss and region as completed
    const store = useRegionStore.getState();
    store.completeBoss(regionId);

    // 3. Unlock next region in sequence
    UnlockService.unlockNextRegion(regionId);

    // 4. Save progress
    ProgressPersistence.save();
    return true;
  }

  /**
   * Safe entry point to award generic XP.
   */
  static async grantXP(amount: number, reason: string): Promise<void> {
    await XPService.grantGenericXP(amount, reason);
  }

  /**
   * Computes the deterministic lesson state based on player progress.
   */
  static getLessonState(regionId: string, lessonId: string): LessonState {
    const store = useRegionStore.getState();
    const regionState = store.regions[regionId];

    if (!regionState || !ProgressValidator.isRegionUnlocked(regionId)) {
      return 'LOCKED';
    }

    if (regionState.completedLessons.includes(lessonId)) {
      return 'COMPLETED';
    }

    if (ProgressValidator.isLessonUnlocked(regionId, lessonId)) {
      return 'AVAILABLE';
    }

    return 'LOCKED';
  }

  /**
   * Computes the boss state.
   */
  static getBossState(regionId: string): BossState {
    const store = useRegionStore.getState();
    const regionState = store.regions[regionId];
    if (!regionState || !ProgressValidator.isRegionUnlocked(regionId)) {
      return 'LOCKED';
    }

    if (regionState.bossStatus === 'completed') {
      return 'COMPLETED';
    }

    if (ProgressValidator.isBossUnlocked(regionId)) {
      return 'AVAILABLE';
    }

    return 'LOCKED';
  }

  /**
   * Computes the region state.
   */
  static getRegionState(regionId: string): RegionState {
    const store = useRegionStore.getState();
    const regionState = store.regions[regionId];
    
    if (!regionState || !ProgressValidator.isRegionUnlocked(regionId)) {
      return 'LOCKED';
    }

    if (regionState.regionStatus === 'completed') {
      return 'COMPLETED';
    }

    if (ProgressValidator.isBossUnlocked(regionId)) {
      return 'BOSS_UNLOCKED';
    }

    return 'IN_PROGRESS';
  }
}
