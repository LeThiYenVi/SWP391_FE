import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Eye, Tag, Home, Heart } from 'lucide-react';
import BlogService from '../services/BlogService';
import { toast } from 'react-toastify';
import styles from './BlogPage.module.css';

const BlogPage = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadBlogPosts();
    loadCategories();
  }, [currentPage, searchQuery, selectedCategory]);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getAllBlogPosts(currentPage, 9);
      
      console.log('📊 Blog API Response:', response);
      
      if (response && response.content && Array.isArray(response.content)) {
        setBlogPosts(response.content);
        setTotalPages(response.totalPages || 1);
      } else if (response && Array.isArray(response)) {
        setBlogPosts(response);
        setTotalPages(1);
      } else {
        console.warn('⚠️ Unexpected response format:', response);
        setBlogPosts([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('❌ Error loading blog posts:', error);
      toast.error('Không thể tải danh sách bài viết');
      setBlogPosts([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await BlogService.getAllCategories();
      
      if (response && Array.isArray(response)) {
        setCategories(response);
      } else {
        console.warn('⚠️ Unexpected categories response:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      setCategories([]);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.categories?.some(cat => cat.categoryName === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.blogPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.navigationButtons}>
            <Link to="/" className={styles.navButton}>
              <Home size={20} />
              Trang chủ
            </Link>
          </div>
          
          <h1>Blog - Cập nhật tri thức</h1>
          <p>Khám phá những thông tin hữu ích về sức khỏe phụ nữ và các vấn đề sinh sản</p>
        </div>

        {/* Search and Filter */}
        <div className={styles.searchFilter}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <div className={styles.searchInput}>
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button type="submit" className={styles.searchBtn}>
              Tìm kiếm
            </button>
          </form>

          <div className={styles.categoryFilter}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.categorySelect}
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map(category => (
                <option key={category.categoryID} value={category.categoryName}>
                  {category.categoryName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Đang tải bài viết...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className={styles.noPosts}>
            <div className={styles.noPostsIcon}>📝</div>
            <h3>Chưa có bài viết nào</h3>
            <p>
              {searchQuery || selectedCategory !== 'all' 
                ? 'Không tìm thấy bài viết phù hợp với tìm kiếm của bạn.' 
                : 'Hiện tại chưa có bài viết nào được đăng tải. Vui lòng quay lại sau!'}
            </p>
          </div>
        ) : (
          <>
            <div className={styles.blogGrid}>
              {console.log('🔍 Debug - Rendering posts:', filteredPosts.map(p => ({ id: p.postID, title: p.title, coverImageUrl: p.coverImageUrl })))}
              {filteredPosts.map((post) => (
                <Link
                  key={post.postID}
                  to={`/blog/${post.postID}`}
                  className={styles.blogCard}
                >
                  <div className={styles.blogImage}>
                    {post.coverImageUrl ? (
                      <img 
                        src={post.coverImageUrl} 
                        alt={post.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                        onLoad={() => console.log('✅ Image loaded successfully:', post.coverImageUrl)}
                        onError={(e) => {
                          console.log('❌ Image failed to load:', post.coverImageUrl);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={styles.imagePlaceholder}
                      style={{ 
                        display: post.coverImageUrl ? 'none' : 'flex',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                      }}
                    >
                      📝
                    </div>
                  </div>
                  <div className={styles.blogContent}>
                    <div className={styles.blogMeta}>
                      <span className={styles.blogDate}>
                        <Calendar size={14} />
                        {formatDate(post.createdAt)}
                      </span>
                      <span className={styles.blogAuthor}>
                        <User size={14} />
                        {post.author?.fullName || 'Gynexa'}
                      </span>
                    </div>
                    
                    <h3 className={styles.blogTitle}>{post.title}</h3>
                    
                    <p className={styles.blogSummary}>
                      {post.summary || post.content?.substring(0, 150) + '...' || 'Khám phá những thông tin hữu ích về sức khỏe phụ nữ.'}
                    </p>
                    
                    <div className={styles.blogFooter}>
                      <div className={styles.blogCategories}>
                        {post.categories?.map((category, index) => (
                          <span key={index} className={styles.categoryTag}>
                            <Tag size={12} />
                            {category.categoryName}
                          </span>
                        ))}
                      </div>
                      
                      <div className={styles.blogStats}>
                        <span className={styles.views}>
                          <Eye size={14} />
                          {post.views || 0}
                        </span>
                        <span className={styles.likes}>
                          <Heart size={14} />
                          {post.likes || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={styles.pageBtn}
                >
                  Trước
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${styles.pageBtn} ${currentPage === page ? styles.active : ''}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={styles.pageBtn}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BlogPage; 