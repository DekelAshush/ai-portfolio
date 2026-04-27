import { ProjectsSection } from "@/app/_components/ProjectsSection";
import { SiteFooter } from "@/app/_components/SiteFooter";
import { AIChatDrawer } from "@/app/_components/AIChatDrawer";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 antialiased">
      {/* Hero section */}
      <header className="border-b border-zinc-800/50 px-6 py-20 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Hi, I&apos;m{" "}
            <span className="bg-linear-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Dekel Ashush
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-zinc-400">
            Computer Science graduate and AI engineer—full-stack and generative AI
            (LLMs, RAG). Building end-to-end apps with React, Next.js, and FastAPI.
          </p>
          <p className="mt-3 max-w-2xl text-sm text-zinc-500">
            Legally authorized to work in the U.S. (J-2, EAD).
          </p>
        </div>
      </header>

      <ProjectsSection />
      <SiteFooter />
      <AIChatDrawer />
    </div>
  );
}
