import React from "react";

const AdminEventCard = ({ event, onEdit, onDelete }) => {
  const eventDate = new Date(event.date).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 transition-transform hover:scale-[1.02] duration-300">
      {/* Banner */}
      {event.bannerUrl ? (
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-40 object-cover"
        />
      ) : (
        <div className="w-full h-40 bg-gray-300 dark:bg-gray-700 flex items-center justify-center text-gray-500">
          No Banner
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col justify-between h-[180px]">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1">
            {event.title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
            {event.description || "No description provided."}
          </p>
        </div>

        <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
          <span>{eventDate}</span>
          <span>{event.location || "TBA"}</span>
        </div>

        <div className="flex justify-between items-center mt-4">
          <span className="text-blue-600 font-semibold">{event.price} ₾</span>
          <div className="space-x-2">
            <button
              onClick={() => onEdit(event)}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(event._id)}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventCard;
