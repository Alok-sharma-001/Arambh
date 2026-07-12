import { ExecutionStep, MemoryVariable } from './VisualizationEngine';

export interface EvaluationResult {
  isValid: boolean;
  error?: string;
  steps: ExecutionStep[];
  parsedVars: Record<string, string>;
}

function replaceVariables(expr: string, memory: Record<string, MemoryVariable>): string {
  // Split by double quotes. String literals will be at odd indices.
  const parts = expr.split('"');
  for (let i = 0; i < parts.length; i += 2) {
    // Replace variables in parts[i]
    for (const [name, variable] of Object.entries(memory)) {
      const varRegex = new RegExp(`\\b${name}\\b`, 'g');
      parts[i] = parts[i].replace(varRegex, variable.value);
    }
  }
  return parts.join('"');
}

function getValType(val: any): MemoryVariable['type'] {
  if (typeof val === 'string') return 'string';
  if (typeof val === 'number') return String(val).includes('.') ? 'float' : 'int';
  if (typeof val === 'boolean') return 'bool';
  if (Array.isArray(val)) {
    if ((val as any).__tuple__) return 'tuple';
    if ((val as any).__set__) return 'set';
    return 'list';
  }
  return 'string';
}

function toPythonString(val: any, type: MemoryVariable['type']): string {
  if (type === 'tuple' || (Array.isArray(val) && (val as any).__tuple__)) {
    if (Array.isArray(val)) {
      if (val.length === 1) {
        return `(${toPythonString(val[0], getValType(val[0]))},)`;
      }
      return `(${val.map(v => toPythonString(v, getValType(v))).join(', ')})`;
    }
  }
  if (type === 'set' || (Array.isArray(val) && (val as any).__set__)) {
    if (Array.isArray(val)) {
      if (val.length === 0) return 'set()';
      return `{${val.map(v => toPythonString(v, getValType(v))).join(', ')}}`;
    }
  }
  if (type === 'dict') {
    if (typeof val === 'object' && val !== null) {
      const items = Object.entries(val).map(([k, v]) => {
        let keyVal: any = k;
        if (k === 'true') keyVal = true;
        else if (k === 'false') keyVal = false;
        else if (!isNaN(Number(k)) && k.trim() !== '') {
          keyVal = Number(k);
        }
        const keyStr = toPythonString(keyVal, getValType(keyVal));
        const valStr = toPythonString(v, getValType(v));
        return `${keyStr}: ${valStr}`;
      });
      return `{${items.join(', ')}}`;
    }
  }
  if (type === 'list') {
    if (Array.isArray(val)) {
      return `[${val.map(v => toPythonString(v, getValType(v))).join(', ')}]`;
    }
  }
  if (type === 'string') {
    return `"${val}"`;
  }
  if (type === 'bool') {
    return val ? 'True' : 'False';
  }
  return String(val);
}

function splitArguments(argsStr: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  let bracketDepth = 0;
  let parenDepth = 0;
  let braceDepth = 0;

  for (let i = 0; i < argsStr.length; i++) {
    const char = argsStr[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      current += char;
    } else if (inQuotes) {
      current += char;
    } else if (char === '[') {
      bracketDepth++;
      current += char;
    } else if (char === ']') {
      bracketDepth--;
      current += char;
    } else if (char === '(') {
      parenDepth++;
      current += char;
    } else if (char === ')') {
      parenDepth--;
      current += char;
    } else if (char === '{') {
      braceDepth++;
      current += char;
    } else if (char === '}') {
      braceDepth--;
      current += char;
    } else if (char === ',' && bracketDepth === 0 && parenDepth === 0 && braceDepth === 0) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    result.push(current.trim());
  }
  return result;
}

function preprocessTuples(expr: string): string {
  let current = expr;
  let hasChanged = true;
  
  while (hasChanged) {
    hasChanged = false;
    current = current.replace(/(\b[a-zA-Z_]\w*\s*)?\(([^()]*)\)/g, (match, prefix, content) => {
      hasChanged = true;
      if (prefix) {
        return `${prefix}__OP__${content}__CL__`;
      } else {
        const trimmed = content.trim();
        const isTuple = trimmed === '' || trimmed.includes(',');
        if (isTuple) {
          return `tuple(${content})`;
        } else {
          return `__OP__${content}__CL__`;
        }
      }
    });
  }
  
  current = current.replace(/__OP__/g, '(').replace(/__CL__/g, ')');
  return current;
}

