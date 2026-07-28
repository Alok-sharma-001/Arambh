import { CodeEvaluator } from './CodeEvaluator';

self.onmessage = (e: MessageEvent) => {
  const { code, expectedVars } = e.data;
  try {
    const result = CodeEvaluator.evaluate(code, expectedVars);
    self.postMessage({ status: 'success', result });
  } catch (error: any) {
    self.postMessage({ status: 'error', error: error.message || 'Evaluation error' });
  }
};
