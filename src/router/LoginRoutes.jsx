import React from 'react';
import Login from '../pages/Login/login';
import ForgotPassword from '../pages/Login/ForgotPassword';
import ResetPassword from '../pages/Login/ResetPassword';
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
    path: '/reset-password',
    element: (
      <LoginLayout>
        <ResetPassword />
      </LoginLayout>
    ),
  },
];

export default LoginRouters;
