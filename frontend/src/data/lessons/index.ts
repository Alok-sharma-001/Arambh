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
    "title": "Everyone Loves Lists",
    "hook": "Python's most powerful data structure starts with two simple brackets: []",
    "concept": "A list stores multiple items in order. You create one with square brackets, access items by their index number (starting from 0), and grow it dynamically with .append().",
    "code": "cast = []\\ncast.append(\"Cleese\")\\ncast.append(\"Palin\")\\ncast.append(\"Jones\")\\nprint(\"Cast:\", cast)\\nprint(\"Lead:\", cast[0])",
    "mentalModel": [
        "A list is created empty with [].",
        ".append() adds one item to the end of the list.",
        "Items are numbered starting from 0 (zero-indexed).",
        "print() can display the entire list or a single item by index."
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Create an empty list and label it 'cast'.",
            "why": "Square brackets [] tell Python to create a new, empty list in memory. The name 'cast' now points to this list.",
            "memory": [
                {
                    "name": "cast",
                    "value": "[]",
                    "type": "list",
                    "note": "Empty list created",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 2,
            "action": "Append \"Cleese\" to the cast list.",
            "why": ".append() adds the string \"Cleese\" as the first item (index 0). The list now has 1 item.",
            "memory": [
                {
                    "name": "cast",
                    "value": "[\"Cleese\"]",
                    "type": "list",
                    "note": "1 item — index 0",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 3,
            "action": "Append \"Palin\" to the cast list.",
            "why": ".append() adds \"Palin\" after \"Cleese\". It becomes index 1. The list now has 2 items.",
            "memory": [
                {
                    "name": "cast",
                    "value": "[\"Cleese\", \"Palin\"]",
                    "type": "list",
                    "note": "2 items — indices 0, 1",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 4,
            "action": "Append \"Jones\" to the cast list.",
            "why": "\"Jones\" takes index 2. Notice: indices always go 0, 1, 2… never starting from 1!",
            "memory": [
                {
                    "name": "cast",
                    "value": "[\"Cleese\", \"Palin\", \"Jones\"]",
                    "type": "list",
                    "note": "3 items — indices 0, 1, 2",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 5,
            "action": "Print the entire cast list.",
            "why": "print() with a list shows all items including the brackets. This is useful for debugging.",
            "memory": [
                {
                    "name": "cast",
                    "value": "[\"Cleese\", \"Palin\", \"Jones\"]",
                    "type": "list",
                    "note": "Unchanged — print only reads",
                    "accent": "#c8a45e"
                }
            ],
            "output": "Cast: ['Cleese', 'Palin', 'Jones']"
        },
        {
            "line": 6,
            "action": "Print the item at index 0 of the cast list.",
            "why": "cast[0] reads the first item without removing it. Index 0 always means 'the first item'.",
            "memory": [
                {
                    "name": "cast",
                    "value": "[\"Cleese\", \"Palin\", \"Jones\"]",
                    "type": "list",
                    "note": "Read at index 0",
                    "accent": "#c8a45e"
                }
            ],
            "output": "Cast: ['Cleese', 'Palin', 'Jones']\\nLead: Cleese"
        }
    ]
},
  'c2': {
    "title": "Adding Data to Your List",
    "hook": "Lists grow and shrink dynamically — master append, extend, insert, and pop.",
    "concept": "Lists are mutable: you can add items with .append() and .extend(), insert at any position with .insert(), and remove the last item with .pop(). Each operation changes the list in place.",
    "code": "movies = []\\nmovies.append(\"Holy Grail\")\\nmovies.append(\"Life of Brian\")\\nmovies.extend([\"Meaning of Life\", \"Spamalot\"])\\nprint(\"All:\", movies)\\nremoved = movies.pop()\\nprint(\"Removed:\", removed)\\nprint(\"Remaining:\", movies)\\nprint(\"Count:\", len(movies))",
    "mentalModel": [
        ".append(x) adds ONE item x to the end.",
        ".extend([a, b]) adds EACH item from the list individually.",
        ".pop() removes and returns the last item.",
        "len(list) tells you how many items remain."
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Create an empty list called 'movies'.",
            "why": "We start with nothing. The list exists but has zero items inside.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[]",
                    "type": "list",
                    "note": "Empty — length 0",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 2,
            "action": "Append \"Holy Grail\" to movies.",
            "why": ".append() places \"Holy Grail\" at index 0. The list now has 1 item.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[\"Holy Grail\"]",
                    "type": "list",
                    "note": "1 item after append",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 3,
            "action": "Append \"Life of Brian\" to movies.",
            "why": "\"Life of Brian\" goes to index 1. Items are always appended to the END.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[\"Holy Grail\", \"Life of Brian\"]",
                    "type": "list",
                    "note": "2 items after append",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 4,
            "action": "Extend movies with [\"Meaning of Life\", \"Spamalot\"].",
            "why": ".extend() unpacks the given list and adds EACH item individually. This is different from .append() which would add the entire list as one nested item.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[\"Holy Grail\", \"Life of Brian\", \"Meaning of Life\", \"Spamalot\"]",
                    "type": "list",
                    "note": "4 items after extend",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 5,
            "action": "Print all movies.",
            "why": "Displays the full list contents to confirm our additions worked.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[\"Holy Grail\", \"Life of Brian\", \"Meaning of Life\", \"Spamalot\"]",
                    "type": "list",
                    "note": "Read by print",
                    "accent": "#c8a45e"
                }
            ],
            "output": "All: ['Holy Grail', 'Life of Brian', 'Meaning of Life', 'Spamalot']"
        },
        {
            "line": 6,
            "action": "Pop the last item from movies and store it in 'removed'.",
            "why": ".pop() removes the LAST item and returns it. The list shrinks by 1. The removed value is saved in 'removed'.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[\"Holy Grail\", \"Life of Brian\", \"Meaning of Life\"]",
                    "type": "list",
                    "note": "3 items after pop",
                    "accent": "#c8a45e"
                },
                {
                    "name": "removed",
                    "value": "\"Spamalot\"",
                    "type": "str",
                    "note": "Returned by .pop()",
                    "accent": "#34d399"
                }
            ],
            "output": "All: ['Holy Grail', 'Life of Brian', 'Meaning of Life', 'Spamalot']"
        },
        {
            "line": 7,
            "action": "Print the removed item.",
            "why": "Confirms that .pop() both removed and returned 'Spamalot'.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[\"Holy Grail\", \"Life of Brian\", \"Meaning of Life\"]",
                    "type": "list",
                    "note": "Unchanged",
                    "accent": "#c8a45e"
                },
                {
                    "name": "removed",
                    "value": "\"Spamalot\"",
                    "type": "str",
                    "note": "Still in memory",
                    "accent": "#34d399"
                }
            ],
            "output": "All: ['Holy Grail', 'Life of Brian', 'Meaning of Life', 'Spamalot']\\nRemoved: Spamalot"
        },
        {
            "line": 8,
            "action": "Print the remaining movies list.",
            "why": "The list now has 3 items. 'Spamalot' is gone — .pop() permanently removed it.",
            "memory": [
                {
                    "name": "movies",
                    "value": "[\"Holy Grail\", \"Life of Brian\", \"Meaning of Life\"]",
                    "type": "list",
                    "note": "Final state",
                    "accent": "#c8a45e"
                },
                {
                    "name": "removed",
                    "value": "\"Spamalot\"",
                    "type": "str",
                    "note": "Still accessible",
                    "accent": "#34d399"
                }
            ],
            "output": "All: ['Holy Grail', 'Life of Brian', 'Meaning of Life', 'Spamalot']\\nRemoved: Spamalot\\nRemaining: ['Holy Grail', 'Life of Brian', 'Meaning of Life']"
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
    "title": "The Module Namespace",
    "hook": "Keep your code tidy by loading functions from separate files.",
    "concept": "The import statement loads a module into its own namespace. To call a function inside it, you must use dot notation.",
    "code": "import nester\n\nmovies = [\"The Holy Grail\", \"Life of Brian\"]\nnester.print_lol(movies)",
    "mentalModel": [
        "import nester creates a container named nester.",
        "All functions in the module are stored inside that container.",
        "Use nester.print_lol to fetch and run the function."
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Load the nester module.",
            "why": "Python looks for a file named nester.py, runs it, and registers the name 'nester' in the global scope pointing to the module.",
            "memory": [
                {
                    "name": "nester",
                    "value": "<module 'nester' from 'nester.py'>",
                    "type": "module",
                    "note": "Imported namespace",
                    "accent": "#a78bfa"
                }
            ],
            "output": ""
        },
        {
            "line": 3,
            "action": "Create a list of movie titles.",
            "why": "Assigns a two-element list to the variable 'movies' in global memory.",
            "memory": [
                {
                    "name": "nester",
                    "value": "<module 'nester' from 'nester.py'>",
                    "type": "module",
                    "note": "Imported namespace",
                    "accent": "#a78bfa"
                },
                {
                    "name": "movies",
                    "value": "[\"The Holy Grail\", \"Life of Brian\"]",
                    "type": "list",
                    "note": "List of strings",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 4,
            "action": "Call print_lol inside the nester module namespace.",
            "why": "Accesses print_lol inside the nester namespace and executes it with movies as the argument.",
            "memory": [
                {
                    "name": "nester",
                    "value": "<module 'nester' from 'nester.py'>",
                    "type": "module",
                    "note": "Imported namespace",
                    "accent": "#a78bfa"
                },
                {
                    "name": "movies",
                    "value": "[\"The Holy Grail\", \"Life of Brian\"]",
                    "type": "list",
                    "note": "Passed to print_lol",
                    "accent": "#c8a45e"
                }
            ],
            "output": "The Holy Grail\nLife of Brian"
        }
    ]
},
  'm2': {
    "title": "Flexible Functions",
    "hook": "Default arguments let you call functions with fewer values, while keywords let you specify arguments in any order.",
    "concept": "Parameters can have default values. If you omit them, the default is used. Keyword arguments let you name parameters during the call.",
    "code": "def greet(name, greeting=\"Hello\"):\n    print(greeting + \", \" + name)\n\ngreet(\"Ava\")\ngreet(\"Ava\", greeting=\"Hail\")",
    "mentalModel": [
        "Parameters with '=' are optional.",
        "Keyword arguments override defaults by name."
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Define the greet function with a default parameter.",
            "why": "Registers the function 'greet' with parameters 'name' and 'greeting' (defaulting to 'Hello').",
            "memory": [
                {
                    "name": "greet",
                    "value": "<function greet at 0x7f8>",
                    "type": "function",
                    "note": "greeting default is 'Hello'",
                    "accent": "#a78bfa"
                }
            ],
            "output": ""
        },
        {
            "line": 4,
            "action": "Call greet with one argument.",
            "why": "name is bound to 'Ava'. Since greeting is omitted, it defaults to 'Hello'.",
            "memory": [
                {
                    "name": "greet",
                    "value": "<function greet at 0x7f8>",
                    "type": "function",
                    "note": "Function registered",
                    "accent": "#a78bfa"
                },
                {
                    "name": "name",
                    "value": "\"Ava\"",
                    "type": "str",
                    "note": "Positional param",
                    "accent": "#34d399"
                },
                {
                    "name": "greeting",
                    "value": "\"Hello\"",
                    "type": "str",
                    "note": "Used default",
                    "accent": "#60a5fa"
                }
            ],
            "output": "Hello, Ava"
        },
        {
            "line": 5,
            "action": "Call greet with a keyword argument.",
            "why": "We pass greeting='Hail' explicitly. This overrides the default value.",
            "memory": [
                {
                    "name": "greet",
                    "value": "<function greet at 0x7f8>",
                    "type": "function",
                    "note": "Function registered",
                    "accent": "#a78bfa"
                },
                {
                    "name": "name",
                    "value": "\"Ava\"",
                    "type": "str",
                    "note": "Positional param",
                    "accent": "#34d399"
                },
                {
                    "name": "greeting",
                    "value": "\"Hail\"",
                    "type": "str",
                    "note": "Overridden default",
                    "accent": "#60a5fa"
                }
            ],
            "output": "Hello, Ava\nHail, Ava"
        }
    ]
},
  'm3': {
    "title": "The Recursion Stack",
    "hook": "Watch the call stack grow and shrink as a function calls itself to flatten a nested list.",
    "concept": "A function can call itself. Each recursive call pushes a new frame onto Python's Call Stack to hold its local variables.",
    "code": "def print_lol(the_list):\n    for item in the_list:\n        if isinstance(item, list):\n            print_lol(item)\n        else:\n            print(item)\n\ndata = [\"Cleese\", [\"Palin\"]]\nprint_lol(data)",
    "mentalModel": [
        "Each call pushes a new layer (frame) onto the stack.",
        "Local variable 'the_list' is separate in each stack frame."
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Define the print_lol function.",
            "why": "Registers the print_lol function in global memory.",
            "memory": [
                {
                    "name": "print_lol",
                    "value": "<function print_lol at 0x8a1>",
                    "type": "function",
                    "note": "Recursive function",
                    "accent": "#a78bfa"
                }
            ],
            "output": ""
        },
        {
            "line": 8,
            "action": "Create the nested data list.",
            "why": "Creates a list with a string at index 0 and a nested list at index 1.",
            "memory": [
                {
                    "name": "print_lol",
                    "value": "<function print_lol at 0x8a1>",
                    "type": "function",
                    "note": "Recursive function",
                    "accent": "#a78bfa"
                },
                {
                    "name": "data",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "Nested list",
                    "accent": "#c8a45e"
                }
            ],
            "output": ""
        },
        {
            "line": 9,
            "action": "Call print_lol(data) - Level 1 frame created.",
            "why": "Pushes the first frame for print_lol. inside this frame, the_list points to data.",
            "memory": [
                {
                    "name": "data",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "Global list",
                    "accent": "#c8a45e"
                },
                {
                    "name": "[print_lol L1] the_list",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "First stack frame",
                    "accent": "#60a5fa"
                }
            ],
            "output": ""
        },
        {
            "line": 2,
            "action": "Process first item of the_list: \"Cleese\".",
            "why": "Since 'Cleese' is a string and not a list, Python jumps to the else block.",
            "memory": [
                {
                    "name": "[print_lol L1] the_list",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "Active frame",
                    "accent": "#60a5fa"
                },
                {
                    "name": "[print_lol L1] item",
                    "value": "\"Cleese\"",
                    "type": "str",
                    "note": "String value",
                    "accent": "#34d399"
                }
            ],
            "output": ""
        },
        {
            "line": 6,
            "action": "Print \"Cleese\".",
            "why": "Prints the string directly to stdout.",
            "memory": [
                {
                    "name": "[print_lol L1] the_list",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "Active frame",
                    "accent": "#60a5fa"
                },
                {
                    "name": "[print_lol L1] item",
                    "value": "\"Cleese\"",
                    "type": "str",
                    "note": "Printed",
                    "accent": "#34d399"
                }
            ],
            "output": "Cleese"
        },
        {
            "line": 2,
            "action": "Process second item: [\"Palin\"].",
            "why": "Since the item is a list, isinstance(item, list) is True.",
            "memory": [
                {
                    "name": "[print_lol L1] the_list",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "Active frame",
                    "accent": "#60a5fa"
                },
                {
                    "name": "[print_lol L1] item",
                    "value": "[\"Palin\"]",
                    "type": "list",
                    "note": "List found",
                    "accent": "#c8a45e"
                }
            ],
            "output": "Cleese"
        },
        {
            "line": 4,
            "action": "Call print_lol recursively - Level 2 frame created.",
            "why": "Pushes a new stack frame for print_lol(item). inside this L2 frame, the_list is ['Palin'].",
            "memory": [
                {
                    "name": "[print_lol L1] the_list",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "Suspended frame",
                    "accent": "#60a5fa"
                },
                {
                    "name": "[print_lol L2] the_list",
                    "value": "[\"Palin\"]",
                    "type": "list",
                    "note": "Active recursive frame",
                    "accent": "#a78bfa"
                }
            ],
            "output": "Cleese"
        },
        {
            "line": 2,
            "action": "Process item in L2 the_list: \"Palin\".",
            "why": "Palin is a string, so go to the else block.",
            "memory": [
                {
                    "name": "[print_lol L2] the_list",
                    "value": "[\"Palin\"]",
                    "type": "list",
                    "note": "Active frame",
                    "accent": "#a78bfa"
                },
                {
                    "name": "[print_lol L2] item",
                    "value": "\"Palin\"",
                    "type": "str",
                    "note": "String value",
                    "accent": "#34d399"
                }
            ],
            "output": "Cleese"
        },
        {
            "line": 6,
            "action": "Print \"Palin\".",
            "why": "Prints to stdout.",
            "memory": [
                {
                    "name": "[print_lol L2] the_list",
                    "value": "[\"Palin\"]",
                    "type": "list",
                    "note": "Active frame",
                    "accent": "#a78bfa"
                },
                {
                    "name": "[print_lol L2] item",
                    "value": "\"Palin\"",
                    "type": "str",
                    "note": "Printed",
                    "accent": "#34d399"
                }
            ],
            "output": "Cleese\nPalin"
        },
        {
            "line": 9,
            "action": "L2 completes. Stack shrinks back to L1.",
            "why": "The L2 frame is destroyed. Execution resumes in the L1 frame at line 4.",
            "memory": [
                {
                    "name": "[print_lol L1] the_list",
                    "value": "[\"Cleese\", [\"Palin\"]]",
                    "type": "list",
                    "note": "Resumed L1 frame",
                    "accent": "#60a5fa"
                }
            ],
            "output": "Cleese\nPalin"
        }
    ]
},
  'm4': {
    "title": "Packages & Distribution",
    "hook": "Prepare your code for the world using setup.py.",
    "concept": "A package is a folder with modules. We use a setup.py file to configure installation via pip.",
    "code": "from distutils.core import setup\n\nsetup(\n    name='nester',\n    version='1.0.0',\n    py_modules=['nester'],\n    author='Scribe'\n)",
    "mentalModel": [
        "setup.py acts as a passport for your code.",
        "distutils handles building and registering module packages."
    ],
    "debuggerSteps": [
        {
            "line": 1,
            "action": "Import the setup function.",
            "why": "Loads standard distribution utility tool.",
            "memory": [
                {
                    "name": "setup",
                    "value": "<function setup>",
                    "type": "function",
                    "note": "Imported helper",
                    "accent": "#a78bfa"
                }
            ],
            "output": ""
        },
        {
            "line": 3,
            "action": "Call setup with package metadata.",
            "why": "Generates build files and packages nester.py.",
            "memory": [
                {
                    "name": "setup",
                    "value": "<function setup>",
                    "type": "function",
                    "note": "Called successfully",
                    "accent": "#a78bfa"
                }
            ],
            "output": "Package built: nester 1.0.0"
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
