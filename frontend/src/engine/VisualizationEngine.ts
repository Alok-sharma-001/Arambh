export type StepType = 'ALLOCATE' | 'UPDATE' | 'EVALUATE' | 'PRINT' | 'IDLE' | 'TYPE_CHANGE' | 'DELETE' | 'LOOP_START' | 'LOOP_ITERATION' | 'LOOP_END' | 'FUNCTION_DEF' | 'FUNCTION_CALL' | 'FUNCTION_RETURN' | 'SCOPE_ENTER' | 'SCOPE_EXIT' | 'ERROR' | 'ERROR_CAUGHT' | 'FILE_OPEN' | 'FILE_READ' | 'FILE_WRITE' | 'FILE_CLOSE' | 'IMPORT_MODULE' | 'ARRAY_SWAP' | 'POINTER_MOVE' | 'ALGORITHM_STEP';

export interface AlgorithmState {
  array: any[];
  pointers: Record<string, number>; // e.g. { low: 0, high: 9, mid: 4 }
  operations: number;
  complexity: 'O(1)' | 'O(N)' | 'O(log N)' | 'O(N^2)';
  algorithmName: string;
  comparing?: [number, number]; // Indices currently being compared
  swapped?: [number, number]; // Indices that just swapped
}

export interface MemoryVariable {
  address: string; // e.g., '0x00'
  name: string;
  value: string;
  type: 'int' | 'string' | 'bool' | 'float' | 'list' | 'tuple' | 'set' | 'dict' | 'class' | 'object' | 'exception' | 'text_file' | 'json_file' | 'module';
}

export interface EvalNode {
  leftVal: string;
  rightVal: string;
  operator: string;
  result: string;
  targetVarName: string;
}

export interface LoopState {
  currentIteration: number;
  totalIterations?: number;
  loopType: 'for' | 'while';
}

export interface FunctionCallState {
  functionName: string;
  args?: Record<string, string>;     // param → value mapping
  returnValue?: string;
}

export interface ScopeState {
  scopeName: string;       // 'global' or function name
  scopeType: 'global' | 'local';
  variables: Record<string, MemoryVariable>;
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
  loopState?: LoopState;     // For LOOP_* steps
  functionCall?: FunctionCallState; // For FUNCTION_* steps
  scopeState?: ScopeState;   // For SCOPE_* steps
  callStack?: string[];      // Stack of function names for Call Stack Tower
  
  // Snapshot of entire memory after this step finishes
  memorySnapshot: Record<string, MemoryVariable>; 
  
  // Snapshot of simulated file system
  fileSystemSnapshot?: Record<string, string>;

  // Snapshot of imported modules
  importedModules?: Record<string, { type: 'built-in' | 'specific' | 'alias' | 'custom' | 'package', exports: string[] }>;
  
  // State for Algorithm Theater
  algorithmState?: AlgorithmState;
}
