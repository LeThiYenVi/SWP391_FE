import React from 'react';
import { Trending, Clock, X } from 'lucide-react';
import styles from '../Search.module.css';

const SearchSuggestions = ({
  query,
  suggestions,
  recentSearches,
  popularSearches,
  setQuery,
  performSearch,
  clearRecentSearches,
}) => {
  // Xử lý khi chọn từ khóa gợi ý
  const handleSuggestionClick = suggestion => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  // Xóa một lịch sử tìm kiếm
  const handleRemoveRecentSearch = (search, e) => {
    e.stopPropagation();
    const newRecentSearches = recentSearches.filter(s => s !== search);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    // Thông báo cập nhật lại recentSearches
    const event = new CustomEvent('recentSearchesUpdated', {
      detail: newRecentSearches,
    });
    window.dispatchEvent(event);
  };

  // Xóa tất cả lịch sử tìm kiếm
  const handleClearAllRecent = () => {
    clearRecentSearches();
  };

  if (query && suggestions.length > 0) {
    // Hiển thị gợi ý dựa trên query hiện tại
    return (
      <div className={styles.suggestionPanel}>
        <div className={styles.suggestionList}>
          {suggestions.map((suggestion, index) => (
            <div
              key={`suggestion-${index}`}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <span>{suggestion}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!query) {
    // Hiển thị lịch sử tìm kiếm và từ khóa phổ biến khi không có query
    return (
      <div className={styles.suggestionPanel}>
        {/* Lịch sử tìm kiếm gần đây */}
        {recentSearches.length > 0 && (
          <div className={styles.recentSearches}>
            <div className={styles.suggestionHeader}>
              <div className={styles.suggestionTitle}>
                <Clock size={16} />
                <span>Tìm kiếm gần đây</span>
              </div>
              <button
                className={styles.clearButton}
                onClick={handleClearAllRecent}
              >
                Xóa tất cả
              </button>
            </div>
            <div className={styles.suggestionList}>
              {recentSearches.slice(0, 5).map((search, index) => (
                <div
                  key={`recent-${index}`}
                  className={styles.suggestionItem}
                  onClick={() => handleSuggestionClick(search)}
                >
                  <Clock size={14} />
                  <span>{search}</span>
                  <button
                    className={styles.removeButton}
                    onClick={e => handleRemoveRecentSearch(search, e)}
                    aria-label="Xóa tìm kiếm này"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Từ khóa tìm kiếm phổ biến */}
        <div className={styles.popularSearches}>
          <div className={styles.suggestionHeader}>
            <div className={styles.suggestionTitle}>
              <Trending size={16} />
              <span>Tìm kiếm phổ biến</span>
            </div>
          </div>
          <div className={styles.popularTags}>
            {popularSearches.map((search, index) => (
              <div
                key={`popular-${index}`}
                className={styles.popularTag}
                onClick={() => handleSuggestionClick(search)}
              >
                {search}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default SearchSuggestions;
