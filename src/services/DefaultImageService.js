import instance from './customize-axios';

class DefaultImageService {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Lấy URL ảnh mặc định theo loại
   */
  async getDefaultImageUrl(imageType) {
    // Kiểm tra cache trước
    if (this.cache.has(imageType)) {
      return this.cache.get(imageType);
    }

    try {
      const response = await instance.get(`/api/default-images/${imageType}`);
      if (response.data.success) {
        const imageUrl = response.data.data;
        this.cache.set(imageType, imageUrl);
        return imageUrl;
      }
    } catch (error) {
      console.error('Error getting default image URL:', error);
    }

    // Trả về URL mặc định hardcode nếu không lấy được từ API
    return this.getHardcodedDefaultUrl(imageType);
  }

  /**
   * Lấy tất cả ảnh mặc định
   */
  async getAllDefaultImages() {
    try {
      const response = await instance.get('/api/default-images');
      if (response.data.success) {
        const images = response.data.data;
        // Cập nhật cache
        Object.entries(images).forEach(([key, value]) => {
          this.cache.set(key, value);
        });
        return images;
      }
    } catch (error) {
      console.error('Error getting all default images:', error);
    }

    // Trả về ảnh mặc định hardcode
    return this.getHardcodedDefaultImages();
  }

  /**
   * Upload ảnh mặc định
   */
  async uploadDefaultImage(imageType, base64Image) {
    try {
      const response = await instance.post('/api/default-images/upload', null, {
        params: {
          imageType,
          base64Image
        }
      });

      if (response.data.success) {
        // Cập nhật cache
        const imageUrl = response.data.data.secure_url;
        this.cache.set(imageType, imageUrl);
        return response.data;
      }
    } catch (error) {
      console.error('Error uploading default image:', error);
      throw error;
    }
  }

  /**
   * Cập nhật ảnh mặc định
   */
  async updateDefaultImage(imageType, base64Image) {
    try {
      const response = await instance.put(`/api/default-images/${imageType}`, null, {
        params: {
          base64Image
        }
      });

      if (response.data.success) {
        // Cập nhật cache
        const imageUrl = response.data.data.secure_url;
        this.cache.set(imageType, imageUrl);
        return response.data;
      }
    } catch (error) {
      console.error('Error updating default image:', error);
      throw error;
    }
  }

  /**
   * Xóa ảnh mặc định
   */
  async deleteDefaultImage(imageType) {
    try {
      const response = await instance.delete(`/api/default-images/${imageType}`);
      if (response.data.success) {
        // Xóa khỏi cache
        this.cache.delete(imageType);
        return response.data;
      }
    } catch (error) {
      console.error('Error deleting default image:', error);
      throw error;
    }
  }

  /**
   * Kiểm tra ảnh mặc định có tồn tại không
   */
  async checkDefaultImageExists(imageType) {
    try {
      const response = await instance.get(`/api/default-images/${imageType}/exists`);
      return response.data.success && response.data.data;
    } catch (error) {
      console.error('Error checking default image exists:', error);
      return false;
    }
  }

  /**
   * Lấy URL ảnh với fallback
   */
  async getImageUrlWithFallback(imageType, customUrl = null) {
    // Nếu có custom URL, ưu tiên sử dụng
    if (customUrl) {
      return customUrl;
    }

    // Lấy URL mặc định
    return await this.getDefaultImageUrl(imageType);
  }

  /**
   * Lấy URL mặc định hardcode
   */
  getHardcodedDefaultUrl(imageType) {
    switch (imageType) {
      case 'user_avatar_default':
        return 'https://res.cloudinary.com/ddigxv6m7/image/upload/v1705123456/gender-healthcare/defaults/user-avatar-default.png';
      case 'consultant_avatar_default':
        return 'https://res.cloudinary.com/ddigxv6m7/image/upload/v1705123456/gender-healthcare/defaults/consultant-avatar-default.png';
      case 'blog_cover_default':
        return 'https://res.cloudinary.com/ddigxv6m7/image/upload/v1705123456/gender-healthcare/defaults/blog-cover-default.png';
      case 'service_icon_default':
        return 'https://res.cloudinary.com/ddigxv6m7/image/upload/v1705123456/gender-healthcare/defaults/service-icon-default.png';
      case 'notification_icon_default':
        return 'https://res.cloudinary.com/ddigxv6m7/image/upload/v1705123456/gender-healthcare/defaults/notification-icon-default.png';
      default:
        return 'https://res.cloudinary.com/ddigxv6m7/image/upload/v1705123456/gender-healthcare/defaults/generic-default.png';
    }
  }

  /**
   * Lấy tất cả ảnh mặc định hardcode
   */
  getHardcodedDefaultImages() {
    return {
      user_avatar_default: this.getHardcodedDefaultUrl('user_avatar_default'),
      consultant_avatar_default: this.getHardcodedDefaultUrl('consultant_avatar_default'),
      blog_cover_default: this.getHardcodedDefaultUrl('blog_cover_default'),
      service_icon_default: this.getHardcodedDefaultUrl('service_icon_default'),
      notification_icon_default: this.getHardcodedDefaultUrl('notification_icon_default')
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Preload tất cả ảnh mặc định
   */
  async preloadDefaultImages() {
    try {
      await this.getAllDefaultImages();
    } catch (error) {
      console.error('Error preloading default images:', error);
    }
  }
}

// Singleton instance
const defaultImageService = new DefaultImageService();

export default defaultImageService; 