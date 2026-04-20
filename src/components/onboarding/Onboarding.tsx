import { useRef, useEffect, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Heart } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
  onHeartClick?: () => void;
}

const Onboarding = ({ onComplete, onHeartClick }: OnboardingProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const heartRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);
  const [heartClicked, setHeartClicked] = useState(false);
  const [introComplete, setIntroComplete] = useState(false);
  const bounceAnim = useRef<gsap.core.Tween | null>(null);

  // Intro animation (text + heart entrance)
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const tl = gsap.timeline({
        onComplete: () => setIntroComplete(true),
      });

      // Background shimmer
      tl.fromTo(
        ".ob-bg",
        { opacity: 0 },
        { opacity: 1, duration: 1.2, ease: "power2.out" },
      );

      // Sparkles scatter in
      tl.fromTo(
        ".ob-sparkle",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "back.out(2.5)",
        },
        "-=0.6",
      );

      // Title entrance
      tl.fromTo(
        ".ob-title",
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
        "-=0.4",
      );

      // Message words
      tl.fromTo(
        ".ob-word",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power2.out" },
        "-=0.5",
      );

      // Subtitle
      tl.fromTo(
        ".ob-subtitle",
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "+=0.2",
      );

      // Heart entrance
      tl.fromTo(
        heartRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "elastic.out(1, 0.4)" },
        "-=0.4",
      );

      // Hint text
      tl.fromTo(
        hintRef.current,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "-=0.2",
      );
    },
    { scope: containerRef },
  );

  // Bouncing idle animation once intro is done
  useEffect(() => {
    if (!introComplete || heartClicked || !heartRef.current) return;

    bounceAnim.current = gsap.to(heartRef.current, {
      y: -14,
      duration: 0.55,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Hint pulse
    gsap.to(hintRef.current, {
      opacity: 0.4,
      duration: 0.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      bounceAnim.current?.kill();
    };
  }, [introComplete, heartClicked]);

  const handleHeartClick = useCallback(() => {
    if (heartClicked || !introComplete) return;
    setHeartClicked(true);

    onHeartClick?.();

    // Kill bounce
    bounceAnim.current?.kill();
    gsap.killTweensOf(hintRef.current);

    const tl = gsap.timeline({
      onComplete: () => {
        setShow(false);
        onComplete();
      },
    });

    // Heart explode + pulse
    tl.to(heartRef.current, {
      scale: 1.6,
      duration: 0.18,
      ease: "power3.out",
    });
    tl.to(heartRef.current, {
      scale: 1.2,
      duration: 0.12,
      ease: "power2.in",
    });

    // Hint fade
    tl.to(hintRef.current, { opacity: 0, duration: 0.2 }, "<");

    // Ripple rings
    tl.fromTo(
      ".ob-ring",
      { scale: 0.5, opacity: 0.8 },
      {
        scale: 3,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.2",
    );

    // Content fade out
    tl.to(
      [".ob-title", ".ob-word", ".ob-subtitle", ".ob-sparkle"],
      { opacity: 0, y: -20, duration: 0.4, stagger: 0.03, ease: "power2.in" },
      "-=0.5",
    );

    // Heart shrink to center
    tl.to(
      heartRef.current,
      { scale: 0, opacity: 0, duration: 0.3, ease: "power3.in" },
      "-=0.2",
    );

    // CURTAIN REVEAL — both panels slide outward
    tl.fromTo(
      curtainLeftRef.current,
      { x: "0%" },
      { x: "-100%", duration: 1.1, ease: "expo.inOut" },
      "-=0.1",
    );
    tl.fromTo(
      curtainRightRef.current,
      { x: "0%" },
      { x: "100%", duration: 1.1, ease: "expo.inOut" },
      "<",
    );

    // Final container fade
    tl.to(
      containerRef.current,
      { opacity: 0, duration: 0.4, ease: "power2.in" },
      "-=0.15",
    );
  }, [heartClicked, introComplete, onComplete]);

  if (!show) return null;

  const message =
    "Mi Princesa hermosa, Gracias por todo este tiempo, de verdad que quiero estar toda mi vida contigo".split(
      " ",
    );

  // Sparkle positions (fixed so no random flicker on re-render)
  const sparkles = [
    { left: "12%", top: "18%" },
    { left: "25%", top: "8%" },
    { left: "42%", top: "5%" },
    { left: "60%", top: "9%" },
    { left: "78%", top: "15%" },
    { left: "88%", top: "28%" },
    { left: "82%", top: "72%" },
    { left: "68%", top: "85%" },
    { left: "50%", top: "90%" },
    { left: "32%", top: "88%" },
    { left: "18%", top: "78%" },
    { left: "8%", top: "60%" },
  ];

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "hsl(var(--background))" }}
    >
      {/* Background gradient */}
      <div
        className="ob-bg absolute inset-0 opacity-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, hsl(var(--secondary) / 0.55) 0%, transparent 70%), " +
            "radial-gradient(ellipse 50% 40% at 80% 80%, hsl(var(--primary) / 0.12) 0%, transparent 60%)",
        }}
      />

      {/* Curtain panels */}
      <div
        ref={curtainLeftRef}
        className="absolute inset-y-0 left-0 w-1/2 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.97) 0%, hsl(var(--secondary)) 100%)",
          transform: "translateX(-100%)",
        }}
      />
      <div
        ref={curtainRightRef}
        className="absolute inset-y-0 right-0 w-1/2 z-20 pointer-events-none"
        style={{
          background:
            "linear-gradient(225deg, hsl(var(--primary) / 0.97) 0%, hsl(var(--secondary)) 100%)",
          transform: "translateX(100%)",
        }}
      />

      {/* Sparkles */}
      {sparkles.map((pos, i) => (
        <div
          key={i}
          className="ob-sparkle absolute w-1.5 h-1.5 rounded-full opacity-0"
          style={{
            left: pos.left,
            top: pos.top,
            background: "hsl(var(--primary))",
            boxShadow: "0 0 8px 3px hsl(var(--primary) / 0.5)",
          }}
        />
      ))}

      {/* Ripple rings (hidden until click) */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="ob-ring absolute rounded-full border-2 pointer-events-none opacity-0"
          style={{
            width: 80,
            height: 80,
            borderColor: "hsl(var(--primary) / 0.6)",
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-5 px-6 text-center max-w-lg">
        {/* Title */}
        <h1
          className="ob-title text-3xl sm:text-4xl font-heading font-semibold text-foreground opacity-0"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          Mi amor 💕
        </h1>

        {/* Message */}
        <p className="text-base sm:text-lg text-foreground/85 font-body leading-relaxed">
          {message.map((word, i) => (
            <span key={i} className="ob-word inline-block mr-[5px] opacity-0">
              {word}
            </span>
          ))}
        </p>

        {/* Subtitle */}
        <p
          className="ob-subtitle text-sm text-muted-foreground italic opacity-0 font-heading"
          style={{ fontFamily: "var(--font-heading, serif)" }}
        >
          — Te amo con todo mi corazón, mi niña linda —
        </p>

        {/* Clickable Heart */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <div
            ref={heartRef}
            onClick={handleHeartClick}
            className="opacity-0 cursor-pointer select-none"
            style={{
              filter: "drop-shadow(0 0 18px hsl(var(--primary) / 0.7))",
            }}
            aria-label="Toca el corazón para continuar"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && handleHeartClick()}
          >
            <Heart
              className="w-20 h-20 sm:w-24 sm:h-24"
              style={{
                fill: "hsl(var(--primary))",
                color: "hsl(var(--primary))",
              }}
            />
          </div>

          {/* Hint */}
          <p
            ref={hintRef}
            className="text-xs text-muted-foreground tracking-widest uppercase opacity-0"
          >
            ✨ tócame ✨
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
