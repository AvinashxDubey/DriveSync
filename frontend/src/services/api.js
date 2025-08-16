import axios from 'axios';

// Set your backend base URL here or in your .env file as VITE_API_URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // if you need cookies/sessions
});

console.log("API Base URL:", API_BASE_URL);

// Add Authorization header automatically if token exists
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// --- Auth APIs ---
export const signupUser = (userData) => API.post('/register', userData);
export const loginUser = (credentials) => API.post('/login', credentials);
export const getProfile = () => API.get('/profile');

// --- Vehicle APIs ---
// --- Update Start APIs ---
export const startVehicleUpdate = (vehicleId) => {
  return API.patch(`/update/start-update/vehicle/${vehicleId}`);
};


export const registerVehicle = (vehicleData) => API.post('/vehicle/register', vehicleData);
export const getAllVehicles = () => API.get('/vehicle/vehicles');
export const getVehicleByVin = (vin) => API.get(`/vehicle/getVehicle/${vin}`);
export const updateVehicle = (vin, vehicleData) => API.put(`/vehicle/update/${vin}`, vehicleData);
export const deleteVehicle = (vin) => API.delete(`/vehicle/delete/${vin}`);
export const getUserVehicleCount = () => API.get('/vehicle/count');
// --- Vehicle APIs ---
export const getVehiclesWithAssignedUpdate = () => {
  return API.get('/update/vehicles-assigned-update');
};

// --- Update Package APIs ---
export const createUpdatePackage = (packageData) => API.post('/update/addPackage', packageData);
export const getAllUpdatePackages = () => API.get('/update/updates');

export const assignUpdateToVehicle = (vehicleId, body) => {
  return API.patch(`/update/vehicle/${vehicleId}`, body);
};export const getUserAssignedUpdateCount = () => API.get('/update/my-updates/count');
export const getAdminCreatedUpdateCount = () => API.get('/update/admin-updates/count');

// --- Log APIs ---

export const logUpdateStatus = (vehicleId, statusData) => {
  return API.patch(`/log/status/vehicle/${vehicleId}`, statusData);
};
export const getLogsByVehicle = (vin) => API.get(`/log/logs/${vin}`);
export const getLogsByVehicleId = (vehicleId) => API.get(`/log/vehicle/${vehicleId}`);
