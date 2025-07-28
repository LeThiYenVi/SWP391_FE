import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginAPI, registerAPI, getUserProfileAPI, logoutAPI, updateUserProfileAPI, loginByGoogleAPI } from '../services/UsersSevices';

const AuthContext = createContext();

export { AuthContext };

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
    const savedToken = localStorage.getItem('authToken');
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

        // Kiểm tra nếu response có cấu trúc ApiResponse
        if (responseData.success !== undefined) {
          // Đây là ApiResponse format
          if (!responseData.success) {
            console.error('❌ Login failed:', responseData.message);
            return { success: false, error: responseData.message || 'Đăng nhập thất bại' };
          }
          // Lấy data từ ApiResponse
          const userData = responseData.data;
          if (userData) {
            const user = {
              id: userData.id,
              username: userData.username || credentials.username,
              fullName: userData.fullName || userData.username || 'User',
              name: userData.fullName || userData.username || 'User',
              role: userData.role,
              email: userData.email,
              avatarUrl: userData.avatarUrl
            };

            // Lưu token và user info
            setToken(userData.accessToken);
            setUser(user);
            localStorage.setItem('authToken', userData.accessToken);
            localStorage.setItem('refreshToken', userData.refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('✅ Login successful:', user);
            return { success: true, user: user };
          }
        } else {
          // Legacy format - xử lý trực tiếp response data
          const userData = {
            id: responseData.id,
            username: responseData.username || credentials.username,
            fullName: responseData.fullName || responseData.username || 'User',
            name: responseData.fullName || responseData.username || 'User',
            role: responseData.role,
            email: responseData.email,
            avatarUrl: responseData.avatarUrl
          };

          // Lưu token và user info
          setToken(responseData.accessToken);
          setUser(userData);
          localStorage.setItem('authToken', responseData.accessToken);
          localStorage.setItem('refreshToken', responseData.refreshToken);
          localStorage.setItem('user', JSON.stringify(userData));

          console.log('✅ Login successful:', userData);
          return { success: true, user: userData };
        }
      } else {
        console.error('❌ Login failed: Invalid response format');
        return { success: false, error: 'Phản hồi từ server không hợp lệ' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Xử lý ApiResponse error format
      let errorMessage = 'Đăng nhập thất bại';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Kiểm tra nếu error có cấu trúc ApiResponse
        if (errorData.success !== undefined && !errorData.success) {
          errorMessage = errorData.message || 'Đăng nhập thất bại';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const loginGoogle = async (code) => {
    try {
      console.log('🔐 Attempting Google login with code:', code?.substring(0, 30) + '...');

      const response = await loginByGoogleAPI(code);

      if (response.data) {
        const responseData = response.data;
        console.log('📋 Google login response:', responseData);

        // Kiểm tra nếu response có cấu trúc ApiResponse
        if (responseData.success !== undefined) {
          // Đây là ApiResponse format
          if (!responseData.success) {
            console.error('❌ Google login failed:', responseData.message);
            return { success: false, error: responseData.message || 'Đăng nhập Google thất bại' };
          }
          // Lấy data từ ApiResponse
          const userData = responseData.data;
          if (userData) {
            const user = {
              id: userData.id,
              username: userData.username,
              fullName: userData.fullName || userData.username || 'User',
              name: userData.fullName || userData.username || 'User',
              role: userData.role,
              email: userData.email,
              avatarUrl: userData.avatarUrl
            };

            // Lưu token và user info
            setToken(userData.accessToken);
            setUser(user);
            localStorage.setItem('authToken', userData.accessToken);
            localStorage.setItem('refreshToken', userData.refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            console.log('✅ Google login successful:', user);
            return { success: true, user: user };
          }
        } else {
          // Legacy format - xử lý trực tiếp response data
          const userData = {
            id: responseData.id,
            username: responseData.username,
            fullName: responseData.fullName || responseData.username || 'User',
            name: responseData.fullName || responseData.username || 'User',
            role: responseData.role,
            email: responseData.email,
            avatarUrl: responseData.avatarUrl
          };

          // Lưu token và user info
          setToken(responseData.accessToken);
          setUser(userData);
          localStorage.setItem('authToken', responseData.accessToken);
          localStorage.setItem('refreshToken', responseData.refreshToken);
          localStorage.setItem('user', JSON.stringify(userData));

          console.log('✅ Google login successful:', userData);
          return { success: true, user: userData };
        }
      } else {
        console.error('❌ Google login failed: Invalid response format');
        return { success: false, error: 'Phản hồi từ server không hợp lệ' };
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      
      // Xử lý ApiResponse error format
      let errorMessage = 'Đăng nhập Google thất bại';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Kiểm tra nếu error có cấu trúc ApiResponse
        if (errorData.success !== undefined && !errorData.success) {
          errorMessage = errorData.message || 'Đăng nhập Google thất bại';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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

      // Kiểm tra nếu response có cấu trúc ApiResponse
      if (response && response.success !== undefined) {
        if (response.success) {
          console.log('✅ Registration successful');
          return { success: true, message: response.message || 'Đăng ký thành công! Vui lòng đăng nhập.' };
        } else {
          console.error('❌ Registration failed:', response.message);
          return { success: false, error: response.message || 'Đăng ký thất bại' };
        }
      } else if (response && response.success !== false) {
        // Legacy format
        console.log('✅ Registration successful');
        return { success: true, message: 'Đăng ký thành công! Vui lòng đăng nhập.' };
      } else {
        console.error('❌ Registration failed:', response);
        return { success: false, error: response?.message || 'Đăng ký thất bại' };
      }
    } catch (error) {
      console.error('❌ Registration error:', error);
      
      // Xử lý ApiResponse error format
      let errorMessage = 'Đăng ký thất bại';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Kiểm tra nếu error có cấu trúc ApiResponse
        if (errorData.success !== undefined && !errorData.success) {
          errorMessage = errorData.message || 'Đăng ký thất bại';
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
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
    loginGoogle,
    logout,
    register,
    updateUserProfile,
    loading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
