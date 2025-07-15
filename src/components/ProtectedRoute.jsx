import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, loading, user } = useAuth();
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
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    console.log('Checking role access:', { userRole, allowedRoles });
    
    // Kiểm tra cả role gốc và role đã format
    let hasAccess = false;
    if (userRole) {
      // Kiểm tra role gốc
      if (allowedRoles.includes(userRole)) {
        hasAccess = true;
      }
      // Kiểm tra role đã format (bỏ ROLE_)
      const formattedRole = userRole.replace('ROLE_', '').toLowerCase();
      if (allowedRoles.includes(formattedRole)) {
        hasAccess = true;
      }
      // Kiểm tra role đã format và viết hoa chữ cái đầu
      const capitalizedRole = formattedRole.charAt(0).toUpperCase() + formattedRole.slice(1);
      if (allowedRoles.includes(capitalizedRole)) {
        hasAccess = true;
      }
    }
    
    if (!hasAccess) {
      console.log('Access denied: role mismatch. User role:', userRole, 'Allowed roles:', allowedRoles);
      // Nếu không đúng vai trò, chuyển về trang không có quyền
      return <Navigate to="/unauthorized" replace />;
    }
    
    console.log('Access granted for role:', userRole);
  }

  // Nếu hợp lệ, render children
  return children;
};

export default ProtectedRoute;
