import { LessonData } from './variablesForestData';

export const oopCastleData: Record<string, LessonData> = {
  '26': {
    id: '26',
    title: 'Blueprint Hall',
    story: {
      speaker: 'Guardian of Schematics',
      emoji: '📜',
      lines: [
        "Welcome to the OOP Citadel. The first hall contains the ancient schematics.",
        "To create anything here, you first need a master plan. We call this a 'Class'."
      ]
    },
    explain: {
      title: 'Classes',
      description: [
        "A class is a blueprint, not the actual object itself.",
        "You define a class using the `class` keyword. If it's empty, use `pass`."
      ],
      code: "class Blueprint:\n    pass\n\nprint('Blueprint defined!')",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Blueprint class in memory.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Blueprint', value: "<class 'Blueprint'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Blueprint', value: "<class 'Blueprint'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed message.",
          lineNumber: 4,
          output: "Blueprint defined!",
          memorySnapshot: { '0x00': { address: '0x00', name: 'Blueprint', value: "<class 'Blueprint'>", type: 'class' } }
        }
      ]
    },
    practice: {
      title: 'First Blueprint',
      description: 'Create an empty class named `Construct` using `pass`.',
      initialCode: '# Create Construct class\n',
      validation: (code) => {
        const hasClass = /class\s+Construct\s*:\s*pass/.test(code);
        if (!hasClass) return { isValid: false, error: 'You must define `class Construct:` and put `pass` inside it.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Construct class.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Construct', value: "<class 'Construct'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Construct', value: "<class 'Construct'>", type: 'class' } }
        }
      ]
    },
    challenge: {
      title: 'Arsenal Blueprints',
      description: 'Create a class named `Spell` and another class named `Weapon`. Both can be empty (`pass`).',
      initialCode: '# Create Spell class\n\n\n# Create Weapon class\n',
      validation: (code) => {
        const hasSpell = /class\s+Spell\s*:/.test(code);
        const hasWeapon = /class\s+Weapon\s*:/.test(code);
        if (!hasSpell) return { isValid: false, error: 'Create the `Spell` class.' };
        if (!hasWeapon) return { isValid: false, error: 'Create the `Weapon` class.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Spell.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Spell', value: "<class 'Spell'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Spell', value: "<class 'Spell'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Created Weapon.",
          lineNumber: 4,
          variable: { address: '0x01', name: 'Weapon', value: "<class 'Weapon'>", type: 'class' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Spell', value: "<class 'Spell'>", type: 'class' },
            '0x01': { address: '0x01', name: 'Weapon', value: "<class 'Weapon'>", type: 'class' }
          }
        }
      ]
    },
    rewardXP: 150
  },
  '27': {
    id: '27',
    title: 'Living Constructs',
    story: {
      speaker: 'Forge Apprentice',
      emoji: '🗿',
      lines: [
        "A blueprint cannot fight for you. You must breathe life into it to create a living construct.",
        "We call this process 'instantiation'. It turns a Class into an Object."
      ]
    },
    explain: {
      title: 'Objects',
      description: [
        "To create an object from a class, call the class name like a function (e.g., `my_golem = Golem()`)."
      ],
      code: "class Golem:\n    pass\n\nrocky = Golem()\nprint('Golem created!')",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Golem blueprint.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Golem', value: "<class 'Golem'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Golem', value: "<class 'Golem'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Created golem object.",
          lineNumber: 4,
          variable: { address: '0x01', name: 'rocky', value: "<object 'Golem'>", type: 'object' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Golem', value: "<class 'Golem'>", type: 'class' },
            '0x01': { address: '0x01', name: 'rocky', value: "<object 'Golem'>", type: 'object' }
          }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed message.",
          lineNumber: 5,
          output: "Golem created!",
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Golem', value: "<class 'Golem'>", type: 'class' },
            '0x01': { address: '0x01', name: 'rocky', value: "<object 'Golem'>", type: 'object' }
          }
        }
      ]
    },
    practice: {
      title: 'Forge a Shield',
      description: 'Given the `Shield` class, create two distinct objects: `iron_shield` and `wood_shield`.',
      initialCode: 'class Shield:\n    pass\n\n# Create iron_shield\n\n\n# Create wood_shield\n',
      validation: (code) => {
        const hasIron = /iron_shield\s*=\s*Shield\(\)/.test(code);
        const hasWood = /wood_shield\s*=\s*Shield\(\)/.test(code);
        if (!hasIron) return { isValid: false, error: 'Create `iron_shield = Shield()`.' };
        if (!hasWood) return { isValid: false, error: 'Create `wood_shield = Shield()`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Shield class.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Shield', value: "<class 'Shield'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Shield', value: "<class 'Shield'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Created iron_shield.",
          lineNumber: 5,
          variable: { address: '0x01', name: 'iron_shield', value: "<object 'Shield'>", type: 'object' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Shield', value: "<class 'Shield'>", type: 'class' },
            '0x01': { address: '0x01', name: 'iron_shield', value: "<object 'Shield'>", type: 'object' }
          }
        },
        {
          id: 3,
          type: 'ALLOCATE',
          description: "Created wood_shield.",
          lineNumber: 8,
          variable: { address: '0x02', name: 'wood_shield', value: "<object 'Shield'>", type: 'object' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Shield', value: "<class 'Shield'>", type: 'class' },
            '0x01': { address: '0x01', name: 'iron_shield', value: "<object 'Shield'>", type: 'object' },
            '0x02': { address: '0x02', name: 'wood_shield', value: "<object 'Shield'>", type: 'object' }
          }
        }
      ]
    },
    challenge: {
      title: 'Identity Check',
      description: 'Objects created from the same class are unique. Print `iron_shield` and `wood_shield`.',
      initialCode: 'class Shield:\n    pass\n\niron_shield = Shield()\nwood_shield = Shield()\n# Print both\n',
      validation: (code) => {
        const hasPrint = /print\s*\(\s*.*shield.*\)/.test(code);
        if (!hasPrint) return { isValid: false, error: 'Print the shields to observe their unique memory addresses.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Printed memory identities.",
          lineNumber: 7,
          output: "<__main__.Shield object at 0x01>\n<__main__.Shield object at 0x02>",
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 150
  },
  '28': {
    id: '28',
    title: "The Creator's Forge",
    story: {
      speaker: 'Forge Master',
      emoji: '🔨',
      lines: [
        "A sword without a damage value is just a heavy stick.",
        "Use the `__init__` constructor to give objects attributes when they are born."
      ]
    },
    explain: {
      title: 'Constructors and Self',
      description: [
        "`__init__` is automatically called when you create an object.",
        "`self` refers to the specific object being created."
      ],
      code: "class Potion:\n    def __init__(self, power):\n        self.power = power\n\nhealth_potion = Potion(50)\nprint(health_potion.power)",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Potion class.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Potion', value: "<class 'Potion'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Potion', value: "<class 'Potion'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Instantiated potion with power=50.",
          lineNumber: 5,
          variable: { address: '0x01', name: 'health_potion', value: '{"power": 50}', type: 'object' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Potion', value: "<class 'Potion'>", type: 'class' },
            '0x01': { address: '0x01', name: 'health_potion', value: '{"power": 50}', type: 'object' }
          }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed 50.",
          lineNumber: 6,
          output: "50",
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Potion', value: "<class 'Potion'>", type: 'class' },
            '0x01': { address: '0x01', name: 'health_potion', value: '{"power": 50}', type: 'object' }
          }
        }
      ]
    },
    practice: {
      title: 'Brew the Potion',
      description: 'Define a `Potion` class with an `__init__` that sets `self.power = power`. Then create `mana = Potion(20)`.',
      initialCode: 'class Potion:\n    # Define __init__ here\n\n\n# Create mana = Potion(20)\n',
      validation: (code) => {
        const hasInit = /def\s+__init__\s*\(\s*self\s*,\s*power\s*\)\s*:/.test(code);
        const hasSelf = /self\.power\s*=\s*power/.test(code);
        const hasMana = /mana\s*=\s*Potion\(\s*20\s*\)/.test(code);
        if (!hasInit || !hasSelf) return { isValid: false, error: 'You must define `def __init__(self, power):` and set `self.power = power`.' };
        if (!hasMana) return { isValid: false, error: 'You must instantiate `mana = Potion(20)`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Potion class.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Potion', value: "<class 'Potion'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Potion', value: "<class 'Potion'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Created mana potion.",
          lineNumber: 6,
          variable: { address: '0x01', name: 'mana', value: '{"power": 20}', type: 'object' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Potion', value: "<class 'Potion'>", type: 'class' },
            '0x01': { address: '0x01', name: 'mana', value: '{"power": 20}', type: 'object' }
          }
        }
      ]
    },
    challenge: {
      title: 'A Hero is Born',
      description: 'Define a `Hero` class with `name` and `hp` in its `__init__`. Create `hero = Hero("Arthur", 100)`. Print `hero.hp`.',
      initialCode: '# Define Hero class\n\n\n# Create hero and print hp\n',
      validation: (code) => {
        const hasClass = /class\s+Hero\s*:/.test(code);
        const hasInit = /def\s+__init__\s*\(\s*self\s*,\s*name\s*,\s*hp\s*\)\s*:/.test(code);
        const hasHero = /hero\s*=\s*Hero\(\s*['"]Arthur['"]\s*,\s*100\s*\)/.test(code);
        const hasPrint = /print\s*\(\s*hero\.hp\s*\)/.test(code);
        if (!hasClass || !hasInit) return { isValid: false, error: 'Define `class Hero:` and `def __init__(self, name, hp):`' };
        if (!hasHero) return { isValid: false, error: 'Instantiate `hero = Hero("Arthur", 100)`' };
        if (!hasPrint) return { isValid: false, error: 'Print `hero.hp`' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Hero class.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Hero', value: "<class 'Hero'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Hero', value: "<class 'Hero'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Created Arthur.",
          lineNumber: 6,
          variable: { address: '0x01', name: 'hero', value: '{"name": "Arthur", "hp": 100}', type: 'object' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Hero', value: "<class 'Hero'>", type: 'class' },
            '0x01': { address: '0x01', name: 'hero', value: '{"name": "Arthur", "hp": 100}', type: 'object' }
          }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed hp.",
          lineNumber: 7,
          output: "100",
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Hero', value: "<class 'Hero'>", type: 'class' },
            '0x01': { address: '0x01', name: 'hero', value: '{"name": "Arthur", "hp": 100}', type: 'object' }
          }
        }
      ]
    },
    rewardXP: 200
  },
  '29': {
    id: '29',
    title: 'Bloodlines of Power',
    story: {
      speaker: 'The Ancestor',
      emoji: '🧝',
      lines: [
        "You do not need to rewrite a blueprint from scratch. You can inherit the power of older blueprints and build upon them.",
        "We call this Inheritance. A Child class gains everything the Parent class had."
      ]
    },
    explain: {
      title: 'Inheritance',
      description: [
        "Inheritance is done by passing the Parent class inside parentheses: `class Child(Parent):`."
      ],
      code: "class Monster:\n    def roar(self):\n        print('Rawr!')\n\nclass Dragon(Monster):\n    pass\n\ndragon = Dragon()\ndragon.roar()",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Monster class.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'Monster', value: "<class 'Monster'>", type: 'class' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'Monster', value: "<class 'Monster'>", type: 'class' } }
        },
        {
          id: 2,
          type: 'ALLOCATE',
          description: "Created Dragon class (Inherits Monster).",
          lineNumber: 5,
          variable: { address: '0x01', name: 'Dragon', value: "<class 'Dragon(Monster)'>", type: 'class' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Monster', value: "<class 'Monster'>", type: 'class' },
            '0x01': { address: '0x01', name: 'Dragon', value: "<class 'Dragon(Monster)'>", type: 'class' }
          }
        },
        {
          id: 3,
          type: 'ALLOCATE',
          description: "Instantiated dragon.",
          lineNumber: 8,
          variable: { address: '0x02', name: 'dragon', value: "<object 'Dragon'>", type: 'object' },
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Monster', value: "<class 'Monster'>", type: 'class' },
            '0x01': { address: '0x01', name: 'Dragon', value: "<class 'Dragon(Monster)'>", type: 'class' },
            '0x02': { address: '0x02', name: 'dragon', value: "<object 'Dragon'>", type: 'object' }
          }
        },
        {
          id: 4,
          type: 'PRINT',
          description: "Dragon inherited and called roar().",
          lineNumber: 9,
          output: "Rawr!",
          memorySnapshot: { 
            '0x00': { address: '0x00', name: 'Monster', value: "<class 'Monster'>", type: 'class' },
            '0x01': { address: '0x01', name: 'Dragon', value: "<class 'Dragon(Monster)'>", type: 'class' },
            '0x02': { address: '0x02', name: 'dragon', value: "<object 'Dragon'>", type: 'object' }
          }
        }
      ]
    },
    practice: {
      title: 'Inherit the Power',
      description: 'Given the `Character` class, create a `Warrior` class that inherits from it. Instantiate `warrior = Warrior()` and call its `rest()` method.',
      initialCode: 'class Character:\n    def rest(self):\n        print("Resting")\n\n# Create Warrior class that inherits Character\n\n\n# Create warrior and call rest()\n',
      validation: (code) => {
        const hasWarrior = /class\s+Warrior\s*\(\s*Character\s*\)\s*:/.test(code);
        const hasCall = /warrior\.rest\(\)/.test(code);
        if (!hasWarrior) return { isValid: false, error: 'Define `class Warrior(Character):`' };
        if (!hasCall) return { isValid: false, error: 'Call `warrior.rest()`' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Warrior rested.",
          lineNumber: 9,
          output: "Resting",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'New Abilities',
      description: 'Child classes can have their own methods! Add a `cleave(self)` method to `Warrior` that prints `"Cleave!"`. Call it.',
      initialCode: 'class Character:\n    pass\n\nclass Warrior(Character):\n    # add cleave method\n\n\nwarrior = Warrior()\n# call cleave',
      validation: (code) => {
        const hasCleave = /def\s+cleave\s*\(\s*self\s*\)\s*:/.test(code);
        const hasCall = /warrior\.cleave\(\)/.test(code);
        if (!hasCleave) return { isValid: false, error: 'Define `def cleave(self):` inside Warrior.' };
        if (!hasCall) return { isValid: false, error: 'Call `warrior.cleave()`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Warrior used cleave.",
          lineNumber: 9,
          output: "Cleave!",
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 250
  },
  '30': {
    id: '30',
    title: 'The Grand Assembly',
    story: {
      speaker: 'The High Architect',
      emoji: '🏰',
      lines: [
        "The gates to the Hollow King's throne room are sealed.",
        "You must assemble a complete hierarchy of objects to break the seal."
      ]
    },
    explain: {
      title: 'Overriding and Assembly',
      description: [
        "Child classes can override (replace) parent methods by redefining them.",
        "Combine `__init__`, inheritance, and overriding to master OOP."
      ],
      code: "class Vehicle:\n    def move(self):\n        print('Moving')\n\nclass Ship(Vehicle):\n    def move(self):\n        print('Sailing!')\n\nship = Ship()\nship.move()",
      steps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Ship's overridden move method was called.",
          lineNumber: 10,
          output: "Sailing!",
          memorySnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Airships',
      description: 'Create a `FlyingShip(Vehicle)` that overrides `move()` to print `"Flying!"`. Instantiate it and call `move()`.',
      initialCode: 'class Vehicle:\n    def move(self):\n        print("Moving")\n\n# Define FlyingShip\n\n\n# Run move()\n',
      validation: (code) => {
        const hasClass = /class\s+FlyingShip\s*\(\s*Vehicle\s*\)\s*:/.test(code);
        const hasMove = /def\s+move\s*\(\s*self\s*\)\s*:/.test(code);
        if (!hasClass) return { isValid: false, error: 'Create `class FlyingShip(Vehicle):`' };
        if (!hasMove) return { isValid: false, error: 'Override `def move(self):`' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Flying ship moved.",
          lineNumber: 9,
          output: "Flying!",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'The Ultimate Spell',
      description: 'Create a base `Spell` class with `__init__(self, cost)`. Create `Fireball(Spell)` with `__init__(self, cost, damage)`. (Use `super().__init__(cost)` or set `self.cost` manually).',
      initialCode: 'class Spell:\n    def __init__(self, cost):\n        self.cost = cost\n\nclass Fireball(Spell):\n    def __init__(self, cost, damage):\n        self.cost = cost\n        self.damage = damage\n\n# Instantiate a Fireball with 10 cost, 50 damage and print its damage\n',
      validation: (code) => {
        const hasInst = /Fireball\(\s*10\s*,\s*50\s*\)/.test(code);
        const hasPrint = /print\s*\(.*damage\)/.test(code);
        if (!hasInst) return { isValid: false, error: 'Instantiate `Fireball(10, 50)`' };
        if (!hasPrint) return { isValid: false, error: 'Print the damage.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Created Fireball.",
          lineNumber: 10,
          variable: { address: '0x00', name: 'fire', value: '{"cost": 10, "damage": 50}', type: 'object' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'fire', value: '{"cost": 10, "damage": 50}', type: 'object' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed 50.",
          lineNumber: 11,
          output: "50",
          memorySnapshot: { '0x00': { address: '0x00', name: 'fire', value: '{"cost": 10, "damage": 50}', type: 'object' } }
        }
      ]
    },
    rewardXP: 300
  }
};
