import { type Config } from "tailwindcss";

export type TailwindTheme = Config & {
  colors: {
    primary: string;
  };
};
