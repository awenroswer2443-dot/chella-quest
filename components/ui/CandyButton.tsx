"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { play } from "@/lib/sounds";

type Variant = "pink" | "gold" | "lilac" | "cream";

interface Props extends Omit<HTMLMotionProps<"button">, "children"> {
  children: React.ReactNode;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  block?: boolean;
  sound?: "tap" | "pop" | "chime" | "success" | "unlock" | "whoosh" | null;
}

const variants: Record<Variant, string> = {
  pink:
    "bg-gradient-to-b from-blush-400 to-blush-600 text-white shadow-candy hover:from-blush-300 hover:to-blush-500",
  gold:
    "bg-gradient-to-b from-gold-200 to-gold-400 text-[#6b3a00] shadow-[0_10px_25px_-10px_rgba(245,166,35,0.6),inset_0_-3px_0_0_rgba(0,0,0,0.1),inset_0_2px_0_0_rgba(255,255,255,0.7)]",
  lilac:
    "bg-gradient-to-b from-lilac-200 to-lilac-400 text-[#3a1f5c] shadow-[0_10px_25px_-10px_rgba(167,125,255,0.6),inset_0_-3px_0_0_rgba(0,0,0,0.08),inset_0_2px_0_0_rgba(255,255,255,0.7)]",
  cream:
    "bg-gradient-to-b from-cream-50 to-cream-200 text-[#6b3a3a] shadow-[0_10px_25px_-10px_rgba(214,166,115,0.45),inset_0_-3px_0_0_rgba(0,0,0,0.08),inset_0_2px_0_0_rgba(255,255,255,0.9)]",
};

const sizes = {
  sm: "text-sm px-4 py-2 rounded-full gap-1.5",
  md: "text-base px-6 py-3 rounded-full gap-2",
  lg: "text-lg px-8 py-4 rounded-full gap-2.5 font-semibold tracking-wide",
};

const CandyButton = forwardRef<HTMLButtonElement, Props>(function CandyButton(
  {
    children,
    variant = "pink",
    size = "md",
    icon,
    iconRight,
    block,
    className = "",
    sound = "tap",
    onClick,
    ...rest
  },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className={`candy-btn inline-flex items-center justify-center font-semibold select-none ${variants[variant]} ${sizes[size]} ${block ? "w-full" : ""} ${className}`}
      onClick={(e) => {
        if (sound) play(sound);
        onClick?.(e);
      }}
      {...rest}
    >
      {icon ? <span className="relative z-[3]">{icon}</span> : null}
      <span className="relative z-[3]">{children}</span>
      {iconRight ? <span className="relative z-[3]">{iconRight}</span> : null}
    </motion.button>
  );
});

export default CandyButton;
