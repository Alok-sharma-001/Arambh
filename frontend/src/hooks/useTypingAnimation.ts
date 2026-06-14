import { useState, useEffect, useCallback, useRef } from 'react';

interface UseTypingAnimationOptions {
  text: string;
  speed?: number;
  onComplete?: () => void;
  startDelay?: number;
}

export function useTypingAnimation({ text, speed = 40, onComplete, startDelay = 0 }: UseTypingAnimationOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const indexRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const start = useCallback(() => {
    indexRef.current = 0;
    setDisplayedText('');
    setIsComplete(false);

    const typeNext = () => {
      if (indexRef.current < text.length) {
        indexRef.current++;
        setDisplayedText(text.slice(0, indexRef.current));
        timerRef.current = setTimeout(typeNext, speed);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    timerRef.current = setTimeout(typeNext, startDelay);
  }, [text, speed, onComplete, startDelay]);

  useEffect(() => {
    start();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [start]);

  return { displayedText, isComplete, restart: start };
}
