import React from 'react'
import HomePageRoutes from './HomePageRoutes';
import LoginRouters from './LoginRoutes';
import RegisterRouters from './RegisterRoutes';
import DashboardRoutes from './DashboardRoutes';
import AdminRoutes from './AdminRoutes';
import { createBrowserRouter } from 'react-router-dom';

const AppRoutes=[
    ...LoginRouters,
    ...RegisterRouters,
    ...DashboardRoutes,
    ...AdminRoutes,
    ...HomePageRoutes,
]

// Debug: In ra tất cả routes
console.log('All routes:', AppRoutes.map(route => route.path));

const router = createBrowserRouter(AppRoutes);
export default router

