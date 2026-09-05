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

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-phi-beige-81.vercel.app"),
  title: "nero-tx",
  description: "Just give me the tonue and I will make it happen.",
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
    title: "nero-tx",
    description: "Just give me the tonue and I will make it happen.",
    siteName: "nero-tx",
    images: [
      {
        url: "public/images/og-image.png",
        width: 1200,
        height: 630,
        alt: "nero-tx — Tarek Fawzy",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nero-tx",
    description: "Just give me the tonue and I will make it happen.",
    images: ["public/images/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="antialiased"
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
