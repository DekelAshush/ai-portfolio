"use client";

import Image from "next/image";
import {
  Clock,
  Code2,
  ExternalLink,
  Globe,
  Lock,
  Sparkles,
} from "lucide-react";
import type { Project } from "@/types/project";
import { resolveVideoUrl } from "@/lib/resolveVideoUrl";
import { PROJECT_ICONS } from "./projectIcons";

interface ProjectCardProps {
  project: Project;
}

/** LinkedIn logo — `Linkedin` in lucide-react is deprecated (brand icons). */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function ProjectCard({ project }: ProjectCardProps) {
  const ProjectIcon = PROJECT_ICONS[project.icon];

  const videoPlaybackUrl = resolveVideoUrl(project.videoSrc);
  const liveDemoUrlResolved = project.liveDemoUrl
    ? resolveVideoUrl(project.liveDemoUrl)
    : undefined;

  const hasVideo =
    project.videoSrc != null &&
    project.videoSrc !== "" &&
    project.videoSrc !== "NA";

  return (
    <article className="group relative overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/40 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.15)]">
      {/* Video container */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
        {project.previewImage ? (
          <Image
            src={project.previewImage}
            alt=""
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 640px"
          />
        ) : hasVideo && videoPlaybackUrl ? (
          <>
            <video
              src={videoPlaybackUrl}
              muted
              loop
              playsInline
              autoPlay
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLVideoElement;
                target.style.display = "none";
                const fallback = target.nextElementSibling;
                if (fallback) (fallback as HTMLElement).style.display = "flex";
              }}
            />
            <div
              className="absolute inset-0 hidden items-center justify-center bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900"
              style={{ display: "none" }}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-600/50 bg-zinc-800/50">
                <span className="text-2xl font-bold text-zinc-500">▶</span>
              </div>
            </div>
          </>
        ) : hasVideo && !project.previewImage ? (
          <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-zinc-600/50 bg-zinc-800/50">
              <span className="text-2xl font-bold text-zinc-500">▶</span>
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 p-5">
        <div>
          <h3 className="flex items-center gap-3 text-lg font-semibold text-zinc-50">
            {project.iconImage ? (
              <Image
                src={project.iconImage}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 object-contain"
                aria-hidden
              />
            ) : (
              <ProjectIcon
                className="h-12 w-12 shrink-0 text-emerald-400"
                aria-hidden
              />
            )}
            {project.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
            {project.description}
          </p>
        </div>

        {/* Tech badges */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-md border border-zinc-700/60 bg-zinc-800/40 px-2 py-0.5 text-xs font-medium text-zinc-300"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 pt-1">
          {project.projectUrl && (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 transition-all hover:border-sky-500/60 hover:bg-sky-500/20"
            >
              <Globe className="h-3.5 w-3.5 shrink-0" />
              Website
            </a>
          )}
          {project.betaUrl && (
            <a
              href={project.betaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition-all hover:border-amber-500/60 hover:bg-amber-500/20"
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              Join Beta
            </a>
          )}
          {liveDemoUrlResolved && !project.liveDemoComingSoon && (
            <a
              href={liveDemoUrlResolved}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-400 transition-all hover:border-emerald-500/60 hover:bg-emerald-500/20"
            >
              <ExternalLink className="h-3.5 w-3.5 shrink-0" />
              Live Demo
            </a>
          )}
          {project.liveDemoComingSoon && !project.liveDemoUrl && (
            <span
              className="inline-flex cursor-default items-center gap-1.5 rounded-lg border border-dashed border-emerald-500/25 bg-emerald-500/5 px-3 py-1.5 text-xs font-medium text-emerald-500/80"
              title="Not deployed yet"
            >
              <Clock className="h-3.5 w-3.5 shrink-0" />
              Live demo — coming soon
            </span>
          )}
          {project.githubUrl && !project.githubPrivate && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-600/60 bg-zinc-800/40 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-zinc-500 hover:bg-zinc-700/40"
            >
              <Code2 className="h-3.5 w-3.5 shrink-0" />
              GitHub Repo
            </a>
          )}
          {project.githubPrivate && (
            <span
              className="inline-flex cursor-default items-center gap-1.5 rounded-lg border border-dashed border-zinc-600/50 bg-zinc-900/40 px-3 py-1.5 text-xs font-medium text-zinc-500"
              title="Source code is not public"
            >
              <Lock className="h-3.5 w-3.5 shrink-0" />
              Private repository
            </span>
          )}
          {project.linkedinUrl && (
            <a
              href={project.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#0A66C2]/35 bg-[#0A66C2]/10 px-3 py-1.5 text-xs font-medium text-[#70b7ff] transition-all hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/20"
            >
              <LinkedInIcon className="h-3.5 w-3.5 shrink-0" />
              LinkedIn
            </a>
          )}
        </div>
        {project.productStage && (
          <p className="text-xs leading-relaxed text-zinc-500">
            {project.productStage === "beta"
              ? "The product is in beta."
              : `Stage: ${project.productStage}.`}
          </p>
        )}
      </div>
    </article>
  );
}
