import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import './login.css';

// Schema validation với Zod
const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Tên đăng nhập không được để trống')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
  password: z
    .string()
    .min(1, 'Mật khẩu không được để trống')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  rememberMe: z.boolean().optional(),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockTime, setBlockTime] = useState(0);

  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // React Hook Form với Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  // Rate limiting logic
  useEffect(() => {
    if (loginAttempts >= 3) {
      setIsBlocked(true);
      setBlockTime(30); // 30 seconds block

      const timer = setInterval(() => {
        setBlockTime(prev => {
          if (prev <= 1) {
            setIsBlocked(false);
            setLoginAttempts(0);
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loginAttempts]);

  const onSubmit = async data => {
    if (isBlocked) {
      toast.error(`Vui lòng đợi ${blockTime} giây trước khi thử lại`);
      return;
    }

    try {
      const result = await login({
        username: data.username,
        password: data.password,
        rememberMe: data.rememberMe,
      });

      if (result.success) {
        toast.success('Đăng nhập thành công!');
        setLoginAttempts(0);
        navigate(from, { replace: true });
      } else {
        setLoginAttempts(prev => prev + 1);
        toast.error(result.error || 'Đăng nhập thất bại');
      }
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      toast.error('Có lỗi xảy ra khi đăng nhập');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Implement Google OAuth
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
    } catch (error) {
      toast.error('Lỗi đăng nhập Google');
    }
  };

  const handleForgotPassword = () => {
    const username = watch('username');
    if (username) {
      navigate('/forgot-password', { state: { username } });
    } else {
      toast.info('Vui lòng nhập tên đăng nhập trước');
    }
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
          loading="lazy"
        />
      </div>

      <div className="login-right">
        <Link to="/" className="close-button" aria-label="Đóng">
          ✕
        </Link>

        <div className="login-form">
          <h2>Chào mừng trở lại</h2>
          <p>
            Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </p>

          {/* Rate limiting warning */}
          {loginAttempts > 0 && (
            <div className="warning-message">
              <AlertCircle size={16} />
              <span>
                Sai thông tin đăng nhập ({loginAttempts}/3 lần thử)
                {loginAttempts >= 3 && ` - Tài khoản bị khóa ${blockTime}s`}
              </span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="input-group">
              <label htmlFor="username">
                Tên đăng nhập <span className="required">*</span>
              </label>
              <input
                type="text"
                id="username"
                {...register('username')}
                placeholder="Nhập tên đăng nhập của bạn"
                disabled={loading || isBlocked}
                className={errors.username ? 'error' : ''}
                autoComplete="username"
                aria-describedby={errors.username ? 'username-error' : ''}
              />
              {errors.username && (
                <span id="username-error" className="error-message">
                  {errors.username.message}
                </span>
              )}
            </div>

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
                  disabled={loading || isBlocked}
                  className={errors.password ? 'error' : ''}
                  autoComplete="current-password"
                  aria-describedby={errors.password ? 'password-error' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  disabled={loading || isBlocked}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span id="password-error" className="error-message">
                  {errors.password.message}
                </span>
              )}
            </div>

            <div className="options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="remember"
                  {...register('rememberMe')}
                  disabled={loading || isBlocked}
                />
                <label htmlFor="remember">Ghi nhớ đăng nhập</label>
              </div>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="link-button"
                disabled={loading || isBlocked}
              >
                Quên mật khẩu?
              </button>
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading || isBlocked || !isValid}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Đang đăng nhập...
                </>
              ) : (
                'Đăng nhập'
              )}
            </button>

            <div className="divider">
              <span>Hoặc đăng nhập với</span>
            </div>

            <button
              type="button"
              className="google-login"
              onClick={handleGoogleLogin}
              disabled={loading || isBlocked}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                width={20}
                height={20}
              />
              Google
            </button>
          </form>

          {/* Security notice */}
          <div className="security-notice">
            <p>🔒 Thông tin của bạn được bảo mật với mã hóa SSL 256-bit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
