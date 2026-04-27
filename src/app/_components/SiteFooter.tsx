import { Github } from "lucide-react";

const EMAIL = "dekelasis@gmail.com";
const GITHUB_URL = "https://github.com/DekelAshush";
const LINKEDIN_URL = "https://www.linkedin.com/in/dekel-ashush/";

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

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950 px-6 py-16 sm:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-xl text-center">
          <a
            href={`mailto:${EMAIL}?subject=Hello%20from%20your%20portfolio`}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3 text-sm font-medium text-emerald-300 shadow-sm transition-colors hover:border-emerald-500/70 hover:bg-emerald-500/15"
          >
            Send me an email
          </a>
          <p className="mt-3 font-mono text-xs text-zinc-500">{EMAIL}</p>

          <h2 className="mt-12 text-2xl font-semibold tracking-tight text-zinc-50">
            Contact
          </h2>
          <p className="mt-4 text-zinc-400">
            I build full-stack software that combines clean user experiences,
            practical AI, scalable backend systems, and cybersecurity-minded
            engineering.
          </p>
          <p className="mt-3 text-zinc-300">
            Open to software engineering, full-stack development, AI, and
            cybersecurity opportunities.
          </p>

          <div className="mt-10 flex items-center justify-center gap-6">
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-zinc-400 transition-colors hover:text-emerald-400"
            >
              <Github className="h-8 w-8" strokeWidth={1.75} />
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-zinc-400 transition-colors hover:text-emerald-400"
            >
              <LinkedInIcon className="h-8 w-8" />
            </a>
          </div>

          <p className="mt-12 text-xs text-zinc-600">
          © {year} Dekel Ashush · Full-stack portfolio built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