function inferTypeFromValue(valString: string): MemoryVariable['type'] {
  if (!isNaN(Number(valString))) {
    return valString.includes('.') ? 'float' : 'int';
  } else if (valString === 'True' || valString === 'False') {
    return 'bool';
  } else if (valString.startsWith('[') && valString.endsWith(']')) {
    return 'list';
  } else if (valString.startsWith('(') && valString.endsWith(')')) {
    return 'tuple';
  } else if (valString.startsWith('{') && valString.endsWith('}')) {
    return valString.includes(':') ? 'dict' : 'set';
  } else if (valString === 'set()') {
    return 'set';
  }
  return 'string';
}

function evaluateExpression(evalExpr: string, memory: Record<string, MemoryVariable>): { valString: string, type: MemoryVariable['type'] } {
  let checkSafe = evalExpr.replace(/"[^"]*"/g, '');
  checkSafe = checkSafe.replace(/\b(True|False)\b/g, '');
  checkSafe = checkSafe.replace(/\b(int|float|str|bool|type|set|list|dict|tuple|len)\b/g, '');
  
  const isSafe = /^[0-9+\-*/().\s\[\]{}:,]*$/.test(checkSafe);
  
  let valString = evalExpr;
  let type: MemoryVariable['type'] = 'string';
  
  if (isSafe) {
    try {
      let processedExpr = preprocessTuples(evalExpr);
      
      const isTuple = processedExpr.startsWith('(') && processedExpr.endsWith(')') && processedExpr.includes(',');
      const isSet = processedExpr.startsWith('{') && processedExpr.endsWith('}') && !processedExpr.includes(':') && processedExpr !== '{}';
      const isDict = processedExpr.startsWith('{') && processedExpr.endsWith('}') && (processedExpr.includes(':') || processedExpr === '{}');
      
      if (isTuple || isSet) {
        processedExpr = '[' + processedExpr.slice(1, -1) + ']';
      } else if (isDict) {
        processedExpr = '(' + processedExpr + ')';
      }
      
      processedExpr = processedExpr.replace(/\bTrue\b/g, 'true').replace(/\bFalse\b/g, 'false');
      
      const jsExpr = `
        (function() {
          const int = (val) => Math.trunc(Number(val));
          const float = (val) => Number(val);
          const str = (val) => {
            if (typeof val === 'boolean') return val ? 'True' : 'False';
            if (Array.isArray(val)) {
              if (val.__tuple__) {
                return '(' + val.map(x => typeof x === 'string' ? "'" + x + "'" : String(x)).join(', ') + ')';
              }
              return '[' + val.map(x => typeof x === 'string' ? "'" + x + "'" : String(x)).join(', ') + ']';
            }
            return String(val);
          };
          const bool = (val) => Boolean(val);
          const type = (val) => {
            if (val === null || val === undefined) return "<class 'NoneType'>";
            if (typeof val === 'string') return "<class 'str'>";
            if (typeof val === 'number') return String(val).includes('.') ? "<class 'float'>" : "<class 'int'>";
            if (typeof val === 'boolean') return "<class 'bool'>";
            if (Array.isArray(val)) {
              if (val.__tuple__) return "<class 'tuple'>";
              return "<class 'list'>";
            }
            return "<class 'dict'>";
          };
          const tuple = (...args) => {
            const arr = [...args];
            arr.__tuple__ = true;
            return arr;
          };
          const len = (val) => {
            if (val && typeof val === 'object') {
              if (Array.isArray(val)) return val.length;
              return Object.keys(val).length;
            }
            return String(val).length;
          };
          return (${processedExpr});
        })()
      `;
      
      // eslint-disable-next-line no-eval
      const result = eval(jsExpr);
      
      if (isTuple || (Array.isArray(result) && (result as any).__tuple__)) {
        type = 'tuple';
        valString = toPythonString(result, 'tuple');
      } else if (isSet) {
        type = 'set';
        valString = toPythonString(Array.from(new Set(result)), 'set');
      } else if (isDict) {
        type = 'dict';
        valString = toPythonString(result, 'dict');
      } else {
        type = getValType(result);
        valString = toPythonString(result, type);
      }
    } catch (e) {
      valString = evalExpr;
      type = inferTypeFromValue(valString);
    }
  } else {
    valString = evalExpr;
    type = inferTypeFromValue(valString);
  }
  
  return { valString, type };
}

