import type { LessonDebugContent } from '@/types';

export const FUNCTIONS_MOUNTAIN_LESSONS: Record<string, LessonDebugContent> = {
  'f1': {
    "title": "Defining Functions",
    "hook": "Tired of writing the same code over and over?",
    "concept": "Functions are reusable blocks of code. You define them once using the `def` keyword, and can run them multiple times simply by calling their name.",
    "code": "def greet():\n    print(\"Hello!\")\ngreet()\ngreet()",
    "mentalModel": [
      "Use `def` to create a function.",
      "The code inside the function doesn't run until you call it.",
      "Call a function using its name followed by parentheses `()`."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Define the function",
        "why": "Python saves the function in memory but doesn't run its code yet.",
        "memory": [
          { "name": "greet", "value": "<function>", "type": "function", "note": "Saved in memory", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Call the function",
        "why": "We ask Python to execute the code inside `greet`.",
        "memory": [
          { "name": "greet", "value": "<function>", "type": "function", "note": "Being called", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Execute function body",
        "why": "The print statement runs.",
        "memory": [
          { "name": "greet", "value": "<function>", "type": "function", "note": "Running body", "accent": "#34d399" }
        ],
        "output": "Hello!\n"
      },
      {
        "line": 4,
        "action": "Call again",
        "why": "We reuse the function easily.",
        "memory": [
          { "name": "greet", "value": "<function>", "type": "function", "note": "Called again", "accent": "#34d399" }
        ],
        "output": "Hello!\n"
      },
      {
        "line": 2,
        "action": "Execute function body",
        "why": "The print statement runs again.",
        "memory": [
          { "name": "greet", "value": "<function>", "type": "function", "note": "Running body", "accent": "#34d399" }
        ],
        "output": "Hello!\nHello!\n"
      }
    ]
  },
  'f2': {
    "title": "Parameters & Arguments",
    "hook": "How do we give our functions some customized ingredients?",
    "concept": "Parameters are variables listed in the function definition. Arguments are the real values you pass into those variables when calling the function.",
    "code": "def double(num):\n    print(num * 2)\ndouble(3)\ndouble(5)",
    "mentalModel": [
      "Parameters act as placeholders inside the function.",
      "Arguments are passed into those placeholders during a call.",
      "Each call can have different arguments."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Define the function",
        "why": "Python registers `double`, noting it expects a `num` parameter.",
        "memory": [
          { "name": "double", "value": "<function>", "type": "function", "note": "Defined", "accent": "#a78bfa" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Call with argument 3",
        "why": "We jump into the function, setting `num` to 3.",
        "memory": [
          { "name": "double", "value": "<function>", "type": "function", "note": "Called", "accent": "#a78bfa" },
          { "name": "num", "value": "3", "type": "int", "note": "Argument assigned", "accent": "#fb923c" }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Execute with num=3",
        "why": "Python calculates 3 * 2 and prints 6.",
        "memory": [
          { "name": "double", "value": "<function>", "type": "function", "note": "Running", "accent": "#a78bfa" },
          { "name": "num", "value": "3", "type": "int", "note": "Used in calculation", "accent": "#fb923c" }
        ],
        "output": "6\n"
      },
      {
        "line": 4,
        "action": "Call with argument 5",
        "why": "We call it again, this time `num` is 5.",
        "memory": [
          { "name": "double", "value": "<function>", "type": "function", "note": "Called", "accent": "#a78bfa" },
          { "name": "num", "value": "5", "type": "int", "note": "New argument", "accent": "#fb923c" }
        ],
        "output": "6\n"
      },
      {
        "line": 2,
        "action": "Execute with num=5",
        "why": "Python calculates 5 * 2 and prints 10.",
        "memory": [
          { "name": "double", "value": "<function>", "type": "function", "note": "Running", "accent": "#a78bfa" },
          { "name": "num", "value": "5", "type": "int", "note": "Used in calculation", "accent": "#fb923c" }
        ],
        "output": "6\n10\n"
      }
    ]
  },
  'f3': {
    "title": "Return Values",
    "hook": "How do functions send an answer back to you?",
    "concept": "A function can give a result back to the code that called it using the `return` keyword. Once a function returns, it stops executing immediately.",
    "code": "def add(a, b):\n    return a + b\nres = add(2, 4)\nprint(res)",
    "mentalModel": [
      "`return` sends a value back to the caller.",
      "Functions without `return` give back `None`.",
      "`return` immediately exits the function."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Define the function",
        "why": "Function `add` is created.",
        "memory": [
          { "name": "add", "value": "<function>", "type": "function", "note": "Defined", "accent": "#f472b6" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Call add(2, 4)",
        "why": "Python enters `add` with arguments a=2, b=4.",
        "memory": [
          { "name": "add", "value": "<function>", "type": "function", "note": "Called", "accent": "#f472b6" },
          { "name": "a", "value": "2", "type": "int", "note": "Argument 1", "accent": "#60a5fa" },
          { "name": "b", "value": "4", "type": "int", "note": "Argument 2", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Return result",
        "why": "Python calculates 2 + 4 and sends 6 back.",
        "memory": [
          { "name": "add", "value": "<function>", "type": "function", "note": "Called", "accent": "#f472b6" },
          { "name": "a", "value": "2", "type": "int", "note": "Argument 1", "accent": "#60a5fa" },
          { "name": "b", "value": "4", "type": "int", "note": "Argument 2", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Assign to res",
        "why": "The returned value 6 is saved in `res`.",
        "memory": [
          { "name": "add", "value": "<function>", "type": "function", "note": "Finished", "accent": "#f472b6" },
          { "name": "res", "value": "6", "type": "int", "note": "Stores returned value", "accent": "#c8a45e" }
        ],
        "output": ""
      },
      {
        "line": 4,
        "action": "Print res",
        "why": "We output the stored result.",
        "memory": [
          { "name": "add", "value": "<function>", "type": "function", "note": "Unchanged", "accent": "#f472b6" },
          { "name": "res", "value": "6", "type": "int", "note": "Printed", "accent": "#c8a45e" }
        ],
        "output": "6\n"
      }
    ]
  },
  'f4': {
    "title": "Variable Scope",
    "hook": "Why do some variables magically disappear?",
    "concept": "Variables created inside a function are 'local' and only exist inside that function. Variables created outside are 'global' and can be seen anywhere.",
    "code": "x = 10\ndef show():\n    y = 5\n    print(x + y)\nshow()",
    "mentalModel": [
      "Local variables live and die within the function.",
      "Global variables are accessible from inside functions.",
      "Avoid naming local and global variables the same."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Create global variable",
        "why": "`x` is global and available everywhere.",
        "memory": [
          { "name": "x", "value": "10", "type": "int", "note": "Global", "accent": "#60a5fa" }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Define function",
        "why": "`show` function is registered globally.",
        "memory": [
          { "name": "x", "value": "10", "type": "int", "note": "Global", "accent": "#60a5fa" },
          { "name": "show", "value": "<function>", "type": "function", "note": "Defined", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 5,
        "action": "Call function",
        "why": "We jump inside `show()`.",
        "memory": [
          { "name": "x", "value": "10", "type": "int", "note": "Global", "accent": "#60a5fa" },
          { "name": "show", "value": "<function>", "type": "function", "note": "Executing", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Create local variable",
        "why": "`y` is created inside the function. It's temporary.",
        "memory": [
          { "name": "x", "value": "10", "type": "int", "note": "Global", "accent": "#60a5fa" },
          { "name": "show", "value": "<function>", "type": "function", "note": "Executing", "accent": "#34d399" },
          { "name": "y", "value": "5", "type": "int", "note": "Local", "accent": "#fb923c" }
        ],
        "output": ""
      },
      {
        "line": 4,
        "action": "Print sum",
        "why": "Python can see global `x` and local `y`.",
        "memory": [
          { "name": "x", "value": "10", "type": "int", "note": "Global", "accent": "#60a5fa" },
          { "name": "show", "value": "<function>", "type": "function", "note": "Executing", "accent": "#34d399" },
          { "name": "y", "value": "5", "type": "int", "note": "Local", "accent": "#fb923c" }
        ],
        "output": "15\n"
      }
    ]
  }
};
