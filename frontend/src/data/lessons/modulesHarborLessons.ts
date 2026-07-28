import type { LessonDebugContent } from '@/types';

export const MODULES_HARBOR_LESSONS: Record<string, LessonDebugContent> = {
  'm1': {
    title: 'The Navigator\'s Compass',
    hook: 'How do you use tools crafted by other wizards?',
    concept: 'Python has built-in modules like `math`. You use `import module_name` to bring them into your code.',
    code: 'import math\nresult = math.sqrt(16)\nprint(result)',
    mentalModel: [
      'A module is a file containing Python code (functions, classes).',
      'import <module> brings the whole module in.',
      'You access its functions using dot notation: module.function().'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Import the math module.',
        why: 'Loads the math library into memory.',
        memory: [
          { name: 'math', value: '<module>', type: 'module', note: 'Imported', accent: '#a78bfa' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Call math.sqrt(16).',
        why: 'Calculates the square root using the imported module.',
        memory: [
          { name: 'math', value: '<module>', type: 'module', note: 'Imported', accent: '#a78bfa' },
          { name: 'result', value: '4.0', type: 'float', note: 'Calculated', accent: '#60a5fa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Print the result.',
        why: 'Displays the calculated square root.',
        memory: [
          { name: 'math', value: '<module>', type: 'module', note: 'Imported', accent: '#a78bfa' },
          { name: 'result', value: '4.0', type: 'float', note: 'Calculated', accent: '#60a5fa' }
        ],
        output: '4.0\n'
      }
    ]
  },
  'm2': {
    title: 'Specific Imports',
    hook: 'What if you only need one specific spell from a grimoire?',
    concept: 'You can import specific functions using `from module import function`. Then you don\'t need to use the module name.',
    code: 'from math import sqrt\nresult = sqrt(25)\nprint(result)',
    mentalModel: [
      'from <module> import <name> brings only <name> into your code.',
      'You can use the imported name directly without dot notation.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Import sqrt directly from math.',
        why: 'Loads only the sqrt function into memory.',
        memory: [
          { name: 'sqrt', value: '<function>', type: 'function', note: 'Imported', accent: '#a78bfa' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Call sqrt(25).',
        why: 'Calculates the square root directly.',
        memory: [
          { name: 'sqrt', value: '<function>', type: 'function', note: 'Imported', accent: '#a78bfa' },
          { name: 'result', value: '5.0', type: 'float', note: 'Calculated', accent: '#60a5fa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Print the result.',
        why: 'Displays the calculated square root.',
        memory: [
          { name: 'sqrt', value: '<function>', type: 'function', note: 'Imported', accent: '#a78bfa' },
          { name: 'result', value: '5.0', type: 'float', note: 'Calculated', accent: '#60a5fa' }
        ],
        output: '5.0\n'
      }
    ]
  },
  'm3': {
    title: 'The Alias Charm',
    hook: 'Can you rename a spell for quicker casting?',
    concept: 'You can use `as` to give a module or function a different, usually shorter, name.',
    code: 'import math as m\nresult = m.factorial(5)\nprint(result)',
    mentalModel: [
      'The `as` keyword creates an alias.',
      'This is commonly used for standard libraries (e.g., `import numpy as np`).'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Import math as m.',
        why: 'Loads the math module but names it "m" in our code.',
        memory: [
          { name: 'm', value: '<module math>', type: 'module', note: 'Alias', accent: '#a78bfa' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Call m.factorial(5).',
        why: 'Calculates 5! using the aliased module.',
        memory: [
          { name: 'm', value: '<module math>', type: 'module', note: 'Alias', accent: '#a78bfa' },
          { name: 'result', value: '120', type: 'int', note: 'Calculated', accent: '#60a5fa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Print the result.',
        why: 'Displays the calculated factorial.',
        memory: [
          { name: 'm', value: '<module math>', type: 'module', note: 'Alias', accent: '#a78bfa' },
          { name: 'result', value: '120', type: 'int', note: 'Calculated', accent: '#60a5fa' }
        ],
        output: '120\n'
      }
    ]
  },
  'm4': {
    title: 'Merchant Guilds',
    hook: 'How do you share your own spells?',
    concept: 'Any Python file you create can be imported as a custom module.',
    code: '# Assuming hero.py has hp = 100\nimport hero\ncurrent = hero.hp\nprint(current)',
    mentalModel: [
      'If you have hero.py, you can `import hero`.',
      'You can access variables and functions defined in hero.py.'
    ],
    debuggerSteps: [
      {
        line: 2,
        action: 'Import custom module hero.',
        why: 'Loads the contents of hero.py.',
        memory: [
          { name: 'hero', value: '<module>', type: 'module', note: 'Custom', accent: '#a78bfa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Access hero.hp.',
        why: 'Retrieves the hp value from the hero module.',
        memory: [
          { name: 'hero', value: '<module>', type: 'module', note: 'Custom', accent: '#a78bfa' },
          { name: 'current', value: '100', type: 'int', note: 'Retrieved', accent: '#60a5fa' }
        ],
        output: ''
      },
      {
        line: 4,
        action: 'Print the current hp.',
        why: 'Displays the value.',
        memory: [
          { name: 'hero', value: '<module>', type: 'module', note: 'Custom', accent: '#a78bfa' },
          { name: 'current', value: '100', type: 'int', note: 'Retrieved', accent: '#60a5fa' }
        ],
        output: '100\n'
      }
    ]
  }
};
