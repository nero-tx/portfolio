import localFont from "next/font/local";

export const zentry = localFont({
  src: "./fonts/zentry-regular.woff2",
  variable: "--font-zentry",
  display: "swap",
  preload: true,
});

export const general = localFont({
  src: "./fonts/general.woff2",
  variable: "--font-general",
  display: "swap",
  preload: true,
});

export const robertRegular = localFont({
  src: "./fonts/robert-regular.woff2",
  variable: "--font-robert-regular",
  display: "swap",
  preload: false,
});

export const robertMedium = localFont({
  src: "./fonts/robert-medium.woff2",
  variable: "--font-robert-medium",
  display: "swap",
  preload: false,
});

export const circularWeb = localFont({
  src: "./fonts/circularweb-book.woff2",
  variable: "--font-circular-web",
  display: "swap",
  preload: false,
});
