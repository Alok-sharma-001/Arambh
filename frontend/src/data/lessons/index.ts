import type { LessonDebugContent } from '@/types';

export const lessons: Record<string, LessonDebugContent> = {
  'default': {
    "title": "How Python Reads Code",
    "hook": "Python runs one line at a time and updates memory as it goes.",
    "concept": "Before solving questions, watch what each line changes. That habit is the foundation for debugging.",
    "code": "topic = \"Python\"\\nstep = 1\\nprint(topic)\\nprint(step)",
    "mentalModel": [
        "Run one line.",
        "Update memory if the line stores a value.",
        "Read memory if the line uses a variable name.",
        "Check output only when print runs."
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Store the text value \"Python\".",
            "why": "Python remembers the value using the name topic.",
            "memory": [
                {
                    "name": "topic",
                    "value": "\"Python\"",
                    "type": "str",
                    "note": "Created on line 1",
                    "accent": "#34d399"
                }
            ],
            "output": ""
        },
        {
            "line": 2,
            "action": "Store the number 1.",
            "why": "Python now has two names available.",
            "memory": [
                {
                    "name": "topic",
                    "value": "\"Python\"",
                    "type": "str",
                    "note": "Still remembered",
                    "accent": "#34d399"
                },
                {
                    "name": "step",
                    "value": "1",
                    "type": "int",
                    "note": "Created on line 2",
                    "accent": "#60a5fa"
                }
            ],
            "output": ""
        },
        {
            "line": 3,
            "action": "Print the value stored in topic.",
            "why": "print reads the variable value and sends it to the console.",
            "memory": [
                {
                    "name": "topic",
                    "value": "\"Python\"",
                    "type": "str",
                    "note": "Read on line 3",
                    "accent": "#34d399"
                },
                {
                    "name": "step",
                    "value": "1",
                    "type": "int",
                    "note": "Waiting in memory",
                    "accent": "#60a5fa"
                }
            ],
            "output": "Python"
        },
        {
            "line": 4,
            "action": "Print the value stored in step.",
            "why": "Memory stays the same because this line only reads.",
            "memory": [
                {
                    "name": "topic",
                    "value": "\"Python\"",
                    "type": "str",
                    "note": "Still in memory",
                    "accent": "#34d399"
                },
                {
                    "name": "step",
                    "value": "1",
                    "type": "int",
                    "note": "Read on line 4",
                    "accent": "#60a5fa"
                }
            ],
            "output": "Python\\n1"
        }
    ]
},
  'v1': {
    "title": "What is a Variable?",
    "hook": "A variable points to a value.",
    "concept": "Think of memory like boxes.",
    "code": "name = \"Ava\"\\nlevel = 1\\nprint(name)",
    "mentalModel": [
        "Assign",
        "Read"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Create name",
            "why": "Stores string",
            "memory": [
                {
                    "name": "name",
                    "value": "\"Ava\"",
                    "type": "str",
                    "note": "Created",
                    "accent": "#34d399"
                }
            ],
            "output": ""
        },
        {
            "line": 2,
            "action": "Create level",
            "why": "Stores int",
            "memory": [
                {
                    "name": "name",
                    "value": "\"Ava\"",
                    "type": "str",
                    "note": "",
                    "accent": "#34d399"
                },
                {
                    "name": "level",
                    "value": "1",
                    "type": "int",
                    "note": "",
                    "accent": "#60a5fa"
                }
            ],
            "output": ""
        },
        {
            "line": 3,
            "action": "Print name",
            "why": "Reads memory",
            "memory": [
                {
                    "name": "name",
                    "value": "\"Ava\"",
                    "type": "str",
                    "note": "Read",
                    "accent": "#34d399"
                }
            ],
            "output": "Ava"
        }
    ]
},
  'v2': {
    "title": "Assigning Values",
    "hook": "Assigning is linking.",
    "concept": "Use = to assign.",
    "code": "x = 10\\ny = x\\nprint(y)",
    "mentalModel": [
        "x holds 10",
        "y copies x"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: x = 10\\ny = x\\nprint(y)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'v3': {
    "title": "Naming Rules",
    "hook": "Names matter.",
    "concept": "No spaces, start with letter.",
    "code": "player_hp = 100\\nprint(player_hp)",
    "mentalModel": [
        "Valid names only"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: player_hp = 100\\nprint(player_hp)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'v4': {
    "title": "Reassigning",
    "hook": "Variables can change.",
    "concept": "Update values.",
    "code": "score = 0\\nscore = 10\\nprint(score)",
    "mentalModel": [
        "Overwrite old value"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: score = 0\\nscore = 10\\nprint(score)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'd1': {
    "title": "Understanding Types",
    "hook": "Data has types.",
    "concept": "Strings, ints, floats.",
    "code": "a = \"text\"\\nb = 5\\nprint(type(a))",
    "mentalModel": [
        "Know your types"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: a = \"text\"\\nb = 5\\nprint(type(a))",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'd2': {
    "title": "Strings and Numbers",
    "hook": "Text vs Math.",
    "concept": "Don't mix them wrong.",
    "code": "msg = \"HP: \"\\nhp = 50\\nprint(msg, hp)",
    "mentalModel": [
        "Separate handling"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: msg = \"HP: \"\\nhp = 50\\nprint(msg, hp)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'd3': {
    "title": "Booleans",
    "hook": "True or False.",
    "concept": "Logic gates.",
    "code": "is_alive = True\\nprint(is_alive)",
    "mentalModel": [
        "Binary logic"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: is_alive = True\\nprint(is_alive)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'd4': {
    "title": "Type Conversion",
    "hook": "Change types.",
    "concept": "int() and str().",
    "code": "x = \"5\"\\ny = int(x)\\nprint(y+1)",
    "mentalModel": [
        "Casting"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: x = \"5\"\\ny = int(x)\\nprint(y+1)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'l1': {
    "title": "Intro to Loops",
    "hook": "Repeat code.",
    "concept": "Don't copy paste.",
    "code": "for i in [1,2]:\\n    print(i)",
    "mentalModel": [
        "Iteration"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: for i in [1,2]:\\n    print(i)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'l2': {
    "title": "For Loops",
    "hook": "Iterate over collections.",
    "concept": "range() is useful.",
    "code": "for i in range(3):\\n    print(i)",
    "mentalModel": [
        "Sequence traversal"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: for i in range(3):\\n    print(i)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'l3': {
    "title": "While Loops",
    "hook": "Condition based.",
    "concept": "Runs until false.",
    "code": "hp = 2\\nwhile hp > 0:\\n    hp -= 1",
    "mentalModel": [
        "Condition check"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: hp = 2\\nwhile hp > 0:\\n    hp -= 1",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'l4': {
    "title": "Break & Continue",
    "hook": "Loop control.",
    "concept": "Skip or stop.",
    "code": "for i in range(5):\\n    if i==2: break\\n    print(i)",
    "mentalModel": [
        "Manual control"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: for i in range(5):\\n    if i==2: break\\n    print(i)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'f1': {
    "title": "What are Functions?",
    "hook": "Reusable blocks.",
    "concept": "Define once, use many.",
    "code": "def greet():\\n    print(\"Hi\")\\ngreet()",
    "mentalModel": [
        "Abstraction"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: def greet():\\n    print(\"Hi\")\\ngreet()",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'f2': {
    "title": "Defining Functions",
    "hook": "def keyword.",
    "concept": "Structure of a func.",
    "code": "def attack():\\n    return 10",
    "mentalModel": [
        "Syntax"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: def attack():\\n    return 10",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'f3': {
    "title": "Parameters",
    "hook": "Pass data in.",
    "concept": "Arguments.",
    "code": "def hit(dmg):\\n    print(dmg)\\nhit(5)",
    "mentalModel": [
        "Inputs"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: def hit(dmg):\\n    print(dmg)\\nhit(5)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'f4': {
    "title": "Return Values",
    "hook": "Get data out.",
    "concept": "Scope matters.",
    "code": "def add(a,b):\\n    return a+b\\nx = add(2,3)",
    "mentalModel": [
        "Outputs"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: def add(a,b):\\n    return a+b\\nx = add(2,3)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'c1': {
    "title": "Intro to Lists",
    "hook": "Ordered data.",
    "concept": "Arrays.",
    "code": "items = [\"sword\", \"bow\"]\\nprint(items[0])",
    "mentalModel": [
        "Indexing"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: items = [\"sword\", \"bow\"]\\nprint(items[0])",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'c2': {
    "title": "List Methods",
    "hook": "Append, pop.",
    "concept": "Mutation.",
    "code": "arr = []\\narr.append(1)\\nprint(arr)",
    "mentalModel": [
        "Modifying"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: arr = []\\narr.append(1)\\nprint(arr)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'c3': {
    "title": "Dictionaries",
    "hook": "Key-value pairs.",
    "concept": "Fast lookups.",
    "code": "d = {\"hp\": 10}\\nprint(d[\"hp\"])",
    "mentalModel": [
        "Mapping"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: d = {\"hp\": 10}\\nprint(d[\"hp\"])",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'c4': {
    "title": "Sets & Tuples",
    "hook": "Unique / Immutable.",
    "concept": "Fixed data.",
    "code": "t = (1,2)\\ns = {1,1,2}\\nprint(s)",
    "mentalModel": [
        "Constraints"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: t = (1,2)\\ns = {1,1,2}\\nprint(s)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'o1': {
    "title": "What is OOP?",
    "hook": "Objects.",
    "concept": "State and behavior.",
    "code": "class Hero:\\n    pass",
    "mentalModel": [
        "Modeling"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: class Hero:\\n    pass",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'o2': {
    "title": "Creating Classes",
    "hook": "The blueprint.",
    "concept": "__init__ method.",
    "code": "class Dog:\\n    def __init__(self):\\n        self.hp = 10",
    "mentalModel": [
        "Constructor"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: class Dog:\\n    def __init__(self):\\n        self.hp = 10",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'o3': {
    "title": "Inheritance",
    "hook": "Parent to child.",
    "concept": "Code reuse.",
    "code": "class Cat(Dog):\\n    pass",
    "mentalModel": [
        "Hierarchy"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: class Cat(Dog):\\n    pass",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'o4': {
    "title": "Encapsulation",
    "hook": "Hiding data.",
    "concept": "Methods.",
    "code": "class Box:\\n    def get_val(self):\\n        return 5",
    "mentalModel": [
        "Protection"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: class Box:\\n    def get_val(self):\\n        return 5",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'e1': {
    "title": "Understanding Errors",
    "hook": "Things break.",
    "concept": "Tracebacks.",
    "code": "print(1/0)",
    "mentalModel": [
        "Crash"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Crash imminent\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'e2': {
    "title": "Try & Except",
    "hook": "Catching errors.",
    "concept": "Safety net.",
    "code": "try:\\n    1/0\\nexcept:\\n    print(\"Caught\")",
    "mentalModel": [
        "Handling"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: try:\\n    1/0\\nexcept:\\n    print(\"Caught\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'e3': {
    "title": "Finally",
    "hook": "Always runs.",
    "concept": "Cleanup.",
    "code": "try:\\n    pass\\nfinally:\\n    print(\"Done\")",
    "mentalModel": [
        "Guarantees"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: try:\\n    pass\\nfinally:\\n    print(\"Done\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'e4': {
    "title": "Custom Exceptions",
    "hook": "Raise your own.",
    "concept": "Domain errors.",
    "code": "raise ValueError(\"Bad\")",
    "mentalModel": [
        "Throwing"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Raising error\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'fs1': {
    "title": "Reading Files",
    "hook": "Disk access.",
    "concept": "open()",
    "code": "f = open(\"x.txt\", \"r\")",
    "mentalModel": [
        "I/O"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Reading file\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'fs2': {
    "title": "Writing Files",
    "hook": "Save data.",
    "concept": "\"w\" mode.",
    "code": "f = open(\"x.txt\", \"w\")",
    "mentalModel": [
        "Persistence"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Writing file\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'fs3': {
    "title": "Context Managers",
    "hook": "with statement.",
    "concept": "Auto close.",
    "code": "with open(\"x\", \"w\") as f:\\n    pass",
    "mentalModel": [
        "Safety"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Context manager\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'fs4': {
    "title": "Working with JSON",
    "hook": "Serialization.",
    "concept": "json module.",
    "code": "import json\\nprint(json.dumps({}))",
    "mentalModel": [
        "APIs"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: import json\\nprint(json.dumps({}))",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'm1': {
    "title": "Import Statements",
    "hook": "Using others code.",
    "concept": "import x",
    "code": "import math\\nprint(math.pi)",
    "mentalModel": [
        "Reusability"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: import math\\nprint(math.pi)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'm2': {
    "title": "Standard Library",
    "hook": "Batteries included.",
    "concept": "os, sys, math.",
    "code": "import os",
    "mentalModel": [
        "Built-ins"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: import os",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'm3': {
    "title": "Creating Modules",
    "hook": "Your own files.",
    "concept": "import my_file",
    "code": "print(\"My module\")",
    "mentalModel": [
        "Organization"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"My module\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'm4': {
    "title": "Packages",
    "hook": "Folders of modules.",
    "concept": "__init__.py",
    "code": "print(\"Packages\")",
    "mentalModel": [
        "Architecture"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Packages\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'a1': {
    "title": "Big O Notation",
    "hook": "Time complexity.",
    "concept": "O(N).",
    "code": "for i in range(10):\\n    pass",
    "mentalModel": [
        "Scaling"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: for i in range(10):\\n    pass",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'a2': {
    "title": "Sorting Algorithms",
    "hook": "Order data.",
    "concept": "Bubble, Quick.",
    "code": "arr = [2,1]\\narr.sort()",
    "mentalModel": [
        "Efficiency"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: arr = [2,1]\\narr.sort()",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'a3': {
    "title": "Search Algorithms",
    "hook": "Find data.",
    "concept": "Binary search.",
    "code": "arr = [1,2,3]\\nprint(2 in arr)",
    "mentalModel": [
        "Lookups"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: arr = [1,2,3]\\nprint(2 in arr)",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'a4': {
    "title": "Optimization",
    "hook": "Make it faster.",
    "concept": "Caching, dicts.",
    "code": "memo = {}\\nmemo[1] = 1",
    "mentalModel": [
        "Speed"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: memo = {}\\nmemo[1] = 1",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'bg1': {
    "title": "Final Challenge I",
    "hook": "Combine basics.",
    "concept": "Vars, loops, functions.",
    "code": "print(\"Stage 1\")",
    "mentalModel": [
        "Synthesis"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Stage 1\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'bg2': {
    "title": "Final Challenge II",
    "hook": "Data mastery.",
    "concept": "Dicts and classes.",
    "code": "print(\"Stage 2\")",
    "mentalModel": [
        "Architecture"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Stage 2\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'bg3': {
    "title": "Final Challenge III",
    "hook": "System design.",
    "concept": "Files and errors.",
    "code": "print(\"Stage 3\")",
    "mentalModel": [
        "Robustness"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"Stage 3\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
  'bg4': {
    "title": "The Legend Test",
    "hook": "Everything.",
    "concept": "Prove your worth.",
    "code": "print(\"You are a legend!\")",
    "mentalModel": [
        "Mastery"
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Executing: print(\"You are a legend!\")",
            "why": "Python processes this statement.",
            "memory": [
                {
                    "name": "status",
                    "value": "\"running\"",
                    "type": "str",
                    "note": "Line 1",
                    "accent": "#60a5fa"
                }
            ],
            "output": "..."
        }
    ]
},
};
