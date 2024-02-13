import React from 'react';

export default function useCoolDown(timerSeconds: number, start = false) {
  const [coolDownSeconds, setCoolDownSeconds] = React.useState(
    start ? timerSeconds : 0
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (coolDownSeconds > 0) {
        setCoolDownSeconds(coolDownSeconds - 1);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [coolDownSeconds]);

  const resetCoolDown = () => {
    setCoolDownSeconds(timerSeconds);
  };

  return { seconds: coolDownSeconds, setCoolDownSeconds, reset: resetCoolDown };
}
