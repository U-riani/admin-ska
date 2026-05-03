import React, { useEffect, useState } from "react";

const AdminStaffPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "checker" });
  const [creating, setCreating] = useState(false);
  const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;

  // Fetch staff list
  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/staff", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setStaff(data.staff);
      else alert(data.message || "Failed to load staff");
    } catch (err) {
      alert("Error loading staff: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create staff
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await fetch("http://localhost:5000/api/staff/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert("✅ Staff created successfully");
        setForm({ name: "", email: "", password: "", role: "checker" });
        fetchStaff();
      } else {
        alert(data.message || "Failed to create staff");
      }
    } catch (err) {
      alert("Error creating staff: " + err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Staff Management</h1>

        {/* Create Form */}
        <form
          onSubmit={handleCreateStaff}
          className="bg-white shadow-md rounded-lg p-6 mb-8"
        >
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Add New Staff</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border p-2 rounded w-full"
              required
            />
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="border p-2 rounded w-full"
              required
            />
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="checker">Checker</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={creating}
            className={`mt-4 px-6 py-2 rounded text-white font-semibold ${
              creating ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {creating ? "Creating..." : "Create Staff"}
          </button>
        </form>

        {/* Staff List */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Staff List</h2>
          {loading ? (
            <p className="text-gray-500">Loading staff...</p>
          ) : staff.length === 0 ? (
            <p className="text-gray-500">No staff found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Name</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Email</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Role</th>
                    <th className="p-3 text-left text-sm font-medium text-gray-600">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((s) => (
                    <tr key={s._id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3">{s.email}</td>
                      <td className="p-3 capitalize">{s.role}</td>
                      <td className="p-3 text-gray-500">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminStaffPage;
