import type { LessonDebugContent } from '@/types';

export const ALGORITHM_ARENA_LESSONS: Record<string, LessonDebugContent> = {
  'a1': {
    title: "Linear Search",
    hook: "Looking for a needle in a haystack, one straw at a time.",
    concept: "Linear search checks every single item in a list from start to finish until it finds the target. It's simple but can be slow for huge lists.",
    code: "items = [4, 2, 7]\ntarget = 7\nfor item in items:\n    if item == target:\n        print('Found!')\n        break",
    mentalModel: [
      "Check the first item.",
      "If it's a match, stop.",
      "Otherwise, check the next one."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Creates list",
        why: "Sets up the data we want to search.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Sets target",
        why: "Defines what we are looking for.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Starts loop (item 1)",
        why: "Gets the first item.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" },
          { name: "item", value: "4", type: "int", note: "Current check", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Checks condition",
        why: "4 is not 7. The if-statement is skipped.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" },
          { name: "item", value: "4", type: "int", note: "Not a match", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Continues loop (item 2)",
        why: "Gets the second item.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" },
          { name: "item", value: "2", type: "int", note: "Current check", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Continues loop (item 3)",
        why: "Gets the third item.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" },
          { name: "item", value: "7", type: "int", note: "Current check", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Checks condition",
        why: "7 equals 7! It's a match.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" },
          { name: "item", value: "7", type: "int", note: "Match found", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "Prints success",
        why: "We announce we found it.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" },
          { name: "item", value: "7", type: "int", note: "Match found", accent: "#34d399" }
        ],
        output: "Found!\n"
      },
      {
        line: 6,
        action: "Breaks loop",
        why: "No need to keep searching once found.",
        memory: [
          { name: "items", value: "[4, 2, 7]", type: "list", note: "Data to search", accent: "#60a5fa" },
          { name: "target", value: "7", type: "int", note: "What we want", accent: "#f472b6" },
          { name: "item", value: "7", type: "int", note: "Match found", accent: "#34d399" }
        ],
        output: "Found!\n"
      }
    ]
  },
  'a2': {
    title: "Bubble Sort",
    hook: "Watch the heaviest numbers sink to the bottom.",
    concept: "Bubble sort compares adjacent pairs of items and swaps them if they are in the wrong order, looping until the whole list is sorted.",
    code: "nums = [3, 1, 2]\nif nums[0] > nums[1]:\n    nums[0], nums[1] = nums[1], nums[0]\nprint(nums)",
    mentalModel: [
      "Look at two items next to each other.",
      "If they are out of order, swap them.",
      "Repeat until fully sorted."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Creates list",
        why: "Sets up our unsorted list.",
        memory: [
          { name: "nums", value: "[3, 1, 2]", type: "list", note: "Unsorted list", accent: "#22d3ee" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Compares first two elements",
        why: "Checks if 3 is greater than 1. It is.",
        memory: [
          { name: "nums", value: "[3, 1, 2]", type: "list", note: "Unsorted list", accent: "#22d3ee" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Swaps elements",
        why: "Moves the larger number to the right.",
        memory: [
          { name: "nums", value: "[1, 3, 2]", type: "list", note: "Swapped first pair", accent: "#fb923c" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Prints list",
        why: "Shows the partially sorted list.",
        memory: [
          { name: "nums", value: "[1, 3, 2]", type: "list", note: "Swapped first pair", accent: "#fb923c" }
        ],
        output: "[1, 3, 2]\n"
      }
    ]
  },
  'a3': {
    title: "Recursion Basics",
    hook: "A function that calls itself? Inception time.",
    concept: "Recursion is when a function calls itself to solve a smaller piece of the same problem. It MUST have a base case to stop, otherwise it runs forever.",
    code: "def count(n):\n    if n <= 0:\n        return\n    print(n)\n    count(n-1)\ncount(2)",
    mentalModel: [
      "Always define a base case (stopping condition) first.",
      "Call the function with a slightly smaller problem.",
      "Trust the recursion to handle the rest."
    ],
    debuggerSteps: [
      {
        line: 6,
        action: "Calls count(2)",
        why: "Starts the recursive process.",
        memory: [],
        output: ""
      },
      {
        line: 1,
        action: "Enters count with n=2",
        why: "Local variable n is 2.",
        memory: [
          { name: "n", value: "2", type: "int", note: "First call", accent: "#a78bfa" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Checks base case",
        why: "2 is not <= 0.",
        memory: [
          { name: "n", value: "2", type: "int", note: "First call", accent: "#a78bfa" }
        ],
        output: ""
      },
      {
        line: 4,
        action: "Prints n",
        why: "Outputs the current value.",
        memory: [
          { name: "n", value: "2", type: "int", note: "First call", accent: "#a78bfa" }
        ],
        output: "2\n"
      },
      {
        line: 5,
        action: "Calls count(1)",
        why: "Calls itself with n-1.",
        memory: [
          { name: "n", value: "2", type: "int", note: "First call", accent: "#a78bfa" }
        ],
        output: "2\n"
      },
      {
        line: 1,
        action: "Enters count with n=1",
        why: "A new local variable n is 1.",
        memory: [
          { name: "n", value: "1", type: "int", note: "Second call", accent: "#f472b6" }
        ],
        output: "2\n"
      },
      {
        line: 4,
        action: "Prints n",
        why: "Outputs the new value.",
        memory: [
          { name: "n", value: "1", type: "int", note: "Second call", accent: "#f472b6" }
        ],
        output: "2\n1\n"
      },
      {
        line: 5,
        action: "Calls count(0)",
        why: "Calls itself with n-1.",
        memory: [
          { name: "n", value: "1", type: "int", note: "Second call", accent: "#f472b6" }
        ],
        output: "2\n1\n"
      },
      {
        line: 1,
        action: "Enters count with n=0",
        why: "Another new local variable n is 0.",
        memory: [
          { name: "n", value: "0", type: "int", note: "Base case reached", accent: "#34d399" }
        ],
        output: "2\n1\n"
      },
      {
        line: 2,
        action: "Checks base case",
        why: "0 is <= 0. The base case is met!",
        memory: [
          { name: "n", value: "0", type: "int", note: "Base case reached", accent: "#34d399" }
        ],
        output: "2\n1\n"
      },
      {
        line: 3,
        action: "Returns",
        why: "Stops recursion and returns back up the chain.",
        memory: [
          { name: "n", value: "0", type: "int", note: "Base case reached", accent: "#34d399" }
        ],
        output: "2\n1\n"
      }
    ]
  },
  'a4': {
    title: "Big O Notation",
    hook: "How do you measure speed without a stopwatch?",
    concept: "Big O describes how runtime grows as data grows. O(1) is instant, O(n) grows with data, and O(n²) grows wildly.",
    code: "data = [1, 2]\n# O(1) step\nx = data[0]\n# O(n) step\nfor i in data:\n    print(i)",
    mentalModel: [
      "Accessing a list by index is O(1) — always fast.",
      "A simple loop over a list is O(n) — scales linearly.",
      "Nested loops usually mean O(n²) — avoid if possible."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Creates data",
        why: "A small list of two items.",
        memory: [
          { name: "data", value: "[1, 2]", type: "list", note: "Input data", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "O(1) operation",
        why: "Grabbing data[0] takes the same time no matter how huge the list is.",
        memory: [
          { name: "data", value: "[1, 2]", type: "list", note: "Input data", accent: "#60a5fa" },
          { name: "x", value: "1", type: "int", note: "Constant time access", accent: "#c8a45e" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "O(n) starts",
        why: "A loop touches every element, so time grows linearly with list size.",
        memory: [
          { name: "data", value: "[1, 2]", type: "list", note: "Input data", accent: "#60a5fa" },
          { name: "x", value: "1", type: "int", note: "Constant time access", accent: "#c8a45e" },
          { name: "i", value: "1", type: "int", note: "Linear loop", accent: "#34d399" }
        ],
        output: ""
      },
      {
        line: 6,
        action: "Prints item",
        why: "Executes loop body.",
        memory: [
          { name: "data", value: "[1, 2]", type: "list", note: "Input data", accent: "#60a5fa" },
          { name: "x", value: "1", type: "int", note: "Constant time access", accent: "#c8a45e" },
          { name: "i", value: "1", type: "int", note: "Linear loop", accent: "#34d399" }
        ],
        output: "1\n"
      },
      {
        line: 5,
        action: "Next loop iteration",
        why: "Moves to second item.",
        memory: [
          { name: "data", value: "[1, 2]", type: "list", note: "Input data", accent: "#60a5fa" },
          { name: "x", value: "1", type: "int", note: "Constant time access", accent: "#c8a45e" },
          { name: "i", value: "2", type: "int", note: "Linear loop", accent: "#34d399" }
        ],
        output: "1\n"
      },
      {
        line: 6,
        action: "Prints item",
        why: "Executes loop body again.",
        memory: [
          { name: "data", value: "[1, 2]", type: "list", note: "Input data", accent: "#60a5fa" },
          { name: "x", value: "1", type: "int", note: "Constant time access", accent: "#c8a45e" },
          { name: "i", value: "2", type: "int", note: "Linear loop", accent: "#34d399" }
        ],
        output: "1\n2\n"
      }
    ]
  }
};
