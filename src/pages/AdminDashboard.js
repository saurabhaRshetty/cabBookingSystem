import { useEffect, useState } from "react";
import api from "../api/axios";

export default function AdminDashboard() {
  const [drivers, setDrivers] = useState([]);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/admin/pending-drivers");
      setDrivers(res.data);
    } catch {
      alert("Failed to load pending drivers");
    }
  };

  const approveDriver = async (id) => {
    try {
      await api.post(`/admin/approve-driver/${id}`);
      alert("Driver approved");
      fetchDrivers();
    } catch {
      alert("Approval failed");
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Pending Driver Approvals</h2>
      {drivers.length === 0 ? (
        <p>No pending drivers</p>
      ) : (
        <ul>
          {drivers.map((driver) => (
            <li key={driver.id} className="mb-4 border p-4 rounded">
              <p><b>Username:</b> {driver.username}</p>
              <p><b>Email:</b> {driver.email}</p>
              <button
                onClick={() => approveDriver(driver.id)}
                className="bg-green-600 text-white px-4 py-2 rounded mt-2"
              >
                Approve
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

