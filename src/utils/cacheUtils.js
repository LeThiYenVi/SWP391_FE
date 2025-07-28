
export const addCacheBuster = (url) => {
  if (import.meta.env.DEV) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${Date.now()}`;
  }
  return url;
};


export const getVersionedAssetUrl = (assetPath, version = null) => {
  if (import.meta.env.PROD) {
    return assetPath;
  }

  if (version) {
    const separator = assetPath.includes('?') ? '&' : '?';
    return `${assetPath}${separator}v=${version}`;
  }

  return addCacheBuster(assetPath);
};

export const clearCache = async () => {
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }

    window.location.reload(true);
  } catch (error) {
    // Silent error handling
  }
};
export const getAppVersion = () => {
  return import.meta.env.VITE_APP_VERSION || '1.0.0';
};

export const checkVersionAndClearCache = () => {
  const currentVersion = getAppVersion();
  const storedVersion = localStorage.getItem('app_version');

  if (storedVersion && storedVersion !== currentVersion) {
    clearCache();
  }

  localStorage.setItem('app_version', currentVersion);
};

export const preloadResources = (resources = []) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = getVersionedAssetUrl(resource);
    document.head.appendChild(link);
  });
};

export const updateServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
      }
    } catch (error) {
      // Silent error handling
    }
  }
};

export const forceReload = () => {
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
