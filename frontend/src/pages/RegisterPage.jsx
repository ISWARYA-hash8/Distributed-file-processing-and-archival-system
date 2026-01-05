import { useState } from "react";
import axios from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import { saveToken } from "../utils/auth";
import { Mail, Lock, UserPlus, CloudUpload } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "../components/ToastContext";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/auth/register", { email, password });
      if (res.data?.token || res.data?.accessToken || typeof res.data === "string") {
        saveToken(res.data.token ?? res.data.accessToken ?? res.data);
        localStorage.setItem("userEmail", email);
        addToast("Account created — please login", { type: "success" });
      }
      navigate("/login");
    } catch (err) {
      alert(err.response?.data ?? "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden
      bg-gradient-to-br from-indigo-100 via-white to-sky-100
      dark:from-[#050b1e] dark:via-[#08122a] dark:to-[#020817]">

      {/* Floating gradient blobs */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-96 h-96 bg-purple-400/30 rounded-full blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 -right-24 w-[28rem] h-[28rem] bg-sky-400/30 rounded-full blur-3xl"
      />

      {/* Hero tagline */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-10"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-sky-400"
        >
          <span className="typewriter">Upload your files keep everything stored</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-3 text-gray-600 dark:text-gray-300"
        >
          Secure • Fast • Cloud-powered archival system
        </motion.p>
      </motion.div>

      {/* Register Card */}
      <motion.form
        onSubmit={handleRegister}
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 90 }}
        className="relative z-10 w-full max-w-md p-8 rounded-2xl
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
          shadow-xl border border-white/30"
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            whileHover={{ rotate: 5, scale: 1.1 }}
            className="bg-green-600 text-white p-2 rounded-lg shadow"
          >
            <CloudUpload />
          </motion.div>
          <h2 className="text-2xl font-bold">Create your account</h2>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="text-sm">Email</label>
          <div className="mt-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
            <Mail className="text-gray-500" />
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="text-sm">Password</label>
          <div className="mt-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
            <Lock className="text-gray-500" />
            <input
              type="password"
              placeholder="Choose a secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-transparent outline-none w-full"
            />
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full flex items-center justify-center gap-2
            bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium"
        >
          <UserPlus size={16} /> Create account
        </motion.button>

        <p className="mt-5 text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}
