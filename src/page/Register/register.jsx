import React from "react";
import "./register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

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
        <button className="close-button">X</button>
        <div className="register-form">
          <h2>Đăng kí</h2>
          <p>
            Bạn đã có tài khoản? <a href="/login">Đăng nhập</a>
          </p>
          <form>
            <div className="input-group">
              <label htmlFor="email">Địa chỉ Email</label>
              <input type="email" id="email" placeholder="Nhập email của bạn" />
            </div>
            <div className="input-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                placeholder="Nhập tên đăng nhập của bạn"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="••••••••••"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <div className="input-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="••••••••••"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit" className="register-button">
              Đăng kí
            </button>
            <div className="options">
              <span>Ghi nhớ mật khẩu</span>
            </div>
            <div className="divider">
              <span>Hoặc đăng nhập với</span>
            </div>
            <button type="button" className="google-register">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
              />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
