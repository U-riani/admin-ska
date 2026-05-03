import React, { useEffect, useState } from "react";

const AdminEventStatsPage = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = JSON.parse(localStorage.getItem("adminInfo"))?.token;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/events/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setStats(data.stats);
        else alert(data.message || "Failed to load event stats");
      } catch (err) {
        alert("Error loading stats: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Event Statistics</h1>

        {loading ? (
          <p className="text-gray-600">Loading statistics...</p>
        ) : stats.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Event</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-center">Tickets Sold</th>
                  <th className="p-3 text-center">Tickets Used</th>
                  <th className="p-3 text-center">Invites Sent</th>
                  <th className="p-3 text-center">Invites Used</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((e) => (
                  <tr key={e.eventId} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium text-gray-800">{e.title}</td>
                    <td className="p-3 text-gray-600">
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-center text-blue-600 font-semibold">
                      {e.soldTickets}
                    </td>
                    <td className="p-3 text-center text-green-600 font-semibold">
                      {e.usedTickets}
                    </td>
                    <td className="p-3 text-center text-purple-600 font-semibold">
                      {e.totalInvites}
                    </td>
                    <td className="p-3 text-center text-orange-600 font-semibold">
                      {e.usedInvites}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEventStatsPage;
