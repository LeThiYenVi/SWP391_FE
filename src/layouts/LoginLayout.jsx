import React from 'react';
import { Outlet } from 'react-router-dom';

function LoginLayout({ children }) {
  return children || <Outlet />;
}

export default LoginLayout;
