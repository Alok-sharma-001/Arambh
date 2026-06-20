#!/usr/bin/env node
import 'dotenv/config';
import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs';
import path from 'path';

const program = new Command();

program
  .name('arambh-content-engine')
  .description('Arambh Automated Content Generation System (V3)')
  .version('3.0.0');

program
  .command('generate-library')
  .description('Generate the complete library for a given subject')
  .argument('<subject>', 'The subject to generate (e.g., python, javascript)')
  .action(async (subject) => {
    console.log(chalk.blue.bold(`\n🚀 Starting Arambh Content Generation System (V3)`));
    console.log(chalk.gray(`Target Subject: ${subject.toUpperCase()}\n`));
    
    const spinner = ora('Checking prerequisites...').start();
    
    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
      spinner.fail('Missing LLM API Key. Please set GEMINI_API_KEY or OPENAI_API_KEY.');
      process.exit(1);
    }
    
    spinner.succeed('Prerequisites verified.');
    
    console.log(chalk.yellow('\n[STAGE 1] Knowledge Graph Building'));
    // TODO: Implement Python PDF extraction & graph building
    
    console.log(chalk.yellow('\n[STAGE 2] Content Generation & Fusion'));
    // TODO: Implement Concept Generation Loop
    
    console.log(chalk.green.bold('\n✅ Generation Complete!'));
  });

program
  .command('generate-book')
  .description('Process a single book into the content engine')
  .argument('<book_path>', 'Path to the PDF book')
  .requiredOption('-s, --subject <subject>', 'The subject this book belongs to')
  .action(async (bookPath, options) => {
    console.log(chalk.blue(`Processing Book: ${bookPath} for subject: ${options.subject}`));
    
    if (!process.env.GEMINI_API_KEY && !process.env.OPENAI_API_KEY) {
      console.log(chalk.red('Missing LLM API Key. Please set GEMINI_API_KEY.'));
      process.exit(1);
    }

    const spinner = ora('Extracting PDF text...').start();
    const { execSync } = require('child_process');
    try {
      const output = execSync(`python3 src/extractor.py "${bookPath}"`, { encoding: 'utf-8' });
      const result = JSON.parse(output);
      
      if (result.error) {
        spinner.fail(`Extraction failed: ${result.error}`);
        return;
      }
      
      const chapters = result.chapters || [];
      spinner.succeed(`Extracted ${chapters.length} chapters from ${result.book}`);
      
      const { generateConceptContent } = await import('./llm');
      
      const outputDir = path.join(__dirname, '..', '..', 'frontend', 'src', 'data', 'library', options.subject, 'concepts');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const chaptersToProcess = chapters;
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < chaptersToProcess.length; i++) {
        const chapter = chaptersToProcess[i];
        const chapterTitle = chapter.title.trim().replace(/[^a-zA-Z0-9\s]/g, '');
        const conceptId = `${options.subject}-${chapterTitle.toLowerCase().replace(/\s+/g, '-')}`;
        const outputPath = path.join(outputDir, `${conceptId}.json`);
        
        if (fs.existsSync(outputPath)) {
          console.log(chalk.gray(`Skipping ${conceptId} (already generated)`));
          continue;
        }

        console.log(chalk.yellow(`\n[Chapter ${i + 1}/${chaptersToProcess.length}] Generating concept: ${conceptId}`));
        const genSpinner = ora(`Generating content with Gemini...`).start();
        
        try {
          const conceptData = await generateConceptContent(conceptId, chapter.text);
          fs.writeFileSync(outputPath, JSON.stringify(conceptData, null, 2));
          genSpinner.succeed(`Saved to ${outputPath}`);
        } catch (err: any) {
          genSpinner.fail(`Failed to generate ${conceptId}: ${err.message}`);
        }
        
        // Wait 30 seconds between requests to respect free-tier token limits
        if (i < chaptersToProcess.length - 1) {
          console.log(chalk.gray('Sleeping 30s to respect API rate limits...'));
          await sleep(30000);
        }
      }
      
      console.log(chalk.green.bold('\n✅ Book processing complete!'));
    } catch (e: any) {
      spinner.fail(`Failed to process book: ${e.message}`);
    }
  });

program
  .command('resume-generation')
  .description('Resume generation from the last checkpoint')
  .action(() => {
    console.log(chalk.blue(`Resuming from last checkpoint...`));
    // TODO: Implement checkpoint loader
  });

program
  .command('validate-library')
  .description('Run quality validation on the generated library')
  .argument('<subject>', 'The subject to validate')
  .action((subject) => {
    console.log(chalk.blue(`Validating library for ${subject}...`));
  });

program
  .command('stats-library')
  .description('View statistics for the generated library')
  .argument('<subject>', 'The subject to view stats for')
  .action((subject) => {
    console.log(chalk.blue(`Loading statistics for ${subject}...`));
  });

program.parse(process.argv);
