import type { LessonDebugContent } from '@/types';

export const OOP_CITADEL_LESSONS: Record<string, LessonDebugContent> = {
  'o1': {
    "title": "Classes & Objects",
    "hook": "Want to build your own custom data types?",
    "concept": "A Class is a blueprint for creating objects. An Object (or instance) is a specific copy built from that blueprint.",
    "code": "class Cat:\n    pass\nmy_cat = Cat()\nprint(type(my_cat))",
    "mentalModel": [
      "`class` defines a new blueprint.",
      "Calling the class like a function `Class()` creates a new object.",
      "Each object is a unique instance in memory."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Define Class",
        "why": "Python registers the `Cat` blueprint.",
        "memory": [
          { "name": "Cat", "value": "<class 'Cat'>", "type": "type", "note": "Blueprint created", "accent": "#f472b6" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Instantiate Object",
        "why": "We build a real `Cat` object and store it in `my_cat`.",
        "memory": [
          { "name": "Cat", "value": "<class 'Cat'>", "type": "type", "note": "Unchanged", "accent": "#f472b6" },
          { "name": "my_cat", "value": "<Cat object>", "type": "Cat", "note": "New instance", "accent": "#60a5fa" }
        ],
        "output": ""
      },
      {
        "line": 4,
        "action": "Print type",
        "why": "Python confirms `my_cat` is indeed a `Cat`.",
        "memory": [
          { "name": "Cat", "value": "<class 'Cat'>", "type": "type", "note": "Unchanged", "accent": "#f472b6" },
          { "name": "my_cat", "value": "<Cat object>", "type": "Cat", "note": "Unchanged", "accent": "#60a5fa" }
        ],
        "output": "<class '__main__.Cat'>\n"
      }
    ]
  },
  'o2': {
    "title": "The __init__ Method",
    "hook": "How do we give our objects their own starting stats?",
    "concept": "The `__init__` method is a special function called a constructor. It runs automatically when an object is created to set up its initial state.",
    "code": "class Hero:\n    def __init__(self, name):\n        self.name = name\nh = Hero(\"Alok\")\nprint(h.name)",
    "mentalModel": [
      "`__init__` runs automatically upon creation.",
      "`self` refers to the specific object being created.",
      "`self.attribute = value` stores data inside the object."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Define Class",
        "why": "The `Hero` class is registered along with its methods.",
        "memory": [
          { "name": "Hero", "value": "<class 'Hero'>", "type": "type", "note": "Blueprint ready", "accent": "#22d3ee" }
        ],
        "output": ""
      },
      {
        "line": 4,
        "action": "Create Hero",
        "why": "We create a Hero, triggering `__init__`.",
        "memory": [
          { "name": "Hero", "value": "<class 'Hero'>", "type": "type", "note": "Unchanged", "accent": "#22d3ee" },
          { "name": "name", "value": "'Alok'", "type": "str", "note": "Passed argument", "accent": "#a78bfa" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Set attribute",
        "why": "`self.name` saves the name inside the specific object.",
        "memory": [
          { "name": "Hero", "value": "<class 'Hero'>", "type": "type", "note": "Unchanged", "accent": "#22d3ee" },
          { "name": "h", "value": "{'name': 'Alok'}", "type": "Hero", "note": "Self updated", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 5,
        "action": "Print attribute",
        "why": "We access the stored name via `h.name`.",
        "memory": [
          { "name": "Hero", "value": "<class 'Hero'>", "type": "type", "note": "Unchanged", "accent": "#22d3ee" },
          { "name": "h", "value": "{'name': 'Alok'}", "type": "Hero", "note": "Unchanged", "accent": "#34d399" }
        ],
        "output": "Alok\n"
      }
    ]
  },
  'o3': {
    "title": "Methods & self",
    "hook": "How do objects actually DO things?",
    "concept": "Methods are functions that belong to an object. They always take `self` as their first parameter so they know which object's data to work with.",
    "code": "class Dog:\n    def bark(self):\n        print(\"Woof!\")\nd = Dog()\nd.bark()",
    "mentalModel": [
      "Methods are defined inside the class block.",
      "The first parameter must be `self`.",
      "When you call `d.bark()`, Python secretly passes `d` as `self`."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Define Class",
        "why": "Python registers the `Dog` class and its `bark` method.",
        "memory": [
          { "name": "Dog", "value": "<class 'Dog'>", "type": "type", "note": "Class defined", "accent": "#fb923c" }
        ],
        "output": ""
      },
      {
        "line": 4,
        "action": "Create instance",
        "why": "We create a new `Dog` object.",
        "memory": [
          { "name": "Dog", "value": "<class 'Dog'>", "type": "type", "note": "Unchanged", "accent": "#fb923c" },
          { "name": "d", "value": "<Dog object>", "type": "Dog", "note": "Created", "accent": "#c8a45e" }
        ],
        "output": ""
      },
      {
        "line": 5,
        "action": "Call method",
        "why": "We tell the specific dog `d` to bark.",
        "memory": [
          { "name": "Dog", "value": "<class 'Dog'>", "type": "type", "note": "Unchanged", "accent": "#fb923c" },
          { "name": "d", "value": "<Dog object>", "type": "Dog", "note": "Method invoked", "accent": "#c8a45e" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Execute method",
        "why": "The print statement inside `bark` runs.",
        "memory": [
          { "name": "Dog", "value": "<class 'Dog'>", "type": "type", "note": "Unchanged", "accent": "#fb923c" },
          { "name": "d", "value": "<Dog object>", "type": "Dog", "note": "Unchanged", "accent": "#c8a45e" }
        ],
        "output": "Woof!\n"
      }
    ]
  },
  'o4': {
    "title": "Inheritance Basics",
    "hook": "Why rewrite code when you can inherit it?",
    "concept": "Inheritance allows a child class to inherit all attributes and methods from a parent class. It models an 'is-a' relationship (e.g. a Warrior IS a Player).",
    "code": "class Pet:\n    def eat(self):\n        print(\"Yum\")\nclass Cat(Pet):\n    pass\nc = Cat()\nc.eat()",
    "mentalModel": [
      "Put the parent class name in parentheses: `class Child(Parent):`.",
      "The child automatically gets the parent's methods.",
      "You can add new methods to the child without altering the parent."
    ],
    "debuggerSteps": [
      {
        "line": 1,
        "action": "Define Parent Class",
        "why": "`Pet` class is created with an `eat` method.",
        "memory": [
          { "name": "Pet", "value": "<class 'Pet'>", "type": "type", "note": "Parent defined", "accent": "#60a5fa" }
        ],
        "output": ""
      },
      {
        "line": 4,
        "action": "Define Child Class",
        "why": "`Cat` is created, inheriting from `Pet`.",
        "memory": [
          { "name": "Pet", "value": "<class 'Pet'>", "type": "type", "note": "Unchanged", "accent": "#60a5fa" },
          { "name": "Cat", "value": "<class 'Cat'>", "type": "type", "note": "Child defined", "accent": "#f472b6" }
        ],
        "output": ""
      },
      {
        "line": 6,
        "action": "Create Child Object",
        "why": "We create a `Cat` instance.",
        "memory": [
          { "name": "Pet", "value": "<class 'Pet'>", "type": "type", "note": "Unchanged", "accent": "#60a5fa" },
          { "name": "Cat", "value": "<class 'Cat'>", "type": "type", "note": "Unchanged", "accent": "#f472b6" },
          { "name": "c", "value": "<Cat object>", "type": "Cat", "note": "New instance", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 7,
        "action": "Call inherited method",
        "why": "`Cat` doesn't have `eat`, so Python uses `Pet`'s `eat`.",
        "memory": [
          { "name": "Pet", "value": "<class 'Pet'>", "type": "type", "note": "Unchanged", "accent": "#60a5fa" },
          { "name": "Cat", "value": "<class 'Cat'>", "type": "type", "note": "Unchanged", "accent": "#f472b6" },
          { "name": "c", "value": "<Cat object>", "type": "Cat", "note": "Calling eat", "accent": "#34d399" }
        ],
        "output": ""
      },
      {
        "line": 3,
        "action": "Execute eat",
        "why": "The parent method runs on the child object.",
        "memory": [
          { "name": "Pet", "value": "<class 'Pet'>", "type": "type", "note": "Unchanged", "accent": "#60a5fa" },
          { "name": "Cat", "value": "<class 'Cat'>", "type": "type", "note": "Unchanged", "accent": "#f472b6" },
          { "name": "c", "value": "<Cat object>", "type": "Cat", "note": "Unchanged", "accent": "#34d399" }
        ],
        "output": "Yum\n"
      }
    ]
  }
};
