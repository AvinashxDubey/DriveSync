import '../styles/dashboard.css';
import {
  FaCarSide,
  FaPlusCircle,
  FaSyncAlt,
  FaFileAlt,
  FaClipboardCheck
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useEffect, useState } from 'react';
import {
  getUserVehicleCount,
  getUserAssignedUpdateCount,
  getUserUpdateLogCount
} from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [vehicleCount, setVehicleCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);
  const [logCount, setLogCount] = useState(0);

  useEffect(() => {
    if (user?.role !== 'admin') {
      getUserVehicleCount().then((res) => setVehicleCount(res.data.count)).catch(() => {});
      getUserAssignedUpdateCount().then((res) => setUpdateCount(res.data.count)).catch(() => {});
      getUserUpdateLogCount().then((res) => setLogCount(res.data.count)).catch(() => {});
    }
  }, [user]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      <h2>{user?.role === 'admin' ? 'Admin Dashboard' : 'User Dashboard'}</h2>

      <div className="dashboard-cards">
        {user?.role !== 'admin' && (
          <>
            <div className="card" onClick={() => handleNavigation('/vehicles')}>
              <FaCarSide className="icon" />
              <h3>Registered Vehicles</h3>
              <p>{vehicleCount}</p>
            </div>

            <div className="card" onClick={() => handleNavigation('/register-vehicle')}>
              <FaPlusCircle className="icon" />
              <h3>Register Vehicle</h3>
              <p>New</p>
            </div>

            <div className="card" onClick={() => handleNavigation('/updates')}>
              <FaSyncAlt className="icon" />
              <h3>Update Packages</h3>
              <p>{updateCount}</p>
            </div>

            <div className="card" onClick={() => handleNavigation('/logs')}>
              <FaFileAlt className="icon" />
              <h3>Recent Logs</h3>
              <p>{logCount}</p>
            </div>
          </>
        )}

        {user?.role === 'admin' && (
          <div className="card" onClick={() => handleNavigation('/assign-update')}>
            <FaClipboardCheck className="icon" />
            <h3>Assign Updates</h3>
            <p>To Vehicles</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
