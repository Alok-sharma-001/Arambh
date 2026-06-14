import { LessonData } from './variablesForestData';

export const exceptionAbyssData: Record<string, LessonData> = {
  '31': {
    id: '31',
    title: 'The Fractured Gate',
    story: {
      speaker: 'Guardian of the Abyss',
      emoji: '👁️',
      lines: [
        "A flawed spell will shatter you. You must know the difference between a broken tongue and a broken reality.",
        "Syntax Errors mean Python cannot understand your code. Runtime Exceptions mean the code crashed while running."
      ]
    },
    explain: {
      title: 'Errors vs Exceptions',
      description: [
        "A SyntaxError happens before the code runs because of bad typing (like a missing parenthesis).",
        "An Exception (like ZeroDivisionError) happens during execution when an impossible action is attempted."
      ],
      code: "# Syntax Error example: print('Hello'\n# Exception example:\nprint(10 / 0)",
      steps: [
        {
          id: 1,
          type: 'ERROR',
          description: "ZeroDivisionError: division by zero",
          lineNumber: 3,
          memorySnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Fix the Syntax',
      description: 'The gate spell is broken. Add the missing parenthesis to fix the Syntax Error.',
      initialCode: 'print("Open Gate"',
      validation: (code) => {
        const hasFixed = /print\s*\(\s*["']Open Gate["']\s*\)/.test(code);
        if (!hasFixed) return { isValid: false, error: 'You must add the closing parenthesis `)`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Gate opened.",
          lineNumber: 1,
          output: "Open Gate",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Trigger the Abyss',
      description: 'Trigger a runtime exception on purpose by attempting to divide `10` by `0` and assigning it to `anomaly`.',
      initialCode: '# Create anomaly by dividing 10 by 0\n',
      validation: (code) => {
        const hasDiv = /anomaly\s*=\s*10\s*\/\s*0/.test(code);
        if (!hasDiv) return { isValid: false, error: 'Write `anomaly = 10 / 0`' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ERROR',
          description: "ZeroDivisionError: division by zero",
          lineNumber: 2,
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 150
  },
  '32': {
    id: '32',
    title: 'The Shield of Try',
    story: {
      speaker: 'Abyss Walker',
      emoji: '🛡️',
      lines: [
        "Volatile energy blasts through the abyss. You must project a magical shield to catch the destructive energy.",
        "Wrap dangerous spells in a `try` block, and catch the fallout with an `except` block."
      ]
    },
    explain: {
      title: 'Try and Except',
      description: [
        "The `try` block attempts a dangerous action. If it fails, Python jumps to the `except` block instead of crashing."
      ],
      code: "try:\n    result = 100 / 0\nexcept ZeroDivisionError:\n    print('Caught the blast!')",
      steps: [
        {
          id: 1,
          type: 'EVALUATE',
          description: "Attempting division...",
          lineNumber: 2,
          evaluation: { leftVal: "100", rightVal: "0", operator: "/", result: "ERROR", targetVarName: "result" },
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'ERROR_CAUGHT',
          description: "ZeroDivisionError caught! Jumping to except block.",
          lineNumber: 3,
          memorySnapshot: {}
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Printed success message.",
          lineNumber: 4,
          output: "Caught the blast!",
          memorySnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Shield the Division',
      description: 'Wrap `result = 100 / 0` in a `try` block, and use `except ZeroDivisionError:` to `print("Caught the blast!")`.',
      initialCode: '# Write try/except block here\n',
      validation: (code) => {
        const hasTry = /try\s*:/.test(code);
        const hasResult = /result\s*=\s*100\s*\/\s*0/.test(code);
        const hasExcept = /except\s+ZeroDivisionError\s*:/.test(code);
        const hasPrint = /print\s*\(\s*['"]Caught the blast!['"]\s*\)/.test(code);
        if (!hasTry || !hasResult) return { isValid: false, error: 'Put `result = 100 / 0` inside a `try:` block.' };
        if (!hasExcept || !hasPrint) return { isValid: false, error: 'Add an `except ZeroDivisionError:` block that prints the message.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ERROR_CAUGHT',
          description: "ZeroDivisionError caught.",
          lineNumber: 3,
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed caught message.",
          lineNumber: 4,
          output: "Caught the blast!",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Safe Conversion',
      description: 'Attempt to convert a string to an integer `int("dragon")` inside a `try` block. Catch the resulting `ValueError` and set `safe_mode = True`.',
      initialCode: 'safe_mode = False\n# Write try/except block\n\n\n# Print safe_mode\nprint(safe_mode)',
      validation: (code) => {
        const hasTry = /try\s*:/.test(code);
        const hasConv = /int\s*\(\s*['"]dragon['"]\s*\)/.test(code);
        const hasExcept = /except\s+ValueError\s*:/.test(code);
        const hasSafe = /safe_mode\s*=\s*True/.test(code);
        if (!hasTry || !hasExcept || !hasConv || !hasSafe) return { isValid: false, error: 'Create a try/except ValueError block that sets safe_mode = True.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Set safe_mode to False.",
          lineNumber: 1,
          variable: { address: '0x00', name: 'safe_mode', value: 'False', type: 'bool' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'safe_mode', value: 'False', type: 'bool' } }
        },
        {
          id: 2,
          type: 'ERROR_CAUGHT',
          description: "ValueError caught.",
          lineNumber: 4,
          memorySnapshot: { '0x00': { address: '0x00', name: 'safe_mode', value: 'False', type: 'bool' } }
        },
        {
          id: 3,
          type: 'UPDATE',
          description: "Set safe_mode to True.",
          lineNumber: 5,
          variable: { address: '0x00', name: 'safe_mode', value: 'True', type: 'bool' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'safe_mode', value: 'True', type: 'bool' } }
        },
        {
          id: 4,
          type: 'PRINT',
          description: "Printed True.",
          lineNumber: 8,
          output: "True",
          memorySnapshot: { '0x00': { address: '0x00', name: 'safe_mode', value: 'True', type: 'bool' } }
        }
      ]
    },
    rewardXP: 200
  },
  '33': {
    id: '33',
    title: 'The Recovery Chamber',
    story: {
      speaker: 'Master Healer',
      emoji: '⚕️',
      lines: [
        "Catching the blast is not enough. You must channel the residual energy safely into the ground to prevent a chain reaction.",
        "Use `else` for what happens if you succeed, and `finally` for what MUST happen no matter what."
      ]
    },
    explain: {
      title: 'Else and Finally',
      description: [
        "`else` runs ONLY if no exception occurred in the `try` block.",
        "`finally` runs NO MATTER WHAT happens, making it perfect for cleanup tasks."
      ],
      code: "try:\n    power = 100\nexcept Exception:\n    print('Failed')\nelse:\n    print('Stable')\nfinally:\n    print('Discharging...')",
      steps: [
        {
          id: 1,
          type: 'ALLOCATE',
          description: "Assigned power = 100.",
          lineNumber: 2,
          variable: { address: '0x00', name: 'power', value: '100', type: 'int' },
          memorySnapshot: { '0x00': { address: '0x00', name: 'power', value: '100', type: 'int' } }
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Else block executed.",
          lineNumber: 6,
          output: "Stable",
          memorySnapshot: { '0x00': { address: '0x00', name: 'power', value: '100', type: 'int' } }
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Finally block executed.",
          lineNumber: 8,
          output: "Discharging...",
          memorySnapshot: { '0x00': { address: '0x00', name: 'power', value: '100', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'Safe Discharge',
      description: 'Write a `try` block that sets `power = 100`. Add an `except Exception:` that passes. Add an `else:` that prints `"Stable"` and a `finally:` that prints `"Discharging..."`.',
      initialCode: '# Write try/except/else/finally\n',
      validation: (code) => {
        const hasTry = /try\s*:/.test(code);
        const hasExcept = /except\s+Exception\s*:/.test(code);
        const hasElse = /else\s*:/.test(code);
        const hasFinally = /finally\s*:/.test(code);
        if (!hasTry || !hasExcept || !hasElse || !hasFinally) return { isValid: false, error: 'Include try, except Exception, else, and finally blocks.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'PRINT',
          description: "Else block executed.",
          lineNumber: 6,
          output: "Stable",
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Finally block executed.",
          lineNumber: 8,
          output: "Discharging...",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Unstable Connection',
      description: 'Force an exception by setting `x = 1 / 0` in `try`. In `except ZeroDivisionError:`, print `"Crash"`. In `finally:`, print `"Closed"`.',
      initialCode: '# Force crash and handle it\n',
      validation: (code) => {
        const hasCrash = /x\s*=\s*1\s*\/\s*0/.test(code);
        const hasExcept = /except\s+ZeroDivisionError\s*:/.test(code);
        const hasCrashPrint = /print\s*\(\s*['"]Crash['"]\s*\)/.test(code);
        const hasFinally = /finally\s*:/.test(code);
        const hasClosedPrint = /print\s*\(\s*['"]Closed['"]\s*\)/.test(code);
        
        if (!hasCrash || !hasExcept || !hasCrashPrint || !hasFinally || !hasClosedPrint) return { isValid: false, error: 'Follow instructions exactly for try, except, and finally blocks.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ERROR_CAUGHT',
          description: "Caught zero division.",
          lineNumber: 3,
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed Crash.",
          lineNumber: 4,
          output: "Crash",
          memorySnapshot: {}
        },
        {
          id: 3,
          type: 'PRINT',
          description: "Finally block executed.",
          lineNumber: 6,
          output: "Closed",
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 250
  },
  '34': {
    id: '34',
    title: "The Summoner's Curse",
    story: {
      speaker: 'Dark Mage',
      emoji: '🦹',
      lines: [
        "Sometimes, you must reject dark magic before it taints your soul.",
        "By intentionally summoning an anomaly, you can banish a corrupted entity and alert others."
      ]
    },
    explain: {
      title: 'Raise Exceptions',
      description: [
        "Use the `raise` keyword to manually trigger an exception.",
        "This is useful when invalid data is provided and you want to stop execution immediately."
      ],
      code: "level = 5\nif level < 10:\n    raise ValueError('Level too low!')",
      steps: [
        {
          id: 1,
          type: 'ERROR',
          description: "ValueError: Level too low!",
          lineNumber: 3,
          memorySnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Level Check',
      description: 'Write an `if` statement to check if `level < 10`. If true, `raise` a `ValueError("Too low")`.',
      initialCode: 'level = 2\n# Write if and raise\n',
      validation: (code) => {
        const hasIf = /if\s+level\s*<\s*10\s*:/.test(code);
        const hasRaise = /raise\s+ValueError\(\s*['"]Too low['"]\s*\)/.test(code);
        if (!hasIf || !hasRaise) return { isValid: false, error: 'Write `if level < 10:` and `raise ValueError("Too low")` inside it.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ERROR',
          description: "ValueError: Too low",
          lineNumber: 3,
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Mana Burn',
      description: 'Given `mana = -5`, write an `if` statement that checks if `mana < 0`, and if so, `raise` a `ValueError("Negative mana")`.',
      initialCode: 'mana = -5\n# Check and raise\n',
      validation: (code) => {
        const hasIf = /if\s+mana\s*<\s*0\s*:/.test(code);
        const hasRaise = /raise\s+ValueError\(\s*['"]Negative mana['"]\s*\)/.test(code);
        if (!hasIf || !hasRaise) return { isValid: false, error: 'Check if `mana < 0` and raise `ValueError("Negative mana")`.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ERROR',
          description: "ValueError: Negative mana",
          lineNumber: 3,
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 250
  },
  '35': {
    id: '35',
    title: 'The Error Hunter',
    story: {
      speaker: 'The Archivist',
      emoji: '📜',
      lines: [
        "The Chaos Compiler's minions are made of pure, specific anomalies.",
        "You must learn their true names to defeat them: NameError, TypeError, IndexError, KeyError."
      ]
    },
    explain: {
      title: 'Common Exceptions',
      description: [
        "`NameError`: Variable doesn't exist.",
        "`TypeError`: Mixing incompatible types (like adding string and int).",
        "`IndexError`: List index out of bounds.",
        "`KeyError`: Dictionary key not found."
      ],
      code: "chest = {'gold': 100}\ntry:\n    print(chest['potion'])\nexcept KeyError:\n    print('Key missing!')",
      steps: [
        {
          id: 1,
          type: 'ERROR_CAUGHT',
          description: "KeyError caught.",
          lineNumber: 4,
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed message.",
          lineNumber: 5,
          output: "Key missing!",
          memorySnapshot: {}
        }
      ]
    },
    practice: {
      title: 'Type Mismatch',
      description: 'The code `print("Level " + 5)` causes a `TypeError`. Wrap it in a `try/except TypeError:` block and print `"Caught TypeError"`.',
      initialCode: '# Wrap in try/except\nprint("Level " + 5)\n',
      validation: (code) => {
        const hasTry = /try\s*:/.test(code);
        const hasExcept = /except\s+TypeError\s*:/.test(code);
        const hasPrint = /print\s*\(\s*['"]Caught TypeError['"]\s*\)/.test(code);
        if (!hasTry || !hasExcept || !hasPrint) return { isValid: false, error: 'Wrap the print inside a try block and catch the TypeError.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ERROR_CAUGHT',
          description: "TypeError caught.",
          lineNumber: 3,
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed Caught TypeError.",
          lineNumber: 4,
          output: "Caught TypeError",
          memorySnapshot: {}
        }
      ]
    },
    challenge: {
      title: 'Out of Bounds',
      description: 'Create a list `arr = [1, 2]`. Wrap `arr[5]` in a `try/except IndexError:` block and print `"Caught IndexError"`.',
      initialCode: 'arr = [1, 2]\n# Try to access arr[5] and catch IndexError\n',
      validation: (code) => {
        const hasList = /arr\s*=\s*\[\s*1\s*,\s*2\s*\]/.test(code);
        const hasTry = /try\s*:/.test(code);
        const hasAccess = /arr\s*\[\s*5\s*\]/.test(code);
        const hasExcept = /except\s+IndexError\s*:/.test(code);
        const hasPrint = /print\s*\(\s*['"]Caught IndexError['"]\s*\)/.test(code);
        
        if (!hasList || !hasTry || !hasAccess || !hasExcept || !hasPrint) return { isValid: false, error: 'Follow instructions for IndexError handling.' };
        return { isValid: true };
      },
      successSteps: [
        {
          id: 1,
          type: 'ERROR_CAUGHT',
          description: "IndexError caught.",
          lineNumber: 4,
          memorySnapshot: {}
        },
        {
          id: 2,
          type: 'PRINT',
          description: "Printed Caught IndexError.",
          lineNumber: 5,
          output: "Caught IndexError",
          memorySnapshot: {}
        }
      ]
    },
    rewardXP: 300
  }
};
