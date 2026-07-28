import type { LessonDebugContent } from '@/types';

export const FILESYSTEM_RUINS_LESSONS: Record<string, LessonDebugContent> = {
  'fs1': {
    title: "Opening Files",
    hook: "How do you read a secret scroll in Python?",
    concept: "To read a file, you open() it first in read mode ('r'). Then you can use .read() to get all the text inside.",
    code: "file = open('scroll.txt', 'r')\ncontent = file.read()\nprint(content)\nfile.close()",
    mentalModel: [
      "open() connects Python to a file.",
      "read() pulls the content into a variable.",
      "Always close() the file when done!"
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Opens the file",
        why: "Establishes a connection to scroll.txt.",
        memory: [
          { name: "file", value: "<TextIOWrapper>", type: "file", note: "File object created", accent: "#a78bfa" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Reads the content",
        why: "Pulls the text from the file into memory.",
        memory: [
          { name: "file", value: "<TextIOWrapper>", type: "file", note: "File object", accent: "#a78bfa" },
          { name: "content", value: "'Secret text'", type: "str", note: "Text loaded", accent: "#60a5fa" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Prints the text",
        why: "Displays what we read.",
        memory: [
          { name: "file", value: "<TextIOWrapper>", type: "file", note: "File object", accent: "#a78bfa" },
          { name: "content", value: "'Secret text'", type: "str", note: "Text loaded", accent: "#60a5fa" }
        ],
        output: "Secret text\n"
      },
      {
        line: 4,
        action: "Closes the file",
        why: "Frees up system resources.",
        memory: [
          { name: "file", value: "<closed>", type: "file", note: "Connection closed", accent: "#f472b6" },
          { name: "content", value: "'Secret text'", type: "str", note: "Text loaded", accent: "#60a5fa" }
        ],
        output: "Secret text\n"
      }
    ]
  },
  'fs2': {
    title: "Writing to Files",
    hook: "Time to leave your mark on the filesystem.",
    concept: "Open a file in write mode ('w') to write to it. If the file doesn't exist, Python creates it. If it does, Python overwrites it completely.",
    code: "file = open('log.txt', 'w')\nfile.write('Quest started')\nfile.close()",
    mentalModel: [
      "'w' mode overwrites everything.",
      "write() adds text to the file.",
      "Data isn't completely saved until you close()."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Opens file for writing",
        why: "Creates log.txt or clears it if it exists.",
        memory: [
          { name: "file", value: "<TextIOWrapper mode='w'>", type: "file", note: "File opened for writing", accent: "#fb923c" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Writes content",
        why: "Sends the string to the file buffer.",
        memory: [
          { name: "file", value: "<TextIOWrapper mode='w'>", type: "file", note: "Content buffered", accent: "#fb923c" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Closes the file",
        why: "Flushes the buffer and saves the file.",
        memory: [
          { name: "file", value: "<closed>", type: "file", note: "File saved", accent: "#34d399" }
        ],
        output: ""
      }
    ]
  },
  'fs3': {
    title: "The with Statement",
    hook: "Never forget to close a file again.",
    concept: "Using the 'with' statement creates a context manager. It automatically closes the file for you when the block ends, even if an error occurs.",
    code: "with open('data.txt', 'w') as f:\n    f.write('Safe')\nprint('Done')",
    mentalModel: [
      "'with' handles setup and teardown automatically.",
      "'as f' assigns the file object to a variable.",
      "The file closes as soon as the indentation ends."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Opens file with context",
        why: "Assigns the opened file to 'f'.",
        memory: [
          { name: "f", value: "<TextIOWrapper mode='w'>", type: "file", note: "Managed file object", accent: "#22d3ee" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Writes data",
        why: "Adds text to the file.",
        memory: [
          { name: "f", value: "<TextIOWrapper mode='w'>", type: "file", note: "Writing in progress", accent: "#22d3ee" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Exits block and prints",
        why: "Python automatically closes 'f' because we left the 'with' block.",
        memory: [
          { name: "f", value: "<closed>", type: "file", note: "Auto-closed", accent: "#c8a45e" }
        ],
        output: "Done\n"
      }
    ]
  },
  'fs4': {
    title: "Working with Paths",
    hook: "How do you know if a file even exists?",
    concept: "The os.path module lets you check if files exist, join folder names safely, and more. It is essential for avoiding 'File Not Found' errors.",
    code: "import os\nexists = os.path.exists('map.txt')\nif exists:\n    print('Found')\nelse:\n    print('Lost')",
    mentalModel: [
      "Import 'os' to interact with the operating system.",
      "os.path.exists() returns True or False.",
      "Check before you open to prevent crashes."
    ],
    debuggerSteps: [
      {
        line: 1,
        action: "Imports os module",
        why: "Loads tools for interacting with the OS.",
        memory: [
          { name: "os", value: "<module 'os'>", type: "module", note: "OS loaded", accent: "#a78bfa" }
        ],
        output: ""
      },
      {
        line: 2,
        action: "Checks for file",
        why: "Queries the filesystem. In this case, it's missing.",
        memory: [
          { name: "os", value: "<module 'os'>", type: "module", note: "OS loaded", accent: "#a78bfa" },
          { name: "exists", value: "False", type: "bool", note: "File not found", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 3,
        action: "Evaluates condition",
        why: "Checks if 'exists' is True.",
        memory: [
          { name: "os", value: "<module 'os'>", type: "module", note: "OS loaded", accent: "#a78bfa" },
          { name: "exists", value: "False", type: "bool", note: "File not found", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 5,
        action: "Jumps to else",
        why: "Since 'exists' is False, we go here.",
        memory: [
          { name: "os", value: "<module 'os'>", type: "module", note: "OS loaded", accent: "#a78bfa" },
          { name: "exists", value: "False", type: "bool", note: "File not found", accent: "#f472b6" }
        ],
        output: ""
      },
      {
        line: 6,
        action: "Prints result",
        why: "Informs the user the file is missing.",
        memory: [
          { name: "os", value: "<module 'os'>", type: "module", note: "OS loaded", accent: "#a78bfa" },
          { name: "exists", value: "False", type: "bool", note: "File not found", accent: "#f472b6" }
        ],
        output: "Lost\n"
      }
    ]
  }
};
