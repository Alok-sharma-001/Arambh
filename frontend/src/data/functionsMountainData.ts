import { LessonData } from './variablesForestData';

export const functionsMountainData: Record<string, LessonData> = {
  '16': {
    id: '16',
    title: 'The First Temple',
    story: {
      speaker: 'The Architect Hologram',
      emoji: '🧙‍♂️',
      lines: [
        "Deep within the Functions Mountain, you find a ruined temple. The inscriptions on the wall speak of a powerful magic: the ability to bundle actions together into a single, reusable command.",
        "This is known as a 'function'. Instead of repeating the same spell over and over, you write it once and invoke its name!"
      ]
    },
    explain: {
      title: 'Defining a Function',
      description: [
        "In Python, we create a function using the `def` keyword. It's like writing a recipe. You give it a name, and list the steps inside it.",
        "Notice the parentheses `()` after the name, and the colon `:` at the end of the line. The steps inside must be indented!"
      ],
      code: "def greet():\n    print('Hello, traveler!')\n\ngreet()",
      steps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Calling the greet() function.",
          lineNumber: 4,
          functionCall: { functionName: 'greet', args: {} },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printing greeting.",
          lineNumber: 2,
          output: "Hello, traveler!",
          memorySnapshot: {}
        },
        {
          id: 3,
          type: 'FUNCTION_RETURN',
          description: "Function execution completed.",
          lineNumber: 4,
          functionCall: { functionName: 'greet', args: {} },
          memorySnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Summoning Shield',
      description: 'Create a function named `summon_shield` that prints "Shield activated!". Call the function at the end.',
      initialCode: '# Define summon_shield here\n\n\n# Call it here\n',
      validation: (code) => {
        const hasDef = /def\s+summon_shield\s*\(\s*\)\s*:/.test(code);
        const hasPrint = /print\s*\(\s*['"]Shield activated!['"]\s*\)/.test(code);
        const hasCall = /summon_shield\s*\(\s*\)/.test(code.replace(/def\s+summon_shield\s*\(\s*\)\s*:/, ''));
        if (!hasDef) return { isValid: false, error: 'You must define `summon_shield()`.' };
        if (!hasPrint) return { isValid: false, error: 'Inside the function, print "Shield activated!".' };
        if (!hasCall) return { isValid: false, error: 'You must call `summon_shield()` at the end of your code.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked summon_shield()",
          lineNumber: 5,
          functionCall: { functionName: 'summon_shield', args: {} },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Shield activated!",
          lineNumber: 2,
          output: "Shield activated!",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'The Echo Spell',
      description: 'Define `echo_spell` to print "Echo...". Call it twice.',
      initialCode: '',
      validation: (code) => {
        const hasDef = /def\s+echo_spell\s*\(\s*\)\s*:/.test(code);
        const hasPrint = /print\s*\(\s*['"]Echo(?:\.\.\.)?['"]\s*\)/.test(code);
        const calls = code.match(/echo_spell\s*\(\s*\)/g);
        if (!hasDef) return { isValid: false, error: 'You must define `echo_spell()`.' };
        if (!hasPrint) return { isValid: false, error: 'You must print "Echo..." inside the function.' };
        if (!calls || calls.length < 3) return { isValid: false, error: 'Call the function twice.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked echo_spell()",
          lineNumber: 4,
          functionCall: { functionName: 'echo_spell', args: {} },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Echo...",
          lineNumber: 2,
          output: "Echo...",
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 100
  },
  '17': {
    id: '17',
    title: 'The Messenger Stones',
    story: {
      speaker: 'The Architect Hologram',
      emoji: '🪨',
      lines: [
        "As you ascend higher, you find floating stones that can carry messages into the temples.",
        "These are parameters—channels through which your function can receive specific energy to adapt its behavior."
      ]
    },
    explain: {
      title: 'Parameters and Arguments',
      description: [
        "Functions can be customized by giving them information to work with. We put variables inside the parentheses when defining the function. These are called parameters.",
        "When we call the function, we give it the actual value, called an argument: `greet(\"Arthur\")`."
      ],
      code: "def greet(name):\n    print('Hello, ' + name)\n\ngreet('Arthur')",
      steps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Calling greet() with name='Arthur'.",
          lineNumber: 4,
          functionCall: { functionName: 'greet', args: { name: "'Arthur'" } },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printing personalized greeting.",
          lineNumber: 2,
          output: "Hello, Arthur",
          memorySnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Cast Elemental Spell',
      description: 'Define a function called `cast_spell` that takes a parameter `element`. Inside, it should print the `element`. Call it with `"Fire"`.',
      initialCode: '# Define cast_spell\n\n\n# Call it with "Fire"\n',
      validation: (code) => {
        const hasDef = /def\s+cast_spell\s*\(\s*element\s*\)\s*:/.test(code);
        const hasPrint = /print\s*\(\s*element\s*\)/.test(code);
        const hasCall = /cast_spell\s*\(\s*["']Fire["']\s*\)/.test(code);
        if (!hasDef) return { isValid: false, error: 'Define `cast_spell(element)`.' };
        if (!hasPrint) return { isValid: false, error: 'Print the `element` inside the function.' };
        if (!hasCall) return { isValid: false, error: 'Call `cast_spell("Fire")`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked cast_spell('Fire')",
          lineNumber: 5,
          functionCall: { functionName: 'cast_spell', args: { element: "'Fire'" } },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Fire",
          lineNumber: 2,
          output: "Fire",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Double Trouble',
      description: 'Define a function `attack` that takes `weapon` and `damage`. Print them together.',
      initialCode: '',
      validation: (code) => {
        const hasDef = /def\s+attack\s*\(\s*weapon\s*,\s*damage\s*\)\s*:/.test(code);
        const hasPrint = /print\s*\(\s*weapon\s*,\s*damage\s*\)/.test(code);
        if (!hasDef) return { isValid: false, error: 'You must name your parameters exactly `weapon` and `damage` like this: def attack(weapon, damage):' };
        if (!hasPrint) return { isValid: false, error: 'You must print(weapon, damage) inside the function.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked attack()",
          lineNumber: 4,
          functionCall: { functionName: 'attack', args: { weapon: "'Sword'", damage: "50" } },
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 100
  },
  '18': {
    id: '18',
    title: 'Return Energy',
    story: {
      speaker: 'The Architect Hologram',
      emoji: '⚡',
      lines: [
        "A function can also send energy back to you after it finishes its work.",
        "At the peak of the Return Energy shrine, you must harness the power of the `return` statement."
      ]
    },
    explain: {
      title: 'The Return Statement',
      description: [
        "Instead of just printing a result, a function can hand a value back to the code that called it using `return`.",
        "This allows you to store the result in a variable and use it later."
      ],
      code: "def add_power(base, bonus):\n    return base + bonus\n\ntotal = add_power(10, 5)",
      steps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Calling add_power(10, 5).",
          lineNumber: 4,
          functionCall: { functionName: 'add_power', args: { base: '10', bonus: '5' } },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'FUNCTION_RETURN',
          description: "Returning result 15.",
          lineNumber: 2,
          functionCall: { functionName: 'add_power', args: { base: '10', bonus: '5' }, returnValue: '15' },
          memorySnapshot: {}
        },
        {
          id: 3,
          type: 'ALLOCATE',
          description: "Allocating total variable.",
          lineNumber: 4,
          variable: { address: '0x00', name: 'total', value: '15', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'total', value: '15', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'Calculate Damage',
      description: 'Define a function `calculate_damage` that takes `strength` and `weapon`. It should `return` their sum.',
      initialCode: '# Define calculate_damage\n\n\n# damage = calculate_damage(10, 20)\n',
      validation: (code) => {
        const hasDef = /def\s+calculate_damage\s*\(\s*strength\s*,\s*weapon\s*\)\s*:/.test(code);
        const hasAddition = /strength\s*\+\s*weapon/.test(code);
        const hasReturn = /return/.test(code);
        if (!hasDef) return { isValid: false, error: 'Define `calculate_damage(strength, weapon)`.' };
        if (!hasAddition) return { isValid: false, error: 'You need to add strength + weapon.' };
        if (!hasReturn) return { isValid: false, error: 'You must use the `return` keyword.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked calculate_damage(10, 20)",
          lineNumber: 4,
          functionCall: { functionName: 'calculate_damage', args: { strength: '10', weapon: '20' } },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'FUNCTION_RETURN',
          description: "Returned 30",
          lineNumber: 2,
          functionCall: { functionName: 'calculate_damage', args: { strength: '10', weapon: '20' }, returnValue: '30' },
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Damage Multiplier',
      description: 'Create a function `multiply` that takes `a` and `b` and returns their product.',
      initialCode: '',
      validation: (code) => {
        const hasDef = /def\s+multiply\s*\(\s*a\s*,\s*b\s*\)\s*:/.test(code);
        const hasReturn = /return\s+a\s*\*\s*b/.test(code);
        if (!hasDef || !hasReturn) return { isValid: false, error: 'Define `multiply(a, b)` and return `a * b`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked multiply()",
          lineNumber: 4,
          functionCall: { functionName: 'multiply', args: { a: '2', b: '3' } },
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 120
  },
  '19': {
    id: '19',
    title: 'The Hidden Chambers',
    story: {
      speaker: 'The Architect Hologram',
      emoji: '🚪',
      lines: [
        "Inside the grand temple, there are hidden chambers.",
        "Magic cast inside these chambers cannot be seen from the outside. This is the mystery of variable scope."
      ]
    },
    explain: {
      title: 'Local vs Global Scope',
      description: [
        "Variables created inside a function are 'local' to that function. They disappear when the function finishes.",
        "Variables created outside functions are 'global'."
      ],
      code: "mana = 100 # Global\n\ndef cast():\n    cost = 20 # Local\n    print(mana - cost)",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Allocated global mana.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'mana', value: '100', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'mana', value: '100', type: 'int' } }
        },
        {
          id: 2,
          type: 'FUNCTION_CALL',
          description: "Calling cast().",
          lineNumber: 6,
          functionCall: { functionName: 'cast', args: {} },
          memorySnapshot: { '0x00': { address: '0x00', name: 'mana', value: '100', type: 'int' } }
        },
        {
          id: 3,
          type: 'ALLOCATE',
          description: "Allocated local cost.",
          lineNumber: 4,
          variable: { address: '0x01', name: 'cost', value: '20', type: 'int' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'mana', value: '100', type: 'int' },
            '0x01': { address: '0x01', name: 'cost', value: '20', type: 'int' }
          }
        }
      ]
    },
    practice: {
      title: 'Stealth Mode',
      description: 'Define a function `stealth_mode`. Inside it, create a local variable `visibility` set to 0. Do nothing else.',
      initialCode: '# Define stealth_mode\n\n\n',
      validation: (code) => {
        const hasDef = /def\s+stealth_mode\s*\(\s*\)\s*:/.test(code);
        const hasLocal = /visibility\s*=\s*0/.test(code);
        if (!hasDef) return { isValid: false, error: 'Define `stealth_mode()`.' };
        if (!hasLocal) return { isValid: false, error: 'Create `visibility = 0` inside.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked stealth_mode()",
          lineNumber: 4,
          functionCall: { functionName: 'stealth_mode', args: {} },
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Scope Master',
      description: 'Define a function that uses a global variable.',
      initialCode: 'power = 50\n',
      validation: (code) => {
        const hasDef = /def\s+use_power\s*\(\s*\)\s*:/.test(code) || /def/.test(code);
        if (!hasDef) return { isValid: false, error: 'Define any function.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked function",
          lineNumber: 4,
          functionCall: { functionName: 'use_power', args: {} },
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 100
  },
  '20': {
    id: '20',
    title: 'The Architect\'s Blueprint',
    story: {
      speaker: 'The Architect Hologram',
      emoji: '📜',
      lines: [
        "You have reached the inner sanctum. To prove yourself worthy of facing The Forgotten Architect, you must forge a complete spell that takes input and returns transformed energy."
      ]
    },
    explain: {
      title: 'Putting it all together',
      description: [
        "You now know all the pieces. Let's build a robust function that combines parameters and return values.",
        "This is how the most powerful magic in the realm is constructed."
      ],
      code: "def amplify(base, factor):\n    result = base * factor\n    return result\n\nfinal = amplify(10, 3)",
      steps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Calling amplify(10, 3).",
          lineNumber: 5,
          functionCall: { functionName: 'amplify', args: { base: '10', factor: '3' } },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Allocated local result.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'result', value: '30', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'result', value: '30', type: 'int' } }
        },
        {
          id: 3,
          type: 'FUNCTION_RETURN',
          description: "Returning result 30.",
          lineNumber: 3,
          functionCall: { functionName: 'amplify', args: { base: '10', factor: '3' }, returnValue: '30' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'result', value: '30', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'Power Multiplier',
      description: 'Define a function `power_multiplier` that takes `base_power` and `multiplier`. Calculate their product, store it in `result`, and `return result`.',
      initialCode: '# Define power_multiplier\n\n\n',
      validation: (code) => {
        const hasDef = /def\s+power_multiplier\s*\(\s*base_power\s*,\s*multiplier\s*\)\s*:/.test(code);
        const hasCalc = /result\s*=\s*base_power\s*\*\s*multiplier/.test(code);
        const hasReturn = /return\s+result/.test(code);
        if (!hasDef) return { isValid: false, error: 'Define `power_multiplier(base_power, multiplier)`.' };
        if (!hasCalc) return { isValid: false, error: 'Calculate `result = base_power * multiplier`.' };
        if (!hasReturn) return { isValid: false, error: 'Use `return result`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked power_multiplier()",
          lineNumber: 4,
          functionCall: { functionName: 'power_multiplier', args: { base_power: '10', multiplier: '5' } },
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Architect\'s Door',
      description: 'Create a fully working function to unlock the final boss door.',
      initialCode: '',
      validation: (code) => {
        const hasDef = /def/.test(code);
        const hasReturn = /return/.test(code);
        if (!hasDef || !hasReturn) return { isValid: false, error: 'You need a function with a return.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FUNCTION_CALL',
          description: "Invoked final spell.",
          lineNumber: 4,
          functionCall: { functionName: 'final_spell', args: {} },
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 150
  }
};
