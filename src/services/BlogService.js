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
      return response.data;
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      throw error;
    }
  },

  // Lấy blog post theo ID (PUBLIC API)
  getBlogPostById: async (postId) => {
    try {
      const response = await publicAxios.get(`/api/blog/posts/${postId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog post:', error);
      throw error;
    }
  },

  // Tạo blog post mới (ADMIN API)
  createBlogPost: async (blogPostData) => {
    try {
      const response = await authAxios.post('/api/blog/posts', blogPostData);
      return response.data;
    } catch (error) {
      console.error('Error creating blog post:', error);
      throw error;
    }
  },

  // Cập nhật blog post (ADMIN API)
  updateBlogPost: async (postId, blogPostData) => {
    try {
      const response = await authAxios.put(`/api/blog/posts/${postId}`, blogPostData);
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

  // Lấy tất cả categories (PUBLIC API)
  getAllCategories: async () => {
    try {
      const response = await publicAxios.get('/api/blog/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
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