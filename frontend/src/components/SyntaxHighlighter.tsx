interface Token {
  type: string;
  value: string;
}

const KEYWORDS = ['def', 'class', 'if', 'elif', 'else', 'for', 'while', 'return', 'yield', 'lambda', 'async', 'await', 'try', 'except', 'finally', 'with', 'as', 'from', 'raise', 'break', 'continue', 'pass', 'global', 'nonlocal', 'assert', 'del', 'import', 'in', 'is', 'not', 'and', 'or', 'True', 'False', 'None'];
const BUILTINS = ['print', 'range', 'len', 'type', 'int', 'str', 'float', 'bool', 'list', 'dict', 'set', 'tuple', 'input', 'open', 'sum', 'max', 'min', 'sorted', 'enumerate', 'zip', 'map', 'filter', 'abs', 'round', 'pow'];

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let remaining = code;

  while (remaining.length > 0) {
    // Comments
    if (remaining.startsWith('#')) {
      const end = remaining.indexOf('\n');
      const comment = end === -1 ? remaining : remaining.slice(0, end);
      tokens.push({ type: 'comment', value: comment });
      remaining = end === -1 ? '' : remaining.slice(end);
      continue;
    }

    // Strings (single and double quotes, f-strings)
    const stringMatch = remaining.match(/^(f?["'])(?:[^"\\]|\\.)*?\1/);
    if (stringMatch) {
      tokens.push({ type: 'string', value: stringMatch[0] });
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Numbers
    const numberMatch = remaining.match(/^\d+\.?\d*/);
    if (numberMatch) {
      tokens.push({ type: 'number', value: numberMatch[0] });
      remaining = remaining.slice(numberMatch[0].length);
      continue;
    }

    // Words (keywords, builtins, variables)
    const wordMatch = remaining.match(/^[a-zA-Z_]\w*/);
    if (wordMatch) {
      const word = wordMatch[0];
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: 'keyword', value: word });
      } else if (BUILTINS.includes(word)) {
        tokens.push({ type: 'builtin', value: word });
      } else {
        tokens.push({ type: 'variable', value: word });
      }
      remaining = remaining.slice(word.length);
      continue;
    }

    // Operators and punctuation
    const opMatch = remaining.match(/^(==|!=|<=|>=|\+\+|--|\*\*|\/\/|->|:=|[+\-*/%=<>!&|^~:])/);
    if (opMatch) {
      tokens.push({ type: 'operator', value: opMatch[0] });
      remaining = remaining.slice(opMatch[0].length);
      continue;
    }

    // Whitespace and other
    tokens.push({ type: 'text', value: remaining[0] });
    remaining = remaining.slice(1);
  }

  return tokens;
}

const TOKEN_CLASSES: Record<string, string> = {
  keyword: 'token-keyword',
  builtin: 'token-builtin',
  string: 'token-string',
  number: 'token-number',
  variable: 'token-variable',
  operator: 'token-operator',
  comment: 'token-comment',
  text: '',
};

interface SyntaxHighlighterProps {
  code: string;
  className?: string;
}

export default function SyntaxHighlighter({ code, className = '' }: SyntaxHighlighterProps) {
  const tokens = tokenize(code);

  return (
    <code className={`font-mono text-sm leading-[1.8] whitespace-pre-wrap ${className}`}>
      {tokens.map((token, i) => (
        <span key={i} className={TOKEN_CLASSES[token.type] || ''}>
          {token.value}
        </span>
      ))}
    </code>
  );
}
