import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Eye, Tag } from 'lucide-react';
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
      const response = await BlogService.getAllBlogPosts(currentPage, 9); // 9 bài viết mỗi trang
      setBlogPosts(response.content || []);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      toast.error('Không thể tải danh sách bài viết');
      // Fallback data
      setBlogPosts([
        {
          id: 1,
          title: 'Những điều cần biết về chu kỳ kinh nguyệt của phụ nữ',
          summary: 'Chu kỳ kinh nguyệt là một hiện tượng sinh lý bình thường của cơ thể phụ nữ. Hiểu rõ về chu kỳ kinh nguyệt giúp phụ nữ theo dõi sức khỏe sinh sản và phát hiện sớm các vấn đề bất thường.',
          author: { name: 'Dr. Vũ Thị Thu Hiền' },
          createdAt: '2024-01-15T10:30:00',
          categories: [{ name: 'Sức khỏe sinh sản' }],
          views: 1250
        },
        {
          id: 2,
          title: 'Hướng dẫn cách chăm sóc sức khỏe phụ nữ hiệu quả',
          summary: 'Chăm sóc sức khỏe phụ nữ đòi hỏi sự quan tâm đặc biệt và kiến thức chuyên môn. Bài viết này sẽ cung cấp những lời khuyên hữu ích từ các chuyên gia y tế.',
          author: { name: 'Dr. Lê Văn Minh' },
          createdAt: '2024-01-14T14:20:00',
          categories: [{ name: 'Chăm sóc sức khỏe' }],
          views: 980
        },
        {
          id: 3,
          title: 'Tầm quan trọng của việc xét nghiệm STI định kỳ',
          summary: 'Xét nghiệm STI định kỳ là một phần quan trọng trong việc bảo vệ sức khỏe. Việc phát hiện sớm và điều trị kịp thời có thể ngăn ngừa các biến chứng nghiêm trọng.',
          author: { name: 'Dr. Đỗ Phạm Nguyệt Thanh' },
          createdAt: '2024-01-13T09:15:00',
          categories: [{ name: 'STIs' }],
          views: 756
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await BlogService.getBlogCategories();
      setCategories(response || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories([
        { id: 1, name: 'Sức khỏe sinh sản' },
        { id: 2, name: 'Chăm sóc sức khỏe' },
        { id: 3, name: 'STIs' },
        { id: 4, name: 'Tư vấn tâm lý' }
      ]);
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
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           post.categories?.some(cat => cat.name === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className={styles.blogPage}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
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
                <option key={category.id} value={category.name}>
                  {category.name}
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
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className={styles.blogCard}
                >
                  <div className={styles.blogImage}>
                    <div className={styles.imagePlaceholder}>
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
                        {post.author?.name || 'Gynexa'}
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
                            {category.name}
                          </span>
                        ))}
                      </div>
                      
                      <div className={styles.blogStats}>
                        <span className={styles.views}>
                          <Eye size={14} />
                          {post.views || Math.floor(Math.random() * 1000) + 100}
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