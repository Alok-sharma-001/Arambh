import { LessonData } from './variablesForestData';

const dummyChallenge = {
  title: 'No Challenge',
  description: 'Proceed to the next phase.',
  initialCode: '',
  validation: () => ({ isValid: true }),
  successSteps: []
};

export const bossGateSagaData: Record<string, LessonData> = {
  '51': {
    id: '51',
    title: 'Chapter 1: The Sealed Gate',
    story: {
      speaker: 'The Master Core',
      emoji: '🔮',
      lines: [
        "The Boss Gate is sealed by a corrupted equation.",
        "You must extract raw inputs, cast them to precision types, and inject them."
      ]
    },
    explain: {
      title: 'Variables & Data Types',
      description: [
        "Combine your knowledge of Variable Assignment and Typecasting.",
        "Ensure string data is correctly parsed into integers and floats to satisfy the seal."
      ],
      code: "raw_data = '10'\nmultiplier = 2.5\npower = int(raw_data) * multiplier",
      steps: [
        {
          id: 1,
          type: 'EVALUATE',
          description: "Calculating seal power.",
          lineNumber: 3,
          memorySnapshot: {
            'raw_data': { address: '0x01', name: 'raw_data', value: "'10'", type: 'string' },
            'multiplier': { address: '0x02', name: 'multiplier', value: '2.5', type: 'float' },
            'power': { address: '0x03', name: 'power', value: '25.0', type: 'float' }
          }
        }
      ]
    },
    practice: {
      title: 'Break the First Seal',
      description: 'Given `raw_base = "42"` and `raw_multiplier = "1.5"`, convert them to `int` and `float` respectively, and calculate `seal_power = base * multiplier`.',
      initialCode: 'raw_base = "42"\nraw_multiplier = "1.5"\n# Calculate seal_power\n',
      validation: (code) => {
        const hasInt = /int\(\s*raw_base\s*\)/.test(code) || /int\(\s*["']?42["']?\s*\)/.test(code);
        const hasFloat = /float\(\s*raw_multiplier\s*\)/.test(code) || /float\(\s*["']?1\.5["']?\s*\)/.test(code);
        const hasPower = /seal_power\s*=/.test(code);
        if (!hasInt || !hasFloat) return { isValid: false, error: 'You must typecast the variables using `int()` and `float()`.' };
        if (!hasPower) return { isValid: false, error: 'Assign the result to `seal_power`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Seal broken.",
          lineNumber: 4,
          memorySnapshot: {},
          variable: { address: '0x01', name: 'seal_power', value: '63.0', type: 'float' }
        }
      ]
    },
    challenge: dummyChallenge,
    rewardXP: 500
  },
  '52': {
    id: '52',
    title: 'Chapter 2: The Endless Corridor',
    story: {
      speaker: 'The Master Core',
      emoji: '🔮',
      lines: [
        "The corridor stretches into infinity.",
        "You must recurse through the distance while an endless loop tests your breaking condition."
      ]
    },
    explain: {
      title: 'Loops & Recursion',
      description: [
        "Use a recursive function to break down the distance.",
        "Use a `while` loop that terminates dynamically using a `break`."
      ],
      code: "def step(d):\n    if d <= 0: return 0\n    return 1 + step(d-1)\n\nwhile True:\n    dist = step(5)\n    break",
      steps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Entering recursion.",
          lineNumber: 6,
          memorySnapshot: {},
          functionCall: { functionName: 'step', args: { d: '5' } },
          callStack: ['<module>', 'step']
        }
      ]
    },
    practice: {
      title: 'Collapse the Distance',
      description: 'Write a recursive function `collapse(n)` that returns `0` if `n <= 0`, else `1 + collapse(n-1)`. Then, in a `while True:` loop, call `res = collapse(3)` and `break`.',
      initialCode: 'def collapse(n):\n    # Write recursion\n    pass\n\n# Write while loop\n',
      validation: (code) => {
        const hasBase = /if\s+n\s*<=\s*0/.test(code);
        const hasRecur = /collapse\s*\(\s*n\s*-\s*1\s*\)/.test(code);
        const hasWhile = /while\s+True:/.test(code);
        const hasBreak = /break/.test(code);
        if (!hasBase || !hasRecur) return { isValid: false, error: 'Implement the recursive function correctly.' };
        if (!hasWhile || !hasBreak) return { isValid: false, error: 'You need an infinite `while` loop that breaks.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IDLE',
          description: "Corridor collapsed.",
          lineNumber: 7,
          memorySnapshot: {}
        }
      ]
    },
    challenge: dummyChallenge,
    rewardXP: 600
  },
  '53': {
    id: '53',
    title: 'Chapter 3: The Hall of Knowledge',
    story: {
      speaker: 'The Master Core',
      emoji: '🔮',
      lines: [
        "Stone statues block the way. They are empty object shells.",
        "Instantiate them and map them into a collection."
      ]
    },
    explain: {
      title: 'OOP & Collections',
      description: [
        "Define a class, instantiate it, and store the objects inside a dictionary.",
        "This maps unique IDs to complex behaviors."
      ],
      code: "class Guard:\n    def __init__(self, hp):\n        self.hp = hp\n\narmy = { 'G1': Guard(100), 'G2': Guard(150) }",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Army instantiated.",
          lineNumber: 5,
          memorySnapshot: {
            'army': { address: '0xDICT', name: 'army', value: "{'G1': <Guard object>, 'G2': <Guard object>}", type: 'dict' }
          }
        }
      ]
    },
    practice: {
      title: 'Awaken the Defenders',
      description: 'Create a class `Defender` with `__init__(self, id)`. Then create a dictionary `squad` mapping `"A"` to `Defender("A")` and `"B"` to `Defender("B")`.',
      initialCode: 'class Defender:\n    def __init__(self, id):\n        self.id = id\n\nsquad = {}\n# Populate squad\n',
      validation: (code) => {
        const hasClass = /class\s+Defender/.test(code);
        const hasDict = /squad\s*\[\s*["']A["']\s*\]\s*=\s*Defender\(\s*["']A["']\s*\)/.test(code);
        if (!hasClass) return { isValid: false, error: 'Do not remove the Defender class.' };
        if (!hasDict) return { isValid: false, error: 'Populate the `squad` dictionary with Defender objects.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Defenders awakened.",
          lineNumber: 6,
          memorySnapshot: {}
        }
      ]
    },
    challenge: dummyChallenge,
    rewardXP: 700
  },
  '54': {
    id: '54',
    title: 'Chapter 4: The Fractured Reality',
    story: {
      speaker: 'The Master Core',
      emoji: '🔮',
      lines: [
        "The reality is tearing apart! Exceptions are raining down.",
        "Catch the corruption and save the stable data to a file."
      ]
    },
    explain: {
      title: 'Exceptions & File I/O',
      description: [
        "Wrap dangerous operations in `try...except`.",
        "Use a `with open(...)` block to write only the safe data."
      ],
      code: "try:\n    data = int('corrupt')\nexcept ValueError:\n    with open('safe.txt', 'w') as f:\n        f.write('Saved!')",
      steps: [
        {
          id: 1,
          type: 'ERROR_CAUGHT',
          description: "Corruption isolated. File written.",
          lineNumber: 4,
          memorySnapshot: {},
          fileSystemSnapshot: { 'safe.txt': 'Saved!' }
        }
      ]
    },
    practice: {
      title: 'Secure the Data',
      description: 'Use a `try` block to convert `val = int("X")`. In the `except ValueError:` block, open `"reality.txt"` in `"w"` mode and write `"Stable"`.',
      initialCode: '# Secure reality\n',
      validation: (code) => {
        const hasTry = /try:/.test(code);
        const hasExcept = /except\s+ValueError:/.test(code);
        const hasOpen = /with\s+open\(\s*["']reality\.txt["']\s*,\s*["']w["']\s*\)\s+as/.test(code);
        if (!hasTry || !hasExcept) return { isValid: false, error: 'Use try and except ValueError.' };
        if (!hasOpen) return { isValid: false, error: 'Open `reality.txt` inside the except block.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_WRITE',
          description: "Reality stabilized.",
          lineNumber: 4,
          memorySnapshot: {},
          fileSystemSnapshot: { 'reality.txt': 'Stable' }
        }
      ]
    },
    challenge: dummyChallenge,
    rewardXP: 800
  },
  '55': {
    id: '55',
    title: 'Chapter 5: The Forgotten Network',
    story: {
      speaker: 'The Master Core',
      emoji: '🔮',
      lines: [
        "The dragon's lair is deeply nested in forgotten modules.",
        "Import the path and alias it to breach the firewall."
      ]
    },
    explain: {
      title: 'Modules & Libraries',
      description: [
        "Use advanced imports to navigate package structures.",
        "Aliasing hides your tracks from the system."
      ],
      code: "from dragon.lair.core import firewall as fw\nfw.bypass()",
      steps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Firewall bypassed.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: {
            'fw': { type: 'alias', exports: ['bypass'] }
          }
        }
      ]
    },
    practice: {
      title: 'Breach the Firewall',
      description: 'Write `from ancient.dragon.lair import gate as g`.',
      initialCode: '# Import and alias the gate\n',
      validation: (code) => {
        const hasImport = /from\s+ancient\.dragon\.lair\s+import\s+gate\s+as\s+g/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use exactly: `from ancient.dragon.lair import gate as g`' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Gate access acquired.",
          lineNumber: 1,
          memorySnapshot: {}
        }
      ]
    },
    challenge: dummyChallenge,
    rewardXP: 900
  },
  '56': {
    id: '56',
    title: 'Chapter 6: The Arena of Logic',
    story: {
      speaker: 'The Master Core',
      emoji: '🔮',
      lines: [
        "The vanguard attacks! Your logic must be flawless.",
        "Sort the chaos and pinpoint the exact weakness in O(log N) time."
      ]
    },
    explain: {
      title: 'Algorithms & Optimization',
      description: [
        "Combine your sorting logic with a binary search.",
        "If you do not optimize, you will be overwhelmed."
      ],
      code: "attacks.sort()\nlow, high = 0, len(attacks)-1\n# ... binary search loop",
      steps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Array sorted and pointer set.",
          lineNumber: 2,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Sort & Search',
            complexity: 'O(log N)',
            operations: 1,
            array: [10, 20, 30],
            pointers: { low: 0, high: 2 }
          }
        }
      ]
    },
    practice: {
      title: 'Final Stand',
      description: 'Given `arr = [3, 1, 2]`. First, sort it using `arr.sort()`. Then initialize `low = 0` and `high = len(arr) - 1`.',
      initialCode: 'arr = [3, 1, 2]\n# Sort and setup pointers\n',
      validation: (code) => {
        const hasSort = /arr\.sort\(\)/.test(code);
        const hasPointers = /low\s*=\s*0/i.test(code) && /high\s*=\s*len\(arr\)\s*-\s*1/i.test(code);
        if (!hasSort) return { isValid: false, error: 'You must sort `arr` first.' };
        if (!hasPointers) return { isValid: false, error: 'Initialize `low` and `high` correctly.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Ready for the Dragon.",
          lineNumber: 3,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Preparation Complete',
            complexity: 'O(1)',
            operations: 0,
            array: [1, 2, 3],
            pointers: { low: 0, high: 2 }
          }
        }
      ]
    },
    challenge: dummyChallenge,
    rewardXP: 1000
  }
};
