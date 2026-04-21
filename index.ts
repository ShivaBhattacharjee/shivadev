#!/usr/bin/env node

import chalk from "chalk";
import * as os from "node:os";
import * as readline from "readline";
import { createRequire } from "node:module";
import { fetchPortfolioProjects, fetchExperiences, fetchResearch, type PortfolioProject, type Experience, type Research } from "./portfolio-projects.js";
import { red, redHi, white, yellow, blue, dim, bold, gray, log, border, accent } from "./src/logger.js";
import { gatherNeofetchRows, stripAnsi, wrapText } from "./src/utils.js";
import { getLogoLines, getMascotBlock } from "./src/ascii.js";
import { COLOR_PRESETS, getCurrentColor, applyColorTheme, applyHexColor } from "./src/theme.js";

const _require = createRequire(import.meta.url);
const config = _require("./config.json") as {
  about: { name: string; title: string; bio: string; website: string; github: string; twitter: string; linkedin: string; email: string };
  skills: { languages: string[]; frameworks: string[]; others: string[] };
  portfolioProjectsUrl: string;
};

const about = config.about;
const skills = config.skills;
let experiences: Experience[] = [];
let research: Research[] = [];

function buildBanner(): string {
  return `
${getMascotBlock()}

${border("┌──────────────────────────────────────────────────────────────────┐")}
${border("│")}                                                                  ${border("│")}
${border("│")}   ${accent("Shiva Bhattacharjee")}  ${dim("// Applied AI Engineer")}                  ${border("│")}
${border("│")}   ${dim("─────────────────────────────────────────")}                      ${border("│")}
${border("│")}   ${dim("Type")} ${white("help")} ${dim("to see available commands.")}                         ${border("│")}
${border("│")}   ${dim("Try")} ${white("neofetch")} ${dim("·")} ${white("dance")}                                              ${border("│")}
${border("│")}                                                                  ${border("│")}
${border("└──────────────────────────────────────────────────────────────────┘")}
`;
}

function buildNeofetchBodyLines(): string[] {
  const logo = getLogoLines();
  const rows = gatherNeofetchRows();
  const labelW = Math.max(...rows.map((row) => row.label.length), 0);
  const logoW = Math.max(...logo.map((l) => stripAnsi(l).length), 0);
  const gap = 2;
  const maxLines = Math.max(logo.length, rows.length);

  const lines: string[] = [];
  for (let i = 0; i < maxLines; i++) {
    const left = logo[i] ?? "";
    const pad = " ".repeat(Math.max(0, logoW - stripAnsi(left).length + gap));
    const row = rows[i];
    const right = row
      ? `${accent(row.label.padEnd(labelW))}${dim(":")} ${white(row.value)}`
      : "";
    lines.push(`${left}${pad}${right}`);
  }
  return lines;
}

function printNeofetchBlock(headerLine: string, bodyLines: string[]): void {
  log.empty();
  console.log(`  ${headerLine}`);
  for (const line of bodyLines) console.log(`  ${line}`);
  log.empty();
}

