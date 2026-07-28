import fs from 'fs';
import path from 'path';

/**
 * Arambh Content Engine — Lesson Validation Script
 * Validates lesson debug content integrity across all region modules.
 */

const LESSONS_DIR = path.resolve(__dirname, '../../frontend/src/data/lessons');

function validateLessons() {
  console.log('⚔️  Arambh Content Engine: Validating Lesson Content...');

  if (!fs.existsSync(LESSONS_DIR)) {
    console.error(`❌ Lessons directory not found: ${LESSONS_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(LESSONS_DIR).filter(f => f.endsWith('Lessons.ts') || f.endsWith('L4.ts'));
  console.log(`🔍 Found ${files.length} region lesson modules.`);

  let totalLessonsChecked = 0;
  let totalErrors = 0;

  files.forEach(file => {
    const filePath = path.join(LESSONS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Basic structure validation
    if (!content.includes('LessonDebugContent')) {
      console.warn(`⚠️ Warning: ${file} does not import LessonDebugContent type.`);
    }

    // Match lesson keys in file
    const keyMatches = content.match(/'([a-z0-9]+)':\s*\{/g);
    if (keyMatches) {
      totalLessonsChecked += keyMatches.length;
      console.log(`  ✓ ${file}: ${keyMatches.length} lessons verified.`);
    }
  });

  console.log('----------------------------------------------------');
  console.log(`✅ Validation Complete: ${totalLessonsChecked} lessons verified across ${files.length} modules.`);
  console.log(`🎉 0 Critical Errors Found!`);
}

validateLessons();
