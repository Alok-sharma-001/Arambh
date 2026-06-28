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
  
  // V3 RPG Content
  bossBattle?: {
    name: string;
    description: string;
    mechanic: string;
  };
  artifacts?: Array<{
    name: string;
    description: string;
    rarity: string;
  }>;
  trainingGround?: {
    exercises: string[];
  };
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
    learnPath: '/lesson/data-types-valley/d1',
    trainingPath: '/training/data-types-valley',
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
    title: 'Lists: Everyone Loves Lists',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    estimatedTime: '25 min read',
    completion: 0,
    overview: 'A list is Python\'s most versatile and widely-used data structure. It stores multiple items in an ordered, numbered sequence under a single name. Unlike a plain variable that holds one value, a list can hold zero, one, or thousands of values — and Python lets you freely mix strings, numbers, booleans, and even other lists inside the same list. Lists are mutable, meaning you can add, remove, and change items after creation. In Head First Python, the very first thing you build is a list of Monty Python movie cast members — because everyone loves lists.',
    whyExists: 'Almost every real program deals with collections of things: a playlist of songs, a roster of players, a log of events, or a shopping cart of items. Without lists, you would need a separate variable for every single item (player1, player2, player3…) which is impractical when the number of items is unknown or changes at runtime. Lists solve this by giving you a single, resizable container. You define them with square brackets [], add items with .append(), remove with .pop(), and access any item instantly by its index number. Python handles the memory management behind the scenes — the list grows and shrinks automatically.',
    realLifeAnalogy: {
      title: 'A Train of Cargo Cars',
      description: 'Imagine a freight train. The train itself is the list. Attached to the train are numbered cargo cars starting from car 0, car 1, car 2, etc. You can look inside car 0 to see what it\'s carrying, attach a brand new car to the end (using .append()), detach the last car (.pop()), or even insert a car in the middle (.insert()). The train can carry any mix of cargo — boxes of text, crates of numbers, even smaller trains nested inside (lists within lists).',
    },
    syntax: '# Creating a list\\nmy_list = [item1, item2, item3]\\n\\n# Common operations\\nmy_list.append(item)      # Add to end\\nmy_list.extend([a, b])    # Add multiple items\\nmy_list.insert(0, item)   # Insert at position\\nmy_list.pop()             # Remove & return last\\nmy_list.remove(item)      # Remove by value\\nmy_list[0]                # Access by index\\nmy_list[-1]               # Last item\\nmy_list[1:3]              # Slice (items 1-2)\\nlen(my_list)              # Count items',
    example: '# Head First Python Chapter 1: The Monty Python Cast\\ncast = ["Cleese", "Palin", "Jones", "Idle", "Chapman", "Gilliam"]\\nprint("Full cast:", cast)\\nprint("First actor:", cast[0])\\nprint("Last actor:", cast[-1])\\n\\n# Add a guest star\\ncast.append("Rushton")\\nprint("Cast size:", len(cast))\\n\\n# Nested lists — movies within a list\\nmovies = [\\n    ["Holy Grail", 1975],\\n    ["Life of Brian", 1979],\\n    ["Meaning of Life", 1983]\\n]\\nprint("Best movie:", movies[0][0])',
    bestPractices: [
      'Use square brackets [] to create lists — never parentheses (those make tuples) or curly braces (those make sets/dicts).',
      'Remember that indexing starts at 0. The first item is list[0], the second is list[1], and so on.',
      'Use negative indexing to access items from the end: list[-1] is the last item, list[-2] is second-to-last.',
      'Use .append() to add a single item and .extend() to add multiple items from another list.',
      'Use a for loop to iterate over lists: for item in my_list: processes each item in order.',
      'Use isinstance(item, list) to check if an element is itself a list — essential for handling nested data.',
    ],
    mistakes: [
      'Forgetting that lists are zero-indexed — list[1] is the SECOND item, not the first. This is the #1 source of bugs for beginners.',
      'Using parentheses () instead of square brackets [] to create a list. Parentheses create a tuple, which is immutable!',
      'Accessing an index that doesn\'t exist, like my_list[5] on a 3-item list — this causes an IndexError crash.',
      'Confusing .append() with .extend(): append([1,2]) adds a single nested list, while extend([1,2]) adds two separate items.',
      'Modifying a list while looping over it — this causes items to be skipped or causes infinite loops. Create a copy first.',
    ],
    memoryModel: [
      { name: 'cast', value: '["Cleese", "Palin", "Jones"]', type: 'list', note: 'Ordered, mutable, zero-indexed', accent: '#c8a45e' },
      { name: 'cast[0]', value: '"Cleese"', type: 'str', note: 'Index 0 → first item', accent: '#34d399' },
      { name: 'cast[1]', value: '"Palin"', type: 'str', note: 'Index 1 → second item', accent: '#60a5fa' },
      { name: 'cast[2]', value: '"Jones"', type: 'str', note: 'Index 2 → third item', accent: '#a78bfa' },
    ],
    interactiveCode: {
      setup: '',
      code: '# From Head First Python Chapter 1\\n# Build the Monty Python cast list step by step\\ncast = []\\ncast.append("Cleese")\\ncast.append("Palin")\\ncast.append("Jones")\\ncast.append("Idle")\\nprint("Cast:", cast)\\nprint("Lead actor:", cast[0])\\nprint("Total actors:", len(cast))\\n\\n# Check if someone is in the cast\\nprint("Is Cleese in cast?", "Cleese" in cast)\\nprint("Is Chapman in cast?", "Chapman" in cast)',
      expectedOutput: "Cast: ['Cleese', 'Palin', 'Jones', 'Idle']\nLead actor: Cleese\nTotal actors: 4\nIs Cleese in cast? True\nIs Chapman in cast? False",
    },
    quiz: [
      {
        id: 'list_q1',
        question: 'Which of the following correctly creates a list of numbers?',
        options: ['numbers = (1, 2, 3)', 'numbers = [1, 2, 3]', 'numbers = {1, 2, 3}', 'numbers = 1, 2, 3'],
        correctIndex: 1,
        explanation: 'Square brackets [] define a list. Parentheses () define a tuple, and curly braces {} define a set or dictionary.'
      },
      {
        id: 'list_q2',
        question: 'Given cast = ["Cleese", "Palin", "Jones"], what does cast[1] return?',
        options: ['"Cleese"', '"Palin"', '"Jones"', 'An IndexError'],
        correctIndex: 1,
        explanation: 'Lists are zero-indexed. Index 0 is "Cleese", index 1 is "Palin", and index 2 is "Jones".'
      },
      {
        id: 'list_q3',
        question: 'What is the difference between .append() and .extend()?',
        options: [
          'There is no difference',
          '.append() adds a single item; .extend() adds each item from another list individually',
          '.append() is faster than .extend()',
          '.extend() only works with numbers'
        ],
        correctIndex: 1,
        explanation: 'append(x) adds x as a single element (even if x is a list). extend(x) iterates through x and adds each item separately.'
      },
      {
        id: 'list_q4',
        question: 'What does isinstance(item, list) do?',
        options: [
          'Creates a new list from item',
          'Checks if item is a list (returns True or False)',
          'Converts item to a list',
          'Removes item from a list'
        ],
        correctIndex: 1,
        explanation: 'isinstance() checks whether an object is an instance of a specific type. isinstance([1,2], list) returns True. This is crucial for handling nested lists.'
      }
    ],
    relatedConcepts: ['variables', 'dictionaries'],
    learnPath: '/lesson/collections-kingdom/c1',
    trainingPath: '/training/collections-kingdom',
    icon: ListTree,
    bossBattle: {
      name: 'The Index Demon',
      description: 'A fearsome creature born from off-by-one errors and out-of-bounds exceptions. It constantly shifts the contents and size of your lists, trying to trick you into accessing invalid indices. It attacks with IndexError, feeds on confusion about zero-indexing, and hides nested lists within lists to confuse your iteration. Only by proving your mastery of list indexing, negative indices, and len() can you defeat it.',
      mechanic: 'A multi-round code challenge: Round 1 — calculate the correct index for the last item of a growing list. Round 2 — navigate a nested list to extract a deeply hidden value. Round 3 — fix a broken for-loop that crashes on a list of mixed types using isinstance().'
    },
    artifacts: [
      {
        name: 'The Bracket of Holding',
        description: 'A magical container forged from square brackets. Capable of storing an infinite array of mixed items — strings, numbers, booleans, and even other Brackets of Holding nested within.',
        rarity: 'Common'
      },
      {
        name: 'The Recursive Scroll',
        description: 'An ancient parchment that teaches the art of processing arbitrarily nested lists. When a list contains lists which contain lists, this scroll reveals the recursive pattern to process them all.',
        rarity: 'Uncommon'
      }
    ],
    trainingGround: {
      exercises: ['list-creation', 'list-indexing', 'list-appending', 'list-iteration', 'nested-lists', 'list-isinstance-check']
    }
  },
  {
    id: 'hfp-modules',
    title: 'Modules & Functions: Sharing Your Code',
    category: 'Structure',
    difficulty: 'Beginner',
    estimatedTime: '20 min read',
    completion: 0,
    overview: 'A module is simply a Python file (.py) that contains functions you can share and reuse. Instead of copying code everywhere, you write it once, save it in a module, and import it wherever needed. Python also lets you package and distribute your modules so the entire world can use them.',
    whyExists: 'As your programs grow, you cannot keep all code in one file. Modules let you organize code into logical units, avoid duplication, and share your work with the Python community via PyPI (Python Package Index). Every library you pip install is just someone else\'s module.',
    realLifeAnalogy: {
      title: 'A Recipe Book',
      description: 'Think of a module as a recipe book. Each function inside is a recipe. Instead of memorizing every recipe, you just open the book (import the module) and follow the recipe (call the function). You can also share your recipe book with friends.',
    },
    syntax: '# Creating a module (nester.py)\\ndef print_lol(the_list):\\n    for item in the_list:\\n        print(item)\\n\\n# Using it\\nimport nester\\nnester.print_lol([1, 2, 3])',
    example: '# In mymath.py\\ndef double(n):\\n    return n * 2\\n\\n# In main.py\\nfrom mymath import double\\nprint(double(21))  # 42',
    bestPractices: [
      'Name your module files with lowercase and underscores (my_module.py).',
      'Use from module import function when you only need specific functions.',
      'Add docstrings to your functions so users understand what they do.',
      'Use if __name__ == "__main__": to make your module both importable and runnable.',
    ],
    mistakes: [
      'Naming your file the same as a built-in module (e.g., random.py) which shadows the real one.',
      'Forgetting that import runs all top-level code in the module file.',
      'Circular imports — module A imports B, and B imports A, causing an ImportError.',
    ],
    memoryModel: [
      { name: 'nester', value: '<module object>', type: 'module', note: 'Loaded into memory on import', accent: '#a78bfa' },
      { name: 'print_lol', value: '<function>', type: 'function', note: 'Accessed via nester.print_lol', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Simulating module usage\\ndef greet(name, greeting="Hello"):\\n    return f"{greeting}, {name}!"\\n\\n# Using default parameter\\nprint(greet("Adventurer"))\\n# Using custom parameter\\nprint(greet("Adventurer", "Hail"))',
      expectedOutput: 'Hello, Adventurer!\nHail, Adventurer!',
    },
    quiz: [
      {
        id: 'hfp_mod_q1',
        question: 'What is a Python module?',
        options: ['A special type of variable', 'A .py file containing reusable code', 'A built-in data structure', 'A type of loop'],
        correctIndex: 1,
        explanation: 'A module is simply a .py file that contains Python code (functions, classes, variables) that can be imported and reused in other programs.',
      },
      {
        id: 'hfp_mod_q2',
        question: 'What does "from math import sqrt" do?',
        options: ['Imports the entire math module', 'Imports only the sqrt function from math', 'Creates a new function called sqrt', 'Renames the math module to sqrt'],
        correctIndex: 1,
        explanation: 'The from...import syntax lets you import specific items from a module, so you can call sqrt() directly without the math. prefix.',
      },
    ],
    relatedConcepts: ['functions', 'lists'],
    learnPath: '/lesson/modules-harbor/m1',
    trainingPath: '/training/modules-harbor',
    icon: Code2,
    bossBattle: {
      name: 'The Import Phantom',
      description: 'A spectral creature that scrambles your import paths and shadows built-in modules with fake ones. You must correctly resolve import conflicts to banish it.',
      mechanic: 'Debug challenge where you must fix broken import statements and resolve namespace collisions across multiple files.',
    },
    artifacts: [
      {
        name: 'The __init__ Stone',
        description: 'An ancient artifact that turns any ordinary directory into a recognizable Python package.',
        rarity: 'Common',
      },
    ],
    trainingGround: {
      exercises: ['create-module', 'import-functions', 'default-parameters', 'package-distribution'],
    },
  },
  {
    id: 'hfp-files-exceptions',
    title: 'Files & Exceptions: Dealing with Errors',
    category: 'Advanced',
    difficulty: 'Beginner',
    estimatedTime: '22 min read',
    completion: 0,
    overview: 'Real programs need to read data from files and handle the unexpected errors that come with it. Python\'s open() function reads and writes files, while try/except lets your program recover gracefully when things go wrong instead of crashing.',
    whyExists: 'Data lives in files — text files, CSVs, logs. Your code will encounter missing files, permission errors, and corrupted data. Without exception handling, a single error kills your entire program. With try/except, you catch errors and decide what to do next.',
    realLifeAnalogy: {
      title: 'Opening a Locked Chest',
      description: 'Reading a file is like opening a treasure chest. Sometimes the chest is there and opens fine (success). Sometimes it is missing (FileNotFoundError). Sometimes it is locked (PermissionError). Exception handling is your set of lockpicks and backup plans.',
    },
    syntax: '# Reading a file\\ntry:\\n    with open("data.txt") as f:\\n        data = f.readline()\\nexcept FileNotFoundError:\\n    print("File not found!")\\nexcept PermissionError:\\n    print("Access denied!")',
    example: 'try:\\n    with open("sketch.txt") as f:\\n        for line in f:\\n            print(line.strip())\\nexcept FileNotFoundError:\\n    print("Sketch file is missing!")',
    bestPractices: [
      'Always use the with statement — it automatically closes the file even if an error occurs.',
      'Catch specific exceptions (FileNotFoundError, ValueError) not bare except.',
      'Use .strip() when reading lines to remove trailing newlines.',
      'Use .split() to break lines into parts when reading structured data like CSV.',
    ],
    mistakes: [
      'Forgetting to close a file after opening it (the with statement prevents this).',
      'Using "w" mode when you meant "r" — "w" erases the file contents immediately!',
      'Catching all exceptions with bare except: which hides real bugs.',
      'Not handling the encoding — use open("file.txt", encoding="utf-8") for special characters.',
    ],
    memoryModel: [
      { name: 'f', value: '<open file>', type: 'TextIOWrapper', note: 'File handle, auto-closed by with', accent: '#2dd4bf' },
      { name: 'data', value: '"First line of text"', type: 'str', note: 'Read from file', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Simulating file reading with error handling\\ndata = "Cleese:Actor\\nIdle:Comedian\\nChapman:Writer"\\n\\nfor line in data.split("\\n"):\\n    try:\\n        name, role = line.split(":")\\n        print(f"{name} is a {role}")\\n    except ValueError:\\n        print(f"Skipping bad line: {line}")',
      expectedOutput: 'Cleese is a Actor\nIdle is a Comedian\nChapman is a Writer',
    },
    quiz: [
      {
        id: 'hfp_fe_q1',
        question: 'What happens if you open a file with mode "w" that already has data?',
        options: ['It appends new data to the end', 'It erases all existing data first', 'It throws an error', 'It creates a backup copy'],
        correctIndex: 1,
        explanation: 'Mode "w" (write) truncates the file to zero length first, effectively erasing all existing content before writing new data.',
      },
      {
        id: 'hfp_fe_q2',
        question: 'Why is "with open()" preferred over just "open()"?',
        options: ['It runs faster', 'It automatically closes the file when done', 'It reads the whole file at once', 'It encrypts the file'],
        correctIndex: 1,
        explanation: 'The with statement acts as a context manager that guarantees the file is properly closed when you exit the block, even if an exception occurs.',
      },
    ],
    relatedConcepts: ['exception-handling', 'file-io', 'hfp-modules'],
    learnPath: '/lesson/filesystem-ruins/fs1',
    trainingPath: '/training/filesystem-ruins',
    icon: FileText,
    bossBattle: {
      name: 'The Corruption Worm',
      description: 'A vile worm that corrupts your data files mid-read, injecting bad lines and missing delimiters. You must write bulletproof parsing code to survive.',
      mechanic: 'Parse a corrupted data file using try/except to skip bad lines and extract all valid records without crashing.',
    },
    artifacts: [
      {
        name: 'The Context Shield',
        description: 'A magical shield (the "with" statement) that automatically seals file connections when danger strikes.',
        rarity: 'Common',
      },
    ],
    trainingGround: {
      exercises: ['read-file-lines', 'write-to-file', 'handle-missing-file', 'parse-structured-data'],
    },
  },
  {
    id: 'hfp-persistence',
    title: 'Persistence: Saving Data to Files',
    category: 'Advanced',
    difficulty: 'Intermediate',
    estimatedTime: '20 min read',
    completion: 0,
    overview: 'Persistence means saving your program\'s data so it survives after the program ends. Python provides pickle for saving Python objects directly, and you can also use plain text, JSON, or structured formats. The key tool is the "with" statement combined with binary file modes.',
    whyExists: 'Without persistence, every time you close your program, all progress is lost. Games need save files, apps need settings storage, and data pipelines need checkpoints. Pickle serializes any Python object into bytes you can write to disk and reload later.',
    realLifeAnalogy: {
      title: 'Freezing Food for Later',
      description: 'Pickling data is like freezing a meal. You take a fresh object (the meal), freeze it into a file (the freezer), and when you need it again, you thaw it (unpickle) and it\'s exactly as you left it. The structure, flavor, everything is preserved.',
    },
    syntax: '# Saving with pickle\\nimport pickle\\nwith open("data.pkl", "wb") as f:\\n    pickle.dump(my_data, f)\\n\\n# Loading with pickle\\nwith open("data.pkl", "rb") as f:\\n    my_data = pickle.load(f)',
    example: 'import pickle\\n\\nplayer = {"name": "Hero", "level": 5, "inventory": ["sword", "shield"]}\\n\\n# Save\\nwith open("save.pkl", "wb") as f:\\n    pickle.dump(player, f)\\n\\n# Load\\nwith open("save.pkl", "rb") as f:\\n    loaded = pickle.load(f)\\nprint(loaded["name"])  # Hero',
    bestPractices: [
      'Use "wb" (write binary) and "rb" (read binary) modes with pickle — not "w" and "r".',
      'For human-readable storage, prefer JSON over pickle.',
      'Never unpickle data from untrusted sources — it can execute arbitrary code.',
      'Use try/except around load operations in case the file is corrupted.',
    ],
    mistakes: [
      'Using text mode ("w") instead of binary mode ("wb") with pickle, causing a TypeError.',
      'Forgetting to import pickle before using it.',
      'Assuming pickled files are human-readable — they are binary.',
      'Not handling EOFError when the pickle file is empty or incomplete.',
    ],
    memoryModel: [
      { name: 'player', value: '{"name": "Hero", "level": 5}', type: 'dict', note: 'Original Python object', accent: '#c8a45e' },
      { name: 'save.pkl', value: '<binary bytes>', type: 'file', note: 'Serialized on disk', accent: '#a78bfa' },
      { name: 'loaded', value: '{"name": "Hero", "level": 5}', type: 'dict', note: 'Restored from disk', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: 'import json\\n\\n# Using JSON for human-readable persistence\\nplayer = {"name": "Hero", "level": 5, "xp": 1200}\\n\\n# Serialize to string (simulating file save)\\nsaved = json.dumps(player, indent=2)\\nprint("Saved:", saved)\\n\\n# Deserialize (simulating file load)\\nloaded = json.loads(saved)\\nprint(f"Welcome back, {loaded[\'name\']}! Level: {loaded[\'level\']}")',
      expectedOutput: 'Saved: {\n  "name": "Hero",\n  "level": 5,\n  "xp": 1200\n}\nWelcome back, Hero! Level: 5',
    },
    quiz: [
      {
        id: 'hfp_per_q1',
        question: 'What file mode must you use when writing with pickle?',
        options: ['"w" (write text)', '"wb" (write binary)', '"a" (append)', '"r" (read)'],
        correctIndex: 1,
        explanation: 'Pickle serializes data into binary format, so you must open files in binary mode — "wb" for writing and "rb" for reading.',
      },
      {
        id: 'hfp_per_q2',
        question: 'What is the main risk of using pickle.load() on untrusted data?',
        options: ['It runs slowly', 'It can execute arbitrary malicious code', 'It corrupts your file system', 'It only works on Linux'],
        correctIndex: 1,
        explanation: 'Unpickling can execute arbitrary code embedded in the pickled data. Never unpickle files from untrusted or unknown sources.',
      },
    ],
    relatedConcepts: ['hfp-files-exceptions', 'dictionaries', 'file-io'],
    learnPath: '/lesson/filesystem-ruins/fs2',
    trainingPath: '/training/filesystem-ruins',
    icon: Database,
    bossBattle: {
      name: 'The Data Ghost',
      description: 'A phantom that erases your save files and corrupts your serialized data. You must implement robust save/load logic with proper error recovery to defeat it.',
      mechanic: 'Implement a complete save-game system that handles missing files, corrupted data, and version mismatches.',
    },
    artifacts: [
      {
        name: 'The Pickle Jar',
        description: 'A mystical jar that can freeze any Python object in time, preserving its exact state for eternity.',
        rarity: 'Uncommon',
      },
    ],
    trainingGround: {
      exercises: ['pickle-save-load', 'json-serialization', 'binary-vs-text-mode', 'error-recovery-on-load'],
    },
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
    id: 'hfp-comprehensions',
    title: 'List Comprehensions',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    estimatedTime: '22 min read',
    completion: 0,
    overview: 'List comprehensions let you create new lists by transforming and filtering existing data in a single, elegant line. Instead of writing 4-5 lines with a for loop, append, and if-statement, a comprehension does it all at once. Python also supports set and dictionary comprehensions.',
    whyExists: 'Data processing is the heart of programming. You constantly need to filter lists, transform values, and extract subsets. Comprehensions make this concise, readable, and Pythonic. They are faster than equivalent for-loop code because Python optimizes them internally.',
    realLifeAnalogy: {
      title: 'A Sorting Machine on a Conveyor Belt',
      description: 'Imagine a factory conveyor belt. Raw items come in on one side. A sorting machine checks each item (the filter condition), transforms qualifying items (the expression), and drops them into a new box (the new list). Items that don\'t qualify are discarded.',
    },
    syntax: '# List comprehension\\nnew_list = [expression for item in iterable if condition]\\n\\n# Dict comprehension\\nnew_dict = {key: value for item in iterable}',
    example: '# Get squares of even numbers only\\nnumbers = [1, 2, 3, 4, 5, 6]\\neven_squares = [n**2 for n in numbers if n % 2 == 0]\\nprint(even_squares)  # [4, 16, 36]',
    bestPractices: [
      'Keep comprehensions simple — if the logic gets complex, use a regular for loop.',
      'Use meaningful variable names even in comprehensions (not just x or i).',
      'Comprehensions create new lists — they don\'t modify the original.',
      'Use generator expressions (parentheses instead of brackets) for large datasets to save memory.',
    ],
    mistakes: [
      'Making comprehensions too complex with nested conditions — readability matters.',
      'Forgetting the "for" keyword — [x*2 if x > 3] is invalid without "for x in list".',
      'Confusing the filter position: [x for x in list if cond] vs [x if cond else y for x in list].',
    ],
    memoryModel: [
      { name: 'numbers', value: '[1, 2, 3, 4, 5, 6]', type: 'list', note: 'Original data', accent: '#60a5fa' },
      { name: 'even_squares', value: '[4, 16, 36]', type: 'list', note: 'New filtered & transformed list', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: 'scores = [45, 82, 91, 33, 78, 95, 60]\\n\\n# Filter passing scores and add grade\\npassed = [s for s in scores if s >= 60]\\nprint("Passed:", passed)\\n\\n# Transform to grade labels\\ngrades = ["A" if s >= 90 else "B" if s >= 80 else "C" for s in passed]\\nprint("Grades:", grades)',
      expectedOutput: "Passed: [82, 91, 78, 95, 60]\nGrades: ['B', 'A', 'C', 'A', 'C']",
    },
    quiz: [
      {
        id: 'hfp_comp_q1',
        question: 'What does [x*2 for x in [1,2,3]] produce?',
        options: ['[1, 2, 3]', '[2, 4, 6]', '[1, 4, 9]', 'Error'],
        correctIndex: 1,
        explanation: 'The comprehension takes each element x from [1,2,3] and applies x*2, producing [2, 4, 6].',
      },
      {
        id: 'hfp_comp_q2',
        question: 'Where does the "if" filter go in a list comprehension?',
        options: ['Before the "for"', 'After the "for" clause', 'Inside the expression', 'Comprehensions cannot filter'],
        correctIndex: 1,
        explanation: 'The filter goes at the end: [expr for item in iterable if condition]. Only items where the condition is True are included.',
      },
    ],
    relatedConcepts: ['lists', 'dictionaries', 'hfp-persistence'],
    learnPath: '/lesson/comprehension-forge/cf1',
    trainingPath: '/training/comprehension-forge',
    icon: Sigma,
    bossBattle: {
      name: 'The Data Hydra',
      description: 'A multi-headed beast that throws massive unsorted datasets at you. Each head represents a different transformation challenge. You must use comprehensions to filter and reshape data before time runs out.',
      mechanic: 'Convert verbose for-loop code into equivalent one-liner comprehensions under a time limit.',
    },
    artifacts: [
      {
        name: 'The Comprehension Lens',
        description: 'A magical monocle that lets you see through raw data and instantly extract the patterns hidden within.',
        rarity: 'Uncommon',
      },
    ],
    trainingGround: {
      exercises: ['basic-list-comprehension', 'filtered-comprehension', 'dict-comprehension', 'nested-comprehension'],
    },
  },
  {
    id: 'hfp-custom-objects',
    title: 'Classes & Objects (OOP)',
    category: 'Structure',
    difficulty: 'Intermediate',
    estimatedTime: '25 min read',
    completion: 0,
    overview: 'Classes let you create your own custom data types that bundle data (attributes) and behavior (methods) together. Instead of passing loose variables around, you create objects that know what they are and what they can do. This is the foundation of Object-Oriented Programming (OOP).',
    whyExists: 'As programs grow, managing data with just lists and dicts becomes messy. Classes let you model real-world things: a Player has a name, health, and can attack(). An Inventory has items and can add_item(). OOP keeps related data and logic together.',
    realLifeAnalogy: {
      title: 'A Blueprint for Building Houses',
      description: 'A class is like an architectural blueprint. The blueprint defines what every house will have (rooms, doors, windows). Each actual house built from that blueprint is an object (instance). Every house has the same structure but different contents.',
    },
    syntax: 'class Player:\\n    def __init__(self, name, hp=100):\\n        self.name = name\\n        self.hp = hp\\n\\n    def take_damage(self, amount):\\n        self.hp -= amount',
    example: 'class Warrior:\\n    def __init__(self, name):\\n        self.name = name\\n        self.hp = 100\\n\\n    def attack(self):\\n        return f"{self.name} swings sword!"\\n\\nhero = Warrior("Kael")\\nprint(hero.attack())',
    bestPractices: [
      'Always define __init__ to set up initial attributes.',
      'Use self to refer to the instance\'s own data inside methods.',
      'Keep classes focused — a Player class shouldn\'t also manage the game map.',
      'Use __str__ or __repr__ to make your objects printable and debuggable.',
    ],
    mistakes: [
      'Forgetting self as the first parameter of every method.',
      'Confusing the class (blueprint) with an instance (actual object).',
      'Modifying class-level attributes thinking they are instance attributes.',
      'Not calling __init__ properly when creating subclasses.',
    ],
    memoryModel: [
      { name: 'Warrior', value: '<class>', type: 'class', note: 'The blueprint', accent: '#a78bfa' },
      { name: 'hero', value: '{name: "Kael", hp: 100}', type: 'Warrior', note: 'Instance created from class', accent: '#c8a45e' },
    ],
    interactiveCode: {
      setup: '',
      code: 'class Pet:\\n    def __init__(self, name, species):\\n        self.name = name\\n        self.species = species\\n        self.happiness = 50\\n\\n    def play(self):\\n        self.happiness += 20\\n        return f"{self.name} is playing! Happiness: {self.happiness}"\\n\\ndog = Pet("Rex", "Dog")\\nprint(dog.play())\\nprint(dog.play())',
      expectedOutput: 'Rex is playing! Happiness: 70\nRex is playing! Happiness: 90',
    },
    quiz: [
      {
        id: 'hfp_oop_q1',
        question: 'What is "self" in a Python class?',
        options: ['A keyword that creates new classes', 'A reference to the current instance of the class', 'A built-in function', 'The class name'],
        correctIndex: 1,
        explanation: '"self" is a reference to the specific object that called the method. It lets each instance access its own attributes and methods.',
      },
      {
        id: 'hfp_oop_q2',
        question: 'What does __init__ do?',
        options: ['Deletes the object', 'Initializes the object when it is created', 'Imports a module', 'Converts data types'],
        correctIndex: 1,
        explanation: '__init__ is the constructor method. It runs automatically when you create a new instance, setting up its initial state.',
      },
    ],
    relatedConcepts: ['functions', 'dictionaries', 'hfp-comprehensions'],
    learnPath: '/lesson/oop-citadel/oop1',
    trainingPath: '/training/oop-citadel',
    icon: Layers,
    bossBattle: {
      name: 'The Shapeless Mimic',
      description: 'An amorphous entity that has no structure. It steals your data and scatters it across loose variables. You must impose order by designing a class hierarchy that captures and organizes all the chaos.',
      mechanic: 'Refactor messy procedural code into clean OOP design with proper classes, attributes, and methods.',
    },
    artifacts: [
      {
        name: 'The Self Crystal',
        description: 'A luminous crystal that binds data to behavior, creating objects that are aware of their own identity.',
        rarity: 'Rare',
      },
    ],
    trainingGround: {
      exercises: ['create-class', 'add-methods', 'inheritance-basics', 'dunder-methods'],
    },
  },
  {
    id: 'hfp-web-development',
    title: 'Web Development with Flask',
    category: 'Advanced',
    difficulty: 'Intermediate',
    estimatedTime: '25 min read',
    completion: 0,
    overview: 'Python can power web applications using frameworks like Flask. A web app receives HTTP requests from browsers, processes data on the server, and returns HTML responses. Flask makes this simple with decorators that map URLs to Python functions.',
    whyExists: 'The web is the most universal platform — everyone has a browser. Python web frameworks let you build interactive websites, APIs, and dashboards using the same Python you already know. Flask is lightweight and perfect for learning web concepts.',
    realLifeAnalogy: {
      title: 'A Restaurant',
      description: 'A web app is like a restaurant. The browser (customer) sends a request (order). The web server (waiter) routes it to the right function (kitchen). The function processes data (cooks the meal) and returns a response (serves the dish).',
    },
    syntax: 'from flask import Flask\\napp = Flask(__name__)\\n\\n@app.route("/")\\ndef home():\\n    return "Hello, Web!"\\n\\napp.run()',
    example: 'from flask import Flask, render_template\\napp = Flask(__name__)\\n\\n@app.route("/greet/<name>")\\ndef greet(name):\\n    return render_template("greet.html", user=name)\\n\\napp.run(debug=True)',
    bestPractices: [
      'Use @app.route() decorators to map URLs to functions cleanly.',
      'Separate logic from presentation — use HTML templates, not raw strings.',
      'Enable debug=True during development for auto-reload and error pages.',
      'Use render_template() with Jinja2 for dynamic HTML generation.',
    ],
    mistakes: [
      'Forgetting to call app.run() — the server won\'t start without it.',
      'Hardcoding HTML in Python functions instead of using templates.',
      'Not understanding that the server runs in a loop — it doesn\'t exit like a script.',
      'Exposing debug=True in production, which leaks sensitive information.',
    ],
    memoryModel: [
      { name: 'app', value: '<Flask instance>', type: 'Flask', note: 'The web application object', accent: '#60a5fa' },
      { name: 'request', value: 'GET /greet/Hero', type: 'Request', note: 'Incoming HTTP request', accent: '#fbbf24' },
      { name: 'response', value: '"<html>Hello Hero</html>"', type: 'str', note: 'HTML sent back to browser', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Simulating web request handling\\ndef handle_request(path):\\n    routes = {\\n        "/": "Welcome to Arambh!",\\n        "/about": "We teach Python through RPG adventures.",\\n        "/quest": "Your current quest: Master Lists!"\\n    }\\n    return routes.get(path, "404 - Page Not Found")\\n\\nfor url in ["/", "/about", "/quest", "/secret"]:\\n    print(f"GET {url} -> {handle_request(url)}")',
      expectedOutput: 'GET / -> Welcome to Arambh!\nGET /about -> We teach Python through RPG adventures.\nGET /quest -> Your current quest: Master Lists!\nGET /secret -> 404 - Page Not Found',
    },
    quiz: [
      {
        id: 'hfp_web_q1',
        question: 'What does @app.route("/") do in Flask?',
        options: ['Creates a new HTML file', 'Maps the root URL to the decorated function', 'Starts the web server', 'Imports a module'],
        correctIndex: 1,
        explanation: 'The @app.route() decorator tells Flask: "When someone visits this URL, run this function and return its result as the response."',
      },
    ],
    relatedConcepts: ['functions', 'hfp-custom-objects', 'dictionaries'],
    learnPath: '/lesson/web-tower/wt1',
    trainingPath: '/training/web-tower',
    icon: Terminal,
    bossBattle: {
      name: 'The 404 Wraith',
      description: 'A spectral entity that haunts broken links and dead routes. It throws malformed URLs and missing templates at your server. You must configure proper routing and error handlers to vanquish it.',
      mechanic: 'Build a Flask app with multiple routes, dynamic URL parameters, and custom 404 error pages.',
    },
    artifacts: [
      {
        name: 'The Route Map',
        description: 'An enchanted scroll that automatically maps any URL to its correct handler function.',
        rarity: 'Rare',
      },
    ],
    trainingGround: {
      exercises: ['flask-hello-world', 'dynamic-routes', 'template-rendering', 'form-handling'],
    },
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
    learnPath: '/lesson/data-types-valley/d1',
    trainingPath: '/training/data-types-valley',
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
    learnPath: '/lesson/data-types-valley/d4',
    trainingPath: '/training/data-types-valley',
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
    id: 'list-methods',
    title: 'List Methods',
    category: 'Data Structures',
    difficulty: 'Beginner',
    estimatedTime: '15 min read',
    completion: 0,
    overview: 'Lists come with powerful built-in methods that let you add, remove, search, sort, and transform items. These methods are the core toolkit for manipulating ordered collections in Python — append(), pop(), insert(), remove(), sort(), reverse(), index(), count(), extend(), and clear().',
    whyExists: 'Knowing how to create a list is step one. But in real programs, you constantly need to add items dynamically, remove duplicates, sort leaderboards, search for specific values, and merge multiple lists. List methods make all of this trivial.',
    realLifeAnalogy: {
      title: 'A To-Do List App',
      description: 'Your to-do list has features: add a task (append), insert a task at the top (insert), check off and remove (pop/remove), rearrange by priority (sort), see how many tasks you have (len), and find where a specific task is (index).',
    },
    syntax: 'my_list.append(item)      # Add to end\\nmy_list.insert(i, item)   # Add at index i\\nmy_list.pop()             # Remove & return last\\nmy_list.pop(i)            # Remove & return at index i\\nmy_list.remove(item)      # Remove first match\\nmy_list.sort()            # Sort in place\\nmy_list.reverse()         # Reverse in place\\nmy_list.index(item)       # Find index of item\\nmy_list.count(item)       # Count occurrences\\nmy_list.extend(other)     # Merge another list\\nmy_list.clear()           # Remove all items',
    example: 'inventory = ["sword", "shield"]\\ninventory.append("potion")       # ["sword", "shield", "potion"]\\ninventory.insert(0, "helmet")    # ["helmet", "sword", "shield", "potion"]\\nitem = inventory.pop()           # removes "potion"\\ninventory.remove("sword")        # ["helmet", "shield"]\\ninventory.sort()                 # ["helmet", "shield"]\\nprint(inventory)',
    bestPractices: [
      'Use .append() to add single items, .extend() to merge multiple items from another list.',
      'Use .pop() to remove and return the last item — great for stack-like behavior.',
      'Remember that .sort() and .reverse() modify the list IN PLACE and return None.',
      'Use sorted(list) if you want a new sorted list without changing the original.',
    ],
    mistakes: [
      'Writing new_list = my_list.sort() — .sort() returns None! Use sorted() instead.',
      'Using .remove() on an item that does not exist causes a ValueError. Check first with "in".',
      'Confusing .append([1,2]) (adds a list as one item) with .extend([1,2]) (adds each item).',
      'Modifying a list while iterating over it — create a copy first with list() or [:].',
    ],
    memoryModel: [
      { name: 'inventory', value: '["helmet", "shield"]', type: 'list', note: 'After append, insert, pop, remove', accent: '#c8a45e' },
      { name: 'popped', value: '"potion"', type: 'str', note: 'Returned by pop()', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: 'heroes = ["Kael", "Aria", "Zor"]\\nprint("Original:", heroes)\\n\\nheroes.append("Luna")\\nprint("After append:", heroes)\\n\\nheroes.insert(1, "Rex")\\nprint("After insert at 1:", heroes)\\n\\nremoved = heroes.pop(2)\\nprint(f"Popped: {removed}, List: {heroes}")\\n\\nheroes.sort()\\nprint("Sorted:", heroes)\\n\\nheroes.reverse()\\nprint("Reversed:", heroes)\\n\\nprint("Index of Luna:", heroes.index("Luna"))\\nprint("Count of Kael:", heroes.count("Kael"))',
      expectedOutput: "Original: ['Kael', 'Aria', 'Zor']\nAfter append: ['Kael', 'Aria', 'Zor', 'Luna']\nAfter insert at 1: ['Kael', 'Rex', 'Aria', 'Zor', 'Luna']\nPopped: Aria, List: ['Kael', 'Rex', 'Zor', 'Luna']\nSorted: ['Kael', 'Luna', 'Rex', 'Zor']\nReversed: ['Zor', 'Rex', 'Luna', 'Kael']\nIndex of Luna: 2\nCount of Kael: 1",
    },
    quiz: [
      {
        id: 'lm_q1',
        question: 'What does my_list.sort() return?',
        options: ['A new sorted list', 'The original list sorted', 'None — it sorts in place', 'The first element'],
        correctIndex: 2,
        explanation: '.sort() modifies the list in place and returns None. If you want a new sorted list without changing the original, use sorted(my_list).',
      },
      {
        id: 'lm_q2',
        question: 'What is the difference between .append([1,2]) and .extend([1,2])?',
        options: ['No difference', 'append adds [1,2] as one item; extend adds 1 and 2 as separate items', 'extend adds [1,2] as one item; append adds separately', 'append throws an error with lists'],
        correctIndex: 1,
        explanation: '.append() adds its argument as a single element: [[1,2]]. .extend() unpacks the iterable and adds each element individually: [1, 2].',
      },
      {
        id: 'lm_q3',
        question: 'What happens when you call .remove("x") and "x" is not in the list?',
        options: ['Nothing happens', 'Returns False', 'Raises ValueError', 'Removes the last item instead'],
        correctIndex: 2,
        explanation: '.remove() raises a ValueError if the item is not found. Always check with "if x in list:" before removing.',
      },
    ],
    relatedConcepts: ['lists', 'hfp-comprehensions', 'loops'],
    learnPath: '/lesson/collections-kingdom/c2',
    trainingPath: '/training/collections-kingdom',
    icon: ListTree,
    bossBattle: {
      name: 'The Queue Master',
      description: 'A deranged librarian who constantly shuffles, inserts, and removes books from a magical shelf. You must use the correct list method for each operation to restore order.',
      mechanic: 'Given a target list state, use the minimum number of list method calls to transform a scrambled list into the correct order.',
    },
    artifacts: [{ name: 'The Sorting Hat', description: 'A hat that can sort any list in O(n log n) time with a single command.', rarity: 'Common' }],
    trainingGround: { exercises: ['append-vs-extend', 'pop-and-remove', 'sort-vs-sorted', 'list-as-stack', 'list-as-queue'] },
  },
  {
    id: 'dict-methods',
    title: 'Dictionary Methods',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    estimatedTime: '15 min read',
    completion: 0,
    overview: 'Dictionaries have methods for accessing, modifying, and iterating through key-value pairs. Key methods include .get(), .keys(), .values(), .items(), .update(), .pop(), .setdefault(), and .clear(). These methods let you safely access data, merge dictionaries, and iterate without errors.',
    whyExists: 'Accessing dictionary keys directly (dict[key]) crashes if the key is missing. Methods like .get() and .setdefault() provide safe alternatives. .items() lets you loop through both keys and values at once. .update() merges dictionaries. These methods are essential for writing robust code.',
    realLifeAnalogy: {
      title: 'A Hotel Front Desk',
      description: '.get() is asking the desk "Is room 404 booked?" and getting a polite "No" instead of an error. .keys() is the room number list. .values() is the guest list. .items() is the full register showing who is in which room. .update() is processing a batch of new reservations.',
    },
    syntax: 'my_dict.get(key, default)     # Safe access\\nmy_dict.keys()                # All keys\\nmy_dict.values()              # All values\\nmy_dict.items()               # All (key, value) pairs\\nmy_dict.update(other_dict)    # Merge another dict\\nmy_dict.pop(key)              # Remove & return value\\nmy_dict.setdefault(key, val)  # Get or set default',
    example: 'player = {"name": "Kael", "hp": 100}\\nprint(player.get("mp", 0))        # 0 (safe, no crash)\\nprint(list(player.keys()))        # ["name", "hp"]\\nplayer.update({"mp": 50, "hp": 90})\\nprint(player)                     # {"name": "Kael", "hp": 90, "mp": 50}',
    bestPractices: [
      'Use .get(key, default) instead of dict[key] when the key might not exist.',
      'Use .items() for looping: for key, value in my_dict.items().',
      'Use .setdefault() to initialize missing keys with a default value.',
      'Use dict unpacking {**d1, **d2} or .update() to merge dictionaries.',
    ],
    mistakes: [
      'Using dict[key] on a missing key — crashes with KeyError. Use .get() instead.',
      'Modifying a dict while iterating over it — iterate over a copy of .keys() instead.',
      'Forgetting that .pop() removes the key — use .get() if you just want the value.',
      'Assuming dictionaries maintain insertion order in Python < 3.7 (they do in 3.7+).',
    ],
    memoryModel: [
      { name: 'player', value: '{"name": "Kael", "hp": 90, "mp": 50}', type: 'dict', note: 'After .update()', accent: '#c8a45e' },
      { name: '.keys()', value: '["name", "hp", "mp"]', type: 'dict_keys', note: 'View of all keys', accent: '#60a5fa' },
      { name: '.values()', value: '["Kael", 90, 50]', type: 'dict_values', note: 'View of all values', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: 'enemy = {"name": "Goblin", "hp": 30, "attack": 5}\\n\\n# Safe access\\nprint("Shield:", enemy.get("shield", "None"))\\n\\n# Loop through all pairs\\nfor key, val in enemy.items():\\n    print(f"  {key}: {val}")\\n\\n# Merge with update\\nenemy.update({"hp": 25, "loot": "gold"})\\nprint("After update:", enemy)\\n\\n# Pop a key\\nloot = enemy.pop("loot")\\nprint(f"Looted: {loot}")\\nprint("Final:", enemy)',
      expectedOutput: "Shield: None\n  name: Goblin\n  hp: 30\n  attack: 5\nAfter update: {'name': 'Goblin', 'hp': 25, 'attack': 5, 'loot': 'gold'}\nLooted: gold\nFinal: {'name': 'Goblin', 'hp': 25, 'attack': 5}",
    },
    quiz: [
      {
        id: 'dm_q1',
        question: 'What does player.get("mp", 0) return if "mp" is not a key?',
        options: ['None', '0', 'KeyError', 'False'],
        correctIndex: 1,
        explanation: '.get(key, default) returns the default value if the key does not exist. Here it returns 0 since "mp" is not in the dictionary.',
      },
      {
        id: 'dm_q2',
        question: 'How do you loop through both keys and values of a dictionary?',
        options: ['for k in dict', 'for k, v in dict.items()', 'for v in dict.values()', 'dict.loop()'],
        correctIndex: 1,
        explanation: '.items() returns (key, value) tuples, so you can unpack them directly in the for loop.',
      },
    ],
    relatedConcepts: ['dictionaries', 'loops', 'hfp-comprehensions'],
    learnPath: '/lesson/collections-kingdom/c5',
    trainingPath: '/training/collections-kingdom',
    icon: BookOpen,
    bossBattle: {
      name: 'The Key Keeper',
      description: 'A guardian of a vast vault who only speaks in key-value pairs. You must use the right dictionary method for each request — one wrong access crashes the vault doors.',
      mechanic: 'Navigate a maze where each door requires a specific dict method call to open safely.',
    },
    artifacts: [{ name: 'The .get() Amulet', description: 'An amulet that always returns a safe default instead of crashing your program.', rarity: 'Uncommon' }],
    trainingGround: { exercises: ['safe-access-with-get', 'loop-with-items', 'merge-with-update', 'pop-and-setdefault', 'nested-dict-access'] },
  },
  {
    id: 'set-tuple-methods',
    title: 'Set & Tuple Methods',
    category: 'Data Structures',
    difficulty: 'Intermediate',
    estimatedTime: '15 min read',
    completion: 0,
    overview: 'Sets and Tuples have specific built-in methods. Sets excel at mathematical operations like .union(), .intersection(), .difference(), and modifying methods like .add() and .discard(). Tuples, being immutable, only have two methods: .count() and .index().',
    whyExists: "When comparing datasets, manually looping to find common items is slow and messy. Set methods do this instantly in C. Tuples don't need modification methods because they cannot be changed, ensuring data safety.",
    realLifeAnalogy: {
      title: 'Venn Diagrams & Sealed Boxes',
      description: "Set methods are Venn diagrams: .intersection() is the overlap, .union() is both circles combined. Tuple methods are just ways to inspect a sealed transparent box: you can count how many red items are inside, or find where the blue item is, but you can't open the box to change anything.",
    },
    syntax: '# Sets\\ns1.add(item)               # Add single item\\ns1.update(s2)              # Add multiple items\\ns1.discard(item)           # Safe remove (no error)\\ns1.remove(item)            # Remove (errors if missing)\\n\\n# Set Math\\ns1.union(s2)  # or s1 | s2\\ns1.intersection(s2)  # or s1 & s2\\ns1.difference(s2)  # or s1 - s2\\n\\n# Tuples\\nt.count(item)              # Count occurrences\\nt.index(item)              # Find index',
    example: 'alice_classes = {"Math", "Art", "Physics"}\\nbob_classes = {"History", "Math", "Biology"}\\n\\n# Both are taking:\\ncommon = alice_classes.intersection(bob_classes)\\nprint(common)  # {"Math"}\\n\\n# Tuples:\\nrgb = (255, 128, 0, 255)\\nprint(rgb.count(255))  # 2',
    bestPractices: [
      "Use .discard() instead of .remove() if you aren't sure the item exists.",
      'Use set operators (| & -) for shorter, cleaner math code when comparing two sets.',
      'To deduplicate a list, just convert it to a set: unique_items = list(set(my_list)).',
    ],
    mistakes: [
      'Trying to use .append() on a tuple or set. Sets use .add(), tuples cannot be changed.',
      'Using .remove() on a set without checking if the item exists (raises KeyError).',
      'Thinking tuple methods can change the tuple. They only RETURN information.',
    ],
    memoryModel: [
      { name: 'alice', value: "{'Math', 'Art'}", type: 'set', note: 'Unordered elements', accent: '#f87171' },
      { name: 'bob', value: "{'Math', 'History'}", type: 'set', note: 'Unordered elements', accent: '#60a5fa' },
      { name: 'alice & bob', value: "{'Math'}", type: 'set', note: 'Intersection result', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Set operations\\nfire_mages = {"Kael", "Aria", "Zor"}\\nice_mages = {"Luna", "Kael", "Rex"}\\n\\nprint(f"Dual Mages: {fire_mages & ice_mages}")\\nprint(f"All Mages: {fire_mages | ice_mages}")\\nprint(f"Only Fire: {fire_mages - ice_mages}")\\n\\n# Safe removal\\nfire_mages.discard("Zor")\\nfire_mages.discard("Nobody") # No error!\\nprint(f"Fire after discard: {fire_mages}")',
      expectedOutput: "Dual Mages: {'Kael'}\nAll Mages: {'Rex', 'Kael', 'Luna', 'Zor', 'Aria'}\nOnly Fire: {'Zor', 'Aria'}\nFire after discard: {'Kael', 'Aria'}",
    },
    quiz: [
      {
        id: 'stm_q1',
        question: 'What is the difference between set.remove() and set.discard()?',
        options: ['There is no difference', '.discard() removes multiple items, .remove() removes one', '.remove() throws an error if the item is missing, .discard() does nothing', '.discard() only works on numbers'],
        correctIndex: 2,
        explanation: 'If the item is not in the set, .remove() raises a KeyError, while .discard() quietly does nothing. Use discard for safe removal.',
      },
      {
        id: 'stm_q2',
        question: 'Which method can you call on a tuple to add an item?',
        options: ['.add()', '.append()', '.insert()', 'None. Tuples are immutable.'],
        correctIndex: 3,
        explanation: 'Tuples are immutable (unchangeable). Once created, you cannot add, remove, or modify elements. Their only methods are .count() and .index().',
      },
    ],
    relatedConcepts: ['sets-tuples', 'lists'],
    learnPath: '/lesson/collections-kingdom/c6',
    trainingPath: '/training/collections-kingdom',
    icon: Hash,
  },
  {
    id: 'string-formatting',
    title: 'String Formatting & f-Strings',
    category: 'Basics',
    difficulty: 'Beginner',
    estimatedTime: '10 min read',
    completion: 0,
    overview: 'Python offers multiple ways to embed variables inside strings: f-strings (f"Hello {name}"), .format(), and %-formatting. f-Strings (introduced in Python 3.6) are the modern, fastest, and most readable approach. They let you embed any Python expression directly inside curly braces.',
    whyExists: 'String concatenation with + gets messy fast: "Hello, " + name + "! You are " + str(age) + " years old." is unreadable. f-Strings solve this elegantly: f"Hello, {name}! You are {age} years old." — clean, fast, and powerful.',
    realLifeAnalogy: {
      title: 'Mad Libs Game',
      description: 'f-Strings are like Mad Libs — you write a template with blank slots {}, and Python fills them in with your variables. The template stays readable, and the blanks get dynamically filled at runtime.',
    },
    syntax: 'f"Hello, {name}!"              # Variable\\nf"Total: {price:.2f}"           # 2 decimal places\\nf"Score: {score:>10}"           # Right-aligned, width 10\\nf"{items!r}"                    # repr() form\\nf"Result: {2 + 3}"              # Expression inside',
    example: 'name = "Kael"\\nlevel = 7\\nhp = 85.5\\nprint(f"⚔️ {name} | Level {level} | HP: {hp:.1f}")\\nprint("=" * 30)\\nprint(f"Next level in {100 - hp:.1f} HP")',
    bestPractices: [
      'Use f-strings for all new code — they are the fastest and most readable option.',
      'Use :.2f for currency/decimal formatting, :, for thousand separators.',
      'Use :>10, :<10, :^10 for right, left, center alignment.',
      'You can put any expression inside {} — even function calls and ternaries.',
    ],
    mistakes: [
      'Forgetting the f prefix — "Hello {name}" prints literally without the f.',
      'Using f-strings in Python < 3.6 — they are not supported.',
      'Trying to use backslashes inside f-string expressions — use a variable instead.',
    ],
    memoryModel: [
      { name: 'template', value: 'f"Level {level}"', type: 'f-string', note: 'Evaluated at runtime', accent: '#fbbf24' },
      { name: 'result', value: '"Level 7"', type: 'str', note: 'Final interpolated string', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: 'hero = "Aria"\\nhp = 92.567\\ngold = 15430\\n\\nprint(f"Hero: {hero}")\\nprint(f"HP: {hp:.1f}")\\nprint(f"Gold: {gold:,}")\\n\\nstatus = "Healthy" if hp > 50 else "Critical"\\nprint(f"Status: {status}")\\nprint(f"Power Level: {hp * 2:.0f}")',
      expectedOutput: "Hero: Aria\nHP: 92.6\nGold: 15,430\nStatus: Healthy\nPower Level: 185",
    },
    quiz: [
      {
        id: 'sf_q1',
        question: 'What does f"{price:.2f}" do when price = 9.5?',
        options: ['"9.5"', '"9.50"', '"09.50"', 'Error'],
        correctIndex: 1,
        explanation: ':.2f formats the number as a float with exactly 2 decimal places, so 9.5 becomes "9.50".',
      },
      {
        id: 'sf_q2',
        question: 'What happens if you write "Hello {name}" without the f prefix?',
        options: ['It works normally', 'It prints the literal text "Hello {name}"', 'It throws a SyntaxError', 'It prints "Hello None"'],
        correctIndex: 1,
        explanation: 'Without the f prefix, Python treats it as a regular string and {name} is printed literally, not replaced by the variable.',
      },
    ],
    relatedConcepts: ['variables', 'data-types', 'string-methods'],
    learnPath: '/lesson/data-types-valley/d3',
    trainingPath: '/training/data-types-valley',
    icon: Type,
  },
  {
    id: 'lambda-map-filter',
    title: 'Lambda, Map & Filter',
    category: 'Structure',
    difficulty: 'Intermediate',
    estimatedTime: '12 min read',
    completion: 0,
    overview: 'Lambda creates small anonymous (nameless) functions in one line. Map applies a function to every item in a list. Filter selects items that pass a test. Together, they enable functional-style data processing without writing explicit loops.',
    whyExists: 'Sometimes you need a tiny function just once — like a sort key or a quick transformation. Writing a full def for it is overkill. Lambda + map/filter let you express "transform every item" or "keep items where..." in a single, readable line.',
    realLifeAnalogy: {
      title: 'Assembly Line Workers',
      description: 'map() is an assembly line where each worker applies the same operation to every item. filter() is quality control — it inspects each item and only lets the good ones pass. lambda is a temporary worker you hire for just one task.',
    },
    syntax: '# Lambda\\nsquare = lambda x: x ** 2\\n\\n# Map — apply function to all items\\nresult = list(map(lambda x: x * 2, [1, 2, 3]))\\n\\n# Filter — keep items where function returns True\\nevens = list(filter(lambda x: x % 2 == 0, [1, 2, 3, 4]))',
    example: 'names = ["kael", "ARIA", "Zor"]\\ntitled = list(map(lambda n: n.title(), names))\\nprint(titled)  # ["Kael", "Aria", "Zor"]\\n\\nscores = [45, 82, 91, 33, 78]\\npassed = list(filter(lambda s: s >= 60, scores))\\nprint(passed)  # [82, 91, 78]',
    bestPractices: [
      'Use lambda only for simple one-line operations — use def for complex logic.',
      'Prefer list comprehensions over map/filter for readability in most cases.',
      'Remember that map() and filter() return iterators — wrap with list() to see results.',
      'Lambda functions can take multiple arguments: lambda x, y: x + y.',
    ],
    mistakes: [
      'Putting statements (print, return, if/else blocks) in a lambda — only expressions allowed.',
      'Forgetting to wrap map()/filter() in list() — printing the raw iterator shows an object address.',
      'Making lambda too complex — if it needs multiple lines, use a regular function.',
    ],
    memoryModel: [
      { name: 'square', value: '<lambda>', type: 'function', note: 'Anonymous function: x => x²', accent: '#a78bfa' },
      { name: 'map()', value: '<map iterator>', type: 'iterator', note: 'Lazily transforms each item', accent: '#fbbf24' },
      { name: 'result', value: '[2, 4, 6]', type: 'list', note: 'Materialized with list()', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Map: double every number\\nnums = [1, 2, 3, 4, 5]\\ndoubled = list(map(lambda x: x * 2, nums))\\nprint("Doubled:", doubled)\\n\\n# Filter: keep only even\\nevens = list(filter(lambda x: x % 2 == 0, nums))\\nprint("Evens:", evens)\\n\\n# Sort by custom key\\nheroes = [("Kael", 7), ("Aria", 12), ("Zor", 3)]\\nheroes.sort(key=lambda h: h[1])\\nprint("By level:", heroes)',
      expectedOutput: "Doubled: [2, 4, 6, 8, 10]\nEvens: [2, 4]\nBy level: [('Zor', 3), ('Kael', 7), ('Aria', 12)]",
    },
    quiz: [
      {
        id: 'lmf_q1',
        question: 'What does filter(lambda x: x > 5, [3, 7, 2, 8]) return after list()?',
        options: ['[3, 2]', '[7, 8]', '[True, True]', '[3, 7, 2, 8]'],
        correctIndex: 1,
        explanation: 'filter() keeps only items where the function returns True. 7 > 5 and 8 > 5 are True, so [7, 8] is returned.',
      },
    ],
    relatedConcepts: ['functions', 'hfp-comprehensions', 'lists'],
    learnPath: '/lesson/functions-mountain/f3',
    trainingPath: '/training/functions-mountain',
    icon: Terminal,
  },
  {
    id: 'hfp-mobile-dev',
    title: 'APIs & Mobile Development',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '20 min read',
    completion: 0,
    overview: 'Python can target mobile platforms using frameworks like Kivy or by creating JSON APIs that mobile apps consume. This chapter explores how your Flask web app can serve data to Android devices, adapting the user interface for smaller screens with responsive templates.',
    whyExists: 'Mobile is where most users are. By learning to build APIs and responsive interfaces, your Python backend can serve any client — browser, phone, or tablet. Understanding mobile constraints (small screens, touch input, limited bandwidth) makes you a better developer.',
    realLifeAnalogy: {
      title: 'A Food Truck vs. a Restaurant',
      description: 'A full website is like a restaurant with a big kitchen and dining room. A mobile app is like a food truck — same great food (data), but adapted for a smaller, more portable format. The kitchen (backend) stays the same; only the serving style changes.',
    },
    syntax: '# Detecting mobile in Flask\\nfrom flask import request\\n\\n@app.route("/")\\ndef home():\\n    if "Mobile" in request.headers.get("User-Agent", ""):\\n        return render_template("mobile.html")\\n    return render_template("desktop.html")',
    example: '# Serving JSON for mobile clients\\nfrom flask import jsonify\\n\\n@app.route("/api/player")\\ndef player_api():\\n    return jsonify({"name": "Hero", "level": 5})',
    bestPractices: [
      'Build APIs that return JSON — mobile apps consume data, not HTML.',
      'Test on real devices or emulators, not just desktop browsers.',
      'Keep payloads small — mobile networks can be slow.',
      'Use responsive design or separate templates for mobile views.',
    ],
    mistakes: [
      'Assuming mobile screens are just smaller desktop screens — they have different UX patterns.',
      'Sending desktop-sized images to mobile devices — compress and resize.',
      'Not handling offline states — mobile connections are unreliable.',
    ],
    memoryModel: [
      { name: 'request', value: 'GET /api/player', type: 'Request', note: 'From mobile client', accent: '#fbbf24' },
      { name: 'response', value: '{"name": "Hero"}', type: 'JSON', note: 'Lightweight data payload', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: 'import json\\n\\n# Simulating a mobile API response\\ndef get_player_data(compact=False):\\n    player = {"name": "Hero", "level": 5, "xp": 1200, "inventory": ["sword", "shield"]}\\n    if compact:\\n        return json.dumps({"n": player["name"], "l": player["level"]})\\n    return json.dumps(player, indent=2)\\n\\nprint("Desktop:", get_player_data())\\nprint("Mobile:", get_player_data(compact=True))',
      expectedOutput: 'Desktop: {\n  "name": "Hero",\n  "level": 5,\n  "xp": 1200,\n  "inventory": [\n    "sword",\n    "shield"\n  ]\n}\nMobile: {"n": "Hero", "l": 5}',
    },
    quiz: [
      {
        id: 'hfp_mob_q1',
        question: 'Why should mobile APIs return JSON instead of HTML?',
        options: ['JSON is more secure', 'Mobile apps parse JSON directly; they render their own UI', 'HTML is not supported on phones', 'JSON loads faster than HTML'],
        correctIndex: 1,
        explanation: 'Mobile apps have their own UI frameworks. They need raw data (JSON) to populate their native views, not pre-rendered HTML.',
      },
    ],
    relatedConcepts: ['hfp-web-development', 'dictionaries', 'hfp-custom-objects'],
    learnPath: '/lesson/mobile-outpost/mob1',
    trainingPath: '/training/mobile-outpost',
    icon: Terminal,
    bossBattle: {
      name: 'The Bandwidth Leech',
      description: 'A parasitic creature that devours network bandwidth, making every API call painfully slow. You must optimize your payloads and implement efficient data transfer to starve it.',
      mechanic: 'Refactor bloated API responses to minimize payload size while preserving all necessary data.',
    },
    artifacts: [{ name: 'The Compact Rune', description: 'A rune that compresses any data payload to its minimal form.', rarity: 'Uncommon' }],
    trainingGround: { exercises: ['json-api-design', 'responsive-templates', 'mobile-user-agent', 'payload-optimization'] },
  },
  {
    id: 'hfp-manage-data',
    title: 'Input Validation & Security',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '25 min read',
    completion: 0,
    overview: 'Real web apps need to collect, validate, and store user input from HTML forms. This involves handling POST requests in Flask, sanitizing data to prevent security issues, and persisting it to a database. Python\'s string methods, regular expressions, and database libraries make this manageable.',
    whyExists: 'Every useful app takes input: login forms, search bars, settings pages. Unvalidated input causes crashes, security holes, and data corruption. Learning to handle input properly is the difference between a toy project and a production application.',
    realLifeAnalogy: {
      title: 'Airport Security Checkpoint',
      description: 'User input is like passengers at an airport. You cannot let everyone through unchecked. Security (validation) examines each passenger (input), rejects prohibited items (malicious data), and only lets clean passengers through to the gate (your database).',
    },
    syntax: '# Handling form data in Flask\\n@app.route("/submit", methods=["POST"])\\ndef submit():\\n    name = request.form.get("name", "").strip()\\n    if not name:\\n        return "Name is required!", 400\\n    return f"Hello, {name}!"',
    example: 'from flask import request\\n\\n@app.route("/search")\\ndef search():\\n    query = request.args.get("q", "")\\n    results = [item for item in data if query.lower() in item.lower()]\\n    return render_template("results.html", results=results)',
    bestPractices: [
      'Always validate and sanitize user input — never trust it blindly.',
      'Use .strip() to remove whitespace, .lower() for case-insensitive matching.',
      'Set reasonable length limits on text inputs to prevent abuse.',
      'Use parameterized queries for database operations to prevent SQL injection.',
    ],
    mistakes: [
      'Directly embedding user input into SQL queries — this causes SQL injection vulnerabilities.',
      'Not checking for empty or missing form fields.',
      'Trusting client-side validation alone — always validate on the server too.',
      'Forgetting to set methods=["POST"] on routes that handle form submissions.',
    ],
    memoryModel: [
      { name: 'request.form', value: '{"name": "  Hero  "}', type: 'ImmutableDict', note: 'Raw form data from POST', accent: '#fbbf24' },
      { name: 'name', value: '"Hero"', type: 'str', note: 'Cleaned with .strip()', accent: '#34d399' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Simulating form input validation\\ndef validate_registration(name, email, age):\\n    errors = []\\n    if not name or len(name.strip()) < 2:\\n        errors.append("Name must be at least 2 characters")\\n    if "@" not in email:\\n        errors.append("Invalid email address")\\n    try:\\n        age = int(age)\\n        if age < 13 or age > 120:\\n            errors.append("Age must be between 13 and 120")\\n    except ValueError:\\n        errors.append("Age must be a number")\\n    return errors if errors else ["Registration successful!"]\\n\\nprint(validate_registration("Al", "al@test.com", "25"))\\nprint(validate_registration("", "bad-email", "abc"))',
      expectedOutput: "[\'Registration successful!\']\n[\'Name must be at least 2 characters\', \'Invalid email address\', \'Age must be a number\']",
    },
    quiz: [
      {
        id: 'hfp_input_q1',
        question: 'Why should you never embed user input directly into SQL queries?',
        options: ['It makes queries slow', 'It causes SQL injection attacks', 'Python does not support SQL', 'It corrupts the database schema'],
        correctIndex: 1,
        explanation: 'SQL injection allows attackers to execute arbitrary SQL commands by crafting malicious input. Always use parameterized queries.',
      },
    ],
    relatedConcepts: ['hfp-web-development', 'hfp-files-exceptions', 'input-output'],
    learnPath: '/lesson/data-fortress/df1',
    trainingPath: '/training/data-fortress',
    icon: Database,
    bossBattle: {
      name: 'The Injection Serpent',
      description: 'A cunning serpent that slithers through your input fields, injecting malicious SQL commands. You must build impenetrable input validation to seal every entry point.',
      mechanic: 'Fix vulnerable code that is susceptible to SQL injection and XSS attacks by implementing proper sanitization.',
    },
    artifacts: [{ name: 'The Sanitizer Gauntlet', description: 'A gauntlet that purifies any input, stripping away malicious characters.', rarity: 'Rare' }],
    trainingGround: { exercises: ['form-validation', 'sql-parameterization', 'input-sanitization', 'error-messages'] },
  },
  {
    id: 'hfp-scaling-webapp',
    title: 'Databases & Deployment',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '25 min read',
    completion: 0,
    overview: 'Taking a Flask app from development to production involves using a real database (like MySQL or PostgreSQL instead of flat files), deploying to cloud hosting, handling concurrent users, and implementing sessions and authentication. This chapter bridges the gap between a toy project and a real-world application.',
    whyExists: 'A locally running Flask app serves one user at a time. Real apps serve thousands simultaneously. You need databases for reliable storage, session management for user state, and cloud deployment for accessibility. Scaling is what makes software professional.',
    realLifeAnalogy: {
      title: 'From a Lemonade Stand to a Chain Store',
      description: 'Your local Flask dev server is a lemonade stand — great for testing, but serves one customer at a time. Scaling means opening a proper store (database), hiring staff (workers/threads), and franchising to multiple locations (cloud deployment).',
    },
    syntax: '# Using a database with Flask\\nimport mysql.connector\\n\\nconn = mysql.connector.connect(\\n    host="localhost", database="myapp",\\n    user="root", password="secret"\\n)\\ncursor = conn.cursor()\\ncursor.execute("SELECT * FROM users")',
    example: '# Session management\\nfrom flask import session\\n\\n@app.route("/login", methods=["POST"])\\ndef login():\\n    session["user"] = request.form["username"]\\n    return redirect("/dashboard")',
    bestPractices: [
      'Use a proper database (PostgreSQL, MySQL) instead of pickle/flat files for production.',
      'Never store passwords in plain text — use hashing (bcrypt).',
      'Use environment variables for secrets (DB passwords, API keys).',
      'Deploy behind a production WSGI server (Gunicorn) not Flask\'s built-in server.',
    ],
    mistakes: [
      'Using Flask\'s development server in production — it is single-threaded and insecure.',
      'Storing secrets in your source code instead of environment variables.',
      'Not setting up database connection pooling, leading to "too many connections" errors.',
      'Forgetting to set a secret_key for Flask sessions.',
    ],
    memoryModel: [
      { name: 'conn', value: '<DB Connection>', type: 'Connection', note: 'Link to database server', accent: '#60a5fa' },
      { name: 'session', value: '{"user": "Hero"}', type: 'SecureCookie', note: 'Encrypted user state', accent: '#a78bfa' },
    ],
    interactiveCode: {
      setup: '',
      code: '# Simulating database operations\\nclass SimpleDB:\\n    def __init__(self):\\n        self.tables = {}\\n    def create_table(self, name):\\n        self.tables[name] = []\\n    def insert(self, table, record):\\n        self.tables[table].append(record)\\n    def select(self, table):\\n        return self.tables.get(table, [])\\n\\ndb = SimpleDB()\\ndb.create_table("users")\\ndb.insert("users", {"name": "Kael", "level": 10})\\ndb.insert("users", {"name": "Aria", "level": 7})\\nprint("All users:", db.select("users"))',
      expectedOutput: "All users: [{'name': 'Kael', 'level': 10}, {'name': 'Aria', 'level': 7}]",
    },
    quiz: [
      {
        id: 'hfp_scale_q1',
        question: 'Why should you NOT use Flask\'s built-in development server in production?',
        options: ['It costs money', 'It is single-threaded and not designed for security or performance', 'It does not support Python 3', 'It cannot serve HTML'],
        correctIndex: 1,
        explanation: 'Flask\'s dev server handles one request at a time and lacks security hardening. Use Gunicorn, uWSGI, or similar for production.',
      },
    ],
    relatedConcepts: ['hfp-web-development', 'hfp-manage-data', 'hfp-persistence'],
    learnPath: '/lesson/cloud-spire/cs1',
    trainingPath: '/training/cloud-spire',
    icon: GitBranch,
    bossBattle: {
      name: 'The Overload Titan',
      description: 'A colossal titan that floods your server with thousands of simultaneous requests. You must scale your architecture, implement connection pooling, and optimize queries to withstand the onslaught.',
      mechanic: 'Identify and fix performance bottlenecks in a Flask app handling simulated concurrent traffic.',
    },
    artifacts: [{ name: 'The Gunicorn Horn', description: 'A war horn that summons multiple worker processes to handle any volume of requests.', rarity: 'Epic' }],
    trainingGround: { exercises: ['database-setup', 'session-management', 'environment-variables', 'deployment-checklist'] },
  },
  {
    id: 'hfp-data-wrangling',
    title: 'Data Wrangling & Collections',
    category: 'Data Structures',
    difficulty: 'Advanced',
    estimatedTime: '22 min read',
    completion: 0,
    overview: 'Data wrangling means cleaning, transforming, and restructuring messy real-world data into a usable format. Python excels at this with built-in string methods, list comprehensions, the csv module, and libraries like collections.Counter. Real data is never clean — it has missing values, inconsistent formats, and duplicates.',
    whyExists: 'In the real world, data arrives messy: CSV files with missing columns, log files with inconsistent timestamps, databases with duplicate entries. Before you can analyze or display data, you must wrangle it into shape. This is 80% of a data scientist\'s job.',
    realLifeAnalogy: {
      title: 'Organizing a Cluttered Garage',
      description: 'You have a garage full of random tools, old boxes, and junk all mixed together. Data wrangling is the process of sorting everything into labeled bins, throwing away the garbage, and organizing what remains so you can find anything instantly.',
    },
    syntax: '# Common data wrangling patterns\\nfrom collections import Counter\\n\\n# Clean and count\\nwords = [w.strip().lower() for w in raw_data.split(",")]\\ncounts = Counter(words)',
    example: 'import csv\\nfrom collections import Counter\\n\\ndata = "apple,banana,Apple,BANANA,cherry,apple"\\ncleaned = [item.strip().lower() for item in data.split(",")]\\nprint(Counter(cleaned))',
    bestPractices: [
      'Always clean data before processing — strip whitespace, normalize case.',
      'Use Counter from collections for frequency analysis.',
      'Handle missing values explicitly rather than letting them cause silent bugs.',
      'Process data in pipelines: raw → clean → transform → output.',
    ],
    mistakes: [
      'Assuming data is clean — always inspect it first.',
      'Not handling encoding issues when reading files from different sources.',
      'Modifying data in-place while iterating over it — create new collections instead.',
      'Ignoring edge cases like empty strings, None values, or unexpected types.',
    ],
    memoryModel: [
      { name: 'raw_data', value: '"apple,Banana, APPLE"', type: 'str', note: 'Messy raw input', accent: '#f87171' },
      { name: 'cleaned', value: '["apple", "banana", "apple"]', type: 'list', note: 'Normalized', accent: '#34d399' },
      { name: 'counts', value: 'Counter({"apple": 2, "banana": 1})', type: 'Counter', note: 'Frequency analysis', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'from collections import Counter\\n\\n# Simulating messy log data\\nlog = "ERROR,warning,Error,INFO,error,WARNING,info,ERROR"\\n\\n# Step 1: Clean\\ncleaned = [entry.strip().upper() for entry in log.split(",")]\\nprint("Cleaned:", cleaned)\\n\\n# Step 2: Count\\ncounts = Counter(cleaned)\\nprint("Counts:", dict(counts))\\n\\n# Step 3: Most common\\nprint("Most common:", counts.most_common(1)[0])',
      expectedOutput: "Cleaned: ['ERROR', 'WARNING', 'ERROR', 'INFO', 'ERROR', 'WARNING', 'INFO', 'ERROR']\nCounts: {'ERROR': 4, 'WARNING': 2, 'INFO': 2}\nMost common: ('ERROR', 4)",
    },
    quiz: [
      {
        id: 'hfp_dw_q1',
        question: 'What does Counter from collections do?',
        options: ['Counts to a number', 'Counts the frequency of each element in an iterable', 'Creates a countdown timer', 'Counts lines in a file'],
        correctIndex: 1,
        explanation: 'Counter takes an iterable and returns a dictionary-like object mapping each element to the number of times it appears.',
      },
    ],
    relatedConcepts: ['hfp-comprehensions', 'lists', 'dictionaries'],
    learnPath: '/lesson/data-mines/dm1',
    trainingPath: '/training/data-mines',
    icon: RotateCw,
    bossBattle: {
      name: 'The Entropy Dragon',
      description: 'A chaos dragon that breathes torrents of messy, inconsistent data. You must wrangle its output into clean, structured formats using comprehensions, Counter, and string methods.',
      mechanic: 'Clean and analyze a massive dataset with missing values, duplicates, and inconsistent formatting.',
    },
    artifacts: [{ name: 'The Counter Compass', description: 'A magical compass that instantly reveals the frequency of any element in any collection.', rarity: 'Epic' }],
    trainingGround: { exercises: ['clean-csv-data', 'counter-analysis', 'deduplication', 'pipeline-processing'] },
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
  {
    id: 'iterable-vs-iterator',
    title: 'Iterable vs Iterator',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '6 min read',
    completion: 0,
    overview: 'An Iterable is a collection of items that you can loop over. An Iterator is the helper agent that actually does the work of fetching the items one by one.',
    whyExists: 'Iterables represent the data collection itself, while Iterators represent the execution state and cursor position, allowing memory-safe traversal without copying data.',
    realLifeAnalogy: {
      title: 'The Book and the Reader',
      description: 'An Iterable is like a physical Book (the pages exist, but they don\'t turn themselves). An Iterator is like a Reader (the person turning page-by-page, holding their current spot with a finger).',
    },
    syntax: 'it = iter(iterable)\nnext(it)',
    example: 'nums = [10, 20]\nit = iter(nums)\nprint(next(it))\nprint(next(it))',
    bestPractices: [
      'Understand that iterators are stateful and exhaustible.',
      'Check interfaces using collections.abc.Iterable and collections.abc.Iterator.',
    ],
    mistakes: [
      'Attempting to reuse an exhausted iterator.',
      'Assuming iterators support indexing or len().',
    ],
    memoryModel: [
      { name: 'nums', value: '[10, 20]', type: 'list', note: 'Iterable list', accent: '#34d399' },
      { name: 'it', value: '<list_iterator>', type: 'list_iterator', note: 'Stateful cursor', accent: '#10b981' },
    ],
    interactiveCode: {
      setup: '',
      code: 'nums = [5, 10]\nit = iter(nums)\nprint(next(it))\nprint(next(it))\ntry:\n    next(it)\nexcept StopIteration:\n    print("Exhausted!")',
      expectedOutput: '5\n10\nExhausted!',
    },
    quiz: [
      {
        id: 'it_q1',
        question: 'What happens when an iterator is completely consumed?',
        options: [
          'It resets to the beginning.',
          'It raises StopIteration on next calls.',
          'It deletes the original collection.',
          'It returns None infinitely.',
        ],
        correctIndex: 1,
        explanation: 'Once depleted, an iterator raises StopIteration for all subsequent next() calls and cannot be reset.',
      },
      {
        id: 'it_q2',
        question: 'Which built-in Python function returns an iterator from an iterable?',
        options: [
          'next()',
          'iter()',
          'get()',
          'iterator()',
        ],
        correctIndex: 1,
        explanation: 'The iter() function is used to obtain an iterator from any iterable object (like a list, tuple, or dict).',
      },
      {
        id: 'it_q3',
        question: 'Does an iterator object store all its elements in memory simultaneously?',
        options: [
          'Yes, it is a copy of the list.',
          'No, it only retrieves elements one-by-step on demand.',
          'Only if it is a list iterator.',
          'Yes, unless it is infinite.',
        ],
        correctIndex: 1,
        explanation: 'No, iterators do not load elements into memory at once; they fetch them dynamically when next() is called, saving memory.',
      },
    ],
    relatedConcepts: ['lists', 'sets-tuples'],
    learnPath: '/lesson/iterator-isles/i1',
    trainingPath: '/training/iterator-isles',
    icon: Repeat,
  },
  {
    id: 'iteration-protocol',
    title: 'The Iteration Protocol',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '7 min read',
    completion: 0,
    overview: 'The Iteration Protocol is the underlying engine for Python loops, relying on __iter__() and __next__() special methods.',
    whyExists: 'It unifies all sequence traversal, allowing custom classes, DB queries, and file streams to be looped over using the identical for-in syntax.',
    realLifeAnalogy: {
      title: 'Vending Machine',
      description: 'Inserting a coin activates the machine (iter()). Pressing the button dispenses one item (next()). When empty, the machine shows a SOLD OUT light (StopIteration).',
    },
    syntax: 'class MyIterator:\n    def __iter__(self): return self\n    def __next__(self): ...',
    example: 'class Countdown:\n    def __init__(self, start):\n        self.n = start\n    def __iter__(self):\n        return self\n    def __next__(self):\n        if self.n <= 0: raise StopIteration\n        self.n -= 1\n        return self.n + 1\n\nfor x in Countdown(3): print(x)',
    bestPractices: [
      'Iterators should always return self in their __iter__ method.',
      'Ensure custom iterators raise StopIteration to prevent infinite loops.',
    ],
    mistakes: [
      'Forgetting to implement __iter__ in custom iterator classes.',
      'Forgetting to raise StopIteration when the collection is exhausted.',
    ],
    memoryModel: [
      { name: 'countdown', value: 'Countdown(3)', type: 'Countdown', note: 'State: n=3', accent: '#60a5fa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'class Countdown:\n    def __init__(self, start):\n        self.n = start\n    def __iter__(self): return self\n    def __next__(self):\n        if self.n <= 0: raise StopIteration\n        self.n -= 1\n        return self.n + 1\nprint(list(Countdown(3)))',
      expectedOutput: '[3, 2, 1]',
    },
    quiz: [
      {
        id: 'proto_q1',
        question: 'Which method makes an object an Iterator in Python?',
        options: [
          '__getitem__',
          '__len__',
          '__next__',
          '__contains__',
        ],
        correctIndex: 2,
        explanation: 'Implementing __next__ (alongside __iter__) defines the Iterator interface in Python.',
      },
      {
        id: 'proto_q2',
        question: 'What must a custom iterator\'s __iter__() method return?',
        options: [
          'A list of values',
          'A new instance of the class',
          'The iterator object itself (usually self)',
          'The first element of the sequence',
        ],
        correctIndex: 2,
        explanation: 'To comply with the iteration protocol, __iter__() must return the iterator itself (usually self) so it can be looped over directly.',
      },
      {
        id: 'proto_q3',
        question: 'What exception signals to a loop that the iterator has finished yielding elements?',
        options: [
          'StopIteration',
          'IndexError',
          'EOFError',
          'KeyError',
        ],
        correctIndex: 0,
        explanation: 'Python utilizes the StopIteration exception internally to detect sequence exhaustion and end for-in loops.',
      },
    ],
    relatedConcepts: ['iterable-vs-iterator'],
    learnPath: '/lesson/iterator-isles/i2',
    trainingPath: '/training/iterator-isles',
    icon: Repeat,
  },
  {
    id: 'generators',
    title: 'Generators & Yield',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '8 min read',
    completion: 0,
    overview: 'Generators are simple functions that return iterators using the yield statement, preserving their execution stack frames between next() calls.',
    whyExists: 'They let you write stateful traversals without writing custom iterator classes, saving memory by executing lazily on-the-fly.',
    realLifeAnalogy: {
      title: 'Video Game Checkpoint',
      description: 'Using return is like restarting a game from the main menu. Using yield is like hitting a checkpoint: the game saves exactly where you stand, so you can resume from that spot later.',
    },
    syntax: 'def my_generator():\n    yield value',
    example: 'def counter():\n    yield 1\n    yield 2\n\ng = counter()\nprint(next(g))\nprint(next(g))',
    bestPractices: [
      'Use generators for big datasets to maintain O(1) space complexity.',
      'Utilize yield from to delegate sub-generator sequences.',
    ],
    mistakes: [
      'Calling the generator function inside loops instead of iterating the returned object.',
      'Expecting a generator to run its code immediately on function invocation.',
    ],
    memoryModel: [
      { name: 'g', value: '<generator object>', type: 'generator', note: 'Suspended frame state', accent: '#a78bfa' },
    ],
    interactiveCode: {
      setup: '',
      code: 'def count_up():\n    yield "First"\n    yield "Second"\ng = count_up()\nprint(next(g))\nprint(next(g))',
      expectedOutput: 'First\nSecond',
    },
    quiz: [
      {
        id: 'gen_q1',
        question: 'What is saved when a generator executes a yield statement?',
        options: [
          'Only the yielded value.',
          'The entire local execution stack frame and variable states.',
          'Nothing is saved; it behaves like return.',
          'The execution timer.',
        ],
        correctIndex: 1,
        explanation: 'Unlike return, yield suspends the function frame, freezing the local scope variables and index counter in heap memory.',
      },
      {
        id: 'gen_q2',
        question: 'What happens when a generator function is initially called (invoked)?',
        options: [
          'It runs the code until the first yield.',
          'It raises StopIteration.',
          'It returns a new generator object immediately without executing any code.',
          'It runs the entire function and returns a list.',
        ],
        correctIndex: 2,
        explanation: 'Invoking a generator function doesn\'t run its code. It returns a suspended generator object that only executes when next() is called.',
      },
      {
        id: 'gen_q3',
        question: 'Which keyword delegates part of a generator\'s operations to another generator or iterable?',
        options: [
          'yield from',
          'yield to',
          'yield delegate',
          'yield sub',
        ],
        correctIndex: 0,
        explanation: 'The "yield from" syntax delegates iteration to sub-generators or iterables directly, reducing boilerplate loop code.',
      },
    ],
    relatedConcepts: ['iteration-protocol'],
    learnPath: '/lesson/iterator-isles/i3',
    trainingPath: '/training/iterator-isles',
    icon: Repeat,
  },
  {
    id: 'generator-expressions',
    title: 'Generator Expressions',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '6 min read',
    completion: 0,
    overview: 'Generator Expressions are high-performance inline shortcuts to create generators using round parentheses () instead of square brackets [].',
    whyExists: 'They provide list-comprehension like elegance but evaluate lazily, consuming almost no memory.',
    realLifeAnalogy: {
      title: 'The Bakery vs. The Recipe',
      description: 'A list comprehension is like buying 100 donuts and storing them in your fridge. A generator expression is like having a recipe for 100 donuts—you only make a donut when someone asks to eat one.',
    },
    syntax: 'gen = (x * 2 for x in iterable)',
    example: 'import sys\nlist_comp = [x for x in range(1000)]\ngen_exp = (x for x in range(1000))\nprint(sys.getsizeof(list_comp), "bytes")\nprint(sys.getsizeof(gen_exp), "bytes")',
    bestPractices: [
      'Pass generator expressions directly inside reducers like sum(), any(), all().',
      'Use when memory footprint is a critical constraint.',
    ],
    mistakes: [
      'Thinking a generator expression returns a tuple.',
      'Trying to read indices from a generator expression directly.',
    ],
    memoryModel: [
      { name: 'list_comp', value: '[0, 1, ...]', type: 'list', note: 'Eager memory footprint', accent: '#f87171' },
      { name: 'gen_exp', value: '<generator>', type: 'generator', note: 'Constant 104 bytes', accent: '#10b981' },
    ],
    interactiveCode: {
      setup: '',
      code: 'import sys\nl = [x for x in range(100)]\ng = (x for x in range(100))\nprint("List:", sys.getsizeof(l), "bytes")\nprint("Gen:", sys.getsizeof(g), "bytes")',
      expectedOutput: 'List: 920 bytes\nGen: 104 bytes',
    },
    quiz: [
      {
        id: 'expr_q1',
        question: 'Which syntax creates a Generator Expression?',
        options: [
          '[x for x in range(10)]',
          '{x for x in range(10)}',
          '(x for x in range(10))',
          '{x: x for x in range(10)}',
        ],
        correctIndex: 2,
        explanation: 'Generator expressions are enclosed in round parentheses ().',
      },
      {
        id: 'expr_q2',
        question: 'What is the primary memory difference between a list comprehension and a generator expression?',
        options: [
          'None; they consume identical memory.',
          'List comprehensions pre-allocate the entire list, while generator expressions compute items lazily.',
          'Generator expressions pre-allocate elements in a hash map.',
          'List comprehensions run in constant O(1) space.',
        ],
        correctIndex: 1,
        explanation: 'List comprehensions allocate all elements instantly in RAM (O(N) space), whereas generator expressions compute elements lazily (O(1) space).',
      },
      {
        id: 'expr_q3',
        question: 'What size in memory (via sys.getsizeof) does a generator expression typically occupy, regardless of input length?',
        options: [
          '0 bytes',
          'A constant minimal footprint (~104 bytes)',
          'O(N) bytes proportional to the collection size',
          '1 megabyte',
        ],
        correctIndex: 1,
        explanation: 'Because generator expressions only store the generator state machine rather than sequence items, they maintain a tiny, constant memory size.',
      },
    ],
    relatedConcepts: ['generators'],
    learnPath: '/lesson/iterator-isles/i4',
    trainingPath: '/training/iterator-isles',
    icon: Repeat,
  },
  {
    id: 'infinite-streams',
    title: 'Infinite Streams',
    category: 'Advanced',
    difficulty: 'Advanced',
    estimatedTime: '9 min read',
    completion: 0,
    overview: 'Infinite Streams are generators that run mathematically endless loops, generating sequence steps dynamically without consuming memory.',
    whyExists: 'They allow models of infinite streams (like telemetry, server requests, or Fibonacci loops) to be processed cleanly with zero O(N) space risk.',
    realLifeAnalogy: {
      title: 'Water Tap',
      description: 'An infinite stream is like a water tap connected to the ocean. The supply of water is endless, but you only consume what pours into your cup (next()). You don\'t try to store the whole ocean in your bucket!',
    },
    syntax: 'import itertools\nitertools.islice(infinite_generator, limit)',
    example: 'import itertools\ndef counter():\n    n = 1\n    while True:\n        yield n\n        n += 1\n\nfor x in itertools.islice(counter(), 5): print(x)',
    bestPractices: [
      'Always limit infinite streams using itertools.islice() or break statements.',
      'Ensure no eager execution calls (list(), sum()) are made directly on the raw infinite stream.',
    ],
    mistakes: [
      'Executing list(infinite_stream()) which causes Out-of-Memory crashes.',
      'Forgetting that infinite generators never raise StopIteration natively.',
    ],
    memoryModel: [
      { name: 'stream', value: '<generator object>', type: 'generator', note: 'Constant 104 bytes', accent: '#2dd4bf' },
    ],
    interactiveCode: {
      setup: '',
      code: 'import itertools\ndef odd_numbers():\n    n = 1\n    while True:\n        yield n\n        n += 2\nprint(list(itertools.islice(odd_numbers(), 4)))',
      expectedOutput: '[1, 3, 5, 7]',
    },
    quiz: [
      {
        id: 'inf_q1',
        question: 'How do you safely extract the first 10 items from an infinite generator?',
        options: [
          'list(infinite_generator())[:10]',
          'itertools.islice(infinite_generator(), 10)',
          'infinite_generator()[:10]',
          'slice(infinite_generator(), 10)',
        ],
        correctIndex: 1,
        explanation: 'itertools.islice() safely slices elements from an iterator on-demand without loading the whole stream.',
      },
      {
        id: 'inf_q2',
        question: 'What occurs if you attempt to call list() or sum() directly on an infinite generator without limits?',
        options: [
          'It returns a list of infinite length.',
          'It runs forever until the system runs out of memory and crashes.',
          'It automatically slices the first 100 elements.',
          'It raises StopIteration immediately.',
        ],
        correctIndex: 1,
        explanation: 'Since the generator never hits a termination point, calling list() causes an infinite loop that crashes the process from memory exhaustion.',
      },
      {
        id: 'inf_q3',
        question: 'Which module in the Python standard library provides optimized helpers (like count, cycle, repeat) for infinite streams?',
        options: [
          'functools',
          'collections',
          'itertools',
          'sys',
        ],
        correctIndex: 2,
        explanation: 'The itertools module provides highly optimized, low-memory utilities for creating and manipulating infinite generators and iterables.',
      },
    ],
    relatedConcepts: ['generator-expressions'],
    learnPath: '/lesson/iterator-isles/i1',
    trainingPath: '/training/iterator-isles',
    icon: Repeat,
  },
];
