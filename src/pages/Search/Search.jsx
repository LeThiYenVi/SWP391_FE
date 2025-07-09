import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import styles from './Search.module.css';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  // Đã xóa toàn bộ logic gọi API và state liên quan

  return (
    <div className={styles.searchPage}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.container}>
          <div className={styles.headerContent}>
            <Link to="/" className={styles.backButton}>
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
                <span className={styles.queryText}>&quot;{query}&quot;</span>
              </p>
            )}
          </div>
          <div className={styles.results}>
            <p>Chưa có dữ liệu tìm kiếm.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
