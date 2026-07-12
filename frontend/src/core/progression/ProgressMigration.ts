import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';

export class ProgressMigration {
  private static CURRENT_VERSION = 3;

  /**
   * Performs migrations on progress data if loaded version is outdated.
   */
  static runMigration(): void {
    try {
      const storedVersionStr = localStorage.getItem('pyquest_progression_version');
      const storedVersion = storedVersionStr ? parseInt(storedVersionStr, 10) : 1;

      if (storedVersion >= this.CURRENT_VERSION) {
        console.log(`ProgressMigration: Save version is up to date (v${storedVersion}).`);
        return;
      }

      console.log(`ProgressMigration: Migrating save from v${storedVersion} to v${this.CURRENT_VERSION}...`);

      // Migration from v1/v2 to v3 (centralized state machine preparation)
      if (storedVersion < 3) {
        // Enforce that completed lessons have matching states
        const regionStore = useRegionStore.getState();
        const regions = { ...regionStore.regions };

        Object.keys(regions).forEach((regionId) => {
          const region = regions[regionId];
          if (region) {
            // Self-healing check: if completion percentage is 100 but boss is locked, unlock the boss
            if (region.completedLessons.length > 0 && region.bossStatus === 'locked') {
              // Get actual lesson count
              const definition = require('../../data/regions').regions.find((r: any) => r.id === regionId);
              if (definition && region.completedLessons.length >= definition.lessons.length) {
                region.bossStatus = 'available';
              }
            }
          }
        });

        // Save migrated regions back
        useRegionStore.setState({ regions });
      }

      localStorage.setItem('pyquest_progression_version', this.CURRENT_VERSION.toString());
      console.log(`ProgressMigration: Migration complete. Now at v${this.CURRENT_VERSION}.`);
    } catch (error) {
      console.error('ProgressMigration: Migration failed', error);
    }
  }
}
