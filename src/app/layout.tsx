import type { Metadata } from "next";
import { IBM_Plex_Mono, Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ClinicStoreProvider } from "@/lib/clinic-store";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jakarta",
  display: "swap",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal"],
  variable: "--font-newsreader",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-ibm-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: {
    default: "Aurel Dental & Aesthetics | Restorative Dentistry in Bangsar",
    template: "%s | Aurel Dental & Aesthetics",
  },
  description:
    "Unhurried restorative dentistry, handcrafted porcelain design, and conservative facial aesthetics in Bangsar, Kuala Lumpur.",
};

const THEME_INIT_SCRIPT = `(function(){try{var k="aurel_theme_v1";var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.setAttribute("data-theme",t);document.documentElement.style.colorScheme=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${newsreader.variable} ${ibmMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-full flex flex-col bg-[var(--ground)] text-[var(--ink-12)]">
        <a
          href="#main-content"
          className="visually-hidden fixed left-4 top-4 z-[200] rounded-[var(--radius-control)] bg-[var(--primary-bg)] px-4 py-2 text-[13px] font-medium text-[var(--primary-fg)] shadow-[var(--shadow-modal)]"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ClinicStoreProvider>
            <Navbar />
            <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </main>
            <Footer />
          </ClinicStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
