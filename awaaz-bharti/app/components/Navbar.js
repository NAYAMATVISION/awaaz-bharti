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

export default function Navbar({ epaperUrl }) {
  const { user, loading, logout } = useAuthContext();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 py-3.5 h-[73px]">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between">
           <div className="text-[30px] font-black text-red-700 animate-pulse">Awaaz<span className="text-gray-900">Bharti</span></div>
           <div className="w-20 h-8 bg-slate-100 rounded-full animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 py-3.5">
        <div className="max-w-[1280px] mx-auto px-5 flex items-center justify-between">
          <div className="flex items-baseline gap-3.5">
            <a href="/" className="text-[30px] font-black text-red-700 leading-none tracking-tight">
              Awaaz<span className="text-gray-900">Bharti</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-600 hidden md:inline">{today}</span>
            
            <form action="/search" className="flex items-center">
              <input type="text" name="q" placeholder="Search news..." className="border border-gray-200 rounded-l-full py-1.5 px-4 text-sm focus:outline-none focus:border-red-700 w-[120px] sm:w-48 transition-all h-[38px]" required />
              <button type="submit" className="w-[38px] h-[38px] rounded-r-full border border-l-0 border-gray-200 flex items-center justify-center text-gray-600 hover:text-red-700 bg-gray-50 transition-all">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
              </button>
            </form>

            <div className="flex items-center gap-4 border-l border-slate-100 pl-4 ml-2">
              {user ? (
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-gray-900 hidden sm:inline">Hi, {user.name.split(' ')[0]}</span>
                  <div className="flex items-center gap-2">
                    {(user.role === 'admin' || user.role === 'employee') && (
                      <a 
                        href={user.role === 'admin' ? '/admin/dashboard' : '/employee/dashboard'} 
                        className="px-4 py-2 bg-red-700 text-white text-[10px] font-black rounded-full hover:bg-red-800 transition-all uppercase tracking-widest shadow-lg shadow-red-700/20"
                      >
                        Dashboard
                      </a>
                    )}
                    <button 
                      onClick={logout}
                      className="px-4 py-2 border-2 border-slate-100 text-slate-700 text-[10px] font-black rounded-full hover:border-red-700 transition-all uppercase tracking-widest"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <a 
                    href="/login" 
                    className="px-4 py-2 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full hover:bg-slate-200 transition-all uppercase tracking-widest"
                  >
                    Login
                  </a>
                  <a 
                    href="/signup" 
                    className="px-4 py-2 bg-red-700 text-white text-[10px] font-black rounded-full hover:bg-red-800 transition-all uppercase tracking-widest"
                  >
                    Signup
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <nav className={`bg-white border-b-[3px] border-red-700 sticky top-0 z-[900] transition-shadow ${scrolled ? "shadow-md" : "shadow-sm"}`}>
        <div className="max-w-[1280px] mx-auto px-5">
          <ul className="flex items-center overflow-x-auto scrollbar-hide">
            {navItems.map((item) => {
              const isActive = item.cat === "home" 
                ? pathname === "/" 
                : pathname.startsWith(item.href);
              
              return (
                <li key={item.cat}>
                  <a href={item.href} className={`block px-[22px] py-3.5 text-sm font-semibold whitespace-nowrap relative transition-all duration-300 ${isActive ? "text-red-700" : "text-gray-600 hover:text-red-700"}`}>
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
