import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUser = async () => {
    try {
      const res = await api.get('/api/users/profile');
      setUser(res.data);
    } catch (err) {
      console.error('Error loading user:', err);
      localStorage.removeItem('jwt');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', { email }); // Debug
      const res = await api.post('/auth/signin', { email, password });
      console.log('Login response:', res.data); // Debug
      
      if (res.data.jwt) {
        localStorage.setItem('jwt', res.data.jwt);
        await loadUser();
      }
      return res.data;
    } catch (err) {
      console.error('Login error:', err.response || err);
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      // Ensure data is in correct format
      const registrationData = {
        fullName: userData.fullName.trim(),
        email: userData.email.trim().toLowerCase(),
        password: userData.password,
        role: userData.role || 'ROLE_CUSTOMER'
      };
      
      console.log('Attempting registration with:', registrationData); // Debug
      
      const res = await api.post('/auth/signup', registrationData);
      console.log('Registration response:', res.data); // Debug
      
      if (res.data.jwt) {
        localStorage.setItem('jwt', res.data.jwt);
        await loadUser();
      }
      return res.data;
    } catch (err) {
      console.error('Registration error:', err.response || err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);