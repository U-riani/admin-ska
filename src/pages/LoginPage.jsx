import React, { useState } from "react";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("adminInfo", JSON.stringify(data));
        alert("Welcome back, " + data.name);
        if (data.role === "admin") window.location.href = "/";
        else window.location.href = "/users";
      } else alert(data.message || "Invalid credentials");
    } catch (err) {
      alert("Server unreachable" + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-900 text-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">Admin Login</h2>
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
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-medium"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
