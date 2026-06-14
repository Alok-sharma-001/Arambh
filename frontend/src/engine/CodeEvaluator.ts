import { ExecutionStep, MemoryVariable } from './VisualizationEngine';

export interface EvaluationResult {
  isValid: boolean;
  error?: string;
  steps: ExecutionStep[];
  parsedVars: Record<string, string>;
}

export class CodeEvaluator {
  
  /**
   * Normalizes python code to remove semantic-less formatting differences.
   */
  static normalize(code: string): string {
    return code
      .split('\n')
      .map(line => {
        // Strip leading/trailing whitespace if it's not meaningful (we keep indentation)
        let normalized = line.trimEnd();
        // Replace multiple spaces around operators with single space
        normalized = normalized.replace(/\s*([=+\-*/<>!])\s*/g, ' $1 ');
        // Normalize quotes to double quotes for easier matching
        normalized = normalized.replace(/'([^']*)'/g, '"$1"');
        return normalized;
      })
      .filter(line => line.trim().length > 0) // Remove empty lines
      .join('\n');
  }

  /**
   * A simplified AST-like evaluator that attempts to parse basic Python constructs
   * and trace execution steps.
   */
  static evaluate(code: string, expectedVars?: Record<string, any>): EvaluationResult {
    const normalizedCode = this.normalize(code);
    const lines = normalizedCode.split('\n');
    
    const steps: ExecutionStep[] = [];
    const memory: Record<string, MemoryVariable> = {};
    const parsedVars: Record<string, string> = {};
    const prints: string[] = [];
    
    let error: string | undefined = undefined;
    let stepId = 1;

    // Very basic interpreter loop for assignments and prints
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 1. Check for Assignment
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const rawValue = assignMatch[2];
        parsedVars[varName] = rawValue;
        
        // Infer type (super naive for visualization)
        let type: MemoryVariable['type'] = 'string';
        let valString = rawValue;
        if (!isNaN(Number(rawValue))) {
          type = rawValue.includes('.') ? 'float' : 'int';
        } else if (rawValue === 'True' || rawValue === 'False') {
          type = 'bool';
        } else if (rawValue.startsWith('[') && rawValue.endsWith(']')) {
          type = 'list';
        }

        memory[varName] = { address: `0x0${stepId}`, name: varName, value: valString, type };
        
        steps.push({
          id: stepId++,
          type: 'ALLOCATE',
          description: `Assigned value ${valString} to variable ${varName}`,
          lineNumber: i + 1,
          variable: memory[varName],
          memorySnapshot: { ...memory }
        });
        continue;
      }

      // 2. Check for Print
      const printMatch = line.match(/^print\((.*)\)$/);
      if (printMatch) {
        const inner = printMatch[1].trim();
        let outVal = inner;
        // If printing a variable
        if (memory[inner]) {
          outVal = memory[inner].value;
        } else if (inner.startsWith('"') && inner.endsWith('"')) {
          outVal = inner.slice(1, -1);
        }
        
        prints.push(outVal);
        steps.push({
          id: stepId++,
          type: 'PRINT',
          description: `Printed: ${outVal}`,
          lineNumber: i + 1,
          output: outVal,
          memorySnapshot: { ...memory }
        });
        continue;
      }

      // 3. For Loops
      const forMatch = line.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*?)\):/);
      if (forMatch) {
        const iterVar = forMatch[1];
        const rangeArg = forMatch[2];
        let iters = parseInt(rangeArg);
        if (isNaN(iters)) iters = 5; // Default fallback if range is variable or complex
        
        for (let j = 0; j < iters; j++) {
          memory[iterVar] = { address: `0xL${j}`, name: iterVar, value: j.toString(), type: 'int' };
          steps.push({
            id: stepId++,
            type: 'LOOP_ITERATION',
            description: `Loop iteration ${j}`,
            lineNumber: i + 1,
            loopState: { currentIteration: j, totalIterations: iters, loopType: 'for' },
            memorySnapshot: { ...memory }
          });
          
          // Execute inner block (naive assumption: just 1 line inside for this MVP evaluator)
          if (i + 1 < lines.length && lines[i+1].startsWith(' ')) {
            const innerLine = lines[i+1].trim();
            if (innerLine.startsWith('print(')) {
              steps.push({
                id: stepId++,
                type: 'PRINT',
                description: `Printed from loop`,
                lineNumber: i + 2,
                output: `Loop value`,
                memorySnapshot: { ...memory }
              });
            }
          }
        }
        i++; // Skip the inner block line as it was processed
        continue;
      }
    }

    // Validation Logic
    let isValid = true;
    
    // Check Expected Vars
    if (expectedVars) {
      for (const [key, val] of Object.entries(expectedVars)) {
        if (!parsedVars[key]) {
          isValid = false;
          error = `Missing variable assignment: ${key}`;
          break;
        }
        if (val !== '*' && parsedVars[key] !== val.toString()) {
          isValid = false;
          error = `Variable '${key}' has incorrect value. Expected ${val}, got ${parsedVars[key]}.`;
          break;
        }
      }
    }

    return { isValid, error, steps, parsedVars };
  }
}
