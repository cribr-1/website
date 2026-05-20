import "./globals.css";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Cribr | Property Intelligence & Transparency",
  description: "Unbiased real estate data and technical research for home buyers and researchers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen flex flex-col bg-background text-foreground font-sans">
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between">
            {/* Left: Logo & Tagline */}
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-gray-900">Cribr</span>
              </Link>
              <span className="hidden lg:inline-block px-2 py-0.5 text-[10px] font-bold text-gray-400 border border-gray-100 rounded-md uppercase tracking-widest">
                AI Property Intelligence
              </span>
            </div>

            {/* Center: Navigation */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-gray-500">
              <Link href="/" className="transition-colors hover:text-primary">Search</Link>
              <Link href="/localities" className="transition-colors hover:text-primary">Areas</Link>
              <Link href="/builders" className="transition-colors hover:text-primary">Builders</Link>
              <Link href="/compare" className="transition-colors hover:text-primary">Compare</Link>
            </nav>

            {/* Right: Actions */}
            <div className="flex items-center space-x-6">
              <Link href="/saved" className="text-sm font-semibold text-gray-500 hover:text-primary hidden sm:block">Saved</Link>
              <button className="text-sm font-bold text-gray-900 px-5 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
                Sign In
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t bg-gray-50/50 py-20">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-12">
              <div className="col-span-2 space-y-4">
                <span className="text-xl font-bold">Cribr</span>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
                  The property research platform for smart decision making. Powered by AI intelligence.
                </p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Platform</h4>
                <ul className="mt-6 space-y-3 text-sm text-gray-500 font-medium">
                  <li><Link href="/" className="hover:text-primary">Discovery</Link></li>
                  <li><Link href="/compare" className="hover:text-primary">Compare</Link></li>
                  <li><Link href="/localities" className="hover:text-primary">Areas</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Builders</h4>
                <ul className="mt-6 space-y-3 text-sm text-gray-500 font-medium">
                  <li><Link href="/builders" className="hover:text-primary">All Builders</Link></li>
                  <li><Link href="/verification" className="hover:text-primary">Verification</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-900">Company</h4>
                <ul className="mt-6 space-y-3 text-sm text-gray-500 font-medium">
                  <li><Link href="/about" className="hover:text-primary">About</Link></li>
                  <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-20 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
              <span>© 2026 Cribr Intelligence</span>
              <div className="flex items-center space-x-6">
                <Link href="#" className="hover:text-gray-900 transition-colors">Twitter</Link>
                <Link href="#" className="hover:text-gray-900 transition-colors">LinkedIn</Link>
              </div>
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
