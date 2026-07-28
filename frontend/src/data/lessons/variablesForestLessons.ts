import type { LessonDebugContent } from '@/types';

export const VARIABLES_FOREST_EXTRA_LESSONS: Record<string, LessonDebugContent> = {
  'v2': {
    title: 'The Mirror of Assignment',
    hook: 'How do you create an exact copy of a spell?',
    concept: 'In Python, you can assign the value of one variable to another. This creates a copy of the value, allowing both variables to hold the same information independently.',
    code: 'x = 10\ny = x\nprint(y)',
    mentalModel: [
      'Variables can copy values from other variables.',
      'Assignment always moves from right to left.',
      'Changes to the original variable later won\'t affect the copy.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Python stores 10 in a box named "x".',
        why: 'This establishes our first piece of stored data.',
        memory: [
          { name: 'x', value: '10', type: 'int', note: 'Created variable x', accent: '#c8a45e' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Python looks at "x", sees 10, and puts 10 in a new box named "y".',
        why: 'This shows that variables are evaluated for their current value during assignment.',
        memory: [
          { name: 'x', value: '10', type: 'int', note: 'Unchanged', accent: '#c8a45e' },
          { name: 'y', value: '10', type: 'int', note: 'Copied from x', accent: '#60a5fa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Python prints the value of "y".',
        why: 'We can now use the new variable just like the old one.',
        memory: [
          { name: 'x', value: '10', type: 'int', note: 'Unchanged', accent: '#c8a45e' },
          { name: 'y', value: '10', type: 'int', note: 'Unchanged', accent: '#60a5fa' }
        ],
        output: '10\n'
      }
    ]
  },
  'v3': {
    title: 'The Naming Runes',
    hook: 'A true wizard knows the rules of true names.',
    concept: 'Variables must follow strict naming rules: they can only contain letters, numbers, and underscores, and cannot start with a number. Python programmers prefer "snake_case" (all lowercase, words separated by underscores).',
    code: 'hero_health = 100\npotion1 = 50\nprint(hero_health)',
    mentalModel: [
      'Use descriptive names to remember what the variable holds.',
      'Stick to letters, numbers, and underscores.',
      'Never start a variable name with a number.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Creates a valid variable named "hero_health".',
        why: 'Using an underscore makes the two-word name easy to read.',
        memory: [
          { name: 'hero_health', value: '100', type: 'int', note: 'Valid snake_case', accent: '#34d399' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Creates another variable "potion1".',
        why: 'Numbers are allowed in names, just not at the very beginning.',
        memory: [
          { name: 'hero_health', value: '100', type: 'int', note: 'Unchanged', accent: '#34d399' },
          { name: 'potion1', value: '50', type: 'int', note: 'Valid alphanumeric', accent: '#f472b6' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Prints the value of "hero_health".',
        why: 'We use the exact name we defined to retrieve the value.',
        memory: [
          { name: 'hero_health', value: '100', type: 'int', note: 'Unchanged', accent: '#34d399' },
          { name: 'potion1', value: '50', type: 'int', note: 'Unchanged', accent: '#f472b6' }
        ],
        output: '100\n'
      }
    ]
  },
  'v4': {
    title: 'The Shapeshifter',
    hook: 'Can a sword suddenly become a number?',
    concept: 'Variables in Python are dynamic. You can change their value at any time, and you can even change what type of data they hold. The old value is discarded.',
    code: 'weapon = "sword"\nweapon = "bow"\nweapon = 42',
    mentalModel: [
      'Variables can be reassigned as many times as you want.',
      'Reassigning a variable destroys its old value.',
      'A variable can change from a string to a number (or any other type).'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Sets "weapon" to the string "sword".',
        why: 'Initializes our variable with text data.',
        memory: [
          { name: 'weapon', value: '"sword"', type: 'str', note: 'Created as string', accent: '#a78bfa' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Replaces the value in "weapon" with "bow".',
        why: 'The string "sword" is forgotten, replaced by the new string.',
        memory: [
          { name: 'weapon', value: '"bow"', type: 'str', note: 'Reassigned string', accent: '#a78bfa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Changes "weapon" completely to hold the integer 42.',
        why: 'Python is dynamically typed, so variables aren\'t locked to one data type.',
        memory: [
          { name: 'weapon', value: '42', type: 'int', note: 'Changed to integer', accent: '#fb923c' }
        ],
        output: ''
      }
    ]
  }
};
