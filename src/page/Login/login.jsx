import React from "react";
import "./login.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <div className="logo-icon"></div>
          <span>Gynexa</span>
        </div>{" "}
        <img
          src="https://plus.unsplash.com/premium_photo-1681842975607-f3721c013f38?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Doctors"
          className="doctors-image"
        />
      </div>
      <div className="login-right">
        <button className="close-button">X</button>
        <div className="login-form">
          <h2>Chào mừng trở lại</h2>
          <p>
            Bạn chưa có tài khoản? <a href="/register">Đăng kí</a>
          </p>
          <form>
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
            <div className="options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Ghi nhớ mật khẩu</label>
              </div>
              <a href="/forgot-password">Quên mật khẩu ?</a>
            </div>
            <button type="submit" className="login-button">
              Đăng nhập
            </button>
            <div className="divider">
              <span>Hoặc đăng nhập với</span>
            </div>
            <button type="button" className="google-login">
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

export default Login;
