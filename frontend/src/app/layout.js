import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Cribr - Premium Real Estate Discovery & Analytics",
  description: "Discover, compare, and analyze premium real estate projects in Bangalore.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className="glass" style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          padding: "1rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--glass-border)"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: "bold", background: "linear-gradient(to right, var(--primary), var(--accent))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Cribr
          </div>
          <nav style={{ display: "flex", gap: "2rem" }}>
            <a href="/" style={{ fontWeight: "500" }}>Search</a>
            <a href="/compare" style={{ fontWeight: "500" }}>Compare</a>
            <a href="/admin" style={{ fontWeight: "500" }}>Admin</a>
          </nav>
        </header>
        <main style={{ flex: 1, padding: "2rem" }}>
          {children}
        </main>
        <footer className="glass" style={{
          padding: "2rem",
          textAlign: "center",
          marginTop: "auto",
          borderTop: "1px solid var(--glass-border)",
          color: "var(--muted)"
        }}>
          © 2026 Cribr. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
