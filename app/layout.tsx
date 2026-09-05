import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import TransitionProvider from "@/context/TransitionProvider";
import Header from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import { AudioProvider } from "@/context/AudioProvider";
import IntroLoader from "@/components/IntroLoader";
import Footer from "@/components/Footer";
import ScrollReset from "@/components/ScrollReset";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  zentry,
  circularWeb,
  general,
  robertMedium,
  robertRegular,
} from "./fonts";

export const metadata: Metadata = {
  metadataBase: new URL("https://n3ro-tx.vercel.app"),
  title: {
    default: "nero-tx — Tarek Fawzy",
    template: "%s | nero-tx",
  },
  description:
    "Sculpting digital experiences where brutalist aesthetics, real-time motion, and robust backend architecture converge.",
  authors: [{ name: "Tarek Fawzy" }],
  category: "portfolio",
  creator: "Tarek Fawzy",
  publisher: "Tarek Fawzy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "nero-tx — Tarek Fawzy",
    description:
      "Sculpting digital experiences where brutalist aesthetics, real-time motion, and robust backend architecture converge.",
    url: "https://n3ro-tx.vercel.app",
    siteName: "nero-tx",
    images: [
      {
        url: "https://n3ro-tx.vercel.app/images/og-image.png",
        secureUrl: "https://n3ro-tx.vercel.app/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "nero-tx — Tarek Fawzy | Creative Developer & Systems Architect",
        type: "image/png",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nero-tx — Tarek Fawzy",
    description:
      "Sculpting digital experiences where brutalist aesthetics, real-time motion, and robust backend architecture converge.",
    images: ["https://n3ro-tx.vercel.app/images/og-image.png"],
    creator: "@n3rotx",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`antialiased ${zentry.variable} ${circularWeb.variable} ${general.variable} ${robertMedium.variable} ${robertRegular.variable}`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="w-full overflow-x-hidden flex flex-col relative">
        <ScrollReset />
        <IntroLoader />
        <AudioProvider>
          <CustomCursor />
          <TransitionProvider>
            <SmoothScroll>
              <Header />
              {children}
              <Footer />
            </SmoothScroll>
          </TransitionProvider>
        </AudioProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
