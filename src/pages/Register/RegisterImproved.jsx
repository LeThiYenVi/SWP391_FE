import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Check,
  X,
  Loader2,
  Shield,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './register.css';

// Enhanced validation schema
const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, 'Email không được để trống')
      .email('Email không hợp lệ')
      .refine(email => {
        const domain = email.split('@')[1];
        return !['tempmail.com', '10minutemail.com'].includes(domain);
      }, 'Vui lòng sử dụng email thực'),
    username: z
      .string()
      .min(1, 'Tên đăng nhập không được để trống')
      .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
      .max(20, 'Tên đăng nhập không được quá 20 ký tự')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Tên đăng nhập chỉ được chứa chữ, số và dấu gạch dưới'
      ),
    fullName: z
      .string()
      .min(1, 'Họ tên không được để trống')
      .min(2, 'Họ tên phải có ít nhất 2 ký tự')
      .max(50, 'Họ tên không được quá 50 ký tự'),
    dateOfBirth: z
      .string()
      .min(1, 'Ngày sinh không được để trống')
      .refine(date => {
        const birthDate = new Date(date);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 13 && age <= 120;
      }, 'Tuổi phải từ 13-120'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/(?=.*[a-z])/, 'Mật khẩu phải có ít nhất 1 chữ thường')
      .regex(/(?=.*[A-Z])/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/(?=.*\d)/, 'Mật khẩu phải có ít nhất 1 số')
      .regex(/(?=.*[@$!%*?&])/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
    agreeTerms: z
      .boolean()
      .refine(val => val === true, 'Vui lòng đồng ý với điều khoản'),
    agreePrivacy: z
      .boolean()
      .refine(val => val === true, 'Vui lòng đồng ý với chính sách bảo mật'),
    subscribeNewsletter: z.boolean().optional(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

const PasswordStrengthIndicator = ({ password }) => {
  const getStrength = password => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/(?=.*[a-z])/.test(password)) score++;
    if (/(?=.*[A-Z])/.test(password)) score++;
    if (/(?=.*\d)/.test(password)) score++;
    if (/(?=.*[@$!%*?&])/.test(password)) score++;
    return score;
  };

  const strength = getStrength(password);
  const strengthText = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][
    strength
  ];
  const strengthColor = ['#dc2626', '#ea580c', '#eab308', '#16a34a', '#059669'][
    strength
  ];

  return (
    <div className="password-strength">
      <div className="strength-bar">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className={`strength-segment ${i < strength ? 'active' : ''}`}
            style={{
              backgroundColor: i < strength ? strengthColor : '#e5e7eb',
            }}
          />
        ))}
      </div>
      <span style={{ color: strengthColor, fontSize: '12px' }}>
        {password ? strengthText : ''}
      </span>
    </div>
  );
};

