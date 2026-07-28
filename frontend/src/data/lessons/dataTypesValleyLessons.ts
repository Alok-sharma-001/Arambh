import type { LessonDebugContent } from '@/types';

export const DATA_TYPES_VALLEY_LESSONS: Record<string, LessonDebugContent> = {
  'd1': {
    title: 'Gold and Dust (Numbers)',
    hook: 'What is the difference between whole gold coins and fragments?',
    concept: 'Python has two main types for numbers: Integers (whole numbers) and Floats (decimals). They can be mixed in math, and Python will automatically upgrade the result to a Float to preserve the decimal.',
    code: 'gold = 15\nprice = 3.5\ntotal = gold - price\nprint(total)',
    mentalModel: [
      'Integers (`int`) are whole numbers like 15.',
      'Floats (`float`) have decimal points like 3.5.',
      'Mixing ints and floats in math results in a float.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Creates an integer variable "gold" with value 15.',
        why: 'Whole numbers are stored as `int`s.',
        memory: [
          { name: 'gold', value: '15', type: 'int', note: 'Whole number', accent: '#c8a45e' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Creates a float variable "price" with value 3.5.',
        why: 'Because of the decimal point, this is stored as a `float`.',
        memory: [
          { name: 'gold', value: '15', type: 'int', note: 'Unchanged', accent: '#c8a45e' },
          { name: 'price', value: '3.5', type: 'float', note: 'Decimal number', accent: '#60a5fa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Subtracts price from gold and stores in "total".',
        why: 'Python handles the math and realizes it needs a decimal for the answer.',
        memory: [
          { name: 'gold', value: '15', type: 'int', note: 'Unchanged', accent: '#c8a45e' },
          { name: 'price', value: '3.5', type: 'float', note: 'Unchanged', accent: '#60a5fa' },
          { name: 'total', value: '11.5', type: 'float', note: 'Result is a float', accent: '#34d399' }
        ],
        output: ''
      },
      {
        line: 4,
        action: 'Prints the calculated total.',
        why: 'We can output the calculated float.',
        memory: [
          { name: 'gold', value: '15', type: 'int', note: 'Unchanged', accent: '#c8a45e' },
          { name: 'price', value: '3.5', type: 'float', note: 'Unchanged', accent: '#60a5fa' },
          { name: 'total', value: '11.5', type: 'float', note: 'Unchanged', accent: '#34d399' }
        ],
        output: '11.5\n'
      }
    ]
  },
  'd2': {
    title: 'Slicing the Scroll',
    hook: 'How do you extract just the first word from an ancient chant?',
    concept: 'Strings are sequences of characters. You can grab pieces of a string using "slicing", specifying a start index and an end index. Python starts counting at 0!',
    code: 'spell = "Fireball"\npart = spell[0:4]\nprint(part)',
    mentalModel: [
      'Strings are wrapped in quotes.',
      'Counting positions (indexes) starts at 0.',
      'Slicing [start:end] goes up to, but doesn\'t include, the end index.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Stores the string "Fireball" in "spell".',
        why: 'Text is stored as a sequence of characters.',
        memory: [
          { name: 'spell', value: '"Fireball"', type: 'str', note: 'Created string', accent: '#f472b6' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Extracts characters from position 0 up to 3 (F-i-r-e).',
        why: 'Slicing lets us extract substrings easily.',
        memory: [
          { name: 'spell', value: '"Fireball"', type: 'str', note: 'Unchanged', accent: '#f472b6' },
          { name: 'part', value: '"Fire"', type: 'str', note: 'Sliced substring', accent: '#a78bfa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Prints the extracted part.',
        why: 'We successfully cut out the piece of text we wanted.',
        memory: [
          { name: 'spell', value: '"Fireball"', type: 'str', note: 'Unchanged', accent: '#f472b6' },
          { name: 'part', value: '"Fire"', type: 'str', note: 'Unchanged', accent: '#a78bfa' }
        ],
        output: 'Fire\n'
      }
    ]
  },
  'd3': {
    title: 'The Gates of Truth (Booleans)',
    hook: 'How does a program make decisions based on facts?',
    concept: 'Booleans represent one of two states: True or False. They are often created by comparing values. Logical operators like `and`, `or`, and `not` can combine them.',
    code: 'has_key = True\nis_locked = False\ncan_open = has_key and not is_locked',
    mentalModel: [
      'Booleans must be capitalized: True, False.',
      '`not` flips a boolean.',
      '`and` requires both sides to be True.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Creates boolean "has_key" set to True.',
        why: 'Represents a state that is definitively true.',
        memory: [
          { name: 'has_key', value: 'True', type: 'bool', note: 'State is True', accent: '#34d399' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Creates boolean "is_locked" set to False.',
        why: 'Represents a state that is definitively false.',
        memory: [
          { name: 'has_key', value: 'True', type: 'bool', note: 'Unchanged', accent: '#34d399' },
          { name: 'is_locked', value: 'False', type: 'bool', note: 'State is False', accent: '#fb923c' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Evaluates the logic and assigns the result.',
        why: '"not is_locked" becomes True. True and True results in True.',
        memory: [
          { name: 'has_key', value: 'True', type: 'bool', note: 'Unchanged', accent: '#34d399' },
          { name: 'is_locked', value: 'False', type: 'bool', note: 'Unchanged', accent: '#fb923c' },
          { name: 'can_open', value: 'True', type: 'bool', note: 'Logical result', accent: '#60a5fa' }
        ],
        output: ''
      }
    ]
  },
  'd4': {
    title: 'The Alchemist\'s Forge (Type Conversion)',
    hook: 'Can you turn a word into a number?',
    concept: 'Sometimes you have a number hidden inside a string (like "15"). To do math with it, you must cast it to an integer using `int()`. You can also convert numbers to strings using `str()`.',
    code: 'age_str = "15"\nage_int = int(age_str)\nnew_age = age_int + 1',
    mentalModel: [
      'You cannot do math on a string, even if it looks like a number.',
      'Use `int()` to convert a string to a whole number.',
      'Use `str()` to convert a number into text.'
    ],
    debuggerSteps: [
      {
        line: 1,
        action: 'Stores the string "15".',
        why: 'The quotes make it text, not a mathable number.',
        memory: [
          { name: 'age_str', value: '"15"', type: 'str', note: 'Text, not number', accent: '#c8a45e' }
        ],
        output: ''
      },
      {
        line: 2,
        action: 'Converts "15" to the number 15.',
        why: 'We prepare the value so we can perform math on it.',
        memory: [
          { name: 'age_str', value: '"15"', type: 'str', note: 'Unchanged', accent: '#c8a45e' },
          { name: 'age_int', value: '15', type: 'int', note: 'Converted to int', accent: '#60a5fa' }
        ],
        output: ''
      },
      {
        line: 3,
        action: 'Adds 1 to the integer.',
        why: 'Because it is now an integer, math works normally.',
        memory: [
          { name: 'age_str', value: '"15"', type: 'str', note: 'Unchanged', accent: '#c8a45e' },
          { name: 'age_int', value: '15', type: 'int', note: 'Unchanged', accent: '#60a5fa' },
          { name: 'new_age', value: '16', type: 'int', note: 'Math result', accent: '#34d399' }
        ],
        output: ''
      }
    ]
  }
};
