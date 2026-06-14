import {
  BookOpen,
  Code2,
  Database,
  GitBranch,
  ListTree,
  RotateCw,
  Sigma,
  Terminal,
  Type,
  Keyboard,
  RefreshCw,
  Repeat,
  Layers,
  ShieldAlert,
  FileText,
  Hash,
} from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface InteractiveCode {
  setup: string;
  code: string;
  expectedOutput: string;
}

export interface MemorySlot {
  name: string;
  value: string;
  type: string;
  note: string;
  accent: string;
}

export interface LibraryTopic {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  completion: number; // 0 - 100
  
  // Content
  overview: string;
  whyExists: string;
  realLifeAnalogy: {
    title: string;
    description: string;
  };
  
  // Technical
  syntax: string;
  example: string;
  bestPractices: string[];
  mistakes: string[];
  
  // Interactive
  memoryModel: MemorySlot[];
  interactiveCode: InteractiveCode;
  quiz: QuizQuestion[];
  
  // Navigation
  relatedConcepts: string[]; // topic IDs
  learnPath: string;
  trainingPath: string;
  icon: any; // Lucide Icon component
}

export const topics: LibraryTopic[] = [
  {
    id: 'variables',
    title: 'Variables',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '5 min read',
    completion: 0,
    
    overview: 'A variable is a readable name that points to a specific value Python has stored in memory. Think of it as a label attached to data so you can easily find and reuse it later.',
    whyExists: 'Without variables, we would have to type the raw data (like a player\'s exact score or name) every single time we needed it. Variables allow us to write flexible code that works no matter how the data changes during the game.',
    
    realLifeAnalogy: {
      title: 'Moving Boxes',
      description: 'Imagine moving to a new house. You pack your books into a box and write "Books" on the outside. You don\'t need to look inside every box to find your books; you just look for the label. In Python, the variable name is the label, and the value is what\'s inside the box.',
    },
    
    syntax: 'name = value',
    example: 'player_name = "Ava"\nlevel = 1\nprint(player_name)\nprint(level)',
    
    bestPractices: [
      'Use descriptive names like player_health instead of ph.',
      'Use lowercase letters with underscores (snake_case).',
      'Make sure the name reflects what the data actually means.',
    ],
    
    mistakes: [
      'Writing the value on the left side, like 10 = score.',
      'Using spaces in a variable name, like player name.',
      'Forgetting that variables are case-sensitive (Score is different from score).',
    ],
    
    memoryModel: [
      { name: 'player_name', value: '"Ava"', type: 'str', note: 'Created on assignment', accent: '#34d399' },
      { name: 'level', value: '1', type: 'int', note: 'Can be updated later', accent: '#60a5fa' },
    ],
    
    interactiveCode: {
      setup: '',
      code: 'coins = 50\nbonus = 20\ntotal = coins + bonus\nprint("Total coins:", total)',
      expectedOutput: 'Total coins: 70',
    },
    
    quiz: [
      {
        id: 'var_q1',
        question: 'Which of the following is the correct way to assign a variable in Python?',
        options: [
          '10 = score',
          'score = 10',
          'variable score is 10',
          'score == 10'
        ],
        correctIndex: 1,
        explanation: 'In Python, the variable name must be on the left side, followed by a single equals sign, and then the value on the right.'
      },
      {
        id: 'var_q2',
        question: 'What happens when you assign a new value to an existing variable name?',
        options: [
          'Python throws an error.',
          'The old value is kept alongside the new one.',
          'The variable label moves to point to the new value.',
          'The program crashes.'
        ],
        correctIndex: 2,
        explanation: 'Variables can change! Assigning a new value simply points the label to the new data, forgetting the old one.'
      }
    ],
    
    relatedConcepts: ['data-types', 'operators'],
    learnPath: '/lesson/variables-forest/v1',
    trainingPath: '/training/variables-forest',
    icon: Database,
  },
  {
    id: 'data-types',
    title: 'Data Types',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '6 min read',
    completion: 0,
    overview: 'Data types define the kind of value Python is working with. Knowing the type helps Python understand what operations make sense.',
    whyExists: 'Adding two numbers makes sense (5 + 5 = 10). Adding two words joins them ("fire" + "ball" = "fireball"). Python needs to know the type to execute operations correctly.',
    realLifeAnalogy: {
      title: 'Different Containers',
      description: 'You wouldn\'t put soup in an envelope or mail a letter in a bowl. Different things require different containers. Similarly, Python uses specific structures (types) for text, whole numbers, and true/false logic.',
    },
    syntax: 'type(value)',
    example: 'name = "Ava"\nage = 12\nis_ready = True',
    bestPractices: [
      'Be mindful of what type a function returns.',
      'Convert types explicitly when needed, using str(), int(), or float().',
    ],
    mistakes: [
      'Forgetting quotes around strings.',
      'Confusing "12" (text) with 12 (number).',
      'Writing true instead of True.',
    ],
    memoryModel: [
      { name: 'name', value: '"Ava"', type: 'str', note: 'String type', accent: '#34d399' },
      { name: 'age', value: '12', type: 'int', note: 'Integer type', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'level = "10"\nprint(type(level))',
      expectedOutput: "<class 'str'>",
    },
    quiz: [
      {
        id: 'dt_q1',
        question: 'What data type is the value "15"?',
        options: ['Integer', 'String', 'Boolean', 'Float'],
        correctIndex: 1,
        explanation: 'Because it is wrapped in quotes, it is treated as text (a String), even though it looks like a number.'
      }
    ],
    relatedConcepts: ['variables', 'lists'],
    learnPath: '/lesson/datatypes-valley/d1',
    trainingPath: '/training/datatypes-valley',
    icon: Code2,
  },
  {
    id: 'operators',
    title: 'Operators',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '4 min read',
    completion: 0,
    overview: 'Symbols that calculate, compare, or combine values to produce new results.',
    whyExists: 'Games need math and logic! We need operators to add score, subtract health, or check if a player has enough gold to buy an item.',
    realLifeAnalogy: {
      title: 'A Calculator',
      description: 'Just like a calculator uses +, -, *, and / to process numbers, Python uses operators to process data and evaluate expressions.',
    },
    syntax: 'left_value operator right_value',
    example: 'health = 100\ndamage = 20\nhealth = health - damage',
    bestPractices: [
      'Use parentheses to clarify complex math (e.g., (a + b) * c).',
      'Remember that = is for assignment, and == is for checking equality.',
    ],
    mistakes: [
      'Mixing up = and ==.',
      'Trying to add a number and a string directly (like "Level " + 5).',
    ],
    memoryModel: [
      { name: 'health', value: '80', type: 'int', note: 'Updated after damage', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'gold = 50\ncost = 35\ncan_buy = gold >= cost\nprint("Can buy item?", can_buy)',
      expectedOutput: "Can buy item? True",
    },
    quiz: [
      {
        id: 'op_q1',
        question: 'What is the result of 10 % 3?',
        options: ['3', '3.33', '1', '0'],
        correctIndex: 2,
        explanation: 'The modulo operator (%) returns the remainder of division. 10 divided by 3 is 9, with a remainder of 1.'
      }
    ],
    relatedConcepts: ['variables', 'conditionals'],
    learnPath: '/lesson/variables-forest/v1',
    trainingPath: '/training/variables-forest',
    icon: Sigma,
  },
  {
    id: 'conditionals',
    title: 'Conditionals',
    category: 'Control Flow',
    difficulty: 'Intermediate',
    estimatedTime: '7 min read',
    completion: 0,
    overview: 'Conditionals allow your code to make decisions, executing different blocks of code based on whether a condition is true or false.',
    whyExists: 'Games need logic branches. A door only opens IF you have the key. Without conditionals, a program would just do the exact same thing every time.',
    realLifeAnalogy: {
      title: 'A Fork in the Road',
      description: 'Imagine reaching a crossroad with a sign: "IF you have a sword, go left. ELSE, go right." Conditionals are how Python chooses which path to take.',
    },
    syntax: 'if condition:\n    # code\nelif another_condition:\n    # code\nelse:\n    # code',
    example: 'if level >= 10:\n    print("Boss unlocked!")\nelse:\n    print("Keep grinding.")',
    bestPractices: [
      'Keep conditions simple and readable.',
      'Always use proper indentation (4 spaces).',
    ],
    mistakes: [
      'Forgetting the colon at the end of the if statement.',
      'Incorrect indentation inside the block.',
      'Using = instead of == for comparison.',
    ],
    memoryModel: [
      { name: 'level', value: '10', type: 'int', note: 'Checked in condition', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'has_key = False\nif has_key:\n    print("Door opened!")\nelse:\n    print("Locked. Find the key.")',
      expectedOutput: "Locked. Find the key.",
    },
    quiz: [
      {
        id: 'cond_q1',
        question: 'Which keyword is used to check an additional condition if the first one fails?',
        options: ['else if', 'elseif', 'elif', 'then'],
        correctIndex: 2,
        explanation: 'Python uses "elif", which is short for "else if".'
      }
    ],
    relatedConcepts: ['operators', 'loops'],
    learnPath: '/lesson/loops-desert/l1',
    trainingPath: '/training/loops-desert',
    icon: GitBranch,
  },
  {
    id: 'loops',
    title: 'Loops',
    category: 'Control Flow',
    difficulty: 'Intermediate',
    estimatedTime: '8 min read',
    completion: 0,
    overview: 'Loops allow you to execute a block of code multiple times automatically, avoiding repetitive manual coding.',
    whyExists: 'If you want to spawn 100 enemies, writing "spawn_enemy()" 100 times is inefficient. Loops automate repetitive tasks.',
    realLifeAnalogy: {
      title: 'A Laps Counter',
      description: 'Running around a track: "For every lap from 1 to 5, drink water." You don\'t need a separate instruction for each lap, just one instruction that repeats.',
    },
    syntax: 'for item in collection:\n    # code',
    example: 'for i in range(3):\n    print(i)',
    bestPractices: [
      'Use "for" loops when you know how many times to repeat.',
      'Use "while" loops when repeating until a condition changes.',
      'Avoid infinite loops in while statements.',
    ],
    mistakes: [
      'Forgetting that range(3) yields 0, 1, 2 (it stops BEFORE the given number).',
      'Modifying a list while looping over it.',
    ],
    memoryModel: [
      { name: 'i', value: '2', type: 'int', note: 'Loop iterator (final pass)', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'for count in range(1, 4):\n    print("Countdown:", count)',
      expectedOutput: "Countdown: 1\nCountdown: 2\nCountdown: 3",
    },
    quiz: [
      {
        id: 'loop_q1',
        question: 'What numbers will range(2) generate?',
        options: ['1, 2', '0, 1', '0, 1, 2', '2, 2'],
        correctIndex: 1,
        explanation: 'range(n) generates numbers starting from 0 up to n-1.'
      }
    ],
    relatedConcepts: ['lists', 'functions'],
    learnPath: '/lesson/loops-desert/l1',
    trainingPath: '/training/loops-desert',
    icon: RotateCw,
  },
  {
    id: 'functions',
    title: 'Functions',
    category: 'Structure',
    difficulty: 'Advanced',
    estimatedTime: '10 min read',
    completion: 0,
    overview: 'Reusable blocks of code with a name, which can take inputs (parameters) and give back outputs (return values).',
    whyExists: 'To avoid writing the same logic multiple times. If you have a complex attack calculation, you write it once as a function, then call it whenever needed.',
    realLifeAnalogy: {
      title: 'A Vending Machine',
      description: 'You give it input (money, button press), it does some internal work, and it returns an output (a snack). You don\'t need to know how the machine works inside to use it.',
    },
    syntax: 'def my_function(param1):\n    return result',
    example: 'def double_score(score):\n    return score * 2\n\nnew_score = double_score(10)',
    bestPractices: [
      'Functions should do exactly one thing well.',
      'Return values instead of printing them, so other code can use the result.',
      'Use clear, verb-based names like "calculate_damage".',
    ],
    mistakes: [
      'Forgetting the "return" statement, which causes the function to return None.',
      'Using variables defined inside a function outside of it (Scope error).',
      'Forgetting parentheses when calling the function.',
    ],
    memoryModel: [
      { name: 'score', value: '10', type: 'int', note: 'Passed parameter', accent: '#60a5fa' },
      { name: 'new_score', value: '20', type: 'int', note: 'Returned value', accent: '#c8a45e' },
    ],
    interactiveCode: {
      setup: '',
      code: 'def greet(name):\n    return "Welcome, " + name\n\nprint(greet("Hero"))',
      expectedOutput: "Welcome, Hero",
    },
    quiz: [
      {
        id: 'func_q1',
        question: 'What is the purpose of the "return" keyword?',
        options: [
          'To stop the program immediately.',
          'To print output to the console.',
          'To send a value back to where the function was called.',
          'To go back to the top of the loop.'
        ],
        correctIndex: 2,
        explanation: 'The return keyword ends function execution and passes the result back to the caller.'
      }
    ],
    relatedConcepts: ['variables', 'dictionaries'],
    learnPath: '/lesson/functions-mountain/f1',
    trainingPath: '/training/functions-mountain',
    icon: Terminal,
  },
  {
    id: 'lists',
    title: 'Lists',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    estimatedTime: '8 min read',
    completion: 0,
    overview: 'Ordered collections that can hold many values. They are mutable, meaning you can add, remove, and change items after creating the list.',
    whyExists: 'When you need to store a player\'s inventory of 20 items, you don\'t want to create 20 separate variables. A list lets you group them under one name.',
    realLifeAnalogy: {
      title: 'A Train of Cars',
      description: 'A list is like a train where each car holds something. The cars are numbered starting from 0. You can add cars to the end, or look inside a specific car using its number.',
    },
    syntax: 'my_list = [item1, item2, item3]',
    example: 'inventory = ["sword", "shield", "potion"]\ninventory.append("key")\nprint(inventory[0])',
    bestPractices: [
      'Usually keep items of the same type in a single list.',
      'Use plural names for list variables (e.g., enemies, scores).',
    ],
    mistakes: [
      'Using index 1 to get the first item (Python uses index 0).',
      'Trying to access an index that is out of bounds (causes an IndexError).',
    ],
    memoryModel: [
      { name: 'inventory', value: '["sword", "shield", "key"]', type: 'list', note: 'Mutable collection', accent: '#c8a45e' },
    ],
    interactiveCode: {
      setup: '',
      code: 'spells = ["Fire", "Ice"]\nspells.append("Heal")\nprint(spells[1])',
      expectedOutput: "Ice",
    },
    quiz: [
      {
        id: 'list_q1',
        question: 'How do you add a new item to the end of a list?',
        options: ['list.add(item)', 'list.push(item)', 'list.append(item)', 'list.insert(item)'],
        correctIndex: 2,
        explanation: '.append(item) adds an item to the end of the list.'
      }
    ],
    relatedConcepts: ['loops', 'dictionaries'],
    learnPath: '/lesson/collections-kingdom/c1',
    trainingPath: '/training/collections-kingdom',
    icon: ListTree,
  },
  {
    id: 'dictionaries',
    title: 'Dictionaries',
    category: 'Data Structures',
    difficulty: 'Advanced',
    estimatedTime: '9 min read',
    completion: 0,
    overview: 'Key-value collections for named pieces of data. Unlike lists which use numerical indexes, dictionaries use descriptive keys to find values.',
    whyExists: 'To represent structured data. For a player, you want to store health, max_health, strength, and name. Dictionaries map these property names directly to their values.',
    realLifeAnalogy: {
      title: 'A Phonebook',
      description: 'In a phonebook, you look up a person\'s name (the Key) to find their phone number (the Value). You don\'t look them up by their order number.',
    },
    syntax: 'my_dict = {"key": value, "key2": value2}',
    example: 'player = {"name": "Ava", "hp": 100}\nprint(player["name"])\nplayer["hp"] = 90',
    bestPractices: [
      'Use descriptive strings for keys.',
      'Use the .get() method if you are not sure a key exists to avoid KeyErrors.',
    ],
    mistakes: [
      'Forgetting quotes around string keys.',
      'Using a key that does not exist directly with brackets, causing a crash.',
    ],
    memoryModel: [
      { name: 'player', value: '{"name": "Ava", "hp": 90}', type: 'dict', note: 'Key-value map', accent: '#c8a45e' },
    ],
    interactiveCode: {
      setup: '',
      code: 'enemy = {"type": "Goblin", "hp": 30}\nenemy["hp"] -= 10\nprint(enemy)',
      expectedOutput: "{'type': 'Goblin', 'hp': 20}",
    },
    quiz: [
      {
        id: 'dict_q1',
        question: 'How do you safely access a key that might not exist in a dictionary without causing an error?',
        options: [
          'dict[key]',
          'dict.get(key)',
          'dict.find(key)',
          'dict(key)'
        ],
        correctIndex: 1,
        explanation: "dict.get(key) returns None (or a default value you specify) if the key doesn't exist, preventing a KeyError crash."
      }
    ],
    relatedConcepts: ['variables', 'lists'],
    learnPath: '/lesson/collections-kingdom/c3',
    trainingPath: '/training/collections-kingdom',
    icon: BookOpen,
  },
  {
    id: 'string-methods',
    title: 'String Methods',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '6 min read',
    completion: 0,
    overview: 'Strings in Python come with built-in methods that let you transform, search, and manipulate text without writing complex logic from scratch.',
    whyExists: 'Text processing is one of the most common tasks in programming. Whether formatting a username, validating an email, or cleaning data, string methods save you from reinventing the wheel.',
    realLifeAnalogy: {
      title: 'A Swiss Army Knife for Text',
      description: 'Imagine a toolkit attached to every piece of text. Need to capitalize? There\'s a tool. Need to split a sentence into words? There\'s a tool. String methods are that built-in toolkit.',
    },
    syntax: 'my_string.method_name()',
    example: 'name = "  ava the coder  "\\nprint(name.strip().title())\\n# Output: "Ava The Coder"',
    bestPractices: [
      'String methods return new strings — they don\'t modify the original.',
      'Chain methods for concise transformations (e.g., text.strip().lower()).',
      'Use .join() instead of + for combining many strings (better performance).',
    ],
    mistakes: [
      'Forgetting that strings are immutable — name.upper() does NOT change name.',
      'Confusing .find() (returns -1 if missing) with .index() (throws an error).',
      'Using .split() without understanding it returns a list, not a string.',
    ],
    memoryModel: [
      { name: 'name', value: '"  ava the coder  "', type: 'str', note: 'Original unchanged', accent: '#34d399' },
      { name: 'result', value: '"Ava The Coder"', type: 'str', note: 'New string created', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'hero = "dark knight"\\nprint(hero.upper())\\nprint(hero.replace("dark", "brave"))\\nprint(hero.split(" "))',
      expectedOutput: 'DARK KNIGHT\nbrave knight\n[\'dark\', \'knight\']',
    },
    quiz: [
      {
        id: 'sm_q1',
        question: 'What does "hello world".title() return?',
        options: ['HELLO WORLD', 'hello world', 'Hello World', 'Hello world'],
        correctIndex: 2,
        explanation: 'The .title() method capitalizes the first letter of each word.',
      },
      {
        id: 'sm_q2',
        question: 'Does name.upper() change the original variable name?',
        options: ['Yes, it modifies name in place', 'No, it returns a new string', 'It depends on the string length', 'Only if name is a global variable'],
        correctIndex: 1,
        explanation: 'Strings are immutable in Python. All string methods return new strings; they never modify the original.',
      },
    ],
    relatedConcepts: ['data-types', 'variables'],
    learnPath: '/lesson/datatypes-valley/d1',
    trainingPath: '/training/datatypes-valley',
    icon: Type,
  },
  {
    id: 'input-output',
    title: 'Input & Output',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '5 min read',
    completion: 0,
    overview: 'Input lets your program receive data from users. Output (print) displays results. Together, they make programs interactive.',
    whyExists: 'A game that never asks the player anything or shows anything is useless. I/O is how your program communicates with the outside world.',
    realLifeAnalogy: {
      title: 'A Conversation',
      description: 'Think of I/O as a conversation. input() is you asking a question and waiting for a reply. print() is you speaking the answer. Without both, there is no dialogue.',
    },
    syntax: 'name = input("prompt")\\nprint(value)',
    example: 'name = input("Enter your name: ")\\nprint("Hello,", name)',
    bestPractices: [
      'Always provide a clear prompt message inside input().',
      'Remember that input() always returns a string — convert with int() or float() if you need a number.',
      'Use f-strings for clean, readable output: print(f"Score: {score}").',
    ],
    mistakes: [
      'Forgetting that input() returns a string, leading to "55" instead of 10 when adding.',
      'Not providing a prompt, leaving the user staring at a blank screen.',
      'Mixing up print() and return — print shows text, return sends a value.',
    ],
    memoryModel: [
      { name: 'name', value: '"Hero"', type: 'str', note: 'From user input', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Simulated input\nname = "PyQuester"\\nage = "15"\\nprint(f"Welcome, {name}!")\\nprint(f"In 5 years you will be {int(age) + 5}")',
      expectedOutput: 'Welcome, PyQuester!\nIn 5 years you will be 20',
    },
    quiz: [
      {
        id: 'io_q1',
        question: 'What type does input() always return?',
        options: ['int', 'str', 'bool', 'It depends on what the user types'],
        correctIndex: 1,
        explanation: 'input() always returns a string, even if the user types a number. You must convert it explicitly.',
      },
    ],
    relatedConcepts: ['variables', 'data-types'],
    learnPath: '/lesson/variables-forest/v1',
    trainingPath: '/training/variables-forest',
    icon: Keyboard,
  },
  {
    id: 'type-conversion',
    title: 'Type Conversion',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '5 min read',
    completion: 0,
    overview: 'Type conversion (casting) transforms values from one data type to another, like turning a string "42" into the integer 42.',
    whyExists: 'When user input comes as text but you need to do math, or when a number needs to appear in a message, type conversion bridges the gap between data types.',
    realLifeAnalogy: {
      title: 'Currency Exchange',
      description: 'Just like exchanging dollars for euros changes the form but preserves the value, type conversion changes a value\'s type while keeping its meaning intact.',
    },
    syntax: 'int(value)\\nfloat(value)\\nstr(value)\\nbool(value)',
    example: 'age_text = "25"\\nage_number = int(age_text)\\nprint(age_number + 5)  # 30',
    bestPractices: [
      'Always validate before converting — int("hello") crashes.',
      'Use try/except around conversions when handling user input.',
      'Know the bool conversion rules: 0, "", [], None → False; everything else → True.',
    ],
    mistakes: [
      'Trying int("3.14") — you need float() first, then int().',
      'Forgetting that int() truncates, not rounds: int(3.9) → 3.',
      'Assuming str(None) returns an empty string (it returns "None").',
    ],
    memoryModel: [
      { name: 'age_text', value: '"25"', type: 'str', note: 'Original string', accent: '#34d399' },
      { name: 'age_number', value: '25', type: 'int', note: 'Converted to integer', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'price = "9.99"\\nquantity = "3"\\ntotal = float(price) * int(quantity)\\nprint(f"Total: ${total:.2f}")',
      expectedOutput: 'Total: $29.97',
    },
    quiz: [
      {
        id: 'tc_q1',
        question: 'What is the result of int(7.8)?',
        options: ['8', '7', '7.8', 'Error'],
        correctIndex: 1,
        explanation: 'int() truncates (removes the decimal), it does not round. So int(7.8) becomes 7.',
      },
    ],
    relatedConcepts: ['data-types', 'input-output'],
    learnPath: '/lesson/datatypes-valley/d4',
    trainingPath: '/training/datatypes-valley',
    icon: RefreshCw,
  },
  {
    id: 'while-loops',
    title: 'While Loops',
    category: 'Control Flow',
    difficulty: 'Intermediate',
    estimatedTime: '7 min read',
    completion: 0,
    overview: 'While loops repeat a block of code as long as a condition remains true. They\'re ideal when you don\'t know in advance how many times to repeat.',
    whyExists: 'Sometimes you need to keep running code until something happens — like a game loop that runs until the player quits, or a password prompt that repeats until the correct one is entered.',
    realLifeAnalogy: {
      title: 'Waiting for a Bus',
      description: 'You stand at the stop and keep checking: "Has the bus arrived?" If no, you wait and check again. When it arrives (condition becomes False), you stop waiting and board.',
    },
    syntax: 'while condition:\\n    # code to repeat\\n    # update condition',
    example: 'count = 3\\nwhile count > 0:\\n    print(f"Countdown: {count}")\\n    count -= 1\\nprint("Go!")',
    bestPractices: [
      'Always ensure the condition will eventually become False (avoid infinite loops).',
      'Update the loop variable inside the loop body.',
      'Use break to exit early and continue to skip to the next iteration.',
    ],
    mistakes: [
      'Creating an infinite loop by forgetting to update the condition variable.',
      'Using = instead of == in the condition (assignment vs comparison).',
      'Off-by-one errors — loop runs one too many or too few times.',
    ],
    memoryModel: [
      { name: 'count', value: '0', type: 'int', note: 'Final value after loop exits', accent: '#fbbf24' },
    ],
    interactiveCode: {
      setup: '',
      code: 'hp = 100\\nwhile hp > 0:\\n    hp -= 35\\n    print(f"HP: {max(hp, 0)}")\\nprint("Defeated!")',
      expectedOutput: 'HP: 65\nHP: 30\nHP: 0\nDefeated!',
    },
    quiz: [
      {
        id: 'wl_q1',
        question: 'When does a while loop stop executing?',
        options: ['After a fixed number of iterations', 'When the condition becomes False', 'When it reaches the end of the file', 'When return is called'],
        correctIndex: 1,
        explanation: 'A while loop checks its condition before each iteration. When the condition evaluates to False, the loop exits.',
      },
      {
        id: 'wl_q2',
        question: 'What does `break` do inside a while loop?',
        options: ['Pauses the loop temporarily', 'Skips to the next iteration', 'Exits the loop immediately', 'Restarts the loop from the beginning'],
        correctIndex: 2,
        explanation: 'break immediately terminates the innermost loop, regardless of the condition.',
      },
    ],
    relatedConcepts: ['loops', 'conditionals'],
    learnPath: '/lesson/loops-desert/l3',
    trainingPath: '/training/loops-desert',
    icon: Repeat,
  },
  {
    id: 'recursion',
    title: 'Recursion',
    category: 'Structure',
    difficulty: 'Advanced',
    estimatedTime: '12 min read',
    completion: 0,
    overview: 'Recursion is when a function calls itself to break a complex problem into simpler, identical sub-problems until reaching a base case.',
    whyExists: 'Some problems are naturally recursive — like traversing a tree structure, calculating factorials, or exploring a maze. Recursion mirrors the problem\'s own structure.',
    realLifeAnalogy: {
      title: 'Russian Nesting Dolls',
      description: 'Open a doll, find a smaller identical doll inside. Keep opening until you reach the smallest one (the base case). Then you "return" by closing each doll back up.',
    },
    syntax: 'def recursive_fn(n):\\n    if n <= base_case:\\n        return base_value\\n    return recursive_fn(smaller_n)',
    example: 'def factorial(n):\\n    if n <= 1:\\n        return 1\\n    return n * factorial(n - 1)\\n\\nprint(factorial(5))  # 120',
    bestPractices: [
      'Always define a base case to stop the recursion.',
      'Each recursive call must move toward the base case.',
      'Consider iterative alternatives for very deep recursion (Python has a recursion limit).',
    ],
    mistakes: [
      'Forgetting the base case, causing infinite recursion and a RecursionError.',
      'Not reducing the problem size in each recursive call.',
      'Using recursion where a simple loop would be clearer and more efficient.',
    ],
    memoryModel: [
      { name: 'factorial(5)', value: '5 * factorial(4)', type: 'call', note: 'Call stack frame 1', accent: '#a78bfa' },
      { name: 'factorial(4)', value: '4 * factorial(3)', type: 'call', note: 'Call stack frame 2', accent: '#a78bfa' },
      { name: 'factorial(1)', value: '1', type: 'int', note: 'Base case reached', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: 'def countdown(n):\\n    if n <= 0:\\n        print("Launch!")\\n        return\\n    print(n)\\n    countdown(n - 1)\\n\\ncountdown(3)',
      expectedOutput: '3\n2\n1\nLaunch!',
    },
    quiz: [
      {
        id: 'rec_q1',
        question: 'What happens if a recursive function has no base case?',
        options: ['It returns None', 'It runs forever and eventually crashes (RecursionError)', 'It stops after 10 iterations', 'Python auto-detects and adds one'],
        correctIndex: 1,
        explanation: 'Without a base case, the function keeps calling itself until Python\'s recursion limit is hit, causing a RecursionError.',
      },
    ],
    relatedConcepts: ['functions', 'while-loops'],
    learnPath: '/lesson/functions-mountain/f4',
    trainingPath: '/training/functions-mountain',
    icon: Layers,
  },
  {
    id: 'sets-tuples',
    title: 'Sets & Tuples',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    estimatedTime: '7 min read',
    completion: 0,
    overview: 'Sets store unique unordered elements (no duplicates). Tuples are like lists but immutable — once created, they can\'t be changed.',
    whyExists: 'Sets eliminate duplicates instantly and enable fast membership tests. Tuples protect data from accidental changes and can be used as dictionary keys.',
    realLifeAnalogy: {
      title: 'Guest List vs. Time Capsule',
      description: 'A set is like a guest list where each name appears only once, regardless of how many times you add it. A tuple is a time capsule — once sealed, its contents are forever fixed.',
    },
    syntax: 'my_set = {1, 2, 3}\\nmy_tuple = (1, 2, 3)',
    example: 'skills = {"fire", "ice", "fire"}\\nprint(skills)  # {\'fire\', \'ice\'}\\n\\ncoords = (10, 20)\\nprint(coords[0])  # 10',
    bestPractices: [
      'Use sets when uniqueness matters or for fast membership checks (x in my_set).',
      'Use tuples for fixed collections like coordinates, RGB colors, or database rows.',
      'Remember: sets are unordered — don\'t rely on element positions.',
    ],
    mistakes: [
      'Trying to create an empty set with {} — that creates a dict! Use set() instead.',
      'Attempting to modify a tuple (e.g., my_tuple[0] = 5) — tuples are immutable.',
      'Trying to add mutable items (like lists) to a set — only hashable items allowed.',
    ],
    memoryModel: [
      { name: 'skills', value: "{'fire', 'ice'}", type: 'set', note: 'Duplicates removed', accent: '#f87171' },
      { name: 'coords', value: '(10, 20)', type: 'tuple', note: 'Immutable pair', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'inventory = {"sword", "shield", "sword", "potion"}\\nprint(f"Unique items: {len(inventory)}")\\nprint("shield" in inventory)\\n\\nposition = (5, 10)\\nx, y = position\\nprint(f"X={x}, Y={y}")',
      expectedOutput: 'Unique items: 3\nTrue\nX=5, Y=10',
    },
    quiz: [
      {
        id: 'st_q1',
        question: 'How do you create an empty set in Python?',
        options: ['{}', 'set()', '[]', 'set{}'],
        correctIndex: 1,
        explanation: '{} creates an empty dictionary, not a set. Use set() for an empty set.',
      },
    ],
    relatedConcepts: ['lists', 'dictionaries'],
    learnPath: '/lesson/collections-kingdom/c4',
    trainingPath: '/training/collections-kingdom',
    icon: Hash,
  },
  {
    id: 'exception-handling',
    title: 'Exception Handling',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '10 min read',
    completion: 0,
    overview: 'Exception handling with try/except lets your program gracefully handle errors instead of crashing. It\'s how you build resilient, production-ready code.',
    whyExists: 'Real programs encounter unexpected situations: files that don\'t exist, network failures, invalid user input. Exception handling lets you anticipate and recover from these problems.',
    realLifeAnalogy: {
      title: 'A Safety Net',
      description: 'A trapeze artist performs risky moves (the try block). If they fall, the safety net catches them (the except block). Without it, a single mistake is catastrophic.',
    },
    syntax: 'try:\\n    # risky code\\nexcept ErrorType as e:\\n    # handle error\\nfinally:\\n    # always runs',
    example: 'try:\\n    result = 10 / 0\\nexcept ZeroDivisionError:\\n    result = "Cannot divide by zero"\\nprint(result)',
    bestPractices: [
      'Catch specific exceptions (except ValueError) instead of bare except.',
      'Use finally for cleanup code that must always run (closing files, connections).',
      'Don\'t use exceptions for normal control flow — they\'re for exceptional situations.',
    ],
    mistakes: [
      'Using bare except: which catches everything including KeyboardInterrupt.',
      'Silencing errors with an empty except block (pass) — at least log them.',
      'Putting too much code in the try block — keep it minimal.',
    ],
    memoryModel: [
      { name: 'result', value: '"Cannot divide by zero"', type: 'str', note: 'Set in except block', accent: '#fb923c' },
    ],
    interactiveCode: {
      setup: '',
      code: 'def safe_divide(a, b):\\n    try:\\n        return a / b\\n    except ZeroDivisionError:\\n        return "Error: Division by zero"\\n    except TypeError:\\n        return "Error: Invalid types"\\n\\nprint(safe_divide(10, 3))\\nprint(safe_divide(10, 0))',
      expectedOutput: '3.3333333333333335\nError: Division by zero',
    },
    quiz: [
      {
        id: 'eh_q1',
        question: 'What does the `finally` block do?',
        options: ['Runs only if an exception occurs', 'Runs only if no exception occurs', 'Always runs, whether or not an exception occurred', 'Prevents exceptions from being raised'],
        correctIndex: 2,
        explanation: 'The finally block executes no matter what — even if an exception was raised, caught, or not caught. It\'s ideal for cleanup tasks.',
      },
    ],
    relatedConcepts: ['functions', 'file-io'],
    learnPath: '/lesson/exception-abyss/e1',
    trainingPath: '/training/exception-abyss',
    icon: ShieldAlert,
  },
  {
    id: 'file-io',
    title: 'File I/O',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '9 min read',
    completion: 0,
    overview: 'File I/O lets your programs read from and write to files on disk, enabling data persistence beyond the life of a single program run.',
    whyExists: 'Without file I/O, all data is lost when the program ends. Games need to save progress, apps need to store settings, and data analysis requires reading datasets from files.',
    realLifeAnalogy: {
      title: 'A Journal',
      description: 'Writing to a file is like writing in a journal — the words persist after you close it. Reading a file is like opening the journal later to review what you wrote.',
    },
    syntax: 'with open("file.txt", "r") as f:\\n    content = f.read()\\n\\nwith open("file.txt", "w") as f:\\n    f.write("data")',
    example: '# Writing\\nwith open("save.txt", "w") as f:\\n    f.write("Level: 5\\nXP: 1200")\\n\\n# Reading\\nwith open("save.txt", "r") as f:\\n    print(f.read())',
    bestPractices: [
      'Always use the with statement — it automatically closes the file.',
      'Use "r" for reading, "w" for writing (overwrites), "a" for appending.',
      'Handle FileNotFoundError when reading files that might not exist.',
    ],
    mistakes: [
      'Forgetting to close a file (use with statement to avoid this).',
      'Using "w" mode when you meant "a" — "w" overwrites the entire file.',
      'Not handling encoding issues — use open("file.txt", encoding="utf-8").',
    ],
    memoryModel: [
      { name: 'f', value: '<file object>', type: 'TextIOWrapper', note: 'Auto-closed by with', accent: '#2dd4bf' },
      { name: 'content', value: '"Level: 5\\nXP: 1200"', type: 'str', note: 'Full file contents', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Simulated file operation\\nimport json\\n\\nplayer = {"name": "Hero", "level": 5, "xp": 1200}\\ndata = json.dumps(player, indent=2)\\nprint("Saved to file:")\\nprint(data)',
      expectedOutput: 'Saved to file:\n{\n  "name": "Hero",\n  "level": 5,\n  "xp": 1200\n}',
    },
    quiz: [
      {
        id: 'fio_q1',
        question: 'What is the benefit of using `with open(...)` instead of just `open()`?',
        options: ['It runs faster', 'It automatically closes the file when the block ends', 'It reads the entire file at once', 'It creates the file if it doesn\'t exist'],
        correctIndex: 1,
        explanation: 'The with statement ensures the file is properly closed when the block exits, even if an error occurs inside the block.',
      },
    ],
    relatedConcepts: ['exception-handling', 'dictionaries'],
    learnPath: '/lesson/filesystem-ruins/fs1',
    trainingPath: '/training/filesystem-ruins',
    icon: FileText,
  },
];
