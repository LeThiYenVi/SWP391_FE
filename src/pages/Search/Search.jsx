import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  ArrowLeft,
  Calendar,
  MessageCircle,
  TestTube,
  HelpCircle,
} from 'lucide-react';
import styles from './Search.module.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search data - sẽ được thay thế bằng API call
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    // TODO: Implement actual search API call
    setIsLoading(true);
    const timer = setTimeout(() => {
      // Placeholder for actual API call
      const placeholderData = [
        {
          id: 1,
          type: 'service',
          title: 'Tư vấn trực tuyến',
          description: 'Tư vấn trực tuyến với chuyên gia an toàn và bảo mật',
          link: '/consultation',
          icon: MessageCircle,
        },
        {
          id: 2,
          type: 'service',
          title: 'Theo dõi chu kỳ',
          description: 'Theo dõi và dự đoán chu kỳ sinh lý một cách thông minh',
          link: '/cycle-tracking',
          icon: Calendar,
        },
        {
          id: 3,
          type: 'service',
          title: 'Xét nghiệm STIs',
          description: 'Đặt lịch và xem kết quả xét nghiệm an toàn, bảo mật',
          link: '/sti-testing',
          icon: TestTube,
        },
        {
          id: 4,
          type: 'service',
          title: 'Hỏi đáp',
          description: 'Đặt câu hỏi và nhận tư vấn từ các chuyên gia',
          link: '/qa',
          icon: HelpCircle,
        }
      ];

      if (query) {
        const filtered = placeholderData.filter(
          item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered);
      } else {
        setSearchResults(placeholderData);
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const getTypeLabel = type => {
    switch (type) {
      case 'service':
        return 'Dịch vụ';
      case 'article':
        return 'Bài viết';
      case 'doctor':
        return 'Bác sĩ';
      case 'info':
        return 'Thông tin';
      default:
        return 'Khác';
    }
  };

  const getTypeColor = type => {
    switch (type) {
      case 'service':
        return '#568392';
      case 'article':
        return '#ffd700';
      case 'doctor':
        return '#2d5a66';
      case 'info':
        return '#B0B9BC';
      default:
        return '#718096';
    }
  };

  return (
    <div className={styles.searchPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <Link to="/" className={styles.backButton}>
              <ArrowLeft size={20} />
              <span>Quay lại</span>
            </Link>

            <div className={styles.searchContainer}>
              <Search className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Tìm kiếm thông tin, dịch vụ..."
                className={styles.searchInput}
                defaultValue={query}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.resultsHeader}>
            <h1>Kết quả tìm kiếm</h1>
            {query && (
              <p>
                Tìm thấy <strong>{searchResults.length}</strong> kết quả cho:
                <span className={styles.queryText}>"{query}"</span>
              </p>
            )}
          </div>

          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Đang tìm kiếm...</p>
            </div>
          ) : (
            <div className={styles.results}>
              {searchResults.length > 0 ? (
                searchResults.map(item => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className={styles.resultCard}
                  >
                    <div className={styles.resultHeader}>
                      {item.icon && (
                        <div className={styles.resultIcon}>
                          <item.icon size={24} />
                        </div>
                      )}
                      <span
                        className={styles.resultType}
                        style={{ color: getTypeColor(item.type) }}
                      >
                        {getTypeLabel(item.type)}
                      </span>
                    </div>
                    <h3 className={styles.resultTitle}>{item.title}</h3>
                    <p className={styles.resultDescription}>
                      {item.description}
                    </p>
                  </Link>
                ))
              ) : (
                <div className={styles.noResults}>
                  <Search size={48} />
                  <h3>Không tìm thấy kết quả</h3>
                  <p>
                    Không có kết quả nào cho từ khóa "{query}". Vui lòng thử với
                    từ khóa khác.
                  </p>
                  <Link to="/" className={styles.backToHome}>
                    Quay về trang chủ
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
