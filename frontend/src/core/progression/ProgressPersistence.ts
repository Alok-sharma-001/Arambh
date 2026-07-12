import { useRegionStore } from '../../store/regionStore';
import { useProgressionStore } from '../../store/progressionStore';
import { syncManager } from '../../services/syncManager';
import { ProgressMigration } from './ProgressMigration';

export class ProgressPersistence {
  /**
   * Saves the entire progression state and triggers background sync.
   */
  static save(): void {
    console.log('ProgressPersistence: Saving progress...');
    
    // Save progression store stats & inventory
    const progressionState = useProgressionStore.getState();
    if (progressionState.stats) {
      localStorage.setItem('pyquest_progression', JSON.stringify({
        stats: progressionState.stats,
        inventory: progressionState.inventory
      }));
    }

    // Trigger sync
    syncManager.performBackgroundSync();
  }

  /**
   * Restores progression state and executes migrations if necessary.
   */
  static restore(): void {
    console.log('ProgressPersistence: Restoring progress...');
    
    // 1. Run migrations first
    ProgressMigration.runMigration();

    // 2. Fetch progression from store
    useProgressionStore.getState().fetchProgression();
  }
}
