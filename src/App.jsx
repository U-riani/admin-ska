import React, { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AllUsers from "./pages/AllUsers";
import UserDetails from "./pages/UserDetails";
import LoginPage from "./pages/LoginPage";
import AdminNavbar from "./components/AdminNavbar";
import AdminUsersPage from "./pages/AdminUsersPage";
import EventsAdminPage from "./pages/EventAdminPage";
import TicketCheckPage from "./pages/TicketCheckPage";
import AdminInvitePage from "./pages/AdminInvitePage";
import AdminStaffPage from "./pages/AdminStaffPage";
import StaffLoginPage from "./pages/staffLoginPage";
import AdminEventStatsPage from "./pages/AdminEventStatsPage";

// Protect routes (redirect if not logged in)
const ProtectedRoute = ({ children, allowedRoles = ["admin"] }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const adminInfo = JSON.parse(localStorage.getItem("adminInfo"));
    const staffInfo = JSON.parse(localStorage.getItem("staffInfo"));
    const user = adminInfo || staffInfo;

    if (!user) {
      navigate("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      alert("Access denied");
      navigate("/login");
    }
  }, [navigate]);

  return children;
};

function App() {
  const location = useLocation();
  const hideNavbar = location.pathname === "/login"; // hide full navbar on login

  return (
    <>
      {/* Only show navbar if not on login page */}
      {!hideNavbar && <AdminNavbar minimal={false} />}
      {hideNavbar && <AdminNavbar minimal={true} />}

      <Routes>
        {/* Public route */}
        <Route path="/admin/login" element={<LoginPage />} />

        {/* Protected admin routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/admin/usersWithStatus" element={<AdminUsersPage />} />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AllUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/:id"
          element={
            <ProtectedRoute>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute>
              <EventsAdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ticket-check"
          element={
            <ProtectedRoute allowedRoles={["admin", "checker"]}>
              <TicketCheckPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/invites"
          element={
            <ProtectedRoute>
              <AdminInvitePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute>
              <AdminStaffPage />
            </ProtectedRoute>
          }
        />
        <Route path="/staff/login" element={<StaffLoginPage />} />
        <Route
          path="/admin/event-stats"
          element={
            <ProtectedRoute>
              <AdminEventStatsPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
