import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('access_token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      api.get('/users/me/')
        .then(response => setUser(response.data))
        .catch(() => {
          logout();
        });
    }
  }, [token]);

  const login = async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    try {
      const response = await api.post('/token', formData);
      const accessToken = response.data.access_token;
      localStorage.setItem('access_token', accessToken);
      setToken(accessToken);
      return true;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  };

  const register = async (username, password, phoneNumber) => {
    try {
      await api.post('/users/', { username, password, phone_number: phoneNumber });
      return { success: true };
    } catch (error) {
      console.error("Registration failed", error);
      // Return error message if available
      return { 
        success: false, 
        message: error.response?.data?.detail || "注册失败，请稍后重试" 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

