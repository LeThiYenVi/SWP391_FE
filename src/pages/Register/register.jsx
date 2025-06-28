import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import './register.css';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error('Vui lòng nhập email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Email không hợp lệ');
      return false;
    }
    if (!formData.username.trim()) {
      toast.error('Vui lòng nhập tên đăng nhập');
      return false;
    }
    if (formData.username.length < 3) {
      toast.error('Tên đăng nhập phải có ít nhất 3 ký tự');
      return false;
    }
    if (!formData.password) {
      toast.error('Vui lòng nhập mật khẩu');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error('Vui lòng đồng ý với điều khoản sử dụng');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      // Đăng ký và tự động login
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      if (result.success) {
        toast.success('Đăng ký thành công! Chào mừng bạn đến với Gynexa!');
        navigate(from, { replace: true });
      } else {
        toast.error('Có lỗi xảy ra sau khi đăng ký');
      }
    } catch (error) {
      toast.error('Đăng ký thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    toast.info('Tính năng đăng ký Google sẽ có trong phiên bản tiếp theo');
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <div className="register-logo">
          <div className="logo-icon"></div>
          <span>Gynexa</span>
        </div>
        <img
          src="https://plus.unsplash.com/premium_photo-1681842975607-f3721c013f38?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Doctors"
          className="doctors-image"
        />
      </div>
      <div className="register-right">
        <Link to="/" className="close-button">
          ×
        </Link>
        <div className="register-form">
          <h2>Đăng ký tài khoản</h2>
          <p>
            Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </p>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Địa chỉ Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Nhập email của bạn"
                disabled={loading}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập của bạn"
                disabled={loading}
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  disabled={loading}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  disabled={loading}
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                disabled={loading}
                required
              />
              <label htmlFor="agreeTerms">
                Tôi đồng ý với{' '}
                <Link to="/terms" className="terms-link">
                  Điều khoản sử dụng
                </Link>{' '}
                và{' '}
                <Link to="/privacy" className="terms-link">
                  Chính sách bảo mật
                </Link>
              </label>
            </div>
            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
            <div className="divider">
              <span>Hoặc đăng ký với</span>
            </div>
            <button
              type="button"
              className="google-register"
              onClick={handleGoogleRegister}
              disabled={loading}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
              />
              Google
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
