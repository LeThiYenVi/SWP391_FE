import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Check, X } from 'lucide-react';
import instance from '../services/customize-axios';
import { toast } from 'react-toastify';

const AvatarUpload = ({ onAvatarUpdate, currentAvatarUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasAvatar, setHasAvatar] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(currentAvatarUrl);

  useEffect(() => {
    checkAvatarStatus();
  }, []);

  const checkAvatarStatus = async () => {
    try {
      const response = await instance.get('/api/user/avatar/check');
      setHasAvatar(response.data.hasAvatar);
      setCurrentUrl(response.data.avatarUrl);
    } catch (error) {
      console.error('Error checking avatar status:', error);
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

      // Validate file size (5MB)
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

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const response = await instance.post('/api/user/avatar/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Upload avatar thành công!');
      setCurrentUrl(response.data.avatarUrl);
      setHasAvatar(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      if (onAvatarUpdate) {
        onAvatarUpdate(response.data.user);
      }
      
      // Reset file input
      const fileInput = document.getElementById('avatar-input');
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data || 'Lỗi khi upload avatar!';
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!hasAvatar) {
      toast.error('Không có avatar để xóa!');
      return;
    }

    setDeleting(true);
    try {
      const response = await instance.delete('/api/user/avatar/delete');
      
      toast.success('Xóa avatar thành công!');
      setCurrentUrl(response.data.user.avatarUrl);
      setHasAvatar(false);
      
      if (onAvatarUpdate) {
        onAvatarUpdate(response.data.user);
      }
      
    } catch (error) {
      console.error('Delete error:', error);
      const errorMessage = error.response?.data || 'Lỗi khi xóa avatar!';
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('avatar-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="avatar-upload-container">
      {/* Current Avatar Display */}
      <div className="current-avatar-section">
        <div className="avatar-preview">
          <img
            src={currentUrl || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
            alt="Avatar"
            className="avatar-image"
          />
          <div className="avatar-overlay">
            <Camera className="camera-icon" />
          </div>
        </div>
        
        <div className="avatar-status">
          <span className={`status-badge ${hasAvatar ? 'has-avatar' : 'no-avatar'}`}>
            {hasAvatar ? 'Có avatar' : 'Chưa có avatar'}
          </span>
        </div>
      </div>

      {/* File Selection */}
      <div className="file-selection">
        <label htmlFor="avatar-input" className="file-input-label">
          <Upload className="upload-icon" />
          <span>Chọn ảnh</span>
        </label>
        <input
          id="avatar-input"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="file-input"
        />
      </div>

      {/* File Preview */}
      {previewUrl && (
        <div className="file-preview">
          <img src={previewUrl} alt="Preview" className="preview-image" />
          <div className="preview-actions">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn btn-primary"
            >
              {uploading ? 'Đang upload...' : 'Upload'}
              {!uploading && <Check className="icon" />}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="btn btn-secondary"
            >
              <X className="icon" />
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Delete Avatar */}
      {hasAvatar && (
        <div className="delete-section">
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-danger"
          >
            {deleting ? 'Đang xóa...' : 'Xóa avatar'}
            {!deleting && <Trash2 className="icon" />}
          </button>
        </div>
      )}

      {/* Instructions */}
      <div className="instructions">
        <h4>Hướng dẫn:</h4>
        <ul>
          <li>Chỉ chấp nhận file ảnh (JPG, JPEG, PNG, GIF, WEBP)</li>
          <li>Kích thước file tối đa: 5MB</li>
          <li>Avatar cũ sẽ tự động bị xóa khi upload avatar mới</li>
        </ul>
      </div>

      <style jsx>{`
        .avatar-upload-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .current-avatar-section {
          text-align: center;
          margin-bottom: 20px;
        }

        .avatar-preview {
          position: relative;
          display: inline-block;
          margin-bottom: 10px;
        }

        .avatar-image {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #e5e7eb;
        }

        .avatar-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .avatar-preview:hover .avatar-overlay {
          opacity: 1;
        }

        .camera-icon {
          color: white;
          width: 24px;
          height: 24px;
        }

        .avatar-status {
          margin-top: 10px;
        }

        .status-badge {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-badge.has-avatar {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.no-avatar {
          background: #fef3c7;
          color: #92400e;
        }

        .file-selection {
          margin-bottom: 20px;
        }

        .file-input-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 24px;
          background: #3b82f6;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .file-input-label:hover {
          background: #2563eb;
        }

        .file-input {
          display: none;
        }

        .file-preview {
          margin-bottom: 20px;
          text-align: center;
        }

        .preview-image {
          width: 100px;
          height: 100px;
          border-radius: 8px;
          object-fit: cover;
          margin-bottom: 10px;
        }

        .preview-actions {
          display: flex;
          gap: 10px;
          justify-content: center;
        }

        .delete-section {
          text-align: center;
          margin-bottom: 20px;
        }

        .btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: #10b981;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #059669;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #4b5563;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .icon {
          width: 16px;
          height: 16px;
        }

        .instructions {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          border-left: 4px solid #3b82f6;
        }

        .instructions h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
        }

        .instructions ul {
          margin: 0;
          padding-left: 20px;
          font-size: 12px;
          color: #6b7280;
        }

        .instructions li {
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default AvatarUpload; 