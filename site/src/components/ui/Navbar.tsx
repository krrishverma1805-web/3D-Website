"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Arc Reactor", href: "#arc-reactor" },
    { label: "Defense", href: "#defense" },
    { label: "Technology", href: "#technology" },
    { label: "Avengers Initiative", href: "#avengers" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-black/60 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/5 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 30 }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          {/* Arc Reactor Icon */}
          <div className="w-7 h-7 rounded-full border-2 border-sky-400/60 flex items-center justify-center arc-glow">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          </div>
          <span className="font-semibold text-sm tracking-[0.2em] text-white uppercase">
            Stark Industries
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#avengers"
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Join the Initiative
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="h-[2px] w-full bg-white rounded-full"
            animate={menuOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <motion.span
            className="h-[2px] w-full bg-white rounded-full"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="h-[2px] w-full bg-white rounded-full"
            animate={
              menuOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-black/80 backdrop-blur-2xl border-b border-white/5"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-zinc-300 py-2"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#avengers"
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-sm font-medium text-center mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Join the Initiative
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
