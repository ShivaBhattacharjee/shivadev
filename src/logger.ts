import chalk from "chalk";
import { getTheme } from "./theme.js";

export const bold = chalk.bold;
export const dim = chalk.dim;
export const yellow = chalk.yellow;
export const blue = chalk.blue;
export const white = chalk.white;
export const gray = chalk.gray;

export const red = (s: string) => getTheme().main(s);
export const redHi = (s: string) => getTheme().bright(s);
export const border = (s: string) => getTheme().border(s);
export const accent = (s: string) => getTheme().accent(s);

export function cli(...args: string[]): void {
  console.log(...args);
}

export function cliDim(...parts: string[]): void {
  console.log(`  ${dim(parts.join(" "))}`);
}

export function cliAccent(label: string, value: string): void {
  console.log(`  ${bold(label)} ${value}`);
}

export function cliInfo(label: string, value: string): void {
  console.log(`  ${dim(label + ":")} ${white(value)}`);
}

export function cliBullet(text: string): void {
  console.log(`  ${dim("•")} ${white(text)}`);
}

export function cliHr(): void {
  console.log(dim(`  ${"─".repeat(60)}`));
}

export function cliLabel(label: string): void {
  console.log();
  console.log(bold(`  ${label}`));
}

export function cliEmpty(): void {
  console.log();
}

export const log = {
  cli,
  dim: cliDim,
  accent: cliAccent,
  info: cliInfo,
  bullet: cliBullet,
  hr: cliHr,
  label: cliLabel,
  empty: cliEmpty,
};