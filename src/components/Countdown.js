import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { startCountdown, decrementTime } from './countdownSlice';
import Countdown from 'react-countdown';

const CountdownComponent = () => {
  const dispatch = useDispatch();
  const timeLeft = useSelector((state) => state.countdown.timeLeft);
  const running = useSelector((state) => state.countdown.running);

  useEffect(() => {
    if (!running) {
      dispatch(startCountdown());
    }
  }, [running, dispatch]);

  const handleTick = () => {
    dispatch(decrementTime(1000)); // Kurangi waktu 1 detik
  };

  return (
    <Countdown
      date={Date.now() + timeLeft}
      onTick={handleTick}
      renderer={({ hours, minutes, seconds }) => (
        <span>
          {String(hours).padStart(2, '0')}:
          {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </span>
      )}
    />
  );
};

export default CountdownComponent;
