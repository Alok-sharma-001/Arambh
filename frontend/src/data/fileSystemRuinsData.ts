import { LessonData } from './variablesForestData';

export const fileSystemRuinsData: Record<string, LessonData> = {
  '36': {
    id: '36',
    title: 'The Lost Archive',
    story: {
      speaker: 'Chief Scribe',
      emoji: '📜',
      lines: [
        "You discover a sealed stone cylinder containing an ancient scroll.",
        "To read it, you must first 'open' the seal. But beware! You must 'close' it when you are done to prevent the magic from fading."
      ]
    },
    explain: {
      title: 'Opening and Closing Files',
      description: [
        "Use `open(filename, mode)` to access a file.",
        "Mode `'r'` means 'read-only'.",
        "Always use `.close()` when finished to free up system resources."
      ],
      code: "f = open('secret.txt', 'r')\n# Do something\nf.close()",
      steps: [
        {
          id: 1,
          type: 'FILE_OPEN',
          description: "Opened secret.txt in read mode.",
          lineNumber: 1,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<TextIOWrapper name="secret.txt" mode="r">', type: 'object' } },
          fileSystemSnapshot: { 'secret.txt': 'Hidden treasure locations...' }
        },
        {
          id: 2,
          type: 'FILE_CLOSE',
          description: "Closed secret.txt.",
          lineNumber: 3,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<closed file "secret.txt">', type: 'object' } },
          fileSystemSnapshot: { 'secret.txt': 'Hidden treasure locations...' }
        }
      ]
    },
    practice: {
      title: 'Break the Seal',
      description: 'Open a file named `secret.txt` in read mode (`\'r\'`), assign it to `f`, and close it.',
      initialCode: '# Open secret.txt\n\n# Close it\n',
      validation: (code) => {
        const hasOpen = /f\s*=\s*open\(\s*['"]secret\.txt['"]\s*,\s*['"]r['"]\s*\)/.test(code);
        const hasClose = /f\.close\(\)/.test(code);
        if (!hasOpen) return { isValid: false, error: 'You must `f = open("secret.txt", "r")`.' };
        if (!hasClose) return { isValid: false, error: 'You must call `f.close()`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_OPEN',
          description: "Opened secret.txt.",
          lineNumber: 1,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<TextIOWrapper name="secret.txt" mode="r">', type: 'object' } },
          fileSystemSnapshot: { 'secret.txt': 'The password is: dragon' }
        },
        {
          id: 2,
          type: 'FILE_CLOSE',
          description: "Closed secret.txt.",
          lineNumber: 3,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<closed file "secret.txt">', type: 'object' } },
          fileSystemSnapshot: { 'secret.txt': 'The password is: dragon' }
        }
      ]
    },
    challenge: {
      title: 'The Cartographer',
      description: 'Given `filename = "map.txt"`, open the file in read mode and assign it to `f`. Then close it on the next line.',
      initialCode: 'filename = "map.txt"\n# Open f\n\n# Close f\n',
      validation: (code) => {
        const hasOpen = /f\s*=\s*open\(\s*filename\s*,\s*['"]r['"]\s*\)/.test(code);
        const hasClose = /f\.close\(\)/.test(code);
        if (!hasOpen) return { isValid: false, error: 'You must `f = open(filename, "r")`.' };
        if (!hasClose) return { isValid: false, error: 'You must call `f.close()`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_OPEN',
          description: "Opened map.txt.",
          lineNumber: 2,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<TextIOWrapper name="map.txt" mode="r">', type: 'object' } },
          fileSystemSnapshot: { 'map.txt': 'Go North, then East.' }
        },
        {
          id: 2,
          type: 'FILE_CLOSE',
          description: "Closed map.txt.",
          lineNumber: 4,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<closed file "map.txt">', type: 'object' } },
          fileSystemSnapshot: { 'map.txt': 'Go North, then East.' }
        }
      ]
    },
    rewardXP: 150
  },
  '37': {
    id: '37',
    title: 'Whispers of the Scrolls',
    story: {
      speaker: 'Lorekeeper',
      emoji: '📖',
      lines: [
        "A scroll is unsealed, but its contents remain invisible.",
        "You must cast a reading spell to extract the knowledge from the parchment into your active memory."
      ]
    },
    explain: {
      title: 'Reading Files',
      description: [
        "`file.read()` extracts all the text as one giant string.",
        "`file.readlines()` extracts the text as a list of strings, one for each line."
      ],
      code: "f = open('spell.txt', 'r')\nmagic = f.read()\nf.close()",
      steps: [
        {
          id: 1,
          type: 'FILE_OPEN',
          description: "Opened spell.txt.",
          lineNumber: 1,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<file>', type: 'object' } },
          fileSystemSnapshot: { 'spell.txt': 'Ignis Aurum!' }
        },
        {
          id: 2,
          type: 'FILE_READ',
          description: "Read contents into magic.",
          lineNumber: 2,
          variable: { address: '0x01', name: 'magic', value: '"Ignis Aurum!"', type: 'string' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'f', value: '<file>', type: 'object' },
            '0x01': { address: '0x01', name: 'magic', value: '"Ignis Aurum!"', type: 'string' }
          },
          fileSystemSnapshot: { 'spell.txt': 'Ignis Aurum!' }
        },
        {
          id: 3,
          type: 'FILE_CLOSE',
          description: "Closed file.",
          lineNumber: 3,
          memorySnapshot: { '0x00': { address: '0x00', name: 'f', value: '<closed>', type: 'object' }, '0x01': { address: '0x01', name: 'magic', value: '"Ignis Aurum!"', type: 'string' } },
          fileSystemSnapshot: { 'spell.txt': 'Ignis Aurum!' }
        }
      ]
    },
    practice: {
      title: 'Extract the Spell',
      description: 'Open `spell.txt` in read mode. Use `.read()` to store its contents in a variable named `magic`. Then close the file.',
      initialCode: '# Open spell.txt\n\n# Read it into magic\n\n# Close it\n',
      validation: (code) => {
        const hasOpen = /f\s*=\s*open\(\s*['"]spell\.txt['"]\s*,\s*['"]r['"]\s*\)/.test(code);
        const hasRead = /magic\s*=\s*f\.read\(\)/.test(code);
        const hasClose = /f\.close\(\)/.test(code);
        if (!hasOpen) return { isValid: false, error: 'Open the file as `f`.' };
        if (!hasRead) return { isValid: false, error: 'Use `magic = f.read()`.' };
        if (!hasClose) return { isValid: false, error: 'Call `f.close()`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_READ',
          description: "Stored scroll contents into memory.",
          lineNumber: 3,
          variable: { address: '0x01', name: 'magic', value: '"Abra Kadabra"', type: 'string' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'magic', value: '"Abra Kadabra"', type: 'string' } },
          fileSystemSnapshot: { 'spell.txt': 'Abra Kadabra' }
        }
      ]
    },
    challenge: {
      title: 'Line by Line',
      description: 'Open `ingredients.txt`. Use `.readlines()` to store lines in `lines_list`. Print `lines_list[0]` and close the file.',
      initialCode: 'f = open("ingredients.txt", "r")\n# Readlines and store\n\n# Print index 0\n\nf.close()',
      validation: (code) => {
        const hasReadlines = /lines_list\s*=\s*f\.readlines\(\)/.test(code);
        const hasPrint = /print\s*\(\s*lines_list\s*\[\s*0\s*\]\s*\)/.test(code);
        if (!hasReadlines) return { isValid: false, error: 'Use `lines_list = f.readlines()`.' };
        if (!hasPrint) return { isValid: false, error: 'Print `lines_list[0]`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Printed first line.",
          lineNumber: 4,
          output: "Eye of Newt",
          memorySnapshot: {},
          fileSystemSnapshot: { 'ingredients.txt': 'Eye of Newt\nDragon Scale\nFrog Toe' }
        }
      ]
    },
    rewardXP: 200
  },
  '38': {
    id: '38',
    title: "The Scribe's Chamber",
    story: {
      speaker: 'Ghostly Scribe',
      emoji: '✍️',
      lines: [
        "The archives are incomplete. You must engrave your own heroic deeds onto a blank scroll.",
        "Be careful—using the wrong magic might overwrite existing history instead of adding to it."
      ]
    },
    explain: {
      title: 'Writing and Appending',
      description: [
        "Mode `'w'` (Write) creates a new file, or completely erases an existing one.",
        "Mode `'a'` (Append) adds new text to the end of an existing file.",
        "Use `.write('text')` to engrave the text."
      ],
      code: "f = open('diary.txt', 'w')\nf.write('Day 1: Survived.')\nf.close()",
      steps: [
        {
          id: 1,
          type: 'FILE_WRITE',
          description: "Wrote to diary.txt.",
          lineNumber: 2,
          memorySnapshot: {},
          fileSystemSnapshot: { 'diary.txt': 'Day 1: Survived.' }
        }
      ]
    },
    practice: {
      title: 'Write History',
      description: 'Open `diary.txt` in write mode (`\'w\'`). Write `"Day 1: I survived"` into it, and close it.',
      initialCode: '# Open in w mode\n\n# Write text\n\n# Close\n',
      validation: (code) => {
        const hasOpen = /open\(\s*['"]diary\.txt['"]\s*,\s*['"]w['"]\s*\)/.test(code);
        const hasWrite = /\.write\(\s*['"]Day 1: I survived['"]\s*\)/.test(code);
        const hasClose = /\.close\(\)/.test(code);
        if (!hasOpen) return { isValid: false, error: 'Open diary.txt in w mode.' };
        if (!hasWrite) return { isValid: false, error: 'Write the exact text.' };
        if (!hasClose) return { isValid: false, error: 'Close the file.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_WRITE',
          description: "File diary.txt created and written.",
          lineNumber: 3,
          memorySnapshot: {},
          fileSystemSnapshot: { 'diary.txt': 'Day 1: I survived' }
        }
      ]
    },
    challenge: {
      title: 'Append the Log',
      description: 'Open `log.txt` in append mode (`\'a\'`). Write `"New entry"` into it, and close it.',
      initialCode: '# Open log.txt in append mode\n\n# Write "New entry"\n\n# Close\n',
      validation: (code) => {
        const hasOpen = /open\(\s*['"]log\.txt['"]\s*,\s*['"]a['"]\s*\)/.test(code);
        const hasWrite = /\.write\(\s*['"]New entry['"]\s*\)/.test(code);
        if (!hasOpen) return { isValid: false, error: 'Open log.txt in a mode.' };
        if (!hasWrite) return { isValid: false, error: 'Write "New entry".' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_WRITE',
          description: "Appended to log.txt.",
          lineNumber: 3,
          memorySnapshot: {},
          fileSystemSnapshot: { 'log.txt': 'Old entry\nNew entry' }
        }
      ]
    },
    rewardXP: 250
  },
  '39': {
    id: '39',
    title: 'The Eternal Contract',
    story: {
      speaker: 'High Archivist',
      emoji: '📜',
      lines: [
        "Many apprentices forget to seal their scrolls, causing magical leaks.",
        "The Eternal Contract—a `with` spell—automatically seals the scroll the moment you step away."
      ]
    },
    explain: {
      title: 'The With Statement',
      description: [
        "`with open('file.txt', 'r') as f:` creates a context.",
        "When the indented block ends, the file is automatically closed for you safely."
      ],
      code: "with open('hero.txt', 'w') as f:\n    f.write('Arthur')\n# File is automatically closed here",
      steps: [
        {
          id: 1,
          type: 'FILE_OPEN',
          description: "Context manager opened hero.txt.",
          lineNumber: 1,
          memorySnapshot: {},
          fileSystemSnapshot: {}
        },
        {
          id: 2,
          type: 'FILE_WRITE',
          description: "Wrote Arthur.",
          lineNumber: 2,
          memorySnapshot: {},
          fileSystemSnapshot: { 'hero.txt': 'Arthur' }
        },
        {
          id: 3,
          type: 'FILE_CLOSE',
          description: "Context block ended. File auto-closed.",
          lineNumber: 3,
          memorySnapshot: {},
          fileSystemSnapshot: { 'hero.txt': 'Arthur' }
        }
      ]
    },
    practice: {
      title: 'Context Manager',
      description: 'Rewrite standard file opening. Use a `with` statement to open `data.txt` in read mode (`\'r\'`) as `f`. Read its contents into `content`.',
      initialCode: '# Rewrite using with\nwith open("data.txt", "r") as f:\n    ',
      validation: (code) => {
        const hasWith = /with\s+open\(\s*['"]data\.txt['"]\s*,\s*['"]r['"]\s*\)\s+as\s+f\s*:/.test(code);
        const hasRead = /content\s*=\s*f\.read\(\)/.test(code);
        if (!hasWith || !hasRead) return { isValid: false, error: 'Use `with open("data.txt", "r") as f:` and indented `content = f.read()`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_READ',
          description: "Auto-read and stored in memory.",
          lineNumber: 3,
          variable: { address: '0x01', name: 'content', value: '"Secret Data"', type: 'string' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'content', value: '"Secret Data"', type: 'string' } },
          fileSystemSnapshot: { 'data.txt': 'Secret Data' }
        }
      ]
    },
    challenge: {
      title: 'Sign Your Name',
      description: 'Use a `with` statement to open `hero.txt` in write mode (`\'w\'`) as `f` and `.write("Arthur")` into it.',
      initialCode: '# Write "Arthur" into hero.txt safely\n',
      validation: (code) => {
        const hasWith = /with\s+open\(\s*['"]hero\.txt['"]\s*,\s*['"]w['"]\s*\)\s+as\s+f\s*:/.test(code);
        const hasWrite = /f\.write\(\s*['"]Arthur['"]\s*\)/.test(code);
        if (!hasWith) return { isValid: false, error: 'Use `with open("hero.txt", "w") as f:`' };
        if (!hasWrite) return { isValid: false, error: 'Use `f.write("Arthur")` inside the block.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'FILE_WRITE',
          description: "Wrote Arthur and auto-closed.",
          lineNumber: 2,
          memorySnapshot: {},
          fileSystemSnapshot: { 'hero.txt': 'Arthur' }
        }
      ]
    },
    rewardXP: 250
  },
  '40': {
    id: '40',
    title: 'The Memory Vault',
    story: {
      speaker: 'The Architect',
      emoji: '🔮',
      lines: [
        "Simple scrolls cannot hold complex magical structures like dictionaries.",
        "For advanced artifacts, you must crystallize the data into JSON structures."
      ]
    },
    explain: {
      title: 'JSON Data',
      description: [
        "`import json` allows you to handle structured data.",
        "`json.dumps(data)` converts a Python dictionary/list into a JSON string.",
        "`json.loads(string)` converts a JSON string back into Python data."
      ],
      code: "import json\nplayer = {'hp': 100}\nsave_data = json.dumps(player)",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created JSON string.",
          lineNumber: 3,
          variable: { address: '0x02', name: 'save_data', value: '\'{"hp": 100}\'', type: 'string' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'save_data', value: '\'{"hp": 100}\'', type: 'string' } },
          fileSystemSnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Crystallize Data',
      description: 'Given `player = {"hp": 100}`, `import json` and use `json.dumps(player)` to create a string named `save_data`.',
      initialCode: 'import json\nplayer = {"hp": 100}\n# Create save_data using dumps\n',
      validation: (code) => {
        const hasDumps = /save_data\s*=\s*json\.dumps\(\s*player\s*\)/.test(code);
        if (!hasDumps) return { isValid: false, error: 'Use `save_data = json.dumps(player)`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Converted dictionary to JSON string.",
          lineNumber: 4,
          variable: { address: '0x01', name: 'save_data', value: '\'{"hp": 100}\'', type: 'string' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'save_data', value: '\'{"hp": 100}\'', type: 'string' } },
          fileSystemSnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Restore the Relic',
      description: 'Given a string `json_str = \'{"gold": 50}\'`, use `json.loads(json_str)` to convert it to a dictionary `loot`, then print `loot["gold"]`.',
      initialCode: 'import json\njson_str = \'{"gold": 50}\'\n# loads to loot\n\n# print gold\n',
      validation: (code) => {
        const hasLoads = /loot\s*=\s*json\.loads\(\s*json_str\s*\)/.test(code);
        const hasPrint = /print\(\s*loot\s*\[\s*['"]gold['"]\s*\]\s*\)/.test(code);
        if (!hasLoads) return { isValid: false, error: 'Use `loot = json.loads(json_str)`.' };
        if (!hasPrint) return { isValid: false, error: 'Print `loot["gold"]`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Parsed JSON to dictionary.",
          lineNumber: 4,
          variable: { address: '0x01', name: 'loot', value: '{"gold": 50}', type: 'dict' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'loot', value: '{"gold": 50}', type: 'dict' } },
          fileSystemSnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed 50.",
          lineNumber: 6,
          output: "50",
          memorySnapshot: {},
          fileSystemSnapshot: {}
        }
      ]
    },
    rewardXP: 300
  }
};
