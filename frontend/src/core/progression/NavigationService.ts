import { NavigateFunction } from 'react-router-dom';
import { regions as regionDefinitions } from '../../data/regions';
import { useRegionStore } from '../../store/regionStore';
import { getRegionForLesson, ALL_LESSONS } from '../../data/allLessons';

let globalNavigate: NavigateFunction | null = null;

export const setGlobalNavigate = (navigate: NavigateFunction) => {
  globalNavigate = navigate;
};

export const NavigationService = {
  /**
   * Navigate to a specific lesson.
   */
  goToLesson(regionId: string, lessonId: string) {
    if (globalNavigate) {
      globalNavigate(`/lesson/${regionId}/${lessonId}`);
    } else {
      window.location.href = `/lesson/${regionId}/${lessonId}`;
    }
  },

  /**
   * Returns directly to the new world map.
   */
  returnToWorldMap() {
    if (globalNavigate) {
      globalNavigate('/world-map');
    } else {
      window.location.href = '/world-map';
    }
  },

  /**
   * Navigate to the boss battle of a region.
   */
  goToBoss(regionId: string) {
    if (globalNavigate) {
      globalNavigate(`/boss/${regionId}`);
    } else {
      window.location.href = `/boss/${regionId}`;
    }
  },

  /**
   * Navigates to a region details view (opens the overlay on the new world map).
   */
  openRegion(regionId: string) {
    if (globalNavigate) {
      globalNavigate(`/region/${regionId}`);
    } else {
      window.location.href = `/region/${regionId}`;
    }
  },

  /**
   * Dynamically resumes progress for the active region.
   */
  resumeProgress() {
    const store = useRegionStore.getState();
    const REGION_ORDER = regionDefinitions.map((r) => r.id);
    
    let activeRegionId = REGION_ORDER[0];
    for (const rId of REGION_ORDER) {
      const r = store.regions[rId];
      if (r && r.regionStatus !== 'locked' && r.regionStatus !== 'completed') {
        activeRegionId = rId;
        break;
      }
    }

    const activeRegion = store.regions[activeRegionId];
    if (activeRegion) {
      if (activeRegion.bossStatus === 'available') {
        this.goToBoss(activeRegionId);
        return;
      }

      // Find first uncompleted lesson
      const regionLessons = Object.keys(ALL_LESSONS).filter(
        (id) => getRegionForLesson(id) === activeRegionId
      );
      regionLessons.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

      const uncompletedLessons = regionLessons.filter(
        (id) => !activeRegion.completedLessons.includes(id)
      );
      const targetLessonId = uncompletedLessons.length > 0 ? uncompletedLessons[0] : regionLessons[0];

      if (targetLessonId) {
        // Map new lesson ID format (e.g. 'v1' instead of '1') if necessary
        // In the new system, we use IDs like 'v1', 'd1' etc.
        // Let's resolve the actual lesson ID from region definitions
        const regionDef = regionDefinitions.find(r => r.id === activeRegionId);
        const matchedLesson = regionDef?.lessons.find(l => l.id.endsWith(targetLessonId) || l.id === targetLessonId);
        const finalId = matchedLesson ? matchedLesson.id : targetLessonId;
        this.goToLesson(activeRegionId, finalId);
      } else {
        this.openRegion(activeRegionId);
      }
    } else {
      this.returnToWorldMap();
    }
  }
};
