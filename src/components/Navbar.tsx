"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const linkCls = (href: string) =>
    `relative px-2 py-1 transition
     ${pathname === href ? "text-[#6ae2ff]" : "text-zinc-200"}
     hover:text-[#ff71ff]`;

  return (
    <header className="sticky top-0 z-50 bg-transparent">
      {/* pasek z delikatnym szkłem i neonową obwódką */}
      <nav
        className="
          w-full flex items-center justify-between
          px-6 py-3
          backdrop-blur-xl
          bg-[rgba(18,18,18,0.65)]
          border-b border-[#2a2a2a]
          shadow-[0_0_24px_rgba(111,0,255,0.15)]
        "
      >
        {/* Logo */}
        <div className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="Cloud7 Logo"
            width={48}
            height={48}
            className="rounded-lg"
            priority
          />
          <span
            className="
              text-lg sm:text-xl font-bold tracking-wide
              text-white
            "
          >
            Cloud
            <span
              className="
                bg-gradient-to-r from-[#6ae2ff] via-[#56a5ff] to-[#ff71ff]
                bg-clip-text text-transparent ml-0.5
                drop-shadow-[0_0_10px_rgba(106,226,255,0.35)]
              "
            >
              7
            </span>
          </span>
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li className="hover-underline-neon">
            <Link href="/" className={linkCls("/")}>Strona główna</Link>
          </li>
          <li className="hover-underline-neon">
            <Link href="/ai_search" className={linkCls("/ai_search")}>Wyszukiwarka</Link>
          </li>
          <li className="hover-underline-neon">
            <Link href="/dashboard" className={linkCls("/dashboard")}>Dashboard</Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          aria-label="Otwórz menu"
          className="md:hidden flex flex-col justify-center gap-1.5 p-2 rounded-md
                     border border-[#2a2a2a] bg-[#141414]/60
                     hover:border-[#414141] hover:shadow-[0_0_12px_rgba(106,226,255,0.25)]
                     transition"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className={`w-6 h-0.5 bg-zinc-200 transition ${menuOpen ? "rotate-45 translate-y-1" : ""}`} />
          <span className={`w-6 h-0.5 bg-zinc-200 transition ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`w-6 h-0.5 bg-zinc-200 transition ${menuOpen ? "-rotate-45 -translate-y-1" : ""}`} />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`
          md:hidden overflow-hidden transition-[max-height,opacity]
          ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}
          bg-[rgba(18,18,18,0.85)] backdrop-blur-xl border-b border-[#2a2a2a]
        `}
      >
        <ul className="flex flex-col gap-3 px-6 py-4 text-sm">
          <li>
            <Link href="/" className={linkCls("/")} onClick={() => setMenuOpen(false)}>
              Strona główna
            </Link>
          </li>
          <li>
            <Link href="/ai_search" className={linkCls("/ai_search")} onClick={() => setMenuOpen(false)}>
              Wyszukiwarka
            </Link>
          </li>
          <li>
            <Link href="/dashboard" className={linkCls("/dashboard")} onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
