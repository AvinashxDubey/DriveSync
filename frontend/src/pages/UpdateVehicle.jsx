import React, { useEffect, useState } from "react";
import "../styles/UpdateVehicle.css";
import Navbar from "../components/Navbar";

// Import API wrappers
import {
  getVehiclesWithAssignedUpdate,
  startVehicleUpdate,
  logUpdateStatus,
} from "../services/api";

const UpdateVehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [progressMap, setProgressMap] = useState({}); // vehicleId -> progress %
  const [completedMap, setCompletedMap] = useState({}); // vehicleId -> boolean
  const [updatedMap, setUpdatedMap] = useState({}); // vehicleId -> boolean

  // Fetch vehicles with assigned updates
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const { data } = await getVehiclesWithAssignedUpdate();
        setVehicles(data);
      } catch (err) {
        console.error("Failed to fetch vehicles:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Handle update click
  const handleUpdateClick = async (vehicleId) => {
    try {
      setUpdating(vehicleId);
      setProgressMap((prev) => ({ ...prev, [vehicleId]: 0 }));
      setCompletedMap((prev) => ({ ...prev, [vehicleId]: false }));
      setUpdatedMap((prev) => ({ ...prev, [vehicleId]: false }));

      // 1. Start update via API
      await startVehicleUpdate(vehicleId);
      alert("Vehicle update started successfully!");

      // 2. Function to log progress
      const sendUpdateLog = async (progress) => {
        const status = progress === 100 ? "completed" : "in progress";
        const message = `Update progress: ${progress}%`;

        await logUpdateStatus(vehicleId, { status, message, progress });

        setProgressMap((prev) => ({ ...prev, [vehicleId]: progress }));
      };

      // 3. Simulate logs every second until 100%
      for (let progress = 10; progress <= 100; progress += 10) {
        await sendUpdateLog(progress);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      setCompletedMap((prev) => ({ ...prev, [vehicleId]: true }));
      setUpdatedMap((prev) => ({ ...prev, [vehicleId]: true }));
      alert("Update completed!");
    } catch (err) {
      console.error("Update error:", err);
      alert(
        `Failed to start vehicle update: ${
          err.response?.data?.message || err.message
        }`
      );
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="update-vehicle-page">
      <Navbar />
      <h1 className="update-vehicle-title">Vehicles Assigned Updates</h1>

      {loading ? (
        <p className="no-vehicles">Loading...</p>
      ) : vehicles.length === 0 ? (
        <p className="no-vehicles">No vehicles with assigned updates found.</p>
      ) : (
        <div className="vehicle-list">
          {vehicles.map((vehicle) => (
            <div key={vehicle._id} className="vehicle-card">
              {/* Progress bar */}
              {updating === vehicle._id &&
                progressMap[vehicle._id] > 0 &&
                progressMap[vehicle._id] < 100 && (
                  <div className="progress-bar-wrapper">
                    <div
                      className="progress-bar"
                      style={{ width: `${progressMap[vehicle._id]}%` }}
                    />
                  </div>
                )}

              {completedMap[vehicle._id] && (
                <p className="update-completed-text">Update Completed!</p>
              )}

              <h2>{vehicle.model || "Unknown Model"}</h2>
              <p>VIN: {vehicle.vin}</p>
              <p>
                Assigned Update: {vehicle.assignedUpdate?.version || "N/A"}
              </p>

              <button
                className={`update-btn ${
                  vehicle.updateInProgress ? "in-progress" : ""
                }`}
                onClick={() => handleUpdateClick(vehicle._id)}
                disabled={
                  updating === vehicle._id ||
                  vehicle.updateInProgress ||
                  updatedMap[vehicle._id]
                }
              >
                {vehicle.updateInProgress
                  ? "Update In Progress"
                  : updating === vehicle._id
                  ? "Updating..."
                  : updatedMap[vehicle._id]
                  ? "Updated"
                  : "Start Update"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpdateVehicle;
