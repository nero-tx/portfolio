import type { Metadata } from "next";
import WorkPage from "@/components/WorkPage";

export const metadata: Metadata = {
  title: "Work | Tarek Fawzy",
  description:
    "Explore selected projects and digital experiences crafted by Tarek Fawzy, a full-stack developer focused on modern web technologies.",
  openGraph: {
    title: "Work | Tarek Fawzy",
    description:
      "Explore selected projects and digital experiences crafted by Tarek Fawzy.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Work | Tarek Fawzy",
    description:
      "Explore selected projects and digital experiences crafted by Tarek Fawzy.",
  },
};

const page = () => {
  return <WorkPage />;
};

export default page;
