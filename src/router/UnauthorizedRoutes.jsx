import React from 'react';
import Unauthorized from '../pages/Unauthorized';
import { routes } from '../routes';

const UnauthorizedRoutes = [
  {
    path: routes.unauthorized,
    element: <Unauthorized />,
  },
];

export default UnauthorizedRoutes; 