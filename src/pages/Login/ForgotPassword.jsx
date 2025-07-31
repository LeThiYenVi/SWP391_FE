// Import React hooks để quản lý state và lifecycle
import React, { useState, useEffect } from 'react';
// Import router hooks để navigation và lấy thông tin location
import { Link, useNavigate, useLocation } from 'react-router-dom';
// Import icons từ lucide-react cho UI
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
// Import toast để hiển thị thông báo
import { toast } from 'react-toastify';
// Import API service để gọi backend
import { forgetPasswordAPI } from '../../services/UsersSevices';
// Import CSS styles cho trang login
import './login.css';

// Hàm utility để tạo URL xác thực OTP cho email
// Được sử dụng để tạo link trong email mà người dùng sẽ nhấp vào
const generateOtpVerificationUrl = email => {
  // Lấy URL cơ sở từ window.location (domain hiện tại)
  const baseUrl = window.location.origin; // Ví dụ: "https://gynexa.com" hoặc "http://localhost:3000"

  // Mã hóa email để bảo mật trong URL query parameter
  // encodeURIComponent đảm bảo các ký tự đặc biệt (@, +, etc.) được xử lý đúng
  const encodedEmail = encodeURIComponent(email);

  // Tạo URL đầy đủ để verify OTP với email parameter
  return `${baseUrl}/verify-otp?email=${encodedEmail}`;
};

