import React from 'react';
import Login from '../pages/Login/login.jsx';
import ForgotPassword from '../pages/Login/ForgotPassword.jsx';
import ResetPassword from '../pages/Login/ResetPassword.jsx';

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
    path: '/reset-password',
    element: <ResetPassword />,
  },
];

export default LoginRouters;
