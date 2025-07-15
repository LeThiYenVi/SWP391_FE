import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Heart,
} from 'lucide-react';
import './ConsultantLayout.css';
import { useAuth } from '../../context/AuthContext';

const ConsultantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

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
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isActiveRoute = path => {
    return location.pathname === path;
  };

  return (
    <div className="consultant-layout">
      {/* Navbar consultant */}
      <nav style={{width:'100%',position:'fixed',top:0,left:0,zIndex:300,background:'#fff',borderBottom:'1px solid #e5e7eb',height:64,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px',boxShadow:'0 2px 8px rgba(0,0,0,0.03)'}}>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <Link to="/" style={{display:'flex',alignItems:'center',gap:8,textDecoration:'none'}}>
            <span style={{background:'#3a99b7',borderRadius:8,width:36,height:36,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Heart size={22} color="#fff" />
            </span>
            <span style={{fontWeight:700,fontSize:'1.2rem',background:'linear-gradient(to right,#3a99b7,#2d7a91)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>Gynexa</span>
          </Link>
          <Link to="/consultant/dashboard" style={{marginLeft:24,color:'#334155',fontWeight:600,textDecoration:'none'}}>Dashboard</Link>
          <Link to="/consultant/appointments" style={{marginLeft:16,color:'#334155',fontWeight:600,textDecoration:'none'}}>Lịch hẹn</Link>
          <Link to="/consultant/messages" style={{marginLeft:16,color:'#334155',fontWeight:600,textDecoration:'none'}}>Tin nhắn</Link>
          <Link to="/consultant/profile" style={{marginLeft:16,color:'#334155',fontWeight:600,textDecoration:'none'}}>Hồ sơ</Link>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <img src={consultantData.avatar} alt={consultantData.name} style={{width:36,height:36,borderRadius:'50%',objectFit:'cover',border:'2px solid #e0e7ef'}} />
          <span style={{fontWeight:600,color:'#334155',fontSize:'1rem'}}>{consultantData.name}</span>
          <button className="logout-btn" onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:8,background:'none',border:'none',color:'#dc2626',fontWeight:600,cursor:'pointer',fontSize:'1rem',padding:'6px 16px',borderRadius:8,transition:'background 0.2s'}}>
            <LogOut size={18} /> Đăng xuất
          </button>
        </div>
      </nav>

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
