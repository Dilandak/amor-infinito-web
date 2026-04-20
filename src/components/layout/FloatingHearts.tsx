import { useRef, useEffect } from "react";
import gsap from "gsap";

const FloatingHearts = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const hearts = containerRef.current.querySelectorAll(".floating-heart");

    hearts.forEach((heart, i) => {
      const delay = i * 0.4;
      const duration = 5 + Math.random() * 4;

      gsap.set(heart, {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 50,
        scale: 0.3 + Math.random() * 0.7,
        opacity: 0,
      });

      gsap.to(heart, {
        y: -100,
        x: `+=${-50 + Math.random() * 100}`,
        rotation: -20 + Math.random() * 40,
        opacity: 0.15 + Math.random() * 0.2,
        duration,
        delay,
        repeat: -1,
        ease: "none",
        onRepeat: () => {
          gsap.set(heart, {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
          });
        },
      });
    });

    return () => {
      hearts.forEach((heart) => gsap.killTweensOf(heart));
    };
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {[...Array(15)].map((_, i) => (
        <svg
          key={i}
          className="floating-heart absolute"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="hsl(var(--primary))"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ))}
    </div>
  );
};

export default FloatingHearts;
