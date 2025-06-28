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
    try {
      // Mock API call - thay thế bằng API thực tế
      const userData = {
        id: 1,
        name: credentials.username,
        email: `${credentials.username}@example.com`,
        role: 'user',
        avatar: null,
        cycleData: {
          lastPeriod: null,
          cycleLength: 28,
          periodLength: 5,
        },
      };
      // Giả lập token
      const fakeToken = 'mocked_token_123456';
      setUser(userData);
      setToken(fakeToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', fakeToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async registerData => {
    try {
      // Mock API call - thay thế bằng API thực tế
      // Đăng ký thành công thì tự động login
      const userData = {
        id: 2,
        name: registerData.username,
        email: registerData.email,
        role: 'user',
        avatar: null,
        cycleData: {
          lastPeriod: null,
          cycleLength: 28,
          periodLength: 5,
        },
      };
      // Giả lập token
      const fakeToken = 'mocked_token_654321';
      setUser(userData);
      setToken(fakeToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', fakeToken);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
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
