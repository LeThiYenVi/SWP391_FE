import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { searchContentAPI } from '../../services/UsersSevices';
import {
  searchData,
  popularSearchTerms,
  searchHelper,
} from '../../data/mock/searchData';
import SearchFilters from './components/SearchFilters';
import SearchResults from './components/SearchResults';
import SearchSuggestions from './components/SearchSuggestions';
import styles from './Search.module.css';

// Danh mục
import {
  Search as SearchIconCategory,
  User,
  Heart,
  FileText,
  TestTube,
} from 'lucide-react';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const searchInputRef = useRef(null);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'all',
    location: searchParams.get('location') || '',
    priceRange: searchParams.get('priceRange') || 'all',
    rating: searchParams.get('rating') || 'all',
    availability: searchParams.get('availability') || 'all',
    sortBy: searchParams.get('sortBy') || 'relevance',
  });

  // Danh mục
  const categories = [
    { value: 'all', label: 'Tất cả', icon: SearchIconCategory },
    { value: 'counselors', label: 'Tư vấn viên', icon: User },
    { value: 'services', label: 'Dịch vụ', icon: Heart },
    { value: 'articles', label: 'Bài viết', icon: FileText },
    { value: 'tests', label: 'Xét nghiệm', icon: TestTube },
  ];

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }

    // Listen for updates to recent searches from SearchSuggestions component
    const handleRecentSearchesUpdate = event => {
      setRecentSearches(event.detail);
    };

    window.addEventListener(
      'recentSearchesUpdated',
      handleRecentSearchesUpdate
    );

    return () => {
      window.removeEventListener(
        'recentSearchesUpdated',
        handleRecentSearchesUpdate
      );
    };
  }, []);

  // Tự động tìm kiếm khi có query trong URL
  useEffect(() => {
    const initialQuery = searchParams.get('q');
    if (initialQuery) {
      performSearch(initialQuery, filters);
    }
  }, []);

  // Hàm tìm kiếm
  const performSearch = async (searchQuery, searchFilters = filters) => {
    if (!searchQuery?.trim()) return;

    setLoading(true);
    setShowSuggestions(false);

    try {
      // Update URL params
      const params = new URLSearchParams();
      params.set('q', searchQuery);
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== 'all' && value !== '') {
          params.set(key, value);
        }
      });
      setSearchParams(params);

      // Save to recent searches
      if (searchQuery.trim()) {
        const newRecentSearches = [
          searchQuery,
          ...recentSearches.filter(s => s !== searchQuery),
        ].slice(0, 10);
        setRecentSearches(newRecentSearches);
        localStorage.setItem(
          'recentSearches',
          JSON.stringify(newRecentSearches)
        );
      }

      try {
        // TODO: Thay thế bằng API thực tế khi backend sẵn sàng
        // const response = await searchContentAPI(searchQuery, searchFilters);
        // setResults(response.data);

        // Sử dụng mock data cho giai đoạn phát triển
        await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ API
        const searchResults = searchHelper.search(searchQuery, searchFilters);
        setResults(searchResults);
      } catch (error) {
        console.error('Search API error:', error);
        toast.error('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại.');
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi input
  const handleSearchInputChange = e => {
    const value = e.target.value;
    setQuery(value);

    // Show suggestions khi có nhập liệu
    if (value.trim().length > 0) {
      // Tạo gợi ý từ popularSearches
      const filtered = popularSearchTerms.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(true);
    }
  };

  // Xử lý submit form tìm kiếm
  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  // Xử lý click bên ngoài vùng gợi ý
  useEffect(() => {
    const handleClickOutside = event => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Xóa tất cả lịch sử tìm kiếm
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchContainer}>
        {/* Tiêu đề trang */}
        <div className={styles.searchHeader}>
          <h1>Tìm kiếm</h1>
          <p>Tìm kiếm tư vấn viên, dịch vụ, hoặc thông tin sức khỏe</p>
        </div>

        {/* Ô tìm kiếm */}
        <div className={styles.searchInputWrapper} ref={searchInputRef}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.inputGroup}>
              <SearchIcon className={styles.searchIcon} size={20} />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Tìm kiếm dịch vụ, bác sĩ, thông tin sức khỏe..."
                value={query}
                onChange={handleSearchInputChange}
                onFocus={() => setShowSuggestions(true)}
                aria-label="Tìm kiếm"
              />
              {query && (
                <button
                  type="button"
                  className={styles.clearButton}
                  onClick={() => {
                    setQuery('');
                    setShowSuggestions(true);
                  }}
                  aria-label="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className={styles.searchButton}>
              Tìm kiếm
            </button>
          </form>

          {/* Gợi ý tìm kiếm */}
          {showSuggestions && (
            <SearchSuggestions
              query={query}
              suggestions={suggestions}
              recentSearches={recentSearches}
              popularSearches={popularSearchTerms}
              setQuery={setQuery}
              performSearch={performSearch}
              clearRecentSearches={clearRecentSearches}
            />
          )}
        </div>

        {/* Bộ lọc */}
        <SearchFilters
          filters={filters}
          setFilters={setFilters}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          categories={categories}
        />

        {/* Active filters */}
        {Object.values(filters).some(
          value => value !== 'all' && value !== ''
        ) && (
          <div className={styles.activeFilters}>
            <span>Bộ lọc đang áp dụng:</span>
            <div className={styles.filterTags}>
              {filters.category !== 'all' && (
                <div className={styles.filterTag}>
                  <span>
                    {categories.find(cat => cat.value === filters.category)
                      ?.label || filters.category}
                  </span>
                  <button
                    onClick={() =>
                      setFilters(prev => ({ ...prev, category: 'all' }))
                    }
                    aria-label="Xóa bộ lọc danh mục"
                  >
                    ✕
                  </button>
                </div>
              )}
              {filters.location && (
                <div className={styles.filterTag}>
                  <span>Địa điểm: {filters.location}</span>
                  <button
                    onClick={() =>
                      setFilters(prev => ({ ...prev, location: '' }))
                    }
                    aria-label="Xóa bộ lọc địa điểm"
                  >
                    ✕
                  </button>
                </div>
              )}
              {/* Các bộ lọc khác tương tự */}
            </div>
            <button
              className={styles.clearFiltersButton}
              onClick={() =>
                setFilters({
                  category: 'all',
                  location: '',
                  priceRange: 'all',
                  rating: 'all',
                  availability: 'all',
                  sortBy: 'relevance',
                })
              }
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}

        {/* Kết quả tìm kiếm */}
        <SearchResults results={results} loading={loading} query={query} />
      </div>
    </div>
  );
};

export default Search;
