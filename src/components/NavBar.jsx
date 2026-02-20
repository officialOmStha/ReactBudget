import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem("access");

  const handleLogout = () => {
    localStorage.removeItem("access");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-md bg-white/10 border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="text-xl font-semibold text-white">
          FinanceApp
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6 text-white">
          {isAuthenticated && (
            <>
              <Link to="/dashboard" className="hover:text-gray-300 transition">
                Dashboard
              </Link>
              <Link to="/incomestat" className="hover:text-gray-300 transition">
                Incomes
              </Link>
              <Link to="/expensestat" className="hover:text-gray-300 transition">
                Expenses
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        {isAuthenticated && (
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="text-white text-2xl"
            >
              ☰
            </button>
          </div>
        )}
      </div>

      {/* Mobile Dropdown */}
      {open && isAuthenticated && (
        <div className="md:hidden bg-white/10 backdrop-blur-md px-6 pb-4 text-white space-y-3">
          <Link to="/dashboard" onClick={() => setOpen(false)} className="block">
            Dashboard
          </Link>
          <Link to="/incomestat" onClick={() => setOpen(false)} className="block">
            Incomes
          </Link>
          <Link to="/expensestat" onClick={() => setOpen(false)} className="block">
            Expenses
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left bg-red-500 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;