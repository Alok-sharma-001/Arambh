import { useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { analyticsApi } from '@/services/analyticsApi';
import CorruptedGuardian from './CorruptedGuardian';
import TypeShapeshifter from './TypeShapeshifter';
import InfiniteSerpent from './InfiniteSerpent';
import TheForgottenArchitect from './TheForgottenArchitect';
import TheDataHoarder from './TheDataHoarder';
import TheHollowKing from './TheHollowKing';
import TheChaosCompiler from './TheChaosCompiler';
import TheForgottenArchivist from './TheForgottenArchivist';
import TheSmugglerOfSecrets from './TheSmugglerOfSecrets';
import TheTimeEater from './TheTimeEater';
import AncientPythonDragon from './AncientPythonDragon';
import InfiniteStreamSentinel from './InfiniteStreamSentinel';

export default function BossBattleRouter() {
  const { regionId } = useParams<{ regionId: string }>();

  useEffect(() => {
    if (regionId) {
      analyticsApi.logEvent('boss_attempt', { region_id: regionId });
    }
  }, [regionId]);

  switch (regionId) {
    case 'variables-forest':
      return <CorruptedGuardian />;
    case 'data-types-valley':
      return <TypeShapeshifter />;
    case 'loops-desert':
      return <InfiniteSerpent />;
    case 'functions-mountain':
      return <TheForgottenArchitect />;
    case 'collections-kingdom':
      return <TheDataHoarder />;
    case 'oop-citadel':
      return <TheHollowKing />;
    case 'exception-abyss':
      return <TheChaosCompiler />;
    case 'filesystem-ruins':
      return <TheForgottenArchivist />;
    case 'modules-harbor':
      return <TheSmugglerOfSecrets />;
    case 'algorithm-arena':
      return <TheTimeEater />;
    case 'iterator-isles':
      return <InfiniteStreamSentinel />;
    case 'bossgate-saga':
      return <AncientPythonDragon />;
    default:
      return <Navigate to="/learning-map" replace />;
  }
}
