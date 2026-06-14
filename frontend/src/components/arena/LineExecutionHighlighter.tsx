import React, { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';

interface LineExecutionHighlighterProps {
  editor: monaco.editor.IStandaloneCodeEditor | null;
  lineNumber: number | null;
}

export const LineExecutionHighlighter: React.FC<LineExecutionHighlighterProps> = ({ editor, lineNumber }) => {
  const decorationsRef = useRef<string[]>([]);

  useEffect(() => {
    if (!editor) return;

    if (!lineNumber || lineNumber === 0) {
      decorationsRef.current = editor.deltaDecorations(decorationsRef.current, []);
      return;
    }

    const newDecorations: monaco.editor.IModelDeltaDecoration[] = [
      {
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: 'active-execution-line',
          glyphMarginClassName: 'active-execution-glyph',
        }
      }
    ];

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [editor, lineNumber]);

  return null; // This is a logic-only component
};
