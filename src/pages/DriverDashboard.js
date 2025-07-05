import { useEffect, useState } from "react";
import api from "../api/axios";

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAvailableRides = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rides/available");
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
      fetchAvailableRides();
    } catch (err) {
      alert("❌ Failed to accept ride");
    }
  };

  useEffect(() => {
    fetchAvailableRides();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">🚖 Driver Dashboard</h2>
          <button
            onClick={fetchAvailableRides}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
          >
            🔄 Refresh Rides
          </button>
        </div>

        {loading ? (
          <p className="text-gray-600">Loading rides...</p>
        ) : rides.length === 0 ? (
          <p className="text-gray-600">No available rides at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rides.map((ride) => (
              <div key={ride.id} className="bg-white p-5 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">🗺️ Ride ID: {ride.id}</h3>
                <p><span className="font-semibold">📍 Pickup:</span> {ride.pickupLocation}</p>
                <p><span className="font-semibold">📌 Drop:</span> {ride.dropLocation}</p>
                <p><span className="font-semibold">💰 Fare Estimate:</span> ₹{ride.estimatedFare}</p>
                <p><span className="font-semibold">⏱️ Duration:</span> {ride.estimatedTime} mins</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded">Available</span>
                  <button
                    onClick={() => acceptRide(ride.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    ✅ Accept Ride
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
