import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar,
  ClipboardList,
  TestTube,
  Upload,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import StaffAppointments from './StaffAppointments';
import StaffSampleCollection from './StaffSampleCollection';
import StaffUploadResult from './StaffUploadResult';
import StaffServiceInput from './StaffServiceInput';

const StaffLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const renderCurrentPage = () => {
    const path = location.pathname;

    if (path === '/staff/sample-collection') {
      return <StaffSampleCollection />;
    } else if (path === '/staff/upload-result') {
      return <StaffUploadResult />;
    } else if (path === '/staff/service-input') {
      return <StaffServiceInput />;
    } else {
      // Default to appointments for /staff and /staff/appointments
      return <StaffAppointments />;
    }
  };

  const menuItems = [
    {
      path: '/staff/appointments',
      name: 'Lịch xét nghiệm',
      icon: <Calendar className="w-5 h-5" />,
    },
    {
      path: '/staff/sample-collection',
      name: 'Lấy mẫu xét nghiệm',
      icon: <TestTube className="w-5 h-5" />,
    },
    {
      path: '/staff/upload-result',
      name: 'Kết quả xét nghiệm',
      icon: <Upload className="w-5 h-5" />,
    },
    {
      path: '/staff/service-input',
      name: 'Quản lý dịch vụ',
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for larger screens */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <h2 className="text-xl font-bold text-pink-600">Gynexa Staff</h2>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md md:hidden hover:bg-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-6">
          <ul className="space-y-4">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive ? 'bg-pink-100 text-pink-600' : 'hover:bg-gray-100'
                  }`
                }
              >
                <Home className="w-5 h-5 mr-3" />
                <span>Trang chủ</span>
              </NavLink>
            </li>

            {menuItems.map(item => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-pink-100 text-pink-600'
                        : 'hover:bg-gray-100'
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={toggleSidebar}
              className="p-1 rounded-md md:hidden hover:bg-gray-200"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="text-lg font-semibold">
              {menuItems.find(item => item.path === location.pathname)?.name ||
                'Trang nhân viên'}
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-sm font-medium">Nhân viên</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
