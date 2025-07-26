import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AvatarUpload from '../components/AvatarUpload';
import axios from '../services/customize-axios';
import { toast } from 'react-toastify';

const AvatarTestPage = () => {
  const { user, updateUserProfile } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserInfo();
  }, []);

  const loadUserInfo = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/profile');
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error loading user info:', error);
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = (updatedUser) => {
    setUserInfo(updatedUser);
    if (updateUserProfile) {
      updateUserProfile(updatedUser);
    }
    toast.success('Thông tin avatar đã được cập nhật!');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="avatar-test-page">
      <div className="container">
        <h1>Test Chức Năng Upload Avatar</h1>
        
        {/* User Info Display */}
        <div className="user-info-section">
          <h2>Thông tin người dùng hiện tại</h2>
          {userInfo && (
            <div className="user-info-card">
              <div className="user-avatar">
                <img
                  src={userInfo.avatarUrl || 'https://res.cloudinary.com/demo/image/upload/v1/samples/people/boy-snow-hoodie.jpg'}
                  alt="User Avatar"
                  className="avatar-img"
                />
              </div>
              <div className="user-details">
                <h3>{userInfo.fullName || userInfo.username}</h3>
                <p><strong>Username:</strong> {userInfo.username}</p>
                <p><strong>Email:</strong> {userInfo.email}</p>
                <p><strong>Role:</strong> {userInfo.roleName}</p>
                <p><strong>Avatar URL:</strong> {userInfo.avatarUrl || 'Chưa có'}</p>
                <p><strong>Avatar Public ID:</strong> {userInfo.avatarPublicId || 'Chưa có'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Avatar Upload Component */}
        <div className="avatar-upload-section">
          <h2>Upload Avatar</h2>
          <AvatarUpload
            onAvatarUpdate={handleAvatarUpdate}
            currentAvatarUrl={userInfo?.avatarUrl}
          />
        </div>

        {/* API Test Section */}
        <div className="api-test-section">
          <h2>Test API Endpoints</h2>
          
          <div className="api-buttons">
            <button
              onClick={loadUserInfo}
              className="api-btn"
            >
              Refresh User Info
            </button>
            
            <button
              onClick={async () => {
                try {
                  const response = await axios.get('/api/user/avatar/check');
                  console.log('Avatar check response:', response.data);
                  toast.success('Kiểm tra avatar thành công! Xem console để xem chi tiết.');
                } catch (error) {
                  console.error('Avatar check error:', error);
                  toast.error('Lỗi khi kiểm tra avatar');
                }
              }}
              className="api-btn"
            >
              Check Avatar Status
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="instructions-section">
          <h2>Hướng dẫn sử dụng</h2>
          <div className="instructions-content">
            <h3>Chức năng đã được cải thiện:</h3>
            <ul>
              <li><strong>Validation:</strong> Kiểm tra file type, size, format</li>
              <li><strong>Auto-delete:</strong> Tự động xóa avatar cũ khi upload mới</li>
              <li><strong>Fallback:</strong> Hiển thị avatar mặc định nếu không có</li>
              <li><strong>Real-time:</strong> Cập nhật ngay lập tức sau khi upload/xóa</li>
              <li><strong>Error handling:</strong> Xử lý lỗi tốt hơn với thông báo rõ ràng</li>
            </ul>
            
            <h3>API Endpoints:</h3>
            <ul>
              <li><code>POST /api/user/avatar/upload</code> - Upload avatar</li>
              <li><code>DELETE /api/user/avatar/delete</code> - Xóa avatar</li>
              <li><code>GET /api/user/avatar/check</code> - Kiểm tra trạng thái avatar</li>
              <li><code>GET /api/user/profile</code> - Lấy thông tin user (có avatar)</li>
            </ul>
          </div>
        </div>
      </div>

      <style jsx>{`
        .avatar-test-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 20px;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        h1 {
          text-align: center;
          color: white;
          margin-bottom: 40px;
          font-size: 2.5rem;
          font-weight: 700;
        }

        h2 {
          color: #374151;
          margin-bottom: 20px;
          font-size: 1.5rem;
          font-weight: 600;
        }

        .user-info-section,
        .avatar-upload-section,
        .api-test-section,
        .instructions-section {
          background: white;
          border-radius: 12px;
          padding: 30px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .user-info-card {
          display: flex;
          gap: 20px;
          align-items: center;
          padding: 20px;
          background: #f9fafb;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .user-avatar {
          flex-shrink: 0;
        }

        .avatar-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #3b82f6;
        }

        .user-details h3 {
          margin: 0 0 10px 0;
          color: #1f2937;
          font-size: 1.25rem;
        }

        .user-details p {
          margin: 5px 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .user-details strong {
          color: #374151;
        }

        .api-buttons {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }

        .api-btn {
          padding: 10px 20px;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.3s;
        }

        .api-btn:hover {
          background: #2563eb;
        }

        .instructions-content h3 {
          color: #1f2937;
          margin: 20px 0 10px 0;
          font-size: 1.1rem;
        }

        .instructions-content ul {
          margin: 10px 0;
          padding-left: 20px;
        }

        .instructions-content li {
          margin: 5px 0;
          color: #6b7280;
          line-height: 1.5;
        }

        .instructions-content code {
          background: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          color: #dc2626;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top: 4px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 0 10px;
          }
          
          .user-info-card {
            flex-direction: column;
            text-align: center;
          }
          
          .api-buttons {
            flex-direction: column;
          }
          
          h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AvatarTestPage; 