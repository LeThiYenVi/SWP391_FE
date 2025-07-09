import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { forgetPasswordAPI } from '../../services/UsersSevices';
import { routes } from '../../routes';
import './login.css';

// Schema validation với Zod
const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email không được để trống')
    .email('Email không hợp lệ')
    .refine(email => {
      const domain = email.split('@')[1];
      return domain && !['tempmail.com', '10minutemail.com'].includes(domain);
    }, 'Vui lòng sử dụng email thực'),
});

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Get username from login page if available
  const prefilledUsername = location.state?.username || '';

  // React Hook Form với Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    getValues,
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: prefilledUsername,
    },
  });

  // Cooldown timer effect
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  const onSubmit = async data => {
    // Rate limiting - max 3 attempts per 15 minutes
    if (attemptCount >= 3) {
      toast.error(
        'Bạn đã vượt quá số lần gửi email. Vui lòng thử lại sau 15 phút.'
      );
      return;
    }

    try {
      // Gọi API với role mặc định là 'user'
      await forgetPasswordAPI(data.email, 'user');

      setEmailSent(true);
      setAttemptCount(prev => prev + 1);
      setResendCooldown(60); // 60 seconds cooldown

      toast.success('Email reset mật khẩu đã được gửi!');

      // Store email in localStorage for persistence
      localStorage.setItem('forgotPasswordEmail', data.email);
    } catch (error) {
      console.error('Forgot password error:', error);
      setAttemptCount(prev => prev + 1);

      if (error.response?.status === 404) {
        toast.error('Email này không tồn tại trong hệ thống');
      } else if (error.response?.status === 429) {
        toast.error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
        setResendCooldown(300); // 5 minutes cooldown
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    }
  };

  const handleResendEmail = () => {
    if (resendCooldown > 0) {
      toast.info(`Vui lòng đợi ${resendCooldown} giây trước khi gửi lại`);
      return;
    }

    const email = getValues('email');
    if (email) {
      onSubmit({ email });
    }
  };

  const handleBackToForm = () => {
    setEmailSent(false);
    const savedEmail = localStorage.getItem('forgotPasswordEmail');
    if (savedEmail) {
      reset({ email: savedEmail });
    }
  };

  // Load saved email on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('forgotPasswordEmail');
    if (savedEmail && !prefilledUsername) {
      reset({ email: savedEmail });
    }
  }, [reset, prefilledUsername]);

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
          loading="lazy"
        />
      </div>

      <div className="login-right">
        <Link to={routes.login} className="close-button" aria-label="Đóng">
          ✕
        </Link>

        <div className="login-form">
          {/* Success state */}
          {emailSent ? (
            <>
              <div className="success-icon">
                <CheckCircle size={80} color="#3a99b7" />
              </div>

              <h2>Email đã được gửi!</h2>
              <p>
                Chúng tôi đã gửi link reset mật khẩu đến{' '}
                <strong>{getValues('email')}</strong>
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
                <div className="info-item">
                  <Clock size={20} />
                  <span>Đã gửi: {attemptCount}/3 lần</span>
                </div>
              </div>

              <button
                onClick={handleResendEmail}
                className="login-button"
                style={{ marginBottom: '16px' }}
                disabled={resendCooldown > 0 || attemptCount >= 3}
              >
                {resendCooldown > 0 ? (
                  <>
                    <Clock size={20} />
                    Gửi lại sau {resendCooldown}s
                  </>
                ) : attemptCount >= 3 ? (
                  'Đã vượt quá số lần gửi'
                ) : (
                  'Gửi lại email'
                )}
              </button>

              <button
                onClick={handleBackToForm}
                className="link-button"
                style={{ marginBottom: '16px' }}
              >
                Thay đổi email
              </button>

              <Link to={routes.login} className="back-to-login">
                ← Quay lại đăng nhập
              </Link>
            </>
          ) : (
            <>
              <div className="back-link">
                <Link to={routes.login}>
                  <ArrowLeft size={20} />
                  Quay lại đăng nhập
                </Link>
              </div>

              <h2>Quên mật khẩu?</h2>
              <p>
                Nhập email của bạn và chúng tôi sẽ gửi link để reset mật khẩu
              </p>

              {/* Rate limiting warning */}
              {attemptCount > 0 && (
                <div className="warning-message">
                  <AlertCircle size={16} />
                  <span>
                    Đã gửi {attemptCount}/3 lần.
                    {attemptCount >= 3 && ' Vui lòng thử lại sau 15 phút.'}
                  </span>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="input-group">
                  <label htmlFor="email">
                    Địa chỉ Email <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    placeholder="Nhập email của bạn"
                    disabled={isSubmitting || attemptCount >= 3}
                    className={errors.email ? 'error' : ''}
                    autoComplete="email"
                    aria-describedby={errors.email ? 'email-error' : ''}
                  />
                  {errors.email && (
                    <span id="email-error" className="error-message">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className="login-button"
                  disabled={isSubmitting || !isValid || attemptCount >= 3}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Đang gửi...
                    </>
                  ) : attemptCount >= 3 ? (
                    'Đã vượt quá số lần gửi'
                  ) : (
                    'Gửi link reset mật khẩu'
                  )}
                </button>
              </form>

              <div className="divider">
                <span>Hoặc</span>
              </div>

              <div className="auth-links">
                <Link to={routes.login}>Đã nhớ mật khẩu? Đăng nhập</Link>
                <Link to={routes.register}>Chưa có tài khoản? Đăng ký</Link>
              </div>

              {/* Security notice */}
              <div className="security-notice">
                <p>🔒 Email reset được mã hóa và có hiệu lực trong 15 phút</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