// Component chính để xử lý quên mật khẩu
const ForgotPassword = () => {
  // State để lưu email người dùng nhập
  const [email, setEmail] = useState('');
  // State để track trạng thái loading khi gọi API
  const [loading, setLoading] = useState(false);
  // State để kiểm soát hiển thị màn hình success sau khi gửi email
  const [emailSent, setEmailSent] = useState(false);
  // Hook để navigate programmatically
  const navigate = useNavigate();
  // Hook để lấy thông tin từ location state (từ page trước)
  const location = useLocation();
  // State để lưu email đã submit lần cuối (dùng cho resend)
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('');

  // useEffect để xử lý các trường hợp đặc biệt khi component mount
  useEffect(() => {
    // Kiểm tra nếu có email được truyền từ page trước qua location state
    if (location.state?.email) {
      setEmail(location.state.email);
      // Nếu có flag resend, tự động submit để gửi lại OTP
      if (location.state.resend) {
        // Auto-submit for resend - gọi handleSubmit với flag isResend = true
        handleSubmit(null, true);
      }
    }

    // Hiển thị message nếu có được truyền từ page trước
    if (location.state?.message) {
      toast.info(location.state.message);
    }
  }, [location.state]); // Dependency array chỉ chạy khi location.state thay đổi

  // Handler chính để xử lý submit form forgot password
  // e: event object từ form submit
  // isResend: flag để biết đây là lần gửi đầu tiên hay resend
  const handleSubmit = async (e, isResend = false) => {
    // Prevent default form submission nếu có event
    if (e) e.preventDefault();

    // Trim email để loại bỏ space thừa
    const emailToUse = email.trim();

    // Validation: Kiểm tra email không được rỗng
    if (!emailToUse) {
      toast.error('Vui lòng nhập địa chỉ email của bạn');
      return;
    }

    // Validation: Kiểm tra format email bằng regex
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToUse)) {
      toast.error('Địa chỉ email không hợp lệ. Vui lòng kiểm tra lại');
      return;
    }

    // Bắt đầu loading state
    setLoading(true);
    // Lưu email đã submit để dùng cho resend
    setLastSubmittedEmail(emailToUse);

    try {
      // Tạo URL xác thực OTP đầy đủ để gửi về backend
      const otpVerificationUrl = generateOtpVerificationUrl(emailToUse);
      console.log('OTP Verification URL for email:', otpVerificationUrl);

      // Gọi API backend để gửi yêu cầu OTP
      // Truyền email và URL xác thực - backend sẽ embed URL này trong email
      const response = await forgetPasswordAPI(emailToUse, otpVerificationUrl);
      console.log('Forgot password response:', response);

      // Lưu thông tin vào sessionStorage để sử dụng ở trang verify-otp
      sessionStorage.setItem('otpEmail', emailToUse);
      sessionStorage.setItem('otpVerificationUrl', otpVerificationUrl);

      // Hiển thị thông báo success khác nhau cho lần đầu và resend
      const successMessage = isResend
        ? 'Mã OTP mới đã được gửi!'
        : 'Mã OTP đã được gửi đến email của bạn!';

      toast.success(successMessage);

      // Navigate đến trang verify OTP và truyền thông tin qua state
      navigate('/verify-otp', {
        state: { email: emailToUse, timestamp: new Date().getTime() },
      });
    } catch (error) {
      console.error('Forgot password error:', error);

      // Xử lý các loại lỗi khác nhau từ backend với thông báo phù hợp
      if (error.response?.data?.message) {
        // Nếu backend trả về message cụ thể
        toast.error(error.response.data.message);
      } else if (error.response?.status === 404) {
        // Email không tồn tại trong hệ thống
        toast.error(
          'Email không tồn tại trong hệ thống. Vui lòng kiểm tra lại hoặc đăng ký mới'
        );
      } else if (error.response?.status === 429) {
        // Rate limiting - quá nhiều request
        toast.error('Quá nhiều yêu cầu. Vui lòng đợi một lúc và thử lại sau');
      } else if (!navigator.onLine) {
        // Kiểm tra connection internet
        toast.error(
          'Không có kết nối mạng. Vui lòng kiểm tra kết nối của bạn và thử lại'
        );
      } else {
        // Lỗi generic khác
        toast.error(
          'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau'
        );
      }
    } finally {
      // Tắt loading state dù thành công hay thất bại
      setLoading(false);
    }
  };

  // Render success screen sau khi gửi email thành công
  if (emailSent) {
    return (
      <div className="login-container">
        {/* Left panel với logo và hình ảnh */}
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

        {/* Right panel với success message */}
        <div className="login-right">
          {/* Close button để quay về login */}
          <Link to="/login" className="close-button">
            ✕
          </Link>

          <div className="login-form">
            {/* Success icon */}
            <div className="success-icon">
              <CheckCircle size={80} color="#3a99b7" />
            </div>

            {/* Success message */}
            <h2>Mã OTP đã được gửi!</h2>
            <p>
              Chúng tôi đã gửi mã OTP xác thực đến <strong>{email}</strong>
            </p>
            <p className="email-note">
              Nếu bạn không nhận được email trong vòng vài phút, hãy kiểm tra
              thư mục spam hoặc gửi lại email
            </p>

            {/* Thông tin hướng dẫn */}
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

            {/* Button gửi lại OTP */}
            <button
              onClick={async () => {
                setLoading(true);
                try {
                  // Tạo lại URL xác thực OTP cho việc gửi lại
                  const otpVerificationUrl =
                    generateOtpVerificationUrl(lastSubmittedEmail);
                  // Gọi API gửi lại OTP với URL mới
                  await forgetPasswordAPI(
                    lastSubmittedEmail,
                    otpVerificationUrl
                  );
                  toast.success('Mã OTP mới đã được gửi!');
                } catch (error) {
                  console.error('Resend email error:', error);
                  // Xử lý lỗi tương tự như handleSubmit
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

            {/* Link quay về trang login */}
            <Link to="/login" className="back-to-login">
              ← Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render main form để nhập email
  return (
    <div className="login-container">
      {/* Left panel với logo và hình ảnh */}
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

      {/* Right panel với form */}
      <div className="login-right">
        {/* Close button để quay về login */}
        <Link to="/login" className="close-button">
          ✕
        </Link>

        <div className="login-form">
          {/* Back link với icon */}
          <div className="back-link">
            <Link to="/login">
              <ArrowLeft size={20} />
              Quay lại đăng nhập
            </Link>
          </div>

          {/* Form header */}
          <h2>Quên mật khẩu?</h2>
          <p>Nhập email của bạn và chúng tôi sẽ gửi mã OTP để xác thực</p>

          {/* Form nhập email */}
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

            {/* Submit button */}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Đang gửi...' : 'Gửi mã OTP xác thực'}
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span>Hoặc</span>
          </div>

          {/* Links sang các trang khác */}
          <div className="auth-links">
            <Link to="/login">Đã nhớ mật khẩu? Đăng nhập</Link>
            <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export component để sử dụng trong routing
export default ForgotPassword;
