'use client';

import { useRef, ReactNode } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Direction = 'left' | 'right' | 'bottom' | 'top';

interface SlideInProps {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
}

export function SlideIn({
  children,
  className = '',
  direction = 'bottom',
  delay = 0,
  duration = 0.7,
  distance = 80,
  once = true,
}: SlideInProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const getTransform = (dir: Direction, dist: number) => {
    switch (dir) {
      case 'left':
        return { x: -dist, y: 0 };
      case 'right':
        return { x: dist, y: 0 };
      case 'top':
        return { x: 0, y: -dist };
      case 'bottom':
      default:
        return { x: 0, y: dist };
    }
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    const { x, y } = getTransform(direction, distance);

    gsap.from(containerRef.current, {
      x,
      y,
      opacity: 0,
      duration,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 85%',
        toggleActions: once ? 'play none none none' : 'play none none reverse',
      },
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
