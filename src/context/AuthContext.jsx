import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  loginAPI,
  loginByGoogleAPI,
  registerAPI,
} from '../services/UsersSevices';

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

    console.log('Saved user from localStorage:', savedUser);

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      console.log('Parsed user from localStorage:', parsedUser);
      console.log('User role from localStorage:', parsedUser.role);
      setUser(parsedUser);
    }
    if (savedToken) {
      setToken(savedToken);
    }
    setLoading(false);

    // Add a storage event listener to sync state across tabs/components
    const syncState = () => {
      const latestUser = localStorage.getItem('user');
      const latestToken = localStorage.getItem('token');
      setUser(latestUser ? JSON.parse(latestUser) : null);
      setToken(latestToken);
    };

    window.addEventListener('storage', syncState);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('storage', syncState);
    };
  }, []);

  const login = async credentials => {
    try {
      // Call the actual API with username and password
      const response = await loginAPI(
        credentials.username,
        credentials.password
      );

      // Lấy data từ response object
      const data = response.data || response;

      const accessToken = data.accessToken || data.token || data.jwt || '';
      if (data && accessToken) {
        console.log('Raw login response:', data);
        console.log('Response type:', typeof data);
        console.log('Response keys:', Object.keys(data));

        // Lấy dữ liệu từ data với xử lý fallback an toàn
        const refreshToken = data.refreshToken || '';

        // QUAN TRỌNG: In ra từng giá trị để kiểm tra
        console.log('DEBUGGING - accessToken:', accessToken);
        console.log('DEBUGGING - refreshToken:', refreshToken);
        console.log('DEBUGGING - username:', data.username);
        console.log('DEBUGGING - role:', data.role);
        console.log('DEBUGGING - email:', data.email);

        // Kiểm tra các trường dữ liệu có thể thiếu
        let username = data.username;
        if (!username && data.fullName) username = data.fullName;
        if (!username && data.name) username = data.name;

        const role = data.role || 'USER';
        const email = data.email || '';

        console.log('Extracted username:', username);
        console.log('Extracted role:', role);

        // Format the role for a cleaner display
        let formattedRole = '';
        if (role && typeof role === 'string' && role.includes('ROLE_')) {
          formattedRole = role.replace('ROLE_', '').toLowerCase();
          formattedRole =
            formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1);
        } else if (role && typeof role === 'string') {
          formattedRole =
            role.charAt(0).toUpperCase() + role.toLowerCase().slice(1);
        } else {
          formattedRole = 'User';
        }

        // Đảm bảo luôn có tên người dùng, nếu không thì dùng username đăng nhập
        const displayName = username || credentials?.username || 'Người dùng';

        console.log('Display name chosen:', displayName);

        // Đảm bảo rằng tên người dùng được lấy từ phản hồi API
        const userData = {
          name: displayName, // This will be shown in the UI
          role,
          email: email || '', // Use the actual email if available
          // Thêm các trường khác nếu cần
        };

        console.log('Final userData being saved:', userData);
        console.log('Username that will be shown:', displayName);
        console.log('Role being saved:', role);

        // Cập nhật state với đối tượng đã tạo
        setUser(userData);
        setToken(accessToken);

        // Store information in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken); // Also store the refresh token

        // Dispatch a custom storage event to trigger state sync in the provider
        window.dispatchEvent(new Event('storage'));

        // NEW: Return user data including role for navigation
        return { success: true, user: userData };
      } else {
        // Handle cases where login fails (e.g., wrong credentials)
        return {
          success: false,
          error: data?.message || 'Invalid credentials',
        };
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Login failed with exception:', error);
      // Re-throw the error to be caught by the component
      throw error;
    }
  };

  const register = async userData => {
    try {
      await registerAPI(userData);

      const loginResponse = await loginAPI(
        userData.username,
        userData.password
      );

      // Lấy data từ loginResponse object
      const data = loginResponse.data || loginResponse;

      const accessToken = data.accessToken || data.token || data.jwt || '';
      if (data && accessToken) {
        const refreshToken = data.refreshToken || '';
        const username = data.username;
        const role = data.role;

        console.log('Register+Login response:', data);
        console.log('Username after register:', username);
        console.log('Role after register:', role);
        console.log('Email from form:', userData.email);

        // After registration, we have the email from the form.
        // The login response gives us the full name (in the `username` field).
        const userToSave = {
          name:
            username || userData.fullName || userData.username || 'Người dùng',
          role,
          email: userData.email,
        };

        setUser(userToSave);
        setToken(accessToken);

        localStorage.setItem('user', JSON.stringify(userToSave));
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Dispatch a custom storage event to trigger state sync in the provider
        window.dispatchEvent(new Event('storage'));

        // NEW: Return user data for navigation
        return { success: true, user: userToSave };
      } else {
        return {
          success: false,
          error: 'Đăng ký thành công, nhưng đăng nhập thất bại.',
        };
      }
    } catch (error) {
      console.error('Registration failed:', error);

      // Logic xử lý lỗi được cải tiến để bắt được nhiều loại response
      let errorMessage = 'Đã có lỗi xảy ra trong quá trình đăng ký.'; // Tin nhắn mặc định
      if (error.response && error.response.data) {
        // Nếu backend trả về một chuỗi (string), sử dụng trực tiếp chuỗi đó
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
        // Nếu backend trả về một object, tìm thuộc tính message
        else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        }
      }

      // Ném lỗi với thông báo đã được xử lý để component có thể bắt và hiển thị
      throw new Error(errorMessage);
    }
  };

  const loginGoogle = async idToken => {
    try {
      const response = await loginByGoogleAPI(idToken);
      console.log('[AuthContext] Google API Response:', response);

      if (response && response.accessToken) {
        const { accessToken, refreshToken, username, role, email } = response;

        console.log('Google Login - Username:', username);
        console.log('Google Login - Role:', role);
        console.log('Google Login - Email:', email);

        const userData = {
          name: username || email.split('@')[0] || 'Người dùng',
          role,
          email: email,
        };

        setUser(userData);
        setToken(accessToken);

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Dispatch a custom storage event to trigger state sync in the provider
        window.dispatchEvent(new Event('storage'));

        // NEW: Return user data including role for navigation
        return { success: true, user: userData };
      } else {
        return {
          success: false,
          error: response?.message || 'Invalid credentials from Google',
        };
      }
    } catch (error) {
      console.error('Google Login failed in AuthContext:', error);
      const errorMessage =
        error.response?.data?.message || 'Lỗi kết nối hoặc xác thực Google.';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    // Dispatch a custom storage event to trigger state sync in the provider
    window.dispatchEvent(new Event('storage'));
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
    loginGoogle,
    logout,
    register,
    updateUserProfile,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
