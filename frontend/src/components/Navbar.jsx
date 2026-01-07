import {
  UserCircle,
  Sun,
  Moon,
  Home,
  UploadCloud,
  Folder,
  Archive,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useTheme } from "../theme/ThemeContext";
import { useToast } from "./ToastContext";
import { useState } from "react";

export default function Navbar() {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const email = localStorage.getItem("userEmail");
  const username = email ? email.split("@")[0] : "User";
  const navigate = useNavigate();
  const { addToast } = useToast();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const navItem = (to, icon, label) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition
          ${
            active
              ? "bg-white text-blue-600 shadow"
              : "text-white/90 hover:bg-white/20"
          }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50">
      <div
        className="
          bg-gradient-to-r 
          from-blue-600 via-sky-600 to-cyan-600
          dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
          shadow
        "
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 text-white">
            <Archive className="w-6 h-6" />
            <span className="text-lg font-bold tracking-wide">
              ArchivalSystem
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navItem("/", <Home size={16} />, "Home")}
            {navItem("/upload", <UploadCloud size={16} />, "Upload")}
            {navItem("/myfiles", <Folder size={16} />, "My Files")}
            {navItem("/archived", <Archive size={16} />, "Archived")}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-3">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition text-white"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 px-3 py-2 rounded-full 
                           bg-white/20 hover:bg-white/30 text-white transition"
              >
                <UserCircle size={22} />
                <span className="hidden sm:block text-sm font-medium">
                  {username}
                </span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
                  <button
                    onClick={() => {
                      logout();
                      addToast("Logged out", { type: "success" });
                      navigate("/login");
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}
