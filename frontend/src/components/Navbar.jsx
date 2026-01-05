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
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition
          ${
            active
              ? "bg-blue-600 text-white shadow"
              : "text-gray-600 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-gray-700"
          }`}
      >
        {icon}
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <Archive className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-bold text-blue-600">
            ArchivalSystem
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItem("/", <Home size={16} />, "Dashboard")}
          {navItem("/upload", <UploadCloud size={16} />, "Upload")}
          {navItem("/myfiles", <Folder size={16} />, "My Files")}
          {navItem("/archived", <Archive size={16} />, "Archived")}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">

          {/* Theme toggle (unchanged) */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* User menu (CLICK based) */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <UserCircle size={22} />
              <span className="hidden sm:block text-sm">{username}</span>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border rounded-lg shadow-md">
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
    </header>
  );
}
