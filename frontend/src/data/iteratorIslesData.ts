import type { LessonDebugContent } from '@/types';

export const ITERATOR_ISLES_LESSONS: Record<string, LessonDebugContent> = {
  'i1': {
    "title": "The Iteration Protocol",
    "hook": "Master the difference between collections and cursors.",
    "concept": "An Iterable is a collection of pages; an Iterator is a finger pointing at the current line. Python uses iter() to get the finger and next() to read and advance.",
    "code": "numbers = [1, 2]\niterator = iter(numbers)\nfirst = next(iterator)\nprint(first)",
    "mentalModel": [
      "iter(numbers) creates a fresh list_iterator starting at index 0.",
      "next(iterator) reads the element at the current index and increments the index.",
      "The source list is never modified; only the iterator cursor advances."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Store numbers list in memory.",
        "why": "Python sets up an iterable list [1, 2].",
        "memory": [
          {
            "name": "numbers",
            "value": "[1, 2]",
            "type": "list",
            "note": "Iterable",
            "accent": "#34d399"
          }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Create an iterator cursor on the numbers list.",
        "why": "Calling iter() returns a list_iterator object initialized at index 0.",
        "memory": [
          {
            "name": "numbers",
            "value": "[1, 2]",
            "type": "list",
            "note": "Iterable",
            "accent": "#34d399"
          },
          {
            "name": "iterator",
            "value": "<list_iterator>",
            "type": "list_iterator",
            "note": "Cursor at index 0",
            "accent": "#10b981"
          }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Retrieve first item and advance cursor.",
        "why": "next() reads index 0 (1), advances the iterator's internal cursor to index 1, and stores 1 in first.",
        "memory": [
          {
            "name": "numbers",
            "value": "[1, 2]",
            "type": "list",
            "note": "Iterable",
            "accent": "#34d399"
          },
          {
            "name": "iterator",
            "value": "<list_iterator>",
            "type": "list_iterator",
            "note": "Cursor at index 1",
            "accent": "#10b981"
          },
          {
            "name": "first",
            "value": "1",
            "type": "int",
            "note": "Returned by next()",
            "accent": "#60a5fa"
          }
        ],
        "output": ""
      },
      {
        "line": 4,
        "action": "Print the value of first.",
        "why": "Output window displays the value printed.",
        "memory": [
          {
            "name": "numbers",
            "value": "[1, 2]",
            "type": "list",
            "note": "Iterable",
            "accent": "#34d399"
          },
          {
            "name": "first",
            "value": "1",
            "type": "int",
            "note": "Printed",
            "accent": "#60a5fa"
          }
        ],
        "output": "1"
      }
    ]
  },
  'i2': {
    "title": "Custom Iterators",
    "hook": "Write code that conforms to Python's custom loop contract.",
    "concept": "To make any class an Iterator, implement __iter__ (returning self) and __next__ (returning the next value or raising StopIteration).",
    "code": "class Countdown:\n    def __init__(self, start):\n        self.count = start\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.count <= 0:\n            raise StopIteration\n        self.count -= 1\n        return self.count + 1\n\ncd = Countdown(1)\nit = iter(cd)\nprint(next(it))",
    "mentalModel": [
      "Defining __iter__ returning self allows the object to act as its own iterator.",
      "The __next__ method is called on every iteration loop step.",
      "Raising StopIteration cleanly ends loops without crashing Python."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Declare Countdown class template.",
        "why": "Python interpreter processes class signature and helper methods.",
        "memory": [
          {
            "name": "Countdown",
            "value": "<class Countdown>",
            "type": "type",
            "note": "Template loaded",
            "accent": "#a78bfa"
          }
        ],
        "output": ""
      },
      {
        "line": 12,
        "action": "Instantiate Countdown object with count 1.",
        "why": "Constructor initializes self.count to 1.",
        "memory": [
          {
            "name": "cd",
            "value": "<Countdown object>",
            "type": "Countdown",
            "note": "count = 1",
            "accent": "#60a5fa"
          }
        ],
        "output": ""
      },
      {
        "line": 13,
        "action": "Get iterator from Countdown object.",
        "why": "Calling iter() executes __iter__() returning the same object instance.",
        "memory": [
          {
            "name": "cd",
            "value": "<Countdown object>",
            "type": "Countdown",
            "note": "count = 1",
            "accent": "#60a5fa"
          },
          {
            "name": "it",
            "value": "<Countdown object>",
            "type": "Countdown",
            "note": "Active iterator reference",
            "accent": "#10b981"
          }
        ],
        "output": ""
      },
      {
        "line": 14,
        "action": "Query next element and print it.",
        "why": "next() triggers __next__(), decreasing self.count to 0 and returning the previous value 1.",
        "memory": [
          {
            "name": "cd",
            "value": "<Countdown object>",
            "type": "Countdown",
            "note": "count = 0",
            "accent": "#60a5fa"
          }
        ],
        "output": "1"
      }
    ]
  },
  'i3': {
    "title": "The Power of yield",
    "hook": "Pause execution states dynamically with yield.",
    "concept": "Generators use 'yield' to return values while freezing their local variables and code position in memory, allowing them to resume on the next call.",
    "code": "def simple_gen():\n    yield \"A\"\n    yield \"B\"\n\ng = simple_gen()\nprint(next(g))\nprint(next(g))",
    "mentalModel": [
      "Calling simple_gen() does NOT run the code; it only returns a generator object.",
      "The yield statement returns a value and freezes the stack frame.",
      "Calling next() thaws the stack frame, resuming execution right after the last yield."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Declare simple_gen generator function.",
        "why": "Python registers the function signature as a generator.",
        "memory": [
          {
            "name": "simple_gen",
            "value": "<function simple_gen>",
            "type": "function",
            "note": "Generator template",
            "accent": "#a78bfa"
          }
        ],
        "output": ""
      },
      {
        "line": 5,
        "action": "Create generator instance.",
        "why": "simple_gen() returns a suspended generator object without running the code inside.",
        "memory": [
          {
            "name": "g",
            "value": "<generator object simple_gen>",
            "type": "generator",
            "note": "State: suspended",
            "accent": "#10b981"
          }
        ],
        "output": ""
      },
      {
        "line": 6,
        "action": "Step into generator and yield first item.",
        "why": "next(g) runs simple_gen until it hits yield 'A', returning 'A' and freezing variables.",
        "memory": [
          {
            "name": "g",
            "value": "<generator object simple_gen>",
            "type": "generator",
            "note": "State: yielded 'A'",
            "accent": "#10b981"
          }
        ],
        "output": "A"
      },
      {
        "line": 7,
        "action": "Resume generator and yield second item.",
        "why": "next(g) thaws simple_gen, running from line 3 to yield 'B', freezing state again.",
        "memory": [
          {
            "name": "g",
            "value": "<generator object simple_gen>",
            "type": "generator",
            "note": "State: yielded 'B'",
            "accent": "#10b981"
          }
        ],
        "output": "A\nB"
      }
    ]
  },
  'i4': {
    "title": "Generator Expressions",
    "hook": "Write lazy, inline transformations with zero memory waste.",
    "concept": "Generator expressions are inline generators written inside round parentheses (). They do not build lists in memory; they calculate values on-demand.",
    "code": "nums = [1, 2]\ngen = (x * 10 for x in nums)\nprint(next(gen))\nprint(next(gen))",
    "mentalModel": [
      "Round parentheses create a lazy generator, square brackets create an eager list.",
      "The generator expression stores only the current item pointer, utilizing O(1) space.",
      "It reads values from the source collection only when next() is triggered."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Store numbers list in memory.",
        "why": "Defines the source list to stream from.",
        "memory": [
          {
            "name": "nums",
            "value": "[1, 2]",
            "type": "list",
            "note": "Source iterable",
            "accent": "#34d399"
          }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Initialize lazy generator expression.",
        "why": "Round parentheses return a generator object immediately without computing any multiplication.",
        "memory": [
          {
            "name": "nums",
            "value": "[1, 2]",
            "type": "list",
            "note": "Source iterable",
            "accent": "#34d399"
          },
          {
            "name": "gen",
            "value": "<generator>",
            "type": "generator",
            "note": "Lazy expression, 104 bytes",
            "accent": "#10b981"
          }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Fetch first transformed item.",
        "why": "next(gen) reads the first item from nums (1), performs 1 * 10, and yields 10.",
        "memory": [
          {
            "name": "nums",
            "value": "[1, 2]",
            "type": "list",
            "note": "Source iterable",
            "accent": "#34d399"
          },
          {
            "name": "gen",
            "value": "<generator>",
            "type": "generator",
            "note": "Yielded first item",
            "accent": "#10b981"
          }
        ],
        "output": "10"
      },
      {
        "line": 4,
        "action": "Fetch second transformed item.",
        "why": "next(gen) reads the second item from nums (2), performs 2 * 10, and yields 20.",
        "memory": [
          {
            "name": "nums",
            "value": "[1, 2]",
            "type": "list",
            "note": "Source iterable",
            "accent": "#34d399"
          },
          {
            "name": "gen",
            "value": "<generator>",
            "type": "generator",
            "note": "Exhausted after this call",
            "accent": "#10b981"
          }
        ],
        "output": "10\n20"
      }
    ]
  }
};
