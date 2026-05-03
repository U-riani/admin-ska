import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";
const backendUrl = import.meta.env.VITE_API_URL;

export default function TicketCheckPage() {
  const [ticketData, setTicketData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: 250,
      disableFlip: false,
    });

    scanner.render(
      async (decodedText) => {
        if (loading) return;
        setLoading(true);
        setTicketData(null);
        setErrorMsg(null);

        try {
          const isInvite = decodedText.startsWith("INVITE-");
          const endpoint = isInvite
            ? `${backendUrl}/invites/validate`
            : `${backendUrl}/tickets/validate`;

          const res = await fetch(endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${
                JSON.parse(localStorage.getItem("staffInfo"))?.token ||
                JSON.parse(localStorage.getItem("adminInfo"))?.token ||
                ""
              }`,
            },
            body: JSON.stringify({ code: decodedText }),
          });

          const data = await res.json();
          console.log("Server response:", data);

          if (res.ok && data.success) {
            setTicketData(data);
            setErrorMsg(null);
          } else {
            setTicketData(data);
            setErrorMsg(data.message || "Invalid or fake code");
          }
        } catch (err) {
          setErrorMsg("⚠️ Server error: " + err.message);
        } finally {
          setTimeout(() => setLoading(false), 4000);
        }
      },
      (err) => console.warn("Scan error:", err)
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [loading]);

  const isGuest = ticketData?.status === "guest";

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-2xl font-bold mb-4">
        🎟 {isGuest ? "Invite" : "Ticket"} Validation
      </h2>

      <div
        id="reader"
        className="border rounded-lg overflow-hidden shadow-md"
      />

      {/* ✅ VALID */}
      {ticketData && ticketData.success && (
        <div className="mt-5 p-4 bg-green-50 border border-green-200 rounded-lg text-left shadow">
          <p className="text-green-700 font-bold mb-2">
            ✅ {ticketData.message}
          </p>

          {/* Event Banner */}
          {ticketData.event?.bannerUrl && (
            <img
              src={ticketData.event.bannerUrl}
              alt="Event Banner"
              className="w-full h-40 object-cover rounded mb-3"
            />
          )}

          {/* Event Info */}
          <p className="text-gray-800">
            <strong>🎫 Event:</strong> {ticketData.event?.title}
          </p>
          <p className="text-gray-700">
            <strong>📅 Date:</strong>{" "}
            {ticketData.event?.date
              ? new Date(ticketData.event.date).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>📍 Location:</strong> {ticketData.event?.location || "N/A"}
          </p>

          <hr className="my-3" />

          {/* User / Guest Info */}
          {ticketData.user && (
            <>
              {ticketData.user.imageUrl && (
                <img
                  src={ticketData.user.imageUrl}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full mx-auto mb-3 border border-gray-300 shadow-sm"
                />
              )}

              <p className="text-gray-700">
                <strong>👤 {isGuest ? "Guest" : "Owner"}:</strong>{" "}
                {ticketData.user.firstName} {ticketData.user.lastName}
              </p>

              {!isGuest && (
                <p className="text-gray-700">
                  <strong>📧 Email:</strong> {ticketData.user.email}
                </p>
              )}

              {ticketData.user.facebookUrl && (
                <p className="text-gray-700">
                  <strong>📘 Facebook:</strong>{" "}
                  <a
                    href={ticketData.user.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open Profile
                  </a>
                </p>
              )}
              {ticketData.user.instagramUrl && (
                <p className="text-gray-700">
                  <strong>📸 Instagram:</strong>{" "}
                  <a
                    href={ticketData.user.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    Visit Profile
                  </a>
                </p>
              )}

              {!isGuest && (
                <p className="text-gray-700">
                  <strong>Status:</strong>{" "}
                  <span className="capitalize text-green-600 font-medium">
                    {ticketData.user.status}
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      )}

      {/* ❌ INVALID OR USED */}
      {errorMsg && ticketData?.event && (
        <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg text-left shadow">
          <p className="text-red-700 font-bold mb-2">{errorMsg}</p>

          {ticketData.event?.bannerUrl && (
            <img
              src={ticketData.event.bannerUrl}
              alt="Event Banner"
              className="w-full h-40 object-cover rounded mb-3"
            />
          )}

          <p className="text-gray-800">
            <strong>🎫 Event:</strong> {ticketData.event.title}
          </p>
          <p className="text-gray-700">
            <strong>📅 Date:</strong>{" "}
            {ticketData.event.date
              ? new Date(ticketData.event.date).toLocaleDateString()
              : "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>📍 Location:</strong> {ticketData.event.location || "N/A"}
          </p>

          {ticketData.user && (
            <>
              <hr className="my-3" />
              {ticketData.user.imageUrl && (
                <img
                  src={ticketData.user.imageUrl}
                  alt="User Avatar"
                  className="w-20 h-20 rounded-full mx-auto mb-3 border border-gray-300 shadow-sm"
                />
              )}
              <p className="text-gray-700">
                <strong>👤 {isGuest ? "Guest" : "Owner"}:</strong>{" "}
                {ticketData.user.firstName} {ticketData.user.lastName}
              </p>

              {!isGuest && (
                <p className="text-gray-700">
                  <strong>📧 Email:</strong> {ticketData.user.email}
                </p>
              )}
              {ticketData.user.facebookUrl && (
                <p className="text-gray-700">
                  <strong>📘 Facebook:</strong>{" "}
                  <a
                    href={ticketData.user.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    Open Profile
                  </a>
                </p>
              )}
              {ticketData.user.instagramUrl && (
                <p className="text-gray-700">
                  <strong>📸 Instagram:</strong>{" "}
                  <a
                    href={ticketData.user.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-pink-600 hover:underline"
                  >
                    Visit Profile
                  </a>
                </p>
              )}
              {!isGuest && (
                <p className="text-gray-700">
                  <strong>Status:</strong>{" "}
                  <span className="capitalize text-green-600 font-medium">
                    {ticketData.user.status}
                  </span>
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
