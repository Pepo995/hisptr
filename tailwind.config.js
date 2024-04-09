/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";

const config = {
  prefix: "tw-",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: {
        "spin-slow": "spin 3s linear infinite",
      },
      colors: {
        primary: "#fd6f6e",
        secondary: "#eb6665",
        slate: {
          custom: "#F8F8F8",
          shadow: "#E1E1E140",
          inactive: "#CBD5E1",
          light: "#ACACAC",
        },
        red: {
          alert: "#FF0303",
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        montserrat: ["Montserrat", "sans-serif"],
        GoodHeadlinePro: ["Good Headline Pro", "sans-serif"],
        ubuntu: ["Ubuntu Mono", "sans-serif"],
      },
      boxShadow: {
        bottom: "box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);",
      },
      width: {
        "1/8": "12.5%",
      },
    },
    screens: {
      xs: "475px",
      // => @media (min-width: 475px) { ... }
      ...defaultTheme.screens,
    },
  },
  plugins: [],
  important: true,
};

export default config;
