import type { LessonDebugContent } from '@/types';

export const EXCEPTION_ABYSS_LESSONS: Record<string, LessonDebugContent> = {
  'e1': {
    title: "Try & Except",
    hook: "What happens when you ask Python to divide by zero?",
    concept: "Errors usually crash your program. With try/except blocks, you can catch the error and handle it gracefully without breaking everything.",
    code: "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    result = 0\nprint(result)",
    mentalModel: [
      "The code inside 'try' runs first.",
      "If it fails, Python jumps directly to 'except'.",
      "Your program keeps running instead of crashing!"
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Enters the try block",
        why: "Python is preparing to run code that might cause an error.",
        memory: [],
        output: ""
      },
      {
        line: 2,
        action: "Attempts to divide by zero",
        why: "Math rules say this is impossible, which causes Python to throw a ZeroDivisionError.",
        memory: [],
        output: ""
      },
      {
        line: 3,
        action: "Catches the error",
        why: "Instead of crashing, the program flows into our except block.",
        memory: [],
        output: ""
      },
      {
        line: 4,
        action: "Sets a fallback value",
        why: "We assign a safe value so the program can continue.",
        memory: [
          { name: "result", value: "0", type: "int", note: "Fallback value", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "Prints the result",
        why: "We safely print our fallback value.",
        memory: [
          { name: "result", value: "0", type: "int", note: "Fallback value", accent: "#34d399" }
        ],
        output: "0\n"
      }
    ]
  },
  'e2': {
    title: "Catching Specific Errors",
    hook: "Not all mistakes are the same.",
    concept: "You can have multiple except blocks to handle different types of errors specifically. This lets you react differently depending on what went wrong.",
    code: "try:\n    age = int('ten')\nexcept ValueError:\n    age = -1\nexcept TypeError:\n    age = -2\nprint(age)",
    mentalModel: [
      "Python checks 'except' blocks top to bottom.",
      "It runs the first block that matches the error type.",
      "Be specific to fix specific problems."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Starts the try block",
        why: "We are trying to run potentially risky code.",
        memory: [],
        output: ""
      },
      {
        line: 2,
        action: "Fails to convert string to int",
        why: "'ten' is not a valid number format, so Python raises a ValueError.",
        memory: [],
        output: ""
      },
      {
        line: 3,
        action: "Matches the ValueError",
        why: "Python finds an except block specifically for ValueError.",
        memory: [],
        output: ""
      },
      {
        line: 4,
        action: "Handles the ValueError",
        why: "We assign a default age of -1.",
        memory: [
          { name: "age", value: "-1", type: "int", note: "Default for ValueError", accent: "#c8a45e" }
        ],
        output: ""
      },
      {
        line: 7,
        action: "Prints the age",
        why: "The TypeError block is skipped, and we move to print.",
        memory: [
          { name: "age", value: "-1", type: "int", note: "Default for ValueError", accent: "#c8a45e" }
        ],
        output: "-1\n"
      }
    ]
  },
  'e3': {
    title: "The finally Block",
    hook: "The cleanup crew that always shows up.",
    concept: "The finally block runs no matter what happens in the try/except blocks. It is perfect for cleaning up resources, like closing a file or database connection.",
    code: "try:\n    x = 1 / 1\nexcept:\n    x = 0\nfinally:\n    print('Done!')",
    mentalModel: [
      "Try runs the code.",
      "Except catches the errors.",
      "Finally always runs at the very end."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Enters the try block",
        why: "Getting ready to calculate.",
        memory: [],
        output: ""
      },
      {
        line: 2,
        action: "Performs calculation",
        why: "1 divided by 1 is 1.0. No error happens.",
        memory: [
          { name: "x", value: "1.0", type: "float", note: "Successful division", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "Jumps to finally",
        why: "Since there was no error, the except block is skipped. But finally always runs.",
        memory: [
          { name: "x", value: "1.0", type: "float", note: "Successful division", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 6,
        action: "Executes cleanup code",
        why: "The print statement inside finally runs.",
        memory: [
          { name: "x", value: "1.0", type: "float", note: "Successful division", accent: "#60a5fa" }
        ],
        output: "Done!\n"
      }
    ]
  },
  'e4': {
    title: "Raising Exceptions",
    hook: "Sometimes you need to pull the fire alarm yourself.",
    concept: "You can intentionally trigger an error using the raise keyword. This is useful when data violates your program's rules.",
    code: "level = -5\nif level < 0:\n    raise ValueError('Level cannot be negative')\nprint('Level OK')",
    mentalModel: [
      "Use 'raise' to stop the program intentionally.",
      "Provide a helpful error message.",
      "It prevents invalid data from causing worse bugs later."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Assigns negative level",
        why: "We define a character level that is invalid.",
        memory: [
          { name: "level", value: "-5", type: "int", note: "Invalid level", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Checks condition",
        why: "We verify if the level breaks our rules.",
        memory: [
          { name: "level", value: "-5", type: "int", note: "Invalid level", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Raises an error",
        why: "The program crashes immediately with our custom message.",
        memory: [
          { name: "level", value: "-5", type: "int", note: "Invalid level", accent: "#f472b6" }
        ],
        output: "ValueError: Level cannot be negative\n"
      }
    ]
  }
};
