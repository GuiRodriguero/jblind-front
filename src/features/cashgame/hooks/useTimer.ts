import { useState, useEffect } from 'react';

export function useTimer(isPlaying: boolean) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying) {
      interval = setInterval(() => setElapsedSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return { elapsedSeconds, setElapsedSeconds };
}