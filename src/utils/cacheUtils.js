/**
 * Cache và versioning utilities cho ứng dụng
 */

/**
 * Thêm timestamp query cho development để tránh cache
 * @param {string} url - URL gốc
 * @returns {string} - URL với query timestamp
 */
export const addCacheBuster = (url) => {
  if (import.meta.env.DEV) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${Date.now()}`;
  }
  return url;
};

/**
 * Tạo URL với version hash cho assets
 * @param {string} assetPath - Đường dẫn asset
 * @param {string} version - Version string (optional)
 * @returns {string} - URL với version
 */
export const getVersionedAssetUrl = (assetPath, version = null) => {
  // Trong production, Vite tự động hash
  if (import.meta.env.PROD) {
    return assetPath;
  }
  
  // Trong development, thêm version manual nếu cần
  if (version) {
    const separator = assetPath.includes('?') ? '&' : '?';
    return `${assetPath}${separator}v=${version}`;
  }
  
  return addCacheBuster(assetPath);
};

/**
 * Clear browser cache programmatically
 */
export const clearCache = async () => {
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('Cache cleared successfully');
    }
    
    // Reload trang sau khi clear cache
    window.location.reload(true);
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
};

/**
 * Get app version từ package.json (nếu có)
 */
export const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0';
};

/**
 * Check và so sánh version, clear cache nếu cần
 */
export const checkVersionAndClearCache = () => {
  const currentVersion = getAppVersion();
  const storedVersion = localStorage.getItem('app_version');
  
  if (storedVersion && storedVersion !== currentVersion) {
    console.log(`Version changed from ${storedVersion} to ${currentVersion}`);
    clearCache();
  }
  
  localStorage.setItem('app_version', currentVersion);
};

/**
 * Preload critical resources với versioning
 */
export const preloadResources = (resources = []) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = getVersionedAssetUrl(resource);
    document.head.appendChild(link);
  });
};

/**
 * Service Worker cache management
 */
export const updateServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        console.log('Service Worker updated');
      }
    } catch (error) {
      console.error('Error updating Service Worker:', error);
    }
  }
};

/**
 * Force reload với cache bypass
 */
export const forceReload = () => {
  // Bypass cache khi reload
  window.location.reload(true);
};

export default {
  addCacheBuster,
  getVersionedAssetUrl,
  clearCache,
  getAppVersion,
  checkVersionAndClearCache,
  preloadResources,
  updateServiceWorker,
  forceReload
};
