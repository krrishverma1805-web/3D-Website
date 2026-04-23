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
    { label: "Avengers", href: "#avengers" },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? "bg-black/50 backdrop-blur-3xl border-b border-white/[0.04]"
          : "bg-transparent"
      }`}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 25, delay: 0.2 }}
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-full border border-sky-400/40 flex items-center justify-center arc-glow transition-all duration-300 group-hover:border-sky-400/60">
            <div className="w-2 h-2 rounded-full bg-sky-400" />
          </div>
          <span className="font-medium text-xs tracking-[0.35em] text-champagne uppercase">
            Stark Industries
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[0.15em] font-medium text-zinc-500 hover:text-champagne transition-colors duration-300 uppercase"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#avengers"
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600/80 to-yellow-500/80 text-xs tracking-[0.1em] font-semibold text-black uppercase hover:from-amber-500/90 hover:to-yellow-400/90 transition-all duration-300"
          >
            Initiative
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 w-6"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <motion.span
            className="h-[1.5px] w-full bg-champagne rounded-full"
            animate={menuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
          <motion.span
            className="h-[1.5px] w-full bg-champagne rounded-full"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
          />
          <motion.span
            className="h-[1.5px] w-full bg-champagne rounded-full"
            animate={
              menuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }
            }
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="md:hidden bg-black/80 backdrop-blur-3xl border-b border-white/[0.04]"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm tracking-[0.1em] font-medium text-zinc-400 py-2 uppercase"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#avengers"
                className="px-5 py-3 rounded-full bg-gradient-to-r from-amber-600/80 to-yellow-500/80 text-xs tracking-[0.1em] font-semibold text-black text-center mt-2 uppercase"
                onClick={() => setMenuOpen(false)}
              >
                Join Initiative
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
