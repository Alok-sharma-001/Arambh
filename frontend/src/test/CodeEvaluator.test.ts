import { describe, it, expect } from 'vitest';
import { CodeEvaluator } from '../engine/CodeEvaluator';

describe('CodeEvaluator Execution Step Generator', () => {
  it('should parse simple variable allocation', () => {
    const code = 'x = 10\ny = 20';
    const result = CodeEvaluator.evaluate(code);

    expect(result.isValid).toBe(true);
    expect(result.steps.length).toBeGreaterThanOrEqual(2);
    expect(result.parsedVars['x']).toBe('10');
    expect(result.parsedVars['y']).toBe('20');
  });

  it('should evaluate print statements and capture output', () => {
    const code = 'name = "Arambh"\nprint(name)';
    const result = CodeEvaluator.evaluate(code);

    expect(result.isValid).toBe(true);
    const printStep = result.steps.find((s) => s.type === 'PRINT');
    expect(printStep).toBeDefined();
    expect(printStep?.output).toBe('Arambh');
  });

  it('should evaluate for loops cleanly without OOM', () => {
    const code = 'total = 0\nfor i in range(3):\n    total = total + 1';
    const result = CodeEvaluator.evaluate(code);

    expect(result.isValid).toBe(true);
    expect(result.steps.length).toBeGreaterThan(3);
  });
});
