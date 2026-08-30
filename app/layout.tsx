import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import TransitionProvider from "@/components/TransitionProvider";
import Header from "@/components/Header";
import CustomCursor from "@/components/CustomCursor";
import { AudioProvider } from "@/context/AudioProvider";

export const metadata: Metadata = {
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className="w-full overflow-x-hidden flex flex-col relative">
        <AudioProvider>
          <CustomCursor />

          <TransitionProvider>
            <SmoothScroll>
              <Header />

              {children}
            </SmoothScroll>
          </TransitionProvider>
        </AudioProvider>
      </body>
    </html>
  );
}
