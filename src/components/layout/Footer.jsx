import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = {
    services: {
      title: 'Dịch vụ',
      links: [
        { label: 'Tư vấn trực tuyến', href: '/consultation' },
        { label: 'Theo dõi chu kỳ', href: '/cycle-tracking' },
        { label: 'Xét nghiệm STIs', href: '/sti-testing' },
        { label: 'Hỏi đáp', href: '/qa' },
      ],
    },
    support: {
      title: 'Hỗ trợ',
      links: [
        { label: 'Trung tâm trợ giúp', href: '/help' },
        { label: 'Liên hệ', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
        { label: 'Báo cáo lỗi', href: '/report' },
      ],
    },
    company: {
      title: 'Về Gynexa',
      links: [
        { label: 'Giới thiệu', href: '/about' },
        { label: 'Đội ngũ y tế', href: '/doctors' },
        { label: 'Tin tức', href: '/news' },
        { label: 'Tuyển dụng', href: '/careers' },
      ],
    },
    legal: {
      title: 'Chính sách',
      links: [
        { label: 'Điều khoản sử dụng', href: '/terms' },
        { label: 'Chính sách bảo mật', href: '/privacy' },
        { label: 'Chính sách hoàn tiền', href: '/refund' },
        { label: 'Quy trình khiếu nại', href: '/complaints' },
      ],
    },
  };

  const contactInfo = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Hotline',
      value: '1900 123 456',
      href: 'tel:1900123456',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email',
      value: 'support@gynexa.com',
      href: 'mailto:support@gynexa.com',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Địa chỉ',
      value: '123 Nguyễn Huệ, Q1, TP.HCM',
      href: '#',
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="w-5 h-5" />,
      href: 'https://facebook.com/gynexa',
      label: 'Facebook',
    },
    {
      icon: <Instagram className="w-5 h-5" />,
      href: 'https://instagram.com/gynexa',
      label: 'Instagram',
    },
    {
      icon: <Twitter className="w-5 h-5" />,
      href: 'https://twitter.com/gynexa',
      label: 'Twitter',
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center space-x-3 mb-4">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: '#3a99b7' }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Gynexa</span>
              </Link>

              <p className="text-gray-400 mb-6 max-w-md">
                Nền tảng chăm sóc sức khỏe giới tính hàng đầu Việt Nam. Chúng
                tôi cam kết mang đến dịch vụ y tế chất lượng cao, an toàn và bảo
                mật cho mọi người.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                {contactInfo.map((contact, index) => (
                  <a
                    key={index}
                    href={contact.href}
                    className="flex items-center space-x-3 text-gray-400 transition-colors"
                    style={{
                      ':hover': { color: '#3a99b7' },
                    }}
                    onMouseEnter={e => (e.target.style.color = '#3a99b7')}
                    onMouseLeave={e => (e.target.style.color = '')}
                  >
                    {contact.icon}
                    <span>{contact.value}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerSections).map(([key, section]) => (
              <div key={key}>
                <h3 className="text-white font-semibold mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        to={link.href}
                        className="text-gray-400 transition-colors text-sm hover:text-white"
                        style={{
                          transition: 'color 0.2s ease',
                        }}
                        onMouseEnter={e => (e.target.style.color = '#3a99b7')}
                        onMouseLeave={e => (e.target.style.color = '')}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} Gynexa Healthcare. Bảo lưu mọi quyền.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-sm">Theo dõi chúng tôi:</span>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 transition-all"
                    aria-label={social.label}
                    style={{
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.target.style.color = '#3a99b7';
                      e.target.style.backgroundColor = '#374151';
                    }}
                    onMouseLeave={e => {
                      e.target.style.color = '';
                      e.target.style.backgroundColor = '';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>Được cấp phép bởi Bộ Y tế</span>
              <span>ISO 27001:2013</span>
            </div>
          </div>
        </div>

        {/* Health Disclaimer */}
        <div className="border-t border-gray-800 py-6">
          <div className="text-xs text-gray-500 text-center max-w-4xl mx-auto">
            <p className="mb-2">
              <strong className="text-gray-400">Lưu ý y tế:</strong> Thông tin
              trên website này chỉ mang tính chất tham khảo và không thể thay
              thế cho việc thăm khám, chẩn đoán và điều trị y tế trực tiếp.
            </p>
            <p>
              Tất cả thông tin cá nhân và y tế được bảo mật theo tiêu chuẩn quốc
              tế. Gynexa cam kết không chia sẻ thông tin của bạn với bên thứ ba
              mà không có sự đồng ý.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
