import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Kiểm tra localStorage để duy trì session
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const login = async credentials => {
    // TODO: Gọi API thực tế để đăng nhập
    return { success: false, error: 'Chưa triển khai API thực tế' };
  };

  const register = async registerData => {
    // TODO: Gọi API thực tế để đăng ký
    return { success: false, error: 'Chưa triển khai API thực tế' };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUserProfile = updatedData => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    login,
    logout,
    register,
    updateUserProfile,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
