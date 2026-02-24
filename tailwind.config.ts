import type { Config } from 'tailwindcss';

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        evgreen: "#03CD8C",
        evorange: "#F77F00",
        evgray: "#A6A6A6",
        evgrayLight: "#F2F2F2"
      },
      borderRadius: {
        mobile: "18px"
      }
    }
  },
  plugins: []
};

export default config;

