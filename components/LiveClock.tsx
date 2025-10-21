// LiveClock.tsx
"use client";
import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-lg">
      <Clock className="h-4 w-4 text-gray-500 dark:text-gray-300" />
      <time className="text-sm font-medium text-gray-700 dark:text-gray-200">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </time>
    </div>
  );
};

export default LiveClock;
