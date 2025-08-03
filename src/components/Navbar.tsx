"use client";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="font-mono w-full bg-white shadow-md">
            <nav className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-md">
            {/* Logo */}
            <div className="flex items-center gap-2">
                <Image src="/logo.png" alt="Cloud7 Logo" width={40} height={40} />
                <span className="text-xl font-bold text-gray-800">
                    Cloud<span className="text-blue-600">7</span>
                </span>
            </div>
            {/* Menu desktop */}
            <ul className="hidden md:flex gap-6  text-gray-700">
                <li><a href="/" className="hover:text-blue-600 transition">Strona główna</a></li>
                <li><a href="/ai_search" className="hover:text-blue-600 transition">Wyszukiwarka</a></li>
                <li><a href="/" className="hover:text-blue-600 transition">O nas</a></li>
            </ul>
            {/* Hamburger */}
                    <button className="md:hidden flex flex-col gap-1" onClick={() => setMenuOpen(!menuOpen)}>
                        <span className="w-6 h-0.5 bg-gray-700"></span>
                        <span className="w-6 h-0.5 bg-gray-700"></span>
                        <span className="w-6 h-0.5 bg-gray-700"></span>                                                                       
                    </button>
                          {/* Mobile menu */}
        </nav>
            {menuOpen && (
                <div className="md:hidden bg-white shadow-md px-6 py-4">
                <ul className="flex flex-col gap-4  text-gray-700">
                    <li><a href="/" className="hover:text-blue-600 transition">Strona główna</a></li>
                    <li><a href="/search" className="hover:text-blue-600 transition">Wyszukiwarka</a></li>
                    <li><a href="/about" className="hover:text-blue-600 transition">O nas</a></li>
                </ul>
                </div>
            )}
        </header>
    )
}
