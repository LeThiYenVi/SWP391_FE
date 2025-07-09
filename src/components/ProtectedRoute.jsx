import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, loading, hasPermission } = useAuth();
  const location = useLocation();

  // Loading khi chưa xác định được trạng thái đăng nhập
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  // Nếu chưa đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Kiểm tra quyền (nếu có yêu cầu)
  if (allowedRoles.length > 0 && !hasPermission(allowedRoles)) {
    // Nếu không đúng vai trò, chuyển về trang không có quyền
    return <Navigate to="/unauthorized" replace />;
  }

  // Nếu hợp lệ, render children
  return children;
};

export default ProtectedRoute;
