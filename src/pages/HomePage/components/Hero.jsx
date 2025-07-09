import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../HomePage.module.css';
import { useAuth } from '../../../context/AuthContext';

const Hero = ({ handleSearch, handleSearchInputChange, searchQuery }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // 处理需要认证的操作
  const handleAuthAction = targetPath => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: targetPath } });
      return false;
    }
    navigate(targetPath);
    return true;
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroContent}>
        <h1>Chăm sóc sức khỏe phụ nữ toàn diện</h1>
        <p>
          Giải pháp chăm sóc sức khỏe sinh sản và tình dục toàn diện, bảo mật và
          tiện lợi dành cho phụ nữ hiện đại
        </p>

        <div className={styles.heroSearch}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm thông tin, dịch vụ..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            <button type="submit">Tìm kiếm</button>
          </form>
        </div>

        <div className={styles.heroCta}>
          <button
            onClick={() => handleAuthAction('/tu-van')}
            className={styles.primaryBtn}
          >
            Đặt lịch tư vấn <ArrowRight size={16} />
          </button>
          <Link to="/gioi-thieu" className={styles.secondaryBtn}>
            Tìm hiểu thêm
          </Link>
        </div>

        <div className={styles.heroStats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>10,000+</span>
            <span className={styles.statLabel}>Người dùng</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>50+</span>
            <span className={styles.statLabel}>Chuyên gia</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Hài lòng</span>
          </div>
        </div>
      </div>
      <div className={styles.heroImage}>
        <img
          src="https://img.freepik.com/free-photo/female-doctor-hospital-with-stethoscope_23-2148827776.jpg"
          alt="Chăm sóc sức khỏe phụ nữ"
        />
      </div>
    </section>
  );
};

export default Hero;
