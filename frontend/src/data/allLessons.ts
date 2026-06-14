import { VARIABLES_FOREST_LESSONS } from './variablesForestData';
import { DATA_TYPES_VALLEY_LESSONS } from './dataTypesValleyData';
import { LOOPS_DESERT_LESSONS } from './loopsDesertData';
import { functionsMountainData } from './functionsMountainData';
import { collectionsKingdomData } from './collectionsKingdomData';
import { oopCastleData } from './oopCastleData';
import { exceptionAbyssData } from './exceptionAbyssData';
import { fileSystemRuinsData } from './fileSystemRuinsData';
import { modulesHarborData } from './modulesHarborData';
import { algorithmArenaData } from './algorithmArenaData';
import { bossGateSagaData } from './bossGateSagaData';

export const ALL_LESSONS = {
  ...VARIABLES_FOREST_LESSONS,
  ...DATA_TYPES_VALLEY_LESSONS,
  ...LOOPS_DESERT_LESSONS,
  ...functionsMountainData,
  ...collectionsKingdomData,
  ...oopCastleData,
  ...exceptionAbyssData,
  ...fileSystemRuinsData,
  ...modulesHarborData,
  ...algorithmArenaData,
  ...bossGateSagaData
};

export function getRegionForLesson(lessonId: string): string {
  if (bossGateSagaData[lessonId]) return 'boss-gate';
  if (algorithmArenaData[lessonId]) return 'algorithm-arena';
  if (modulesHarborData[lessonId]) return 'modules-harbor';
  if (fileSystemRuinsData[lessonId]) return 'file-system-ruins';
  if (exceptionAbyssData[lessonId]) return 'exception-abyss';
  if (oopCastleData[lessonId]) return 'oop-castle';
  if (collectionsKingdomData[lessonId]) return 'collections-kingdom';
  if (functionsMountainData[lessonId]) return 'functions-mountain';
  if (LOOPS_DESERT_LESSONS[lessonId]) return 'loops-desert';
  if (DATA_TYPES_VALLEY_LESSONS[lessonId]) return 'data-types-valley';
  if (VARIABLES_FOREST_LESSONS[lessonId]) return 'variables-forest';
  return 'variables-forest'; // default
}
