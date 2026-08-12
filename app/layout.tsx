import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import TransitionProvider from "@/components/TransitionProvider";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "nero-tx porto",
  description: "Just give me the tonue and I will make it happen.",

  authors: [{ name: "tarek fawzy" }],
  category: "portfolio",
  creator: "tarek fawzy",
  publisher: "tarek fawzy",
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
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col relative">
        <TransitionProvider>
          <SmoothScroll>
            <Header />

            {children}
          </SmoothScroll>
        </TransitionProvider>
      </body>
    </html>
  );
}
