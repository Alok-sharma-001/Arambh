import { motion } from 'framer-motion';
import { PageHeader } from '../components/ui/PageHeader';
import { ArtifactCard } from '../components/artifacts/ArtifactCard';
import { CollectionTracker } from '../components/artifacts/CollectionTracker';
import { ARTIFACT_REGISTRY } from '../services/artifactService';
import { useArtifacts } from '../hooks/useArtifacts';
import { Grid } from 'lucide-react';
import { Card } from '../components/ui/Card';

export default function InventoryPage() {
  const { unlockedArtifacts, hasAllArtifacts } = useArtifacts();
  
  // Set for fast lookup
  const unlockedIds = new Set(unlockedArtifacts.map(a => a.id));

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto space-y-8"
    >
      <PageHeader 
        title="Artifact Inventory" 
        description="Your collection of magical programming artifacts. Find them all to unlock the Boss Gate."
        icon={<Grid className="w-6 h-6" />}
      />

      <motion.div variants={itemVariants}>
        <Card className="p-6 md:p-8 bg-gradient-to-r from-[#13131A] to-[#0D0D12] border-[#181820]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex-1 w-full">
              <CollectionTracker showLabel={false} />
            </div>
            {hasAllArtifacts && (
              <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold rounded-lg whitespace-nowrap animate-pulse">
                Boss Gate Unlocked!
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ARTIFACT_REGISTRY.map((artifact) => (
          <ArtifactCard 
            key={artifact.id} 
            artifact={artifact} 
            isUnlocked={unlockedIds.has(artifact.id)} 
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
