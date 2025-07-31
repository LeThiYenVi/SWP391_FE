import React from 'react';
import Login from '../pages/Login/login.jsx';
import ForgotPassword from '../pages/Login/ForgotPassword.jsx';
import ResetPassword from '../pages/Login/ResetPassword.jsx';
import OTPValidation from '../pages/Login/OTPValidation.jsx';
import LoginLayout from '../layouts/LoginLayout';

const LoginRouters = [
  {
    path: '/login',
    element: (
      <LoginLayout>
        <Login />
      </LoginLayout>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <LoginLayout>
        <ForgotPassword />
      </LoginLayout>
    ),
  },
  {
    path: '/verify-otp',
    element: (
      <LoginLayout>
        <OTPValidation />
      </LoginLayout>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <LoginLayout>
        <ResetPassword />
      </LoginLayout>
    ),
  },
];

export default LoginRouters;
