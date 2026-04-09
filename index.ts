#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import * as readline from "readline";

// ─── Data ────────────────────────────────────────────────────────────────────

const about = {
  name: "Shiva Bhattacharjee",
  title: "Applied AI Engineer",
  bio: "Hi! I'm Shiva Bhattacharjee an Applied AI Engineer. I love development, making stuff, and experimenting with whatever catches my interest. Most of my work revolves around LLMs, agentic systems, and building developer tools on top of them. I've spent time working on complex multi-model pipelines orchestrating parallel image generation calls, chaining inference steps with memory-augmented context, and wiring up distributed task queues to keep everything running at scale. I've won 5 hackathons and was a Smart India Hackathon finalist in my first semester. I enjoy the messy, behind-the-scenes infrastructure work just as much as shipping the final product.",
  website: "https://shiva.codes",
  github: "https://github.com/shivabhattacharjee",
  twitter: "https://x.com/sh17va",
  linkedin: "https://linkedin.com/in/shiva-bhattacharjee",
  email: "hello@theshiva.xyz",
};

const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "Go", "Rust"],
  frameworks: ["Next.js", "Express.js", "TailwindCSS", "Hono", "Svelte", "Gorilla"],
  others: ["Docker", "MongoDB", "PostgreSQL", "Git", "Linux", "Redis", "Firebase", "GCP"],
};

const experiences = [
  {
    role: "Applied AI & Full Stack Engineer",
    year: "July 2025 - Present",
    company: "Bez",
    type: "Full-Time",
    location: "Remote",
    responsibility:
      "Reduced jewelry design turnaround from days to minutes by building AI agent workflows using the Vercel AI SDK with observability via Langfuse. Built an interactive jewelry design canvas using React + XYFlow enabling credit-gated editing and real-time agent-driven design iteration. Developed a Redis queue pipeline generating 70+ jewelry design variations in 5 minutes per batch. Built a custom memory system with rolling context per user to retain design preferences and reduce duplicate generations.",
    techstacks: ["Vercel AI SDK", "React", "XYFlow", "Redis", "Firebase", "GCP", "Docker", "Langfuse", "NextJS"],
  },
  {
    role: "Member of Technical Staff",
    year: "Jan 2025 - July 2025",
    company: "Navdyut AI",
    type: "Full-Time",
    location: "India, On-Site",
    responsibility:
      "Built an Assamese chatbot on a 22B Mistral model with RAG pipelines for translation and government applications. Scaled the system to 500+ users and contributed to deployments for public sector use. Project work was featured in regional newspapers.",
    techstacks: ["Mistral", "RAG", "Langchain", "LlamaIndex", "Pinecone", "NextJS", "TailwindCSS", "Supabase"],
  },
  {
    role: "Software Engineer",
    year: "Oct 2024 - Jan 2025",
    company: "TTIPL",
    type: "Full-Time",
    location: "India, On-Site",
    responsibility:
      "Built internal ERP modules for billing, vendor, and project tracking used by construction operations. Developed semantic project document search using RAG pipelines with OpenAI embeddings and vector databases. Optimized API performance and database queries improving internal tool response times and reliability.",
    techstacks: ["ReactJS", "NextJS", "TailwindCSS", "Prisma", "Supabase", "OpenAI", "Vector DB", "RAG"],
  },
  {
    role: "Software Developer Intern",
    year: "Feb 2024 - Sept 2024",
    company: "GITCS.",
    type: "Internship",
    location: "Guwahati, On-Site",
    responsibility:
      "Develop websites and systems to be used by its clients and maintain current existing websites and systems.",
    techstacks: ["ReactJS", "NextJS", "Framer Motion", "ThreeJS"],
  },
];

const projects = [
  {
    title: "Image Sonification",
    category: "Research Project",
    description: "Converts images to audio and vice versa by mapping pixel colour and position to audio frequencies.",
    techstacks: ["React", "TypeScript"],
    status: "active",
    link: "https://sonification.shiva.codes",
  },
];

