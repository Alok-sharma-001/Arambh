import { useProgressionStore } from '../../store/progressionStore';
import { useRegionStore } from '../../store/regionStore';

export class XPService {
  /**
   * Safe method to award XP for lesson completion.
   * Ensures XP is only awarded once.
   */
  static async grantLessonXP(regionId: string, lessonId: string, xpReward: number): Promise<boolean> {
    const regionStore = useRegionStore.getState();
    const regionState = regionStore.regions[regionId];
    
    // Check if already completed
    const isCompleted = regionState?.completedLessons.includes(lessonId) || false;
    
    if (isCompleted) {
      console.log(`XPService: Lesson ${lessonId} already completed. No duplicate XP awarded.`);
      return false; // Already completed, no XP granted
    }

    console.log(`XPService: Granting ${xpReward} XP for Lesson ${lessonId}`);
    await useProgressionStore.getState().gainXP(xpReward, `Completed lesson: ${lessonId}`);
    return true;
  }

  /**
   * Safe method to award XP for boss completion.
   * Ensures XP is only awarded once.
   */
  static async grantBossXP(regionId: string, xpReward: number): Promise<boolean> {
    const regionStore = useRegionStore.getState();
    const regionState = regionStore.regions[regionId];
    
    const isCompleted = regionState?.bossStatus === 'completed';
    
    if (isCompleted) {
      console.log(`XPService: Boss for ${regionId} already completed. No duplicate XP awarded.`);
      return false;
    }

    console.log(`XPService: Granting ${xpReward} XP for Boss in ${regionId}`);
    await useProgressionStore.getState().gainXP(xpReward, `Defeated Boss in: ${regionId}`);
    return true;
  }

  /**
   * Awards generic XP for daily reward or achievement.
   */
  static async grantGenericXP(amount: number, reason: string): Promise<void> {
    await useProgressionStore.getState().gainXP(amount, reason);
  }
}
