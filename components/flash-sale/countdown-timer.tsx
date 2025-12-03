"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  endTime: string;
  className?: string;
}

export function CountdownTimer({ endTime, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        setTimeLeft(null);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (!timeLeft) {
    return null;
  }

  // Show only relevant time units (skip days if 0, always show hours, minutes, seconds)
  const parts: { value: number; label: string }[] = [];
  
  if (timeLeft.days > 0) {
    parts.push({ value: timeLeft.days, label: "d" });
  }
  if (timeLeft.hours > 0 || parts.length > 0) {
    parts.push({ value: timeLeft.hours, label: "h" });
  }
  if (timeLeft.minutes > 0 || parts.length > 0) {
    parts.push({ value: timeLeft.minutes, label: "m" });
  }
  parts.push({ value: timeLeft.seconds, label: "s" });

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm text-muted-foreground">Ends in:</span>
      <div className="flex items-center gap-1 font-mono text-sm tabular-nums">
        {parts.map((part, index) => (
          <span key={part.label}>
            <span className="font-semibold">{String(part.value).padStart(2, "0")}</span>
            <span className="text-muted-foreground">{part.label}</span>
            {index < parts.length - 1 && (
              <span className="mx-1 text-muted-foreground">:</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

