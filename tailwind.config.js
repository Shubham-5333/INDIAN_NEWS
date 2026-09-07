/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#b90015",
        "primary-container": "#e21e26",
        "on-primary": "#ffffff",
        "on-primary-container": "#fff9f8",
        "primary-fixed": "#ffdad6",
        "primary-fixed-dim": "#ffb4ac",
        "on-primary-fixed": "#410003",
        "on-primary-fixed-variant": "#93000f",

        "secondary": "#5f5e5e",
        "secondary-container": "#e2dfde",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#636262",
        "secondary-fixed": "#e5e2e1",
        "secondary-fixed-dim": "#c8c6c5",
        "on-secondary-fixed": "#1c1b1b",
        "on-secondary-fixed-variant": "#474746",

        "tertiary": "#5a5b5c",
        "tertiary-container": "#727474",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#fbfbfb",
        "tertiary-fixed": "#e2e2e2",
        "tertiary-fixed-dim": "#c6c6c7",
        "on-tertiary-fixed": "#1a1c1c",
        "on-tertiary-fixed-variant": "#454747",

        "background": "#fbf9f8",
        "on-background": "#1b1c1c",

        "surface": "#fbf9f8",
        "surface-bright": "#fbf9f8",
        "surface-dim": "#dbdad9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f5f3f3",
        "surface-container": "#efeded",
        "surface-container-high": "#e9e8e7",
        "surface-container-highest": "#e4e2e2",
        "surface-variant": "#e4e2e2",
        "on-surface": "#1b1c1c",
        "on-surface-variant": "#5d3f3c",

        "inverse-surface": "#303031",
        "inverse-on-surface": "#f2f0f0",
        "inverse-primary": "#ffb4ac",

        "outline": "#926f6b",
        "outline-variant": "#e7bdb8",

        "error": "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "on-error-container": "#93000a",
      },
      fontFamily: {
        "headline-xl": ["Archivo Narrow", "sans-serif"],
        "headline-lg": ["Archivo Narrow", "sans-serif"],
        "headline-lg-mobile": ["Archivo Narrow", "sans-serif"],
        "body-lg": ["Newsreader", "serif"],
        "body-md": ["Newsreader", "serif"],
        "label-caps": ["Inter", "sans-serif"],
        "meta-sm": ["Inter", "sans-serif"],
        "sans": ["Inter", "sans-serif"],
      },
      fontSize: {
        "headline-xl": ["30px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-lg": ["24px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "700" }],
        "headline-lg-mobile": ["19px", { lineHeight: "24px", fontWeight: "700" }],
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "700" }],
        "meta-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
      },
      borderRadius: {
        none: "0px",
        DEFAULT: "0px",
      },
      spacing: {
        "stack-sm": "0.5rem",
        "stack-md": "1rem",
        "stack-lg": "2rem",
        "section-gap": "3rem",
        "gutter": "1rem",
        "container-margin": "1rem",
      }
    },
  },
  plugins: [],
}
