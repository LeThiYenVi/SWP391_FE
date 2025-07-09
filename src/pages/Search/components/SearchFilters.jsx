import React from 'react';
import { Filter, ChevronDown, X } from 'lucide-react';
import styles from '../Search.module.css';

const SearchFilters = ({
  filters,
  setFilters,
  showFilters,
  setShowFilters,
  categories,
}) => {
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const locations = ['Tất cả', 'TP.HCM', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ'];
  const ratings = [
    { value: 'all', label: 'Tất cả' },
    { value: '4.5', label: '4.5 sao trở lên' },
    { value: '4.0', label: '4.0 sao trở lên' },
    { value: '3.5', label: '3.5 sao trở lên' },
  ];
  const priceRanges = [
    { value: 'all', label: 'Tất cả mức giá' },
    { value: 'low', label: 'Dưới 300.000đ' },
    { value: 'medium', label: '300.000đ - 500.000đ' },
    { value: 'high', label: 'Trên 500.000đ' },
  ];
  const sortOptions = [
    { value: 'relevance', label: 'Độ liên quan' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
    { value: 'price_low', label: 'Giá thấp đến cao' },
    { value: 'price_high', label: 'Giá cao đến thấp' },
    { value: 'newest', label: 'Mới nhất' },
  ];
  const availabilityOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'now', label: 'Có thể tư vấn ngay' },
    { value: 'today', label: 'Có lịch hẹn trong hôm nay' },
    { value: 'week', label: 'Có lịch hẹn trong tuần này' },
  ];

  const resetFilters = () => {
    setFilters({
      category: 'all',
      location: '',
      priceRange: 'all',
      rating: 'all',
      availability: 'all',
      sortBy: 'relevance',
    });
  };

  return (
    <div className={styles.filterSection}>
      {/* Filter toggle button */}
      <button
        className={styles.filterToggle}
        onClick={() => setShowFilters(!showFilters)}
        aria-expanded={showFilters}
        aria-label="Hiển thị bộ lọc"
      >
        <Filter size={18} />
        <span>Bộ lọc</span>
        <ChevronDown size={16} className={showFilters ? styles.rotated : ''} />
      </button>

      {/* Filters dropdown */}
      {showFilters && (
        <div className={styles.filtersDropdown}>
          <div className={styles.filterHeader}>
            <h3>Bộ lọc tìm kiếm</h3>
            <button
              onClick={() => setShowFilters(false)}
              aria-label="Đóng bộ lọc"
            >
              <X size={18} />
            </button>
          </div>

          {/* Filter groups */}
          <div className={styles.filterGroups}>
            {/* Category Filter */}
            <div className={styles.filterGroup}>
              <h4>Danh mục</h4>
              <div className={styles.filterOptions}>
                {categories.map(category => (
                  <label key={category.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="category"
                      checked={filters.category === category.value}
                      onChange={() =>
                        handleFilterChange('category', category.value)
                      }
                    />
                    <span>
                      {React.createElement(category.icon, { size: 16 })}
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            <div className={styles.filterGroup}>
              <h4>Địa điểm</h4>
              <div className={styles.filterOptions}>
                {locations.map(location => (
                  <label key={location} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="location"
                      checked={
                        filters.location ===
                        (location === 'Tất cả' ? '' : location)
                      }
                      onChange={() =>
                        handleFilterChange(
                          'location',
                          location === 'Tất cả' ? '' : location
                        )
                      }
                    />
                    <span>{location}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className={styles.filterGroup}>
              <h4>Khoảng giá</h4>
              <div className={styles.filterOptions}>
                {priceRanges.map(option => (
                  <label key={option.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="priceRange"
                      checked={filters.priceRange === option.value}
                      onChange={() =>
                        handleFilterChange('priceRange', option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div className={styles.filterGroup}>
              <h4>Đánh giá</h4>
              <div className={styles.filterOptions}>
                {ratings.map(option => (
                  <label key={option.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === option.value}
                      onChange={() =>
                        handleFilterChange('rating', option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className={styles.filterGroup}>
              <h4>Thời gian</h4>
              <div className={styles.filterOptions}>
                {availabilityOptions.map(option => (
                  <label key={option.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="availability"
                      checked={filters.availability === option.value}
                      onChange={() =>
                        handleFilterChange('availability', option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div className={styles.filterGroup}>
              <h4>Sắp xếp theo</h4>
              <div className={styles.filterOptions}>
                {sortOptions.map(option => (
                  <label key={option.value} className={styles.filterOption}>
                    <input
                      type="radio"
                      name="sortBy"
                      checked={filters.sortBy === option.value}
                      onChange={() =>
                        handleFilterChange('sortBy', option.value)
                      }
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Filter actions */}
          <div className={styles.filterActions}>
            <button onClick={resetFilters} className={styles.resetButton}>
              Đặt lại
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className={styles.applyButton}
            >
              Áp dụng
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
