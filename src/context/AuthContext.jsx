import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginAPI,
  registerAPI,
  verifyEmailAPI,
  getUserProfileAPI,
  updateUserProfileAPI,
} from '../services/UsersSevices';
import { toast } from 'react-toastify';

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
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Kiểm tra localStorage để duy trì session
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      setToken(savedToken);
      fetchUserProfile(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async authToken => {
    try {
      setLoading(true);
      const response = await getUserProfileAPI();
      if (response?.data) {
        const userData = response.data;
        setUser(userData);
        setRole(userData.role);
        localStorage.setItem('user', JSON.stringify(userData));
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout(); // Xóa token nếu không thể lấy thông tin user
    } finally {
      setLoading(false);
    }
  };

  const login = async credentials => {
    try {
      setLoading(true);
      const response = await loginAPI(
        credentials.username,
        credentials.password,
        credentials.rememberMe || false
      );

      if (response?.data?.token) {
        const authToken = response.data.token;
        setToken(authToken);
        localStorage.setItem('token', authToken);

        // Lấy thông tin người dùng
        await fetchUserProfile(authToken);

        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error('Token không hợp lệ');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.message || 'Đăng nhập thất bại';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async registerData => {
    try {
      setLoading(true);
      const response = await registerAPI(registerData);

      if (response?.data) {
        toast.success(
          'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
        );
        return { success: true, data: response.data };
      } else {
        throw new Error('Đăng ký thất bại');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async token => {
    try {
      setLoading(true);
      const response = await verifyEmailAPI(token);

      if (response?.data?.success) {
        toast.success('Xác thực email thành công! Bạn có thể đăng nhập.');
        return { success: true };
      } else {
        throw new Error('Xác thực email thất bại');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      const errorMessage =
        error.response?.data?.message || 'Xác thực email thất bại';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.info('Đã đăng xuất');
  };

  const updateUserProfile = async updatedData => {
    try {
      setLoading(true);
      const response = await updateUserProfileAPI(updatedData);

      if (response?.data) {
        const updatedUser = { ...user, ...response.data };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Cập nhật thông tin thành công');
        return { success: true, data: updatedUser };
      } else {
        throw new Error('Cập nhật thông tin thất bại');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      const errorMessage =
        error.response?.data?.message || 'Cập nhật thông tin thất bại';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (requiredRoles = []) => {
    if (!user || !role) return false;
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(role);
  };

  const value = {
    user,
    token,
    role,
    login,
    logout,
    register,
    verifyEmail,
    updateUserProfile,
    hasPermission,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
