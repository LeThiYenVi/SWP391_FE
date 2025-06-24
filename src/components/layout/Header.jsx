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
        href: '/cycle-tracking',
        icon: <Calendar className="w-4 h-4" />,
        description: 'Theo dõi và dự đoán chu kỳ sinh lý',
      },
      {
        label: 'Xét nghiệm STIs',
        href: '/sti-testing',
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
];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

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
            {navigationItems.map(item => (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() =>
                  item.children && setActiveDropdown(item.href)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200 hover:bg-gray-100
                    ${
                      isActivePath(item.href)
                        ? 'bg-gray-100'
                        : 'text-gray-700 hover:text-gray-900'
                    }
                  `}
                  style={{
                    color: isActivePath(item.href) ? '#3a99b7' : undefined,
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.children && <ChevronDown className="w-4 h-4 ml-1" />}
                </Link>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.children && activeDropdown === item.href && (
                    <motion.div
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        {item.children.map(child => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
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
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-6 h-6" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            )}

            {/* Authentication */}
            {isAuthenticated ? (
              /* User Menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Menu người dùng"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: '#3a99b7' }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">
                            Trang cá nhân
                          </span>
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700">Cài đặt</span>
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">Đăng xuất</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Login/Register Buttons */
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                  style={{
                    background: '#3a99b7',
                    ':hover': {
                      background: '#2d7a91',
                    },
                  }}
                  onMouseEnter={e => (e.target.style.background = '#2d7a91')}
                  onMouseLeave={e => (e.target.style.background = '#3a99b7')}
                >
                  Đăng ký
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 py-6 space-y-4">
              {navigationItems.map(item => (
                <div key={item.href}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-colors
                      ${
                        isActivePath(item.href)
                          ? 'bg-gray-100'
                          : 'text-gray-700'
                      }
                    `}
                    style={{
                      color: isActivePath(item.href) ? '#3a99b7' : undefined,
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>

                  {/* Mobile Submenu */}
                  {item.children && (
                    <div className="ml-8 mt-2 space-y-2">
                      {item.children.map(child => (
                        <Link
                          key={child.href}
                          to={child.href}
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.icon}
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Mobile Auth Section */}
              {!isAuthenticated && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => {
                        navigate('/register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-sm font-medium text-white rounded-lg transition-all"
                      style={{ background: '#3a99b7' }}
                      onMouseEnter={e =>
                        (e.target.style.background = '#2d7a91')
                      }
                      onMouseLeave={e =>
                        (e.target.style.background = '#3a99b7')
                      }
                    >
                      Đăng ký
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close menus */}
      {(isUserMenuOpen || activeDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false);
            setActiveDropdown(null);
          }}
        />
      )}
    </header>
  );
};

export default Header;
