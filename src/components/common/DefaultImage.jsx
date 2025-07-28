import React, { useState, useEffect } from 'react';
import defaultImageService from '../../services/DefaultImageService';

const DefaultImage = ({ 
  src, 
  imageType = 'generic_default', 
  alt = 'Image', 
  className = '', 
  fallbackClassName = '',
  onError,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [defaultImageUrl, setDefaultImageUrl] = useState('');

  useEffect(() => {
    // Load default image URL
    const loadDefaultImage = async () => {
      try {
        const url = await defaultImageService.getDefaultImageUrl(imageType);
        setDefaultImageUrl(url);
      } catch (error) {
        console.error('Error loading default image:', error);
      }
    };

    loadDefaultImage();
  }, [imageType]);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleImageLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    
    // Nếu có ảnh mặc định, sử dụng nó
    if (defaultImageUrl && imageSrc !== defaultImageUrl) {
      setImageSrc(defaultImageUrl);
      setIsLoading(true);
      setHasError(false);
    } else {
      // Nếu không có ảnh mặc định hoặc đã là ảnh mặc định rồi
      if (onError) {
        onError();
      }
    }
  };

  // Nếu không có src và có ảnh mặc định, sử dụng ảnh mặc định
  useEffect(() => {
    if (!src && defaultImageUrl) {
      setImageSrc(defaultImageUrl);
    }
  }, [src, defaultImageUrl]);

  if (isLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 ${className}`} {...props}>
        <div className="w-full h-full bg-gray-300 rounded"></div>
      </div>
    );
  }

  if (hasError && !defaultImageUrl) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className} ${fallbackClassName}`} {...props}>
        <div className="text-center">
          <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-xs text-gray-500">Không tải được ảnh</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onLoad={handleImageLoad}
      onError={handleImageError}
      {...props}
    />
  );
};

export default DefaultImage; 