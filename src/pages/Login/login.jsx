import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import './login.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = e => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!credentials.username.trim() || !credentials.password.trim()) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);

    try {
      const result = await login(credentials);

      if (result.success) {
        toast.success('Đăng nhập thành công!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast.info('Tính năng đăng nhập Google sẽ có trong phiên bản tiếp theo');
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <div className="logo-icon"></div>
          <span>Gynexa</span>
        </div>
        <img
          src="https://plus.unsplash.com/premium_photo-1681842975607-f3721c013f38?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Doctors"
          className="doctors-image"
        />
      </div>

      <div className="login-right">
        <Link to="/" className="close-button">
          ✕
        </Link>

        <div className="login-form">
          <h2>Chào mừng trở lại</h2>
          <p>
            Bạn chưa có tài khoản? <Link to="/register">Đăng kí</Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Nhập tên đăng nhập của bạn"
                disabled={loading}
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleInputChange}
                  placeholder="••••••••••"
                  disabled={loading}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </span>
              </div>
            </div>

            <div className="options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember">Ghi nhớ mật khẩu</label>
              </div>
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>

            <div className="divider">
              <span>Hoặc đăng nhập với</span>
            </div>

            <button
              type="button"
              className="google-login"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
              />
              Google
            </button>
          </form>

          {/* Demo credentials */}
          <div className="demo-info">
            <h4>Thông tin demo:</h4>
            <p>
              Tên đăng nhập: <strong>demo</strong>
            </p>
            <p>
              Mật khẩu: <strong>123456</strong>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
