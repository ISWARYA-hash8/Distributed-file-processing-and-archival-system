import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>

      <main className="flex-1 p-6 pt-20 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
