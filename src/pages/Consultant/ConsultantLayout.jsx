import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import ConsultantDashboard from './ConsultantDashboard';
import ConsultantAppointments from './ConsultantAppointments';
import ConsultantMessages from './ConsultantMessages';
import ConsultantProfile from './ConsultantProfile';
import {
  Menu,
  X,
  Bell,
  User,
  Activity,
  Calendar,
  MessageCircle,
  Settings,
  LogOut,
} from 'lucide-react';
import './ConsultantLayout.css';

const ConsultantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const consultantData = {
    name: 'Dr. Nguyễn Thị Hương',
    specialty: 'Chuyên khoa Sản Phụ khoa',
    avatar:
      'https://www.hoilhpn.org.vn/documents/20182/3458479/28_Feb_2022_115842_GMTbsi_thuhien.jpg/c04e15ea-fbe4-415f-bacc-4e5d4cc0204d',
    onlineStatus: true,
  };

  const navigationItems = [
    {
      path: '/consultant/dashboard',
      icon: Activity,
      label: 'Tổng quan',
      badge: null,
    },
    {
      path: '/consultant/appointments',
      icon: Calendar,
      label: 'Cuộc hẹn',
      badge: '5',
    },
    {
      path: '/consultant/messages',
      icon: MessageCircle,
      label: 'Tin nhắn',
      badge: '12',
    },
    {
      path: '/consultant/profile',
      icon: User,
      label: 'Hồ sơ',
      badge: null,
    },
  ];

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActiveRoute = path => {
    return location.pathname === path;
  };

  return (
    <div className="consultant-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="mobile-header-content">
          <h1>Bảng điều khiển</h1>
          <div className="mobile-header-actions">
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <button className="mobile-menu-btn" onClick={toggleSidebar}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`consultant-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="sidebar-close-btn" onClick={toggleSidebar}>
            <X size={20} />
          </button>
          <div className="consultant-profile">
            <img src={consultantData.avatar} alt={consultantData.name} />
            <div className="consultant-info">
              <h3>{consultantData.name}</h3>
              <p>{consultantData.specialty}</p>
              <div className="consultant-status">
                <div className="status-indicator"></div>
                <span>Đang trực tuyến</span>
              </div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navigationItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActiveRoute(item.path) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="consultant-main">
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/consultant/dashboard" replace />}
          />
          <Route path="/dashboard" element={<ConsultantDashboard />} />
          <Route path="/appointments" element={<ConsultantAppointments />} />
          <Route path="/messages" element={<ConsultantMessages />} />
          <Route path="/profile" element={<ConsultantProfile />} />
        </Routes>
      </main>
    </div>
  );
};

export default ConsultantLayout;
