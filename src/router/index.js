import React from 'react'
import HomePageRoutes from './HomePageRoutes';
import LoginRouters from './LoginRoutes';
import RegisterRouters from './RegisterRoutes';
import DashboardRoutes from './DashboardRoutes';
import AdminRoutes from './AdminRoutes';
import ConsultantRoutes from './ConsultantRoutes';
import UnauthorizedRoutes from './UnauthorizedRoutes';
import { createBrowserRouter } from 'react-router-dom';

const AppRoutes=[
    ...HomePageRoutes,
    ...LoginRouters,
    ...RegisterRouters,
    ...DashboardRoutes,
    ...AdminRoutes,
    ...ConsultantRoutes,
    ...UnauthorizedRoutes,
]
const router = createBrowserRouter(AppRoutes);
export default router

