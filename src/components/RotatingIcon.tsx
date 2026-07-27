"use client";

import { useEffect, useRef } from "react";

type RotatingIconProps = {
  content: {
    image: string;
    imageAlt: string;
    ariaLabel: string;
    baseSpeed: number;
    boostSpeed: number;
    maximumSpeed: number;
    settleDuration: number;
  };
};

export function RotatingIcon({ content }: RotatingIconProps) {
  const iconRef = useRef<HTMLImageElement>(null);
  const motion = useRef({ angle: 0, speed: content.baseSpeed, previousTime: 0 });

  useEffect(() => {
    let animationFrame = 0;

    const animate = (time: number) => {
      const state = motion.current;
      const elapsed = state.previousTime ? Math.min((time - state.previousTime) / 1000, 0.1) : 0;
      state.previousTime = time;
      const easing = Math.exp(-elapsed / content.settleDuration);
      state.speed = content.baseSpeed + (state.speed - content.baseSpeed) * easing;
      state.angle = (state.angle + state.speed * elapsed) % 360;
      if (iconRef.current) iconRef.current.style.transform = `rotate(${state.angle}deg)`;
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [content.baseSpeed, content.settleDuration]);

  const boostRotation = () => {
    motion.current.speed = Math.min(motion.current.speed + content.boostSpeed, content.maximumSpeed);
  };

  return <button className="rotate-control" type="button" onClick={boostRotation} aria-label={content.ariaLabel}><img ref={iconRef} src={content.image} alt={content.imageAlt} /></button>;
}
