import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Brand */
        brand: {
          black: "#0B0B0B",
          white: "#FFFFFF",
          red: "#B11E2E",
          "red-hover": "#8B1623",
          "red-soft": "#F8E5E8",
        },
        /* shadcn token map */
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        arabic: ["var(--font-arabic)", "Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
        latin: ["var(--font-latin)", "Inter", "sans-serif"],
        display: ["var(--font-arabic)", "Arial", "Helvetica Neue", "Helvetica", "sans-serif"],
        sans: ["var(--font-arabic)", "var(--font-latin)", "system-ui", "sans-serif"],
      },
      fontSize: {
        xs: ["0.875rem", { lineHeight: "1.3" }],
        sm: ["1.0625rem", { lineHeight: "1.45" }],
        base: ["1.1875rem", { lineHeight: "1.6" }],
        lg: ["1.3125rem", { lineHeight: "1.55" }],
        xl: ["1.4375rem", { lineHeight: "1.5" }],
        "display-2xl": ["5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-xl": ["4.125rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-lg": ["3.25rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        "display-md": ["2.5rem", { lineHeight: "1.2" }],
        "display-sm": ["2.0625rem", { lineHeight: "1.25" }],
        "display-xs": ["1.625rem", { lineHeight: "1.3" }],
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },
      animation: {
        "fade-in": "fadeIn var(--motion-base) var(--motion-easing)",
        "slide-up": "slideUp var(--motion-base) var(--motion-easing)",
        "slide-down": "slideDown var(--motion-base) var(--motion-easing)",
        "marquee": "marquee 30s linear infinite",
        "marquee-rtl": "marqueeRtl 30s linear infinite",
        "counter": "counter 1.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        marqueeRtl: {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "card-hover": "0 12px 30px -8px rgb(177 30 46 / 0.15)",
        "brand": "0 4px 14px 0 rgb(177 30 46 / 0.3)",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0B0B0B 0%, #1a0a0c 50%, #0B0B0B 100%)",
        "gradient-red": "linear-gradient(135deg, #B11E2E 0%, #8B1623 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
