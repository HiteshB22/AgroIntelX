import React, { useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="bg-green-600 text-white px-2 py-1 rounded text-lg">
            🌱
          </span>
          <h1 className="font-bold text-2xl text-gray-800">AgroIntelX</h1>
        </Link>

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

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-3">
          <Link
            to="/login"
            className="text-sm font-semibold text-gray-700 hover:text-green-700 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-800 transition"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 hover:text-green-700"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-sm">
          <ul className="flex flex-col px-6 py-4 space-y-4 text-gray-700 font-medium">
            <li>
              <a href="#about" className="hover:text-green-700">
                About
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-green-700">
                Contact
              </a>
            </li>
            <li>
              <Link to="/login" className="px-4 py-2 rounded-md text-sm font-semibold hover:text-green-700">
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/signup"
                className="bg-green-700 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-800 transition block text-center"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
