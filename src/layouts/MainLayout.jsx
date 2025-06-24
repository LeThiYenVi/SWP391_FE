import React from 'react';
import { Outlet } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';

export const MainLayout = ({
  title = 'Gynexa - Nền tảng chăm sóc sức khỏe giới tính',
  description = 'Gynexa cung cấp dịch vụ chăm sóc sức khỏe giới tính toàn diện với tư vấn trực tuyến, theo dõi chu kỳ và xét nghiệm STIs.',
  children,
}) => {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Gynexa Healthcare" />

        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />

        {/* Medical/Health specific meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Gynexa Healthcare Team" />
        <meta
          name="keywords"
          content="chăm sóc sức khỏe giới tính, tư vấn trực tuyến, theo dõi chu kỳ, xét nghiệm STIs, sức khỏe phụ khoa"
        />
      </Helmet>

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1">{children || <Outlet />}</main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
