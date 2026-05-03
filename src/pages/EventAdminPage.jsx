import React, { useEffect, useState } from "react";
import EventFormModal from "./EventFormModal";
import AdminEventCard from "../components/AdminEventCard";

const EventsAdminPage = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editEvent, setEditEvent] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // table | grid
  const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;
  const backendUrl = import.meta.env.VITE_API_URL;


  // Fetch events based on filter
  const fetchEvents = async () => {
    try {
      setLoading(true);

      let url = `${backendUrl}/events`;

      if (filter === "archived") {
        url += "?archived=true";
      } else if (filter !== "all") {
        url += `?type=${filter}`;
      }

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setEvents(data.events || []);
      else alert(data.message || "Failed to load events");
    } catch (err) {
      alert("Error loading events: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  // Archive event
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to archive this event?")) return;

    try {
      const res = await fetch(`${backendUrl}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Event archived successfully");
        fetchEvents();
      } else {
        alert(data.message || "Archive failed");
      }
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 mt-10 bg-white dark:bg-gray-800 shadow rounded-lg transition-all">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Manage Events
        </h2>

        <div className="flex gap-3">
          {/* Toggle View Mode */}
          <button
            onClick={() =>
              setViewMode((prev) => (prev === "table" ? "grid" : "table"))
            }
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded"
          >
            {viewMode === "table" ? "Grid View" : "Table View"}
          </button>

          <button
            onClick={() => {
              setEditEvent(null);
              setModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + New Event
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        {["all", "upcoming", "past", "archived"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded capitalize transition-colors ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
            }`}
          >
            {f} Events
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No events found.</p>
      ) : viewMode === "table" ? (
        // Table View
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
              <tr>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Location</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr
                  key={ev._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="p-2 border font-medium">{ev.title}</td>
                  <td className="p-2 border">
                    {new Date(ev.date).toLocaleDateString()}
                  </td>
                  <td className="p-2 border">{ev.location || "TBA"}</td>
                  <td className="p-2 border">{ev.price} ₾</td>
                  <td
                    className={`p-2 border font-medium ${
                      ev.status === "archived"
                        ? "text-gray-500"
                        : "text-green-600"
                    }`}
                  >
                    {ev.status || "active"}
                  </td>
                  <td className="p-2 border space-x-2">
                    {ev.status !== "archived" && (
                      <>
                        <button
                          onClick={() => {
                            setEditEvent(ev);
                            setModalOpen(true);
                          }}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(ev._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                        >
                          Archive
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        // Grid View
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev) => (
            <AdminEventCard
              key={ev._id}
              event={ev}
              onEdit={(e) => {
                setEditEvent(e);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <EventFormModal
          setModalOpen={setModalOpen}
          fetchEvents={fetchEvents}
          editEvent={editEvent}
        />
      )}
    </div>
  );
};

export default EventsAdminPage;
