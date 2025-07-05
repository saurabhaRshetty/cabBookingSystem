import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDriverRides = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rides/driver");
      setRides(res.data);
    } catch (err) {
      alert("Error fetching rides");
    } finally {
      setLoading(false);
    }
  };

  const acceptRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to accept this ride?")) return;

    try {
      await api.post(`/rides/accept/${rideId}`);
      alert("✅ Ride accepted!");
      fetchDriverRides();
    } catch (err) {
      alert("❌ Failed to accept ride");
    }
  };

  const completeRide = async (rideId) => {
    if (!window.confirm("Mark this ride as completed?")) return;

    try {
      await api.post(`/rides/complete/${rideId}`);
      alert("✅ Ride completed!");
      fetchDriverRides();
    } catch (err) {
      alert("❌ Failed to complete ride");
    }
  };

  useEffect(() => {
    fetchDriverRides();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🚖 Driver Dashboard</h2>
          <button
            onClick={fetchDriverRides}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            🔄 Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading your rides...</p>
        ) : rides.length === 0 ? (
          <p className="text-gray-600">RIDES COMPLETED</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rides.map((ride) => (
              <div
                key={ride.id}
                className="bg-white p-5 rounded-lg shadow-lg border border-gray-200"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  🗺️ Ride ID: {ride.id}
                </h3>
                <p><strong>📍 Pickup:</strong> {ride.pickupLocation}</p>
                <p><strong>📌 Drop:</strong> {ride.dropLocation}</p>
                <p><strong>💰 Fare:</strong> ₹{ride.fare}</p>
                <p><strong>📏 Distance:</strong> {ride.distanceInKm} km</p>
                <p><strong>📦 Status:</strong> {ride.status}</p>
                <p><strong>💳 Paid:</strong> {ride.farePaid ? "✅ Yes" : "❌ No"}</p>

                <div className="mt-4 flex justify-between items-center">
                  {ride.status === "PENDING" && (
                    <button
                      onClick={() => acceptRide(ride.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                    >
                      ✅ Accept Ride
                    </button>
                  )}
                  {ride.status === "ACCEPTED" && (
                    <button
                      onClick={() => completeRide(ride.id)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
                    >
                      🏁 Complete Ride
                    </button>
                  )}
                  {ride.status === "COMPLETED" && (
                    <span className="text-sm text-green-700 font-semibold">
                      ✅ Ride Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
