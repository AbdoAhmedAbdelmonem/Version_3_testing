// [PERF] Optimized: removed framer-motion — replaced with IntersectionObserver + CSS
"use client"

import { useRef, useEffect, useState } from 'react';

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: 'word' | 'character';
  direction?: 'top' | 'bottom';
}

export function BlurText({
  text,
  delay = 200,
  className = '',
  animateBy = 'word',
  direction = 'top',
}: BlurTextProps) {
  const elements = animateBy === 'word' ? text.split(' ') : text.split('');
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(el);
        }
      },
      { rootMargin: '-50px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {elements.map((element, index) => (
        <span
          key={index}
          className="inline-block mr-[0.25em] transition-all duration-300 ease-out"
          style={{
            opacity: isInView ? 1 : 0,
            filter: isInView ? 'blur(0px)' : 'blur(10px)',
            transform: isInView ? 'translateY(0)' : `translateY(${direction === 'top' ? '-20px' : '20px'})`,
            transitionDelay: `${delay + index * 40}ms`,
          }}
        >
          {element}{animateBy === 'character' ? '' : ' '}
        </span>
      ))}
    </div>
  );
}