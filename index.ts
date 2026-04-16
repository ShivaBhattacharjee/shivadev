#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "node:child_process";
import * as os from "node:os";
import * as readline from "readline";
import { createRequire } from "node:module";
import { fetchPortfolioProjects, type PortfolioProject } from "./portfolio-projects.js";

// ─── Config ───────────────────────────────────────────────────────────────────

const _require = createRequire(import.meta.url);
const config = _require("./config.json") as {
  about: { name: string; title: string; bio: string; website: string; github: string; twitter: string; linkedin: string; email: string };
  skills: { languages: string[]; frameworks: string[]; others: string[] };
  experiences: { role: string; year: string; company: string; type: string; location: string; responsibility: string; techstacks: string[] }[];
  research: { title: string; category: string; description: string; journal: string; year: string; status: string; collaboration: string }[];
  portfolioProjectsUrl: string;
};

const about = config.about;
const skills = config.skills;
const experiences = config.experiences;
const research = config.research;

// ─── Theme & helpers ─────────────────────────────────────────────────────────

const dim = chalk.dim;
const bold = chalk.bold;
const yellow = chalk.yellow;
const blue = chalk.blue;
const red = chalk.red;
const redHi = chalk.redBright;
const white = chalk.white;
const gray = chalk.gray;

function border(s: string): string {
  return red(s);
}

function accent(s: string): string {
  return bold(redHi(s));
}

function tryExec(command: string): string | undefined {
  try {
    return execSync(command, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2500,
    }).trim();
  } catch {
    return undefined;
  }
}

function formatGiB(bytes: number): string {
  return (bytes / 1024 ** 3).toFixed(2);
}

function gatherNeofetchRows(): { label: string; value: string }[] {
  const isDarwin = process.platform === "darwin";
  const isWin = process.platform === "win32";

  const productName = isDarwin ? tryExec("sw_vers -productName") : undefined;
  const productVersion = isDarwin ? tryExec("sw_vers -productVersion") : undefined;
  const buildVersion = isDarwin ? tryExec("sw_vers -buildVersion") : undefined;
  const darwinParts = [
    productName ?? os.type(),
    productVersion,
    buildVersion && `(${buildVersion})`,
    os.machine(),
  ].filter(Boolean) as string[];

  let osLine: string;
  if (isDarwin) {
    osLine = darwinParts.join(" ");
  } else if (isWin) {
    const winVer = typeof os.version === "function" ? os.version() : "";
    osLine = [winVer || `${os.type()} ${os.release()}`, os.machine()].filter(Boolean).join(" ");
  } else {
    osLine = [productName ?? os.type(), productVersion, buildVersion && `(${buildVersion})`, os.machine()]
      .filter(Boolean)
      .join(" ");
  }

  const hostModel = isDarwin ? tryExec("sysctl -n hw.model") : undefined;
  const cpuBrand = isDarwin ? tryExec("sysctl -n machdep.cpu.brand_string") : os.cpus()[0]?.model;

  const total = os.totalmem();
  const used = total - os.freemem();
  const memoryLine = `${formatGiB(used)} GiB / ${formatGiB(total)} GiB`;

  const shellName = isWin
    ? (process.env.ComSpec?.split(/[/\\]/).pop() ?? "—")
    : (process.env.SHELL?.split("/").pop() ?? "—");

  const runtime = process.versions.bun ? `Bun ${process.versions.bun}` : `Node ${process.version}`;

  const kernelLine = isDarwin
    ? `Darwin ${os.release()}`
    : isWin
      ? `Windows NT ${os.release()}`
      : `${os.type()} ${os.release()}`;

  const userName = process.env.USER ?? process.env.USERNAME ?? "—";

  return [
    { label: "OS", value: osLine || `${os.type()} ${os.release()} ${os.machine()}` },
    { label: "Host", value: hostModel ?? os.hostname() },
    { label: "Kernel", value: kernelLine },
    { label: "Shell", value: shellName },
    { label: "Terminal", value: process.env.TERM_PROGRAM ?? process.env.TERM ?? "—" },
    { label: "CPU", value: cpuBrand ?? "—" },
    { label: "Memory", value: memoryLine },
    { label: "User", value: userName },
    { label: "Runtime", value: runtime },
  ];
}

const NEOFETCH_LOGO_RAW = [
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
] as const;

