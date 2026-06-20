import { z } from 'zod';

// ============================================================================
// 1. UNIVERSAL KNOWLEDGE GRAPH SCHEMA
// ============================================================================

export const KnowledgeConceptSchema = z.object({
  conceptId: z.string().describe('Unique identifier for the concept (e.g., variables, functions-python)'),
  title: z.string().describe('Human readable title (e.g., Variables)'),
  subject: z.string().describe('Subject area (e.g., python, javascript, dsa)'),
  difficultyScore: z.number().min(1).max(100).describe('1-100 difficulty rating'),
  estimatedLearningTime: z.number().describe('Estimated time to learn in minutes'),
  prerequisiteConcepts: z.array(z.string()).describe('Array of conceptIds required before this'),
  nextConcepts: z.array(z.string()).describe('Array of conceptIds to learn after this'),
  masteryRequirements: z.array(z.string()).describe('Checklist items to achieve mastery'),
  commonFailurePoints: z.array(z.string()).describe('Where learners typically get stuck'),
  recommendedPracticeCount: z.number().describe('Number of practice exercises recommended')
});

export const KnowledgeGraphSchema = z.object({
  subject: z.string(),
  concepts: z.array(KnowledgeConceptSchema)
});

export type KnowledgeConcept = z.infer<typeof KnowledgeConceptSchema>;
export type KnowledgeGraph = z.infer<typeof KnowledgeGraphSchema>;

// ============================================================================
// 2. GAMEPLAY (RPG) GRAPH SCHEMA
// ============================================================================

export const QuestNodeSchema = z.object({
  questId: z.string(),
  questChain: z.string(),
  region: z.string(),
  conceptId: z.string(),
  boss: z.string().nullable(),
  rewards: z.array(z.string()),
  xp: z.number(),
  unlockConditions: z.array(z.string())
});

export const GameplayGraphSchema = z.object({
  subject: z.string(),
  quests: z.array(QuestNodeSchema)
});

export type QuestNode = z.infer<typeof QuestNodeSchema>;
export type GameplayGraph = z.infer<typeof GameplayGraphSchema>;

// ============================================================================
// 3. SOURCE ATTRIBUTION SCHEMA
// ============================================================================

export const SourceAttributionSchema = z.object({
  book: z.string(),
  chapter: z.string(),
  confidence: z.number().min(0).max(1)
});

// ============================================================================
// 4. CONTENT SCHEMA (THE MASSIVE CONCEPT JSON)
// ============================================================================

export const ConceptContentSchema = z.object({
  conceptId: z.string(),
  title: z.string(),
  
  // Explanations
  beginnerExplanation: z.string(),
  intermediateExplanation: z.string(),
  advancedExplanation: z.string(),
  
  // Visuals & Mental Models
  realWorldAnalogy: z.object({
    title: z.string(),
    description: z.string()
  }),
  mentalModel: z.string(),
  visualDiagram: z.string().describe('Mermaid.js diagram string or text representation'),
  executionWalkthrough: z.array(z.string()).describe('Step-by-step execution states'),
  memoryState: z.array(z.object({
    variable: z.string(),
    value: z.string(),
    type: z.string(),
    note: z.string()
  })),
  
  // Practical & Debugging
  commonMistakes: z.array(z.string()),
  debuggingMission: z.object({
    scenario: z.string(),
    brokenCode: z.string(),
    solution: z.string(),
    explanation: z.string()
  }),
  
  // Questions & Exercises
  practiceQuestions: z.array(z.object({
    question: z.string(),
    options: z.array(z.string()),
    correctIndex: z.number(),
    explanation: z.string()
  })),
  challengeQuestions: z.array(z.object({
    question: z.string(),
    hints: z.array(z.string()),
    solution: z.string()
  })),
  projectExercise: z.object({
    title: z.string(),
    description: z.string(),
    requirements: z.array(z.string()),
    starterCode: z.string()
  }),
  
  // RPG Elements
  bossBattle: z.object({
    name: z.string(),
    description: z.string(),
    mechanic: z.string()
  }),
  rewards: z.array(z.string()),
  artifacts: z.array(z.object({
    name: z.string(),
    description: z.string(),
    rarity: z.enum(['Common', 'Rare', 'Epic', 'Legendary'])
  })),
  trainingGround: z.object({
    exercises: z.array(z.string())
  }),
  masteryChecklist: z.array(z.string()),
  
  // AI Mentor Layer
  confusionPoints: z.array(z.string()),
  simplifiedExplanation: z.string(),
  analogyLibrary: z.array(z.string()),
  hintSystem: z.array(z.string()),
  stepByStepHints: z.array(z.string()),
  
  // Memory Retention (Spaced Repetition)
  retentionSystem: z.object({
    revision1: z.string().describe('Day 1 revision question/prompt'),
    revision2: z.string().describe('Day 3 revision question/prompt'),
    revision3: z.string().describe('Day 7 revision question/prompt'),
    revision4: z.string().describe('Day 21 revision question/prompt')
  }),
  
  // Developer Mode (Master Journey)
  developerMode: z.object({
    industryUsage: z.string(),
    performanceConsiderations: z.string(),
    bestPractices: z.array(z.string()),
    antiPatterns: z.array(z.string()),
    architectureNotes: z.string()
  }),
  
  // Adaptive XP Engine
  xpEngine: z.object({
    conceptWeight: z.number().describe('Multiplier based on importance/size'),
    challengeMultiplier: z.number(),
    generatedXP: z.number()
  }),
  
  // Analytics Layer (Initial state placeholders)
  analyticsMetadata: z.object({
    confusionScore: z.number().default(0),
    completionRate: z.number().default(0),
    averageAttempts: z.number().default(0),
    dropoffPoints: z.array(z.string()).default([]),
    mostMissedQuestions: z.array(z.string()).default([])
  }),

  // Source Tracking
  sources: z.array(SourceAttributionSchema)
});

export type ConceptContent = z.infer<typeof ConceptContentSchema>;
