import { useState, useEffect } from "react";

interface TimerProps {
  time: number;
}

const QuestionTimer: React.FC<TimerProps> = ({ time }) => {
  const [timer, setTimer] = useState(time);
  const [display, setDisplay] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
});

 const [displayTime, setDisplayTime] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
        setTimer((timer) => {
            return timer + 1;
        });

        const days = Math.floor(timer / (3600 * 24));
        const hours = Math.floor((timer % (3600 * 24)) / 3600);
        const minutes = Math.floor((timer % 3600) / 60);
        const seconds = Math.floor(timer % 60);

        setDisplay({
            days: days < 10 ? `0${days}` : `${days}`,
            hours: hours < 10 ? `0${hours}` : `${hours}`,
            minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
            seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
        });

        if (hours === 0) {
            setDisplayTime(`${display.minutes}:${display.seconds}`);
        } else if (hours > 0) {
            setDisplayTime(`${display.hours}:${display.minutes}:${display.seconds}`);
        } else if (days > 0) {
            setDisplayTime(`${display.days}:${display.hours}:${display.minutes}:${display.seconds}`);
        }

    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="flex flex-col items-center">
        <p className="text-xl font-bold text-gray-300">{displayTime}</p>
    </div>
  );
};

export default QuestionTimer;