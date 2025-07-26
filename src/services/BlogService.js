import axios from 'axios';
import authAxios from './customize-axios';
import { API_BASE_URL } from '../config';

// Create a separate axios instance for public APIs (without auth headers)
const publicAxios = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

const BlogService = {
  // Lấy danh sách blog posts với phân trang (PUBLIC API)
  getAllBlogPosts: async (pageNumber = 1, pageSize = 10) => {
    try {
      console.log('Fetching blog posts from:', `${API_BASE_URL}/api/blog/posts`);
      
      const response = await publicAxios.get(`/api/blog/posts`, {
        params: {
          pageNumber,
          pageSize
        }
      });
      
      console.log('Backend response:', response.data);
      
      // Kiểm tra nếu response có cấu trúc APIResponse
      let data = response.data;
      if (data && data.success !== undefined) {
        // Đây là APIResponse format
        if (!data.success) {
          console.warn('API returned error:', data.message);
          throw new Error(data.message || 'API error');
        }
        data = data.data; // Lấy data từ APIResponse
      }
      
      // Transform backend response to match frontend format
      if (data && data.content) {
        const transformedContent = data.content.map(post => ({
          id: post.postID || post.id,
          title: post.title,
          content: post.content,
          summary: post.summary,
          author: {
            id: post.author?.id || post.authorId,
            name: post.author?.fullName || post.authorName || 'Gynexa'
          },
          categories: post.categories ? post.categories.map(cat => ({
            id: cat.categoryID || cat.id,
            name: cat.categoryName || cat.name
          })) : [],
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          featured: post.isPublished || false,
          views: post.views || 0
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
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Lấy blog post theo ID (PUBLIC API)
  getBlogPostById: async (postId) => {
    try {
      const response = await publicAxios.get(`/api/blog/posts/${postId}`);
      console.log('Backend response for blog post:', response.data);
      
      // Transform backend response to match frontend format
      const post = response.data;
      if (post) {
        return {
          id: post.postID || post.id,
          title: post.title,
          content: post.content,
          author: {
            id: post.author?.id || post.authorId,
            name: post.author?.fullName || post.authorName
          },
          categories: post.categories ? post.categories.map(cat => ({
            id: cat.categoryID || cat.id,
            name: cat.categoryName || cat.name
          })) : [],
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
          featured: post.isPublished || false
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Tạo blog post mới (ADMIN API)
  createBlogPost: async (formData) => {
    try {
      const response = await authAxios.post('/api/blog/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Cập nhật blog post (ADMIN API)
  updateBlogPost: async (postId, formData) => {
    try {
      const response = await authAxios.put(`/api/blog/posts/${postId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating blog post:', error);
      throw error;
    }
  },

  // Xóa blog post (ADMIN API)
  deleteBlogPost: async (postId) => {
    try {
      const response = await authAxios.delete(`/api/blog/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog post:', error);
      throw error;
    }
  },

  // Lấy blog posts theo category (PUBLIC API)
  getBlogPostsByCategory: async (categoryId, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await publicAxios.get(`/api/blog/posts/category/${categoryId}?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts by category:', error);
      throw error;
    }
  },

  // Tìm kiếm blog posts (PUBLIC API)
  searchBlogPosts: async (keyword, pageNumber = 1, pageSize = 10) => {
    try {
      const response = await publicAxios.get(`/api/blog/posts/search?keyword=${encodeURIComponent(keyword)}&pageNumber=${pageNumber}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Error searching blog posts:', error);
      throw error;
    }
  },

  // Lấy featured blog posts (PUBLIC API)
  getFeaturedBlogPosts: async (pageNumber = 1, pageSize = 10) => {
    try {
      const response = await publicAxios.get(`/api/blog/posts/featured?pageNumber=${pageNumber}&pageSize=${pageSize}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured blog posts:', error);
      throw error;
    }
  },

  // Lấy danh sách categories (PUBLIC API)
  getAllCategories: async () => {
    try {
      const response = await publicAxios.get(`/api/blog/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error;
    }
  },

  // Lấy category theo ID (PUBLIC API)
  getCategoryById: async (categoryId) => {
    try {
      const response = await publicAxios.get(`/api/blog/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category:', error);
      throw error;
    }
  },

  // Tạo category mới (ADMIN API)
  createCategory: async (categoryData) => {
    try {
      const response = await authAxios.post('/api/blog/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Cập nhật category (ADMIN API)
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await authAxios.put(`/api/blog/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Xóa category (ADMIN API)
  deleteCategory: async (categoryId) => {
    try {
      const response = await authAxios.delete(`/api/blog/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Lấy category với posts (PUBLIC API)
  getCategoryWithPosts: async (categoryId) => {
    try {
      const response = await publicAxios.get(`/api/blog/categories/${categoryId}/with-posts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching category with posts:', error);
      throw error;
    }
  },

  // Lấy tất cả categories với posts (PUBLIC API)
  getAllCategoriesWithPosts: async () => {
    try {
      const response = await publicAxios.get('/api/blog/categories/with-posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories with posts:', error);
      throw error;
    }
  }
};

export default BlogService; 