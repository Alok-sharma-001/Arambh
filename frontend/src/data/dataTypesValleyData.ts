import { LessonData } from './variablesForestData';

export const DATA_TYPES_VALLEY_LESSONS: Record<string, LessonData> = {
  '6': {
    id: '6',
    title: 'Integer Crystal',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "Welcome to Data Types Valley. Here, variables take on distinct forms.",
        "The most basic form is the Integer—a pure, whole number without any fractions. They can be positive, negative, or zero."
      ]
    },
    explain: {
      title: 'Integers',
      description: [
        "An integer (or 'int' in Python) represents whole numbers.",
        "You simply assign a whole number to a variable, and Python automatically knows it's an integer."
      ],
      code: "x = 10\ny = -5",
      steps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 10 to 'x'.",
          lineNumber: 1, 
          variable: { address: '0x00', name: 'x', value: '10', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '10', type: 'int' } }
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated integer -5 to 'y'.",
          lineNumber: 2, 
          variable: { address: '0x01', name: 'y', value: '-5', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'x', value: '10', type: 'int' }, '0x01': { address: '0x01', name: 'y', value: '-5', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'Crafting Integers',
      description: "Create a variable 'health' set to 100, and a variable 'penalty' set to -10 on separate lines.",
      initialCode: "",
      validation: (code) => {
        const lines = code.split('\n').map(l => l.replace(/\s+/g, '')).filter(l => l !== '');
        if (lines.includes('health=100') && lines.includes('penalty=-10')) return { isValid: true };
        return { isValid: false, error: "Ensure health is 100 and penalty is -10 on separate lines." };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 100 to 'health'.",
          lineNumber: 1, 
          variable: { address: '0x02', name: 'health', value: '100', type: 'int' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'health', value: '100', type: 'int' } }
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated integer -10 to 'penalty'.",
          lineNumber: 2, 
          variable: { address: '0x03', name: 'penalty', value: '-10', type: 'int' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'health', value: '100', type: 'int' }, '0x03': { address: '0x03', name: 'penalty', value: '-10', type: 'int' } }
        }
      ]
    },
    challenge: {
      title: 'Absolute Zero',
      description: "Create a variable 'temperature' and set it to 0.",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        if (cleaned === 'temperature=0') return { isValid: true };
        return { isValid: false, error: "Set temperature = 0" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 0 to 'temperature'.",
          lineNumber: 1, 
          variable: { address: '0x04', name: 'temperature', value: '0', type: 'int' },
          memorySnapshot: { '0x04': { address: '0x04', name: 'temperature', value: '0', type: 'int' } }
        }
      ]
    },
    rewardXP: 100
  },
  '7': {
    id: '7',
    title: 'String Temple',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "Words hold great power in the valley.",
        "Strings are sequences of characters. They allow us to store names, sentences, and spells."
      ]
    },
    explain: {
      title: 'Strings',
      description: [
        "A string must always be enclosed in quotes.",
        "You can use either single quotes ('...') or double quotes (\"...\")."
      ],
      code: "name = \"PyQuest\"\nspell = 'Fireball'",
      steps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated string 'PyQuest' to 'name'.",
          lineNumber: 1, 
          variable: { address: '0x05', name: 'name', value: '"PyQuest"', type: 'string' },
          memorySnapshot: { '0x05': { address: '0x05', name: 'name', value: '"PyQuest"', type: 'string' } }
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated string 'Fireball' to 'spell'.",
          lineNumber: 2, 
          variable: { address: '0x06', name: 'spell', value: "'Fireball'", type: 'string' },
          memorySnapshot: { '0x05': { address: '0x05', name: 'name', value: '"PyQuest"', type: 'string' }, '0x06': { address: '0x06', name: 'spell', value: "'Fireball'", type: 'string' } }
        }
      ]
    },
    practice: {
      title: 'Naming the Void',
      description: "Create a variable 'player' and assign it your favorite name as a string.",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        const matchDouble = cleaned.match(/player="([^"]+)"/);
        const matchSingle = cleaned.match(/player='([^']+)'/);
        const match = matchDouble || matchSingle;
        
        if (match) {
          return { isValid: true, parsedVars: { player: `"${match[1]}"` } };
        }
        return { isValid: false, error: "Make sure you assign a string to 'player' using quotes." };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated string to 'player'.",
          lineNumber: 1, 
          variable: { address: '0x07', name: 'player', value: '"Hero"', type: 'string' },
          memorySnapshot: { '0x07': { address: '0x07', name: 'player', value: '"Hero"', type: 'string' } }
        }
      ]
    },
    challenge: {
      title: 'The Magic Word',
      description: "Create a variable 'magic_word' and set it to 'abracadabra'.",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        if (cleaned === 'magic_word="abracadabra"' || cleaned === "magic_word='abracadabra'") return { isValid: true };
        return { isValid: false, error: "Set magic_word to 'abracadabra'" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated string 'abracadabra' to 'magic_word'.",
          lineNumber: 1, 
          variable: { address: '0x00', name: 'magic_word', value: '"abracadabra"', type: 'string' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'magic_word', value: '"abracadabra"', type: 'string' } }
        }
      ]
    },
    rewardXP: 100
  },
  '8': {
    id: '8',
    title: 'Boolean Shrine',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "In the realm of logic, everything boils down to two fundamental truths.",
        "Yes or No. On or Off. True or False. These are Booleans."
      ]
    },
    explain: {
      title: 'Booleans',
      description: [
        "A boolean (or 'bool') can only have one of two values: True or False.",
        "Notice that True and False must be capitalized in Python, without quotes."
      ],
      code: "is_alive = True\nis_poisoned = False",
      steps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated boolean True to 'is_alive'.",
          lineNumber: 1, 
          variable: { address: '0x01', name: 'is_alive', value: 'True', type: 'bool' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'is_alive', value: 'True', type: 'bool' } }
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated boolean False to 'is_poisoned'.",
          lineNumber: 2, 
          variable: { address: '0x02', name: 'is_poisoned', value: 'False', type: 'bool' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'is_alive', value: 'True', type: 'bool' }, '0x02': { address: '0x02', name: 'is_poisoned', value: 'False', type: 'bool' } }
        }
      ]
    },
    practice: {
      title: 'Status Effects',
      description: "Create a variable 'has_key' set to True, and 'is_cursed' set to False on separate lines.",
      initialCode: "",
      validation: (code) => {
        const lines = code.split('\n').map(l => l.replace(/\s+/g, '')).filter(l => l !== '');
        if (lines.includes('has_key=True') && lines.includes('is_cursed=False')) return { isValid: true };
        return { isValid: false, error: "Set has_key = True and is_cursed = False. Watch your capitalization!" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated boolean True to 'has_key'.",
          lineNumber: 1, 
          variable: { address: '0x03', name: 'has_key', value: 'True', type: 'bool' },
          memorySnapshot: { '0x03': { address: '0x03', name: 'has_key', value: 'True', type: 'bool' } }
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated boolean False to 'is_cursed'.",
          lineNumber: 2, 
          variable: { address: '0x04', name: 'is_cursed', value: 'False', type: 'bool' },
          memorySnapshot: { '0x03': { address: '0x03', name: 'has_key', value: 'True', type: 'bool' }, '0x04': { address: '0x04', name: 'is_cursed', value: 'False', type: 'bool' } }
        }
      ]
    },
    challenge: {
      title: 'The Final Decision',
      description: "Create a variable 'ready_for_boss' and set it to True.",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        if (cleaned === 'ready_for_boss=True') return { isValid: true };
        return { isValid: false, error: "Set ready_for_boss to True." };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated boolean True to 'ready_for_boss'.",
          lineNumber: 1, 
          variable: { address: '0x05', name: 'ready_for_boss', value: 'True', type: 'bool' },
          memorySnapshot: { '0x05': { address: '0x05', name: 'ready_for_boss', value: 'True', type: 'bool' } }
        }
      ]
    },
    rewardXP: 100
  },
  '9': {
    id: '9',
    title: 'Type Scanner',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "A true mage must be able to identify the nature of any magic they encounter.",
        "The type() function acts as a scanner, revealing the underlying data type of a value."
      ]
    },
    explain: {
      title: 'Inspecting Values',
      description: [
        "You can pass any value or variable into the type() function.",
        "It will return <class 'int'>, <class 'str'>, <class 'bool'>, or <class 'float'>."
      ],
      code: "x = type(10)\ny = type(\"hello\")",
      steps: [
        { 
          id: 1, type: 'EVALUATE', 
          description: "Evaluated type(10) -> <class 'int'>. Storing in 'x'.",
          lineNumber: 1, 
          evaluation: { leftVal: '10', rightVal: '', operator: 'type()', result: "<class 'int'>", targetVarName: 'x' },
          memorySnapshot: {}
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated string \"<class 'int'>\" to 'x'.",
          lineNumber: 1, 
          variable: { address: '0x06', name: 'x', value: "\"<class 'int'>\"", type: 'string' },
          memorySnapshot: { '0x06': { address: '0x06', name: 'x', value: "\"<class 'int'>\"", type: 'string' } }
        },
        { 
          id: 3, type: 'EVALUATE', 
          description: "Evaluated type(\"hello\") -> <class 'str'>. Storing in 'y'.",
          lineNumber: 2, 
          evaluation: { leftVal: '"hello"', rightVal: '', operator: 'type()', result: "<class 'str'>", targetVarName: 'y' },
          memorySnapshot: { '0x06': { address: '0x06', name: 'x', value: "\"<class 'int'>\"", type: 'string' } }
        },
        { 
          id: 4, type: 'ALLOCATE', 
          description: "Allocated string \"<class 'str'>\" to 'y'.",
          lineNumber: 2, 
          variable: { address: '0x07', name: 'y', value: "\"<class 'str'>\"", type: 'string' },
          memorySnapshot: { '0x06': { address: '0x06', name: 'x', value: "\"<class 'int'>\"", type: 'string' }, '0x07': { address: '0x07', name: 'y', value: "\"<class 'str'>\"", type: 'string' } }
        }
      ]
    },
    practice: {
      title: 'Scan the Core',
      description: "Create a variable 'result' and assign it the result of type(True).",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        if (cleaned === 'result=type(True)') return { isValid: true };
        return { isValid: false, error: "Set result = type(True)" };
      },
      successSteps: [
        { 
          id: 1, type: 'EVALUATE', 
          description: "Evaluated type(True) -> <class 'bool'>. Storing in 'result'.",
          lineNumber: 1, 
          evaluation: { leftVal: 'True', rightVal: '', operator: 'type()', result: "<class 'bool'>", targetVarName: 'result' },
          memorySnapshot: {}
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated string \"<class 'bool'>\" to 'result'.",
          lineNumber: 1, 
          variable: { address: '0x00', name: 'result', value: "\"<class 'bool'>\"", type: 'string' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'result', value: "\"<class 'bool'>\"", type: 'string' } }
        }
      ]
    },
    challenge: {
      title: 'Mysterious Floating Point',
      description: "Create a variable 'float_type' and assign it the result of type(3.14).",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        if (cleaned === 'float_type=type(3.14)') return { isValid: true };
        return { isValid: false, error: "Set float_type = type(3.14)" };
      },
      successSteps: [
        { 
          id: 1, type: 'EVALUATE', 
          description: "Evaluated type(3.14) -> <class 'float'>. Storing in 'float_type'.",
          lineNumber: 1, 
          evaluation: { leftVal: '3.14', rightVal: '', operator: 'type()', result: "<class 'float'>", targetVarName: 'float_type' },
          memorySnapshot: {}
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated string \"<class 'float'>\" to 'float_type'.",
          lineNumber: 1, 
          variable: { address: '0x01', name: 'float_type', value: "\"<class 'float'>\"", type: 'string' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'float_type', value: "\"<class 'float'>\"", type: 'string' } }
        }
      ]
    },
    rewardXP: 100
  },
  '10': {
    id: '10',
    title: 'Mixed Memory',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "Data types can be transformed, molded from one shape into another.",
        "Using functions like int(), str(), and float(), we can forcefully convert values!"
      ]
    },
    explain: {
      title: 'Type Conversion',
      description: [
        "Converting from one type to another is called 'casting'.",
        "int(\"5\") converts a string into a number. str(10) converts a number into a string."
      ],
      code: "a = int(\"5\")\nb = str(10)\nc = float(5)",
      steps: [
        { 
          id: 1, type: 'EVALUATE', 
          description: "Evaluated int(\"5\") -> 5. Storing in 'a'.",
          lineNumber: 1, 
          evaluation: { leftVal: '\"5\"', rightVal: '', operator: 'int()', result: '5', targetVarName: 'a' },
          memorySnapshot: {}
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated integer 5 to 'a'.",
          lineNumber: 1, 
          variable: { address: '0x02', name: 'a', value: '5', type: 'int' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'a', value: '5', type: 'int' } }
        },
        { 
          id: 3, type: 'EVALUATE', 
          description: "Evaluated str(10) -> \"10\". Storing in 'b'.",
          lineNumber: 2, 
          evaluation: { leftVal: '10', rightVal: '', operator: 'str()', result: '"10"', targetVarName: 'b' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'a', value: '5', type: 'int' } }
        },
        { 
          id: 4, type: 'ALLOCATE', 
          description: "Allocated string \"10\" to 'b'.",
          lineNumber: 2, 
          variable: { address: '0x03', name: 'b', value: '"10"', type: 'string' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'a', value: '5', type: 'int' }, '0x03': { address: '0x03', name: 'b', value: '"10"', type: 'string' } }
        },
        { 
          id: 5, type: 'EVALUATE', 
          description: "Evaluated float(5) -> 5.0. Storing in 'c'.",
          lineNumber: 3, 
          evaluation: { leftVal: '5', rightVal: '', operator: 'float()', result: '5.0', targetVarName: 'c' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'a', value: '5', type: 'int' }, '0x03': { address: '0x03', name: 'b', value: '"10"', type: 'string' } }
        },
        { 
          id: 6, type: 'ALLOCATE', 
          description: "Allocated float 5.0 to 'c'.",
          lineNumber: 3, 
          variable: { address: '0x04', name: 'c', value: '5.0', type: 'float' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'a', value: '5', type: 'int' }, '0x03': { address: '0x03', name: 'b', value: '"10"', type: 'string' }, '0x04': { address: '0x04', name: 'c', value: '5.0', type: 'float' } }
        }
      ]
    },
    practice: {
      title: 'Transmutation',
      description: "Create a variable 'level_str' and assign it the result of str(99).",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        if (cleaned === 'level_str=str(99)') return { isValid: true };
        return { isValid: false, error: "Set level_str = str(99)" };
      },
      successSteps: [
        { 
          id: 1, type: 'EVALUATE', 
          description: "Evaluated str(99) -> \"99\". Storing in 'level_str'.",
          lineNumber: 1, 
          evaluation: { leftVal: '99', rightVal: '', operator: 'str()', result: '"99"', targetVarName: 'level_str' },
          memorySnapshot: {}
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated string \"99\" to 'level_str'.",
          lineNumber: 1, 
          variable: { address: '0x05', name: 'level_str', value: '"99"', type: 'string' },
          memorySnapshot: { '0x05': { address: '0x05', name: 'level_str', value: '"99"', type: 'string' } }
        }
      ]
    },
    challenge: {
      title: 'The Liquid Crystal',
      description: "Create a variable 'magic_power' and set it to float(50).",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\s+/g, '');
        if (cleaned === 'magic_power=float(50)') return { isValid: true };
        return { isValid: false, error: "Set magic_power = float(50)" };
      },
      successSteps: [
        { 
          id: 1, type: 'EVALUATE', 
          description: "Evaluated float(50) -> 50.0. Storing in 'magic_power'.",
          lineNumber: 1, 
          evaluation: { leftVal: '50', rightVal: '', operator: 'float()', result: '50.0', targetVarName: 'magic_power' },
          memorySnapshot: {}
        },
        { 
          id: 2, type: 'ALLOCATE', 
          description: "Allocated float 50.0 to 'magic_power'.",
          lineNumber: 1, 
          variable: { address: '0x06', name: 'magic_power', value: '50.0', type: 'float' },
          memorySnapshot: { '0x06': { address: '0x06', name: 'magic_power', value: '50.0', type: 'float' } }
        }
      ]
    },
    rewardXP: 150
  }
};
