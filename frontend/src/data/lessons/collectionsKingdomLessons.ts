import type { LessonDebugContent } from '@/types';

export const COLLECTIONS_KINGDOM_LESSONS: Record<string, LessonDebugContent> = {
  'c3': {
    "title": "Dictionaries",
    "hook": "Need to look up a value using a custom label?",
    "concept": "Dictionaries store data in key-value pairs. Think of a real dictionary where you look up a word (key) to find its definition (value). Keys must be unique!",
    "code": "stats = {\"hp\": 100}\nstats[\"mp\"] = 50\nprint(stats[\"hp\"])",
    "mentalModel": [
      "Created using curly braces `{}` with `key: value` pairs.",
      "Access a value using bracket notation `dict[\"key\"]`.",
      "Keys must be unique and immutable (like strings or numbers)."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Create dictionary",
        "why": "Python allocates memory for a dictionary with one pair.",
        "memory": [
          { "name": "stats", "value": "{'hp': 100}", "type": "dict", "note": "Created dict", "accent": "#c8a45e" }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Add new key-value",
        "why": "We insert a new key 'mp' with the value 50.",
        "memory": [
          { "name": "stats", "value": "{'hp': 100, 'mp': 50}", "type": "dict", "note": "Added 'mp'", "accent": "#c8a45e" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Access and print",
        "why": "Python looks up 'hp' in the dict and finds 100.",
        "memory": [
          { "name": "stats", "value": "{'hp': 100, 'mp': 50}", "type": "dict", "note": "Lookup 'hp'", "accent": "#c8a45e" }
        ],
        "output": "100\n"
      }
    ]
  },
  'c4': {
    "title": "Tuples & Sets",
    "hook": "What if you need data that cannot change or cannot have duplicates?",
    "concept": "Tuples are like lists but they are immutable (cannot be changed after creation). Sets are collections of unique elements without any specific order.",
    "code": "tup = (1, 2)\nuniq = {1, 1, 2}\nprint(tup[0])\nprint(uniq)",
    "mentalModel": [
      "Tuples use `()` and are immutable.",
      "Sets use `{}` and automatically remove duplicate values.",
      "Sets do not maintain element order."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Create tuple",
        "why": "Python creates a tuple which is locked from changing.",
        "memory": [
          { "name": "tup", "value": "(1, 2)", "type": "tuple", "note": "Created tuple", "accent": "#a78bfa" }
        ],
        "output": ""
      },
      {
        "line": 2,
        "action": "Create set",
        "why": "The set ignores the duplicate `1`.",
        "memory": [
          { "name": "tup", "value": "(1, 2)", "type": "tuple", "note": "Unchanged", "accent": "#a78bfa" },
          { "name": "uniq", "value": "{1, 2}", "type": "set", "note": "Duplicates removed", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Print tuple element",
        "why": "Accessing tuple works just like lists via index.",
        "memory": [
          { "name": "tup", "value": "(1, 2)", "type": "tuple", "note": "Unchanged", "accent": "#a78bfa" },
          { "name": "uniq", "value": "{1, 2}", "type": "set", "note": "Unchanged", "accent": "#34d399" }
        ],
        "output": "1\n"
      },
      {
        "line": 4,
        "action": "Print set",
        "why": "Outputting the unique elements.",
        "memory": [
          { "name": "tup", "value": "(1, 2)", "type": "tuple", "note": "Unchanged", "accent": "#a78bfa" },
          { "name": "uniq", "value": "{1, 2}", "type": "set", "note": "Unchanged", "accent": "#34d399" }
        ],
        "output": "1\n{1, 2}\n"
      }
    ]
  }
};
