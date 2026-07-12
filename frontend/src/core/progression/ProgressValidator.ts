import { regions as regionDefinitions } from '../../data/regions';
import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';

export class ProgressValidator {
  private static REGION_SEQUENCE = regionDefinitions.map((r) => r.id);

  /**
   * Checks if a region is unlocked and available.
   */
  static isRegionUnlocked(regionId: string): boolean {
    const store = useRegionStore.getState();
    const regionState = store.regions[regionId];
    if (!regionState) {
      return regionId === this.REGION_SEQUENCE[0];
    }
    
    // First region is always unlocked
    if (regionId === this.REGION_SEQUENCE[0]) {
      return true;
    }

    // A region is unlocked if its status is 'available' or 'completed'
    if (regionState.regionStatus === 'available' || regionState.regionStatus === 'completed') {
      return true;
    }

    // Check sequence check fallback
    const currentIndex = this.REGION_SEQUENCE.indexOf(regionId);
    if (currentIndex <= 0) return false;

    const prevRegionId = this.REGION_SEQUENCE[currentIndex - 1];
    const prevRegionState = store.regions[prevRegionId];
    
    // If the previous region is completed, this region is unlocked
    return prevRegionState?.regionStatus === 'completed' || prevRegionState?.bossStatus === 'completed';
  }

  /**
   * Checks if a lesson is unlocked and available for a given region.
   */
  static isLessonUnlocked(regionId: string, lessonId: string): boolean {
    if (!this.isRegionUnlocked(regionId)) {
      return false;
    }

    const regionDef = regionDefinitions.find((r) => r.id === regionId);
    if (!regionDef) return false;

    const lessonIndex = regionDef.lessons.findIndex((l) => l.id === lessonId);
    if (lessonIndex === -1) return false;

    // First lesson in an unlocked region is always available
    if (lessonIndex === 0) return true;

    // Subsequent lessons require the previous lesson to be completed
    const store = useRegionStore.getState();
    const regionState = store.regions[regionId];
    if (!regionState) return false;

    const prevLessonId = regionDef.lessons[lessonIndex - 1].id;
    return regionState.completedLessons.includes(prevLessonId);
  }

  /**
   * Checks if a boss battle is unlocked for a given region.
   */
  static isBossUnlocked(regionId: string): boolean {
    if (!this.isRegionUnlocked(regionId)) {
      return false;
    }

    const regionDef = regionDefinitions.find((r) => r.id === regionId);
    if (!regionDef) return false;

    const store = useRegionStore.getState();
    const regionState = store.regions[regionId];
    if (!regionState) return false;

    // Final boss gate saga has artifact requirement
    if (regionId === 'bossgate-saga') {
      const inventory = useProgressionStore.getState().inventory;
      if (inventory.length < 10) return false;
    }

    // Must have completed all lessons in the region
    return regionState.completedLessons.length >= regionDef.lessons.length;
  }
}
