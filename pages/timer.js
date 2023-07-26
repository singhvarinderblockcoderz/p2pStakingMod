import { useEffect, useState } from 'react';

const CountdownTimer = () => {
  const startDate = new Date('2023-07-25T12:00:00'); // Replace this with your start date
  const endDate = new Date('2023-07-31T18:00:00');   // Replace this with your end date

  // Function to calculate the time difference
  const getTimeDifference = () => {
    const now = new Date();
    const difference = endDate - now;
    const timeLeft = {};

    if (difference > 0) {
      timeLeft.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      timeLeft.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      timeLeft.minutes = Math.floor((difference / 1000 / 60) % 60);
      timeLeft.seconds = Math.floor((difference / 1000) % 60);
    } else {
      // Timer expired
      timeLeft.days = 0;
      timeLeft.hours = 0;
      timeLeft.minutes = 0;
      timeLeft.seconds = 0;
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(getTimeDifference());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeDifference());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {timeLeft.days} days, {timeLeft.hours} hours, {timeLeft.minutes} minutes, {timeLeft.seconds} seconds left
    </div>
  );
};

export default CountdownTimer;
