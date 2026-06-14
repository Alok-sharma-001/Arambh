export type FloorType = 'A_Foundations' | 'B_Repetition' | 'C_Architectural' | 'D_Hoarders' | 'E_Constructs' | 'F_Chaos' | 'G_Ascension' | 'BOSS_MINI' | 'BOSS_MAJOR' | 'BOSS_LEGENDARY';

export interface ProceduralChallenge {
  floor: number;
  type: FloorType;
  title: string;
  description: string;
  initialCode: string;
  validate: (code: string) => { isValid: boolean; error?: string; executionTimeMs?: number };
}

// Very basic engine, easily extendable
export class TowerEngine {
  
  static generateFloor(floorNumber: number): ProceduralChallenge {
    if (floorNumber % 50 === 0) return this.generateBoss(floorNumber, 'BOSS_LEGENDARY');
    if (floorNumber % 25 === 0) return this.generateBoss(floorNumber, 'BOSS_MAJOR');
    if (floorNumber % 10 === 0) return this.generateBoss(floorNumber, 'BOSS_MINI');
    
    // Procedural simple challenge
    const rand = Math.random();
    if (rand < 0.3) return this.generateFoundations(floorNumber);
    if (rand < 0.6) return this.generateRepetition(floorNumber);
    return this.generateHoarders(floorNumber);
  }

  private static generateFoundations(floor: number): ProceduralChallenge {
    const target = Math.floor(Math.random() * 100) + 1;
    return {
      floor,
      type: 'A_Foundations',
      title: 'Variable Integrity',
      description: `Create a variable named 'x' and assign it the value ${target}.`,
      initialCode: '# Write your code here\n',
      validate: (code) => {
        const hasAssignment = new RegExp(`x\\s*=\\s*${target}`).test(code);
        return { isValid: hasAssignment, error: hasAssignment ? undefined : `Variable 'x' is not assigned ${target}.` };
      }
    };
  }

  private static generateRepetition(floor: number): ProceduralChallenge {
    const iters = Math.floor(Math.random() * 5) + 3;
    return {
      floor,
      type: 'B_Repetition',
      title: 'Looping Construct',
      description: `Write a for loop that prints "hello" exactly ${iters} times.`,
      initialCode: '# Write your loop here\n',
      validate: (code) => {
        const hasFor = code.includes('for');
        const hasPrint = code.includes('print("hello")') || code.includes("print('hello')");
        // Naive validation for prototype
        if (!hasFor) return { isValid: false, error: "Missing 'for' loop." };
        if (!hasPrint) return { isValid: false, error: "Missing print statement." };
        return { isValid: true };
      }
    };
  }

  private static generateHoarders(floor: number): ProceduralChallenge {
    return {
      floor,
      type: 'D_Hoarders',
      title: 'List Filtering',
      description: `Create a list named 'my_list' containing the numbers 1, 2, 3.`,
      initialCode: '# Initialize the list\n',
      validate: (code) => {
        const isValid = code.includes('my_list') && code.includes('[1, 2, 3]');
        return { isValid, error: isValid ? undefined : "Check your list creation syntax." };
      }
    };
  }

  private static generateBoss(floor: number, type: FloorType): ProceduralChallenge {
    return {
      floor,
      type,
      title: type === 'BOSS_MINI' ? 'Gatekeeper of Logic' : 'Sentinel of Syntax',
      description: `Survive the ${type} encounter! Ensure your code runs flawlessly.`,
      initialCode: 'def survive():\n    return True\n',
      validate: (code) => {
        const isValid = code.includes('return True');
        return { isValid, error: isValid ? undefined : "The boss demands 'return True'" };
      }
    };
  }
}
