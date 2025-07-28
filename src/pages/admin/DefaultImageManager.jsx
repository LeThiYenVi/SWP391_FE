import React, { useState, useEffect } from 'react';
import { Upload, Image, Trash2, Edit, Eye, Plus, Save, X } from 'lucide-react';
import instance from '../../services/customize-axios';
import { toast } from 'react-toastify';

const DefaultImageManager = () => {
  const [defaultImages, setDefaultImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImageType, setSelectedImageType] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const imageTypes = [
    { key: 'user_avatar_default', label: 'Avatar người dùng mặc định', description: 'Ảnh đại diện mặc định cho user' },
    { key: 'consultant_avatar_default', label: 'Avatar tư vấn viên mặc định', description: 'Ảnh đại diện mặc định cho consultant' },
    { key: 'blog_cover_default', label: 'Ảnh bìa blog mặc định', description: 'Ảnh bìa mặc định cho bài viết' },
    { key: 'service_icon_default', label: 'Icon dịch vụ mặc định', description: 'Icon mặc định cho các dịch vụ' },
    { key: 'notification_icon_default', label: 'Icon thông báo mặc định', description: 'Icon mặc định cho thông báo' }
  ];

  useEffect(() => {
    loadDefaultImages();
  }, []);

  const loadDefaultImages = async () => {
    try {
      setLoading(true);
      const response = await instance.get('/api/default-images');
      if (response.data.success) {
        setDefaultImages(response.data.data);
      }
    } catch (error) {
      console.error('Error loading default images:', error);
      toast.error('Lỗi khi tải danh sách ảnh mặc định');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Chỉ chấp nhận file ảnh!');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB!');
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (imageType, base64Image) => {
    try {
      setUploading(true);
      const response = await instance.post('/api/default-images/upload', null, {
        params: {
          imageType,
          base64Image
        }
      });

      if (response.data.success) {
        toast.success('Upload ảnh mặc định thành công!');
        await loadDefaultImages();
        return true;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Lỗi khi upload ảnh: ' + (error.response?.data?.message || error.message));
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedImageType) {
      toast.error('Vui lòng chọn file và loại ảnh!');
      return;
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async (e) => {
      const base64Image = e.target.result;
      const success = await uploadImage(selectedImageType, base64Image);
      if (success) {
        setSelectedFile(null);
        setSelectedImageType('');
        setPreviewUrl('');
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDelete = async (imageType) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ảnh mặc định này?')) {
      return;
    }

    try {
      const response = await instance.delete(`/api/default-images/${imageType}`);
      if (response.data.success) {
        toast.success('Xóa ảnh mặc định thành công!');
        await loadDefaultImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Lỗi khi xóa ảnh: ' + (error.response?.data?.message || error.message));
    }
  };

  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('Đã copy URL vào clipboard!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Quản lý ảnh mặc định
        </h1>
        <p className="text-gray-600">
          Upload và quản lý các ảnh mặc định cho hệ thống
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Upload ảnh mặc định
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn file ảnh
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
          </div>

          {/* Image Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại ảnh
            </label>
            <select
              value={selectedImageType}
              onChange={(e) => setSelectedImageType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="">Chọn loại ảnh</option>
              {imageTypes.map((type) => (
                <option key={type.key} value={type.key}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Preview */}
        {previewUrl && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Xem trước
            </label>
            <div className="flex items-center space-x-4">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile || !selectedImageType}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Đang upload...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Images List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Danh sách ảnh mặc định
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imageTypes.map((type) => {
            const imageUrl = defaultImages[type.key];
            return (
              <div key={type.key} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{type.label}</h3>
                  <div className="flex space-x-2">
                    {imageUrl && (
                      <>
                        <button
                          onClick={() => copyImageUrl(imageUrl)}
                          className="p-1 text-gray-500 hover:text-teal-600"
                          title="Copy URL"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(type.key)}
                          className="p-1 text-gray-500 hover:text-red-600"
                          title="Xóa ảnh"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                
                {imageUrl ? (
                  <div className="space-y-2">
                    <img
                      src={imageUrl}
                      alt={type.label}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    <div className="text-xs text-gray-500 truncate" title={imageUrl}>
                      {imageUrl}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Chưa có ảnh</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DefaultImageManager; 