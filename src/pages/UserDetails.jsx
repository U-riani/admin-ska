import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserDetails() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/users");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load user");
        const found = data.users.find((u) => u._id === id);
        setUser(found);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!user)
    return (
      <div className="text-center mt-10 text-gray-500">User not found</div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow p-6">
        <img
          src={user.imageUrl}
          alt={user.firstName}
          className="w-40 h-40 object-cover rounded-full mx-auto mb-6"
        />
        <h2 className="text-2xl font-semibold text-center mb-2">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-center text-gray-600 mb-4">{user.email}</p>

        <div className="space-y-2">
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>ID Number:</strong> {user.idNumber}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(user.createdAt).toLocaleString()}
          </p>
        </div>

        <Link
          to="/users"
          className="block text-center mt-6 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          Back to All Users
        </Link>
      </div>
    </div>
  );
}
