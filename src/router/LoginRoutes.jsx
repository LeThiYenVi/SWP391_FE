import React from 'react';
import Login from '../pages/Login/login.jsx';
import ForgotPassword from '../pages/Login/ForgotPassword.jsx';
import ResetPassword from '../pages/Login/ResetPassword.jsx';
import OTPValidation from '../pages/Login/OTPValidation.jsx';

const LoginRouters = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/verify-otp',
    element: <OTPValidation />,
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
  },
];

export default LoginRouters;
