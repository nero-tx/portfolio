import type { Metadata } from "next";
import WhoAmI from "@/components/WhoAmI";

export const metadata: Metadata = {
  title: "Who I Am — Tarek Fawzy",
  description:
    "From Agriculture College to full-stack systems engineering — the story behind the work.",
};

export default function WhoAmIPage() {
  return <WhoAmI />;
}
