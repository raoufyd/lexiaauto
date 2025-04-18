"use client";

import { useState, useEffect, useRef, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode[];
  autoSlideInterval?: number;
  showArrows?: boolean;
  showIndicators?: boolean;
  className?: string;
  slideClassName?: string;
  indicatorClassName?: string;
  arrowClassName?: string;
}

export default function Carousel({
  children,
  autoSlideInterval = 500,
  showArrows = true,
  showIndicators = true,
  className = "",
  slideClassName = "",
  indicatorClassName = "",
  arrowClassName = "",
}: CarouselProps) {
  const [curr, setCurr] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const prev = () => {
    setCurr((curr) => (curr === 0 ? children.length - 1 : curr - 1));
  };

  const next = () => {
    setCurr((curr) => (curr === children.length - 1 ? 0 : curr + 1));
  };

  const goToSlide = (index: number) => {
    setCurr(index);
  };

  useEffect(() => {
    if (autoSlideInterval <= 0 || isHovering) return;

    const startTimer = () => {
      timerRef.current = setTimeout(() => {
        next();
      }, autoSlideInterval);
    };

    startTimer();

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [curr, autoSlideInterval, isHovering]);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {children.map((child, index) => (
          <div key={index} className={cn("min-w-full", slideClassName)}>
            {child}
          </div>
        ))}
      </div>

      {showArrows && (
        <>
          <div
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors",
              arrowClassName
            )}
            onClick={prev}
          >
            <ChevronLeft size={20} />
          </div>
          <div
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-2 bg-black/30 text-white cursor-pointer hover:bg-black/50 transition-colors",
              arrowClassName
            )}
            onClick={next}
          >
            <ChevronRight size={20} />
          </div>
        </>
      )}

      {showIndicators && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {children.map((_, index) => (
            <div
              key={index}
              className={cn(
                "w-2.5 h-2.5 rounded-full cursor-pointer transition-colors",
                curr === index ? "bg-white" : "bg-white/50",
                indicatorClassName
              )}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
