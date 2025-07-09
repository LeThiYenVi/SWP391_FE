import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  MapPin,
  Calendar,
  TestTube,
  FileText,
  MessageCircle,
  User,
} from 'lucide-react';
import styles from '../Search.module.css';

const SearchResults = ({ results, loading, query }) => {
  // Helper để định dạng kết quả theo loại
  const renderResultItem = item => {
    switch (item.type) {
      case 'counselor':
        return (
          <div className={styles.resultItem} key={`${item.type}-${item.id}`}>
            <div className={styles.resultImage}>
              <img
                src={item.avatar || '/default-avatar.png'}
                alt={item.name}
                onError={e => {
                  e.target.src = '/default-avatar.png';
                }}
              />
              {item.available && (
                <span className={styles.availableBadge}>
                  Có thể tư vấn ngay
                </span>
              )}
            </div>
            <div className={styles.resultContent}>
              <h3>
                <Link to={`/tu-van/${item.id}`}>{item.name}</Link>
              </h3>
              <div className={styles.resultMeta}>
                <span className={styles.specialty}>{item.specialty}</span>
                <div className={styles.rating}>
                  <Star size={16} className={styles.starIcon} />
                  <span>{item.rating}</span>
                  <span className={styles.reviews}>
                    ({item.reviews} đánh giá)
                  </span>
                </div>
              </div>
              <div className={styles.resultDetails}>
                <div className={styles.detailItem}>
                  <MapPin size={14} />
                  <span>{item.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <User size={14} />
                  <span>{item.experience}</span>
                </div>
              </div>
              <div className={styles.price}>{item.price}</div>
              <div className={styles.resultActions}>
                <Link
                  to={`/tu-van/dat-lich/${item.id}`}
                  className={styles.bookButton}
                >
                  Đặt lịch hẹn
                </Link>
                <Link
                  to={`/tu-van/${item.id}`}
                  className={styles.profileButton}
                >
                  Xem hồ sơ
                </Link>
              </div>
            </div>
          </div>
        );

      case 'service':
        return (
          <div className={styles.resultItem} key={`${item.type}-${item.id}`}>
            <div className={styles.resultContent}>
              <h3>
                <Link to={`/dich-vu/${item.id}`}>{item.name}</Link>
              </h3>
              <p className={styles.description}>{item.description}</p>
              <div className={styles.resultMeta}>
                <span className={styles.category}>
                  {item.category === 'Tư vấn' ? (
                    <>
                      <MessageCircle size={14} /> {item.category}
                    </>
                  ) : (
                    <>
                      <TestTube size={14} /> {item.category}
                    </>
                  )}
                </span>
                <div className={styles.rating}>
                  <Star size={16} className={styles.starIcon} />
                  <span>{item.rating}</span>
                  <span className={styles.reviews}>
                    ({item.reviews} đánh giá)
                  </span>
                </div>
              </div>
              <div className={styles.resultDetails}>
                <div className={styles.detailItem}>
                  <Calendar size={14} />
                  <span>{item.duration}</span>
                </div>
              </div>
              <div className={styles.price}>{item.price}</div>
              <div className={styles.resultActions}>
                <Link
                  to={`/dich-vu/dat-lich/${item.id}`}
                  className={styles.bookButton}
                >
                  Đặt lịch ngay
                </Link>
              </div>
            </div>
          </div>
        );

      case 'article':
        return (
          <div className={styles.resultItem} key={`${item.type}-${item.id}`}>
            <div className={styles.resultContent}>
              <h3>
                <Link to={`/bai-viet/${item.id}`}>{item.title}</Link>
              </h3>
              <p className={styles.description}>{item.excerpt}</p>
              <div className={styles.resultMeta}>
                <span className={styles.category}>
                  <FileText size={14} /> {item.category}
                </span>
                <span className={styles.author}>{item.author}</span>
              </div>
              <div className={styles.resultDetails}>
                <div className={styles.detailItem}>
                  <Calendar size={14} />
                  <span>{item.publishDate}</span>
                </div>
                <div className={styles.detailItem}>
                  <span>{item.readTime} đọc</span>
                </div>
              </div>
              <div className={styles.resultActions}>
                <Link to={`/bai-viet/${item.id}`} className={styles.viewButton}>
                  Đọc bài viết
                </Link>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className={styles.resultsLoading}>
        <div className={styles.spinner}></div>
        <p>Đang tìm kiếm kết quả phù hợp nhất...</p>
      </div>
    );
  }

  if (results.length === 0 && query) {
    return (
      <div className={styles.noResults}>
        <div className={styles.noResultsIcon}>🔍</div>
        <h3>Không tìm thấy kết quả nào cho "{query}"</h3>
        <p>
          Vui lòng thử lại với từ khóa khác hoặc điều chỉnh bộ lọc tìm kiếm.
        </p>
        <div className={styles.suggestions}>
          <h4>Gợi ý:</h4>
          <ul>
            <li>Kiểm tra lỗi chính tả</li>
            <li>Sử dụng từ khóa ngắn gọn hơn</li>
            <li>Thử tìm kiếm với danh mục rộng hơn</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.searchResults}>
      {results.length > 0 && query && (
        <div className={styles.resultsSummary}>
          <span>
            Tìm thấy <strong>{results.length}</strong> kết quả cho{' '}
            <strong>"{query}"</strong>
          </span>
        </div>
      )}
      <div className={styles.resultsList}>{results.map(renderResultItem)}</div>
    </div>
  );
};

export default SearchResults;
