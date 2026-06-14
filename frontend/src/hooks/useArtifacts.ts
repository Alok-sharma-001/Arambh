import { useProgressionStore } from '../store/progressionStore';
import { ARTIFACT_REGISTRY, getArtifactById } from '../services/artifactService';

export function useArtifacts() {
  const { inventory, artifactRevealEvent, dismissArtifactReveal } = useProgressionStore();

  const acquiredIds = new Set(inventory.map(item => item.item_id));

  const unlockedArtifacts = ARTIFACT_REGISTRY.filter(a => acquiredIds.has(a.id));
  const lockedArtifacts = ARTIFACT_REGISTRY.filter(a => !acquiredIds.has(a.id));

  const totalCount = ARTIFACT_REGISTRY.length;
  const collectedCount = unlockedArtifacts.length;
  const progressPercent = totalCount > 0 ? (collectedCount / totalCount) * 100 : 0;

  // Next artifact is the first locked one (ordered by unlockLevel)
  const sortedLocked = [...lockedArtifacts].sort((a, b) => a.unlockLevel - b.unlockLevel);
  const nextArtifact = sortedLocked.length > 0 ? sortedLocked[0] : null;

  const revealedArtifact = artifactRevealEvent ? getArtifactById(artifactRevealEvent.artifactId) : null;

  return {
    unlockedArtifacts,
    lockedArtifacts,
    totalCount,
    collectedCount,
    progressPercent,
    nextArtifact,
    hasAllArtifacts: collectedCount === totalCount,
    
    // Reveal event
    revealedArtifact,
    dismissArtifactReveal,
  };
}
