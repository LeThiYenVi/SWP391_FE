import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Loading khi chưa xác định được trạng thái đăng nhập
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Nếu cần kiểm tra vai trò
  // if (allowedRoles && allowedRoles.length > 0) {
  //   const token = localStorage.getItem('token');
  //   try {
  //     const decoded = jwtDecode(token);
  //     const userRole = decoded?.Role;

  //     if (!allowedRoles.includes(userRole)) {
  //       // Nếu không đúng vai trò, chuyển về trang không có quyền
  //       return <Navigate to="/unauthorized" replace />;
  //     }
  //   } catch (error) {
  //     console.error('Lỗi decode token:', error);
  //     localStorage.removeItem('token');
  //     return <Navigate to="/login" replace />;
  //   }
  // }

  // Nếu hợp lệ, render children
  return children;
};

export default ProtectedRoute;
