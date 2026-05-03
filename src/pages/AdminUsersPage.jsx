import React, { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_API_URL;

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

  const getToken = () => {
    try {
      const stored = localStorage.getItem("adminInfo");
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return parsed.token || null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const token = getToken();
    if (!token) {
      alert("Session expired or not logged in. Please log in again.");
      window.location.href = "/login";
    }
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const token = getToken();
    if (!token) return;

    try {
      const url = `${backendUrl}/users/${filter}`;
      const res = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
      else alert(data.message || "Failed to load users");
    } catch (err) {
      alert("Error loading users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧩 Handle user status change with special confirmation for blocked users
  const handleVerify = async (id, newStatus, currentStatus) => {
    let message = `Change status from "${currentStatus}" to "${newStatus}"?`;
    let confirmed = window.confirm(message);
    if (!confirmed) return;

    // Extra caution if changing *from* blocked users
    if (currentStatus === "blocked" && newStatus !== "blocked") {
      const doubleCheck = window.confirm(
        "⚠️ This user is currently BLOCKED.\nAre you absolutely sure you want to change their status?"
      );
      if (!doubleCheck) return;
    }

    const token = getToken();
    if (!token) {
      alert("Not authorized. Please log in again.");
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/users/${id}/verify`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`User status changed to ${newStatus}`);
        fetchUsers();
      } else {
        alert(data.message || "Failed to update user status");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const statuses = ["pending", "approved", "rejected", "blocked"];

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
        User Management
      </h2>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded capitalize ${
              filter === s
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            }`}
          >
            {s} Users
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Phone</th>
              <th className="p-2 border">Facebook</th>
              <th className="p-2 border">Instagram</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="text-center">
                <td className="border p-2">
                  {u.firstName} {u.lastName}
                </td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.phone}</td>
                <td className="border p-2">
                  {u.facebookUrl ? (
                    <a
                      href={u.facebookUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600"
                    >
                      Facebook
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2">
                  {u.instagramUrl ? (
                    <a
                      href={u.instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-500"
                    >
                      Instagram
                    </a>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border p-2 capitalize">{u.status}</td>
                <td className="border p-2 space-x-2">
                  {/* Dynamic buttons */}
                  <select
                    value={u.status}
                    onChange={(e) =>
                      handleVerify(u._id, e.target.value, u.status)
                    }
                    className="border rounded p-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminUsersPage;
