import { CodeEvaluator } from './engine/CodeEvaluator';

function runTests() {
  console.log("=== Running CodeEvaluator Verification Tests ===");

  // 1. Facade Loop Printing
  {
    console.log("\n--- Test 1: Facade Loop Printing ---");
    const code = `
for i in range(3):
  print(i)
`;
    const res = CodeEvaluator.evaluate(code);
    const printSteps = res.steps.filter(s => s.type === 'PRINT');
    console.log(`Expected 3 print steps. Got: ${printSteps.length}`);
    printSteps.forEach((s, idx) => {
      console.log(`Step ${idx + 1} output: "${s.output}"`);
    });
    if (printSteps[0]?.output === "0" && printSteps[1]?.output === "1" && printSteps[2]?.output === "2") {
      console.log("SUCCESS: Print output correctly maps to loop variable.");
    } else {
      console.error("FAIL: Print output in loops does not map correctly.");
    }
  }

  // 2. Nested Collections
  {
    console.log("\n--- Test 2: Nested Collections ---");
    const code = `
a = [(1, 2), (3, 4)]
`;
    const res = CodeEvaluator.evaluate(code);
    const variable = res.steps[res.steps.length - 1].memorySnapshot['a'];
    console.log(`a value: "${variable?.value}", type: "${variable?.type}"`);
    if (variable?.value === "[(1, 2), (3, 4)]" && variable?.type === "list") {
      console.log("SUCCESS: Nested collections correctly evaluated.");
    } else {
      console.error("FAIL: Nested collections incorrect.");
    }
  }

  // 3. Empty Dictionaries
  {
    console.log("\n--- Test 3: Empty Dictionaries ---");
    const code = `
d = {}
`;
    const res = CodeEvaluator.evaluate(code);
    const variable = res.steps[res.steps.length - 1].memorySnapshot['d'];
    console.log(`d value: "${variable?.value}", type: "${variable?.type}"`);
    if (variable?.value === "{}" && variable?.type === "dict") {
      console.log("SUCCESS: Empty dictionary parsed as dict, not set.");
    } else {
      console.error("FAIL: Empty dictionary incorrect.");
    }
  }

  // 4. Fallback Variable Resolution
  {
    console.log("\n--- Test 4: Fallback Variable Resolution ---");
    const code = `
x = 5
y = x + 1
`;
    const res = CodeEvaluator.evaluate(code);
    const variable = res.steps[res.steps.length - 1].memorySnapshot['y'];
    console.log(`y value: "${variable?.value}", type: "${variable?.type}"`);
    if (variable?.value === "6" && variable?.type === "int") {
      console.log("SUCCESS: Variable resolved during evaluation.");
    } else {
      console.error("FAIL: Variable resolution failed.");
    }
  }

  // 5. Function Body Execution (Deferred)
  {
    console.log("\n--- Test 5: Function Body Execution ---");
    const code = `
def add(a, b):
  c = a + b
  return c

x = add(2, 3)
`;
    const res = CodeEvaluator.evaluate(code);
    console.log("Steps sequence:");
    res.steps.forEach(s => {
      console.log(`- Step ID ${s.id}, Type: ${s.type}, Line: ${s.lineNumber}, Desc: "${s.description}"`);
    });
    
    const types = res.steps.map(s => s.type);
    const expected = ['FUNCTION_DEF', 'FUNCTION_CALL', 'ALLOCATE', 'FUNCTION_RETURN', 'ALLOCATE'];
    const matches = types.every((t, i) => t === expected[i]);
    if (matches && types.length === expected.length) {
      console.log("SUCCESS: Function body execution deferred and executed correctly on call.");
    } else {
      console.error("FAIL: Function step sequence incorrect.");
    }
  }

  // 6. Built-ins Safety & Evaluation
  {
    console.log("\n--- Test 6: Built-ins Safety & Evaluation ---");
    const code = `
x = 5.5
y = int(x)
t = type(x)
l = len([1, 2, 3])
`;
    const res = CodeEvaluator.evaluate(code);
    const yVal = res.steps[1]?.memorySnapshot['y'];
    const tVal = res.steps[2]?.memorySnapshot['t'];
    const lVal = res.steps[3]?.memorySnapshot['l'];
    console.log(`y: value="${yVal?.value}", type="${yVal?.type}"`);
    console.log(`t: value="${tVal?.value}", type="${tVal?.type}"`);
    console.log(`l: value="${lVal?.value}", type="${lVal?.type}"`);
    if (yVal?.value === "5" && tVal?.value === `"<class 'float'>"` && lVal?.value === "3") {
      console.log("SUCCESS: Safe built-ins allowed and evaluated correctly.");
    } else {
      console.error("FAIL: Safe built-ins failed.");
    }
  }

  // 7. Large Iteration Ranges
  {
    console.log("\n--- Test 7: Large Iteration Ranges ---");
    const code = `
for i in range(100000):
  print(i)
`;
    const start = Date.now();
    const res = CodeEvaluator.evaluate(code);
    const duration = Date.now() - start;
    console.log(`Evaluation took ${duration}ms.`);
    const loopIterations = res.steps.filter(s => s.type === 'LOOP_ITERATION').length;
    console.log(`Number of loop iterations: ${loopIterations}`);
    if (loopIterations === 20 && duration < 100) {
      console.log("SUCCESS: Large iteration range successfully capped to 20.");
    } else {
      console.error("FAIL: Large iteration range not capped or too slow.");
    }
  }
}

runTests();
