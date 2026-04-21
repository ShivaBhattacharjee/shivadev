import chalk from "chalk";
import { bold } from "./logger.js";

export const COLOR_PRESETS = {
  red: { main: chalk.red, bright: chalk.redBright, border: chalk.red, accent: (s: string) => bold(chalk.redBright(s)) },
  green: { main: chalk.green, bright: chalk.greenBright, border: chalk.green, accent: (s: string) => bold(chalk.greenBright(s)) },
  blue: { main: chalk.blue, bright: chalk.blueBright, border: chalk.blue, accent: (s: string) => bold(chalk.blueBright(s)) },
  cyan: { main: chalk.cyan, bright: chalk.cyanBright, border: chalk.cyan, accent: (s: string) => bold(chalk.cyanBright(s)) },
  magenta: { main: chalk.magenta, bright: chalk.magentaBright, border: chalk.magenta, accent: (s: string) => bold(chalk.magentaBright(s)) },
  yellow: { main: chalk.yellow, bright: chalk.yellowBright, border: chalk.yellow, accent: (s: string) => bold(chalk.yellowBright(s)) },
  white: { main: chalk.white, bright: chalk.white, border: chalk.white, accent: (s: string) => bold(chalk.white(s)) },
  black: { main: chalk.black, bright: chalk.black, border: chalk.black, accent: (s: string) => bold(chalk.black(s)) },
  gray: { main: chalk.gray, bright: chalk.gray, border: chalk.gray, accent: (s: string) => bold(chalk.gray(s)) },
  violet: { main: chalk.hex("#8b00ff"), bright: chalk.hex("#a020ff"), border: chalk.hex("#8b00ff"), accent: (s: string) => bold(chalk.hex("#a020ff")(s)) },
  orange: { main: chalk.hex("#ff8c00"), bright: chalk.hex("#ffa500"), border: chalk.hex("#ff8c00"), accent: (s: string) => bold(chalk.hex("#ffa500")(s)) },
  purple: { main: chalk.hex("#800080"), bright: chalk.hex("#a020a0"), border: chalk.hex("#800080"), accent: (s: string) => bold(chalk.hex("#a020a0")(s)) },
  pink: { main: chalk.hex("#ff1493"), bright: chalk.hex("#ff69b4"), border: chalk.hex("#ff1493"), accent: (s: string) => bold(chalk.hex("#ff69b4")(s)) },
  lime: { main: chalk.hex("#00ff00"), bright: chalk.hex("#32cd32"), border: chalk.hex("#00ff00"), accent: (s: string) => bold(chalk.hex("#32cd32")(s)) },
  teal: { main: chalk.hex("#008080"), bright: chalk.hex("#20b2aa"), border: chalk.hex("#008080"), accent: (s: string) => bold(chalk.hex("#20b2aa")(s)) },
  indigo: { main: chalk.hex("#4b0082"), bright: chalk.hex("#6a5acd"), border: chalk.hex("#4b0082"), accent: (s: string) => bold(chalk.hex("#6a5acd")(s)) },
} as const;

export type ColorName = keyof typeof COLOR_PRESETS | "custom";

export interface ColorTheme {
  main: (s: string) => string;
  bright: (s: string) => string;
  border: (s: string) => string;
  accent: (s: string) => string;
}

let colorTheme: ColorTheme = { ...COLOR_PRESETS.red };
let _currentColorName: ColorName = "red";

export function getCurrentColor(): ColorName {
  return _currentColorName;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace("#", "");
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

export function applyColorTheme(name: string): boolean {
  const key = name.toLowerCase() as ColorName;
  if (key in COLOR_PRESETS) {
    colorTheme = { ...COLOR_PRESETS[key as keyof typeof COLOR_PRESETS] };
    _currentColorName = key;
    return true;
  }
  return false;
}

export function applyHexColor(hex: string): boolean {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  colorTheme = {
    main: chalk.rgb(rgb.r, rgb.g, rgb.b),
    bright: (s: string) => bold(chalk.rgb(rgb.r, rgb.g, rgb.b)(s)),
    border: chalk.rgb(rgb.r, rgb.g, rgb.b),
    accent: (s: string) => bold(chalk.rgb(rgb.r, rgb.g, rgb.b)(s)),
  };
  _currentColorName = "custom";
  return true;
}

export function getTheme(): ColorTheme {
  return colorTheme;
}

export const red = (s: string) => colorTheme.main(s);
export const redHi = (s: string) => colorTheme.bright(s);
export const border = (s: string) => colorTheme.border(s);
export const accent = (s: string) => colorTheme.accent(s);