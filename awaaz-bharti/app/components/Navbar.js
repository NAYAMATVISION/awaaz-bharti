"use client";

import { useState, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", cat: "home" },
  { label: "Politics", href: "/category/politics", cat: "politics" },
  { label: "Business", href: "/category/business", cat: "business" },
  { label: "Technology", href: "/category/technology", cat: "technology" },
  { label: "Sports", href: "/category/sports", cat: "sports" },
  { label: "Entertainment", href: "/category/entertainment", cat: "entertainment" },
  { label: "Health & Crime", href: "/category/health", cat: "health" },
  { label: "E-Paper", href: "/e-paper", cat: "epaper" },
];

export default function Navbar() {
  const { user, loading, logout } = useAuthContext();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 py-3 h-[64px]">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between">
          <div className="text-xl sm:text-2xl font-black text-red-700 animate-pulse">Awaz<span className="text-gray-900">Bharti</span></div>
          <div className="w-20 h-8 bg-slate-100 rounded-full animate-pulse" />
        </div>
      </header>
    );
  }

  return (
    <>
      {/* Top header */}
      <header className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-[1280px] mx-auto px-4 flex items-center justify-between gap-3">
          {/* Logo */}
          <a href="/" className="shrink-0">
            <span className="text-xl sm:text-2xl md:text-[28px] font-black text-red-700 leading-none tracking-tight">
              Awaz<span className="text-gray-900">Bharti</span>
            </span>
          </a>

          {/* Desktop: date + search + auth */}
          <div className="hidden md:flex items-center gap-3 flex-1 justify-end">
            <span className="text-xs text-gray-500 hidden lg:inline whitespace-nowrap">{today}</span>

            <form action="/search" className="flex items-center">
              <input
                type="text"
                name="q"
                placeholder="Search news..."
                className="border border-gray-200 rounded-l-full py-1.5 px-4 text-sm focus:outline-none focus:border-red-700 w-36 lg:w-48 transition-all h-[36px]"
                required
              />
              <button type="submit" className="w-[36px] h-[36px] rounded-r-full border border-l-0 border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-700 bg-gray-50 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </button>
            </form>

            <div className="flex items-center gap-2 border-l border-slate-100 pl-3">
              {user ? (
                <>
                  <span className="text-xs font-bold text-gray-900 hidden lg:inline">Hi, {user.name.split(' ')[0]}</span>
                  {(user.role === 'admin' || user.role === 'employee') && (
                    <a href={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}
                      className="px-3 py-1.5 bg-red-700 text-white text-[10px] font-black rounded-full hover:bg-red-800 transition-all uppercase tracking-widest">
                      Dashboard
                    </a>
                  )}
                  <button onClick={logout}
                    className="px-3 py-1.5 border-2 border-slate-100 text-slate-700 text-[10px] font-black rounded-full hover:border-red-700 transition-all uppercase tracking-widest">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <a href="/login" className="px-3 py-1.5 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest">Login</a>
                  <a href="/signup" className="px-3 py-1.5 bg-red-700 text-white text-[10px] font-black rounded-full hover:bg-red-800 transition-all uppercase tracking-widest">Signup</a>
                </>
              )}
            </div>
          </div>

          {/* Mobile: search icon + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <a href="/search" className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-600 hover:text-red-700 transition-all">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:text-red-700 transition-all"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6 6 18M6 6l12 12" /></svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-3">
            {/* Nav links */}
            <div className="grid grid-cols-2 gap-2">
              {navItems.map(item => (
                <a key={item.cat} href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    (item.cat === 'home' ? pathname === '/' : pathname.startsWith(item.href))
                      ? 'bg-red-50 text-red-700'
                      : 'text-gray-700 hover:bg-slate-50'
                  }`}>
                  {item.label}
                </a>
              ))}
            </div>

            {/* Auth buttons */}
            <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <span className="text-sm font-bold text-gray-900">Hi, {user.name.split(' ')[0]}</span>
                  {(user.role === 'admin' || user.role === 'employee') && (
                    <a href={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'}
                      className="w-full text-center px-4 py-2.5 bg-red-700 text-white text-xs font-black rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest">
                      Dashboard
                    </a>
                  )}
                  <button onClick={logout}
                    className="w-full px-4 py-2.5 border-2 border-slate-200 text-slate-700 text-xs font-black rounded-xl hover:border-red-700 transition-all uppercase tracking-widest">
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <a href="/login" className="flex-1 text-center px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-black rounded-xl hover:bg-slate-200 transition-all uppercase tracking-widest">Login</a>
                  <a href="/signup" className="flex-1 text-center px-4 py-2.5 bg-red-700 text-white text-xs font-black rounded-xl hover:bg-red-800 transition-all uppercase tracking-widest">Signup</a>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Desktop sticky nav bar */}
      <nav className={`hidden md:block bg-white border-b-[3px] border-red-700 sticky top-0 z-[900] transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
        <div className="max-w-[1280px] mx-auto px-4">
          <ul className="flex items-center overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = item.cat === "home" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.cat}>
                  <a href={item.href} className={`block px-4 py-3 text-sm font-semibold whitespace-nowrap relative transition-all duration-300 ${isActive ? "text-red-700" : "text-gray-600 hover:text-red-700"}`}>
                    {item.label}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-red-700 transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile sticky nav bar (horizontal scroll) */}
      <nav className={`md:hidden bg-white border-b-[3px] border-red-700 sticky top-0 z-[900] transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
        <div className="px-2">
          <ul className="flex items-center overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = item.cat === "home" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <li key={item.cat}>
                  <a href={item.href} className={`block px-3 py-2.5 text-xs font-semibold whitespace-nowrap relative transition-all duration-300 ${isActive ? "text-red-700" : "text-gray-600 hover:text-red-700"}`}>
                    {item.label}
                    <span className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-red-700 transition-all duration-300 ${isActive ? "w-full" : "w-0"}`} />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
