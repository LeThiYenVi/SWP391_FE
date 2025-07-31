import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Bell,
  Heart,
  Calendar,
  MessageCircle,
  TestTube,
  Home,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navigationItems = [
  {
    label: 'Trang chủ',
    href: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Dịch vụ',
    href: '/services',
    icon: <Heart className="w-5 h-5" />,
    children: [
      {
        label: 'Tư vấn trực tuyến',
        href: '/consultation',
        icon: <MessageCircle className="w-4 h-4" />,
        description: 'Tư vấn với chuyên gia qua video call',
      },
      {
        label: 'Theo dõi chu kỳ',
        href: '/theo-doi-chu-ky',
        icon: <Calendar className="w-4 h-4" />,
        description: 'Theo dõi và dự đoán chu kỳ sinh lý',
      },
      {
        label: 'Xét nghiệm STIs',
        href: '/xet-nghiem-sti',
        icon: <TestTube className="w-4 h-4" />,
        description: 'Đặt lịch và xem kết quả xét nghiệm',
      },
    ],
  },
  {
    label: 'Đặt lịch',
    href: '/consultation',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: 'Hỏi đáp',
    href: '/qa',
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: <MessageCircle className="w-5 h-5" />,
  },
];

// Navigation items for authenticated users (includes Dashboard)
const authenticatedNavigationItems = [
  {
    label: 'Trang chủ',
    href: '/',
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <User className="w-5 h-5" />,
  },
  {
    label: 'Dịch vụ',
    href: '/services',
    icon: <Heart className="w-5 h-5" />,
    children: [
      {
        label: 'Tư vấn trực tuyến',
        href: '/consultation',
        icon: <MessageCircle className="w-4 h-4" />,
        description: 'Tư vấn với chuyên gia qua video call',
      },
      {
        label: 'Theo dõi chu kỳ',
        href: '/theo-doi-chu-ky',
        icon: <Calendar className="w-4 h-4" />,
        description: 'Theo dõi và dự đoán chu kỳ sinh lý',
      },
      {
        label: 'Xét nghiệm STIs',
        href: '/xet-nghiem-sti',
        icon: <TestTube className="w-4 h-4" />,
        description: 'Đặt lịch và xem kết quả xét nghiệm',
      },
    ],
  },
  {
    label: 'Đặt lịch',
    href: '/consultation',
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    label: 'Hỏi đáp',
    href: '/qa',
    icon: <MessageCircle className="w-5 h-5" />,
  },
  {
    label: 'Chat',
    href: '/chat',
    icon: <MessageCircle className="w-5 h-5" />,
  },
];

export const HomePageHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeDropdown]);

  const handleDropdownToggle = (href) => {
    setActiveDropdown(activeDropdown === href ? null : href);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  const isActivePath = path => {
    return (
      location.pathname === path || location.pathname.startsWith(path + '/')
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: '#3a99b7' }}
              >
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span
                className="text-xl font-bold"
                style={{
                  background: 'linear-gradient(to right, #3a99b7, #2d7a91)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Gynexa
              </span>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {(isAuthenticated ? authenticatedNavigationItems : navigationItems).map(item => (
              <div
                key={item.href}
                className="relative dropdown-container"
              >
                {item.children ? (
                  <button
                    type="button"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 hover:bg-gray-100 ${
                      isActivePath(item.href)
                        ? 'bg-gray-100'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    style={{
                      color: isActivePath(item.href) ? '#3a99b7' : undefined,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleDropdownToggle(item.href)}
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.href}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown 
                      className="w-4 h-4 ml-1 transition-transform duration-200" 
                      style={{ 
                        transform: activeDropdown === item.href ? 'rotate(180deg)' : 'rotate(0deg)' 
                      }} 
                    />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 ${
                      isActivePath(item.href)
                        ? 'bg-gray-100'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                    style={{
                      color: isActivePath(item.href) ? '#3a99b7' : undefined,
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.href && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <div className="p-2">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <div className="mt-0.5">{child.icon}</div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-900">
                                {child.label}
                              </div>
                              {child.description && (
                                <div className="text-sm text-gray-500 mt-1">
                                  {child.description}
                                </div>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications (authenticated users only) */}
            {isAuthenticated && (
              <button className="relative p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100">
                <Bell className="w-5 h-5" />
                {/* Notification badge */}
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
              </button>
            )}

            {/* Authentication */}
            {isAuthenticated ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden sm:block">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                    >
                      <div className="py-1">
                        <Link
                          to="/user/profile"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Hồ sơ cá nhân</span>
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 bg-white"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-2 space-y-1">
                {(isAuthenticated ? authenticatedNavigationItems : navigationItems).map(item => (
                  <div key={item.href}>
                    {item.children ? (
                      <div>
                        <button
                          onClick={() => handleDropdownToggle(item.href)}
                          className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            {item.icon}
                            <span>{item.label}</span>
                          </div>
                          <ChevronDown 
                            className="w-4 h-4 transition-transform duration-200" 
                            style={{ 
                              transform: activeDropdown === item.href ? 'rotate(180deg)' : 'rotate(0deg)' 
                            }} 
                          />
                        </button>
                        {activeDropdown === item.href && (
                          <div className="ml-4 mt-1 space-y-1">
                            {item.children.map(child => (
                              <Link
                                key={child.href}
                                to={child.href}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => {
                                  setActiveDropdown(null);
                                  setIsMobileMenuOpen(false);
                                }}
                              >
                                {child.icon}
                                <span>{child.label}</span>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}; 