"use client";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#1e1e1e] border-b border-[#333] text-white">
      <nav className="w-full flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="Cloud7 Logo" width={40} height={40} />
          <span className="text-xl font-bold">
            Cloud<span className="text-blue-600">7</span>
          </span>
        </div>

        {/* Menu desktop */}
        <ul className="hidden md:flex gap-6 text-sm text-white">
          <li>
            <a href="/" className="hover:text-blue-500 transition">Strona główna</a>
          </li>
          <li>
            <a href="/ai_search" className="hover:text-blue-500 transition">Wyszukiwarka</a>
          </li>
          <li>
            <a href="/dashboard" className="hover:text-blue-500 transition">Dashboard</a>
          </li>
        </ul>

        {/* Hamburger */}
        <button className="md:hidden flex flex-col gap-1" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden px-6 py-4 bg-[#1e1e1e] border-t border-[#333]">
          <ul className="flex flex-col gap-4 text-white">
            <li>
              <a href="/" className="hover:text-blue-500 transition">Strona główna</a>
            </li>
            <li>
              <a href="/ai_search" className="hover:text-blue-500 transition">Wyszukiwarka</a>
            </li>
            <li>
              <a href="/dashboard" className="hover:text-blue-500 transition">Dashboard</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
