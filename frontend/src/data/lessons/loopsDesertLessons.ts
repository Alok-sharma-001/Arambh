import type { LessonDebugContent } from '@/types';

export const LOOPS_DESERT_LESSONS: Record<string, LessonDebugContent> = {
  'l1': {
    title: 'The Eternal Sands (for Loop)',
    hook: 'How do you cast a spell 3 times without repeating yourself?',
    concept: 'A `for` loop lets you repeat a block of code a specific number of times. The `range()` function generates a sequence of numbers, starting at 0, and the loop runs once for each number.',
    code: 'for i in range(3):\n    print(i)',
    mentalModel: [
      '`range(3)` creates the numbers 0, 1, 2.',
      'The variable `i` takes on the next number each time the loop runs.',
      'Code that repeats must be indented.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Loop starts: i becomes 0 (the first number in range(3)).',
        why: 'Initialization of the loop variable.',
        memory: [
          { name: 'i', value: '0', type: 'int', note: 'Iteration 1', accent: '#c8a45e' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Prints the value of i.',
        why: 'Executes the loop body for the first time.',
        memory: [
          { name: 'i', value: '0', type: 'int', note: 'Unchanged', accent: '#c8a45e' }
        ],
        output: '0\n'
      },
      {
        line: 1,
        action: 'Loop continues: i becomes 1.',
        why: 'Moving to the next number in the range sequence.',
        memory: [
          { name: 'i', value: '1', type: 'int', note: 'Iteration 2', accent: '#60a5fa' }
        ],
        output: '0\n'
      },
      {
        line: 2,
        action: 'Prints the new value of i.',
        why: 'Executes the loop body for the second time.',
        memory: [
          { name: 'i', value: '1', type: 'int', note: 'Unchanged', accent: '#60a5fa' }
        ],
        output: '0\n1\n'
      },
      {
        line: 1,
        action: 'Loop continues: i becomes 2.',
        why: 'The final number in range(3).',
        memory: [
          { name: 'i', value: '2', type: 'int', note: 'Iteration 3', accent: '#34d399' }
        ],
        output: '0\n1\n'
      },
      {
        line: 2,
        action: 'Prints the final value of i.',
        why: 'The loop finishes executing.',
        memory: [
          { name: 'i', value: '2', type: 'int', note: 'Unchanged', accent: '#34d399' }
        ],
        output: '0\n1\n2\n'
      }
    ]
  },
  'l2': {
    title: 'The Patient Oasis (while Loop)',
    hook: 'How do you keep going until a condition is met?',
    concept: 'A `while` loop keeps repeating as long as its condition evaluates to True. You usually need to update a variable inside the loop so the condition eventually becomes False.',
    code: 'count = 2\nwhile count > 0:\n    print(count)\n    count = count - 1',
    mentalModel: [
      '`while` loops run as long as the condition is True.',
      'Always make sure the condition will eventually become False (no infinite loops!).',
      'Updates happen inside the indented block.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Initializes count to 2.',
        why: 'Setup a variable to control our loop.',
        memory: [
          { name: 'count', value: '2', type: 'int', note: 'Starting value', accent: '#c8a45e' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Checks if 2 > 0. It is True.',
        why: 'The loop condition is checked before running the body.',
        memory: [
          { name: 'count', value: '2', type: 'int', note: 'Condition is True', accent: '#c8a45e' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Prints 2.',
        why: 'Executes the first line of the loop body.',
        memory: [
          { name: 'count', value: '2', type: 'int', note: 'Unchanged', accent: '#c8a45e' }
        ],
        output: '2\n'
      },
      {
        line: 4,
        action: 'Decrements count by 1. Now count is 1.',
        why: 'Crucial step to move towards the exit condition.',
        memory: [
          { name: 'count', value: '1', type: 'int', note: 'Decreased', accent: '#60a5fa' }
        ],
        output: '2\n'
      },
      {
        line: 2,
        action: 'Checks if 1 > 0. It is True.',
        why: 'Re-evaluates the condition for the next iteration.',
        memory: [
          { name: 'count', value: '1', type: 'int', note: 'Condition is True', accent: '#60a5fa' }
        ],
        output: '2\n'
      },
      {
        line: 3,
        action: 'Prints 1.',
        why: 'Executes the body again.',
        memory: [
          { name: 'count', value: '1', type: 'int', note: 'Unchanged', accent: '#60a5fa' }
        ],
        output: '2\n1\n'
      },
      {
        line: 4,
        action: 'Decrements count to 0.',
        why: 'Moving closer to False.',
        memory: [
          { name: 'count', value: '0', type: 'int', note: 'Decreased', accent: '#34d399' }
        ],
        output: '2\n1\n'
      },
      {
        line: 2,
        action: 'Checks if 0 > 0. It is False. Loop ends.',
        why: 'The condition failed, so execution jumps past the loop.',
        memory: [
          { name: 'count', value: '0', type: 'int', note: 'Condition is False', accent: '#34d399' }
        ],
        output: '2\n1\n'
      }
    ]
  },
  'l3': {
    title: 'Mirages and Escapes (Break/Continue)',
    hook: 'How do you skip a step, or escape a loop entirely?',
    concept: 'Sometimes you need precise control inside a loop. `continue` skips the rest of the current iteration and jumps to the next one. `break` smashes out of the loop completely.',
    code: 'for i in range(4):\n    if i == 1:\n        continue\n    if i == 3:\n        break\n    print(i)',
    mentalModel: [
      '`continue` means "skip to the next loop immediately".',
      '`break` means "stop the loop forever right now".',
      'Code below these keywords in the loop won\'t run if they trigger.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'i becomes 0.',
        why: 'Loop starts normally.',
        memory: [
          { name: 'i', value: '0', type: 'int', note: 'First iteration', accent: '#c8a45e' }
        ],
        output: ''
      },
      {
        line: 6,
        action: 'Prints 0 (both if statements were False).',
        why: 'Normal execution since i is 0.',
        memory: [
          { name: 'i', value: '0', type: 'int', note: 'Unchanged', accent: '#c8a45e' }
        ],
        output: '0\n'
      },
      {
        line: 1,
        action: 'i becomes 1.',
        why: 'Next iteration.',
        memory: [
          { name: 'i', value: '1', type: 'int', note: 'Second iteration', accent: '#60a5fa' }
        ],
        output: '0\n'
      },
      {
        line: 2,
        action: 'Checks if i == 1. True!',
        why: 'Our first condition is met.',
        memory: [
          { name: 'i', value: '1', type: 'int', note: 'Match', accent: '#60a5fa' }
        ],
        output: '0\n'
      },
      {
        line: 3,
        action: 'Executes "continue". Skips the print statement!',
        why: 'Forces loop to jump back to the top.',
        memory: [
          { name: 'i', value: '1', type: 'int', note: 'Skipping print', accent: '#60a5fa' }
        ],
        output: '0\n'
      },
      {
        line: 1,
        action: 'i becomes 2.',
        why: 'Continue brings us back here.',
        memory: [
          { name: 'i', value: '2', type: 'int', note: 'Third iteration', accent: '#34d399' }
        ],
        output: '0\n'
      },
      {
        line: 6,
        action: 'Prints 2 (if statements were False).',
        why: 'Normal execution for i=2.',
        memory: [
          { name: 'i', value: '2', type: 'int', note: 'Unchanged', accent: '#34d399' }
        ],
        output: '0\n2\n'
      },
      {
        line: 1,
        action: 'i becomes 3.',
        why: 'Next iteration.',
        memory: [
          { name: 'i', value: '3', type: 'int', note: 'Fourth iteration', accent: '#f472b6' }
        ],
        output: '0\n2\n'
      },
      {
        line: 4,
        action: 'Checks if i == 3. True!',
        why: 'Our second condition is met.',
        memory: [
          { name: 'i', value: '3', type: 'int', note: 'Match', accent: '#f472b6' }
        ],
        output: '0\n2\n'
      },
      {
        line: 5,
        action: 'Executes "break". Loop ends immediately.',
        why: 'We permanently escape the loop before 3 is printed.',
        memory: [
          { name: 'i', value: '3', type: 'int', note: 'Breaking out', accent: '#f472b6' }
        ],
        output: '0\n2\n'
      }
    ]
  }
};
