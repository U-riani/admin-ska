import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/skaLogo.png";

const AdminNavbar = ({ minimal = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("adminInfo"));
  const staff = JSON.parse(localStorage.getItem("staffInfo"));
  const user = admin || staff;

const handleLogout = () => {
  if (admin) {
    localStorage.removeItem("adminInfo");
    navigate("/admin/login");
  } else if (staff) {
    localStorage.removeItem("staffInfo");
    navigate("/staff/login");
  } else {
    navigate("/login");
  }
};


  return (
    <nav className="bg-gray-900 text-white px-4 py-3 shadow-md">
      <div className="flex items-center justify-between">
        {/* Logo + title */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-10 w-auto" />
          {!minimal && (
            <span className="text-xl font-semibold whitespace-nowrap">
              {user?.role === "checker" ? "Ticket Checker" : "Admin Panel"}
            </span>
          )}
        </Link>

        {/* Mobile toggle */}
        {!minimal && (
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Links */}
      {!minimal && (
        <div
          className={`${
            menuOpen ? "block" : "hidden"
          } md:flex md:items-center md:space-x-6 mt-3 md:mt-0`}
        >
          {/* Admin Links */}
          {user?.role === "admin" && (
            <>
              <Link
                to="/"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/admin/staff"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Staff
              </Link>
              <Link
                to="/users"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Users
              </Link>
              <Link
                to="/admin/usersWithStatus"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Users Status
              </Link>
              <Link
                to="/admin/events"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                to="/admin/event-stats"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Event Stats
              </Link>
              <Link
                to="/ticket-check"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Ticket Check
              </Link>
              <Link
                to="/admin/invites"
                className="block py-2 md:py-0 hover:text-blue-400 transition"
                onClick={() => setMenuOpen(false)}
              >
                Invites
              </Link>
            </>
          )}

          {/* Staff Links */}
          {user?.role === "checker" && (
            <Link
              to="/ticket-check"
              className="block py-2 md:py-0 hover:text-blue-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Ticket Check
            </Link>
          )}

          {/* Logout button */}
          {user && (
            <button
              onClick={handleLogout}
              className="mt-2 md:mt-0 bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded text-sm font-medium"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
