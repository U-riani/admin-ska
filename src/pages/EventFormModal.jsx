import React, { useState } from "react";

const EventFormModal = ({ setModalOpen, fetchEvents, editEvent }) => {
  const [formData, setFormData] = useState(
    editEvent || {
      title: "",
      description: "",
      location: "",
      date: "",
      price: "",
    }
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(editEvent?.bannerUrl || "");
  const [uploading, setUploading] = useState(false);

  const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const method = editEvent ? "PUT" : "POST";
    const url = editEvent
      ? `http://localhost:5000/api/events/${editEvent._id}`
      : "http://localhost:5000/api/events";

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) =>
      form.append(key, value)
    );
    if (file) form.append("file", file); // matches uploadWithLogs

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Event saved successfully");
        setModalOpen(false);
        fetchEvents();
      } else {
        alert(data.message || "Failed to save event");
      }
    } catch (err) {
      alert("Upload error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          {editEvent ? "Edit Event" : "New Event"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Text Inputs */}
          {["title", "description", "location", "date", "price"].map((field) => (
            <input
              key={field}
              id={field}
              type={field === "date" ? "date" : "text"}
              value={formData[field]}
              onChange={handleChange}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              className="w-full p-2 border rounded"
              required={["title", "date", "price"].includes(field)}
            />
          ))}

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="block text-sm text-gray-700 dark:text-gray-300">
              Event Banner
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 dark:bg-gray-700 dark:text-gray-300"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded-lg"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className={`px-4 py-2 rounded text-white ${
                uploading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventFormModal;