const commands: Record<string, (args?: string) => void | Promise<void>> = {
  help() {
    log.empty();
    log.label("Available Commands:");
    log.empty();
    log.cli(`  ${redHi("about")}        ${dim("─")}  Who am I`);
    log.cli(`  ${redHi("skills")}       ${dim("─")}  Languages, frameworks & tools`);
    log.cli(`  ${redHi("experience")}   ${dim("─")}  Work history`);
    log.cli(`  ${redHi("projects")}     ${dim("─")}  Things I've built (live from portfolio)`);
    log.cli(`  ${redHi("research")}     ${dim("─")}  Academic publications`);
    log.cli(`  ${redHi("socials")}      ${dim("─")}  Links & contact`);
    log.cli(`  ${redHi("neofetch")}     ${dim("─")}  System info (like neofetch)`);
    log.cli(`  ${redHi("fetch")}        ${dim("─")}  Alias for neofetch`);
    log.cli(`  ${redHi("dance")}        ${dim("─")}  Mascot jumps`);
    log.cli(`  ${redHi("banner")}       ${dim("─")}  Show the welcome banner`);
    log.cli(`  ${redHi("clear")}        ${dim("─")}  Clear the screen`);
    log.cli(`  ${redHi("color")}      ${dim("─")}  Change theme color (e.g. color green)`);
    log.cli(`  ${redHi("exit")}         ${dim("─")}  Quit`);
    log.empty();
  },

  about() {
    log.empty();
    console.log(`  ${accent(about.name)}`);
    console.log(`  ${red(about.title)}`);
    log.empty();
    for (const line of wrapText(about.bio, 70)) {
      log.cli(`  ${white(line)}`);
    }
    log.empty();
  },

  skills() {
    log.empty();
    log.cli(`  ${bold(redHi("Languages:"))}`);
    log.cli(`  ${skills.languages.map((l) => yellow(l)).join(dim(" · "))}`);
    log.empty();
    log.cli(`  ${bold(redHi("Frameworks:"))}`);
    log.cli(`  ${skills.frameworks.map((f) => redHi(f)).join(dim(" · "))}`);
    log.empty();
    log.cli(`  ${bold(redHi("Tools & Infrastructure:"))}`);
    log.cli(`  ${skills.others.map((o) => blue(o)).join(dim(" · "))}`);
    log.empty();
  },

  async experience() {
    log.empty();
    log.dim("Loading experiences …");
    log.empty();
    try {
      experiences = await fetchExperiences();
    } catch (err) {
      log.cli(`  ${red("Could not load experiences from remote.")} ${dim(String(err))}`);
      log.empty();
    }

    const parseExpDate = (s: string): Date => {
      const monthMap: Record<string, number> = {
        jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
        jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
      };
      const lower = s.trim().toLowerCase();
      if (lower === "present") return new Date();
      const [mon, yr] = lower.split(" ");
      return new Date(Number(yr), monthMap[mon.slice(0, 3)] ?? 0, 1);
    };

    const allDates = experiences.flatMap((e) => {
      const [start, end] = e.year.split("-").map((p) => p.trim());
      return [parseExpDate(start), parseExpDate(end ?? "present")];
    });
    const earliest = new Date(Math.min(...allDates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...allDates.map((d) => d.getTime())));
    const totalMonths =
      (latest.getFullYear() - earliest.getFullYear()) * 12 +
      (latest.getMonth() - earliest.getMonth());
    const yrs = Math.floor(totalMonths / 12);
    const mos = totalMonths % 12;
    const totalLabel = yrs > 0 && mos > 0
      ? `${yrs}y ${mos}m`
      : yrs > 0
        ? `${yrs} year${yrs > 1 ? "s" : ""}`
        : `${mos} month${mos > 1 ? "s" : ""}`;

    log.cli(`  ${dim("Total Experience:")} ${accent(totalLabel)}`);
    log.hr();
    log.empty();
    for (const exp of [...experiences].reverse()) {
      log.cli(`  ${bold(redHi(exp.role))} ${dim("@")} ${white(exp.company)}`);
      log.cli(`  ${dim(exp.year)} ${dim("·")} ${dim(exp.type)} ${dim("·")} ${dim(exp.location)}`);
      log.empty();
      for (const resp of exp.responsibility) {
        log.bullet(resp);
      }
      log.empty();
      log.cli(`  ${dim("Stack:")} ${exp.techstacks.map((t) => yellow(t)).join(dim(", "))}`);
      log.hr();
      log.empty();
    }
  },

  async projects() {
    log.empty();
    log.dim("Loading projects …");
    log.empty();
    let list: PortfolioProject[];
    try {
      list = await fetchPortfolioProjects();
    } catch (err) {
      log.cli(`  ${red("Could not load projects.")} ${dim(String(err))}`);
      log.cli(`  ${dim("Check your network")}`);
      log.empty();
      return;
    }
    for (const proj of list) {
      log.cli(`  ${bold(redHi(proj.title))} ${dim(`[${proj.category}]`)}`);
      log.cli(`  ${white(proj.description)}`);
      log.cli(`  ${dim("Tech:")} ${proj.techstacks.map((t) => yellow(t)).join(dim(", "))}`);
      log.cli(`  ${dim("Status:")} ${proj.status === "active" ? redHi("Active") : dim(proj.status)}`);
      if (proj.link !== "#") {
        log.cli(`  ${dim("Link:")} ${blue(proj.link)}`);
      }
      log.empty();
    }
  },

  async research() {
    log.empty();
    log.dim("Loading research …");
    log.empty();
    try {
      research = await fetchResearch();
    } catch (err) {
      log.cli(`  ${red("Could not load research from remote.")} ${dim(String(err))}`);
      log.empty();
      return;
    }
    for (const paper of research) {
      log.cli(`  ${bold(redHi(paper.title))}`);
      log.cli(`  ${dim(paper.category)}`);
      log.empty();
      for (const line of wrapText(paper.description, 68)) {
        log.cli(`  ${gray(line)}`);
      }
      log.empty();
      log.cli(`  ${dim("Journal:")} ${white(paper.journal)}`);
      log.cli(`  ${dim("Year:")} ${white(paper.year)}  ${dim("Status:")} ${yellow(paper.status)}`);
      log.cli(`  ${dim("With:")} ${white(paper.collaboration)}`);
      if (paper.techstacks.length > 0) {
        log.cli(`  ${dim("Tech:")} ${paper.techstacks.map((t) => yellow(t)).join(dim(", "))}`);
      }
      log.hr();
      log.empty();
    }
  },

  socials() {
    log.empty();
    log.label("Connect with me:");
    log.empty();
    log.cli(`  ${bold(red("Website"))}    ${blue(about.website)}`);
    log.cli(`  ${bold(red("GitHub"))}     ${blue(about.github)}`);
    log.cli(`  ${bold(red("Twitter"))}    ${blue(about.twitter)}`);
    log.cli(`  ${bold(red("LinkedIn"))}   ${blue(about.linkedin)}`);
    log.cli(`  ${bold(red("Email"))}      ${white(about.email)}`);
    log.empty();
  },

  neofetch() {
    const user = process.env.USER ?? "visitor";
    const host = os.hostname();
    const headerLine = `${accent(`${user}@${host}`)}`;
    printNeofetchBlock(headerLine, buildNeofetchBodyLines());
  },

  fetch() {
    commands.neofetch();
  },

  async dance() {
    const { runDance } = await import("./src/ascii.js");
    await runDance();
  },

  banner() {
    console.log(buildBanner());
  },

  clear() {
    console.clear();
    console.log(buildBanner());
  },

  color(args?: string) {
    const input = (args ?? "").trim();
    if (!input) {
      log.empty();
      log.cli(`  ${dim("Available colors:")} ${Object.keys(COLOR_PRESETS).join(dim(", "))}`);
      log.cli(`  ${dim("Current:")} ${redHi(getCurrentColor())}`);
      log.cli(`  ${dim("Usage:")} ${white("color <name>")} ${dim("or")} ${white("color #rrggbb")}`);
      log.empty();
      return;
    }
    const lower = input.toLowerCase();
    if (applyColorTheme(lower)) {
      log.empty();
      log.cli(`  ${dim("Theme set to:")} ${redHi(lower)}`);
      log.empty();
      console.log(buildBanner());
      log.empty();
      return;
    }
    const hexInput = lower.startsWith("#") ? lower : "#" + lower;
    const rgb = (() => { const m = hexInput.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i); return m ? hexInput : null; })();
    if (rgb && applyHexColor(rgb)) {
      log.empty();
      log.cli(`  ${dim("Theme set to:")} ${redHi(input)}`);
      log.empty();
      console.log(buildBanner());
      log.empty();
      return;
    }
    log.empty();
    log.cli(`  ${red("Unknown color:")} ${white(input)}`);
    log.cli(`  ${dim("Available:")} ${Object.keys(COLOR_PRESETS).join(dim(", "))}`);
    log.empty();
  },

  exit() {
    replAlive = false;
    log.empty();
    log.dim("  Goodbye! 👋");
    log.empty();
    rl.close();
    process.exit(0);
  },
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: Boolean(process.stdin.isTTY),
});

let replAlive = true;
rl.on("close", () => {
  replAlive = false;
});

function getPrompt(): string {
  return `${redHi("visitor")}${dim("@")}${red("shiva.codes")}${dim(":")}${yellow("~")}${dim("$")} `;
}

console.log(buildBanner());

function ask() {
  if (!replAlive) return;
  rl.question(getPrompt(), (input) => {
    void (async () => {
      try {
        await handleInput(input);
      } finally {
        if (replAlive) ask();
      }
    })();
  });
}

async function handleInput(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return;

  const [cmd, ...argParts] = trimmed.split(/\s+/);
  const cmdLower = cmd.toLowerCase();
  const args = argParts.join(" ");

  const run = commands[cmdLower];
  if (run) {
    await Promise.resolve(run(args));
  } else {
    log.empty();
    log.cli(`  ${red("Command not found:")} ${white(cmd)}`);
    log.cli(`  ${dim("Type")} ${white("help")} ${dim("to see available commands.")}`);
    log.empty();
  }
}

ask();