const RegisterImproved = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [emailAvailable, setEmailAvailable] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { register: registerUser, loading } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    trigger,
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const password = watch('password') || '';
  const username = watch('username') || '';
  const email = watch('email') || '';

  // Check username availability
  const checkUsernameAvailability = async username => {
    if (username.length < 3) return;

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/check-username/${username}`);
      const data = await response.json();
      setUsernameAvailable(data.available);
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };

  // Check email availability
  const checkEmailAvailability = async email => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/check-email/${email}`);
      const data = await response.json();
      setEmailAvailable(data.available);
    } catch (error) {
      console.error('Error checking email:', error);
    }
  };

  // Debounced availability checks
  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) checkUsernameAvailability(username);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [username]);

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (email) checkEmailAvailability(email);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  const onSubmit = async data => {
    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth,
        password: data.password,
        subscribeNewsletter: data.subscribeNewsletter,
      });

      if (result.success) {
        toast.success(
          'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
        );
        navigate('/verify-email', {
          state: { email: data.email },
        });
      } else {
        toast.error(result.error || 'Đăng ký thất bại');
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký');
    }
  };

  const nextStep = async () => {
    const fieldsToValidate =
      step === 1
        ? ['email', 'username', 'fullName', 'dateOfBirth']
        : ['password', 'confirmPassword', 'agreeTerms', 'agreePrivacy'];

    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setStep(1);
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
          loading="lazy"
        />
      </div>

      <div className="register-right">
        <Link to="/" className="close-button" aria-label="Đóng">
          ×
        </Link>

        <div className="register-form">
          <div className="form-header">
            <h2>Đăng ký tài khoản</h2>
            <p>
              Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </p>

            {/* Progress indicator */}
            <div className="progress-indicator">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>
                <span>1</span>
                <label>Thông tin cơ bản</label>
              </div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>
                <span>2</span>
                <label>Bảo mật & Điều khoản</label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="form-step">
                <div className="input-group">
                  <label htmlFor="email">
                    Email <span className="required">*</span>
                  </label>
                  <div className="input-with-status">
                    <input
                      type="email"
                      id="email"
                      {...register('email')}
                      placeholder="Nhập email của bạn"
                      className={errors.email ? 'error' : ''}
                      autoComplete="email"
                    />
                    {emailAvailable === true && (
                      <Check className="status-icon success" />
                    )}
                    {emailAvailable === false && (
                      <X className="status-icon error" />
                    )}
                  </div>
                  {errors.email && (
                    <span className="error-message">
                      {errors.email.message}
                    </span>
                  )}
                  {emailAvailable === false && (
                    <span className="error-message">
                      Email này đã được sử dụng
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="username">
                    Tên đăng nhập <span className="required">*</span>
                  </label>
                  <div className="input-with-status">
                    <input
                      type="text"
                      id="username"
                      {...register('username')}
                      placeholder="Nhập tên đăng nhập"
                      className={errors.username ? 'error' : ''}
                      autoComplete="username"
                    />
                    {usernameAvailable === true && (
                      <Check className="status-icon success" />
                    )}
                    {usernameAvailable === false && (
                      <X className="status-icon error" />
                    )}
                  </div>
                  {errors.username && (
                    <span className="error-message">
                      {errors.username.message}
                    </span>
                  )}
                  {usernameAvailable === false && (
                    <span className="error-message">
                      Tên đăng nhập này đã được sử dụng
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="fullName">
                    Họ và tên <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    {...register('fullName')}
                    placeholder="Nhập họ và tên đầy đủ"
                    className={errors.fullName ? 'error' : ''}
                    autoComplete="name"
                  />
                  {errors.fullName && (
                    <span className="error-message">
                      {errors.fullName.message}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="dateOfBirth">
                    Ngày sinh <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    {...register('dateOfBirth')}
                    className={errors.dateOfBirth ? 'error' : ''}
                    max={new Date().toISOString().split('T')[0]}
                  />
                  {errors.dateOfBirth && (
                    <span className="error-message">
                      {errors.dateOfBirth.message}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="next-button"
                  disabled={!isValid}
                >
                  Tiếp theo
                </button>
              </div>
            )}

            {/* Step 2: Security & Terms */}
            {step === 2 && (
              <div className="form-step">
                <div className="input-group">
                  <label htmlFor="password">
                    Mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      {...register('password')}
                      placeholder="••••••••••"
                      className={errors.password ? 'error' : ''}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                      aria-label={
                        showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                      }
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <PasswordStrengthIndicator password={password} />
                  {errors.password && (
                    <span className="error-message">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="confirmPassword">
                    Xác nhận mật khẩu <span className="required">*</span>
                  </label>
                  <div className="password-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      {...register('confirmPassword')}
                      placeholder="••••••••••"
                      className={errors.confirmPassword ? 'error' : ''}
                      autoComplete="new-password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="password-toggle"
                      aria-label={
                        showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="error-message">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    {...register('agreeTerms')}
                  />
                  <label htmlFor="agreeTerms">
                    Tôi đồng ý với{' '}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="link-button"
                    >
                      Điều khoản sử dụng
                    </button>
                    <span className="required">*</span>
                  </label>
                  {errors.agreeTerms && (
                    <span className="error-message">
                      {errors.agreeTerms.message}
                    </span>
                  )}
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="agreePrivacy"
                    {...register('agreePrivacy')}
                  />
                  <label htmlFor="agreePrivacy">
                    Tôi đồng ý với{' '}
                    <button
                      type="button"
                      onClick={() => setShowPrivacyModal(true)}
                      className="link-button"
                    >
                      Chính sách bảo mật
                    </button>
                    <span className="required">*</span>
                  </label>
                  {errors.agreePrivacy && (
                    <span className="error-message">
                      {errors.agreePrivacy.message}
                    </span>
                  )}
                </div>

                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="subscribeNewsletter"
                    {...register('subscribeNewsletter')}
                  />
                  <label htmlFor="subscribeNewsletter">
                    Tôi muốn nhận thông tin sức khỏe và khuyến mãi qua email
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="back-button"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    className="register-button"
                    disabled={loading || !isValid}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Đang đăng ký...
                      </>
                    ) : (
                      'Đăng ký'
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Security notice */}
          <div className="security-notice">
            <Shield size={16} />
            <p>Thông tin của bạn được bảo mật với mã hóa SSL 256-bit</p>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="modal-overlay" onClick={() => setShowTermsModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Điều khoản sử dụng</h3>
              <button onClick={() => setShowTermsModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Terms content */}
              <p>Điều khoản sử dụng chi tiết sẽ được hiển thị ở đây...</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setValue('agreeTerms', true);
                  setShowTermsModal(false);
                }}
                className="accept-button"
              >
                Tôi đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Modal */}
      {showPrivacyModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowPrivacyModal(false)}
        >
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chính sách bảo mật</h3>
              <button onClick={() => setShowPrivacyModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* Privacy policy content */}
              <p>Chính sách bảo mật chi tiết sẽ được hiển thị ở đây...</p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => {
                  setValue('agreePrivacy', true);
                  setShowPrivacyModal(false);
                }}
                className="accept-button"
              >
                Tôi đồng ý
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterImproved;
