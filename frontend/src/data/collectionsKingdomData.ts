import { LessonData } from './variablesForestData';

export const collectionsKingdomData: Record<string, LessonData> = {
  '21': {
    id: '21',
    title: 'The List Vault',
    story: {
      speaker: 'Vault Keeper',
      emoji: '🧰',
      lines: [
        "Welcome to the Collections Kingdom. The first vault contains the most common of all storage devices: The List.",
        "A List is like a treasure chest. It can hold many items in a specific order, and you can always add or remove things later."
      ]
    },
    explain: {
      title: 'Creating and Accessing Lists',
      description: [
        "Lists are created using square brackets `[]`. Items are separated by commas.",
        "You can access an item by its position, called its 'index'. In Python, we start counting at 0!"
      ],
      code: "inventory = ['sword', 'shield', 'potion']\nprint(inventory[0])",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created a list containing 3 items.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'inventory', value: "['sword', 'shield', 'potion']", type: 'list' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'inventory', value: "['sword', 'shield', 'potion']", type: 'list' } }
        },
        {
          id: 2,
          type: 'EVALUATE',
          description: "Accessing index 0 of inventory.",
          lineNumber: 2,
          evaluation: { leftVal: "['sword', 'shield', 'potion']", rightVal: "0", operator: "[]", result: "'sword'", targetVarName: "output" },
          memorySnapshot: { '0x00': { address: '0x00', name: 'inventory', value: "['sword', 'shield', 'potion']", type: 'list' } }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed 'sword'",
          lineNumber: 2,
          output: "sword",
          memorySnapshot: { '0x00': { address: '0x00', name: 'inventory', value: "['sword', 'shield', 'potion']", type: 'list' } }
        }
      ]
    },
    practice: {
      title: 'Pack Your Bag',
      description: 'Create a list called `bag` containing "map" and "compass". Print the first item.',
      initialCode: '# Create bag\n\n\n# Print index 0\n',
      validation: (code) => {
        const hasList = /bag\s*=\s*\[\s*['"]map['"]\s*,\s*['"]compass['"]\s*\]/.test(code);
        const hasPrint = /print\s*\(\s*bag\s*\[\s*0\s*\]\s*\)/.test(code);
        if (!hasList) return { isValid: false, error: 'You must define `bag = ["map", "compass"]`.' };
        if (!hasPrint) return { isValid: false, error: 'You must print `bag[0]`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created bag list.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'bag', value: "['map', 'compass']", type: 'list' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'bag', value: "['map', 'compass']", type: 'list' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed map.",
          lineNumber: 5,
          output: "map",
          memorySnapshot: { '0x00': { address: '0x00', name: 'bag', value: "['map', 'compass']", type: 'list' } }
        }
      ]
    },
    challenge: {
      title: 'Update the Chest',
      description: 'Lists are mutable. You can change items! Given the list `chest = ["dust"]`, change the item at index 0 to `"gold"`, then print the list.',
      initialCode: 'chest = ["dust"]\n# Update index 0 to "gold"\n\n\n# print chest\n',
      validation: (code) => {
        const hasUpdate = /chest\s*\[\s*0\s*\]\s*=\s*['"]gold['"]/.test(code);
        const hasPrint = /print\s*\(\s*chest\s*\)/.test(code);
        if (!hasUpdate) return { isValid: false, error: 'You must update `chest[0] = "gold"`.' };
        if (!hasPrint) return { isValid: false, error: 'You must print `chest`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created chest.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'chest', value: "['dust']", type: 'list' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'chest', value: "['dust']", type: 'list' } }
        },
        {
          id: 2,
          type: 'UPDATE',
          description: "Updated chest index 0.",
          lineNumber: 3,
          variable: { address: '0x00', name: 'chest', value: "['gold']", type: 'list' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'chest', value: "['gold']", type: 'list' } }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed chest.",
          lineNumber: 6,
          output: "['gold']",
          memorySnapshot: { '0x00': { address: '0x00', name: 'chest', value: "['gold']", type: 'list' } }
        }
      ]
    },
    rewardXP: 100
  },
  '22': {
    id: '22',
    title: 'The Immutable Archive',
    story: {
      speaker: 'Archive Guardian',
      emoji: '📜',
      lines: [
        "Behold the Ancient Stone Tablets. These are Tuples.",
        "Like Lists, they hold ordered items. But unlike Lists, once you carve a Tuple into stone, it can never be changed. It is 'immutable'."
      ]
    },
    explain: {
      title: 'Tuples',
      description: [
        "Tuples use parentheses `()` instead of square brackets.",
        "They are faster than lists and protect data from accidental modification."
      ],
      code: "coordinates = (10, 20)\nprint(coordinates[1])",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created a tuple.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'coordinates', value: "(10, 20)", type: 'tuple' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'coordinates', value: "(10, 20)", type: 'tuple' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed 20",
          lineNumber: 2,
          output: "20",
          memorySnapshot: { '0x00': { address: '0x00', name: 'coordinates', value: "(10, 20)", type: 'tuple' } }
        }
      ]
    },
    practice: {
      title: 'Carve the Stone',
      description: 'Create a tuple called `stats` with the numbers `100` and `50`. Print the `stats`.',
      initialCode: '# Create stats\n\n\n# Print stats\n',
      validation: (code) => {
        const hasTuple = /stats\s*=\s*\(\s*100\s*,\s*50\s*\)/.test(code);
        const hasPrint = /print\s*\(\s*stats\s*\)/.test(code);
        if (!hasTuple) return { isValid: false, error: 'You must define `stats = (100, 50)`.' };
        if (!hasPrint) return { isValid: false, error: 'You must print `stats`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created tuple.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'stats', value: "(100, 50)", type: 'tuple' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'stats', value: "(100, 50)", type: 'tuple' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed tuple.",
          lineNumber: 5,
          output: "(100, 50)",
          memorySnapshot: { '0x00': { address: '0x00', name: 'stats', value: "(100, 50)", type: 'tuple' } }
        }
      ]
    },
    challenge: {
      title: 'The Lock Mechanism',
      description: 'Try to update index 0 of `lock = (1, 2)` to `9`. Then run it. (Wait, you can\'t! Just print `lock[0]` instead to observe the lock).',
      initialCode: 'lock = (1, 2)\n# Print the first item of lock\n',
      validation: (code) => {
        const hasPrint = /print\s*\(\s*lock\s*\[\s*0\s*\]\s*\)/.test(code);
        if (!hasPrint) return { isValid: false, error: 'Print `lock[0]`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created tuple lock.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'lock', value: "(1, 2)", type: 'tuple' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'lock', value: "(1, 2)", type: 'tuple' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed 1.",
          lineNumber: 3,
          output: "1",
          memorySnapshot: { '0x00': { address: '0x00', name: 'lock', value: "(1, 2)", type: 'tuple' } }
        }
      ]
    },
    rewardXP: 100
  },
  '23': {
    id: '23',
    title: 'Hall of Uniqueness',
    story: {
      speaker: 'The Set Master',
      emoji: '🔮',
      lines: [
        "Step into the Magic Circle. Here, duplicates vanish into thin air.",
        "A Set is an unordered collection where every item must be unique. It is extremely fast at checking if an item exists!"
      ]
    },
    explain: {
      title: 'Sets',
      description: [
        "Sets use curly braces `{}`. If you put duplicates in, they are instantly removed.",
        "Because Sets have no order, you cannot access items by index (like `set[0]`)."
      ],
      code: "magic = {1, 2, 2, 3}\nprint(magic)",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created a set. Duplicates removed automatically.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'magic', value: "{1, 2, 3}", type: 'set' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'magic', value: "{1, 2, 3}", type: 'set' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed set.",
          lineNumber: 2,
          output: "{1, 2, 3}",
          memorySnapshot: { '0x00': { address: '0x00', name: 'magic', value: "{1, 2, 3}", type: 'set' } }
        }
      ]
    },
    practice: {
      title: 'Purify the Elements',
      description: 'Create a set called `elements` with values `1, 1, 5, 5`. Print it. Watch the duplicates vanish!',
      initialCode: '# Create elements set\n\n\n# Print elements\n',
      validation: (code) => {
        const hasSet = /elements\s*=\s*\{\s*1\s*,\s*1\s*,\s*5\s*,\s*5\s*\}/.test(code);
        const hasPrint = /print\s*\(\s*elements\s*\)/.test(code);
        if (!hasSet) return { isValid: false, error: 'You must define `elements = {1, 1, 5, 5}`.' };
        if (!hasPrint) return { isValid: false, error: 'You must print `elements`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created elements set.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'elements', value: "{1, 5}", type: 'set' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'elements', value: "{1, 5}", type: 'set' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed unique elements.",
          lineNumber: 5,
          output: "{1, 5}",
          memorySnapshot: { '0x00': { address: '0x00', name: 'elements', value: "{1, 5}", type: 'set' } }
        }
      ]
    },
    challenge: {
      title: 'Membership Testing',
      description: 'You can check if a set has an item using `in`. Print the result of `3 in {1, 2, 3}`.',
      initialCode: '',
      validation: (code) => {
        const hasPrint = /print\s*\(\s*3\s+in\s+\{\s*1\s*,\s*2\s*,\s*3\s*\}\s*\)/.test(code);
        if (!hasPrint) return { isValid: false, error: 'Use `print(3 in {1, 2, 3})`' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Printed True",
          lineNumber: 1,
          output: "True",
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 100
  },
  '24': {
    id: '24',
    title: 'The Key Master Library',
    story: {
      speaker: 'Librarian',
      emoji: '📚',
      lines: [
        "Sometimes numbers aren't enough. In a vast library, you look for a book by its title, not its index.",
        "Dictionaries store data in Key-Value pairs. You provide the Key, and the Dictionary gives you the Value."
      ]
    },
    explain: {
      title: 'Dictionaries',
      description: [
        "Dictionaries use curly braces `{}`, but they hold pairs separated by colons `:`.",
        "You access a value by putting the key in square brackets."
      ],
      code: "player = {'name': 'Hero', 'level': 5}\nprint(player['name'])",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created a dictionary.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'player', value: '{"name": "Hero", "level": 5}', type: 'dict' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'player', value: '{"name": "Hero", "level": 5}', type: 'dict' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed Hero",
          lineNumber: 2,
          output: "Hero",
          memorySnapshot: { '0x00': { address: '0x00', name: 'player', value: '{"name": "Hero", "level": 5}', type: 'dict' } }
        }
      ]
    },
    practice: {
      title: 'Register the Hero',
      description: 'Create a dictionary `hero` with keys `"hp"` set to `100` and `"mp"` set to `50`. Print the `"hp"` value.',
      initialCode: '# Create hero dictionary\n\n\n# Print the hp value\n',
      validation: (code) => {
        const hasDict = /hero\s*=\s*\{\s*['"]hp['"]\s*:\s*100\s*,\s*['"]mp['"]\s*:\s*50\s*\}/.test(code);
        const hasPrint = /print\s*\(\s*hero\s*\[\s*['"]hp['"]\s*\]\s*\)/.test(code);
        if (!hasDict) return { isValid: false, error: 'Define `hero = {"hp": 100, "mp": 50}`.' };
        if (!hasPrint) return { isValid: false, error: 'Print `hero["hp"]`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created hero dictionary.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'hero', value: '{"hp": 100, "mp": 50}', type: 'dict' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'hero', value: '{"hp": 100, "mp": 50}', type: 'dict' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed 100",
          lineNumber: 5,
          output: "100",
          memorySnapshot: { '0x00': { address: '0x00', name: 'hero', value: '{"hp": 100, "mp": 50}', type: 'dict' } }
        }
      ]
    },
    challenge: {
      title: 'Level Up',
      description: 'Update the `"level"` key in the `stats` dictionary to `2`. Then print the dictionary.',
      initialCode: 'stats = {"level": 1}\n# Update level to 2\n\n\n# Print stats',
      validation: (code) => {
        const hasUpdate = /stats\s*\[\s*['"]level['"]\s*\]\s*=\s*2/.test(code);
        const hasPrint = /print\s*\(\s*stats\s*\)/.test(code);
        if (!hasUpdate) return { isValid: false, error: 'Update `stats["level"] = 2`.' };
        if (!hasPrint) return { isValid: false, error: 'Print `stats`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created stats.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'stats', value: '{"level": 1}', type: 'dict' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'stats', value: '{"level": 1}', type: 'dict' } }
        },
        {
          id: 2,
          type: 'UPDATE',
          description: "Updated level.",
          lineNumber: 3,
          variable: { address: '0x00', name: 'stats', value: '{"level": 2}', type: 'dict' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'stats', value: '{"level": 2}', type: 'dict' } }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed dictionary.",
          lineNumber: 6,
          output: "{'level': 2}",
          memorySnapshot: { '0x00': { address: '0x00', name: 'stats', value: '{"level": 2}', type: 'dict' } }
        }
      ]
    },
    rewardXP: 100
  },
  '25': {
    id: '25',
    title: 'Kingdom Management',
    story: {
      speaker: 'The Kingdom Chancellor',
      emoji: '👑',
      lines: [
        "Lists, Tuples, Sets, and Dictionaries. You have mastered them all.",
        "Now, you must manage the kingdom's resources by combining these structures into a powerful registry."
      ]
    },
    explain: {
      title: 'Combining Collections',
      description: [
        "Collections can hold other collections! You can have a List of Dictionaries, or a Dictionary of Lists.",
        "This is how real-world data is organized."
      ],
      code: "database = {\n    'heroes': ['PyQuest', 'Knight'],\n    'artifacts': {'sword', 'shield'}\n}\nprint(database['heroes'][0])",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created complex database dictionary.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'database', value: '{"heroes": ["PyQuest", "Knight"], "artifacts": ["sword", "shield"]}', type: 'dict' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'database', value: '{"heroes": ["PyQuest", "Knight"], "artifacts": ["sword", "shield"]}', type: 'dict' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed PyQuest",
          lineNumber: 5,
          output: "PyQuest",
          memorySnapshot: { '0x00': { address: '0x00', name: 'database', value: '{"heroes": ["PyQuest", "Knight"], "artifacts": ["sword", "shield"]}', type: 'dict' } }
        }
      ]
    },
    practice: {
      title: 'Inventory Manager',
      description: 'Create a dictionary `game` containing a key `"items"` which is a list containing `"key"`. Print the `game` dictionary.',
      initialCode: '# Create game dictionary\n\n\n',
      validation: (code) => {
        const hasGame = /game\s*=\s*\{\s*['"]items['"]\s*:\s*\[\s*['"]key['"]\s*\]\s*\}/.test(code);
        const hasPrint = /print\s*\(\s*game\s*\)/.test(code);
        if (!hasGame) return { isValid: false, error: 'Define `game = {"items": ["key"]}`.' };
        if (!hasPrint) return { isValid: false, error: 'Print the `game` variable.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created game dictionary.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'game', value: '{"items": ["key"]}', type: 'dict' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'game', value: '{"items": ["key"]}', type: 'dict' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed dictionary.",
          lineNumber: 5,
          output: "{'items': ['key']}",
          memorySnapshot: { '0x00': { address: '0x00', name: 'game', value: '{"items": ["key"]}', type: 'dict' } }
        }
      ]
    },
    challenge: {
      title: 'Vault Access',
      description: 'You need the final spell! Define `vault = {"spells": ["fire", "ice"]}`. Then print the second spell (`"ice"`).',
      initialCode: '',
      validation: (code) => {
        const hasVault = /vault\s*=\s*\{\s*['"]spells['"]\s*:\s*\[\s*['"]fire['"]\s*,\s*['"]ice['"]\s*\]\s*\}/.test(code);
        const hasPrint = /print\s*\(\s*vault\s*\[\s*['"]spells['"]\s*\]\s*\[\s*1\s*\]\s*\)/.test(code);
        if (!hasVault) return { isValid: false, error: 'Define the vault dictionary exactly as specified.' };
        if (!hasPrint) return { isValid: false, error: 'Print `vault["spells"][1]`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created vault.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'vault', value: '{"spells": ["fire", "ice"]}', type: 'dict' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'vault', value: '{"spells": ["fire", "ice"]}', type: 'dict' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed ice.",
          lineNumber: 2,
          output: "ice",
          memorySnapshot: { '0x00': { address: '0x00', name: 'vault', value: '{"spells": ["fire", "ice"]}', type: 'dict' } }
        }
      ]
    },
    rewardXP: 150
  }
};
