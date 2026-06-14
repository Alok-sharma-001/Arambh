import { LessonData } from './variablesForestData';

export const LOOPS_DESERT_LESSONS: Record<string, LessonData> = {
  '11': {
    id: '11',
    title: 'Endless Footsteps',
    story: {
      speaker: 'Desert Wanderer',
      emoji: '🚶',
      lines: [
        "The Loops Desert is vast. Every grain of sand looks the same, every step repeats the last.",
        "To cross it, you must understand the nature of repetition. Why write a spell ten times when you can command the universe to loop it for you?"
      ]
    },
    explain: {
      title: 'Introduction to Loops',
      description: [
        "In programming, a 'loop' is used to repeat a block of code multiple times.",
        "Instead of writing print('Hello') five times, you can use a loop to do it automatically.",
        "This saves time, reduces errors, and makes your code much cleaner."
      ],
      code: "# Without loop\nprint('Step')\nprint('Step')\nprint('Step')\n\n# With loop\nfor i in range(3):\n    print('Step')",
      steps: [
        {
          id: 1,
          type: 'LOOP_START',
          description: "Starting loop for 3 iterations.",
          lineNumber: 6,
          loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Created loop variable 'i' = 0",
          lineNumber: 6,
          variable: { address: '0x00', name: 'i', value: '0', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed 'Step'",
          lineNumber: 7,
          output: "Step",
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } }
        },
        {
          id: 4,
          type: 'LOOP_ITERATION',
          description: "Next iteration.",
          lineNumber: 6,
          loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } }
        },
        {
          id: 5,
          type: 'UPDATE',
          description: "Updated 'i' = 1",
          lineNumber: 6,
          variable: { address: '0x00', name: 'i', value: '1', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } }
        },
        {
          id: 6,
          type: 'PRINT',
          description: "Printed 'Step'",
          lineNumber: 7,
          output: "Step",
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } }
        },
        {
          id: 7,
          type: 'LOOP_ITERATION',
          description: "Next iteration.",
          lineNumber: 6,
          loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } }
        },
        {
          id: 8,
          type: 'UPDATE',
          description: "Updated 'i' = 2",
          lineNumber: 6,
          variable: { address: '0x00', name: 'i', value: '2', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } }
        },
        {
          id: 9,
          type: 'PRINT',
          description: "Printed 'Step'",
          lineNumber: 7,
          output: "Step",
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } }
        },
        {
          id: 10,
          type: 'LOOP_END',
          description: "Loop finished.",
          lineNumber: 6,
          loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'First Steps',
      description: 'Write a loop that repeats exactly 2 times and prints "Walk".',
      initialCode: 'for i in range(2):\n    print("Walk")',
      validation: (code) => {
        if (!/for\s+i\s+in\s+range\(\s*2\s*\)/.test(code)) return { isValid: false, error: "Use for i in range(2)" };
        if (!code.includes('print("Walk")')) return { isValid: false, error: "You must print 'Walk'" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop for 2 iterations.", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created variable 'i' = 0", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 'Walk'", lineNumber: 2, output: "Walk", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 4, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated 'i' = 1", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 'Walk'", lineNumber: 2, output: "Walk", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 7, type: 'LOOP_END', description: "Loop finished.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } }
      ]
    },
    challenge: {
      title: 'Run into the Dunes',
      description: 'Write a loop that repeats 4 times and prints "Run".',
      initialCode: '# Write your loop here\n',
      validation: (code) => {
        if (!code.includes('for ') || !code.includes('range(4)')) return { isValid: false, error: "Make sure you use a for loop with range(4)" };
        if (!code.includes('print("Run")') && !code.includes("print('Run')")) return { isValid: false, error: "Make sure you print 'Run' inside the loop." };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop for 4 iterations.", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 4, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created variable 'i' = 0", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 'Run'", lineNumber: 2, output: "Run", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 4, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 4, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated 'i' = 1", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 'Run'", lineNumber: 2, output: "Run", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 7, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 4, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 8, type: 'UPDATE', description: "Updated 'i' = 2", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 'Run'", lineNumber: 2, output: "Run", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 10, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 4, totalIterations: 4, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 11, type: 'UPDATE', description: "Updated 'i' = 3", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '3', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '3', type: 'int' } } },
        { id: 12, type: 'PRINT', description: "Printed 'Run'", lineNumber: 2, output: "Run", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '3', type: 'int' } } },
        { id: 13, type: 'LOOP_END', description: "Loop finished.", lineNumber: 1, loopState: { currentIteration: 4, totalIterations: 4, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '3', type: 'int' } } }
      ]
    },
    rewardXP: 100
  },
  '12': {
    id: '12',
    title: 'The For Loop Path',
    story: {
      speaker: 'Desert Wanderer',
      emoji: '🚶',
      lines: [
        "The for loop is a precise instrument. It knows exactly how many steps to take.",
        "Watch closely as the loop variable changes its value with every cycle."
      ]
    },
    explain: {
      title: 'Using the Loop Variable',
      description: [
        "The variable in a for loop (usually 'i') automatically updates its value in each iteration.",
        "You can use this variable inside the loop to do things dynamically."
      ],
      code: "for i in range(3):\n    print(i)",
      steps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop.", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created loop variable 'i' = 0", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 0", lineNumber: 2, output: "0", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 4, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated 'i' = 1", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 1", lineNumber: 2, output: "1", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 7, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 8, type: 'UPDATE', description: "Updated 'i' = 2", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 2", lineNumber: 2, output: "2", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 10, type: 'LOOP_END', description: "Loop finished.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } }
      ]
    },
    practice: {
      title: 'Counting Sands',
      description: 'Write a loop that prints the numbers 0, 1, and 2 using the loop variable.',
      initialCode: 'for x in range(3):\n    # print x here',
      validation: (code) => {
        if (!/print\s*\(\s*x\s*\)/.test(code)) return { isValid: false, error: "You must print the variable x" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop.", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created variable 'x' = 0", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 0", lineNumber: 2, output: "0", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' } } },
        { id: 4, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated 'x' = 1", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 1", lineNumber: 2, output: "1", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' } } },
        { id: 7, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' } } },
        { id: 8, type: 'UPDATE', description: "Updated 'x' = 2", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '2', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 2", lineNumber: 2, output: "2", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '2', type: 'int' } } },
        { id: 10, type: 'LOOP_END', description: "Loop finished.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '2', type: 'int' } } }
      ]
    },
    challenge: {
      title: 'Double Trouble',
      description: 'Write a loop for 3 iterations that prints double the value of the loop variable in each step (0, 2, 4).',
      initialCode: 'for i in range(3):\n    # print i * 2 here',
      validation: (code) => {
        if (!/print\s*\(\s*i\s*\*\s*2\s*\)/.test(code)) return { isValid: false, error: "Make sure you print i * 2" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop.", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created variable 'i' = 0", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 3, type: 'EVALUATE', description: "Evaluated 0 * 2 = 0", lineNumber: 2, evaluation: { leftVal: '0', rightVal: '2', operator: '*', result: '0', targetVarName: 'output' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 4, type: 'PRINT', description: "Printed 0", lineNumber: 2, output: "0", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 5, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 6, type: 'UPDATE', description: "Updated 'i' = 1", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 7, type: 'EVALUATE', description: "Evaluated 1 * 2 = 2", lineNumber: 2, evaluation: { leftVal: '1', rightVal: '2', operator: '*', result: '2', targetVarName: 'output' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 8, type: 'PRINT', description: "Printed 2", lineNumber: 2, output: "2", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 9, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 10, type: 'UPDATE', description: "Updated 'i' = 2", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 11, type: 'EVALUATE', description: "Evaluated 2 * 2 = 4", lineNumber: 2, evaluation: { leftVal: '2', rightVal: '2', operator: '*', result: '4', targetVarName: 'output' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 12, type: 'PRINT', description: "Printed 4", lineNumber: 2, output: "4", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 13, type: 'LOOP_END', description: "Loop finished.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } }
      ]
    },
    rewardXP: 100
  },
  '13': {
    id: '13',
    title: 'The While Loop Oasis',
    story: {
      speaker: 'Oasis Guardian',
      emoji: '🚰',
      lines: [
        "Not all paths have a known length. Sometimes, you must walk UNTIL you reach the oasis.",
        "A while loop repeats as long as a condition is true. Be careful, or you'll walk forever!"
      ]
    },
    explain: {
      title: 'While Loops',
      description: [
        "A while loop checks a condition before every iteration.",
        "If the condition is True, the loop runs. If it's False, the loop stops.",
        "You must make sure to change the condition inside the loop, otherwise it will run infinitely."
      ],
      code: "water = 0\nwhile water < 2:\n    print('Drinking')\n    water = water + 1",
      steps: [
        { id: 1, type: 'ALLOCATE', description: "Created 'water' = 0", lineNumber: 1, variable: { address: '0x00', name: 'water', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '0', type: 'int' } } },
        { id: 2, type: 'LOOP_START', description: "Checking condition: water < 2 (True)", lineNumber: 2, loopState: { currentIteration: 1, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '0', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 'Drinking'", lineNumber: 3, output: "Drinking", memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '0', type: 'int' } } },
        { id: 4, type: 'EVALUATE', description: "Evaluated 0 + 1 = 1", lineNumber: 4, evaluation: { leftVal: '0', rightVal: '1', operator: '+', result: '1', targetVarName: 'water' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '0', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated 'water' = 1", lineNumber: 4, variable: { address: '0x00', name: 'water', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '1', type: 'int' } } },
        { id: 6, type: 'LOOP_ITERATION', description: "Checking condition: water < 2 (True)", lineNumber: 2, loopState: { currentIteration: 2, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '1', type: 'int' } } },
        { id: 7, type: 'PRINT', description: "Printed 'Drinking'", lineNumber: 3, output: "Drinking", memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '1', type: 'int' } } },
        { id: 8, type: 'EVALUATE', description: "Evaluated 1 + 1 = 2", lineNumber: 4, evaluation: { leftVal: '1', rightVal: '1', operator: '+', result: '2', targetVarName: 'water' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '1', type: 'int' } } },
        { id: 9, type: 'UPDATE', description: "Updated 'water' = 2", lineNumber: 4, variable: { address: '0x00', name: 'water', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '2', type: 'int' } } },
        { id: 10, type: 'LOOP_END', description: "Condition water < 2 is False. Loop ends.", lineNumber: 2, loopState: { currentIteration: 2, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'water', value: '2', type: 'int' } } }
      ]
    },
    practice: {
      title: 'Gather Wood',
      description: 'Write a while loop that runs as long as wood < 3. Inside the loop, print("Chop") and add 1 to wood.',
      initialCode: 'wood = 0\nwhile wood < 3:\n    # print "Chop"\n    # add 1 to wood',
      validation: (code) => {
        if (!/while\s*\(?\s*wood\s*<\s*3\s*\)?\s*:/.test(code)) return { isValid: false, error: "Use while wood < 3:" };
        if (!code.includes('print("Chop")') && !code.includes("print('Chop')")) return { isValid: false, error: "You must print 'Chop'" };
        if (!/wood\s*=\s*wood\s*\+\s*1/.test(code) && !/wood\s*\+=\s*1/.test(code)) return { isValid: false, error: "You must increment wood by 1" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'ALLOCATE', description: "Created 'wood' = 0", lineNumber: 1, variable: { address: '0x00', name: 'wood', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '0', type: 'int' } } },
        { id: 2, type: 'LOOP_START', description: "Checking condition: wood < 3 (True)", lineNumber: 2, loopState: { currentIteration: 1, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '0', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 'Chop'", lineNumber: 3, output: "Chop", memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '0', type: 'int' } } },
        { id: 4, type: 'UPDATE', description: "Updated 'wood' = 1", lineNumber: 4, variable: { address: '0x00', name: 'wood', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '1', type: 'int' } } },
        { id: 5, type: 'LOOP_ITERATION', description: "Checking condition: wood < 3 (True)", lineNumber: 2, loopState: { currentIteration: 2, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '1', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 'Chop'", lineNumber: 3, output: "Chop", memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '1', type: 'int' } } },
        { id: 7, type: 'UPDATE', description: "Updated 'wood' = 2", lineNumber: 4, variable: { address: '0x00', name: 'wood', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '2', type: 'int' } } },
        { id: 8, type: 'LOOP_ITERATION', description: "Checking condition: wood < 3 (True)", lineNumber: 2, loopState: { currentIteration: 3, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '2', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 'Chop'", lineNumber: 3, output: "Chop", memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '2', type: 'int' } } },
        { id: 10, type: 'UPDATE', description: "Updated 'wood' = 3", lineNumber: 4, variable: { address: '0x00', name: 'wood', value: '3', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '3', type: 'int' } } },
        { id: 11, type: 'LOOP_END', description: "Condition wood < 3 is False. Loop ends.", lineNumber: 2, loopState: { currentIteration: 3, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'wood', value: '3', type: 'int' } } }
      ]
    },
    challenge: {
      title: 'Counting Down',
      description: 'Create a countdown! Set timer = 3. Use a while loop as long as timer > 0. Inside, print the timer and decrease it by 1.',
      initialCode: 'timer = 3\n# Write your while loop here',
      validation: (code) => {
        if (!/while\s*\(?\s*timer\s*>\s*0\s*\)?\s*:/.test(code)) return { isValid: false, error: "Use while timer > 0:" };
        if (!/print\s*\(\s*timer\s*\)/.test(code)) return { isValid: false, error: "You must print the timer variable" };
        if (!/timer\s*=\s*timer\s*-\s*1/.test(code) && !/timer\s*-=\s*1/.test(code)) return { isValid: false, error: "You must decrease timer by 1" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'ALLOCATE', description: "Created 'timer' = 3", lineNumber: 1, variable: { address: '0x00', name: 'timer', value: '3', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '3', type: 'int' } } },
        { id: 2, type: 'LOOP_START', description: "Checking condition: timer > 0 (True)", lineNumber: 2, loopState: { currentIteration: 1, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '3', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 3", lineNumber: 3, output: "3", memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '3', type: 'int' } } },
        { id: 4, type: 'UPDATE', description: "Updated 'timer' = 2", lineNumber: 4, variable: { address: '0x00', name: 'timer', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '2', type: 'int' } } },
        { id: 5, type: 'LOOP_ITERATION', description: "Checking condition: timer > 0 (True)", lineNumber: 2, loopState: { currentIteration: 2, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '2', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 2", lineNumber: 3, output: "2", memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '2', type: 'int' } } },
        { id: 7, type: 'UPDATE', description: "Updated 'timer' = 1", lineNumber: 4, variable: { address: '0x00', name: 'timer', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '1', type: 'int' } } },
        { id: 8, type: 'LOOP_ITERATION', description: "Checking condition: timer > 0 (True)", lineNumber: 2, loopState: { currentIteration: 3, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '1', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 1", lineNumber: 3, output: "1", memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '1', type: 'int' } } },
        { id: 10, type: 'UPDATE', description: "Updated 'timer' = 0", lineNumber: 4, variable: { address: '0x00', name: 'timer', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '0', type: 'int' } } },
        { id: 11, type: 'LOOP_END', description: "Condition timer > 0 is False. Loop ends.", lineNumber: 2, loopState: { currentIteration: 3, loopType: 'while' }, memorySnapshot: { '0x00': { address: '0x00', name: 'timer', value: '0', type: 'int' } } }
      ]
    },
    rewardXP: 100
  },
  '14': {
    id: '14',
    title: 'Range of Destiny',
    story: {
      speaker: 'Desert Wanderer',
      emoji: '🚶',
      lines: [
        "You've seen range(3), but the range function is much more powerful.",
        "It can start from any number, stop at any number, and even skip steps!"
      ]
    },
    explain: {
      title: 'The Range Function',
      description: [
        "range(stop) starts at 0 and goes up to (but doesn't include) stop.",
        "range(start, stop) starts at start and goes up to (but doesn't include) stop.",
        "range(start, stop, step) adds a step size. It jumps by that step amount."
      ],
      code: "# Prints 2, 4, 6\nfor i in range(2, 7, 2):\n    print(i)",
      steps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop.", lineNumber: 2, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created variable 'i' = 2", lineNumber: 2, variable: { address: '0x00', name: 'i', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 2", lineNumber: 3, output: "2", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 4, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated 'i' = 4", lineNumber: 2, variable: { address: '0x00', name: 'i', value: '4', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '4', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 4", lineNumber: 3, output: "4", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '4', type: 'int' } } },
        { id: 7, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 2, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '4', type: 'int' } } },
        { id: 8, type: 'UPDATE', description: "Updated 'i' = 6", lineNumber: 2, variable: { address: '0x00', name: 'i', value: '6', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '6', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 6", lineNumber: 3, output: "6", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '6', type: 'int' } } },
        { id: 10, type: 'LOOP_END', description: "Loop finished.", lineNumber: 2, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '6', type: 'int' } } }
      ]
    },
    practice: {
      title: 'Stepping Stones',
      description: 'Write a for loop that uses range(1, 6, 2) to print the odd numbers from 1 to 5.',
      initialCode: 'for x in range(1, 6, 2):\n    # print x',
      validation: (code) => {
        if (!/range\(\s*1\s*,\s*6\s*,\s*2\s*\)/.test(code)) return { isValid: false, error: "Use range(1, 6, 2)" };
        if (!/print\s*\(\s*x\s*\)/.test(code)) return { isValid: false, error: "You must print x" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop.", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created variable 'x' = 1", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 1", lineNumber: 2, output: "1", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' } } },
        { id: 4, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated 'x' = 3", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '3', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '3', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 3", lineNumber: 2, output: "3", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '3', type: 'int' } } },
        { id: 7, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '3', type: 'int' } } },
        { id: 8, type: 'UPDATE', description: "Updated 'x' = 5", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '5', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 5", lineNumber: 2, output: "5", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' } } },
        { id: 10, type: 'LOOP_END', description: "Loop finished.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' } } }
      ]
    },
    challenge: {
      title: 'Countdown with Range',
      description: 'You can count backwards with range(start, stop, step) if the step is negative. Write a loop using range(3, 0, -1) and print the variable.',
      initialCode: '# Use range(3, 0, -1) to print 3, 2, 1',
      validation: (code) => {
        if (!/range\(\s*3\s*,\s*0\s*,\s*-1\s*\)/.test(code)) return { isValid: false, error: "Use range(3, 0, -1)" };
        if (!code.includes('print')) return { isValid: false, error: "You must print the variable" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Starting loop.", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created variable = 3", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '3', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '3', type: 'int' } } },
        { id: 3, type: 'PRINT', description: "Printed 3", lineNumber: 2, output: "3", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '3', type: 'int' } } },
        { id: 4, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '3', type: 'int' } } },
        { id: 5, type: 'UPDATE', description: "Updated variable = 2", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 6, type: 'PRINT', description: "Printed 2", lineNumber: 2, output: "2", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 7, type: 'LOOP_ITERATION', description: "Next iteration.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '2', type: 'int' } } },
        { id: 8, type: 'UPDATE', description: "Updated variable = 1", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 9, type: 'PRINT', description: "Printed 1", lineNumber: 2, output: "1", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } },
        { id: 10, type: 'LOOP_END', description: "Loop finished.", lineNumber: 1, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' } } }
      ]
    },
    rewardXP: 100
  },
  '15': {
    id: '15',
    title: 'Nested Labyrinth',
    story: {
      speaker: 'Desert Wanderer',
      emoji: '🚶',
      lines: [
        "Welcome to the deepest part of the desert, where loops run within loops.",
        "Nested loops create complex patterns, multiplying the work. Be careful not to get lost."
      ]
    },
    explain: {
      title: 'Nested Loops',
      description: [
        "You can put a loop inside another loop. This is called a nested loop.",
        "The inner loop completes ALL of its iterations for EVERY single iteration of the outer loop."
      ],
      code: "for outer in range(2):\n    for inner in range(2):\n        print(outer, inner)",
      steps: [
        { id: 1, type: 'LOOP_START', description: "Outer loop start", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created 'outer' = 0", lineNumber: 1, variable: { address: '0x00', name: 'outer', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' } } },
        
        { id: 3, type: 'LOOP_START', description: "Inner loop start", lineNumber: 2, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' } } },
        { id: 4, type: 'ALLOCATE', description: "Created 'inner' = 0", lineNumber: 2, variable: { address: '0x01', name: 'inner', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '0', type: 'int' } } },
        { id: 5, type: 'PRINT', description: "Printed '0 0'", lineNumber: 3, output: "0 0", memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '0', type: 'int' } } },
        
        { id: 6, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '0', type: 'int' } } },
        { id: 7, type: 'UPDATE', description: "Updated 'inner' = 1", lineNumber: 2, variable: { address: '0x01', name: 'inner', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        { id: 8, type: 'PRINT', description: "Printed '0 1'", lineNumber: 3, output: "0 1", memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        
        { id: 9, type: 'LOOP_END', description: "Inner loop end", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        
        { id: 10, type: 'LOOP_ITERATION', description: "Outer loop iteration", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        { id: 11, type: 'UPDATE', description: "Updated 'outer' = 1", lineNumber: 1, variable: { address: '0x00', name: 'outer', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        
        { id: 12, type: 'LOOP_START', description: "Inner loop start", lineNumber: 2, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        { id: 13, type: 'UPDATE', description: "Updated 'inner' = 0", lineNumber: 2, variable: { address: '0x01', name: 'inner', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '0', type: 'int' } } },
        { id: 14, type: 'PRINT', description: "Printed '1 0'", lineNumber: 3, output: "1 0", memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '0', type: 'int' } } },
        
        { id: 15, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '0', type: 'int' } } },
        { id: 16, type: 'UPDATE', description: "Updated 'inner' = 1", lineNumber: 2, variable: { address: '0x01', name: 'inner', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        { id: 17, type: 'PRINT', description: "Printed '1 1'", lineNumber: 3, output: "1 1", memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        
        { id: 18, type: 'LOOP_END', description: "Inner loop end", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } },
        
        { id: 19, type: 'LOOP_END', description: "Outer loop end", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'outer', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'inner', value: '1', type: 'int' } } }
      ]
    },
    practice: {
      title: 'Grid Coordinates',
      description: 'Write a nested loop where the outer loop x is range(2) and the inner loop y is range(2). Print x and y.',
      initialCode: 'for x in range(2):\n    # Write inner loop here',
      validation: (code) => {
        if (!/for\s+y\s+in\s+range\(\s*2\s*\)\s*:/.test(code)) return { isValid: false, error: "Missing inner loop for y in range(2):" };
        if (!/print\s*\(\s*x\s*,\s*y\s*\)/.test(code)) return { isValid: false, error: "You must print(x, y)" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Outer loop start", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created 'x' = 0", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' } } },
        { id: 3, type: 'LOOP_START', description: "Inner loop start", lineNumber: 2, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' } } },
        { id: 4, type: 'ALLOCATE', description: "Created 'y' = 0", lineNumber: 2, variable: { address: '0x01', name: 'y', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '0', type: 'int' } } },
        { id: 5, type: 'PRINT', description: "Printed '0 0'", lineNumber: 3, output: "0 0", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '0', type: 'int' } } },
        { id: 6, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '0', type: 'int' } } },
        { id: 7, type: 'UPDATE', description: "Updated 'y' = 1", lineNumber: 2, variable: { address: '0x01', name: 'y', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 8, type: 'PRINT', description: "Printed '0 1'", lineNumber: 3, output: "0 1", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 9, type: 'LOOP_END', description: "Inner loop end", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 10, type: 'LOOP_ITERATION', description: "Outer loop iteration", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 11, type: 'UPDATE', description: "Updated 'x' = 1", lineNumber: 1, variable: { address: '0x00', name: 'x', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 12, type: 'LOOP_START', description: "Inner loop start", lineNumber: 2, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 13, type: 'UPDATE', description: "Updated 'y' = 0", lineNumber: 2, variable: { address: '0x01', name: 'y', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '0', type: 'int' } } },
        { id: 14, type: 'PRINT', description: "Printed '1 0'", lineNumber: 3, output: "1 0", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '0', type: 'int' } } },
        { id: 15, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '0', type: 'int' } } },
        { id: 16, type: 'UPDATE', description: "Updated 'y' = 1", lineNumber: 2, variable: { address: '0x01', name: 'y', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 17, type: 'PRINT', description: "Printed '1 1'", lineNumber: 3, output: "1 1", memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 18, type: 'LOOP_END', description: "Inner loop end", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } },
        { id: 19, type: 'LOOP_END', description: "Outer loop end", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '1', type: 'int' } } }
      ]
    },
    challenge: {
      title: 'Rectangle of Stars',
      description: 'Using nested loops, print a 2x3 grid of stars (*). Wait, just print "*" six times using outer range(2) and inner range(3).',
      initialCode: '# Print * 6 times using nested loops',
      validation: (code) => {
        if (!code.includes('for') || !code.includes('range(2)') || !code.includes('range(3)')) return { isValid: false, error: "Use an outer loop of 2 and an inner loop of 3" };
        if (!code.includes('print("*")') && !code.includes("print('*')")) return { isValid: false, error: "You must print '*'" };
        return { isValid: true };
      },
      successSteps: [
        { id: 1, type: 'LOOP_START', description: "Outer loop start", lineNumber: 1, loopState: { currentIteration: 1, totalIterations: 2, loopType: 'for' }, memorySnapshot: {} },
        { id: 2, type: 'ALLOCATE', description: "Created outer var", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 3, type: 'LOOP_START', description: "Inner loop start", lineNumber: 2, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' } } },
        { id: 4, type: 'ALLOCATE', description: "Created inner var", lineNumber: 2, variable: { address: '0x01', name: 'j', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '0', type: 'int' } } },
        { id: 5, type: 'PRINT', description: "Printed '*'", lineNumber: 3, output: "*", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '0', type: 'int' } } },
        { id: 6, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '0', type: 'int' } } },
        { id: 7, type: 'UPDATE', description: "Updated inner var", lineNumber: 2, variable: { address: '0x01', name: 'j', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '1', type: 'int' } } },
        { id: 8, type: 'PRINT', description: "Printed '*'", lineNumber: 3, output: "*", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '1', type: 'int' } } },
        { id: 9, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '1', type: 'int' } } },
        { id: 10, type: 'UPDATE', description: "Updated inner var", lineNumber: 2, variable: { address: '0x01', name: 'j', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 11, type: 'PRINT', description: "Printed '*'", lineNumber: 3, output: "*", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 12, type: 'LOOP_END', description: "Inner loop end", lineNumber: 2, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 13, type: 'LOOP_ITERATION', description: "Outer loop iteration", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '0', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 14, type: 'UPDATE', description: "Updated outer var", lineNumber: 1, variable: { address: '0x00', name: 'i', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 15, type: 'LOOP_START', description: "Inner loop start", lineNumber: 2, loopState: { currentIteration: 1, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 16, type: 'UPDATE', description: "Updated inner var", lineNumber: 2, variable: { address: '0x01', name: 'j', value: '0', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '0', type: 'int' } } },
        { id: 17, type: 'PRINT', description: "Printed '*'", lineNumber: 3, output: "*", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '0', type: 'int' } } },
        { id: 18, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 2, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '0', type: 'int' } } },
        { id: 19, type: 'UPDATE', description: "Updated inner var", lineNumber: 2, variable: { address: '0x01', name: 'j', value: '1', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '1', type: 'int' } } },
        { id: 20, type: 'PRINT', description: "Printed '*'", lineNumber: 3, output: "*", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '1', type: 'int' } } },
        { id: 21, type: 'LOOP_ITERATION', description: "Inner loop iteration", lineNumber: 2, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '1', type: 'int' } } },
        { id: 22, type: 'UPDATE', description: "Updated inner var", lineNumber: 2, variable: { address: '0x01', name: 'j', value: '2', type: 'int' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 23, type: 'PRINT', description: "Printed '*'", lineNumber: 3, output: "*", memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 24, type: 'LOOP_END', description: "Inner loop end", lineNumber: 2, loopState: { currentIteration: 3, totalIterations: 3, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } },
        { id: 25, type: 'LOOP_END', description: "Outer loop end", lineNumber: 1, loopState: { currentIteration: 2, totalIterations: 2, loopType: 'for' }, memorySnapshot: { '0x00': { address: '0x00', name: 'i', value: '1', type: 'int' }, '0x01': { address: '0x01', name: 'j', value: '2', type: 'int' } } }
      ]
    },
    rewardXP: 100
  }
};
