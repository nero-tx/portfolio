export interface ProjectProps {
  number: string;
  year: string;
  title: string;
  category: string;
  description: string;
  image: string;
  slug?: string
}

export interface ServiceProps {
  title: string;
  description: string;
  tags: string[];
}

export const services: ServiceProps[] = [
  {
    title: "Brand Strategy",
    description:
      "Turning ideas into clear products, stronger direction, and better decisions.",
    tags: [
      "Research & Insights",
      "Product Strategy",
      "Brand Strategy",
      "Workshops",
      "Naming & Copywriting",
      "UX Direction",
      "Technical Discovery",
    ],
  },
  {
    title: "Engineering",
    description:
      "Building reliable products and scalable systems from interface to infrastructure.",
    tags: [
      "Frontend",
      "Backend",
      "Full-Stack",
      "APIs",
      "System Architecture",
      "Database Design",
      "Scalable Systems",
      "Integrations",
      "Performance",
      "Cloud",
    ],
  },
  {
    title: "AI",
    description:
      "Adding intelligence to products through AI-powered workflows, automation, and agents.",
    tags: [
      "AI Integration",
      "AI Agents",
      "LLM Workflows",
      "AI APIs",
      "Automation",
      "RAG",
      "Tool Calling",
      "AI Products",
      "Observability",
    ],
  },
  {
    title: "Experiences",
    description:
      "Creating expressive digital experiences through interaction, motion, and visual experimentation.",
    tags: [
      "Creative Development",
      "Motion",
      "Interactions",
      "Animations",
      "Visual Systems",
      "Immersive UI",
      "Prototyping",
    ],
  },
];

export const projects: ProjectProps[] = [
  {
    number: "01",
    year: "2026",
    title: "Nomad",
    category: "Digital Experience",
    description:
      "A cinematic booking experience built around movement, atmosphere, and precision.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=2400&auto=format&fit=crop",
  },
  {
    number: "02",
    year: "2026",
    title: "Obsidian",
    category: "Product Engineering",
    description:
      "A dark, tactile interface where complex systems disappear behind simple interactions.",
    image:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2400&auto=format&fit=crop",
  },
  {
    number: "03",
    year: "2025",
    title: "Arrakis",
    category: "Creative Development",
    description:
      "An immersive digital world inspired by vast landscapes, brutal simplicity, and motion.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=2400&auto=format&fit=crop",
  },
  {
    number: "04",
    year: "2025",
    title: "Eclipse",
    category: "Web Platform",
    description:
      "A high-performance platform designed to feel as alive as the systems running underneath.",
    image:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2400&auto=format&fit=crop",
  },
];
