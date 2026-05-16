import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, MessageSquare, FileText, Bot } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDir, setScrollDir] = useState("up");
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);
      
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setScrollDir("down");
      } else {
        setScrollDir("up");
      }
      lastScrollY = currentScrollY > 0 ? currentScrollY : 0;
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out transform ${
        scrolled ? "glass py-2 shadow-lg" : "bg-transparent py-4"
      } ${scrollDir === "down" ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Logo */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ duration: 0.5 }}
        >
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center text-white text-xl shadow-lg group-hover:shadow-brand-500/30 transition-shadow">
              🌱
            </div>
            <h1 className="font-extrabold text-2xl tracking-tight text-gray-900 group-hover:text-brand-700 transition-colors">
              AgroIntelX
            </h1>
          </Link>
        </motion.div>

        {/* Desktop Menu */}
        <motion.ul 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="hidden md:flex space-x-8 text-gray-700 font-medium items-center"
        >
          <li>
            <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'text-brand-600 font-semibold' : ''}`}>
              About
            </Link>
          </li>
          <li>
            <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'text-brand-600 font-semibold' : ''}`}>
              Contact
            </Link>
          </li>
        </motion.ul>

        {/* Auth Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center"
        >
          {user ? (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/my-reports"
                className="icon-link group"
              >
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-brand-50 transition-colors">
                  <FileText size={18} className="group-hover:text-brand-600" />
                </div>
                <span className="font-medium">Reports</span>
              </Link>

              <Link
                to="/chat"
                className="icon-link group"
              >
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-brand-50 transition-colors">
                  <MessageSquare size={18} className="group-hover:text-brand-600" />
                </div>
                <span className="font-medium">Chat</span>
              </Link>

              <Link
                to="/avatar-chat"
                className="icon-link group"
              >
                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-brand-50 transition-colors">
                  <Bot size={18} className="group-hover:text-brand-600" />
                </div>
                <span className="font-medium">Avatar</span>
              </Link>

              {/* User Badge */}
              <div className="px-4 py-2 rounded-xl bg-brand-50 text-brand-700 text-sm font-bold border border-brand-100">
                Hi, {user.name.split(' ')[0]}
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <Link to="/login" className="secondary-btn py-2">
                Log in
              </Link>
              <Link to="/signup" className="primary-btn py-2">
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden ml-4 p-2 rounded-xl bg-gray-50 text-gray-700 hover:text-brand-700 hover:bg-brand-50 transition-colors"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden absolute top-full left-0 right-0 glass shadow-2xl border-t border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col space-y-4">
              <Link
                to="/about"
                onClick={() => setMenuOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-brand-600 py-2 border-b border-gray-100"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-brand-600 py-2 border-b border-gray-100"
              >
                Contact
              </Link>

              {user ? (
                <>
                  <Link
                    to="/my-reports"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-brand-600 py-2 border-b border-gray-100"
                  >
                    <FileText size={20} /> My Reports
                  </Link>
                  <Link
                    to="/chat"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-brand-600 py-2 border-b border-gray-100"
                  >
                    <MessageSquare size={20} /> AI Chat
                  </Link>
                  <Link
                    to="/avatar-chat"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-brand-600 py-2 border-b border-gray-100"
                  >
                    <Bot size={20} /> Avatar Chat
                  </Link>
                  <div className="text-sm text-brand-700 font-semibold py-2">
                    Logged in as {user.name}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMenuOpen(false);
                    }}
                    className="text-left text-lg font-medium text-red-600 hover:text-red-700 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="secondary-btn text-center"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="primary-btn text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
