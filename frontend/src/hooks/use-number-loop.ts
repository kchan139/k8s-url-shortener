import { useEffect, useState } from 'react';

const useNumberLoop = (
  start: number,
  end: number,
  step: number,
  interval: number,
) => {
  const [current, setCurrent] = useState(start);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (start < end) {
        if (current >= end) setCurrent(start);
        else setCurrent(current + step);
      } else {
        if (current <= end) setCurrent(start);
        else setCurrent(current - step);
      }
    }, interval);

    return () => clearInterval(intervalId);
  }, [current, end, interval, start, step]);

  return current;
};

export default useNumberLoop;
