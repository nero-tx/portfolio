import { Server, Sparkles, Workflow } from "lucide-react";

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
    title: "Waylink",
    category: "Full-Stack SaaS",
    description:
      "A complete marketplace connecting customers with transport and experience providers through one unified platform.",
    image: "/images/projects/waylink/hero.webp",
    slug: "waylink",
    bgImage: "/images/projects/waylink/bg.webp",
  },
  {
    number: "02",
    year: "2026",
    title: "Store App",
    category: "E-Commerce",
    description:
      "An Arabic-first e-commerce experience built around smooth browsing, product variants, and automated store operations.",
    image: "/images/projects/store-app/hero.webp",
    slug: "store-app",
    bgImage: "/images/projects/store-app/bg.webp",
  },
  {
    number: "03",
    year: "2026",
    title: "File Operations",
    category: "Developer Tooling",
    description:
      "A dependency-free Node.js toolkit designed to organize, analyze, deduplicate, clean, and archive files safely.",
    image: "/images/projects/file-operations/hero.webp",
    slug: "file-operations",
    bgImage: "/images/projects/file-operations/bg.webp",
  },
  {
    number: "04",
    year: "2026",
    title: "Wandria Travel",
    category: "Travel Platform",
    description:
      "A travel platform combining trip discovery, bookings, AI-powered itinerary generation, and administrative tools.",
    image: "/images/projects/wandria/hero.webp",
    slug: "wandria",
    bgImage: "/images/projects/wandria/bg.webp",
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

export const mainProjects: Project[] = [
  {
    number: "01",
    slug: "waylink",
    title: "Waylink",
    category: "Full-Stack SaaS",
    year: "2026",
    description:
      "A full-stack SaaS marketplace connecting customers with transport and experience providers, with dedicated customer, provider, and admin experiences built on a single Next.js application.",
    hasVisual: true,
    heroImage: "/images/projects/waylink/hero.webp",
    stack: [
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Neon",
      "Drizzle ORM",
      "Better Auth",
      "Inngest",
      "Tailwind CSS",
      "shadcn/ui",
      "React Hook Form",
      "Zod",
      "Recharts",
    ],
    role: "Full-Stack Developer",
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/neuro-tx/waylink",
      },
    ],
    problem: {
      kicker: "THE CHALLENGE",
      statement:
        "Build a marketplace that could serve customers, service providers, and internal administrators without fragmenting the product into separate applications.",
      context:
        "The platform needed to support provider-managed listings, customer discovery and booking, subscriptions, and platform-wide administration while keeping authentication, data access, UI, and business logic consistent across three distinct experiences.",
    },
    fix: {
      kicker: "THE APPROACH",
      approach: [
        "Built the platform as a single Next.js application with role-gated customer, provider, and admin experiences.",
        "Established a shared design system and data layer across all three experiences.",
        "Created provider workflows for managing transport and experience products.",
        "Built a public storefront where customers can discover and book services.",
        "Added internal administration for providers, listings, subscriptions, and platform-wide financial visibility.",
      ],
    },
    media: [
      {
        type: "image",
        src: "/images/projects/waylink/preview1.webp",
        alt: "Waylink main experience page showing available transport and travel services",
        caption: "Main experience page",
      },
      {
        type: "image",
        src: "/images/projects/waylink/preview2.webp",
        alt: "Waylink user booking page showing booking details and selected service",
        caption: "Booking page for user profile",
      },
      {
        type: "image",
        src: "/images/projects/waylink/preview3.webp",
        alt: "Waylink wishlist section inside the user's profile",
        caption: "Wishlist in user profile",
      },
      {
        type: "image",
        src: "/images/projects/waylink/preview4.webp",
        alt: "Waylink provider layout showing a customer service review",
        caption: "Service review in provider layout",
      },
      {
        type: "image",
        src: "/images/projects/waylink/preview5.webp",
        alt: "Waylink provider bookings page with booking tracking information",
        caption: "Provider bookings page tracking",
      },
      {
        type: "image",
        src: "/images/projects/waylink/preview6.webp",
        alt: "Waylink provider analytics dashboard showing service performance and booking insights",
        caption: "Analysis page for the provider",
      },
    ],
    results: [
      "Unified three distinct product experiences inside a single application and codebase.",
      "Enabled providers to independently manage and publish their own services.",
      "Created a complete marketplace flow from service discovery through booking.",
      "Centralized platform management across providers, listings, subscriptions, and financial analytics.",
    ],
    nextSlug: "store-app",
  },
  {
    number: "02",
    slug: "store-app",
    title: "Store App",
    category: "E-Commerce",
    year: "2026",
    description:
      "A modern Arabic e-commerce platform built for a local shop, combining an RTL-first shopping experience with automated product and discount management.",

    hasVisual: true,
    heroImage: "/images/projects/store-app/hero.webp",
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion" ,"MongoDB" ,"Mongoose"],
    role: "Full-Stack Developer",
    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/neuro-tx/waylink",
      },
      {
        label: " Live Demo",
        url: "https://store-app-seven-eta.vercel.app/",
      },
    ],
    problem: {
      kicker: "THE CHALLENGE",
      statement:
        "Create a modern Arabic shopping experience while reducing the manual work required to keep products, variants, discounts, and promotions up to date.",
      context:
        "The shop needed an e-commerce interface that felt natural for Arabic-speaking customers, supported different product capacities, worked smoothly across devices, and could keep promotional product data synchronized without relying entirely on manual updates.",
    },
    fix: {
      kicker: "THE APPROACH",
      approach: [
        "Built the storefront with Next.js and a responsive Tailwind CSS interface optimized for Arabic RTL layouts.",
        "Created dynamic product collections with high-quality imagery and interactive hover experiences across desktop and mobile.",
        "Added support for multiple product capacities and variants with clear customer-facing labels.",
        "Automated the synchronization of discounted products through scheduled backend processes.",
        "Added monitored background jobs with real-time logging and fail-safe verification to protect product data.",
        "Designed the application for modern cloud deployment and scalable operation.",
      ],
    },
    media: [
      {
        type: "image",
        alt: "Store App Hero Image",
        src: "/images/projects/store-app/hero.webp",
        caption: "Store App Hero Image",
      },
      {
        type: "image",
        alt: "Store App Preview",
        src: "/images/projects/store-app/preview-1.png",
        caption: "Admin Dashboard Preview",
      },
      {
        type: "image",
        alt: "Store App Preview",
        src: "/images/projects/store-app/preview-2.png",
        caption: "Admin Product Management Controls",
      },
      {
        type: "image",
        alt: "Store App Preview",
        src: "/images/projects/store-app/preview-3.png",
        caption: "Service That Store Provides to customers",
      },
      {
        type: "image",
        alt: "Store App Preview",
        src: "/images/projects/store-app/preview-4.png",
        caption: "Main Products Page for Customers",
      },
    ],
    results: [
      "Delivered a complete RTL-first e-commerce experience for Arabic-speaking customers.",
      "Reduced repetitive product and discount management through automated synchronization.",
      "Created a responsive shopping interface optimized for both desktop and mobile.",
      "Established monitored and verified background processes for more reliable product operations.",
    ],
    nextSlug: "file-operations",
    prevSlug: "waylink",
  },
  {
    number: "03",
    slug: "file-operations",
    title: "File Operations",
    category: "Developer Tooling",
    year: "2026",
    description:
      "A production-ready TypeScript and Node.js toolkit for intelligent file management, combining content-based deduplication, automated organization, cleanup, large-file analysis, and archival into a dependency-free CLI-oriented library.",

    hasVisual: false,
    heroImage: "",

    stack: ["TypeScript", "Node.js", "File System API", "Crypto API"],

    role: "Backend Developer",

    links: [
      {
        label: "GitHub Repo",
        url: "https://github.com/neuro-tx/file-aranger",
      },
    ],

    problem: {
      kicker: "THE CHALLENGE",
      statement:
        "Build a reliable file-management toolkit capable of performing potentially destructive filesystem operations while remaining safe, predictable, and efficient on large directory structures.",
      context:
        "Common file-management tasks such as finding duplicates, cleaning empty files, organizing directories, identifying large files, and archiving old data are repetitive and error-prone when handled manually. The challenge was to combine these operations into a reusable, type-safe system without relying on external dependencies.",
    },

    fix: {
      kicker: "THE APPROACH",
      approach: [
        "Built the toolkit entirely with TypeScript and Node.js built-in modules, keeping the project dependency-free.",
        "Implemented SHA-256 content hashing with size-based pre-filtering to efficiently identify duplicate files without loading entire files into memory.",
        "Created an extensible file-organization system with configurable extension-based rules and automatic fallback handling.",
        "Added cleanup and analysis operations for zero-byte files and files exceeding configurable size thresholds.",
        "Implemented age-based archival using file modification times and atomic file moves where possible.",
        "Designed dry-run modes, input validation, isolated errors, callbacks, and detailed operation statistics to make destructive operations safer.",
        "Optimized filesystem processing through streaming, single-pass scans, minimal I/O, and pre-created destination directories.",
      ],
    },

    media: [],

    codePreview: {
      kind: "code",
      code: {
        language: "typescript",
        snippet: `
async function cleanupDirectory(path: string) {
  const large = await findLargeFiles(path, 1000, 20);

  console.log(\`Found \${large.matched} files over 1GB\`);

  const empty = await findEmptyFiles(path, {
    deleteEmpty: true,
  });

  console.log(\`Removed \${empty.deleted} empty files\`);

  const duplicates = await dedupe(path, {
    strategy: "newest",
    dryRun: true,
  });

  console.log(\`Would remove \${duplicates.filesDeleted} duplicates\`);

  const archived = await archive(path, {
    archivePath: \`\${path}/archive\`,
    durationDays: 180,
    dryRun: true,
  });

  console.log(\`Would archive \${archived.archived} old files\`);

  const organized = await arrange(path, {
    dryRun: true,
    log: true,
  });

  console.log(\`Would organize \${organized.moved} files\`);
}

await cleanupDirectory("/messy/folder");`,
      },
    },

    results: [
      "Created a reusable dependency-free toolkit for advanced filesystem operations.",
      "Implemented content-based duplicate detection using SHA-256 hashing.",
      "Added safe automation for organization, cleanup, analysis, and archival workflows.",
      "Designed operations with dry runs, validation, error isolation, and detailed reporting.",
      "Kept large-file processing memory-efficient through streaming and metadata-based filtering.",
    ],

    nextSlug: "wandria",
    prevSlug: "store-app",
  },
  {
    number: "04",
    slug: "wandria",
    title: "Wandria Travel",
    category: "Full-Stack Web App",
    year: "2026",
    description:
      "A full-stack travel and trip management platform that combines AI-powered itinerary generation, trip discovery, booking workflows, and role-based administration into a complete travel experience.",

    hasVisual: false,
    heroImage: "/images/projects/wandria/hero.webp",

    stack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "React Router",
      "Axios",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "JWT",
      "Unsplash API",
      "ImageKit",
      "Google Generative AI",
    ],

    role: "Full-Stack Developer",

    links: [
      {
        label: "Live Demo",
        url: "https://wandira-travel.vercel.app/",
      },
      {
        label: "GitHub Repo",
        url: "https://github.com/neuro-tx/wandira-travel",
      },
    ],

    problem: {
      kicker: "THE CHALLENGE",
      statement:
        "Create a complete travel platform that makes discovering and booking trips simple for users while giving administrators the tools needed to manage the underlying travel operations.",
      context:
        "The application needed to bring together trip discovery, booking management, authentication, role-based access, media handling, and administrative workflows while maintaining a responsive and engaging experience. It also needed to go beyond static trip listings by helping users generate personalized itineraries with AI.",
    },

    fix: {
      kicker: "THE APPROACH",
      approach: [
        "Built a responsive React frontend with Vite, Tailwind CSS, and React Router for a fast and interactive travel experience.",
        "Developed a Node.js and Express backend with MongoDB and Mongoose to manage users, trips, and bookings.",
        "Implemented JWT-based authentication with protected routes and separate user and admin access.",
        "Created trip discovery and booking workflows allowing users to explore offers, book trips, track booking status, and cancel bookings.",
        "Built an administrative dashboard for managing trips, users, bookings, and booking status analytics.",
        "Integrated generative AI to create personalized travel itineraries from user requirements.",
        "Integrated Unsplash for travel imagery and ImageKit for image upload and media management.",
      ],
    },

    results: [
      "Delivered a complete travel discovery and booking platform with separate user and admin experiences.",
      "Added AI-powered itinerary generation to make trip planning more personalized.",
      "Implemented secure JWT authentication and role-based route protection.",
      "Created administrative workflows for managing trips, users, bookings, and operational analytics.",
      "Connected multiple external services for AI generation, travel imagery, and media management.",
    ],

    nextSlug: "foxiz-news",
    prevSlug: "file-operations",
  },
  {
    number: "05",
    slug: "foxiz-news",
    title: "Foxiz News",
    category: "Content Platform",
    year: "2026",
    description:
      "A modern category-driven news platform built with Next.js, combining dynamic API routes, ISR, SEO-focused metadata, and reusable responsive components to deliver fast and continuously refreshed news content.",

    hasVisual: true,
    heroImage: "/images/projects/foxiz-news/hero.webp",

    stack: [
      "Next.js 14",
      "TypeScript",
      "Tailwind CSS",
      "App Router",
      "Route Handlers",
      "ISR",
      "Metadata API",
      "NewsAPI",
      "NewsData.io",
    ],

    role: "Full-Stack Developer",

    links: [
      {
        label: "GitHub",
        url: "https://github.com/neuro-tx/foxiz-news",
      },
    ],

    problem: {
      kicker: "THE CHALLENGE",
      statement:
        "Build a fast and SEO-friendly news platform capable of serving frequently changing content without sacrificing page performance or creating duplicated page implementations for every category.",
      context:
        "News content needs to stay fresh while remaining fast to access and easy for search engines to understand. The platform also needed a flexible content structure where new categories could be introduced without building separate pages and API logic for each one.",
    },

    fix: {
      kicker: "THE APPROACH",
      approach: [
        "Built the platform with Next.js App Router and dynamic category routes to support reusable news experiences across multiple content categories.",
        "Used Incremental Static Regeneration to balance fresh news content with the performance benefits of statically generated pages.",
        "Created dynamic Route Handlers to fetch and serve category-specific news data through a consistent API layer.",
        "Implemented dynamic SEO metadata including page titles, descriptions, and Open Graph images for category and content pages.",
        "Built reusable responsive components for news cards, navigation, layouts, and other content-focused UI elements.",
        "Added route-level loading states to provide a smoother experience while navigating between dynamically generated content.",
        "Designed the interface with Tailwind CSS, including built-in dark mode and flexible layout customization.",
      ],
    },

    media: [
      {
        type: "image",
        alt: "Foxiz News Snapshots",
        src: "/images/projects/foxiz-news/preview-2.png",
        caption: "Foxiz News Hero Section with Category Navigation",
      },
      {
        type: "image",
        alt: "Foxiz News Snapshots",
        src: "/images/projects/foxiz-news/preview-1.png",
        caption: "Foxiz News Main Page",
      },
    ],

    results: [
      "Created a reusable news architecture supporting multiple categories through dynamic routing.",
      "Combined ISR with external news APIs to deliver fresh content while maintaining fast page delivery.",
      "Implemented dynamic SEO metadata to improve how news pages are presented to search engines and social platforms.",
      "Built a responsive and customizable content interface with dark-mode support.",
      "Established reusable API and UI patterns that make the platform easy to extend with additional categories.",
    ],

    prevSlug: "wandria",
    nextSlug: "waylink",
  },
];
