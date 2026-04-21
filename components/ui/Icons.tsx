"use client";

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function mk(
  viewBox: string,
  draw: (props: { fill: string; stroke?: string }) => React.ReactNode
) {
  return function Icon({
    size = 24,
    color,
    ...rest
  }: IconProps & { color?: string }) {
    const fill = color || "currentColor";
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        aria-hidden="true"
        {...rest}
      >
        {draw({ fill })}
      </svg>
    );
  };
}

export const HeartIcon = mk("0 0 32 32", ({ fill }) => (
  <path
    d="M16 28s-11-6.8-11-14.2C5 9.6 8.3 7 11.7 7c2.1 0 4 1 5.3 2.6C18.3 8 20.2 7 22.3 7 25.7 7 29 9.6 29 13.8 29 21.2 18 28 16 28Z"
    fill={fill}
  />
));

export const StarIcon = mk("0 0 32 32", ({ fill }) => (
  <path
    d="M16 3l3.7 7.9 8.6 1.2-6.2 6.1 1.5 8.7L16 22.8 8.4 26.9l1.5-8.7-6.2-6.1 8.6-1.2L16 3Z"
    fill={fill}
  />
));

export const SparkleIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <path
      d="M16 2c.8 5.8 4.4 9.4 10.2 10.2C20.4 13 16.8 16.6 16 22.4 15.2 16.6 11.6 13 5.8 12.2 11.6 11.4 15.2 7.8 16 2Z"
      fill={fill}
    />
    <path
      d="M25 22c.4 2.9 1.8 4.3 4.7 4.7-2.9.4-4.3 1.8-4.7 4.7-.4-2.9-1.8-4.3-4.7-4.7 2.9-.4 4.3-1.8 4.7-4.7Z"
      fill={fill}
      opacity={0.8}
    />
  </>
));

export const GiftIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <rect x={5} y={12} width={22} height={16} rx={3} fill={fill} />
    <rect x={14.5} y={12} width={3} height={16} fill="rgba(255,255,255,0.6)" />
    <rect x={3} y={9} width={26} height={5} rx={2} fill={fill} />
    <rect x={14.5} y={9} width={3} height={5} fill="rgba(255,255,255,0.6)" />
    <path
      d="M10 9c-2 0-4-1.2-4-3s2-3 4-3c3 0 5 3 6 6-4 0-6 0-6 0Z"
      fill={fill}
    />
    <path
      d="M22 9c2 0 4-1.2 4-3s-2-3-4-3c-3 0-5 3-6 6 4 0 6 0 6 0Z"
      fill={fill}
    />
  </>
));

export const CakeIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <rect x={5} y={14} width={22} height={12} rx={2} fill={fill} />
    <path
      d="M5 18c2 2 5 2 7 0s5-2 7 0 5 2 7 0"
      stroke="rgba(255,255,255,0.8)"
      strokeWidth={1.5}
      fill="none"
    />
    <rect x={15} y={9} width={2} height={5} fill={fill} />
    <path
      d="M16 5c.6 1 1.4 2 0 4-1.4-2-.6-3 0-4Z"
      fill="#ffbf2e"
    />
  </>
));

export const CupcakeIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <path d="M7 15h18l-3 13H10L7 15Z" fill={fill} />
    <path
      d="M6 15h20c0-4-4-7-10-7S6 11 6 15Z"
      fill="rgba(255,255,255,0.85)"
    />
    <circle cx={16} cy={6} r={2} fill="#e83a75" />
  </>
));

export const CrownIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <path
      d="M4 12l4 10h16l4-10-6 3-6-8-6 8-6-3Z"
      fill={fill}
    />
    <circle cx={4} cy={12} r={2} fill={fill} />
    <circle cx={28} cy={12} r={2} fill={fill} />
    <circle cx={16} cy={7} r={2} fill={fill} />
  </>
));

export const RibbonIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <circle cx={16} cy={16} r={4} fill={fill} />
    <path
      d="M16 16l-10-6v12l10-6Zm0 0l10-6v12l-10-6Z"
      fill={fill}
    />
  </>
));

export const BowIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <path
      d="M16 16l-8-5c-2-1-4 .5-4 3v4c0 2.5 2 4 4 3l8-5Z"
      fill={fill}
    />
    <path
      d="M16 16l8-5c2-1 4 .5 4 3v4c0 2.5-2 4-4 3l-8-5Z"
      fill={fill}
    />
    <rect x={14} y={13} width={4} height={6} rx={1} fill="rgba(255,255,255,0.7)" />
  </>
));

export const CandleIcon = mk("0 0 32 32", ({ fill }) => (
  <>
    <rect x={13} y={10} width={6} height={18} rx={1} fill={fill} />
    <rect x={13} y={10} width={6} height={3} fill="rgba(255,255,255,0.5)" />
    <path d="M16 3c1 2 2 3 0 6-2-3-1-4 0-6Z" fill="#ffbf2e" />
  </>
));

export const MuteIcon = mk("0 0 24 24", ({ fill }) => (
  <path
    d="M4 9h3l5-4v14l-5-4H4V9Zm13.3-1.3l1.4 1.4-2.3 2.3 2.3 2.3-1.4 1.4-2.3-2.3-2.3 2.3-1.4-1.4 2.3-2.3-2.3-2.3 1.4-1.4 2.3 2.3 2.3-2.3Z"
    fill={fill}
  />
));

export const SpeakerIcon = mk("0 0 24 24", ({ fill }) => (
  <>
    <path d="M4 9h3l5-4v14l-5-4H4V9Z" fill={fill} />
    <path
      d="M16 8a6 6 0 0 1 0 8M18.5 5.5a10 10 0 0 1 0 13"
      stroke={fill}
      strokeWidth={1.8}
      strokeLinecap="round"
    />
  </>
));

export const iconByName = (name: string) => {
  switch (name) {
    case "heart":
      return HeartIcon;
    case "star":
      return StarIcon;
    case "sparkle":
      return SparkleIcon;
    case "gift":
      return GiftIcon;
    case "cake":
      return CakeIcon;
    case "cupcake":
      return CupcakeIcon;
    case "crown":
      return CrownIcon;
    case "ribbon":
      return RibbonIcon;
    case "bow":
      return BowIcon;
    default:
      return SparkleIcon;
  }
};