const NEOFETCH_LOGO_RAW_WINDOWS = [
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

function neofetchLogoLines(): string[] {
  const raw = process.platform === "win32" ? NEOFETCH_LOGO_RAW_WINDOWS : NEOFETCH_LOGO_RAW;
  return raw.map((line) => red(line));
}

const mascotStand = (): string[] => [
  `  ${red("o")}`,
  ` ${red("/")}${white("|")}${red("\\")}`,
  `${red("/")} ${dim("·")} ${red("\\")}`,
];

const mascotJump = (): string[] => [
  ` ${red("\\")}${white("o")}${red("/")}`,
  `  ${white("|")}`,
  ` ${red("/")} ${red("\\")}`,
];

function mascotStaticBlock(): string {
  return mascotStand().join("\n");
}

async function runMascotDance(): Promise<void> {
  const frames = [mascotStand(), mascotJump()];
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

function buildNeofetchBodyLines(): string[] {
  const logo = neofetchLogoLines();
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
  const margin = "  ";
  console.log();
  console.log(`${margin}${headerLine}`);
  for (const line of bodyLines) console.log(`${margin}${line}`);
  console.log();
}

function stripAnsi(s: string): string {
  return s.replace(/\x1b\[[0-9;]*m/g, "");
}

function wrapText(text: string, width: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current.length + word.length + 1 > width) {
      lines.push(current);
      current = word;
    } else {
      current = current ? `${current} ${word}` : word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ─── ASCII banner ────────────────────────────────────────────────────────────

const banner = `
${mascotStaticBlock()}

${border("┌──────────────────────────────────────────────────────────────────┐")}
${border("│")}                                                                  ${border("│")}
${border("│")}   ${accent("Shiva Bhattacharjee")}  ${dim("// Applied AI Engineer")}                  ${border("│")}
${border("│")}   ${dim("─────────────────────────────────────────")}                      ${border("│")}
${border("│")}   ${dim("Type")} ${white("help")} ${dim("to see available commands.")}                         ${border("│")}
${border("│")}   ${dim("Try")} ${white("neofetch")} ${dim("·")} ${white("dance")}                                              ${border("│")}
${border("│")}                                                                  ${border("│")}
${border("└──────────────────────────────────────────────────────────────────┘")}
`;

// ─── Commands ────────────────────────────────────────────────────────────────

const commands: Record<string, () => void | Promise<void>> = {
  help() {
    console.log();
    console.log(bold(`  ${redHi("Available Commands:")}`));
    console.log();
    console.log(`  ${redHi("about")}        ${dim("─")}  Who am I`);
    console.log(`  ${redHi("skills")}       ${dim("─")}  Languages, frameworks & tools`);
    console.log(`  ${redHi("experience")}   ${dim("─")}  Work history`);
    console.log(`  ${redHi("projects")}     ${dim("─")}  Things I've built (live from portfolio)`);
    console.log(`  ${redHi("research")}     ${dim("─")}  Academic publications`);
    console.log(`  ${redHi("socials")}      ${dim("─")}  Links & contact`);
    console.log(`  ${redHi("neofetch")}     ${dim("─")}  System info (like neofetch)`);
    console.log(`  ${redHi("fetch")}        ${dim("─")}  Alias for neofetch`);
    console.log(`  ${redHi("dance")}        ${dim("─")}  Mascot jumps`);
    console.log(`  ${redHi("banner")}       ${dim("─")}  Show the welcome banner`);
    console.log(`  ${redHi("clear")}        ${dim("─")}  Clear the screen`);
    console.log(`  ${redHi("exit")}         ${dim("─")}  Quit`);
    console.log();
  },

  about() {
    console.log();
    console.log(bold(`  ${accent(about.name)}`));
    console.log(`  ${red(about.title)}`);
    console.log();
    for (const line of wrapText(about.bio, 70)) {
      console.log(`  ${white(line)}`);
    }
    console.log();
  },

  skills() {
    console.log();
    console.log(bold(`  ${redHi("Languages:")}`));
    console.log(`  ${skills.languages.map((l) => yellow(l)).join(dim(" · "))}`);
    console.log();
    console.log(bold(`  ${redHi("Frameworks:")}`));
    console.log(`  ${skills.frameworks.map((f) => redHi(f)).join(dim(" · "))}`);
    console.log();
    console.log(bold(`  ${redHi("Tools & Infrastructure:")}`));
    console.log(`  ${skills.others.map((o) => blue(o)).join(dim(" · "))}`);
    console.log();
  },

  experience() {
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

    console.log();
    console.log(`  ${dim("Total Experience:")} ${accent(totalLabel)}`);
    console.log(`  ${dim("─".repeat(60))}`);
    console.log();
    for (const exp of experiences) {
      console.log(`  ${bold(redHi(exp.role))} ${dim("@")} ${white(exp.company)}`);
      console.log(`  ${dim(exp.year)} ${dim("·")} ${dim(exp.type)} ${dim("·")} ${dim(exp.location)}`);
      console.log();
      for (const line of wrapText(exp.responsibility, 68)) {
        console.log(`  ${gray(line)}`);
      }
      console.log();
      console.log(`  ${dim("Stack:")} ${exp.techstacks.map((t) => yellow(t)).join(dim(", "))}`);
      console.log(`  ${dim("─".repeat(60))}`);
      console.log();
    }
  },

  async projects() {
    console.log();
    console.log(`  ${dim("Loading projects …")}`);
    console.log();
    let list: PortfolioProject[];
    try {
      list = await fetchPortfolioProjects();
    } catch (err) {
      console.log(`  ${red("Could not load projects.")} ${dim(String(err))}`);
      console.log(`  ${dim("Check your network")}`);
      console.log();
      return;
    }
    for (const proj of list) {
      console.log(`  ${bold(redHi(proj.title))} ${dim(`[${proj.category}]`)}`);
      console.log(`  ${white(proj.description)}`);
      console.log(`  ${dim("Tech:")} ${proj.techstacks.map((t) => yellow(t)).join(dim(", "))}`);
      console.log(`  ${dim("Status:")} ${proj.status === "active" ? redHi("Active") : dim(proj.status)}`);
      if (proj.link !== "#") {
        console.log(`  ${dim("Link:")} ${blue(proj.link)}`);
      }
      console.log();
    }
  },

  research() {
    console.log();
    for (const paper of research) {
      console.log(`  ${bold(redHi(paper.title))}`);
      console.log(`  ${dim(paper.category)}`);
      console.log();
      for (const line of wrapText(paper.description, 68)) {
        console.log(`  ${gray(line)}`);
      }
      console.log();
      console.log(`  ${dim("Journal:")} ${white(paper.journal)}`);
      console.log(`  ${dim("Year:")} ${white(paper.year)}  ${dim("Status:")} ${yellow(paper.status)}`);
      console.log(`  ${dim("With:")} ${white(paper.collaboration)}`);
      console.log(`  ${dim("─".repeat(60))}`);
      console.log();
    }
  },

  socials() {
    console.log();
    console.log(bold(`  ${redHi("Connect with me:")}`));
    console.log();
    console.log(`  ${bold(red("Website"))}    ${blue(about.website)}`);
    console.log(`  ${bold(red("GitHub"))}     ${blue(about.github)}`);
    console.log(`  ${bold(red("Twitter"))}    ${blue(about.twitter)}`);
    console.log(`  ${bold(red("LinkedIn"))}   ${blue(about.linkedin)}`);
    console.log(`  ${bold(red("Email"))}      ${white(about.email)}`);
    console.log();
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
    await runMascotDance();
  },

  banner() {
    console.log(banner);
  },

  clear() {
    console.clear();
    console.log(banner);
  },

  exit() {
    replAlive = false;
    console.log();
    console.log(dim("  Goodbye! 👋"));
    console.log();
    rl.close();
    process.exit(0);
  },
};

// ─── REPL ────────────────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: Boolean(process.stdin.isTTY),
});

let replAlive = true;
rl.on("close", () => {
  replAlive = false;
});

const prompt = `${redHi("visitor")}${dim("@")}${red("shiva.codes")}${dim(":")}${yellow("~")}${dim("$")} `;

console.log(banner);

function ask() {
  if (!replAlive) return;
  rl.question(prompt, (input) => {
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
  const cmd = raw.trim().toLowerCase();

  if (!cmd) return;

  const run = commands[cmd];
  if (run) {
    await Promise.resolve(run());
  } else {
    console.log();
    console.log(`  ${red("Command not found:")} ${white(cmd)}`);
    console.log(`  ${dim("Type")} ${white("help")} ${dim("to see available commands.")}`);
    console.log();
  }
}

ask();
