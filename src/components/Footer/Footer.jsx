import React from 'react';
import {
  Heart,
  Send,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const handleNewsletterSubmit = e => {
    e.preventDefault();
    const email = e.target.email.value;
    // TODO: Integrate with backend API for newsletter subscription
    console.log('Newsletter subscription for:', email);
    alert('Đăng ký newsletter thành công! Cảm ơn bạn đã quan tâm.');
    e.target.reset();
  };

  const companyLinks = [
    { name: 'Về chúng tôi', path: '/gioi-thieu' },
    { name: 'Dịch vụ', path: '/dich-vu' },
    { name: 'Đội ngũ y tế', path: '/doi-ngu' },
    { name: 'Tin tức', path: '/tin-tuc' },
    { name: 'Liên hệ', path: '/lien-he' },
  ];

  const serviceLinks = [
    { name: 'Tư vấn trực tuyến', path: '/tu-van' },
    { name: 'Theo dõi chu kỳ', path: '/theo-doi-chu-ky' },
    { name: 'Xét nghiệm STIs', path: '/xet-nghiem-sti' },
    { name: 'Hỏi đáp', path: '/hoi-dap' },
    { name: 'Chăm sóc sức khỏe', path: '/suc-khoe' },
  ];

  const legalLinks = [
    { name: 'Điều khoản sử dụng', path: '/dieu-khoan' },
    { name: 'Chính sách bảo mật', path: '/chinh-sach-bao-mat' },
    { name: 'Đăng nhập', path: '/login' },
    { name: 'Đăng ký', path: '/register' },
  ];

  const socialLinks = [
    { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/gynexa' },
    { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/gynexa' },
    { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/gynexa' },
    { name: 'Youtube', icon: Youtube, url: 'https://youtube.com/gynexa' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.footerContent}>
          {/* Company Info */}
          <div className={styles.footerSection}>
            <Link to="/" className={styles.footerLogo}>
              <Heart className={styles.logoIcon} />
              <span className={styles.logoText}>GYNEXA</span>
            </Link>
            <p className={styles.companyDescription}>
              Bắt nhịp cơ thể, hiểu thấu chính mình.
              <br />
              Nền tảng chăm sóc sức khỏe giới tính hàng đầu Việt Nam.
            </p>

            {/* Contact Info */}
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <Phone size={16} />
                <span>(84) 123-456-789</span>
              </div>
              <div className={styles.contactItem}>
                <Mail size={16} />
                <span>support@gynexa.com</span>
              </div>
              <div className={styles.contactItem}>
                <MapPin size={16} />
                <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </div>
            </div>

            {/* Social Media */}
            <div className={styles.socialMedia}>
              <h4>Kết nối với chúng tôi</h4>
              <div className={styles.socialLinks}>
                {socialLinks.map((social, index) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={social.name}
                    >
                      <IconComponent size={20} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className={styles.footerSection}>
            <h4>Công ty</h4>
            <ul className={styles.footerLinks}>
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className={styles.footerSection}>
            <h4>Dịch vụ</h4>
            <ul className={styles.footerLinks}>
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Access & Newsletter */}
          <div className={styles.footerSection}>
            <h4>Truy cập nhanh</h4>
            <ul className={styles.footerLinks}>
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.path} className={styles.footerLink}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className={styles.newsletter}>
              <h4>Đăng ký nhận tin</h4>
              <p>Nhận thông tin về sức khỏe và ưu đãi mới nhất</p>
              <form
                onSubmit={handleNewsletterSubmit}
                className={styles.newsletterForm}
              >
                <div className={styles.newsletterInput}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Nhập email của bạn"
                    required
                  />
                  <button type="submit" aria-label="Đăng ký">
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.footerBottomContent}>
            <div className={styles.copyright}>
              <p>&copy; 2024 Gynexa Healthcare. Tất cả quyền được bảo lưu.</p>
            </div>
            <div className={styles.footerBottomLinks}>
              <Link to="/dieu-khoan" className={styles.bottomLink}>
                Điều khoản
              </Link>
              <Link to="/chinh-sach-bao-mat" className={styles.bottomLink}>
                Bảo mật
              </Link>
              <Link to="/lien-he" className={styles.bottomLink}>
                Liên hệ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
