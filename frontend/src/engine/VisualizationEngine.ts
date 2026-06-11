export type StepType = 'ALLOCATE' | 'UPDATE' | 'EVALUATE' | 'PRINT' | 'IDLE';

export interface MemoryVariable {
  address: string; // e.g., '0x00'
  name: string;
  value: string;
  type: 'int' | 'string' | 'bool' | 'float';
}

export interface EvalNode {
  leftVal: string;
  rightVal: string;
  operator: string;
  result: string;
  targetVarName: string;
}

export interface ExecutionStep {
  id: number;
  type: StepType;
  description: string;
  lineNumber: number;
  
  // Payload
  variable?: MemoryVariable; // For ALLOCATE / UPDATE
  evaluation?: EvalNode;     // For EVALUATE
  output?: string;           // For PRINT
  
  // Snapshot of entire memory after this step finishes
  memorySnapshot: Record<string, MemoryVariable>; 
}

// Hardcoded initial architecture for Sprint 3
export const generateMockExecution = (): ExecutionStep[] => {
  return [
    {
      id: 0,
      type: 'IDLE',
      description: 'System Ready. Awaiting execution.',
      lineNumber: 0,
      memorySnapshot: {},
    },
    {
      id: 1,
      type: 'ALLOCATE',
      description: "Allocated integer 5 to memory slot 0x00. Attached label 'x'.",
      lineNumber: 1,
      variable: { address: '0x00', name: 'x', value: '5', type: 'int' },
      memorySnapshot: {
        '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' },
      },
    },
    {
      id: 2,
      type: 'ALLOCATE',
      description: "Allocated integer 10 to memory slot 0x01. Attached label 'y'.",
      lineNumber: 2,
      variable: { address: '0x01', name: 'y', value: '10', type: 'int' },
      memorySnapshot: {
        '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' },
        '0x01': { address: '0x01', name: 'y', value: '10', type: 'int' },
      },
    },
    {
      id: 3,
      type: 'EVALUATE',
      description: "Evaluated expression: 5 + 10 -> 15. Storing in 'z'.",
      lineNumber: 3,
      evaluation: { leftVal: '5', rightVal: '10', operator: '+', result: '15', targetVarName: 'z' },
      memorySnapshot: {
        '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' },
        '0x01': { address: '0x01', name: 'y', value: '10', type: 'int' },
      },
    },
    {
      id: 4,
      type: 'ALLOCATE',
      description: "Allocated integer 15 to memory slot 0x02. Attached label 'z'.",
      lineNumber: 3,
      variable: { address: '0x02', name: 'z', value: '15', type: 'int' },
      memorySnapshot: {
        '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' },
        '0x01': { address: '0x01', name: 'y', value: '10', type: 'int' },
        '0x02': { address: '0x02', name: 'z', value: '15', type: 'int' },
      },
    },
    {
      id: 5,
      type: 'PRINT',
      description: "Outputting value of 'z' to terminal.",
      lineNumber: 4,
      output: '15',
      memorySnapshot: {
        '0x00': { address: '0x00', name: 'x', value: '5', type: 'int' },
        '0x01': { address: '0x01', name: 'y', value: '10', type: 'int' },
        '0x02': { address: '0x02', name: 'z', value: '15', type: 'int' },
      },
    }
  ];
};
