import type { LessonDebugContent } from '@/types';

export const BOSSGATE_SAGA_LESSONS: Record<string, LessonDebugContent> = {
  'bg1': {
    title: "Variables & Types Review",
    hook: "Time to forge your ultimate weapon.",
    concept: "In Python, variables can hold different data types. Here we combine strings and numbers to create a hero profile.",
    code: "hero = 'Argo'\nhp = 100\npower = 15.5\nis_alive = True\nprofile = hero + ' has ' + str(hp) + ' HP'\nprint(profile)",
    mentalModel: [
      "Variables store data, and data has specific types.",
      "You must convert numbers to strings to combine them.",
      "Booleans help track states like living or dying."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Defines hero name",
        why: "Stores a string value.",
        memory: [
          { name: "hero", value: "'Argo'", type: "str", note: "Name", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Defines HP",
        why: "Stores an integer value.",
        memory: [
          { name: "hero", value: "'Argo'", type: "str", note: "Name", accent: "#60a5fa" },
          { name: "hp", value: "100", type: "int", note: "Health", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Defines power",
        why: "Stores a float (decimal) value.",
        memory: [
          { name: "hero", value: "'Argo'", type: "str", note: "Name", accent: "#60a5fa" },
          { name: "hp", value: "100", type: "int", note: "Health", accent: "#34d399" },
          { name: "power", value: "15.5", type: "float", note: "Attack", accent: "#fb923c" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Defines alive status",
        why: "Stores a boolean value.",
        memory: [
          { name: "hero", value: "'Argo'", type: "str", note: "Name", accent: "#60a5fa" },
          { name: "hp", value: "100", type: "int", note: "Health", accent: "#34d399" },
          { name: "power", value: "15.5", type: "float", note: "Attack", accent: "#fb923c" },
          { name: "is_alive", value: "True", type: "bool", note: "Status", accent: "#a78bfa" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "Builds profile string",
        why: "Combines data types by converting hp to string.",
        memory: [
          { name: "hero", value: "'Argo'", type: "str", note: "Name", accent: "#60a5fa" },
          { name: "hp", value: "100", type: "int", note: "Health", accent: "#34d399" },
          { name: "power", value: "15.5", type: "float", note: "Attack", accent: "#fb923c" },
          { name: "is_alive", value: "True", type: "bool", note: "Status", accent: "#a78bfa" },
          { name: "profile", value: "'Argo has 100 HP'", type: "str", note: "Summary", accent: "#22d3ee" }
        ],
        output: ""
      },
      {
        line: 6,
        action: "Prints profile",
        why: "Outputs the combined string.",
        memory: [
          { name: "hero", value: "'Argo'", type: "str", note: "Name", accent: "#60a5fa" },
          { name: "hp", value: "100", type: "int", note: "Health", accent: "#34d399" },
          { name: "power", value: "15.5", type: "float", note: "Attack", accent: "#fb923c" },
          { name: "is_alive", value: "True", type: "bool", note: "Status", accent: "#a78bfa" },
          { name: "profile", value: "'Argo has 100 HP'", type: "str", note: "Summary", accent: "#22d3ee" }
        ],
        output: "Argo has 100 HP\n"
      }
    ]
  },
  'bg2': {
    title: "Control Flow Mastery",
    hook: "Navigate the shifting labyrinths of logic.",
    concept: "Loops let you repeat actions, while conditionals (if/else) let you make choices. Together, they create complex logic.",
    code: "power = 10\nfor i in range(2):\n    if power > 5:\n        power -= 3\nprint(power)",
    mentalModel: [
      "Loops repeat blocks of code.",
      "If statements execute only if their condition is True.",
      "Variable values change continuously inside loops."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Initializes power",
        why: "Sets starting power level.",
        memory: [
          { name: "power", value: "10", type: "int", note: "Start value", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Starts loop (i=0)",
        why: "First iteration of the loop.",
        memory: [
          { name: "power", value: "10", type: "int", note: "Start value", accent: "#f472b6" },
          { name: "i", value: "0", type: "int", note: "First loop", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Checks condition",
        why: "10 is > 5, so we enter the if block.",
        memory: [
          { name: "power", value: "10", type: "int", note: "Start value", accent: "#f472b6" },
          { name: "i", value: "0", type: "int", note: "First loop", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Decreases power",
        why: "Subtracts 3 from power.",
        memory: [
          { name: "power", value: "7", type: "int", note: "Decreased", accent: "#c8a45e" },
          { name: "i", value: "0", type: "int", note: "First loop", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Continues loop (i=1)",
        why: "Second iteration of the loop.",
        memory: [
          { name: "power", value: "7", type: "int", note: "Decreased", accent: "#c8a45e" },
          { name: "i", value: "1", type: "int", note: "Second loop", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Checks condition",
        why: "7 is > 5, so we enter the if block again.",
        memory: [
          { name: "power", value: "7", type: "int", note: "Decreased", accent: "#c8a45e" },
          { name: "i", value: "1", type: "int", note: "Second loop", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Decreases power",
        why: "Subtracts 3 from power.",
        memory: [
          { name: "power", value: "4", type: "int", note: "Decreased", accent: "#f472b6" },
          { name: "i", value: "1", type: "int", note: "Second loop", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "Prints final power",
        why: "Loop ends, outputs the result.",
        memory: [
          { name: "power", value: "4", type: "int", note: "Final value", accent: "#f472b6" },
          { name: "i", value: "1", type: "int", note: "Second loop", accent: "#60a5fa" }
        ],
        output: "4\n"
      }
    ]
  },
  'bg3': {
    title: "Data Structures Challenge",
    hook: "Manage an entire inventory with ease.",
    concept: "Lists handle ordered items, dicts handle key-value mappings, and tuples hold fixed data. Combining them forms powerful data structures.",
    code: "chest = {'gold': 50, 'items': ['potion', 'key']}\nchest['gold'] += 10\nchest['items'].append('map')\nprint(chest['items'])",
    mentalModel: [
      "Use dicts for labeled properties (gold, items).",
      "Use lists for sequences that can change.",
      "You can nest lists inside dicts!"
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Creates nested dictionary",
        why: "Sets up initial chest contents.",
        memory: [
          { name: "chest", value: "{'gold': 50, 'items': [...]}", type: "dict", note: "Chest data", accent: "#a78bfa" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Updates dictionary value",
        why: "Adds 10 to the gold amount.",
        memory: [
          { name: "chest", value: "{'gold': 60, 'items': [...]}", type: "dict", note: "Gold increased", accent: "#c8a45e" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Modifies nested list",
        why: "Appends 'map' to the items list inside the dict.",
        memory: [
          { name: "chest", value: "{'gold': 60, 'items': ['potion', 'key', 'map']}", type: "dict", note: "Item added", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Prints items list",
        why: "Outputs the updated list from the dictionary.",
        memory: [
          { name: "chest", value: "{'gold': 60, 'items': ['potion', 'key', 'map']}", type: "dict", note: "Item added", accent: "#34d399" }
        ],
        output: "['potion', 'key', 'map']\n"
      }
    ]
  },
  'bg4': {
    title: "Functions & OOP Finale",
    hook: "Become the true architect of the Python universe.",
    concept: "Classes are blueprints for objects. Methods are functions that belong to objects. This represents the pinnacle of structuring Python code.",
    code: "class Slime:\n    def __init__(self):\n        self.hp = 10\n    def hit(self):\n        self.hp -= 4\ns = Slime()\ns.hit()\nprint(s.hp)",
    mentalModel: [
      "Classes create custom data types.",
      "__init__ sets up the initial state (like hp).",
      "Methods let the object modify itself."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Defines class",
        why: "Python registers the Slime blueprint.",
        memory: [
          { name: "Slime", value: "<class '__main__.Slime'>", type: "type", note: "Blueprint created", accent: "#22d3ee" }
        ],
        output: ""
      },
      {
        line: 6,
        action: "Creates instance",
        why: "Instantiates a new Slime object.",
        memory: [
          { name: "Slime", value: "<class '__main__.Slime'>", type: "type", note: "Blueprint created", accent: "#22d3ee" },
          { name: "s", value: "<Slime object>", type: "Slime", note: "Instance created", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Initializes instance",
        why: "Runs __init__ and sets hp to 10.",
        memory: [
          { name: "Slime", value: "<class '__main__.Slime'>", type: "type", note: "Blueprint created", accent: "#22d3ee" },
          { name: "s", value: "{'hp': 10}", type: "Slime", note: "HP initialized", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 7,
        action: "Calls hit method",
        why: "Triggers behavior on the object.",
        memory: [
          { name: "Slime", value: "<class '__main__.Slime'>", type: "type", note: "Blueprint created", accent: "#22d3ee" },
          { name: "s", value: "{'hp': 10}", type: "Slime", note: "Method called", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "Updates instance state",
        why: "Decreases the object's hp by 4.",
        memory: [
          { name: "Slime", value: "<class '__main__.Slime'>", type: "type", note: "Blueprint created", accent: "#22d3ee" },
          { name: "s", value: "{'hp': 6}", type: "Slime", note: "HP reduced", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 8,
        action: "Prints hp",
        why: "Displays the object's current state.",
        memory: [
          { name: "Slime", value: "<class '__main__.Slime'>", type: "type", note: "Blueprint created", accent: "#22d3ee" },
          { name: "s", value: "{'hp': 6}", type: "Slime", note: "HP reduced", accent: "#f472b6" }
        ],
        output: "6\n"
      }
    ]
  }
};
