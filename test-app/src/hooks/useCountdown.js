// src/hooks/useCountdown.js
import { useState, useEffect, useCallback } from 'react';

const useCountdown = (initialTime = 180) => {
  const [remainingTime, setRemainingTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  const startCountdown = useCallback((time = initialTime) => {
    setRemainingTime(time);
    setIsActive(true);
  }, [initialTime]);

  const resetCountdown = useCallback(() => {
    setRemainingTime(initialTime);
    setIsActive(false);
  }, [initialTime]);

  useEffect(() => {
    let interval;
    
    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime(time => time - 1);
      }, 1000);
    } else if (remainingTime <= 0) {
      setIsActive(false);
    }

    return () => clearInterval(interval);
  }, [isActive, remainingTime]);

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return {
    remainingTime,
    formattedTime,
    isActive,
    startCountdown,
    resetCountdown,
    isExpired: remainingTime <= 0
  };
};

export default useCountdown;