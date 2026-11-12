import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import CommandPalette from "@/components/CommandPalette";
import ScrollProgress from "@/components/ScrollProgress";
import Footer from "@/components/Footer";
import { profile } from "@/data/resume";

const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const mono = JetBrains_Mono({ variable: "--font-jetbrains", subsets: ["latin"] });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} | Systems & AI Engineer`,
    template: `%s | ${profile.name}`,
  },
  description: profile.tagline,
  keywords: ["Arnav Harshit", "IIT Kanpur", "Software Engineer", "Distributed Systems", "Machine Learning", "Portfolio"],
  authors: [{ name: profile.name, url: profile.socials.github }],
  openGraph: {
    type: "website",
    title: `${profile.name} | Systems & AI Engineer`,
    description: profile.tagline,
    siteName: profile.name,
  },
  twitter: { card: "summary_large_image", title: profile.name, description: profile.tagline },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#06070c" },
    { media: "(prefers-color-scheme: light)", color: "#f5f7fb" },
  ],
};

// Sets the theme before first paint so there's no flash.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${geist.variable} ${mono.variable} noise antialiased`}>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-cyan focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <ScrollProgress />
        <Cursor />
        <Navbar />
        <CommandPalette />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
