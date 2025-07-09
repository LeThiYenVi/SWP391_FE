import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { forgetPasswordAPI } from '../../services/UsersSevices';
import './login.css';

// Thêm hàm để tạo URL xác thực OTP cho email
const generateOtpVerificationUrl = email => {
  // Lấy URL cơ sở từ window.location hoặc từ cấu hình
  const baseUrl = window.location.origin; // Ví dụ: "https://gynexa.com" hoặc "http://localhost:3000"

  // Mã hóa email để bảo mật (sử dụng encodeURIComponent để đảm bảo các ký tự đặc biệt được xử lý đúng)
  const encodedEmail = encodeURIComponent(email);

  // Tạo URL đầy đủ
  return `${baseUrl}/verify-otp?email=${encodedEmail}`;
};

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('');

  // Check if there's an email from location state (for resend OTP)
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
      if (location.state.resend) {
        // Auto-submit for resend
        handleSubmit(null, true);
      }
    }

    // Show message if any
    if (location.state?.message) {
      toast.info(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e, isResend = false) => {
    if (e) e.preventDefault();

    const emailToUse = email.trim();
    if (!emailToUse) {
      toast.error('Vui lòng nhập địa chỉ email của bạn');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
      toast.error('Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại');
      return;
    }

    setLoading(true);
    setLastSubmittedEmail(emailToUse);

    try {
      // Tạo URL đầy đủ cho link trong email (sẽ được gửi về backend)
      const otpVerificationUrl = generateOtpVerificationUrl(emailToUse);
      console.log('OTP Verification URL for email:', otpVerificationUrl);

      // Gọi API gửi yêu cầu OTP với email và URL xác thực
      // URL này sẽ được gửi đến backend trong trường "otpVerificationLink" của request body
      // Backend có thể sử dụng URL này trong nội dung email để người dùng nhấp vào
      const response = await forgetPasswordAPI(emailToUse, otpVerificationUrl);
      console.log('Forgot password response:', response);

      // Lưu email và URL xác thực vào sessionStorage
      sessionStorage.setItem('otpEmail', emailToUse);
      sessionStorage.setItem('otpVerificationUrl', otpVerificationUrl);

      const successMessage = isResend
        ? 'Mã OTP mới đã được gửi!'
        : 'Mã OTP đã được gửi đến email của bạn!';

      toast.success(successMessage);

      // Chuyển người dùng đến trang xác thực OTP và truyền email qua state
      navigate('/verify-otp', {
        state: { email: emailToUse, timestamp: new Date().getTime() },
      });
    } catch (error) {
      console.error('Forgot password error:', error);

      // Xử lý các loại lỗi khác nhau từ backend
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        toast.error(
          'Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc đăng ký mới'
        );
      } else if (error.response?.status === 429) {
        toast.error('Quá nhiều yêu cầu. Vui lòng đợi một lúc và thử lại sau');
      } else if (!navigator.onLine) {
        toast.error(
          'Không có kết nối mạng. Vui lòng kiểm tra kết nối của bạn và thử lại'
        );
      } else {
        toast.error(
          'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau'
        );
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

            <h2>Mã OTP đã được gửi!</h2>
            <p>
              Chúng tôi đã gửi mã OTP xác thực đến <strong>{email}</strong>
            </p>
            <p className="email-note">
              Nếu bạn không nhận được email trong vòng vài phút, hãy kiểm tra
              thư mục spam hoặc gửi lại email
            </p>

            <div className="email-sent-info">
              <div className="info-item">
                <Mail size={20} />
                <span>Kiểm tra hộp thư đến và spam</span>
              </div>
              <div className="info-item">
                <AlertCircle size={20} />
                <span>Mã OTP sẽ hết hạn sau 15 phút</span>
              </div>
            </div>

            <button
              onClick={async () => {
                setLoading(true);
                try {
                  // Tạo lại URL xác thực OTP cho gửi lại
                  const otpVerificationUrl =
                    generateOtpVerificationUrl(lastSubmittedEmail);
                  // Gửi lại URL đến backend trong trường "otpVerificationLink" của request body
                  await forgetPasswordAPI(
                    lastSubmittedEmail,
                    otpVerificationUrl
                  );
                  toast.success('Mã OTP mới đã được gửi!');
                } catch (error) {
                  console.error('Resend email error:', error);
                  if (error.response?.data?.message) {
                    toast.error(error.response.data.message);
                  } else if (error.response?.status === 429) {
                    toast.error(
                      'Vui lòng đợi ít phút trước khi gửi lại email. Hệ thống giới hạn số lần gửi để bảo vệ tài khoản của bạn'
                    );
                  } else if (!navigator.onLine) {
                    toast.error(
                      'Không có kết nối mạng. Vui lòng kiểm tra kết nối của bạn và thử lại'
                    );
                  } else {
                    toast.error(
                      'Có lỗi xảy ra trong quá trình gửi lại email. Vui lòng thử lại sau'
                    );
                  }
                } finally {
                  setLoading(false);
                }
              }}
              className="login-button resend-button"
              style={{ marginBottom: '16px', marginTop: '16px' }}
              disabled={loading}
            >
              {loading ? 'Đang gửi...' : 'Gửi lại mã OTP'}
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
          <p>Nhập email của bạn và chúng tôi sẽ gửi mã OTP để xác thực</p>

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
              <p className="input-description">
                Mã OTP xác thực sẽ được gửi qua email này
              </p>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã OTP xác thực'}
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
