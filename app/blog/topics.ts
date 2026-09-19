export const TOPICS = ["AI", "Claude", "Craft", "Workflow", "Career"] as const
export type Topic = (typeof TOPICS)[number]

// Tagged from each post's subject; add a slug here when publishing a new post
const BY_SLUG: Record<string, Topic[]> = {
  "claude-fable-5-mythos-class-era": ["AI", "Claude"],
  "managed-agents-cloud-infrastructure": ["AI", "Claude"],
  "adaptive-thinking-effort-era": ["AI", "Claude"],
  "2026-year-code-came-alive": ["AI"],
  "antigravity-agentic-coding": ["AI", "Workflow"],
  "gemini-2.5-computer-use": ["AI"],
  "crafting-readable-code": ["Craft"],
  "ai-assisted-workflows": ["AI", "Workflow"],
  "coding-rituals": ["Craft", "Workflow"],
  "testing-for-confidence": ["Craft"],
  "career-playbook": ["Career"],
}

export const topicsFor = (slug: string): Topic[] => BY_SLUG[slug] ?? []

/** "Section heading!" → "s-section-heading", for the post's table of contents anchors */
export const anchorFor = (heading: string) =>
  "s-" +
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
