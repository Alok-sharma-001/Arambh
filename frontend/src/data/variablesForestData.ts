import { ExecutionStep } from '../engine/VisualizationEngine';

export interface LessonData {
  id: string;
  title: string;
  story: {
    speaker: string;
    emoji: string;
    lines: string[];
  };
  explain: {
    title: string;
    description: string[];
    code: string;
    steps: ExecutionStep[];
  };
  practice: {
    title: string;
    description: string;
    initialCode: string;
    validation: (code: string) => { isValid: boolean; error?: string; parsedVars?: Record<string, string> };
    successSteps: ExecutionStep[];
  };
  challenge: {
    title: string;
    description: string;
    initialCode: string;
    validation: (code: string) => { isValid: boolean; error?: string; parsedVars?: Record<string, string> };
    successSteps: ExecutionStep[];
  };
  rewardXP: number;
}

export const VARIABLES_FOREST_LESSONS: Record<string, LessonData> = {
  '1': {
    id: '1',
    title: 'The Memory Crystal',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "Welcome, traveler. The ancient Memory Crystal of this forest has lost its light. It used to hold the fundamental truths of our world, but its values have scattered.",
        "To restore it, you must learn the ancient art of Variables. They are the vessels that hold data in our realm. Come, let me show you how to forge one."
      ]
    },
    explain: {
      title: 'Variables are Boxes',
      description: [
        "Think of the computer's memory as a giant warehouse. A variable is just a labeled box where we can store data.",
        "When you type x = 5, you are telling Python: 'Create a box, label it x, and put the number 5 inside it.'"
      ],
      code: "x = 5",
      steps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 5 to memory slot 0x01. Attached label 'x'.",
          lineNumber: 1, 
          variable: { address: '0x01', name: 'x', value: '5', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '5', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'Your First Spell',
      description: "Now it's your turn. In the editor below, create a variable named x and set its value to 5.",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\\s+/g, '');
        if (cleaned === 'x=5') return { isValid: true };
        if (!cleaned.includes('x')) return { isValid: false, error: "Make sure you named the variable 'x'." };
        if (!cleaned.includes('5')) return { isValid: false, error: "Make sure the value is 5." };
        if (!cleaned.includes('=')) return { isValid: false, error: "Use '=' to assign the value." };
        return { isValid: false, error: "Expected format: x = 5" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 5 to memory slot 0x01. Attached label 'x'.",
          lineNumber: 1, 
          variable: { address: '0x01', name: 'x', value: '5', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '5', type: 'int' } }
        }
      ]
    },
    challenge: {
      title: 'Mini Challenge',
      description: "Create a variable named age and store the value 18 inside it.",
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\\s+/g, '');
        if (cleaned === 'age=18') return { isValid: true };
        if (!cleaned.includes('age')) return { isValid: false, error: "Make sure your variable is exactly named 'age'." };
        if (!cleaned.includes('18')) return { isValid: false, error: "Make sure you assign the value 18." };
        if (!cleaned.includes('=')) return { isValid: false, error: "Use '=' to assign the value." };
        return { isValid: false, error: "Expected format: age = 18" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 18 to memory slot 0x02. Attached label 'age'.",
          lineNumber: 1, 
          variable: { address: '0x02', name: 'age', value: '18', type: 'int' },
          memorySnapshot: { '0x02': { address: '0x02', name: 'age', value: '18', type: 'int' } }
        }
      ]
    },
    rewardXP: 50
  },
  '2': {
    id: '2',
    title: 'Naming the Spirits',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "Excellent! But numbers are not the only things we can store.",
        "We can also capture words, names, and phrases. We call these 'Strings', because they are strings of characters bound together by quotes."
      ]
    },
    explain: {
      title: 'Strings of Power',
      description: [
        "To store text, you must wrap it in quotes (either double \" or single ').",
        "Example: name = \"Alok\" will store the word Alok in a box labeled name."
      ],
      code: 'name = "Alok"',
      steps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: 'Allocated string "Alok" to memory slot 0x03. Attached label \'name\'.',
          lineNumber: 1, 
          variable: { address: '0x03', name: 'name', value: '"Alok"', type: 'string' },
          memorySnapshot: { '0x03': { address: '0x03', name: 'name', value: '"Alok"', type: 'string' } }
        }
      ]
    },
    practice: {
      title: 'Summoning a Hero',
      description: 'Create a variable named hero and assign it the string value "Mage".',
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\\s+/g, '');
        if (cleaned === 'hero="Mage"' || cleaned === "hero='Mage'") return { isValid: true };
        if (!cleaned.includes('hero')) return { isValid: false, error: "Variable must be named 'hero'." };
        if (!cleaned.includes('Mage')) return { isValid: false, error: "Value must be 'Mage'." };
        if (!cleaned.includes('"') && !cleaned.includes("'")) return { isValid: false, error: "Don't forget to put quotes around 'Mage'!" };
        return { isValid: false, error: "Expected format: hero = \"Mage\"" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: 'Allocated string "Mage" to memory slot 0x04. Attached label \'hero\'.',
          lineNumber: 1, 
          variable: { address: '0x04', name: 'hero', value: '"Mage"', type: 'string' },
          memorySnapshot: { '0x04': { address: '0x04', name: 'hero', value: '"Mage"', type: 'string' } }
        }
      ]
    },
    challenge: {
      title: 'The Loyal Companion',
      description: 'Every hero needs a companion. Create a variable named pet and assign it the string "Dragon".',
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\\s+/g, '');
        if (cleaned === 'pet="Dragon"' || cleaned === "pet='Dragon'") return { isValid: true };
        if (!cleaned.includes('pet')) return { isValid: false, error: "Variable must be named 'pet'." };
        if (!cleaned.includes('Dragon')) return { isValid: false, error: "Value must be 'Dragon'." };
        return { isValid: false, error: "Expected format: pet = \"Dragon\"" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: 'Allocated string "Dragon" to memory slot 0x05. Attached label \'pet\'.',
          lineNumber: 1, 
          variable: { address: '0x05', name: 'pet', value: '"Dragon"', type: 'string' },
          memorySnapshot: { '0x05': { address: '0x05', name: 'pet', value: '"Dragon"', type: 'string' } }
        }
      ]
    },
    rewardXP: 50
  },
  '3': {
    id: '3',
    title: 'Changing Reality',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "A variable is not set in stone. It is fluid, like water.",
        "You can change the contents of a box at any time simply by assigning it a new value. Watch closely as reality shifts."
      ]
    },
    explain: {
      title: 'Reassignment',
      description: [
        "When you assign a new value to an existing variable, the old value is thrown away.",
        "Here, x starts as 5, but then we change it to 10."
      ],
      code: "x = 5\\nx = 10",
      steps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 5 to memory slot 0x01. Attached label 'x'.",
          lineNumber: 1, 
          variable: { address: '0x01', name: 'x', value: '5', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '5', type: 'int' } }
        },
        { 
          id: 2, type: 'UPDATE', 
          description: "Updated memory slot 0x01 labeled 'x' to 10.",
          lineNumber: 2, 
          variable: { address: '0x01', name: 'x', value: '10', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '10', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'Shifting the Score',
      description: 'Create a variable score and set it to 20.',
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\\s+/g, '');
        if (cleaned === 'score=20') return { isValid: true };
        return { isValid: false, error: "Expected: score = 20" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 20 to memory slot 0x06. Attached label 'score'.",
          lineNumber: 1, 
          variable: { address: '0x06', name: 'score', value: '20', type: 'int' },
          memorySnapshot: { '0x06': { address: '0x06', name: 'score', value: '20', type: 'int' } }
        }
      ]
    },
    challenge: {
      title: 'A New High Score',
      description: 'Your score was 20, but you just defeated an enemy! Set score to 50.',
      initialCode: "score = 20\n",
      validation: (code) => {
        const lines = code.split('\n').map(l => l.replace(/\s+/g, '')).filter(l => l !== '');
        if (lines[lines.length - 1] === 'score=50') return { isValid: true };
        return { isValid: false, error: "Reassign the score variable to 50 on the new line." };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', 
          description: "Allocated integer 20 to memory slot 0x06. Attached label 'score'.",
          lineNumber: 1, 
          variable: { address: '0x06', name: 'score', value: '20', type: 'int' },
          memorySnapshot: { '0x06': { address: '0x06', name: 'score', value: '20', type: 'int' } }
        },
        { 
          id: 2, type: 'UPDATE', 
          description: "Updated memory slot 0x06 labeled 'score' to 50.",
          lineNumber: 2, 
          variable: { address: '0x06', name: 'score', value: '50', type: 'int' },
          memorySnapshot: { '0x06': { address: '0x06', name: 'score', value: '50', type: 'int' } }
        }
      ]
    },
    rewardXP: 75
  },
  '4': {
    id: '4',
    title: 'Variable Combinations',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "Single values are useful, but the true power of magic comes from combining them.",
        "You can use variables to calculate new values. Let us fuse them together in the Calculation Chamber."
      ]
    },
    explain: {
      title: 'Math with Variables',
      description: [
        "Instead of adding numbers directly, we can add the variables that hold those numbers.",
        "Here, z becomes the sum of x and y."
      ],
      code: "x = 5\\ny = 10\\nz = x + y",
      steps: [
        { 
          id: 1, type: 'ALLOCATE', description: "Allocated integer 5 to 'x'.", lineNumber: 1, 
          variable: { address: '0x01', name: 'x', value: '5', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '5', type: 'int' } }
        },
        { 
          id: 2, type: 'ALLOCATE', description: "Allocated integer 10 to 'y'.", lineNumber: 2, 
          variable: { address: '0x02', name: 'y', value: '10', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '5', type: 'int' }, '0x02': { address: '0x02', name: 'y', value: '10', type: 'int' } }
        },
        { 
          id: 3, type: 'EVALUATE', description: "Evaluated x + y -> 15. Storing in 'z'.", lineNumber: 3, 
          evaluation: { leftVal: '5', rightVal: '10', operator: '+', result: '15', targetVarName: 'z' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '5', type: 'int' }, '0x02': { address: '0x02', name: 'y', value: '10', type: 'int' } }
        },
        { 
          id: 4, type: 'ALLOCATE', description: "Allocated integer 15 to 'z'.", lineNumber: 3, 
          variable: { address: '0x03', name: 'z', value: '15', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'x', value: '5', type: 'int' }, '0x02': { address: '0x02', name: 'y', value: '10', type: 'int' }, '0x03': { address: '0x03', name: 'z', value: '15', type: 'int' } }
        }
      ]
    },
    practice: {
      title: 'Setting the Stage',
      description: 'Create two variables: a = 2 and b = 3. Put them on separate lines.',
      initialCode: "",
      validation: (code) => {
        const lines = code.split('\n').map(l => l.replace(/\s+/g, '')).filter(l => l !== '');
        if (lines.includes('a=2') && lines.includes('b=3')) return { isValid: true };
        return { isValid: false, error: "Make sure you have both a = 2 and b = 3 on separate lines." };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', description: "Allocated integer 2 to 'a'.", lineNumber: 1, 
          variable: { address: '0x01', name: 'a', value: '2', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'a', value: '2', type: 'int' } }
        },
        { 
          id: 2, type: 'ALLOCATE', description: "Allocated integer 3 to 'b'.", lineNumber: 2, 
          variable: { address: '0x02', name: 'b', value: '3', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'a', value: '2', type: 'int' }, '0x02': { address: '0x02', name: 'b', value: '3', type: 'int' } }
        }
      ]
    },
    challenge: {
      title: 'Fusion Challenge',
      description: 'Now, create a variable named result and set it equal to a + b.',
      initialCode: "a = 2\nb = 3\n",
      validation: (code) => {
        const cleaned = code.replace(/\\s+/g, '');
        if (cleaned.includes('result=a+b') || cleaned.includes('result=b+a')) return { isValid: true };
        return { isValid: false, error: "Use the expression a + b to assign to the 'result' variable." };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', description: "Allocated integer 2 to 'a'.", lineNumber: 1, 
          variable: { address: '0x01', name: 'a', value: '2', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'a', value: '2', type: 'int' } }
        },
        { 
          id: 2, type: 'ALLOCATE', description: "Allocated integer 3 to 'b'.", lineNumber: 2, 
          variable: { address: '0x02', name: 'b', value: '3', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'a', value: '2', type: 'int' }, '0x02': { address: '0x02', name: 'b', value: '3', type: 'int' } }
        },
        { 
          id: 3, type: 'EVALUATE', description: "Evaluated a + b -> 5. Storing in 'result'.", lineNumber: 3, 
          evaluation: { leftVal: '2', rightVal: '3', operator: '+', result: '5', targetVarName: 'result' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'a', value: '2', type: 'int' }, '0x02': { address: '0x02', name: 'b', value: '3', type: 'int' } }
        },
        { 
          id: 4, type: 'ALLOCATE', description: "Allocated integer 5 to 'result'.", lineNumber: 3, 
          variable: { address: '0x03', name: 'result', value: '5', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'a', value: '2', type: 'int' }, '0x02': { address: '0x02', name: 'b', value: '3', type: 'int' }, '0x03': { address: '0x03', name: 'result', value: '5', type: 'int' } }
        }
      ]
    },
    rewardXP: 100
  },
  '5': {
    id: '5',
    title: 'Memory Mastery',
    story: {
      speaker: 'Elder Py',
      emoji: '🧙‍♂️',
      lines: [
        "You have mastered the basics of variables, reassignment, and calculation.",
        "Before you face the Guardian, let us do one final trial to test your might."
      ]
    },
    explain: {
      title: 'The Mixed Trial',
      description: [
        "A script can have multiple variables of different types running at the same time.",
        "You've learned ints and strings. Soon, you will learn much more."
      ],
      code: "hp = 100\\nname = \"Hero\"\\ndamage = 5",
      steps: [
        { 
          id: 1, type: 'ALLOCATE', description: "Allocated 100 to 'hp'.", lineNumber: 1, 
          variable: { address: '0x01', name: 'hp', value: '100', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'hp', value: '100', type: 'int' } }
        },
        { 
          id: 2, type: 'ALLOCATE', description: "Allocated 'Hero' to 'name'.", lineNumber: 2, 
          variable: { address: '0x02', name: 'name', value: '"Hero"', type: 'string' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'hp', value: '100', type: 'int' }, '0x02': { address: '0x02', name: 'name', value: '"Hero"', type: 'string' } }
        }
      ]
    },
    practice: {
      title: 'Warmup',
      description: 'Create a variable level and set it to 1.',
      initialCode: "",
      validation: (code) => {
        const cleaned = code.replace(/\\s+/g, '');
        if (cleaned === 'level=1') return { isValid: true };
        return { isValid: false, error: "Expected: level = 1" };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', description: "Allocated 1 to 'level'.", lineNumber: 1, 
          variable: { address: '0x01', name: 'level', value: '1', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'level', value: '1', type: 'int' } }
        }
      ]
    },
    challenge: {
      title: 'The Final Test',
      description: 'Create three variables: name = "Mage", level = 5, xp = 100. Do this on separate lines.',
      initialCode: "",
      validation: (code) => {
        const lines = code.split('\n').map(l => l.replace(/\s+/g, '')).filter(l => l !== '');
        const hasName = lines.includes('name="Mage"') || lines.includes("name='Mage'");
        const hasLevel = lines.includes('level=5');
        const hasXp = lines.includes('xp=100');
        if (hasName && hasLevel && hasXp) return { isValid: true };
        if (!hasName) return { isValid: false, error: "Missing or incorrect 'name' variable." };
        if (!hasLevel) return { isValid: false, error: "Missing or incorrect 'level' variable." };
        if (!hasXp) return { isValid: false, error: "Missing or incorrect 'xp' variable." };
        return { isValid: false, error: "Check your variables again." };
      },
      successSteps: [
        { 
          id: 1, type: 'ALLOCATE', description: "Allocated 'Mage' to 'name'.", lineNumber: 1, 
          variable: { address: '0x01', name: 'name', value: '"Mage"', type: 'string' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'name', value: '"Mage"', type: 'string' } }
        },
        { 
          id: 2, type: 'ALLOCATE', description: "Allocated 5 to 'level'.", lineNumber: 2, 
          variable: { address: '0x02', name: 'level', value: '5', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'name', value: '"Mage"', type: 'string' }, '0x02': { address: '0x02', name: 'level', value: '5', type: 'int' } }
        },
        { 
          id: 3, type: 'ALLOCATE', description: "Allocated 100 to 'xp'.", lineNumber: 3, 
          variable: { address: '0x03', name: 'xp', value: '100', type: 'int' },
          memorySnapshot: { '0x01': { address: '0x01', name: 'name', value: '"Mage"', type: 'string' }, '0x02': { address: '0x02', name: 'level', value: '5', type: 'int' }, '0x03': { address: '0x03', name: 'xp', value: '100', type: 'int' } }
        }
      ]
    },
    rewardXP: 150
  }
};
