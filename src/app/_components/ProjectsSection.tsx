import { ProjectCard } from "./ProjectCard";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative border-t border-zinc-800/50 bg-zinc-950 px-6 py-24 sm:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-50 sm:text-4xl">
            Projects
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-400">
            A selection of my work across AI and full-stack development.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
