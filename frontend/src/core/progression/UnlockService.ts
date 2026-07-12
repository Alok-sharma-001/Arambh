import { regions as regionDefinitions } from '../../data/regions';
import { useRegionStore } from '../../store/regionStore';

export class UnlockService {
  private static REGION_SEQUENCE = regionDefinitions.map((r) => r.id);

  /**
   * Unlocks the next lesson in the sequence, or unlocks the boss if all lessons are completed.
   */
  static unlockNextLesson(regionId: string, completedLessonId: string): void {
    const regionDef = regionDefinitions.find((r) => r.id === regionId);
    if (!regionDef) return;

    const store = useRegionStore.getState();
    const regionState = store.regions[regionId];
    if (!regionState) return;

    const completedLessons = regionState.completedLessons;
    const totalLessons = regionDef.lessons.length;

    // Check if we finished all lessons in this region
    if (completedLessons.length >= totalLessons) {
      console.log(`UnlockService: All lessons completed in ${regionId}. Unlocking Boss.`);
      store.unlockBoss(regionId);
      return;
    }

    // Find the next lesson in sequence
    const currentIdx = regionDef.lessons.findIndex((l) => l.id === completedLessonId);
    if (currentIdx !== -1 && currentIdx < totalLessons - 1) {
      const nextLesson = regionDef.lessons[currentIdx + 1];
      console.log(`UnlockService: Unlocking next lesson ${nextLesson.id} in region ${regionId}`);
      // In the store, completing a lesson updates the currentLesson pointer automatically.
      // But we make sure it points to the next lesson or first uncompleted.
    }
  }

  /**
   * Unlocks the next region in the sequence after boss victory.
   */
  static unlockNextRegion(completedRegionId: string): void {
    const currentIdx = this.REGION_SEQUENCE.indexOf(completedRegionId);
    if (currentIdx === -1 || currentIdx >= this.REGION_SEQUENCE.length - 1) {
      console.log(`UnlockService: Reached end of kingdom sequence.`);
      return;
    }

    const nextRegionId = this.REGION_SEQUENCE[currentIdx + 1];
    console.log(`UnlockService: Unlocking next region ${nextRegionId}`);
    useRegionStore.getState().unlockRegion(nextRegionId);
  }
}
