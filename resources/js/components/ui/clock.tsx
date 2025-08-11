import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils'; // Your ShadCN utils

interface AnalogClockProps {
  className?: string;
  size?: number;
  showNumbers?: boolean;
  showSecondHand?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({
  className,
  size = 200,
  showNumbers = true,
  showSecondHand = true,
}) => {
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Calculate rotations
  const hourRotation = hours * 30 + minutes * 0.5;
  const minuteRotation = minutes * 6;
  const secondRotation = seconds * 6;

  // Clock numbers positions
  const clockNumbers = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        'relative rounded-full border-2 border-primary bg-background shadow-lg flex items-center justify-center',
        className
      )}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* Clock face */}
      <div className="relative w-full h-full ">
        {/* Clock center */}
        <div className="absolute left-1/2 top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20" />

        {/* Hour hand */}
        <div
          className="absolute left-1/2 top-1/2 z-2 h-[30%] w-1.5 -translate-x-1/2 -translate-y-full origin-bottom bg-primary"
          style={{ transform: `rotate(${hourRotation}deg)` }}
        />

        {/* Minute hand */}
        <div
          className="absolute left-1/2 top-1/2 z-3 h-[40%] w-1 -translate-x-1/2 -translate-y-full origin-bottom bg-primary"
          style={{ transform: `rotate(${minuteRotation}deg)` }}
        />

        {/* Second hand (optional) */}
        {showSecondHand && (
          <div
            className="absolute left-1/2 top-1/2 z-2 h-[45%] w-0.5 -translate-x-1/2 -translate-y-full origin-bottom bg-green-600"
            style={{ transform: `rotate(${secondRotation}deg)` }}
          />
        )}

        {/* Clock numbers */}
        {showNumbers &&
          clockNumbers.map((number) => {
            const angle = (number - 3) * 30 * (Math.PI / 180); // Convert to radians
            const radius = size /2; // Position numbers closer to center
            const x = 50 + Math.sin(angle) * radius * 0.4; // 0.9 multiplier brings numbers inward
            const y = 50 - Math.cos(angle) * radius * 0.4; // 0.9 multiplier brings numbers inward

            return (
              <div
                key={number}
                className="absolute text-sm font-medium text-foreground flex items-center justify-center"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  width: `${size * 0.1}px`,
                  height: `${size * 0.1}px`,
                }}
              >
                {number}
              </div>
            );
          })}

        {/* Minute markers */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = i * 6;
          const isHourMarker = i % 5 === 0;
          const markerLength = isHourMarker ? size * 0.05 : size * 0.02;
          const markerWidth = isHourMarker ? 2 : 1;
          const markerRadius = isHourMarker ? size * 0.42 : size * 0.44;

          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 origin-center bg-foreground"
              style={{
                height: `${markerLength}px`,
                width: `${markerWidth}px`,
                transform: `
                  translate(-50%, -50%)
                  translateY(-${markerRadius}px)
                  rotate(${angle}deg)
                `,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};