import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";

const reminders = [
  "Drive safely, arrive home 💖",
  "Stay alert, not hurt 🚗",
  "Keep your eyes on the road 👀",
  "Don’t text and drive 📵",
  "Safety first, always! 🛡️",
];

export const DriveReminder: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Rotate reminders every 10 seconds
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % reminders.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <p className="text-sm text-foreground flex items-center gap-1 transition-all duration-500 ease-in-out">
      <Heart className="w-4 h-4 text-pink-400" />
      {reminders[index]}
    </p>
  );
};
