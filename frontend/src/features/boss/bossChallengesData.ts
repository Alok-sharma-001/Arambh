export interface BossAttack {
  name: string;
  effect: string;
  damage: number;
  overlayColor: string;
}

export interface BossChallenge {
  id: string;
  type: 'mcq' | 'fill-blank' | 'predict-output' | 'fix-bug' | 'drag-code';
  question: string;
  code: string;
  options: { letter: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  hint: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dragBlocks?: string[]; // Used for drag-code ordering
  buggyLineIndex?: number; // Used for fix-bug (0-indexed line containing the error)
}

export interface BossData {
  regionId: string;
  name: string;
  level: number;
  element: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
  maxHp: number;
  artifactReward: string;
  lootReward: string[];
  introduction: string;
  taunts: string[];
  victoryLines: string[];
  defeatLines: string[];
  attacks: BossAttack[];
  challenges: BossChallenge[];
}

export const BOSSES_REGISTRY: Record<string, BossData> = {
  'variables-forest': {
    regionId: 'variables-forest',
    name: 'Corrupted Crystal Guardian',
    level: 1,
    element: 'Memory',
    difficulty: 'Easy',
    maxHp: 100,
    artifactReward: 'Forest Ring',
    lootReward: ['Forest Ring', '+500 XP', 'Slayer Badge', 'Variables Shard', '+50 Guild Rep'],
    introduction: 'The ancient guardian of the Variables Crystal stands corrupted. Its memory buffers are failing, causing values to overwrite randomly!',
    taunts: [
      'You forgot to initialize your variables!',
      'Your name labels point to nothingness!',
      'Memory leaks will consume you!',
      'Let us see if you can resolve references under pressure!'
    ],
    victoryLines: [
      'The memory clears... My allocations are stable once more.',
      'Thank you, wizard. The Variables Crystal is safe in your hands.'
    ],
    defeatLines: [
      'Your allocations have collapsed into garbage collection.',
      'A stack overflow in your reasoning.'
    ],
    attacks: [
      { name: 'Undefined Variable Strike', effect: 'Unbound memory references crash into your shields!', damage: 15, overlayColor: 'rgba(239, 68, 68, 0.4)' },
      { name: 'Overwriting Wave', effect: 'The boss updates variable state, resetting your progress!', damage: 20, overlayColor: 'rgba(244, 63, 94, 0.4)' }
    ],
    challenges: [
      {
        id: 'vf-c1',
        type: 'mcq',
        question: 'Which of the following is a valid variable assignment in Python?',
        code: '# Choose the correct syntax',
        options: [
          { letter: 'A', text: '10 = score' },
          { letter: 'B', text: 'score == 10' },
          { letter: 'C', text: 'score = 10' },
          { letter: 'D', text: 'score : 10' }
        ],
        correctAnswer: 'C',
        explanation: 'In Python, variables are assigned by putting the name on the left, the assignment operator `=` in the middle, and the value on the right.',
        hint: 'Equality checking uses `==`, but assignment uses a single `=` operator.',
        difficulty: 'easy'
      },
      {
        id: 'vf-c2',
        type: 'fill-blank',
        question: 'Complete the spell to assign the value 9000 to the variable spell_power.',
        code: 'spell_power = _______',
        options: [
          { letter: 'A', text: '9000' },
          { letter: 'B', text: '"9000"' },
          { letter: 'C', text: 'float(9000)' }
        ],
        correctAnswer: 'A',
        explanation: 'We need to store the integer value 9000 in spell_power without quotes, as quotes would make it a string.',
        hint: 'Look closely at the requested integer value.',
        difficulty: 'easy'
      },
      {
        id: 'vf-c3',
        type: 'predict-output',
        question: 'What is the output of the following sequence?',
        code: 'spell = "Fireball"\nspell = "Ice storm"\nprint(spell)',
        options: [
          { letter: 'A', text: 'Fireball' },
          { letter: 'B', text: 'Ice storm' },
          { letter: 'C', text: 'Fireball Ice storm' },
          { letter: 'D', text: 'Error' }
        ],
        correctAnswer: 'B',
        explanation: 'Variables store one value at a time. The second line reassigns the variable "spell" to "Ice storm", discarding "Fireball".',
        hint: 'Variables hold only the latest assigned value.',
        difficulty: 'medium'
      },
      {
        id: 'vf-c4',
        type: 'fix-bug',
        question: 'Identify the line containing an illegal variable name that breaks Python naming rules.',
        code: 'mana_level = 100\n1st_spell = "Lightning"\nshield_on = True',
        options: [
          { letter: 'A', text: 'Line 1: mana_level = 100' },
          { letter: 'B', text: 'Line 2: 1st_spell = "Lightning"' },
          { letter: 'C', text: 'Line 3: shield_on = True' }
        ],
        correctAnswer: 'B',
        buggyLineIndex: 1,
        explanation: 'Variable names cannot start with a number. `1st_spell` is illegal in Python.',
        hint: 'Look at the character starting each variable name.',
        difficulty: 'medium'
      },
      {
        id: 'vf-c5',
        type: 'drag-code',
        question: 'Arrange the statements in order to double the current player health (hp).',
        code: '# Arrange the lines correctly',
        options: [
          { letter: 'A', text: 'hp = hp * 2' },
          { letter: 'B', text: 'hp = 50' }
        ],
        correctAnswer: 'BA',
        dragBlocks: ['hp = 50', 'hp = hp * 2'],
        explanation: 'You must first initialize hp to 50, and then execute hp = hp * 2 to double it in memory.',
        hint: 'Set the initial value before performing math on it.',
        difficulty: 'hard'
      }
    ]
  },
  'data-types-valley': {
    regionId: 'data-types-valley',
    name: 'The Type Shapeshifter',
    level: 2,
    element: 'Data',
    difficulty: 'Medium',
    maxHp: 100,
    artifactReward: 'Crystal Lens',
    lootReward: ['Crystal Lens', '+600 XP', 'Type Weaver Ring', 'Valleys Shard', '+60 Guild Rep'],
    introduction: 'A swirling mass of raw data fragments floats in front of you. To damage it, you must pierce its shield using matching cast types!',
    taunts: [
      'Strings and integers cannot blend!',
      'You are trying to concatenate incompatibles!',
      'Your type conversions are flawed!',
      'Python is a strongly typed realm. Feel its rejection!'
    ],
    victoryLines: [
      'My elements have crystallized into a cohesive pattern...',
      'You have solved my shifting nature. Reclaim the Lens!'
    ],
    defeatLines: [
      'You collapsed under type conversion issues.',
      'A TypeError has shattered your spells.'
    ],
    attacks: [
      { name: 'TypeError Blast', effect: 'Mismatched datatypes collide, causing an explosion!', damage: 15, overlayColor: 'rgba(59, 130, 246, 0.4)' },
      { name: 'String Compression', effect: 'Giant character chains squeeze the life from your mages!', damage: 20, overlayColor: 'rgba(168, 85, 247, 0.4)' }
    ],
    challenges: [
      {
        id: 'dt-c1',
        type: 'mcq',
        question: 'What is the data type of the expression `5.0` in Python?',
        code: 'type(5.0)',
        options: [
          { letter: 'A', text: 'int' },
          { letter: 'B', text: 'float' },
          { letter: 'C', text: 'str' },
          { letter: 'D', text: 'double' }
        ],
        correctAnswer: 'B',
        explanation: 'Numbers with a decimal point are represented as floats in Python.',
        hint: 'Integers are whole numbers; decimals are floating-point numbers.',
        difficulty: 'easy'
      },
      {
        id: 'dt-c2',
        type: 'fill-blank',
        question: 'Complete the conversion function to turn string "100" into an integer.',
        code: 'power = ____("100")',
        options: [
          { letter: 'A', text: 'int' },
          { letter: 'B', text: 'str' },
          { letter: 'C', text: 'float' }
        ],
        correctAnswer: 'A',
        explanation: 'The `int()` function converts strings containing integer digits into real integer numbers.',
        hint: 'Use the abbreviation for integer.',
        difficulty: 'easy'
      },
      {
        id: 'dt-c3',
        type: 'predict-output',
        question: 'What is the result of the following code?',
        code: 'damage = "10" + "20"\nprint(damage)',
        options: [
          { letter: 'A', text: '30' },
          { letter: 'B', text: '1020' },
          { letter: 'C', text: 'Error' },
          { letter: 'D', text: '10 20' }
        ],
        correctAnswer: 'B',
        explanation: 'Adding two strings together concatenates them instead of performing math, resulting in the joined string "1020".',
        hint: 'Think about string joining vs math addition.',
        difficulty: 'medium'
      },
      {
        id: 'dt-c4',
        type: 'fix-bug',
        question: 'Identify the line that will throw a TypeError in Python.',
        code: 'spell_name = "Fire"\nspell_level = 5\ncast = spell_name + spell_level',
        options: [
          { letter: 'A', text: 'Line 1: spell_name = "Fire"' },
          { letter: 'B', text: 'Line 2: spell_level = 5' },
          { letter: 'C', text: 'Line 3: cast = spell_name + spell_level' }
        ],
        correctAnswer: 'C',
        buggyLineIndex: 2,
        explanation: 'Python cannot implicitly add strings (`str`) and integers (`int`) together. You must wrap `spell_level` in `str()` first.',
        hint: 'Check the datatypes of the variables being added together on Line 3.',
        difficulty: 'medium'
      },
      {
        id: 'dt-c5',
        type: 'drag-code',
        question: 'Arrange the lines to print: "My level is 5"',
        code: '# Put the lines in order',
        options: [
          { letter: 'A', text: 'print("My level is " + lvl_str)' },
          { letter: 'B', text: 'lvl_str = str(5)' }
        ],
        correctAnswer: 'BA',
        dragBlocks: ['lvl_str = str(5)', 'print("My level is " + lvl_str)'],
        explanation: 'Convert the integer 5 to a string first using str(), then concatenate it to the prefix string.',
        hint: 'You cannot add a raw integer to a string directly without conversion.',
        difficulty: 'hard'
      }
    ]
  },
  'loops-desert': {
    regionId: 'loops-desert',
    name: 'The Infinite Serpent',
    level: 3,
    element: 'Iteration',
    difficulty: 'Medium',
    maxHp: 120,
    artifactReward: 'Dune Scroll',
    lootReward: ['Dune Scroll', '+750 XP', 'Loops Ring', 'Desert Compass', '+70 Guild Rep'],
    introduction: 'The sand shifts under your feet as the Infinite Serpent coils. Its wounds regenerate instantly unless hit by rapid, looping attacks!',
    taunts: [
      'Your iterations are finite!',
      'My loops will coil forever around your neck!',
      'A loop with no end is my source of power!',
      'You are trapped in my infinite range!'
    ],
    victoryLines: [
      'My infinite cycle has been broken... The loop terminates.',
      'You navigated the sands. The Dune Scroll is yours.'
    ],
    defeatLines: [
      'You have been crushed by an infinite while loop.',
      'Your program ran out of time.'
    ],
    attacks: [
      { name: 'Infinite Loop Lock', effect: 'The serpent freezes you in a time loop, taking chunks of HP!', damage: 20, overlayColor: 'rgba(245, 158, 11, 0.4)' },
      { name: 'IndexError Bite', effect: 'Out of bounds traversal inflicts heavy damage!', damage: 25, overlayColor: 'rgba(220, 38, 38, 0.4)' }
    ],
    challenges: [
      {
        id: 'ld-c1',
        type: 'mcq',
        question: 'How many times will this loop print the word "Cast"?',
        code: 'for i in range(3):\n    print("Cast")',
        options: [
          { letter: 'A', text: '2 times' },
          { letter: 'B', text: '3 times' },
          { letter: 'C', text: '4 times' },
          { letter: 'D', text: '0 times' }
        ],
        correctAnswer: 'B',
        explanation: '`range(3)` yields values [0, 1, 2], so the loop body executes exactly 3 times.',
        hint: '`range(N)` generates sequence of N elements starting from 0.',
        difficulty: 'easy'
      },
      {
        id: 'ld-c2',
        type: 'fill-blank',
        question: 'Complete the loop to run exactly 5 times using standard range limits.',
        code: 'for i in range(____):',
        options: [
          { letter: 'A', text: '5' },
          { letter: 'B', text: '4' },
          { letter: 'C', text: '6' }
        ],
        correctAnswer: 'A',
        explanation: 'Providing 5 to `range()` creates a sequence of 5 iterations.',
        hint: 'Fill in the direct count of times to execute.',
        difficulty: 'easy'
      },
      {
        id: 'ld-c3',
        type: 'predict-output',
        question: 'What is the final value of mana after the loop terminates?',
        code: 'mana = 0\nfor i in range(1, 4):\n    mana += i\nprint(mana)',
        options: [
          { letter: 'A', text: '3' },
          { letter: 'B', text: '6' },
          { letter: 'C', text: '10' },
          { letter: 'D', text: '4' }
        ],
        correctAnswer: 'B',
        explanation: '`range(1, 4)` generates numbers [1, 2, 3]. Summing them gives 1 + 2 + 3 = 6.',
        hint: 'Remember range(start, end) stops BEFORE the end value.',
        difficulty: 'medium'
      },
      {
        id: 'ld-c4',
        type: 'fix-bug',
        question: 'Identify the line containing an infinite loop that will cause memory crashes.',
        code: 'x = 5\nwhile x > 0:\n    print("Looping")\n    x = x + 1',
        options: [
          { letter: 'A', text: 'Line 1: x = 5' },
          { letter: 'B', text: 'Line 2: while x > 0:' },
          { letter: 'C', text: 'Line 4: x = x + 1' }
        ],
        correctAnswer: 'C',
        buggyLineIndex: 3,
        explanation: 'Adding 1 to x means x starts at 5 and only goes up (6, 7, 8, etc.). Thus, x > 0 will always be True, causing an infinite loop. We should decrement x.',
        hint: 'Look at the direction of change for variable x in relation to the loop condition.',
        difficulty: 'medium'
      },
      {
        id: 'ld-c5',
        type: 'drag-code',
        question: 'Arrange the code to loop through numbers 1 to 10 but stop (break) if it hits 5.',
        code: '# Reorder statements to terminate correctly',
        options: [
          { letter: 'A', text: 'for i in range(1, 11):' },
          { letter: 'B', text: '    if i == 5:' },
          { letter: 'C', text: '        break' }
        ],
        correctAnswer: 'ABC',
        dragBlocks: ['for i in range(1, 11):', '    if i == 5:', '        break'],
        explanation: 'Initiate loop from 1 to 10, then check if i equals 5, and invoke break to exit the loop.',
        hint: 'Indentation levels indicate block nesting structures.',
        difficulty: 'hard'
      }
    ]
  },
  'functions-mountain': {
    regionId: 'functions-mountain',
    name: 'The Forgotten Architect',
    level: 4,
    element: 'Blueprint',
    difficulty: 'Medium',
    maxHp: 130,
    artifactReward: 'Summit Crown',
    lootReward: ['Summit Crown', '+850 XP', 'Architect Sigil', 'Peak Crystal', '+80 Guild Rep'],
    introduction: 'The Golem of the peaks is powered by structural logic. You must invoke reusable blueprints (functions) to disrupt its core architecture!',
    taunts: [
      'Your parameters are mismatched!',
      'You called me without a return address!',
      'Your local variables die within my scope!',
      'A blueprint without definitions cannot build anything!'
    ],
    victoryLines: [
      'Blueprints successfully compiled. Structural integrity restored.',
      'Take the Summit Crown. You are a true architect of logic.'
    ],
    defeatLines: [
      'Scope mismatch has erased your shields.',
      'Your definitions are empty (pass).'
    ],
    attacks: [
      { name: 'Scope Collapse', effect: 'Your external variables vanish as local scope takes over!', damage: 20, overlayColor: 'rgba(167, 139, 250, 0.4)' },
      { name: 'NameError Burst', effect: 'Calling undefined functions causes critical damage!', damage: 25, overlayColor: 'rgba(239, 68, 68, 0.4)' }
    ],
    challenges: [
      {
        id: 'fm-c1',
        type: 'mcq',
        question: 'Which keyword is used in Python to define a function blueprint?',
        code: '# Choose the keyword',
        options: [
          { letter: 'A', text: 'function' },
          { letter: 'B', text: 'def' },
          { letter: 'C', text: 'define' },
          { letter: 'D', text: 'func' }
        ],
        correctAnswer: 'B',
        explanation: 'Python uses the `def` keyword, short for "define", to declare a new function.',
        hint: 'It is a three-letter abbreviation.',
        difficulty: 'easy'
      },
      {
        id: 'fm-c2',
        type: 'fill-blank',
        question: 'Complete the block to define a function named cast_spell.',
        code: '____ cast_spell():\n    print("Casting!")',
        options: [
          { letter: 'A', text: 'def' },
          { letter: 'B', text: 'function' },
          { letter: 'C', text: 'create' }
        ],
        correctAnswer: 'A',
        explanation: 'We must use `def` to define the cast_spell function.',
        hint: 'Use the standard Python function definition keyword.',
        difficulty: 'easy'
      },
      {
        id: 'fm-c3',
        type: 'predict-output',
        question: 'What does this function print when called?',
        code: 'def add_power(x):\n    return x + 10\n\npower = add_power(5)\nprint(power)',
        options: [
          { letter: 'A', text: '5' },
          { letter: 'B', text: '10' },
          { letter: 'C', text: '15' },
          { letter: 'D', text: 'Error' }
        ],
        correctAnswer: 'C',
        explanation: 'The argument 5 is bound to parameter x. x + 10 returns 15, which is printed.',
        hint: 'Add the argument to the number inside the function definition.',
        difficulty: 'medium'
      },
      {
        id: 'fm-c4',
        type: 'fix-bug',
        question: 'Identify the line containing a syntax error in parameter configuration.',
        code: 'def cast_spell(mana, power=50):\n    print(mana + power)\ncast_spell(power=10, 100)',
        options: [
          { letter: 'A', text: 'Line 1: def cast_spell(mana, power=50):' },
          { letter: 'B', text: 'Line 2:     print(mana + power)' },
          { letter: 'C', text: 'Line 3: cast_spell(power=10, 100)' }
        ],
        correctAnswer: 'C',
        buggyLineIndex: 2,
        explanation: 'In Python function calls, positional arguments (like 100) must appear BEFORE keyword arguments (like power=10). Calling cast_spell(power=10, 100) throws a SyntaxError.',
        hint: 'Positional arguments cannot follow keyword arguments.',
        difficulty: 'medium'
      },
      {
        id: 'fm-c5',
        type: 'drag-code',
        question: 'Arrange the code blocks to declare a function double_mana and return N * 2.',
        code: '# Reorder blocks correctly',
        options: [
          { letter: 'A', text: 'def double_mana(n):' },
          { letter: 'B', text: '    return n * 2' }
        ],
        correctAnswer: 'AB',
        dragBlocks: ['def double_mana(n):', '    return n * 2'],
        explanation: 'Declare the function signature first, and then place the indented return statement.',
        hint: 'Declaration goes before logic bodies.',
        difficulty: 'hard'
      }
    ]
  },
  'collections-kingdom': {
    regionId: 'collections-kingdom',
    name: 'The Data Hoarder',
    level: 5,
    element: 'Container',
    difficulty: 'Hard',
    maxHp: 150,
    artifactReward: 'Royal Scepter',
    lootReward: ['Royal Scepter', '+1000 XP', 'Hoarder Gauntlets', 'Golden Scale', '+100 Guild Rep'],
    introduction: 'A greedy dragon of logic piles containers (lists, dicts, sets) into a mountain. You must navigate its collections structures to shatter its vault!',
    taunts: [
      'Your lists are empty!',
      'My keys are locked in dictionaries you cannot decrypt!',
      'Sets reject your duplicates!',
      'You requested index 99 but my size is 0!'
    ],
    victoryLines: [
      'My archives have been looted... The containers are scattered.',
      'Your array slicing was precise. Claim the Scepter!'
    ],
    defeatLines: [
      'KeyError: The hoarder has locked you out.',
      'IndexError: Out of bounds.'
    ],
    attacks: [
      { name: 'KeyError Strike', effect: 'Accessing missing keys triggers a direct vault explosion!', damage: 22, overlayColor: 'rgba(239, 68, 68, 0.4)' },
      { name: 'Duplicates Purge', effect: 'A set contraction waves across the board, draining your shields!', damage: 25, overlayColor: 'rgba(16, 185, 129, 0.4)' }
    ],
    challenges: [
      {
        id: 'ck-c1',
        type: 'mcq',
        question: 'Which container type in Python is ordered, mutable, and allows duplicates?',
        code: '# Choose container',
        options: [
          { letter: 'A', text: 'List' },
          { letter: 'B', text: 'Set' },
          { letter: 'C', text: 'Tuple' },
          { letter: 'D', text: 'Dictionary' }
        ],
        correctAnswer: 'A',
        explanation: 'Lists are ordered, mutable collections that allow duplicate values, defined with brackets [].',
        hint: 'Tuples are immutable; sets discard duplicates.',
        difficulty: 'easy'
      },
      {
        id: 'ck-c2',
        type: 'fill-blank',
        question: 'Complete the line to append "Mana" to the spells list.',
        code: 'spells = ["Fire", "Ice"]\nspells.____("Mana")',
        options: [
          { letter: 'A', text: 'append' },
          { letter: 'B', text: 'add' },
          { letter: 'C', text: 'insert' }
        ],
        correctAnswer: 'A',
        explanation: 'Python lists use the `.append()` method to add an item to the end.',
        hint: 'Do not use `add`, which is for sets.',
        difficulty: 'easy'
      },
      {
        id: 'ck-c3',
        type: 'predict-output',
        question: 'What is printed from this dictionary query?',
        code: 'inventory = {"sword": 1, "potions": 3}\nprint(inventory.get("shield", 0))',
        options: [
          { letter: 'A', text: 'Error' },
          { letter: 'B', text: '0' },
          { letter: 'C', text: 'None' },
          { letter: 'D', text: '1' }
        ],
        correctAnswer: 'B',
        explanation: 'The `.get(key, default)` method returns the default value (0) if the key "shield" is missing from the dictionary.',
        hint: 'Check what fallback value is provided to the get method.',
        difficulty: 'medium'
      },
      {
        id: 'ck-c4',
        type: 'fix-bug',
        question: 'Identify the line containing an illegal assignment that throws a TypeError.',
        code: 'coords = (10, 20)\ncoords_list = [10, 20]\ncoords[0] = 99',
        options: [
          { letter: 'A', text: 'Line 1: coords = (10, 20)' },
          { letter: 'B', text: 'Line 2: coords_list = [10, 20]' },
          { letter: 'C', text: 'Line 3: coords[0] = 99' }
        ],
        correctAnswer: 'C',
        buggyLineIndex: 2,
        explanation: '`coords` is a tuple (parentheses). Tuples are immutable in Python, so trying to modify `coords[0]` throws a TypeError.',
        hint: 'Parentheses create tuples, which cannot be changed after creation.',
        difficulty: 'medium'
      },
      {
        id: 'ck-c5',
        type: 'drag-code',
        question: 'Arrange the code to create a set containing unique values [1, 2, 3] from a duplicate list.',
        code: '# Order values correctly',
        options: [
          { letter: 'A', text: 'dups = [1, 2, 2, 3]' },
          { letter: 'B', text: 'uniques = set(dups)' }
        ],
        correctAnswer: 'AB',
        dragBlocks: ['dups = [1, 2, 2, 3]', 'uniques = set(dups)'],
        explanation: 'Initialize the duplicate list, then cast it to a set using set(), which removes duplicates.',
        hint: 'Convert list to set.',
        difficulty: 'hard'
      }
    ]
  },
  'oop-citadel': {
    regionId: 'oop-citadel',
    name: 'The Hollow King',
    level: 6,
    element: 'Instance',
    difficulty: 'Hard',
    maxHp: 160,
    artifactReward: 'Class Sigil',
    lootReward: ['Class Sigil', '+1200 XP', 'Kings Robes', 'Hollow Seal', '+120 Guild Rep'],
    introduction: 'The Hollow King is a living construct built of inheritance hierarchies. Define classes and instantiate objects to override his programming!',
    taunts: [
      'You are but a weak instance of a primitive class!',
      'My attributes are private!',
      'My parents bequeath their power to me. Can you override inheritance?',
      'Your constructor parameters are missing!'
    ],
    victoryLines: [
      'My instance variables have been cleared... Garbage collection claimed me.',
      'You have overridden my methods. Take the Sigil.'
    ],
    defeatLines: [
      'Construct failed. Null reference.',
      'Your class definitions are empty.'
    ],
    attacks: [
      { name: 'Private Attribute Shield', effect: 'The king locks variables, rendering them immune to standard slashes!', damage: 20, overlayColor: 'rgba(192, 132, 252, 0.4)' },
      { name: 'Inheritance Crush', effect: 'Heavy parental structures crash down from subclass chains!', damage: 30, overlayColor: 'rgba(239, 68, 68, 0.4)' }
    ],
    challenges: [
      {
        id: 'oop-c1',
        type: 'mcq',
        question: 'What is the keyword used to create a class definition blueprint in Python?',
        code: '# Choose definition keyword',
        options: [
          { letter: 'A', text: 'class' },
          { letter: 'B', text: 'def' },
          { letter: 'C', text: 'struct' },
          { letter: 'D', text: 'object' }
        ],
        correctAnswer: 'A',
        explanation: 'Python uses the `class` keyword to define classes.',
        hint: 'It shares the name of class blueprints.',
        difficulty: 'easy'
      },
      {
        id: 'oop-c2',
        type: 'fill-blank',
        question: 'Complete the constructor naming format standard in Python classes.',
        code: 'class Hero:\n    def ____(self, name):\n        self.name = name',
        options: [
          { letter: 'A', text: '__init__' },
          { letter: 'B', text: 'constructor' },
          { letter: 'C', text: 'init' }
        ],
        correctAnswer: 'A',
        explanation: 'In Python, class constructors are named using the special double underscore method `__init__`.',
        hint: 'Double underscore init double underscore.',
        difficulty: 'easy'
      },
      {
        id: 'oop-c3',
        type: 'predict-output',
        question: 'What does this instance call print out?',
        code: 'class Spell:\n    def cast(self):\n        return "Flame"\n\ns = Spell()\nprint(s.cast())',
        options: [
          { letter: 'A', text: 'Flame' },
          { letter: 'B', text: 'Spell' },
          { letter: 'C', text: 'self' },
          { letter: 'D', text: 'Error' }
        ],
        correctAnswer: 'A',
        explanation: '`s = Spell()` instantiates the class. Calling `s.cast()` runs the method, returning "Flame".',
        hint: 'Call the method on the object instance.',
        difficulty: 'medium'
      },
      {
        id: 'oop-c4',
        type: 'fix-bug',
        question: 'Identify the line breaking subclass inheritance syntax rules.',
        code: 'class Boss:\n    pass\nclass MiniBoss subclass(Boss):\n    pass',
        options: [
          { letter: 'A', text: 'Line 1: class Boss:' },
          { letter: 'B', text: 'Line 3: class MiniBoss subclass(Boss):' },
          { letter: 'C', text: 'Line 2:     pass' }
        ],
        correctAnswer: 'B',
        buggyLineIndex: 2,
        explanation: 'Subclasses inherit by placing the parent class inside parentheses directly: `class MiniBoss(Boss):`. The keyword `subclass` is illegal syntax.',
        hint: 'Do not use descriptive words inside class inheritance parameter parentheses.',
        difficulty: 'medium'
      },
      {
        id: 'oop-c5',
        type: 'drag-code',
        question: 'Arrange the code to create class Golem, defining attribute hp.',
        code: '# Put construct in order',
        options: [
          { letter: 'A', text: 'class Golem:' },
          { letter: 'B', text: '    def __init__(self, hp):' },
          { letter: 'C', text: '        self.hp = hp' }
        ],
        correctAnswer: 'ABC',
        dragBlocks: ['class Golem:', '    def __init__(self, hp):', '        self.hp = hp'],
        explanation: 'Define class first, followed by construct signature, and then store parameter inside instance memory.',
        hint: 'Indentation structure follows class -> method -> assignment.',
        difficulty: 'hard'
      }
    ]
  },
  'exception-abyss': {
    regionId: 'exception-abyss',
    name: 'The Chaos Compiler',
    level: 7,
    element: 'Anomaly',
    difficulty: 'Hard',
    maxHp: 160,
    artifactReward: 'Abyssal Shield',
    lootReward: ['Abyssal Shield', '+1300 XP', 'Chaos Signet', 'Abyssal Eye', '+120 Guild Rep'],
    introduction: 'A chaotic, glitching orb of anomalies blocks your path. You must intercept errors using try/except blocks to stabilize the compiler!',
    taunts: [
      'I will raise exceptions you cannot catch!',
      'Your program collapses on division by zero!',
      'Feel the wrath of unhandled errors!',
      'Your finally blocks will never save you!'
    ],
    victoryLines: [
      'The errors are caught... System returns to normal execution.',
      'You stabilized reality. Claim the Abyssal Shield.'
    ],
    defeatLines: [
      'Glitch detected. Fatal execution error.',
      'Unhandled exception has crashed the quest.'
    ],
    attacks: [
      { name: 'ZeroDivision Fault', effect: 'A zero division anomaly triggers a massive screen shake!', damage: 25, overlayColor: 'rgba(239, 68, 68, 0.4)' },
      { name: 'Glitch Stream', effect: 'Glitch streams sweep across the arena, raising multiple exceptions!', damage: 28, overlayColor: 'rgba(249, 146, 60, 0.4)' }
    ],
    challenges: [
      {
        id: 'ea-c1',
        type: 'mcq',
        question: 'Which block in Python contains code that is guaranteed to run, whether an error occurs or not?',
        code: '# Choose block',
        options: [
          { letter: 'A', text: 'try' },
          { letter: 'B', text: 'except' },
          { letter: 'C', text: 'finally' },
          { letter: 'D', text: 'else' }
        ],
        correctAnswer: 'C',
        explanation: 'The `finally` block always executes after try/except blocks, regardless of whether exceptions were raised or caught.',
        hint: 'It has the final word in execution flow.',
        difficulty: 'easy'
      },
      {
        id: 'ea-c2',
        type: 'fill-blank',
        question: 'Complete the block to catch a specific ZeroDivisionError in Python.',
        code: 'try:\n    r = 10 / 0\n____ ZeroDivisionError:\n    print("Caught!")',
        options: [
          { letter: 'A', text: 'except' },
          { letter: 'B', text: 'catch' },
          { letter: 'C', text: 'rescue' }
        ],
        correctAnswer: 'A',
        explanation: 'Python uses `except` to handle/catch raised exceptions.',
        hint: 'It is the counterpart of `try`.',
        difficulty: 'easy'
      },
      {
        id: 'ea-c3',
        type: 'predict-output',
        question: 'What is printed when this safe execution block runs?',
        code: 'try:\n    print("Cast")\nexcept:\n    print("Error")\nfinally:\n    print("Done")',
        options: [
          { letter: 'A', text: 'Cast' },
          { letter: 'B', text: 'Cast Done' },
          { letter: 'C', text: 'Cast Error Done' },
          { letter: 'D', text: 'Done' }
        ],
        correctAnswer: 'B',
        explanation: 'Code in `try` executes successfully, printing "Cast". `except` is skipped. Then, `finally` always runs, printing "Done".',
        hint: 'Trace the path of try -> successful run -> finally.',
        difficulty: 'medium'
      },
      {
        id: 'ea-c4',
        type: 'fix-bug',
        question: 'Identify the line containing an illegal exception catching structure.',
        code: 'try:\n    x = 10 / 0\nexcept (ZeroDivisionError) as err:',
        options: [
          { letter: 'A', text: 'All syntax is valid' },
          { letter: 'B', text: 'Line 2: except (ZeroDivisionError) as err:' },
          { letter: 'C', text: 'None of the above' }
        ],
        correctAnswer: 'A',
        buggyLineIndex: 0,
        explanation: 'All syntax is valid. Wrapping single exceptions in parentheses or binding them using `as` is correct in Python.',
        hint: 'Is there any actual bug, or is this a decoy?',
        difficulty: 'medium'
      },
      {
        id: 'ea-c5',
        type: 'drag-code',
        question: 'Arrange the statements to catch a generic error and print a message.',
        code: '# Reorder statements',
        options: [
          { letter: 'A', text: 'try:' },
          { letter: 'B', text: '    x = 10 / 0' },
          { letter: 'C', text: 'except Exception as e:' },
          { letter: 'D', text: '    print("Error")' }
        ],
        correctAnswer: 'ABCD',
        dragBlocks: ['try:', '    x = 10 / 0', 'except Exception as e:', '    print("Error")'],
        explanation: 'Wrap the buggy expression in `try`, declare the `except` catcher, and then place the indented message action.',
        hint: 'Structure try -> body -> except -> handler body.',
        difficulty: 'hard'
      }
    ]
  },
  'filesystem-ruins': {
    regionId: 'filesystem-ruins',
    name: 'The Forgotten Archivist',
    level: 8,
    element: 'Persistence',
    difficulty: 'Hard',
    maxHp: 160,
    artifactReward: 'Stone Tablet',
    lootReward: ['Stone Tablet', '+1300 XP', 'Archivists Quill', 'Ancient Scroll', '+120 Guild Rep'],
    introduction: 'A towering stone golem constructed of ancient archives activates. You must write proper context managers and serialization commands to stabilize its database!',
    taunts: [
      'You forgot to close your file streams!',
      'Your JSON buffers are corrupted!',
      'Unsaved states are lost to time!',
      'The archives reject your formatting!'
    ],
    victoryLines: [
      'My context managers have successfully flushed all buffers. Streams closed.',
      'You solved the ruins. Take the Stone Tablet.'
    ],
    defeatLines: [
      'FileNotOpen: Your progress is lost.',
      'Glitch: Data stream corrupted.'
    ],
    attacks: [
      { name: 'Resource Leak Blast', effect: 'Open file pointers drain your health pool!', damage: 25, overlayColor: 'rgba(45, 212, 191, 0.4)' },
      { name: 'JSON Parser Crash', effect: 'Corrupted brackets cause system damage!', damage: 28, overlayColor: 'rgba(239, 68, 68, 0.4)' }
    ],
    challenges: [
      {
        id: 'fr-c1',
        type: 'mcq',
        question: 'Which block structure automatically closes a file after execution, even if exceptions occur?',
        code: '# Choose method',
        options: [
          { letter: 'A', text: 'with open("file.txt") as f:' },
          { letter: 'B', text: 'open("file.txt", "w")' },
          { letter: 'C', text: 'try/except' },
          { letter: 'D', text: 'close()' }
        ],
        correctAnswer: 'A',
        explanation: 'The `with` statement acts as a context manager, automatically calling `.close()` on the file object once the block exits.',
        hint: 'It is called a context manager.',
        difficulty: 'easy'
      },
      {
        id: 'fr-c2',
        type: 'fill-blank',
        question: 'Complete the parameters to open spell.txt in write ("w") mode.',
        code: 'with open("spell.txt", "____") as f:',
        options: [
          { letter: 'A', text: 'w' },
          { letter: 'B', text: 'r' },
          { letter: 'C', text: 'a' }
        ],
        correctAnswer: 'A',
        explanation: 'Write mode is indicated by string parameter "w".',
        hint: 'Use the abbreviation for write.',
        difficulty: 'easy'
      },
      {
        id: 'fr-c3',
        type: 'predict-output',
        question: 'What does this JSON parsing statement output?',
        code: 'import json\ndata = \'{"mana": 100}\'\nobj = json.loads(data)\nprint(obj["mana"])',
        options: [
          { letter: 'A', text: '100' },
          { letter: 'B', text: '{"mana": 100}' },
          { letter: 'C', text: 'Error' },
          { letter: 'D', text: 'mana' }
        ],
        correctAnswer: 'A',
        explanation: '`json.loads()` parses a JSON string into a Python dictionary. `obj["mana"]` gets 100.',
        hint: 'loads parses JSON string into Python native dictionary.',
        difficulty: 'medium'
      },
      {
        id: 'fr-c4',
        type: 'fix-bug',
        question: 'Identify the line containing a resource leakage error in file handling.',
        code: 'f = open("log.txt", "r")\ndata = f.read()\n# Missing close statement',
        options: [
          { letter: 'A', text: 'Line 1: f = open("log.txt", "r")' },
          { letter: 'B', text: 'Line 2: data = f.read()' },
          { letter: 'C', text: 'Both of the above' }
        ],
        correctAnswer: 'A',
        buggyLineIndex: 0,
        explanation: 'Opening files using open() without a with block or f.close() causes resource leaks. Line 1 should be wrapped in a with statement.',
        hint: 'Check if file is closed properly.',
        difficulty: 'medium'
      },
      {
        id: 'fr-c5',
        type: 'drag-code',
        question: 'Arrange the statements to read all lines from a file text.txt safely.',
        code: '# Order statements',
        options: [
          { letter: 'A', text: 'with open("text.txt", "r") as f:' },
          { letter: 'B', text: '    lines = f.readlines()' }
        ],
        correctAnswer: 'AB',
        dragBlocks: ['with open("text.txt", "r") as f:', '    lines = f.readlines()'],
        explanation: 'Declare context manager first, and then place indented reading method.',
        hint: 'with keyword goes before block body.',
        difficulty: 'hard'
      }
    ]
  },
  'modules-harbor': {
    regionId: 'modules-harbor',
    name: 'The Smuggler of Secrets',
    level: 9,
    element: 'Package',
    difficulty: 'Hard',
    maxHp: 160,
    artifactReward: 'Harbor Compass',
    lootReward: ['Harbor Compass', '+1300 XP', 'Smugglers Boots', 'Import Seal', '+120 Guild Rep'],
    introduction: 'A shadowy pirate controls the harbor, smuggling illicit packages. You must write proper import statements and modular paths to intercept his cargo!',
    taunts: [
      'You are trying to import modules that do not exist!',
      'Your namespace is cluttered!',
      'My libraries are hidden behind private paths!',
      'A circular import will lock you out!'
    ],
    victoryLines: [
      'My package manifests have been intercepted. Modules imported successfully.',
      'The harbor is clear. Take the Harbor Compass.'
    ],
    defeatLines: [
      'ModuleNotFoundError: Cargo lost.',
      'CircularImport: Lockout.'
    ],
    attacks: [
      { name: 'Namespace Collision', effect: 'Conflicting variable names clash, causing damage!', damage: 25, overlayColor: 'rgba(129, 140, 248, 0.4)' },
      { name: 'ImportError Blast', effect: 'Corrupted packages explode upon loading!', damage: 28, overlayColor: 'rgba(239, 68, 68, 0.4)' }
    ],
    challenges: [
      {
        id: 'mh-c1',
        type: 'mcq',
        question: 'How do you import a module named math in Python?',
        code: '# Choose statement',
        options: [
          { letter: 'A', text: 'import math' },
          { letter: 'B', text: 'load math' },
          { letter: 'C', text: 'require math' },
          { letter: 'D', text: 'using math' }
        ],
        correctAnswer: 'A',
        explanation: 'Python uses the `import` keyword to load external modules.',
        hint: 'It is the standard word for loading in Python.',
        difficulty: 'easy'
      },
      {
        id: 'mh-c2',
        type: 'fill-blank',
        question: 'Complete the statement to import only the sqrt function from the math module.',
        code: '____ math import sqrt',
        options: [
          { letter: 'A', text: 'from' },
          { letter: 'B', text: 'import' },
          { letter: 'C', text: 'using' }
        ],
        correctAnswer: 'A',
        explanation: 'Use `from module import function` syntax to pull specific elements.',
        hint: 'Indicates the origin module.',
        difficulty: 'easy'
      },
      {
        id: 'mh-c3',
        type: 'predict-output',
        question: 'What does this alias statement do?',
        code: 'import math as m\nprint(m.pi > 3)',
        options: [
          { letter: 'A', text: 'True' },
          { letter: 'B', text: 'False' },
          { letter: 'C', text: 'Error' },
          { letter: 'D', text: '3' }
        ],
        correctAnswer: 'A',
        explanation: '`import math as m` aliases the module to `m`. `m.pi` is ~3.14159, which is indeed greater than 3, returning True.',
        hint: 'PI constant is approx 3.14.',
        difficulty: 'medium'
      },
      {
        id: 'mh-c4',
        type: 'fix-bug',
        question: 'Identify the line causing a namespace collision error.',
        code: 'from math import pi\n# Clashing name\npi = 3.14',
        options: [
          { letter: 'A', text: 'Line 1: from math import pi' },
          { letter: 'B', text: 'Line 3: pi = 3.14' },
          { letter: 'C', text: 'No error, just overwrites local reference' }
        ],
        correctAnswer: 'C',
        buggyLineIndex: 0,
        explanation: 'This code does not throw a syntax error; it simply overwrites the math pi reference locally in namespace.',
        hint: 'Is there a syntax error here, or does Python allow re-binding variables?',
        difficulty: 'medium'
      },
      {
        id: 'mh-c5',
        type: 'drag-code',
        question: 'Arrange the lines to import random and generate a number between 1 and 10.',
        code: '# Order statements',
        options: [
          { letter: 'A', text: 'import random' },
          { letter: 'B', text: 'val = random.randint(1, 10)' }
        ],
        correctAnswer: 'AB',
        dragBlocks: ['import random', 'val = random.randint(1, 10)'],
        explanation: 'Import module first, and then call its functions.',
        hint: 'Module must be loaded before usage.',
        difficulty: 'hard'
      }
    ]
  },
  'algorithm-arena': {
    regionId: 'algorithm-arena',
    name: 'The Time Eater',
    level: 10,
    element: 'Complexity',
    difficulty: 'Hard',
    maxHp: 160,
    artifactReward: 'Arena Trophy',
    lootReward: ['Arena Trophy', '+1300 XP', 'Gladiators Band', 'Time Glass', '+120 Guild Rep'],
    introduction: 'A mechanical leviathan ticking like a clock dominates the colosseum. To defeat it, you must optimize your algorithms before time runs out!',
    taunts: [
      'Your complexity is O(N^2)! Too slow!',
      'I will eat your memory frames!',
      'Your search is linear in an ordered realm!',
      'Time is my weapon. Optimize or expire!'
    ],
    victoryLines: [
      'Complexity reduced to O(log N). Time loop deactivated.',
      'Excellent optimization, gladiator. Reclaim the Trophy.'
    ],
    defeatLines: [
      'TimeLimitExceeded: The machine consumed you.',
      'Your complexity expanded exponentially.'
    ],
    attacks: [
      { name: 'Exponential Spike', effect: 'Nested loops cause a massive spike in complexity and damage!', damage: 25, overlayColor: 'rgba(244, 114, 182, 0.4)' },
      { name: 'Memory Leak Wave', effect: 'Unbounded heap space expansion drains your shields!', damage: 28, overlayColor: 'rgba(239, 68, 68, 0.4)' }
    ],
    challenges: [
      {
        id: 'aa-c1',
        type: 'mcq',
        question: 'What is the Big O time complexity of binary search on a sorted list?',
        code: '# Choose complexity',
        options: [
          { letter: 'A', text: 'O(1)' },
          { letter: 'B', text: 'O(N)' },
          { letter: 'C', text: 'O(log N)' },
          { letter: 'D', text: 'O(N log N)' }
        ],
        correctAnswer: 'C',
        explanation: 'Binary search splits the search space in half each step, giving O(log N) complexity.',
        hint: 'It divides and conquers.',
        difficulty: 'easy'
      },
      {
        id: 'aa-c2',
        type: 'fill-blank',
        question: 'Complete the complexity term for standard bubble sort.',
        code: 'Bubble sort average complexity is O(____).',
        options: [
          { letter: 'A', text: 'N^2' },
          { letter: 'B', text: 'N' },
          { letter: 'C', text: 'log N' }
        ],
        correctAnswer: 'A',
        explanation: 'Bubble sort uses nested loops, resulting in O(N^2) average complexity.',
        hint: 'Indicates quadratic behavior.',
        difficulty: 'easy'
      },
      {
        id: 'aa-c3',
        type: 'predict-output',
        question: 'What is the time complexity of lookup in a Python dictionary by key?',
        code: 'val = dictionary[key]  # Average complexity?',
        options: [
          { letter: 'A', text: 'O(1)' },
          { letter: 'B', text: 'O(N)' },
          { letter: 'C', text: 'O(log N)' },
          { letter: 'D', text: 'O(N^2)' }
        ],
        correctAnswer: 'A',
        explanation: 'Python dictionaries use hash tables, allowing key lookups in O(1) constant time on average.',
        hint: 'It is extremely fast and constant.',
        difficulty: 'medium'
      },
      {
        id: 'aa-c4',
        type: 'fix-bug',
        question: 'Identify the line causing quadratic O(N^2) complexity in this search.',
        code: 'for x in items:\n    if x in duplicate_list:\n        print(x)',
        options: [
          { letter: 'A', text: 'Line 1: for x in items:' },
          { letter: 'B', text: 'Line 2: if x in duplicate_list:' },
          { letter: 'C', text: 'Both lines interact' }
        ],
        correctAnswer: 'C',
        buggyLineIndex: 1,
        explanation: 'Checking membership (`in`) on a list takes O(N). Nesting it inside a loop over N items results in O(N^2) time complexity. We should use a set.',
        hint: 'Think about lists versus sets membership complexity.',
        difficulty: 'medium'
      },
      {
        id: 'aa-c5',
        type: 'drag-code',
        question: 'Arrange the steps to perform a linear search through a list, breaking if element matches target.',
        code: '# Order statements',
        options: [
          { letter: 'A', text: 'for x in items:' },
          { letter: 'B', text: '    if x == target:' },
          { letter: 'C', text: '        break' }
        ],
        correctAnswer: 'ABC',
        dragBlocks: ['for x in items:', '    if x == target:', '        break'],
        explanation: 'Loop over elements, check if current element matches target, and invoke break to stop search.',
        hint: 'Standard loop structures.',
        difficulty: 'hard'
      }
    ]
  },
  'iterator-isles': {
    regionId: 'iterator-isles',
    name: 'Infinite Stream Sentinel',
    level: 11,
    element: 'Stream',
    difficulty: 'Hard',
    maxHp: 160,
    artifactReward: 'Infinite Compass',
    lootReward: ['Infinite Compass', '+1400 XP', 'Sentinels Helm', 'Stream Shard', '+130 Guild Rep'],
    introduction: 'A colossal elemental guardian controlling floating stream currents blocks your path. You must write memory-efficient generators to stream past its defenses!',
    taunts: [
      'You load too much into memory at once!',
      'My streams are infinite, you cannot load them in arrays!',
      'A yield is but a brief pause in my eternal execution!',
      'You are exhausted. StopIteration!'
    ],
    victoryLines: [
      'Infinite sequence streamed successfully. My memory buffers are clear.',
      'You mastered generators. Reclaim the Infinite Compass.'
    ],
    defeatLines: [
      'OutOfMemory: System collapsed.',
      'StopIteration exception unhandled.'
    ],
    attacks: [
      { name: 'Memory Exhaustion Wave', effect: 'Loading massive list buffers drains your shields!', damage: 25, overlayColor: 'rgba(16, 185, 129, 0.4)' },
      { name: 'StopIteration Crash', effect: 'Exhausting the sequence without catching anomalies inflicts damage!', damage: 28, overlayColor: 'rgba(239, 68, 68, 0.4)' }
    ],
    challenges: [
      {
        id: 'ii-c1',
        type: 'mcq',
        question: 'Which keyword turns a standard function into a generator that evaluates lazily?',
        code: '# Choose keyword',
        options: [
          { letter: 'A', text: 'yield' },
          { letter: 'B', text: 'return' },
          { letter: 'C', text: 'next' },
          { letter: 'D', text: 'generator' }
        ],
        correctAnswer: 'A',
        explanation: 'The `yield` keyword pauses function execution and yields a value, transforming the function into a generator.',
        hint: 'It yields output without termination.',
        difficulty: 'easy'
      },
      {
        id: 'ii-c2',
        type: 'fill-blank',
        question: 'Complete the call to retrieve the next value from iterator it.',
        code: 'val = ____(it)',
        options: [
          { letter: 'A', text: 'next' },
          { letter: 'B', text: 'iter' },
          { letter: 'C', text: 'get' }
        ],
        correctAnswer: 'A',
        explanation: 'The `next()` function is called on iterators to advance and retrieve the next element.',
        hint: 'Find the abbreviation indicating succession.',
        difficulty: 'easy'
      },
      {
        id: 'ii-c3',
        type: 'predict-output',
        question: 'What is printed from this generator expression?',
        code: 'gen = (x * 2 for x in range(3))\nprint(next(gen))',
        options: [
          { letter: 'A', text: '0' },
          { letter: 'B', text: '2' },
          { letter: 'C', text: '[0, 2, 4]' },
          { letter: 'D', text: 'Error' }
        ],
        correctAnswer: 'A',
        explanation: 'The generator expression generates elements lazily. The first element is `0 * 2 = 0`. Calling `next()` retrieves only this first value.',
        hint: 'Range starts from 0.',
        difficulty: 'medium'
      },
      {
        id: 'ii-c4',
        type: 'fix-bug',
        question: 'Identify the line causing memory leakage by eagerly converting infinite generator to list.',
        code: 'def infinite_spell():\n    while True:\n        yield "Strike"\ncast_list = list(infinite_spell())',
        options: [
          { letter: 'A', text: 'Line 1: def infinite_spell():' },
          { letter: 'B', text: 'Line 3:         yield "Strike"' },
          { letter: 'C', text: 'Line 4: cast_list = list(infinite_spell())' }
        ],
        correctAnswer: 'C',
        buggyLineIndex: 3,
        explanation: 'Converting an infinite generator to a list eagerly causes the program to loop forever allocating memory, crashing system.',
        hint: 'Eager casting functions like list() will consume infinite loops entirely.',
        difficulty: 'medium'
      },
      {
        id: 'ii-c5',
        type: 'drag-code',
        question: 'Arrange code to yield numbers 1, then 2 using a generator blueprint.',
        code: '# Reorder statements',
        options: [
          { letter: 'A', text: 'def generator():' },
          { letter: 'B', text: '    yield 1' },
          { letter: 'C', text: '    yield 2' }
        ],
        correctAnswer: 'ABC',
        dragBlocks: ['def generator():', '    yield 1', '    yield 2'],
        explanation: 'Declare generator function, then yield 1 followed by yielding 2.',
        hint: 'Flow follows function definition order.',
        difficulty: 'hard'
      }
    ]
  },
  'bossgate-saga': {
    regionId: 'bossgate-saga',
    name: 'The Ancient Python Dragon',
    level: 12,
    element: 'Legend',
    difficulty: 'Legendary',
    maxHp: 200,
    artifactReward: "Legend's Crown",
    lootReward: ["Legend's Crown", '+5000 XP', 'Title: Python Legend', 'Seals Crystal', '+500 Guild Rep'],
    introduction: 'The final trial. The Ancient Python Dragon emerges from the clouds. It wields all elements of Python. Combine everything you have learned to defeat it!',
    taunts: [
      'You are not worthy of the crown!',
      'Your program contains variables, loops, and OOP, yet lacks integration!',
      'I will throw errors, leak memory, and loop infinitely!',
      'Face my legendary compression!'
    ],
    victoryLines: [
      'The dragon bows... The kingdom is saved. You are a true Python Legend.',
      'You solved all logic boundaries. Inherit the crown.'
    ],
    defeatLines: [
      'Your code was compiled and rejected.',
      'A legendary crash.'
    ],
    attacks: [
      { name: 'Legendary Glitch Strike', effect: 'All elements collide in a massive impact!', damage: 30, overlayColor: 'rgba(200, 164, 94, 0.4)' },
      { name: 'Desperation Crash', effect: 'The dragon releases its ultimate system overload!', damage: 35, overlayColor: 'rgba(239, 68, 68, 0.4)' }
    ],
    challenges: [
      {
        id: 'bg-c1',
        type: 'mcq',
        question: 'Which of the following creates a dictionary containing unique lists?',
        code: '# Pick dictionary creation',
        options: [
          { letter: 'A', text: 'd = {"spells": ["Fire", "Ice"]}' },
          { letter: 'B', text: 'd = (spells: ["Fire", "Ice"])' },
          { letter: 'C', text: 'd = [spells: {"Fire", "Ice"}]' },
          { letter: 'D', text: 'd = {"spells" = ["Fire", "Ice"]}' }
        ],
        correctAnswer: 'A',
        explanation: 'Dictionary syntax uses braces `{}` with keys and values separated by colons. Values can be lists `[]`.',
        hint: 'Check correct syntax for keys and brackets.',
        difficulty: 'easy'
      },
      {
        id: 'bg-c2',
        type: 'fill-blank',
        question: 'Complete the definition to subclass Dragon from parent class Entity.',
        code: 'class Dragon(____):',
        options: [
          { letter: 'A', text: 'Entity' },
          { letter: 'B', text: 'self' },
          { letter: 'C', text: 'object' }
        ],
        correctAnswer: 'A',
        explanation: 'Class inheritance places the parent class name directly inside class parentheses.',
        hint: 'Use the name of the parent class.',
        difficulty: 'easy'
      },
      {
        id: 'bg-c3',
        type: 'predict-output',
        question: 'What is printed from this nested expression?',
        code: 's = {x for x in [1, 2, 2, 3] if x > 1}\nprint(len(s))',
        options: [
          { letter: 'A', text: '2' },
          { letter: 'B', text: '3' },
          { letter: 'C', text: '4' },
          { letter: 'D', text: '1' }
        ],
        correctAnswer: 'A',
        explanation: 'The set comprehension filters out numbers <= 1, leaving {2, 2, 3}. Since sets discard duplicates, it contains {2, 3}. The length is 2.',
        hint: 'Sets store only unique values matching the filter.',
        difficulty: 'medium'
      },
      {
        id: 'bg-c4',
        type: 'fix-bug',
        question: 'Identify the line containing an illegal list slicing operation.',
        code: 'items = [1, 2, 3, 4]\n# Slice indices must be integers\nval = items["1":"3"]',
        options: [
          { letter: 'A', text: 'Line 1: items = [1, 2, 3, 4]' },
          { letter: 'B', text: 'Line 3: val = items["1":"3"]' },
          { letter: 'C', text: 'All code is valid' }
        ],
        correctAnswer: 'B',
        buggyLineIndex: 2,
        explanation: 'Slicing indices must be integers. Using string indices `items["1":"3"]` throws a TypeError.',
        hint: 'Indices must be integers, not strings.',
        difficulty: 'medium'
      },
      {
        id: 'bg-c5',
        type: 'drag-code',
        question: 'Arrange code to loop through keys of dictionary inventory, printing each key.',
        code: '# Reorder statements',
        options: [
          { letter: 'A', text: 'inventory = {"sword": 1}' },
          { letter: 'B', text: 'for key in inventory:' },
          { letter: 'C', text: '    print(key)' }
        ],
        correctAnswer: 'ABC',
        dragBlocks: ['inventory = {"sword": 1}', 'for key in inventory:', '    print(key)'],
        explanation: 'Initialize dictionary, loop over keys, print current key.',
        hint: 'Standard dictionary iteration structure.',
        difficulty: 'hard'
      }
    ]
  }
};
