#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";

// ASCII Logo (kept as pixel art) - escaped internal backticks to preserve exact art
const asciiLogo = `
                                 ,        ,
                                /(        )\`
                                \\ \\___   / |
                                /- _  \`-/  '
                               (/\/ \\ \\   /\\
                               / /   | \`    \\
                               O O   ) /    |
                               \`-^--'\`<     '
                   TM         (_.)  _  )   /
|  | |\\  | ~|~ \\ /             \`.___/\`    /
|  | | \\ |  |   X                \`-----' /
\`__| |  \\| _|_ / \\  <----.     __ / __   \\
                    <----|====O)))==) \\) /====
                    <----'    \`--' \`.__,' \\
                                 |        |
                                  \\       /
                             ______( (_  / \\______
                           ,'  ,-----'   |        \\
                           \`--{__________)        \\

`;

const details = {
  name: chalk.cyan("Shiva Bhattacharjee"),
  occupation: chalk.magenta("    Your average software developer"),
  website: chalk.blue(`https://theshiva.xyz`),
  github: chalk.green(`https://github.com/shivabhattacharjee`),
  twitter: chalk.cyan(`https://twitter.com/sh17va`),
  email: chalk.red(`    sh7vabhattacharjee@gmail.com`),
  languages: {
    JavaScript: { color: chalk.yellow },
    Typescript: { color: chalk.blueBright },
    Python: { color: chalk.green },
    GO: { color: chalk.blue },
    Rust: { color: chalk.red },
  },
  frameworks: {
    NextJs: { color: chalk.yellow },
    ExpressJs: { color: chalk.blueBright },
    TailwindCss: { color: chalk.green },
    Hono: { color: chalk.blue },
    Svelte: { color: chalk.red },
    Gorilla: { color: chalk.red },
  },
  others: {
    Docker: { color: chalk.blue },
    mongodb: { color: chalk.green },
    PostgreSQL: { color: chalk.blue },
    Git: { color: chalk.blue },
    Linux: { color: chalk.blue },
  }
};

const languagesArray = Object.entries(details.languages);
const frameworksArray = Object.entries(details.frameworks);
const othersArray = Object.entries(details.others);

const languagesRows: string[] = [];
const frameworksRows: string[] = [];
const othersRows: string[] = [];

for (let i = 0; i < languagesArray.length; i += 4) {
  const slicedLanguages = languagesArray.slice(i, i + 4);
  const row = slicedLanguages
    .map(([lang, { color }]) => `${color(`${lang}`)}`)
    .join(" ");
  languagesRows.push(row);
}

for (let i = 0; i < frameworksArray.length; i += 4) {
  const slicedFrameworks = frameworksArray.slice(i, i + 4);
  const row = slicedFrameworks
    .map(([lang, { color }]) => `${color(`${lang}`)}`)
    .join(" ");
  frameworksRows.push(row);
}

for (let i = 0; i < othersArray.length; i += 4) {
  const slicedOthers = othersArray.slice(i, i + 4);
  const row = slicedOthers
    .map(([lang, { color }]) => `${color(`${lang}`)}`)
    .join(" ");
  othersRows.push(row);
}

const info = [
  `${chalk.bold("Name:")}${details.name}`,
  `${chalk.bold("About:")} ${details.occupation}`,
  `${chalk.bold("Website:")}   ${details.website}`,
  `${chalk.bold("GitHub:")}    ${details.github}`,
  `${chalk.bold("Twitter:")}   ${details.twitter}`,
  `${chalk.bold("Email:")} ${details.email}`,
  `${chalk.bold("Languages:")}`,
  ...languagesRows,
  `${chalk.bold("Frameworks:")}`,
  ...frameworksRows,
  `${chalk.bold("Others:")}`,
  ...othersRows,
];

const asciiLogoLines = asciiLogo.trim().split("\n");
const infoLines = info;

const logoWidth = Math.max(...asciiLogoLines.map((line) => line.length));

const outputLines: string[] = [];
for (let i = 0; i < Math.max(asciiLogoLines.length, infoLines.length); i++) {
  const logoLine = asciiLogoLines[i] || "";
  const infoLine = infoLines[i] || "";
  const paddedLogoLine = logoLine.padEnd(logoWidth, " ");
  outputLines.push(`${paddedLogoLine}    ${infoLine}`);
}

const output = outputLines.join("\n");

// Pixelated border using block characters (full style)
const pixelBorder = {
  topLeft: "▓",
  topRight: "▓",
  bottomLeft: "▓",
  bottomRight: "▓",
  top: "▓",
  right: "▓",
  bottom: "▓",
  left: "▓",
} as const;

const message = boxen(output, {
  padding: 1,
  margin: 1,
  borderStyle: pixelBorder,
});

console.log(message);
