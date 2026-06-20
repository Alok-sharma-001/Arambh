import fs from 'fs';
import path from 'path';

const conceptsDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'library', 'python', 'concepts');
const libraryTopicsPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'libraryTopics.ts');

export function syncFrontend() {
  console.log(`Syncing frontend topics from ${conceptsDir}...`);
  if (!fs.existsSync(conceptsDir)) {
    console.log('No concepts directory found.');
    return;
  }

  const files = fs.readdirSync(conceptsDir).filter(f => f.endsWith('.json'));
  
  let newTopicsCode = '';
  
  for (const file of files) {
    const filePath = path.join(conceptsDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    
    // Convert JSON concept into TypeScript object string
    const topicStr = `
  {
    id: '${content.conceptId}',
    title: ${JSON.stringify(content.title)},
    category: 'Head First Python',
    difficulty: ${content.difficultyScore < 30 ? "'Beginner'" : content.difficultyScore < 70 ? "'Intermediate'" : "'Advanced'"},
    estimatedTime: '${content.estimatedLearningTime} min read',
    completion: 0,
    overview: ${JSON.stringify(content.beginnerExplanation || content.simplifiedExplanation || '')},
    whyExists: ${JSON.stringify(content.intermediateExplanation || '')},
    realLifeAnalogy: {
      title: ${JSON.stringify(content.realWorldAnalogy?.title || '')},
      description: ${JSON.stringify(content.realWorldAnalogy?.description || '')},
    },
    syntax: '...', // Extracted dynamically if available
    example: '...',
    bestPractices: ${JSON.stringify(content.developerMode?.bestPractices || [])},
    mistakes: ${JSON.stringify(content.commonMistakes || [])},
    memoryModel: ${JSON.stringify(content.memoryState || [])},
    interactiveCode: {
      setup: '',
      code: '# Interactive snippet for ${content.conceptId}',
      expectedOutput: '...',
    },
    quiz: ${JSON.stringify((content.practiceQuestions || []).map((q: any, i: number) => ({
      id: \`\${content.conceptId}_q\${i}\`,
      question: q.question,
      options: q.options,
      correctIndex: q.correctIndex,
      explanation: q.explanation
    })))},
    relatedConcepts: ${JSON.stringify(content.nextConcepts || [])},
    learnPath: '/lesson/python/' + '${content.conceptId}',
    trainingPath: '/training/python/' + '${content.conceptId}',
    icon: Terminal, // Default icon
    bossBattle: ${JSON.stringify(content.bossBattle || null)},
    artifacts: ${JSON.stringify(content.artifacts || [])},
    trainingGround: ${JSON.stringify(content.trainingGround || null)}
  },`;
    newTopicsCode += topicStr;
  }
  
  let libraryTopicsContent = fs.readFileSync(libraryTopicsPath, 'utf-8');
  
  // Very simplistic injection for demo purposes (assumes topics array is exported)
  // We look for export const topics: LibraryTopic[] = [
  const insertIndex = libraryTopicsContent.indexOf('export const topics: LibraryTopic[] = [') + 'export const topics: LibraryTopic[] = ['.length;
  
  if (insertIndex > -1) {
    libraryTopicsContent = libraryTopicsContent.slice(0, insertIndex) + newTopicsCode + libraryTopicsContent.slice(insertIndex);
    fs.writeFileSync(libraryTopicsPath, libraryTopicsContent);
    console.log('✅ Successfully synced to libraryTopics.ts');
  } else {
    console.log('❌ Could not find topics array in libraryTopics.ts');
  }
}

// Allow running directly
if (require.main === module) {
  syncFrontend();
}
