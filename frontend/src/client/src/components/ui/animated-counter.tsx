import { useEffect, useState } from "react";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2000, 
  prefix = "", 
  suffix = "", 
  decimals = 0,
  className = ""
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      
      setDisplayValue(value * easedProgress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value, duration]);

  const formatValue = (val: number) => {
    return val.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <span className={className}>
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
}