import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { cn } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cribr | Property Intelligence & Transparency",
  description: "Unbiased real estate data and technical research for home buyers and researchers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn(geistSans.variable, geistMono.variable, "antialiased")}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold tracking-tight">Cribr</span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full uppercase tracking-widest">AI Intelligence</span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/" className="transition-colors hover:text-primary">Search</Link>
              <Link href="/compare" className="transition-colors hover:text-primary">Compare</Link>
              <Link href="/localities" className="transition-colors hover:text-primary">Areas</Link>
              <Link href="/builders" className="transition-colors hover:text-primary">Builders</Link>
            </nav>

            <div className="flex items-center space-x-4">
              <Link href="/saved" className="text-sm font-medium hover:text-primary hidden sm:block">Saved</Link>
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                Sign In
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t bg-muted/30">
          <div className="container py-12 md:py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <span className="text-xl font-bold">Cribr</span>
                <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                  Premium AI-powered research platform for real estate investors and homeowners.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider">Platform</h4>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/">Discovery</Link></li>
                  <li><Link href="/compare">Comparison</Link></li>
                  <li><Link href="/analytics">Market Intelligence</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-wider">Company</h4>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/about">About Us</Link></li>
                  <li><Link href="/terms">Terms of Service</Link></li>
                  <li><Link href="/privacy">Privacy Policy</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t pt-8 text-center text-xs text-muted-foreground">
              © 2026 Cribr. All rights reserved.
            </div>
          </div>
        </footer>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t flex items-center justify-around px-4 pb-safe">
          <Link href="/" className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-primary">
            <span className="text-[10px]">Home</span>
          </Link>
          <Link href="/compare" className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-primary">
            <span className="text-[10px]">Compare</span>
          </Link>
          <Link href="/saved" className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-primary">
            <span className="text-[10px]">Saved</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center space-y-1 text-muted-foreground hover:text-primary">
            <span className="text-[10px]">Account</span>
          </Link>
        </nav>
      </body>
    </html>
  );
}
