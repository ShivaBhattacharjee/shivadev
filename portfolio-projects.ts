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

export const DEFAULT_PORTFOLIO_CONSTANTS_URL = _config.portfolioProjectsUrl

function extractProjectsArrayLiteral(js: string): string {
  const marker = "export const projects"
  const mi = js.indexOf(marker)
  if (mi === -1) throw new Error(`Could not find ${marker} in remote file`)

  const start = js.indexOf("[", mi)
  if (start === -1) throw new Error("Could not find projects array opening [")

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

  throw new Error("Unterminated projects array (missing closing ])")
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
  const literal = extractProjectsArrayLiteral(js)
  return parseProjectsArrayLiteral(literal)
}