function evaluatePrint(inner: string, memory: Record<string, MemoryVariable>): string {
  const args = splitArguments(inner);
  const evaluatedArgs = args.map(arg => {
    let outVal = arg;
    if (memory[arg]) {
      outVal = memory[arg].value;
    } else {
      const evalExpr = replaceVariables(arg, memory);
      const { valString } = evaluateExpression(evalExpr, memory);
      outVal = valString;
    }
    if (outVal.startsWith('"') && outVal.endsWith('"')) {
      outVal = outVal.slice(1, -1);
    }
    return outVal;
  });
  return evaluatedArgs.join(' ');
}

export class CodeEvaluator {
  
  static normalize(code: string): string {
    return code
      .split('\n')
      .map(line => {
        let normalized = line.trimEnd();
        normalized = normalized.replace(/\s*([=+\-*/<>!])\s*/g, ' $1 ');
        normalized = normalized.replace(/'([^']*)'/g, '"$1"');
        return normalized;
      })
      .filter(line => line.trim().length > 0)
      .join('\n');
  }

  static evaluate(code: string, expectedVars?: Record<string, any>): EvaluationResult {
    const normalizedCode = this.normalize(code);
    const lines = normalizedCode.split('\n');
    
    const steps: ExecutionStep[] = [];
    const memory: Record<string, MemoryVariable> = {};
    const parsedVars: Record<string, string> = {};
    const prints: string[] = [];
    const functions: Record<string, { params: string[], body: { lineIndex: number; content: string }[] }> = {};
    
    let error: string | undefined = undefined;
    let stepId = 1;

    const executeFunctionCall = (fName: string, aStr: string, callLineNum: number, targetVarName?: string) => {
      const funcDef = functions[fName];
      if (!funcDef) return;
      
      const argStrings = splitArguments(aStr);
      const argValues = argStrings.map(arg => evaluateExpression(replaceVariables(arg, memory), memory).valString);
      
      const localMemory = { ...memory };
      const paramMapping: Record<string, string> = {};
      funcDef.params.forEach((param, idx) => {
        const val = argValues[idx] !== undefined ? argValues[idx] : 'None';
        paramMapping[param] = val;
        
        let paramType = getValType(val);
        if (val === 'True' || val === 'False') paramType = 'bool';
        else if (val.startsWith('[') && val.endsWith(']')) paramType = 'list';
        else if (val.startsWith('(') && val.endsWith(')')) paramType = 'tuple';
        else if (val.startsWith('{') && val.endsWith('}')) paramType = val.includes(':') ? 'dict' : 'set';
        
        localMemory[param] = {
          address: `0xP${stepId}_${idx}`,
          name: param,
          value: val,
          type: paramType
        };
      });
      
      steps.push({
        id: stepId++,
        type: 'FUNCTION_CALL',
        description: `Called function ${fName}(${argValues.join(', ')})`,
        lineNumber: callLineNum,
        functionCall: {
          functionName: fName,
          args: paramMapping
        },
        memorySnapshot: { ...memory }
      });
      
      let returnValue = 'None';
      let returned = false;
      
      for (const bodyLine of funcDef.body) {
        const lineText = bodyLine.content;
        const lineNum = bodyLine.lineIndex + 1;
        
        const printMatch = lineText.match(/^print\((.*)\)$/);
        if (printMatch) {
          const inner = printMatch[1].trim();
          const outVal = evaluatePrint(inner, localMemory);
          prints.push(outVal);
          steps.push({
            id: stepId++,
            type: 'PRINT',
            description: `Printed: ${outVal}`,
            lineNumber: lineNum,
            output: outVal,
            memorySnapshot: { ...localMemory }
          });
          continue;
        }
        
        const returnMatch = lineText.match(/^return\s+(.+)$/);
        if (returnMatch) {
          const retExpr = returnMatch[1].trim();
          returnValue = evaluateExpression(replaceVariables(retExpr, localMemory), localMemory).valString;
          returned = true;
          
          steps.push({
            id: stepId++,
            type: 'FUNCTION_RETURN',
            description: `${fName} returned ${returnValue}`,
            lineNumber: lineNum,
            functionCall: {
              functionName: fName,
              returnValue: returnValue
            },
            memorySnapshot: { ...localMemory }
          });
          break;
        }
        
        const assignMatch = lineText.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (assignMatch) {
          const varName = assignMatch[1];
          const rawValue = assignMatch[2];
          const { valString, type } = evaluateExpression(replaceVariables(rawValue, localMemory), localMemory);
          
          const isUpdate = !!localMemory[varName];
          localMemory[varName] = {
            address: isUpdate ? localMemory[varName].address : `0x0${stepId}`,
            name: varName,
            value: valString,
            type
          };
          
          steps.push({
            id: stepId++,
            type: isUpdate ? 'UPDATE' : 'ALLOCATE',
            description: isUpdate 
              ? `Updated variable ${varName} to ${valString}`
              : `Assigned value ${valString} to variable ${varName}`,
            lineNumber: lineNum,
            variable: localMemory[varName],
            memorySnapshot: { ...localMemory }
          });
          continue;
        }
        
        steps.push({
          id: stepId++,
          type: 'EVALUATE',
          description: `Executing statement: ${lineText}`,
          lineNumber: lineNum,
          memorySnapshot: { ...localMemory }
        });
      }
      
      if (targetVarName) {
        const isUpdate = !!memory[targetVarName];
        let retType = getValType(returnValue);
        if (returnValue === 'True' || returnValue === 'False') retType = 'bool';
        else if (returnValue.startsWith('[') && returnValue.endsWith(']')) retType = 'list';
        else if (returnValue.startsWith('(') && returnValue.endsWith(')')) retType = 'tuple';
        else if (returnValue.startsWith('{') && returnValue.endsWith('}')) retType = returnValue.includes(':') ? 'dict' : 'set';
        
        memory[targetVarName] = {
          address: isUpdate ? memory[targetVarName].address : `0x0${stepId}`,
          name: targetVarName,
          value: returnValue,
          type: retType
        };
        
        steps.push({
          id: stepId++,
          type: isUpdate ? 'UPDATE' : 'ALLOCATE',
          description: isUpdate 
            ? `Updated variable ${targetVarName} to ${returnValue}`
            : `Assigned value ${returnValue} to variable ${targetVarName}`,
          lineNumber: callLineNum,
          variable: memory[targetVarName],
          memorySnapshot: { ...memory }
        });
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('#')) {
        continue;
      }
      
      // Check for function definition
      const defMatch = line.match(/^def\s+([a-zA-Z_]\w*)\s*\((.*?)\)\s*:/);
      if (defMatch) {
        const funcName = defMatch[1];
        const paramsStr = defMatch[2].trim();
        const params = paramsStr ? paramsStr.split(',').map(p => p.trim()) : [];
        
        const bodyLines: { lineIndex: number; content: string }[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const nextLine = lines[j];
          if (nextLine.startsWith(' ') || nextLine.startsWith('\t')) {
            bodyLines.push({ lineIndex: j, content: nextLine.trim() });
            j++;
          } else {
            break;
          }
        }
        
        functions[funcName] = { params, body: bodyLines };
        memory[funcName] = { address: `0xF${stepId}`, name: funcName, value: `<function ${funcName}>`, type: 'function' };
        
        steps.push({
          id: stepId++,
          type: 'FUNCTION_DEF',
          description: `Defined function ${funcName}`,
          lineNumber: i + 1,
          functionCall: { functionName: funcName },
          memorySnapshot: { ...memory }
        });
        
        i = j - 1;
        continue;
      }

      // Check for function call standalone (e.g. greet())
      const standaloneCallMatch = line.match(/^([a-zA-Z_]\w*)\s*\((.*?)\)$/);
      if (standaloneCallMatch && functions[standaloneCallMatch[1]]) {
        const funcName = standaloneCallMatch[1];
        const argsStr = standaloneCallMatch[2];
        executeFunctionCall(funcName, argsStr, i + 1);
        continue;
      }

      // Check for function call assignment (e.g. x = add(2,3))
      const assignCallMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*([a-zA-Z_]\w*)\s*\((.*?)\)$/);
      if (assignCallMatch && functions[assignCallMatch[2]]) {
        const targetVar = assignCallMatch[1];
        const funcName = assignCallMatch[2];
        const argsStr = assignCallMatch[3];
        parsedVars[targetVar] = `${funcName}(${argsStr})`;
        executeFunctionCall(funcName, argsStr, i + 1, targetVar);
        continue;
      }
      
      // 1. Check for Assignment
      const assignMatch = line.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
      if (assignMatch) {
        const varName = assignMatch[1];
        const rawValue = assignMatch[2];
        parsedVars[varName] = rawValue;
        
        const evalExpr = replaceVariables(rawValue, memory);
        const { valString, type } = evaluateExpression(evalExpr, memory);

        const isUpdate = !!memory[varName];
        memory[varName] = { address: isUpdate ? memory[varName].address : `0x0${stepId}`, name: varName, value: valString, type };
        
        steps.push({
          id: stepId++,
          type: isUpdate ? 'UPDATE' : 'ALLOCATE',
          description: isUpdate 
            ? `Updated variable ${varName} to ${valString}`
            : `Assigned value ${valString} to variable ${varName}`,
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
        const outVal = evaluatePrint(inner, memory);
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
        
        const rangeArgs = rangeArg.split(',').map(arg => {
          const resolved = replaceVariables(arg.trim(), memory);
          const parsed = parseInt(resolved);
          return isNaN(parsed) ? null : parsed;
        });
        
        let start = 0;
        let stop = 5;
        if (rangeArgs.length === 1 && rangeArgs[0] !== null) {
          stop = rangeArgs[0];
        } else if (rangeArgs.length === 2 && rangeArgs[0] !== null && rangeArgs[1] !== null) {
          start = rangeArgs[0];
          stop = rangeArgs[1];
        }
        
        let iters = Math.max(0, stop - start);
        iters = Math.min(iters, 20); // Limit range iterations to prevent OOM
        
        let bodyCount = 0;
        let k = i + 1;
        while (k < lines.length && (lines[k].startsWith(' ') || lines[k].startsWith('\t'))) {
          bodyCount++;
          k++;
        }
        
        for (let j = 0; j < iters; j++) {
          const currentVal = start + j;
          memory[iterVar] = { address: `0xL${j}`, name: iterVar, value: currentVal.toString(), type: 'int' };
          steps.push({
            id: stepId++,
            type: 'LOOP_ITERATION',
            description: `Loop iteration ${j}`,
            lineNumber: i + 1,
            loopState: { currentIteration: j, totalIterations: iters, loopType: 'for' },
            memorySnapshot: { ...memory }
          });
          
          for (let m = 0; m < bodyCount; m++) {
            const bodyLine = lines[i + 1 + m].trim();
            const lineNum = i + 2 + m;
            
            if (bodyLine.startsWith('print(')) {
              const innerPrintMatch = bodyLine.match(/^print\((.*)\)$/);
              if (innerPrintMatch) {
                const inner = innerPrintMatch[1].trim();
                const outVal = evaluatePrint(inner, memory);
                prints.push(outVal);
                steps.push({
                  id: stepId++,
                  type: 'PRINT',
                  description: `Printed from loop`,
                  lineNumber: lineNum,
                  output: outVal,
                  memorySnapshot: { ...memory }
                });
              }
            } else {
              const bodyAssignMatch = bodyLine.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
              if (bodyAssignMatch) {
                const varName = bodyAssignMatch[1];
                const rawValue = bodyAssignMatch[2];
                const { valString, type } = evaluateExpression(replaceVariables(rawValue, memory), memory);
                
                const isUpdate = !!memory[varName];
                memory[varName] = {
                  address: isUpdate ? memory[varName].address : `0x0${stepId}`,
                  name: varName,
                  value: valString,
                  type
                };
                
                steps.push({
                  id: stepId++,
                  type: isUpdate ? 'UPDATE' : 'ALLOCATE',
                  description: isUpdate 
                    ? `Updated variable ${varName} to ${valString}`
                    : `Assigned value ${valString} to variable ${varName}`,
                  lineNumber: lineNum,
                  variable: memory[varName],
                  memorySnapshot: { ...memory }
                });
              }
            }
          }
        }
        
        i += bodyCount;
        continue;
      }

      steps.push({
        id: stepId++,
        type: 'EVALUATE',
        description: `Executing statement: ${line}`,
        lineNumber: i + 1,
        memorySnapshot: { ...memory }
      });
    }

    let isValid = true;
    
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
