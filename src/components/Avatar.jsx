import React, { useState } from 'react';

const Avatar = ({
  src,
  alt = "Avatar",
  size = "md",
  fallbackSrc = "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  className = "",
  ...props
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
    xl: "w-32 h-32"
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  const displaySrc = imageError || !src ? fallbackSrc : src;

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`} {...props}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <img
        src={displaySrc}
        alt={alt}
        className={`w-full h-full rounded-full object-cover ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } transition-opacity duration-300`}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      
      {imageError && src && (
        <div className="absolute inset-0 bg-gray-100 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default Avatar; 