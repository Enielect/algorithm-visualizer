import { useEffect, useMemo, useRef, useState } from "react";

// This hook is deliberately algorithm-agnostic. Give it a generator
// function, and it drains it into a flat array up front, then exposes
// a cursor plus playback controls over that array.
//
// Draining eagerly (instead of pulling one `next()` per animation frame)
// is what makes scrubbing/rewind free: moving the cursor backward is just
// reading an earlier index, not "undoing" anything.
//
// speed: steps advanced per second while playing.
export function useStepHistory(generatorFn, speed = 2) {
  const steps = useMemo(() => {
    const drained = [];
    for (const step of generatorFn()) drained.push(step);
    return drained;
  }, [generatorFn]);

  const [cursor, setCursor] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const atStart = cursor <= 0;
  const atEnd = cursor >= steps.length - 1;

  useEffect(() => {
    if (!isPlaying) return undefined;

    intervalRef.current = setInterval(() => {
      setCursor((c) => {
        if (c >= steps.length - 1) {
          setIsPlaying(false);
          return c;
        }
        return c + 1;
      });
    }, 1000 / speed);

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, speed, steps.length]);

  function play() {
    if (atEnd) setCursor(0);
    setIsPlaying(true);
  }
  function pause() {
    setIsPlaying(false);
  }
  function stepForward() {
    setIsPlaying(false);
    setCursor((c) => Math.min(c + 1, steps.length - 1));
  }
  function stepBackward() {
    setIsPlaying(false);
    setCursor((c) => Math.max(c - 1, 0));
  }
  function reset() {
    setIsPlaying(false);
    setCursor(0);
  }
  function seek(index) {
    setIsPlaying(false);
    setCursor(Math.max(0, Math.min(index, steps.length - 1)));
  }

  return {
    steps,
    cursor,
    currentStep: steps[cursor] ?? null,
    isPlaying,
    atStart,
    atEnd,
    play,
    pause,
    stepForward,
    stepBackward,
    reset,
    seek,
  };
}
