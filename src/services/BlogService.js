import axios from 'axios';

const BlogService = {
  // Lấy danh sách blog posts với phân trang (PUBLIC API)
  getAllBlogPosts: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`/api/blog/posts`, {
        params: {
          pageNumber,
          pageSize
        }
      });
      
      // Kiểm tra nếu response có cấu trúc APIResponse
      let data = response.data;
      if (data && data.success !== undefined) {
        // Đây là APIResponse format
        if (!data.success) {
          throw new Error(data.message || 'Lỗi API');
        }
        data = data.data; // Lấy data từ APIResponse
      }
      
      // Transform backend response to match frontend format
      if (data && data.content) {
        const transformedContent = data.content.map(post => ({
          postID: post.postID || post.id,
          id: post.postID || post.id,
          title: post.title,
          content: post.content,
          summary: post.summary,
          coverImageUrl: post.coverImageUrl,
          slug: post.slug,
          tags: post.tags,
          author: {
            id: post.author?.id || post.authorId,
            fullName: post.author?.fullName || post.authorName || 'Gynexa',
            name: post.author?.fullName || post.authorName || 'Gynexa'
          },
          categories: post.categories ? post.categories.map(cat => ({
            categoryID: cat.categoryID || cat.id,
            id: cat.categoryID || cat.id,
            categoryName: cat.categoryName || cat.name,
            name: cat.categoryName || cat.name
          })) : [],
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          isPublished: post.isPublished || false,
          featured: post.isPublished || false,
          views: post.views || 0,
          likes: post.likes || 0,
          commentsCount: post.commentsCount || 0
        }));
        
        return {
          ...data,
          content: transformedContent
        };
      }
      
      // Nếu không có content, trả về response rỗng
      return {
        content: [],
        pageNumber: pageNumber,
        pageSize: pageSize,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
      };
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh sách bài viết');
    }
  },

  // Lấy blog post theo ID (PUBLIC API)
  getBlogPostById: async (postId) => {
    try {
      const response = await axios.get(`/api/blog/posts/${postId}`);
      
      // Kiểm tra nếu response có cấu trúc APIResponse
      let data = response.data;
      if (data && data.success !== undefined) {
        // Đây là APIResponse format
        if (!data.success) {
          throw new Error(data.message || 'Lỗi API');
        }
        data = data.data; // Lấy data từ APIResponse
      }
      
      // Transform backend response to match frontend format
      if (data) {
        return {
          postID: data.postID || data.id,
          id: data.postID || data.id,
          title: data.title,
          content: data.content,
          summary: data.summary,
          coverImageUrl: data.coverImageUrl,
          slug: data.slug,
          tags: data.tags,
          author: {
            id: data.author?.id || data.authorId,
            fullName: data.author?.fullName || data.authorName || 'Gynexa',
            name: data.author?.fullName || data.authorName || 'Gynexa'
          },
          categories: data.categories ? data.categories.map(cat => ({
            categoryID: cat.categoryID || cat.id,
            id: cat.categoryID || cat.id,
            categoryName: cat.categoryName || cat.name,
            name: cat.categoryName || cat.name
          })) : [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          isPublished: data.isPublished || false,
          featured: data.isPublished || false,
          views: data.views || 0,
          likes: data.likes || 0,
          commentsCount: data.commentsCount || 0
        };
      }
      
      return data;
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải bài viết');
    }
  },

  // Tạo blog post mới (ADMIN API)
  createBlogPost: async (formData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/api/blog/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể tạo bài viết');
    }
  },

  // Cập nhật blog post (ADMIN API)
  updateBlogPost: async (postId, formData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`/api/blog/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật bài viết');
    }
  },

  // Xóa blog post (ADMIN API)
  deleteBlogPost: async (postId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`/api/blog/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xóa bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể xóa bài viết');
    }
  },

  // Lấy blog posts theo category (PUBLIC API)
  getBlogPostsByCategory: async (categoryId, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`/api/blog/posts/category/${categoryId}`, {
        params: {
          pageNumber,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải bài viết theo danh mục:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải bài viết theo danh mục');
    }
  },

  // Tìm kiếm blog posts (PUBLIC API)
  searchBlogPosts: async (keyword, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`/api/blog/posts/search`, {
        params: {
          keyword,
          pageNumber,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tìm kiếm bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể tìm kiếm bài viết');
    }
  },

  // Lấy featured blog posts (PUBLIC API)
  getFeaturedBlogPosts: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await axios.get(`/api/blog/posts/featured`, {
        params: {
          pageNumber,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải bài viết nổi bật:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải bài viết nổi bật');
    }
  },

  // Lấy danh sách categories (PUBLIC API)
  getAllCategories: async () => {
    try {
      const response = await axios.get(`/api/blog/categories`);
      
      // Kiểm tra nếu response có cấu trúc APIResponse
      let data = response.data;
      if (data && data.success !== undefined) {
        // Đây là APIResponse format
        if (!data.success) {
          throw new Error(data.message || 'Lỗi API');
        }
        data = data.data; // Lấy data từ APIResponse
      }
      
      // Transform backend response to match frontend format
      if (data && Array.isArray(data)) {
        return data.map(category => ({
          categoryID: category.categoryID || category.id,
          categoryName: category.categoryName || category.name,
          description: category.description,
          slug: category.slug,
          createdAt: category.createdAt,
          // Thêm các field alias để tương thích
          id: category.categoryID || category.id,
          name: category.categoryName || category.name
        }));
      }
      
      return data || [];
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh mục');
    }
  },

  // Alias cho getAllCategories để tương thích với code cũ
  getBlogCategories: async () => {
    return BlogService.getAllCategories();
  },

  // Lấy category theo ID (PUBLIC API)
  getCategoryById: async (categoryId) => {
    try {
      const response = await axios.get(`/api/blog/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải danh mục:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh mục');
    }
  },

  // Tạo category mới (ADMIN API)
  createCategory: async (categoryData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.post('/api/blog/categories', categoryData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Create category response:', response.data);

      // Xử lý ApiResponse format
      let data = response.data;
      if (data && data.success !== undefined) {
        if (!data.success) {
          throw new Error(data.message || 'Lỗi API');
        }
        data = data.data; // Lấy data từ ApiResponse
      }

      return data;
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
      throw error;
    }
  },

  // Cập nhật category (ADMIN API)
  updateCategory: async (categoryId, categoryData) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.put(`/api/blog/categories/${categoryId}`, categoryData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Update category response:', response.data);

      // Xử lý ApiResponse format
      let data = response.data;
      if (data && data.success !== undefined) {
        if (!data.success) {
          throw new Error(data.message || 'Lỗi API');
        }
        data = data.data; // Lấy data từ ApiResponse
      }

      return data;
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      throw error;
    }
  },

  // Xóa category (ADMIN API)
  deleteCategory: async (categoryId) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.delete(`/api/blog/categories/${categoryId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete category response:', response.data);

      // Xử lý ApiResponse format
      let data = response.data;
      if (data && data.success !== undefined) {
        if (!data.success) {
          throw new Error(data.message || 'Lỗi API');
        }
        data = data.data; // Lấy data từ ApiResponse
      }

      return data;
    } catch (error) {
      console.error('Lỗi khi xóa danh mục:', error);
      throw error;
    }
  },

  // Lấy category với posts (PUBLIC API)
  getCategoryWithPosts: async (categoryId) => {
    try {
      const response = await axios.get(`/api/blog/categories/${categoryId}/with-posts`);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải danh mục với bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh mục với bài viết');
    }
  },

  // Lấy tất cả categories với posts (PUBLIC API)
  getAllCategoriesWithPosts: async () => {
    try {
      const response = await axios.get('/api/blog/categories/with-posts');
      return response.data;
    } catch (error) {
      console.error('Lỗi khi tải tất cả danh mục với bài viết:', error);
      throw new Error(error.response?.data?.message || 'Không thể tải danh mục với bài viết');
    }
  }
};

export default BlogService; 