import { Diamond, Compass, Scroll, Hexagon, Component, LucideIcon } from 'lucide-react';

export interface ArtifactDefinition {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  unlockLevel: number;
}

export const ARTIFACT_REGISTRY: ArtifactDefinition[] = [
  { 
    id: 'variables_crystal', 
    name: 'Variables Crystal', 
    description: 'The crystal of stored knowledge. It hums with the energy of preserved data.',
    icon: Diamond, 
    color: 'text-game-purple', 
    bg: 'bg-game-purple/10',
    unlockLevel: 3 
  },
  { 
    id: 'loop_compass', 
    name: 'Loop Compass', 
    description: 'A magical device that allows you to traverse the same path repeatedly without getting lost.',
    icon: Compass, 
    color: 'text-purple-400', 
    bg: 'bg-purple-500/10',
    unlockLevel: 5 
  },
  { 
    id: 'function_scroll', 
    name: 'Function Scroll', 
    description: 'An ancient parchment containing reusable spells of computation.',
    icon: Scroll, 
    color: 'text-emerald-400', 
    bg: 'bg-emerald-500/10',
    unlockLevel: 7 
  },
  { 
    id: 'oop_crown', 
    name: 'OOP Crown', 
    description: 'The royal crown of the Object King. Grants the power of inheritance and encapsulation.',
    icon: Hexagon, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/10',
    unlockLevel: 10 
  },
  { 
    id: 'algorithm_orb', 
    name: 'Algorithm Orb', 
    description: 'A sphere of pure logic. It optimizes your thoughts and sharpens your decisions.',
    icon: Component, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    unlockLevel: 15 
  },
  { 
    id: 'type_prism', 
    name: 'Type Prism', 
    description: 'An ancient prism capable of revealing the true nature of any value.',
    icon: Component, 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-500/10',
    unlockLevel: 5 
  },
];

export function getArtifactById(id: string): ArtifactDefinition | undefined {
  return ARTIFACT_REGISTRY.find(a => a.id === id);
}

export function getArtifactForLevel(level: number): ArtifactDefinition | undefined {
  return ARTIFACT_REGISTRY.find(a => a.unlockLevel === level);
}
