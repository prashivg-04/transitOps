import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

export function useAnimatedCounter(targetValue, duration = 2, delay = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    // Use pure JS animate callback to update state sequentially
    const controls = animate(0, targetValue, {
      duration,
      delay,
      ease: 'easeOut',
      onUpdate: (latest) => {
        if (active) {
          setCount(Math.round(latest));
        }
      }
    });

    return () => {
      active = false;
      controls.stop();
    };
  }, [targetValue, duration, delay]);

  return count;
}
