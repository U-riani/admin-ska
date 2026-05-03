import React, { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_API_URL;

export default function AdminInvitePage() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [guest, setGuest] = useState({
    firstName: "",
    lastName: "",
    facebookUrl: "",
    instagramUrl: "",
  });
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inviteData, setInviteData] = useState(null);
  const [error, setError] = useState("");

  // 🧩 Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${backendUrl}/events?type=all`);
        const data = await res.json();
        if (res.ok) setEvents(data.events || []);
        else setError("Failed to load events");
      } catch (err) {
        setError("Error loading events: " + err.message);
      }
    };
    fetchEvents();
  }, []);

  // 🎟 Create Invite
  const handleCreateInvite = async () => {
    if (!selectedEvent) {
      alert("Please select an event.");
      return;
    }

    setLoading(true);
    setError("");
    setInviteData(null);

    try {
      const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;
      const res = await fetch("http://localhost:5000/api/invites/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: selectedEvent,
          guest: isPersonalized ? guest : null,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setInviteData(data.invite);
      } else {
        setError(data.message || "Failed to create invite");
      }
    } catch (err) {
      setError("Server error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🧷 Download QR
  const handleDownloadQR = () => {
    if (!inviteData?.qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = inviteData.qrCodeUrl;
    link.download = `${inviteData._id || "invite"}.png`;
    link.click();
  };

  return (
    <div className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
        🎟 Create Event Invite
      </h2>

      {/* Event Selector */}
      <label className="block text-gray-700 dark:text-gray-300 mb-2">
        Select Event
      </label>
      <select
        value={selectedEvent}
        onChange={(e) => setSelectedEvent(e.target.value)}
        className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
      >
        <option value="">-- Choose Event --</option>
        {events.map((ev) => (
          <option key={ev._id} value={ev._id}>
            {ev.title} ({new Date(ev.date).toLocaleDateString()})
          </option>
        ))}
      </select>

      {/* Invite Type Toggle */}
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isPersonalized}
          onChange={(e) => setIsPersonalized(e.target.checked)}
          id="personalized"
          className="mr-2"
        />
        <label htmlFor="personalized" className="text-gray-700 dark:text-gray-300">
          Personalized Invite
        </label>
      </div>

      {/* Guest Info */}
      {isPersonalized && (
        <div className="space-y-3 mb-4">
          <input
            type="text"
            placeholder="First Name"
            value={guest.firstName}
            onChange={(e) => setGuest({ ...guest, firstName: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={guest.lastName}
            onChange={(e) => setGuest({ ...guest, lastName: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            placeholder="Facebook URL (optional)"
            value={guest.facebookUrl}
            onChange={(e) => setGuest({ ...guest, facebookUrl: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="url"
            placeholder="Instagram URL (optional)"
            value={guest.instagramUrl}
            onChange={(e) => setGuest({ ...guest, instagramUrl: e.target.value })}
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
          />
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={handleCreateInvite}
        disabled={loading}
        className={`w-full py-2 rounded text-white font-semibold ${
          loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Generating..." : "Generate Invite QR"}
      </button>

      {/* Error */}
      {error && <p className="text-red-600 mt-4 font-medium">{error}</p>}

      {/* QR Result */}
      {inviteData && (
        <div className="mt-6 text-center">
          <p className="text-green-700 font-semibold mb-2">✅ Invite Created</p>
          <img
            src={inviteData.qrCodeUrl}
            alt="Invite QR"
            className="mx-auto w-60 h-60 border rounded shadow mb-4"
          />
          <button
            onClick={handleDownloadQR}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download QR
          </button>
        </div>
      )}
    </div>
  );
}
