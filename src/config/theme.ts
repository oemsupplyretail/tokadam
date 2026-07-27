import type { CSSProperties } from "react";

export const theme = {
  colors: {
    primary: "#151515",
    secondary: "#f6f1e8",
    accent: "#c49a46",
    paper: "#fffdf9",
  },
  logo: {
    name: "PADOX",
    emphasis: "PRO",
  },
  favicon: "/favicon.ico",
} as const;

export const themeVariables = {
  "--ink": theme.colors.primary,
  "--gold": theme.colors.accent,
  "--cream": theme.colors.secondary,
  "--paper": theme.colors.paper,
} as CSSProperties;
