import { useParams, Navigate } from 'react-router-dom';
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

export default function BossBattleRouter() {
  const { regionId } = useParams<{ regionId: string }>();

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
    case 'oop-castle':
      return <TheHollowKing />;
    case 'exception-abyss':
      return <TheChaosCompiler />;
    case 'file-system-ruins':
      return <TheForgottenArchivist />;
    case 'modules-harbor':
      return <TheSmugglerOfSecrets />;
    case 'algorithm-arena':
      return <TheTimeEater />;
    case 'boss-gate':
      return <AncientPythonDragon />;
    default:
      return <Navigate to="/learning-map" replace />;
  }
}
