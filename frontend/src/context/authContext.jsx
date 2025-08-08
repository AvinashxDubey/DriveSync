// src/context/authContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { getProfile } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchProfile = async (token) => {
    try {
      const res = await getProfile(token);
      setUser({
        name: res.data.name,
        email: res.data.email,
        role: res.data.role,
      });
    } catch (err) {
      console.error('Failed to fetch profile:', err);
      setUser(null);
    }
  };

  const login = async (token) => {
    localStorage.setItem('token', token);
    await fetchProfile(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchProfile(token);
  }, []);

  useEffect(() => {
  console.log('User in Dashboard:', user);
}, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);