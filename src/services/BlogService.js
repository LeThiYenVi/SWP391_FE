import instance from "./customize-axios";

// =============Blog Posts APIs============
const getBlogPostsAPI = async (page = 0, size = 10) => {
  try {
    const response = await instance.get('/api/blog/posts', {
      params: {
        page,
        size,
        sort: 'createdAt,desc'
      }
    });
    console.log('Get blog posts success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get blog posts error:', error.response?.data || error.message);
    throw error;
  }
};

const getBlogPostByIdAPI = async (postId) => {
  try {
    const response = await instance.get(`/api/blog/posts/${postId}`);
    console.log('Get blog post by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get blog post by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const createBlogPostAPI = async (postData) => {
  try {
    const response = await instance.post('/api/blog/posts', postData);
    console.log('Create blog post success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create blog post error:', error.response?.data || error.message);
    throw error;
  }
};

const updateBlogPostAPI = async (postId, postData) => {
  try {
    const response = await instance.put(`/api/blog/posts/${postId}`, postData);
    console.log('Update blog post success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update blog post error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteBlogPostAPI = async (postId) => {
  try {
    const response = await instance.delete(`/api/blog/posts/${postId}`);
    console.log('Delete blog post success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete blog post error:', error.response?.data || error.message);
    throw error;
  }
};

const getBlogPostsByCategoryAPI = async (categoryId, page = 0, size = 10) => {
  try {
    const response = await instance.get(`/api/blog/posts/category/${categoryId}`, {
      params: {
        page,
        size,
        sort: 'createdAt,desc'
      }
    });
    console.log('Get blog posts by category success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get blog posts by category error:', error.response?.data || error.message);
    throw error;
  }
};

const searchBlogPostsAPI = async (keyword, page = 0, size = 10) => {
  try {
    const response = await instance.get('/api/blog/posts/search', {
      params: {
        keyword,
        page,
        size,
        sort: 'createdAt,desc'
      }
    });
    console.log('Search blog posts success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Search blog posts error:', error.response?.data || error.message);
    throw error;
  }
};

const getFeaturedBlogPostsAPI = async (page = 0, size = 10) => {
  try {
    const response = await instance.get('/api/blog/posts/featured', {
      params: {
        page,
        size,
        sort: 'createdAt,desc'
      }
    });
    console.log('Get featured blog posts success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get featured blog posts error:', error.response?.data || error.message);
    throw error;
  }
};

// =============Blog Categories APIs============
const getBlogCategoriesAPI = async (page = 0, size = 20) => {
  try {
    const response = await instance.get('/api/blog/categories', {
      params: {
        page,
        size,
        sort: 'name,asc'
      }
    });
    console.log('Get blog categories success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get blog categories error:', error.response?.data || error.message);
    throw error;
  }
};

const getBlogCategoryByIdAPI = async (categoryId) => {
  try {
    const response = await instance.get(`/api/blog/categories/${categoryId}`);
    console.log('Get blog category by ID success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get blog category by ID error:', error.response?.data || error.message);
    throw error;
  }
};

const createBlogCategoryAPI = async (categoryData) => {
  try {
    const response = await instance.post('/api/blog/categories', categoryData);
    console.log('Create blog category success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Create blog category error:', error.response?.data || error.message);
    throw error;
  }
};

const updateBlogCategoryAPI = async (categoryId, categoryData) => {
  try {
    const response = await instance.put(`/api/blog/categories/${categoryId}`, categoryData);
    console.log('Update blog category success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Update blog category error:', error.response?.data || error.message);
    throw error;
  }
};

const deleteBlogCategoryAPI = async (categoryId) => {
  try {
    const response = await instance.delete(`/api/blog/categories/${categoryId}`);
    console.log('Delete blog category success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Delete blog category error:', error.response?.data || error.message);
    throw error;
  }
};

const getCategoryWithPostsAPI = async (categoryId) => {
  try {
    const response = await instance.get(`/api/blog/categories/${categoryId}/with-posts`);
    console.log('Get category with posts success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get category with posts error:', error.response?.data || error.message);
    throw error;
  }
};

const getAllCategoriesWithPostsAPI = async () => {
  try {
    const response = await instance.get('/api/blog/categories/with-posts');
    console.log('Get all categories with posts success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Get all categories with posts error:', error.response?.data || error.message);
    throw error;
  }
};

export {
  // Blog Posts APIs
  getBlogPostsAPI,
  getBlogPostByIdAPI,
  createBlogPostAPI,
  updateBlogPostAPI,
  deleteBlogPostAPI,
  getBlogPostsByCategoryAPI,
  searchBlogPostsAPI,
  getFeaturedBlogPostsAPI,
  
  // Blog Categories APIs
  getBlogCategoriesAPI,
  getBlogCategoryByIdAPI,
  createBlogCategoryAPI,
  updateBlogCategoryAPI,
  deleteBlogCategoryAPI,
  getCategoryWithPostsAPI,
  getAllCategoriesWithPostsAPI
}; 