/**
 * Loads `projects` from Portfolio-2025 constants (raw JS on GitHub).
 * URL is read from config.json (portfolioProjectsUrl).
 * Override at runtime: PORTFOLIO_CONSTANTS_URL env var.
 */

import { createRequire } from "node:module"

const _require = createRequire(import.meta.url)
const _config = _require("./config.json") as { portfolioProjectsUrl: string }

export interface PortfolioProject {
  title: string
  category: string
  description: string
  techstacks: string[]
  status: string
  link: string
  illustration?: string
  preview?: string
  previewDark?: string
}

export interface Experience {
  role: string
  year: string
  company: string
  type: string
  location: string
  responsibility: string[]
  techstacks: string[]
}

export interface Research {
  title: string
  category: string
  description: string
  techstacks: string[]
  status: string
  link: string
  journal: string
  year: string
  collaboration: string
}

export const DEFAULT_PORTFOLIO_CONSTANTS_URL = _config.portfolioProjectsUrl

function extractArrayLiteral(js: string, marker: string): string {
  const mi = js.indexOf(marker)
  if (mi === -1) throw new Error(`Could not find ${marker} in remote file`)

  const start = js.indexOf("[", mi)
  if (start === -1) throw new Error("Could not find array opening [")

  let depth = 0
  let inString = false
  let stringChar: string | null = null
  let escape = false

  for (let j = start; j < js.length; j++) {
    const c = js[j]
    if (escape) {
      escape = false
      continue
    }
    if (inString) {
      if (c === "\\") escape = true
      else if (c === stringChar) inString = false
      continue
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = true
      stringChar = c
      continue
    }
    if (c === "[") depth++
    else if (c === "]") {
      depth--
      if (depth === 0) return js.slice(start, j + 1)
    }
  }

  throw new Error(`Unterminated array for ${marker} (missing closing ])`)
}

function parseProjectsArrayLiteral(literal: string): PortfolioProject[] {
  const fn = new Function(`return (${literal})`) as () => unknown
  const data = fn()
  if (!Array.isArray(data)) throw new Error("projects is not an array")
  for (const item of data) {
    if (!item || typeof item !== "object") throw new Error("Invalid project entry")
    for (const key of ["title", "category", "description", "techstacks", "status", "link"] as const) {
      if (!(key in item)) throw new Error(`Project missing required field: ${key}`)
    }
    const row = item as Record<string, unknown>
    if (!Array.isArray(row.techstacks)) throw new Error("project.techstacks must be an array")
  }
  return data as PortfolioProject[]
}

function parseExperiencesArrayLiteral(literal: string): Experience[] {
  const fn = new Function(`return (${literal})`) as () => unknown
  const data = fn()
  if (!Array.isArray(data)) throw new Error("experiences is not an array")
  return data.map((item: Record<string, unknown>) => {
    const responsibility = (item.responsibility as { text: string; bold?: boolean; href?: string }[][])
      .map(group => group.map(r => r.text).join(""))
    return {
      role: item.role as string,
      year: item.year as string,
      company: item.company as string,
      type: item.type as string,
      location: item.location as string,
      responsibility,
      techstacks: item.techstacks as string[],
    }
  })
}

function parseResearchArrayLiteral(literal: string): Research[] {
  const fn = new Function(`return (${literal})`) as () => unknown
  const data = fn()
  if (!Array.isArray(data)) throw new Error("research is not an array")
  return data as Research[]
}

export async function fetchPortfolioProjects({
  url = process.env.PORTFOLIO_CONSTANTS_URL ?? DEFAULT_PORTFOLIO_CONSTANTS_URL,
  signal,
}: {
  url?: string
  signal?: AbortSignal
} = {}): Promise<PortfolioProject[]> {
  const res = await fetch(url, { redirect: "follow", signal })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  const js = await res.text()
  const literal = extractArrayLiteral(js, "export const projects")
  return parseProjectsArrayLiteral(literal)
}

export async function fetchExperiences({
  url = process.env.PORTFOLIO_CONSTANTS_URL ?? DEFAULT_PORTFOLIO_CONSTANTS_URL,
  signal,
}: {
  url?: string
  signal?: AbortSignal
} = {}): Promise<Experience[]> {
  const res = await fetch(url, { redirect: "follow", signal })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  const js = await res.text()
  const literal = extractArrayLiteral(js, "export const experiences")
  return parseExperiencesArrayLiteral(literal)
}

export async function fetchResearch({
  url = process.env.PORTFOLIO_CONSTANTS_URL ?? DEFAULT_PORTFOLIO_CONSTANTS_URL,
  signal,
}: {
  url?: string
  signal?: AbortSignal
} = {}): Promise<Research[]> {
  const res = await fetch(url, { redirect: "follow", signal })
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
  const js = await res.text()
  const literal = extractArrayLiteral(js, "export const research")
  return parseResearchArrayLiteral(literal)
}
