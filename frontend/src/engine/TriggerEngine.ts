import { useProgressionStore } from '../store/progressionStore';
import { useToastStore } from '../store/toastStore';
import { ARTIFACT_REGISTRY } from '../services/artifactService';

import { calculateLevel } from '../services/progressionService';

export class TriggerEngine {
  private static isListening = false;

  static initialize() {
    if (this.isListening) return;
    this.isListening = true;

    // Subscribe to changes in the progression store
    useProgressionStore.subscribe((state, prevState) => {
      if (!state.stats || !prevState.stats) return;

      const currentLevel = calculateLevel(state.stats.total_xp);
      const prevLevel = calculateLevel(prevState.stats.total_xp);

      // Detect Level Up
      if (currentLevel > prevLevel) {
        
        // 1. Check for Artifact Unlocks
        const newArtifact = ARTIFACT_REGISTRY.find(a => a.unlockLevel === currentLevel);
        if (newArtifact) {
          // If we leveled up and there is an artifact for this level, grant it
          const hasArtifact = state.inventory.some(i => i.item_id === newArtifact.id);
          if (!hasArtifact) {
            useProgressionStore.getState().gainItem(newArtifact.id);
            // The progression store internally handles setting artifactRevealEvent
          }
        }

        // 2. Achievements Check
        this.checkAchievements(state);
      }
    });
  }

  static checkAchievements(state: any) {
    // Basic achievement engine: If reaching level 5, give an achievement
    if (state.stats.level === 5) {
      useToastStore.getState().addToast({
        type: 'achievement',
        title: 'Achievement Unlocked: Adept Scholar',
        description: 'You reached Level 5!',
        xpAmount: 100
      });
      // In a full implementation, we'd also push this to the DB via an API call
    }
  }
}
