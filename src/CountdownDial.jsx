import React, { useEffect, useState } from 'react';

const CountdownDial = ({ seconds, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setTimeLeft(seconds);
    setIsComplete(false);
  }, [seconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsComplete(true);
      setTimeout(() => {
        onComplete && onComplete();
      }, 500); // Brief burst at zero
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, onComplete]);

  const progress = ((seconds - timeLeft) / seconds) * 100;
  const circumference = 2 * Math.PI * 90; // radius of 90
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <div className="countdown-dial-container">
      <div className={`countdown-dial ${isComplete ? 'burst' : 'pulse'}`}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Background circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#333"
            strokeWidth="8"
            opacity="0.3"
          />
          {/* Progress circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="#ff0000"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 100 100)"
            className="countdown-progress"
          />
        </svg>
        <div className="countdown-number">
          {isComplete ? '🎉' : timeLeft}
        </div>
      </div>
    </div>
  );
};

export default CountdownDial;