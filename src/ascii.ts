import chalk from "chalk";
import { getTheme } from "./theme.js";

const dim = chalk.dim;

function red(s: string): string {
  return getTheme().main(s);
}

function white(s: string): string {
  return chalk.white(s);
}

export const NEOFETCH_LOGO_RAW = [
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣴⣿⣿⡿⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣾⣿⣿⠟⠁⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⢀⣠⣤⣤⣤⣀⣀⠈⠋⠉⣁⣠⣤⣤⣤⣀⡀⠀⠀",
  "⠀⢠⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀",
  "⣠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠟⠋⠀",
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏⠀⠀⠀",
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⠀⠀",
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⠀⠀",
  "⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⣀",
  "⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠁",
  "⠀⠀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟⠁⠀",
  "⠀⠀⠀⠈⠙⢿⣿⣿⣿⠿⠟⠛⠻⠿⣿⣿⣿⡿⠋⠀⠀⠀",
  ,
] as const;

export const NEOFETCH_LOGO_RAW_WINDOWS = [
  "⠀⠀⠀⠀⠀⠆⢀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠐⢀⡙⠴⢖⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠠⠀⠀⠀⣤⠘⢛⢻⣿⣧⣿⣿⣿⣿⣿⣿⣤⣤⣀⣀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠠⠆⣀⠁⠤⠄⣘⠊⠦⢴⣿⣿⠉⠉⠉⣹⣿⠟⠻⢿⣿⣦⡀⠀⠀⠀⠀",
  "⠀⠀⠀⢀⠉⠤⠄⣈⡘⠐⢡⣿⣿⠇⠀⠀⢠⣿⡏⠀⠀⠀⢸⣿⠁⠀⠀⠀⠀",
  "⠀⠀⠀⡈⠠⠄⡈⠉⠽⠿⣿⣿⠿⠿⠿⣾⣿⣿⣤⣀⠀⣼⣿⡇⠀⠀⠀⠀⠀",
  "⠰⠀⠀⠀⠶⠀⠀⠀⠁⢀⣿⣿⠁⠀⠀⢸⣿⠏⠹⢿⣿⣿⡿⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠋⣤⣄⣈⡈⠔⢰⣿⣿⠀⠀⠀⢠⣿⠃⠀⠀⠀⣼⣿⠃⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠘⠛⠿⠿⣿⣿⣿⣿⣷⣶⣿⣇⡀⠀⠀⣼⣿⠃⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠙⠛⠿⣿⣿⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀⠀⠀",
  "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀",
] as const;

export function getLogoLines(): string[] {
  const raw =
    process.platform === "win32"
      ? NEOFETCH_LOGO_RAW_WINDOWS
      : NEOFETCH_LOGO_RAW;
  return raw.map((line) => red(line));
}

export function getMascotLines(): string[] {
  return [
    `  ${red("o")}`,
    ` ${red("/")}${white("|")}${red("\\")}`,
    `${red("/")} ${dim("·")} ${red("\\")}`,
  ];
}

export function getMascotJumpLines(): string[] {
  return [
    ` ${red("\\")}${white("o")}${red("/")}`,
    `  ${white("|")}`,
    ` ${red("/")} ${red("\\")}`,
  ];
}

export function getMascotBlock(): string {
  return getMascotLines().join("\n");
}

export async function runDance(): Promise<void> {
  const frames = [getMascotLines(), getMascotJumpLines()];
  console.log();
  console.log(`  ${dim("dance — watch the lines below (stand ↔ jump):")}`);
  console.log();
  for (let i = 0; i < 8; i++) {
    const frame = frames[i % frames.length];
    for (const line of frame) console.log(`  ${line}`);
    console.log();
    await new Promise((resolve) => setTimeout(resolve, 400));
  }
  console.log(`  ${dim("nice.")}`);
  console.log();
}
