import { Server, Sparkles, Workflow, Cpu, Shield } from "lucide-react";

export interface ProjectProps {
  number: string;
  year: string;
  title: string;
  category: string;
  description: string;
  image: string;
  slug?: string;
  bgImage?: string;
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
    bgImage:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?q=80&w=2400&auto=format&fit=crop",
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
    bgImage:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=2400&auto=format&fit=crop",
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
    bgImage:
      "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2400&auto=format&fit=crop",
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
    bgImage:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?q=80&w=2400&auto=format&fit=crop",
  },
];

export const ARCHITECTURE_BRANCHES = [
  {
    code: "NODE_01",
    branch: "BACKEND ENGINEERING",
    role: "Backend Developer",
    summary:
      "Building reliable backend systems with clear business logic, well-structured APIs, and data models that stay maintainable as products grow.",
    specs: [
      "Node.js & TypeScript APIs",
      "PostgreSQL & Drizzle ORM",
      "Authentication & Authorization",
      "Transactions & Business Logic",
    ],
    telemetry: {
      runtime: "Node.js",
      database: "PostgreSQL",
      protocol: "REST / HTTP",
      signal: "RELIABILITY",
    },
    icon: Server,
    color: "#D98C4A",
  },

  {
    code: "NODE_02",
    branch: "DIGITAL EXPERIENCE",
    role: "Frontend Developer",
    summary:
      "Creating interfaces that balance usability with personality, from thoughtful layouts to motion and interactions that make products feel alive.",
    specs: [
      "React & Next.js",
      "Responsive Interface Development",
      "GSAP & Motion",
      "Interactive Web Experiences",
    ],
    telemetry: {
      framework: "Next.js / React",
      styling: "Tailwind CSS",
      motion: "GSAP / Motion",
      signal: "EXPRESSION",
    },
    icon: Sparkles,
    color: "#5FB8C9",
  },

  {
    code: "NODE_03",
    branch: "PRODUCT & CREATIVE THINKING",
    role: "Creative Developer",
    summary:
      "Connecting engineering with product thinking to turn rough ideas into useful, polished experiences — with room for experimentation along the way.",
    specs: [
      "Product-Oriented Development",
      "UI / UX Thinking",
      "Creative Interaction Design",
      "AI-Powered Product Exploration",
    ],
    telemetry: {
      approach: "Product First",
      mindset: "Curious / Practical",
      focus: "Useful Experiences",
      signal: "EXPERIMENTATION",
    },
    icon: Workflow,
    color: "#E8DCC8",
  },
] as const;

export const TECH_TELEMETRY = [
  { name: "TypeScript", cat: "CORE", level: "STRONG" },
  { name: "Next.js / React", cat: "FRONTEND", level: "STRONG" },
  { name: "Node.js", cat: "BACKEND", level: "STRONG" },
  { name: "PostgreSQL / Drizzle", cat: "DATABASE", level: "STRONG" },
  { name: "GSAP / Motion", cat: "MOTION", level: "STRONG" },
  { name: "Tailwind CSS", cat: "UI", level: "STRONG" },
  { name: "REST APIs", cat: "BACKEND", level: "STRONG" },
  { name: "AI / LLMs", cat: "EXPLORING", level: "BUILDING" },
];

interface TerminalLine {
  type: "input" | "output" | "comment";
  text: string;
}

export interface ProjectCodePreview {
  kind: "terminal" | "code";
  terminal?: { prompt: string; lines: TerminalLine[] };
  code?: { language: string; snippet: string };
}

interface ProjectLink {
  label: string;
  url: string;
}

export type ProjectMedia =
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "video";
      src: string;
      poster: string;
      alt: string;
      caption?: string;
    };

export interface Project {
  number: string;
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  hasVisual: boolean;
  heroImage: string;
  stack: string[];
  role?: string;
  links?: ProjectLink[];
  problem: {
    kicker?: string;
    statement: string;
    context?: string;
  };
  fix: {
    kicker?: string;
    approach: string[];
  };
  media?: ProjectMedia[];
  codePreview?: ProjectCodePreview;
  results?: string[];
  nextSlug?: string;
  prevSlug?: string;
}

