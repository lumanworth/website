import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Manrope } from "next/font/google";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { OG_BASE, TAGLINE } from "@/lib/meta";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "400", "500"],
  display: "swap",
  variable: "--font-manrope",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-mono",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lumanworth.com"),
  title: { default: "Lumanworth", template: "%s, Lumanworth" },
  description:
    "A Perth software company. We turn the parts of a business that run on spreadsheets, paper and memory into systems people use, then hand them over to you.",
  openGraph: {
    ...OG_BASE,
    title: "Lumanworth",
    description: TAGLINE,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#1E2A1C" },
    { media: "(prefers-color-scheme: light)", color: "#F0E8D5" },
  ],
};

/* Theme before paint: a saved choice, else Perth daylight. Runs inline so there is no flash. The js class lets content rise into place; without script it is simply there. */
const themeScript = `(function(){document.documentElement.classList.add("js");try{var t=localStorage.getItem("lw-theme");if(t!=="light"&&t!=="dark"){var h=+new Intl.DateTimeFormat("en-AU",{timeZone:"Australia/Perth",hour:"numeric",hour12:false}).format(new Date());t=(h>=6&&h<18)?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" data-theme="dark" className={`${manrope.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Nav />
        {children}
        <Footer />
        <Reveal />
      </body>
    </html>
  );
}
