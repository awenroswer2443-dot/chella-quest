import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fff5f7",
          100: "#ffe4ec",
          200: "#ffc6d7",
          300: "#ffa0bb",
          400: "#ff7aa0",
          500: "#ff5288",
          600: "#e83a75",
        },
        cream: {
          50: "#fffaf0",
          100: "#fff3dc",
          200: "#ffe7ba",
        },
        peach: {
          100: "#ffe4d1",
          200: "#ffc9a8",
          300: "#ffae82",
        },
        lilac: {
          100: "#ece1ff",
          200: "#d9c4ff",
          300: "#c3a2ff",
          400: "#a77dff",
        },
        rose: {
          glow: "#ff97b8",
        },
        gold: {
          100: "#fff3c4",
          200: "#ffe58a",
          300: "#ffd35c",
          400: "#ffbf2e",
          500: "#f5a623",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        body: ["var(--font-body)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        candy:
          "0 10px 30px -10px rgba(255, 82, 136, 0.5), 0 4px 8px -2px rgba(255, 82, 136, 0.25), inset 0 -4px 0 0 rgba(0, 0, 0, 0.08), inset 0 2px 0 0 rgba(255, 255, 255, 0.7)",
        dreamy:
          "0 20px 60px -20px rgba(199, 98, 176, 0.4), 0 10px 30px -15px rgba(255, 162, 194, 0.5)",
        glow: "0 0 40px rgba(255, 162, 194, 0.6)",
        gem: "0 8px 20px -8px rgba(147, 51, 234, 0.4), inset 0 2px 0 0 rgba(255,255,255,0.6)",
      },
      backgroundImage: {
        "dreamy-gradient":
          "linear-gradient(135deg, #ffe4ec 0%, #ffd6e7 25%, #ffe7d6 55%, #f3e5ff 100%)",
        "sunset-gradient":
          "linear-gradient(180deg, #ffcce0 0%, #ffe7d6 60%, #fff3dc 100%)",
        "night-gradient":
          "linear-gradient(180deg, #2a1b4a 0%, #4e2a6e 45%, #8a3a8a 100%)",
        "candy-gradient":
          "linear-gradient(135deg, #ff97b8 0%, #ff7aa0 50%, #e83a75 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-14px) rotate(3deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-24px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        wobble: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        pop: {
          "0%": { transform: "scale(0)", opacity: "0" },
          "60%": { transform: "scale(1.15)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "heart-beat": {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.1)" },
          "50%": { transform: "scale(0.95)" },
          "75%": { transform: "scale(1.05)" },
        },
        rainbow: {
          "0%, 100%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(30deg)" },
        },
      },
      animation: {
        float: "float 4s ease-in-out infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        twinkle: "twinkle 2s ease-in-out infinite",
        shimmer: "shimmer 2.5s ease-in-out infinite",
        wobble: "wobble 3s ease-in-out infinite",
        pop: "pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "heart-beat": "heart-beat 1.2s ease-in-out infinite",
        rainbow: "rainbow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
