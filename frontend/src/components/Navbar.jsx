import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, LogOut, MessageSquare, FileText } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Link to="/" className="flex items-center space-x-2">
            <span className="bg-green-600 text-white px-2 py-1 rounded text-lg">
              🌱
            </span>
            <h1 className="font-bold text-2xl text-gray-800">AgroIntelX</h1>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-gray-700 font-medium">
          <li>
            <Link to="/about" className="hover:text-green-700 transition">
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-green-700 transition">
              Contact
            </Link>
          </li>
        </ul>

        {/* Auth Section */}
        {user ? (
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/my-reports"
              className="flex items-center gap-1 text-gray-700 hover:text-green-700 transition"
            >
              <FileText size={16} /> My Reports
            </Link>

            <Link
              to="/chat"
              className="flex items-center gap-1 text-gray-700 hover:text-green-700 transition"
            >
              <MessageSquare size={16} /> Chat
            </Link>

            {/* User Badge */}
            <div className="px-3 py-1 rounded-full bg-green-50 text-green-800 text-sm font-semibold">
              Hi, {user.name}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={logout}
              className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 transition"
            >
              <LogOut size={16} /> Logout
            </motion.button>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/login"
                className="flex items-center justify-center h-9 px-4 rounded-md text-sm font-medium text-gray-700 hover:text-green-700 hover:bg-green-50 transition"
              >
                Login
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }}>
              <Link
                to="/signup"
                className="flex items-center justify-center h-9 px-5 rounded-md bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition shadow-sm"
              >
                Sign Up
              </Link>
            </motion.div>
          </div>
        )}

        {/* Mobile Menu Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-green-700"
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </motion.button>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 shadow-sm overflow-hidden"
          >
            <ul className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
              <li>
                <Link
                  to="/about"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-green-700"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="hover:text-green-700"
                >
                  Contact
                </Link>
              </li>

              {user ? (
                <>
                  <li>
                    <Link
                      to="/my-reports"
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-green-700"
                    >
                      My Reports
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/chat"
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-green-700"
                    >
                      Chat
                    </Link>
                  </li>
                  <li className="text-sm text-green-700 font-semibold">
                    Hi, {user.name}
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="text-sm font-semibold hover:text-green-700"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-800 transition block text-center"
                    >
                      Sign Up
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
