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
];

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  // Debugging: Log user data whenever it changes
  React.useEffect(() => {
    console.log('User data in Header:', user);
  }, [user]);

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

  const handleDropdownEnter = (href) => {
    setActiveDropdown(href);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
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
            {navigationItems.map(item => (
              <div
                key={item.href}
                className="relative dropdown-container"
                onMouseEnter={() =>
                  item.children && handleDropdownEnter(item.href)
                }
                onMouseLeave={handleDropdownLeave}
              >
                {item.children ? (
                  <button
                    type="button"
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-100 ${
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
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === item.href ? null : item.href
                      )
                    }
                    aria-haspopup="true"
                    aria-expanded={activeDropdown === item.href}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    <ChevronDown className="w-4 h-4 ml-1" />
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
                    <>
                      {/* Invisible bridge to prevent dropdown from closing */}
                      <div 
                        className="absolute top-full left-0 w-full h-4 bg-transparent"
                        style={{ marginTop: '-4px' }}
                      />
                      <motion.div
                        className="absolute top-full left-0 mt-1 w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        style={{ marginTop: '4px' }}
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
                    </>
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
                  className="flex items-center space-x-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Menu người dùng"
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background:
                        'linear-gradient(135deg, #3a99b7 0%, #2d7a91 100%)',
                    }}
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
                  <div className="hidden sm:flex flex-col justify-center items-start max-w-[150px]">
                    <div className="text-sm font-medium text-gray-900 truncate w-full">
                      {user?.name || 'Người dùng'}
                    </div>
                    {user?.email && (
                      <div className="text-xs text-gray-500 truncate w-full">
                        {user.email}
                      </div>
                    )}
                    {user?.role && (
                      <div className="text-xs text-gray-500 truncate w-full mt-0.5">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                          {user.role
                            .replace('ROLE_', '')
                            .charAt(0)
                            .toUpperCase() +
                            user.role
                              .replace('ROLE_', '')
                              .slice(1)
                              .toLowerCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 ml-1" />
                </button>

                {/* User Dropdown */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      {/* User info header */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="font-medium text-sm truncate">
                          {user?.name || 'Người dùng'}
                        </div>
                        {user?.email && (
                          <div className="text-xs text-gray-500 truncate mt-0.5">
                            {user.email}
                          </div>
                        )}
                        <div className="text-xs text-gray-500 truncate mt-0.5">
                          {user?.role && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              {user.role
                                .replace('ROLE_', '')
                                .charAt(0)
                                .toUpperCase() +
                                user.role
                                  .replace('ROLE_', '')
                                  .slice(1)
                                  .toLowerCase()}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Dashboard
                          </span>
                        </Link>
                        <Link
                          to="/user/profile"
                          className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Hồ sơ cá nhân
                          </span>
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center flex-shrink-0">
                            <Settings className="w-4 h-4 text-gray-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">
                            Cài đặt
                          </span>
                        </Link>
                        <hr className="my-2" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                        >
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
                            <LogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <span className="text-sm font-medium">Đăng xuất</span>
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
                className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                aria-label="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
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
                  {item.children ? (
                    <>
                      <div className="px-4 py-3 text-base font-medium text-gray-700">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </div>
                      {/* Mobile Submenu */}
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
                    </>
                  ) : (
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
                  )}
                </div>
              ))}

              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-gray-200">
                {isAuthenticated ? (
                  <div className="space-y-3">
                    {/* User info in mobile menu */}
                    <div className="px-4 py-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: '#3a99b7' }}
                        >
                          {user?.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.name || 'Người dùng'}
                          </p>
                          {user?.email && (
                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          )}
                          {user?.role && (
                            <p className="text-xs mt-1">
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                {user.role
                                  .replace('ROLE_', '')
                                  .charAt(0)
                                  .toUpperCase() +
                                  user.role
                                    .replace('ROLE_', '')
                                    .slice(1)
                                    .toLowerCase()}
                              </span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Link
                      to="/user/profile"
                      className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-5 h-5 text-gray-500" />
                      <span className="text-base text-gray-700">
                        Hồ sơ cá nhân
                      </span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors text-left"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-base">Đăng xuất</span>
                    </button>
                  </div>
                ) : (
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
                )}
              </div>
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
