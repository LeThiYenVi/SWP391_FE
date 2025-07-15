import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, getUserProfileAPI, logoutAPI, updateUserProfileAPI } from '../services/UsersSevices';

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
      console.log('🔐 Attempting login with:', { username: credentials.username });

      const response = await loginAPI(credentials.username, credentials.password);

      if (response.data) {
        // Dựa vào cấu trúc response thực tế từ server
        const responseData = response.data;
        console.log('📋 Full response data:', responseData);

        // Tạo đối tượng user từ dữ liệu response
        const userData = {
          username: responseData.username || credentials.username, // fallback to input username
          fullName: responseData.fullName || responseData.username || 'User',
          role: responseData.role,
          email: responseData.email
        };

        // Lưu token và user info
        setToken(responseData.accessToken);
        setUser(userData);
        localStorage.setItem('authToken', responseData.accessToken);
        localStorage.setItem('refreshToken', responseData.refreshToken);
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('✅ Login successful:', userData);
        return { success: true, user: userData };
      } else {
        console.error('❌ Login failed: Invalid response format');
        return { success: false, error: 'Phản hồi từ server không hợp lệ' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      return { success: false, error: errorMessage };
    }
  };

  const register = async registerData => {
    try {
      console.log('📝 Attempting registration with:', {
        username: registerData.username,
        email: registerData.email,
        fullName: registerData.fullName
      });

      const response = await registerAPI(registerData);

      if (response && response.success !== false) {
        console.log('✅ Registration successful');
        return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
      } else {
        console.error('❌ Registration failed:', response);
        return { success: false, error: response.message || 'Đăng ký thất bại' };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Đăng ký thất bại';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Gọi API logout
      await logoutAPI();
      console.log('✅ Logout API called successfully');
    } catch (error) {
      console.error('❌ Logout API error:', error);
      // Tiếp tục xử lý logout ở client side ngay cả khi API thất bại
    } finally {
      // Xóa dữ liệu người dùng khỏi state và localStorage
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('authToken');
      console.log('✅ User logged out successfully');
    }
  };

  const updateUserProfile = async updatedData => {
    try {
      console.log('📝 Updating user profile with:', updatedData);

      const response = await updateUserProfileAPI(updatedData);

      if (response && response.success !== false) {
        // Cập nhật thông tin người dùng trong state và localStorage
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        console.log('✅ Profile update successful');
        return { success: true, user: updatedUser };
      } else {
        console.error('❌ Profile update failed:', response);
        return { success: false, error: response?.message || 'Cập nhật thông tin thất bại' };
      }
    } catch (error) {
      console.error('❌ Profile update error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Cập nhật thông tin thất bại';
      return { success: false, error: errorMessage };
    }
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