const research = [
  {
    title: "PolySpeech-HS: Multilingual Non-Autoregressive TTS with Hidden-State Adapters",
    category: "Speech Synthesis & Multilingual AI",
    description:
      "A non-autoregressive TTS multilingual synthesis framework for Indian languages. Unified encoder-decoder architecture with lightweight hidden-state adapters. Achieved MOS of 4.30, MCD of 4.7 dB, and RTF of 0.13 across six Indian languages.",
    journal: "IEEE Transactions on Audio, Speech and Language Processing",
    year: "2025",
    status: "under-review",
    collaboration: "Vellore Institute of Technology",
  },
  {
    title: "Data-Centric Transformer Fine-Tuning for Rapid Domain Adaptation",
    category: "Large Language Models & Domain Adaptation",
    description:
      "A data-centric, hardware-light workflow for fine-tuning transformers. Scrapes web content, converts to Q&A pairs, fine-tunes GPT-2-Medium (355M) in ~7 min on a single RTX-3060. Achieves 67.3% accuracy (+34% over base) with 1.4s latency and zero inference cost.",
    journal: "IEEE Transactions on Computational Social Systems",
    year: "2025",
    status: "under-review",
    collaboration: "Vellore Institute of Technology",
  },
  {
    title: "Fine-Tuning Mistral 22B: The First LLM for Assamese Language Tasks",
    category: "Low-Resource Language Processing",
    description:
      "The first fine-tuned LLM for Assamese (~15M speakers). Introduces AssamText-750K dataset and custom Unicode mapping. Achieves 20% average improvement across text generation, sentiment analysis, and Assamese-to-English translation.",
    journal: "IEEE Transactions on Neural Networks and Learning Systems",
    year: "2025",
    status: "under-review",
    collaboration: "Vellore Institute of Technology",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const dim = chalk.dim;
const bold = chalk.bold;
const cyan = chalk.cyan;
const green = chalk.green;
const yellow = chalk.yellow;
const magenta = chalk.magenta;
const blue = chalk.blue;
const red = chalk.red;
const white = chalk.white;
const gray = chalk.gray;

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

// ─── ASCII Banner ────────────────────────────────────────────────────────────

const banner = `
${cyan("┌──────────────────────────────────────────────────────────────────┐")}
${cyan("│")}                                                                  ${cyan("│")}
${cyan("│")}   ${bold(green("Shiva Bhattacharjee"))}  ${dim("// Applied AI Engineer")}                  ${cyan("│")}
${cyan("│")}   ${dim("─────────────────────────────────────────")}                      ${cyan("│")}
${cyan("│")}   ${dim("Type")} ${white("help")} ${dim("to see available commands.")}                         ${cyan("│")}
${cyan("│")}                                                                  ${cyan("│")}
${cyan("└──────────────────────────────────────────────────────────────────┘")}
`;

// ─── Commands ────────────────────────────────────────────────────────────────

const commands: Record<string, () => void> = {
  help() {
    console.log();
    console.log(bold("  Available Commands:"));
    console.log();
    console.log(`  ${green("about")}        ${dim("─")}  Who am I`);
    console.log(`  ${green("skills")}       ${dim("─")}  Languages, frameworks & tools`);
    console.log(`  ${green("experience")}   ${dim("─")}  Work history`);
    console.log(`  ${green("projects")}     ${dim("─")}  Things I've built`);
    console.log(`  ${green("research")}     ${dim("─")}  Academic publications`);
    console.log(`  ${green("socials")}      ${dim("─")}  Links & contact`);
    console.log(`  ${green("banner")}       ${dim("─")}  Show the welcome banner`);
    console.log(`  ${green("clear")}        ${dim("─")}  Clear the screen`);
    console.log(`  ${green("exit")}         ${dim("─")}  Quit`);
    console.log();
  },

  about() {
    console.log();
    console.log(bold(`  ${cyan(about.name)}`));
    console.log(`  ${magenta(about.title)}`);
    console.log();
    for (const line of wrapText(about.bio, 70)) {
      console.log(`  ${white(line)}`);
    }
    console.log();
  },

  skills() {
    console.log();
    console.log(bold("  Languages:"));
    console.log(`  ${skills.languages.map((l) => yellow(l)).join(dim(" · "))}`);
    console.log();
    console.log(bold("  Frameworks:"));
    console.log(`  ${skills.frameworks.map((f) => green(f)).join(dim(" · "))}`);
    console.log();
    console.log(bold("  Tools & Infrastructure:"));
    console.log(`  ${skills.others.map((o) => blue(o)).join(dim(" · "))}`);
    console.log();
  },

  experience() {
    console.log();
    for (const exp of experiences) {
      console.log(`  ${bold(cyan(exp.role))} ${dim("@")} ${white(exp.company)}`);
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

  projects() {
    console.log();
    for (const proj of projects) {
      console.log(`  ${bold(green(proj.title))} ${dim(`[${proj.category}]`)}`);
      console.log(`  ${white(proj.description)}`);
      console.log(`  ${dim("Tech:")} ${proj.techstacks.map((t) => yellow(t)).join(dim(", "))}`);
      console.log(`  ${dim("Status:")} ${proj.status === "active" ? green("Active") : dim(proj.status)}`);
      if (proj.link !== "#") {
        console.log(`  ${dim("Link:")} ${blue(proj.link)}`);
      }
      console.log();
    }
  },

  research() {
    console.log();
    for (const paper of research) {
      console.log(`  ${bold(magenta(paper.title))}`);
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
    console.log(bold("  Connect with me:"));
    console.log();
    console.log(`  ${bold("Website")}    ${blue(about.website)}`);
    console.log(`  ${bold("GitHub")}     ${green(about.github)}`);
    console.log(`  ${bold("Twitter")}    ${cyan(about.twitter)}`);
    console.log(`  ${bold("LinkedIn")}   ${blue(about.linkedin)}`);
    console.log(`  ${bold("Email")}      ${red(about.email)}`);
    console.log();
  },

  banner() {
    console.log(banner);
  },

  clear() {
    console.clear();
    console.log(banner);
  },

  exit() {
    console.log();
    console.log(dim("  Goodbye! 👋"));
    console.log();
    process.exit(0);
  },
};

// ─── REPL ────────────────────────────────────────────────────────────────────

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const prompt = `${green("visitor")}${dim("@")}${cyan("shiva.codes")}${dim(":")}${yellow("~")}${dim("$")} `;

console.log(banner);

function ask() {
  rl.question(prompt, (input) => {
    const cmd = input.trim().toLowerCase();

    if (!cmd) {
      ask();
      return;
    }

    if (commands[cmd]) {
      commands[cmd]();
    } else {
      console.log();
      console.log(`  ${red("Command not found:")} ${white(cmd)}`);
      console.log(`  ${dim("Type")} ${white("help")} ${dim("to see available commands.")}`);
      console.log();
    }

    ask();
  });
}

ask();
