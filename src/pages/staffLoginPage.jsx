import React, { useState } from "react";

const StaffLoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/staff/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("staffInfo", JSON.stringify(data));
        alert("Welcome, " + data.name);
        window.location.href = "/ticket-check";
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (err) {
      alert("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-900 text-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">Staff Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 border border-gray-600 bg-gray-800 rounded"
          required
        />
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
          className="w-full p-2 border border-gray-600 bg-gray-800 rounded"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded font-medium ${
            loading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default StaffLoginPage;
