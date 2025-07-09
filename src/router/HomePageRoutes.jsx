import React from 'react';
import HomePage from '../pages/HomePage';
import Search from '../pages/Search/Search';
import MainLayout from '../layouts/MainLayout';

const HomePageRoutes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/search',
    element: (
      <MainLayout title="Tìm kiếm - Gynexa">
        <Search />
      </MainLayout>
    ),
  },
];

export default HomePageRoutes;
