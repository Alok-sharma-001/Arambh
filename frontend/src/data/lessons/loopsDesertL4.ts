import type { LessonDebugContent } from '@/types';

export const LOOPS_DESERT_L4: Record<string, LessonDebugContent> = {
  'l4': {
    "title": "Nested Loops",
    "hook": "What happens when you put a loop inside another loop?",
    "concept": "A nested loop is a loop inside the body of another loop. The inner loop finishes all of its iterations for every single iteration of the outer loop. This is great for printing grids or patterns!",
    "code": "for i in range(2):\n    for j in range(2):\n        print(f\"{i}-{j}\")",
    "mentalModel": [
      "The outer loop pauses while the inner loop runs completely.",
      "Variables from the outer loop can be used inside the inner loop.",
      "The total runs equal outer runs multiplied by inner runs."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Start the outer loop",
        "why": "Python sets the outer variable `i` to its first value, 0.",
        "memory": [
          { "name": "i", "value": "0", "type": "int", "note": "Outer loop starts", "accent": "#c8a45e" }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Start the inner loop",
        "why": "Python now enters the inner loop and sets `j` to 0.",
        "memory": [
          { "name": "i", "value": "0", "type": "int", "note": "Unchanged", "accent": "#c8a45e" },
          { "name": "j", "value": "0", "type": "int", "note": "Inner loop starts", "accent": "#60a5fa" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Print the combination",
        "why": "We print the current values of `i` and `j`.",
        "memory": [
          { "name": "i", "value": "0", "type": "int", "note": "Unchanged", "accent": "#c8a45e" },
          { "name": "j", "value": "0", "type": "int", "note": "Unchanged", "accent": "#60a5fa" }
        ],
        "output": "0-0\n"
      },
      {
        "line": 2,
        "action": "Next iteration of inner loop",
        "why": "The inner loop goes to its next value, 1.",
        "memory": [
          { "name": "i", "value": "0", "type": "int", "note": "Unchanged", "accent": "#c8a45e" },
          { "name": "j", "value": "1", "type": "int", "note": "Inner loop advances", "accent": "#60a5fa" }
        ],
        "output": "0-0\n"
      },
      {
        "line": 3,
        "action": "Print the combination",
        "why": "Print with the new value of `j`.",
        "memory": [
          { "name": "i", "value": "0", "type": "int", "note": "Unchanged", "accent": "#c8a45e" },
          { "name": "j", "value": "1", "type": "int", "note": "Unchanged", "accent": "#60a5fa" }
        ],
        "output": "0-0\n0-1\n"
      },
      {
        "line": 1,
        "action": "Next iteration of outer loop",
        "why": "The inner loop finished, so the outer loop advances `i` to 1.",
        "memory": [
          { "name": "i", "value": "1", "type": "int", "note": "Outer loop advances", "accent": "#c8a45e" },
          { "name": "j", "value": "1", "type": "int", "note": "Finished (for now)", "accent": "#60a5fa" }
        ],
        "output": "0-0\n0-1\n"
      }
    ]
  }
};
