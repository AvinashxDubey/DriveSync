import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import './index.css';
import RegisteredVehicles from './pages/RegisteredVehicles';
import UpdatePackage from './components/UpdatePackage';
import AssignUpdate from './pages/AssignUpdate';
import RegisterVehicles from './pages/RegisterVehicles';
import Home from './pages/Home';
import RecentLogs from './components/RecentLogs';

// Authentication check
const isAuthenticated = () => localStorage.getItem("token");

// PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <PrivateRoute>
              <RegisteredVehicles />
            </PrivateRoute>
          }
        />
        <Route
          path="/updates"
          element={
            <PrivateRoute>
              <UpdatePackage />
            </PrivateRoute>
          }
        />
        <Route
          path="/assign-update"
          element={
            <PrivateRoute>
              <AssignUpdate />
            </PrivateRoute>
          }
        />
        <Route
          path="/register-vehicle"
          element={
            <PrivateRoute>
              <RegisterVehicles />
            </PrivateRoute>
          }
        />
        <Route
          path="/logs"
          element={
            <PrivateRoute>
              <RecentLogs />
            </PrivateRoute>
          }
        />

        {/* Redirect unknown routes to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
