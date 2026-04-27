import type { Project } from "@/types/project";

/** One RAG chunk per project, derived from projects.ts (single source of truth). */
export function formatProjectsForRag(projects: Project[]): string[] {
  return projects.map((p) => {
    const lines: string[] = [
      `## Project: ${p.title}`,
      p.description,
      `Technologies: ${p.technologies.join(", ")}.`,
    ];
    if (p.productStage) lines.push(`Stage: ${p.productStage}.`);
    if (p.projectUrl) lines.push(`Website: ${p.projectUrl}`);
    if (p.githubUrl) lines.push(`GitHub: ${p.githubUrl}${p.githubPrivate ? " (private)" : ""}`);
    if (p.betaUrl) lines.push(`Beta / waitlist: ${p.betaUrl}`);
    if (p.liveDemoComingSoon) lines.push("Live demo: not deployed yet (coming soon).");
    else if (p.liveDemoUrl) lines.push(`Demo / live link context: ${p.liveDemoUrl}`);
    if (p.linkedinUrl) lines.push(`LinkedIn post: ${p.linkedinUrl}`);
    return lines.join("\n");
  });
}
