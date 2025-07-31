import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ redirect khi không còn loading và user đã đăng nhập
    if (!loading && user) {
      // Redirect user đã đăng nhập đến dashboard
      navigate('/dashboard', { replace: true });
    }
  }, [user, loading, navigate]);

  // Nếu đang loading hoặc user chưa đăng nhập, hiển thị children (trang home)
  if (loading || !user) {
    return children;
  }

  // Nếu user đã đăng nhập, không hiển thị gì (sẽ redirect)
  return null;
};

export default AuthRedirect; 