import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";
import { mainProjects as projects } from "@/utils/main-data";
interface PageProps {
  params: Promise<{ slug: string }>;
}
export function generateStaticParams() {
  return projects
    .filter((project) => Boolean(project.slug))
    .map((project) => ({ slug: project.slug as string }));
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — nero-tx`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.heroImage,
    },
  };
}
export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((project) => project.slug === slug);
  if (!project) notFound();
  return (
    <div className="w-full overflow-x-hidden">
      <div className="container mx-auto">
        <ProjectDetail project={project} />
      </div>
    </div>
  );
}
