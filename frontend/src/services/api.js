import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const signupUser = (userData) => API.post('/register', userData);
export const loginUser = (credentials) => API.post('/login', credentials);
export const getProfile = (token) => API.get('/profile', token);

// Contact Us API
export const submitContactMessage = (contactData) => API.post('/contact-us', contactData);

// Vehicle APIs
export const registerVehicle = (vehicleData) => API.post('/vehicle/register', vehicleData);
export const getAllVehicles = () => API.get('/vehicle/vehicles');
export const getVehicleByVin = (vin) => API.get(`/vehicle/getVehicle/${vin}`);
export const updateVehicle = (vin, vehicleData) => API.put(`/vehicle/update/${vin}`, vehicleData);
export const deleteVehicle = (vin) => API.delete(`/vehicle/delete/${vin}`);
export const getUserVehicleCount = () => API.get('/vehicle/count');

// Update Package APIs
export const createUpdatePackage = (packageData) => API.post('/update/addPackage', packageData);
export const getAllUpdatePackages = () => API.get('/update/updates');
export const assignUpdateToVehicle = (vehicleId, data) =>
  API.post(`/update/vehicle/${vehicleId}`, data);
export const getUserAssignedUpdateCount = () => API.get('/update/my-updates/count');
export const getAdminCreatedUpdateCount = () => API.get('/update/admin-updates/count');

// Log APIs
export const logUpdateStatus = (vin, statusData) => API.post(`/log/status/${vin}`, statusData);
export const getLogsByVehicle = (vin) => API.get(`/log/logs/${vin}`);
export const getUserUpdateLogCount = () => API.get('/log/count');
