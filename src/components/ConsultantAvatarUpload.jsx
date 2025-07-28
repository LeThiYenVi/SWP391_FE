import React, { useState, useEffect } from 'react';
import { Camera, Upload, Trash2, Check, X } from 'lucide-react';
import instance from '../services/customize-axios';
import { toast } from 'react-toastify';

const ConsultantAvatarUpload = ({ onAvatarUpdate, currentAvatarUrl, consultantId }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [hasAvatar, setHasAvatar] = useState(false);
  const [currentUrl, setCurrentUrl] = useState(currentAvatarUrl);

  useEffect(() => {
    setCurrentUrl(currentAvatarUrl);
    setHasAvatar(!!currentAvatarUrl);
  }, [currentAvatarUrl]);

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
    if (!selectedFile || !consultantId) {
      toast.error('Vui lòng chọn file ảnh!');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const response = await instance.post(`/api/admin/consultants/${consultantId}/profile-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Upload avatar thành công!');
      setCurrentUrl(response.data);
      setHasAvatar(true);
      setSelectedFile(null);
      setPreviewUrl(null);
      
      if (onAvatarUpdate) {
        onAvatarUpdate({ avatarUrl: response.data });
      }
      
      // Reset file input
      const fileInput = document.getElementById('consultant-avatar-input');
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
      // Gọi API xóa avatar (nếu có)
      // await deleteConsultantAvatarAPI(consultantId);
      
      setCurrentUrl(null);
      setHasAvatar(false);
      toast.success('Xóa avatar thành công!');
      
      if (onAvatarUpdate) {
        onAvatarUpdate({ avatarUrl: null });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Lỗi khi xóa avatar!');
    } finally {
      setDeleting(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    
    // Reset file input
    const fileInput = document.getElementById('consultant-avatar-input');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="consultant-avatar-upload">
      <div className="avatar-preview">
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="preview-image" />
        ) : currentUrl ? (
          <img src={currentUrl} alt="Current Avatar" className="current-avatar" />
        ) : (
          <div className="avatar-placeholder">
            <Camera size={48} />
            <span>Chưa có ảnh đại diện</span>
          </div>
        )}
      </div>

      <div className="avatar-actions">
        {!selectedFile ? (
          <>
            <label htmlFor="consultant-avatar-input" className="upload-btn">
              <Upload size={20} />
              Chọn ảnh
            </label>
            <input
              id="consultant-avatar-input"
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            {hasAvatar && (
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="delete-btn"
              >
                <Trash2 size={20} />
                {deleting ? 'Đang xóa...' : 'Xóa'}
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="confirm-btn"
            >
              <Check size={20} />
              {uploading ? 'Đang upload...' : 'Xác nhận'}
            </button>
            <button
              onClick={handleCancel}
              disabled={uploading}
              className="cancel-btn"
            >
              <X size={20} />
              Hủy
            </button>
          </>
        )}
      </div>

      <style jsx>{`
        .consultant-avatar-upload {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: 2px dashed #e0e0e0;
          border-radius: 12px;
          background: #fafafa;
        }

        .avatar-preview {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 3px solid #e0e0e0;
        }

        .preview-image,
        .current-avatar {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          color: #666;
          font-size: 0.875rem;
        }

        .avatar-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .upload-btn,
        .confirm-btn,
        .cancel-btn,
        .delete-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-btn {
          background: #1976d2;
          color: white;
        }

        .upload-btn:hover {
          background: #1565c0;
        }

        .confirm-btn {
          background: #2e7d32;
          color: white;
        }

        .confirm-btn:hover {
          background: #1b5e20;
        }

        .confirm-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }

        .cancel-btn {
          background: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .cancel-btn:hover {
          background: #e0e0e0;
        }

        .delete-btn {
          background: #d32f2f;
          color: white;
        }

        .delete-btn:hover {
          background: #c62828;
        }

        .delete-btn:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ConsultantAvatarUpload; 