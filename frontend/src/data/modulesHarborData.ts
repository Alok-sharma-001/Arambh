import { LessonData } from './variablesForestData';

export const modulesHarborData: Record<string, LessonData> = {
  '41': {
    id: '41',
    title: 'The Harbor Gate',
    story: {
      speaker: 'Harbor Master',
      emoji: '⚓',
      lines: [
        "A grand galleon from the Mathematics Kingdom approaches the harbor.",
        "You must cast the `import` spell to allow their vast cargo of formulas to dock."
      ]
    },
    explain: {
      title: 'Importing Modules',
      description: [
        "A module is a file containing Python code.",
        "Use `import modulename` to load it.",
        "Access its functions using dot notation, e.g., `math.sqrt(16)`."
      ],
      code: "import math\nresult = math.sqrt(16)",
      steps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported the math module.",
          lineNumber: 1,
          memorySnapshot: {},
          fileSystemSnapshot: {},
          importedModules: { 'math': { type: 'built-in', exports: ['sqrt', 'pi', 'floor', 'ceil'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Calculated square root.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'result', value: '4.0', type: 'float' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'result', value: '4.0', type: 'float' } },
          importedModules: { 'math': { type: 'built-in', exports: ['sqrt', 'pi', 'floor', 'ceil'] } }
        }
      ]
    },
    practice: {
      title: 'Dock the Galleon',
      description: '`import math` and use `math.sqrt(16)` to calculate the square root, assigning it to `result`.',
      initialCode: '# Import math\n\n# Calculate sqrt of 16\n',
      validation: (code) => {
        const hasImport = /import\s+math/.test(code);
        const hasSqrt = /result\s*=\s*math\.sqrt\(\s*16\s*\)/.test(code);
        if (!hasImport) return { isValid: false, error: 'You must `import math`.' };
        if (!hasSqrt) return { isValid: false, error: 'You must assign `math.sqrt(16)` to `result`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Math module docked successfully.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'math': { type: 'built-in', exports: ['sqrt', 'pi'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Computed square root.",
          lineNumber: 3,
          variable: { address: '0x00', name: 'result', value: '4.0', type: 'float' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'result', value: '4.0', type: 'float' } },
          importedModules: { 'math': { type: 'built-in', exports: ['sqrt', 'pi'] } }
        }
      ]
    },
    challenge: {
      title: 'Roll the Dice',
      description: 'Import the `random` module. Generate a random integer between 1 and 10 using `random.randint(1, 10)` and store it in `roll`.',
      initialCode: '# Import random\n\n# Generate randint(1, 10)\n',
      validation: (code) => {
        const hasImport = /import\s+random/.test(code);
        const hasRoll = /roll\s*=\s*random\.randint\(\s*1\s*,\s*10\s*\)/.test(code);
        if (!hasImport) return { isValid: false, error: 'You must `import random`.' };
        if (!hasRoll) return { isValid: false, error: 'Assign `random.randint(1, 10)` to `roll`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Random module docked.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'random': { type: 'built-in', exports: ['randint', 'choice'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Rolled a random number.",
          lineNumber: 3,
          variable: { address: '0x00', name: 'roll', value: '7', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'roll', value: '7', type: 'int' } },
          importedModules: { 'random': { type: 'built-in', exports: ['randint', 'choice'] } }
        }
      ]
    },
    rewardXP: 150
  },
  '42': {
    id: '42',
    title: 'Ships of Knowledge',
    story: {
      speaker: 'Harbor Master',
      emoji: '⚓',
      lines: [
        "Sometimes you don't need the entire ship's cargo.",
        "Extract exactly what you need using specific imports to avoid flooding the docks."
      ]
    },
    explain: {
      title: 'Specific Imports',
      description: [
        "Use `from module import function` to bring a specific tool directly into your workspace.",
        "You no longer need to use the module name (dot notation)."
      ],
      code: "from math import pi\narea = pi * 5 * 5",
      steps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported pi from math directly.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'math.pi': { type: 'specific', exports: ['pi'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Calculated area.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'area', value: '78.5398', type: 'float' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'area', value: '78.5398', type: 'float' } },
          importedModules: { 'math.pi': { type: 'specific', exports: ['pi'] } }
        }
      ]
    },
    practice: {
      title: 'Specific Artifact',
      description: 'Use `from math import pi`. Create `radius = 5`, then calculate `area = pi * radius * radius`.',
      initialCode: '# From math import pi\n\nradius = 5\n# Calculate area\n',
      validation: (code) => {
        const hasImport = /from\s+math\s+import\s+pi/.test(code);
        const hasArea = /area\s*=\s*pi\s*\*\s*radius\s*\*\s*radius/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use `from math import pi`.' };
        if (!hasArea) return { isValid: false, error: 'Calculate `area = pi * radius * radius`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported pi.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'math.pi': { type: 'specific', exports: ['pi'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Calculated area.",
          lineNumber: 4,
          variable: { address: '0x01', name: 'area', value: '78.53', type: 'float' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'area', value: '78.53', type: 'float' } },
          importedModules: { 'math.pi': { type: 'specific', exports: ['pi'] } }
        }
      ]
    },
    challenge: {
      title: 'Select a Weapon',
      description: 'Use `from random import choice`. Create `weapons = ["sword", "bow", "staff"]` and use `choice(weapons)` to pick one, assigning it to `equipped`.',
      initialCode: '# From random import choice\n\nweapons = ["sword", "bow", "staff"]\n# Equip a random weapon\n',
      validation: (code) => {
        const hasImport = /from\s+random\s+import\s+choice/.test(code);
        const hasChoice = /equipped\s*=\s*choice\(\s*weapons\s*\)/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use `from random import choice`.' };
        if (!hasChoice) return { isValid: false, error: 'Assign `choice(weapons)` to `equipped`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported choice.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'random.choice': { type: 'specific', exports: ['choice'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Equipped a random weapon.",
          lineNumber: 4,
          variable: { address: '0x02', name: 'equipped', value: '"bow"', type: 'string' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'equipped', value: '"bow"', type: 'string' } },
          importedModules: { 'random.choice': { type: 'specific', exports: ['choice'] } }
        }
      ]
    },
    rewardXP: 200
  },
  '43': {
    id: '43',
    title: "The Smuggler's Alias",
    story: {
      speaker: 'Smuggler',
      emoji: '🏴‍☠️',
      lines: [
        "Some magical tools have names that are too long or attract too much attention.",
        "Use aliases to smuggle the spells smoothly into your code."
      ]
    },
    explain: {
      title: 'Aliasing Imports',
      description: [
        "Use the `as` keyword to rename a module or function.",
        "Example: `import datetime as dt` allows you to type `dt` instead of `datetime`.",
        "Example: `from random import randint as rint`."
      ],
      code: "import random as rng\nchance = rng.random()",
      steps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported random with alias rng.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'random (as rng)': { type: 'alias', exports: ['random', 'randint'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Generated chance.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'chance', value: '0.85', type: 'float' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'chance', value: '0.85', type: 'float' } },
          importedModules: { 'random (as rng)': { type: 'alias', exports: ['random', 'randint'] } }
        }
      ]
    },
    practice: {
      title: 'Cloaked Randomness',
      description: '`import random as rng` and use `rng.random()` to generate a float, assigning it to `chance`.',
      initialCode: '# Import random as rng\n\n# Generate chance\n',
      validation: (code) => {
        const hasImport = /import\s+random\s+as\s+rng/.test(code);
        const hasChance = /chance\s*=\s*rng\.random\(\)/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use `import random as rng`.' };
        if (!hasChance) return { isValid: false, error: 'Assign `rng.random()` to `chance`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported random as rng.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'random (as rng)': { type: 'alias', exports: ['random'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Calculated chance.",
          lineNumber: 3,
          variable: { address: '0x00', name: 'chance', value: '0.42', type: 'float' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'chance', value: '0.42', type: 'float' } },
          importedModules: { 'random (as rng)': { type: 'alias', exports: ['random'] } }
        }
      ]
    },
    challenge: {
      title: 'A Shorter Factorial',
      description: '`from math import factorial as fact` and calculate the factorial of 5, assigning it to `result`.',
      initialCode: '# Import factorial as fact\n\n# Calculate fact(5)\n',
      validation: (code) => {
        const hasImport = /from\s+math\s+import\s+factorial\s+as\s+fact/.test(code);
        const hasResult = /result\s*=\s*fact\(\s*5\s*\)/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use `from math import factorial as fact`.' };
        if (!hasResult) return { isValid: false, error: 'Calculate `fact(5)`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported factorial as fact.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'math.factorial (as fact)': { type: 'alias', exports: ['fact'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Calculated factorial.",
          lineNumber: 3,
          variable: { address: '0x00', name: 'result', value: '120', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'result', value: '120', type: 'int' } },
          importedModules: { 'math.factorial (as fact)': { type: 'alias', exports: ['fact'] } }
        }
      ]
    },
    rewardXP: 250
  },
  '44': {
    id: '44',
    title: 'Merchant Guilds',
    story: {
      speaker: 'Guildmaster',
      emoji: '🏛️',
      lines: [
        "The time has come to start your own merchant guild.",
        "Any Python file you create can be imported as a custom module!"
      ]
    },
    explain: {
      title: 'Custom Modules',
      description: [
        "If you have a file named `hero.py`, you can `import hero` in your `main.py`.",
        "You can then access variables and functions defined in `hero.py`."
      ],
      code: "# In hero.py: hp = 100\n# In main.py:\nimport hero\ncurrent = hero.hp",
      steps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported custom module hero.",
          lineNumber: 2,
          memorySnapshot: {},
          fileSystemSnapshot: { 'hero.py': 'hp = 100\nname = "Arthur"' },
          importedModules: { 'hero': { type: 'custom', exports: ['hp', 'name'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Accessed hero.hp.",
          lineNumber: 3,
          variable: { address: '0x00', name: 'current', value: '100', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'current', value: '100', type: 'int' } },
          fileSystemSnapshot: { 'hero.py': 'hp = 100\nname = "Arthur"' },
          importedModules: { 'hero': { type: 'custom', exports: ['hp', 'name'] } }
        }
      ]
    },
    practice: {
      title: 'Import the Hero',
      description: 'Assume `hero.py` exists and contains `hp = 100`. In your `main.py`, write `import hero` and then `current_hp = hero.hp`.',
      initialCode: '# Import hero\n\n# Get hero.hp\n',
      validation: (code) => {
        const hasImport = /import\s+hero/.test(code);
        const hasHP = /current_hp\s*=\s*hero\.hp/.test(code);
        if (!hasImport) return { isValid: false, error: 'You must `import hero`.' };
        if (!hasHP) return { isValid: false, error: 'Assign `hero.hp` to `current_hp`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported custom module hero.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'hero': { type: 'custom', exports: ['hp'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Retrieved HP.",
          lineNumber: 3,
          variable: { address: '0x01', name: 'current_hp', value: '100', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'current_hp', value: '100', type: 'int' } },
          importedModules: { 'hero': { type: 'custom', exports: ['hp'] } }
        }
      ]
    },
    challenge: {
      title: 'Crafting Weapons',
      description: 'Assume `crafting.py` exists with `def forge(): return "Sword"`. Write `from crafting import forge` and call it: `weapon = forge()`.',
      initialCode: '# From crafting import forge\n\n# Call forge()\n',
      validation: (code) => {
        const hasImport = /from\s+crafting\s+import\s+forge/.test(code);
        const hasWeapon = /weapon\s*=\s*forge\(\)/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use `from crafting import forge`.' };
        if (!hasWeapon) return { isValid: false, error: 'Assign `forge()` to `weapon`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported forge from crafting.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'crafting.forge': { type: 'custom', exports: ['forge'] } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Forged a sword.",
          lineNumber: 3,
          variable: { address: '0x02', name: 'weapon', value: '"Sword"', type: 'string' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'weapon', value: '"Sword"', type: 'string' } },
          importedModules: { 'crafting.forge': { type: 'custom', exports: ['forge'] } }
        }
      ]
    },
    rewardXP: 250
  },
  '45': {
    id: '45',
    title: 'The Great Trade Network',
    story: {
      speaker: 'Harbor Master',
      emoji: '⚓',
      lines: [
        "As your guild expands, you establish an entire district in the harbor—a Package!",
        "Folders full of modules are linked together in the Great Trade Network."
      ]
    },
    explain: {
      title: 'Packages',
      description: [
        "A package is a folder containing Python modules.",
        "You can navigate the folder structure using dot notation.",
        "Example: `import harbor.docks.cargo` or `from harbor.docks import cargo`."
      ],
      code: "from harbor.docks.cargo import load_ship\nload_ship()",
      steps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Navigated package and imported load_ship.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'harbor.docks.cargo': { type: 'package', exports: ['load_ship'] } }
        },
        {
          id: 2,
          type: 'EVALUATE',
          description: "Loaded the ship.",
          lineNumber: 2,
          memorySnapshot: {},
          importedModules: { 'harbor.docks.cargo': { type: 'package', exports: ['load_ship'] } }
        }
      ]
    },
    practice: {
      title: 'Import the Cargo',
      description: 'Write an import statement to import the specific module `cargo` from the `harbor.docks` package: `import harbor.docks.cargo`.',
      initialCode: '# Import harbor.docks.cargo\n',
      validation: (code) => {
        const hasImport = /import\s+harbor\.docks\.cargo/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use `import harbor.docks.cargo`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported cargo module from package.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'harbor.docks.cargo': { type: 'package', exports: ['cargo'] } }
        }
      ]
    },
    challenge: {
      title: 'Load the Ship',
      description: 'Using `from ... import`, write: `from harbor.docks.cargo import load_ship`, then call `load_ship()`.',
      initialCode: '# From harbor.docks.cargo import load_ship\n\n# Call it\n',
      validation: (code) => {
        const hasImport = /from\s+harbor\.docks\.cargo\s+import\s+load_ship/.test(code);
        const hasCall = /load_ship\(\)/.test(code);
        if (!hasImport) return { isValid: false, error: 'Use `from harbor.docks.cargo import load_ship`.' };
        if (!hasCall) return { isValid: false, error: 'Call `load_ship()`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'IMPORT_MODULE',
          description: "Imported load_ship from package.",
          lineNumber: 1,
          memorySnapshot: {},
          importedModules: { 'harbor.docks.cargo.load_ship': { type: 'package', exports: ['load_ship'] } }
        },
        {
          id: 2,
          type: 'EVALUATE',
          description: "Function executed successfully.",
          lineNumber: 3,
          memorySnapshot: {},
          importedModules: { 'harbor.docks.cargo.load_ship': { type: 'package', exports: ['load_ship'] } }
        }
      ]
    },
    rewardXP: 300
  }
};
