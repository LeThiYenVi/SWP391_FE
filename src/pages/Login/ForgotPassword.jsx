import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { forgetPasswordAPI } from '../../services/UsersSevices';
import './login.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Vui lòng nhập email');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Email không hợp lệ');
      return;
    }

    setLoading(true);

    try {
      // Gọi API với role mặc định là 'user'
      await forgetPasswordAPI(email, 'user');
      setEmailSent(true);
      toast.success('Email reset mật khẩu đã được gửi!');
    } catch (error) {
      console.error('Forgot password error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  if (emailSent) {
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
            <div className="success-icon">
              <CheckCircle size={80} color="#3a99b7" />
            </div>

            <h2>Email đã được gửi!</h2>
            <p>
              Chúng tôi đã gửi link reset mật khẩu đến <strong>{email}</strong>
            </p>

            <div className="email-sent-info">
              <div className="info-item">
                <Mail size={20} />
                <span>Kiểm tra hộp thư đến và spam</span>
              </div>
              <div className="info-item">
                <AlertCircle size={20} />
                <span>Link sẽ hết hạn sau 15 phút</span>
              </div>
            </div>

            <button
              onClick={() => setEmailSent(false)}
              className="login-button"
              style={{ marginBottom: '16px' }}
            >
              Gửi lại email
            </button>

            <Link to="/login" className="back-to-login">
              ← Quay lại đăng nhập
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

          <h2>Quên mật khẩu?</h2>
          <p>Nhập email của bạn và chúng tôi sẽ gửi link để reset mật khẩu</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Địa chỉ Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                disabled={loading}
                required
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi link reset mật khẩu'}
            </button>
          </form>

          <div className="divider">
            <span>Hoặc</span>
          </div>

          <div className="auth-links">
            <Link to="/login">Đã nhớ mật khẩu? Đăng nhập</Link>
            <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
