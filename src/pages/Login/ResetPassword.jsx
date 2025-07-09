import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { resetPasswordAPI } from '../../services/UsersSevices';
import './login.css';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Check verification from OTP flow first
    if (location.state?.verified && location.state?.email) {
      // Get token stored in sessionStorage from OTP verification
      const storedToken = sessionStorage.getItem('resetToken');
      if (storedToken) {
        setToken(storedToken);
        setEmail(location.state.email);
        console.log('Reset token from OTP verification found');
      } else {
        // If we have verified but no token, use the email as token temporarily
        // Backend might use email + verification status to allow reset
        setToken(location.state.email);
        setEmail(location.state.email);
      }
      return;
    }
    
    // If no verification from OTP, check URL parameters (old flow)
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
      console.log('Reset password token found:', tokenParam.substring(0, 10) + '...');
      
      // Kiểm tra xem token có phải là một chuỗi hợp lệ
      if (tokenParam.length < 10) {
        toast.error('Token reset mật khẩu không hợp lệ');
        navigate('/login');
      }
    } else {
      // No token and no verification - redirect to forgot password
      toast.error('Vui lòng xác thực OTP trước khi đặt lại mật khẩu');
      navigate('/forgot-password');
    }
  }, [searchParams, navigate, location.state]);

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới');
      return false;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
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
      console.log('Submitting new password with token');
      
      // If we have an email from OTP flow, include it in the request
      if (email) {
        // We might need to update the API to handle email for OTP-verified reset
        await resetPasswordAPI(token, formData.newPassword, { email });
      } else {
        // Regular token-based reset
        await resetPasswordAPI(token, formData.newPassword);
      }
      
      // Clean up session storage
      sessionStorage.removeItem('otpEmail');
      sessionStorage.removeItem('resetToken');
      
      setSuccess(true);
      toast.success('Reset mật khẩu thành công!');
      
      // Thêm timeout để chuyển về trang đăng nhập sau khi reset thành công
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Chuyển hướng sau 3 giây
    } catch (error) {
      console.error('Reset password error:', error);
      
      // Xử lý chi tiết các loại lỗi
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Yêu cầu đặt lại mật khẩu không hợp lệ');
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Token không hợp lệ hoặc đã hết hạn');
        setTimeout(() => navigate('/forgot-password'), 2000);
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          <div className="login-form">
            <div className="success-icon">
              <CheckCircle size={80} color="#3a99b7" />
            </div>

            <h2>Mật khẩu đã được cập nhật!</h2>
            <p>
              Mật khẩu của bạn đã được thay đổi thành công. Bạn có thể đăng nhập
              với mật khẩu mới.
            </p>

            <button
              onClick={() => navigate('/login')}
              className="login-button"
              style={{ marginBottom: '16px' }}
            >
              Đăng nhập ngay
            </button>

            <Link to="/" className="back-to-login">
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
        <Link to="/login" className="close-button">
          ✕
        </Link>

        <div className="login-form">
          <div className="back-link">
            <Link to="/login">
              <ArrowLeft size={20} />
              Quay lại đăng nhập
            </Link>
          </div>

          <h2>Tạo mật khẩu mới</h2>
          <p>Nhập mật khẩu mới của bạn. Mật khẩu phải có ít nhất 6 ký tự.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
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
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
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

            <div className="password-requirements">
              <div className="requirement-item">
                <AlertCircle size={16} />
                <span>Mật khẩu phải có ít nhất 6 ký tự</span>
              </div>
              <div className="requirement-item">
                <AlertCircle size={16} />
                <span>Nên bao gồm chữ hoa, chữ thường và số</span>
              </div>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
            </button>
          </form>

          <div className="divider">
            <span>Hoặc</span>
          </div>

          <div className="auth-links">
            <Link to="/login">Quay lại đăng nhập</Link>
            <Link to="/forgot-password">Gửi lại email reset</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
