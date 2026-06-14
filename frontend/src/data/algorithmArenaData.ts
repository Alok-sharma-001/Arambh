import { LessonData } from './variablesForestData';

export const algorithmArenaData: Record<string, LessonData> = {
  '46': {
    id: '46',
    title: 'The Trial of Logic',
    story: {
      speaker: 'Arena Master',
      emoji: '⚔️',
      lines: [
        "Welcome to the Algorithm Arena, where raw logic is your weapon.",
        "To survive, you must break complex problems into actionable steps."
      ]
    },
    explain: {
      title: 'Problem Solving Steps',
      description: [
        "Computational thinking involves breaking a problem into a sequence of instructions.",
        "Instead of using `max()`, imagine checking each chest and keeping the largest you've seen."
      ],
      code: "largest = numbers[0]\nfor num in numbers:\n    if num > largest:\n        largest = num",
      steps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Initialize largest.",
          lineNumber: 1,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Find Maximum',
            complexity: 'O(N)',
            operations: 1,
            array: [5, 12, 3, 8],
            pointers: { i: 0 }
          }
        },
        {
          id: 2,
          type: 'ALGORITHM_STEP',
          description: "Compare next number.",
          lineNumber: 3,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Find Maximum',
            complexity: 'O(N)',
            operations: 2,
            array: [5, 12, 3, 8],
            pointers: { i: 1 },
            comparing: [0, 1]
          }
        }
      ]
    },
    practice: {
      title: 'Find the Max',
      description: 'Write a loop to find the largest number in `numbers = [4, 9, 2, 8]`. Store it in `largest`. Do not use `max()`.',
      initialCode: 'numbers = [4, 9, 2, 8]\nlargest = numbers[0]\n# Write your loop here\n',
      validation: (code) => {
        const hasFor = /for\s+\w+\s+in\s+numbers/.test(code);
        const hasIf = /if\s+\w+\s*>\s*largest/.test(code);
        if (!hasFor) return { isValid: false, error: 'You must use a `for` loop.' };
        if (!hasIf) return { isValid: false, error: 'You must compare with an `if` statement.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Scanned the array.",
          lineNumber: 3,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Find Maximum',
            complexity: 'O(N)',
            operations: 4,
            array: [4, 9, 2, 8],
            pointers: {}
          }
        }
      ]
    },
    challenge: {
      title: 'Sum Evens',
      description: 'Iterate through `numbers = [1, 2, 3, 4, 5]` and sum only the even numbers into `total`.',
      initialCode: 'numbers = [1, 2, 3, 4, 5]\ntotal = 0\n# Sum even numbers\n',
      validation: (code) => {
        const hasFor = /for\s+\w+\s+in\s+numbers/.test(code);
        const hasIf = /if\s+\w+\s*%\s*2\s*==\s*0/.test(code);
        if (!hasFor) return { isValid: false, error: 'You must use a `for` loop.' };
        if (!hasIf) return { isValid: false, error: 'Check if a number is even using `% 2 == 0`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Calculated sum of evens.",
          lineNumber: 4,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Filter & Sum',
            complexity: 'O(N)',
            operations: 5,
            array: [1, 2, 3, 4, 5],
            pointers: {}
          }
        }
      ]
    },
    rewardXP: 200
  },
  '47': {
    id: '47',
    title: 'The Search Grounds',
    story: {
      speaker: 'Arena Master',
      emoji: '⚔️',
      lines: [
        "An artifact is hidden in a row of chests.",
        "Check them one by one. This is Linear Search—reliable, but slow."
      ]
    },
    explain: {
      title: 'Linear Search',
      description: [
        "Iterate through a list from index 0 to the end.",
        "If you find the target, return the index. If the loop finishes without finding it, return -1."
      ],
      code: "for i, item in enumerate(vault):\n    if item == target:\n        return i\nreturn -1",
      steps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Checking index 0.",
          lineNumber: 2,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Linear Search',
            complexity: 'O(N)',
            operations: 1,
            array: [10, 20, 30, 40],
            pointers: { i: 0 }
          }
        },
        {
          id: 2,
          type: 'ALGORITHM_STEP',
          description: "Checking index 1.",
          lineNumber: 2,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Linear Search',
            complexity: 'O(N)',
            operations: 2,
            array: [10, 20, 30, 40],
            pointers: { i: 1 }
          }
        }
      ]
    },
    practice: {
      title: 'Find the Target',
      description: 'Write a `for i, item in enumerate(vault)` loop. If `item == target`, set `found_idx = i` and `break`.',
      initialCode: 'vault = [5, 12, 8, 3]\ntarget = 8\nfound_idx = -1\n# Write your linear search\n',
      validation: (code) => {
        const hasFor = /for\s+i\s*,\s*\w+\s+in\s+enumerate\(vault\)/.test(code);
        const hasIf = /if\s+\w+\s*==\s*target/.test(code);
        if (!hasFor) return { isValid: false, error: 'Use `for i, item in enumerate(vault)`.' };
        if (!hasIf) return { isValid: false, error: 'Check `if item == target:`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Found target at index 2.",
          lineNumber: 4,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Linear Search',
            complexity: 'O(N)',
            operations: 3,
            array: [5, 12, 8, 3],
            pointers: { i: 2 }
          }
        }
      ]
    },
    challenge: {
      title: 'Count Encounters',
      description: 'Use a loop to count how many times "goblin" appears in `log = ["orc", "goblin", "slime", "goblin"]`. Store in `count`.',
      initialCode: 'log = ["orc", "goblin", "slime", "goblin"]\ncount = 0\n# Count goblins\n',
      validation: (code) => {
        const hasFor = /for\s+\w+\s+in\s+log/.test(code);
        const hasIf = /if\s+\w+\s*==\s*["']goblin["']/.test(code);
        if (!hasFor) return { isValid: false, error: 'Use a loop over `log`.' };
        if (!hasIf) return { isValid: false, error: 'Check if the item is "goblin".' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Counted goblins.",
          lineNumber: 4,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Linear Scan / Count',
            complexity: 'O(N)',
            operations: 4,
            array: ["orc", "goblin", "slime", "goblin"],
            pointers: {}
          }
        }
      ]
    },
    rewardXP: 250
  },
  '48': {
    id: '48',
    title: 'The Arena of Efficiency',
    story: {
      speaker: 'Arena Master',
      emoji: '⚔️',
      lines: [
        "The chests are sorted. Checking them one by one is foolish.",
        "Divide and conquer! Halve the search space to find your target instantly."
      ]
    },
    explain: {
      title: 'Binary Search',
      description: [
        "Requires a sorted list. Maintain `low` and `high` pointers.",
        "Calculate `mid = (low + high) // 2`. If `mid < target`, set `low = mid + 1`.",
        "Efficiency is O(log N). It cuts the problem in half every step."
      ],
      code: "low, high = 0, len(arr) - 1\nwhile low <= high:\n    mid = (low + high) // 2\n    if arr[mid] == target: return mid\n    elif arr[mid] < target: low = mid + 1\n    else: high = mid - 1",
      steps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Set pointers.",
          lineNumber: 1,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Binary Search',
            complexity: 'O(log N)',
            operations: 1,
            array: [10, 20, 30, 40, 50, 60, 70],
            pointers: { low: 0, high: 6 }
          }
        },
        {
          id: 2,
          type: 'ALGORITHM_STEP',
          description: "Check mid.",
          lineNumber: 3,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Binary Search',
            complexity: 'O(log N)',
            operations: 2,
            array: [10, 20, 30, 40, 50, 60, 70],
            pointers: { low: 0, high: 6, mid: 3 },
            comparing: [3, 3]
          }
        }
      ]
    },
    practice: {
      title: 'Half the Battle',
      description: 'Implement Binary Search to find `target = 60` in `vault`. Update `low` and `high` in the while loop.',
      initialCode: 'vault = [10, 20, 30, 40, 50, 60, 70]\ntarget = 60\nlow, high = 0, len(vault) - 1\n# Write while loop\n',
      validation: (code) => {
        const hasWhile = /while\s+low\s*<=\s*high/.test(code);
        const hasMid = /mid\s*=\s*\(low\s*\+\s*high\)\s*\/\/\s*2/.test(code);
        if (!hasWhile) return { isValid: false, error: 'Use `while low <= high:`.' };
        if (!hasMid) return { isValid: false, error: 'Calculate `mid` correctly.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Found target efficiently.",
          lineNumber: 5,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Binary Search',
            complexity: 'O(log N)',
            operations: 2,
            array: [10, 20, 30, 40, 50, 60, 70],
            pointers: { low: 4, high: 6, mid: 5 }
          }
        }
      ]
    },
    challenge: {
      title: 'Massive Search',
      description: 'Assume `freqs` is a list of 1000 sorted items. Fill in the missing `elif freqs[mid] < target:` block to update `low`.',
      initialCode: '# freqs is sorted\ndef search(freqs, target):\n    low, high = 0, len(freqs)-1\n    while low <= high:\n        mid = (low+high)//2\n        if freqs[mid] == target: return mid\n        # Update low and high\n        ',
      validation: (code) => {
        const hasLowUpdate = /low\s*=\s*mid\s*\+\s*1/.test(code);
        if (!hasLowUpdate) return { isValid: false, error: 'Update `low = mid + 1` when the middle is less than the target.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Binary search verified.",
          lineNumber: 8,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Binary Search',
            complexity: 'O(log N)',
            operations: 9,
            array: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90], // Demo array
            pointers: {}
          }
        }
      ]
    },
    rewardXP: 300
  },
  '49': {
    id: '49',
    title: 'The Sorting Coliseum',
    story: {
      speaker: 'Arena Master',
      emoji: '⚔️',
      lines: [
        "A pile of enchanted weapons lies in chaos.",
        "Organize them by power level. Understand the concept of sorting."
      ]
    },
    explain: {
      title: 'Sorting Concepts',
      description: [
        "Sorting rearranges elements. A simple algorithm is Bubble Sort.",
        "It compares adjacent elements and swaps them if they are in the wrong order.",
        "It is O(N^2), slow for large lists, but visually instructive."
      ],
      code: "for i in range(n):\n    for j in range(0, n-i-1):\n        if arr[j] > arr[j+1]:\n            arr[j], arr[j+1] = arr[j+1], arr[j]",
      steps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Comparing elements.",
          lineNumber: 3,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Bubble Sort',
            complexity: 'O(N^2)',
            operations: 1,
            array: [5, 2, 8, 1],
            pointers: { j: 0 },
            comparing: [0, 1]
          }
        },
        {
          id: 2,
          type: 'ARRAY_SWAP',
          description: "Swapping elements.",
          lineNumber: 4,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Bubble Sort',
            complexity: 'O(N^2)',
            operations: 2,
            array: [2, 5, 8, 1],
            pointers: { j: 0 },
            swapped: [0, 1]
          }
        }
      ]
    },
    practice: {
      title: 'Bubble Sort',
      description: 'Write the swap logic. If `arr[j] > arr[j+1]`, swap them: `arr[j], arr[j+1] = arr[j+1], arr[j]`.',
      initialCode: 'arr = [4, 1, 3]\nn = len(arr)\nfor i in range(n):\n    for j in range(0, n-i-1):\n        if arr[j] > arr[j+1]:\n            # Swap them\n            ',
      validation: (code) => {
        const hasSwap = /arr\[j\],\s*arr\[j\+1\]\s*=\s*arr\[j\+1\],\s*arr\[j\]/.test(code);
        if (!hasSwap) return { isValid: false, error: 'Use Python tuple unpacking to swap.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Array sorted.",
          lineNumber: 6,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Bubble Sort',
            complexity: 'O(N^2)',
            operations: 3,
            array: [1, 3, 4],
            pointers: {}
          }
        }
      ]
    },
    challenge: {
      title: 'Descending Order',
      description: 'Modify the condition to sort in descending order (highest first). Use `if arr[j] < arr[j+1]:`.',
      initialCode: 'arr = [1, 4, 3]\nn = len(arr)\nfor i in range(n):\n    for j in range(0, n-i-1):\n        # Change condition for descending\n        if False:\n            arr[j], arr[j+1] = arr[j+1], arr[j]',
      validation: (code) => {
        const hasDesc = /if\s+arr\[j\]\s*<\s*arr\[j\+1\]:/.test(code);
        if (!hasDesc) return { isValid: false, error: 'Check if `arr[j] < arr[j+1]` to sort descending.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Array sorted descending.",
          lineNumber: 6,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Bubble Sort (Desc)',
            complexity: 'O(N^2)',
            operations: 3,
            array: [4, 3, 1],
            pointers: {}
          }
        }
      ]
    },
    rewardXP: 350
  },
  '50': {
    id: '50',
    title: "The Champion's Strategy",
    story: {
      speaker: 'Arena Master',
      emoji: '⚔️',
      lines: [
        "The Time Eater awakens! To survive, understand the cost of your spells.",
        "You must optimize. Trade O(N^2) slowness for O(N) or O(1) lightning."
      ]
    },
    explain: {
      title: 'Optimization & Complexity',
      description: [
        "Nested loops over an array are often O(N^2) (slow).",
        "Using a `set` or `dict` allows O(1) instant lookups.",
        "Refactoring to one loop with a set makes the algorithm O(N) (fast)."
      ],
      code: "seen = set()\nfor num in arr:\n    if num in seen: return True\n    seen.add(num)",
      steps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Set lookup is O(1).",
          lineNumber: 3,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Hash Set Lookup',
            complexity: 'O(N)',
            operations: 1,
            array: [5, 2, 5],
            pointers: { i: 0 }
          }
        }
      ]
    },
    practice: {
      title: 'Avoid the Trap',
      description: 'Find duplicates efficiently. Create a `seen = set()`. Loop through `arr`. If `num in seen`, return `True`, else `seen.add(num)`.',
      initialCode: 'arr = [1, 2, 3, 2]\nseen = set()\n# Check for duplicates efficiently\n',
      validation: (code) => {
        const hasSet = /seen\s*=\s*set\(\)/.test(code);
        const hasIn = /if\s+\w+\s+in\s+seen/.test(code);
        if (!hasSet) return { isValid: false, error: 'Create a set.' };
        if (!hasIn) return { isValid: false, error: 'Check if `num in seen`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "Duplicate found quickly.",
          lineNumber: 4,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Optimized Duplicate Check',
            complexity: 'O(N)',
            operations: 4,
            array: [1, 2, 3, 2],
            pointers: {}
          }
        }
      ]
    },
    challenge: {
      title: 'Dictionary Lookup',
      description: 'Use a dictionary `mapping = {101: "Goblin", 102: "Orc"}` to map `entity_id = 102` to `enemy` instantly. Do not use loops.',
      initialCode: 'mapping = {101: "Goblin", 102: "Orc"}\nentity_id = 102\n# Instant O(1) lookup\n',
      validation: (code) => {
        const hasLookup = /enemy\s*=\s*mapping\[\s*entity_id\s*\]/.test(code);
        const noLoops = !/for\s/.test(code);
        if (!hasLookup) return { isValid: false, error: 'Assign `mapping[entity_id]` to `enemy`.' };
        if (!noLoops) return { isValid: false, error: 'Do not use loops! Dictionaries are O(1).' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALGORITHM_STEP',
          description: "O(1) dictionary lookup.",
          lineNumber: 3,
          memorySnapshot: {},
          algorithmState: {
            algorithmName: 'Hash Map Lookup',
            complexity: 'O(1)',
            operations: 1,
            array: [101, 102],
            pointers: {}
          }
        }
      ]
    },
    rewardXP: 400
  }
};
