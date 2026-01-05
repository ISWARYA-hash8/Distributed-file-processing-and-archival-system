import React from "react";
import { Archive } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12">
      <div
        className="
          w-full
          bg-gradient-to-r from-blue-50 via-sky-50 to-cyan-50
          dark:from-gray-900 dark:via-gray-800 dark:to-gray-900
          border-t
        "
      >
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
          
          

          {/* Center */}
          <div className="text-gray-600 dark:text-gray-400 text-center">
            © {new Date().getFullYear()}{" "}
            <span className="font-semibold text-blue-600">
              Iswarya
            </span>{" "}
            · All rights reserved
          </div>

          {/* Right */}
          <div className="text-gray-500 dark:text-gray-400 text-xs">
            Secure • Reliable • Archived
          </div>
        </div>
      </div>
    </footer>
  );
}
