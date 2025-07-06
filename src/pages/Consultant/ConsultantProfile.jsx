import React, { useState } from 'react';
import {
  User,
  Camera,
  Edit,
  Save,
  X,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  BookOpen,
  Languages,
  Clock,
  Star,
  CheckCircle,
  Upload,
  Eye,
  EyeOff,
} from 'lucide-react';
import './ConsultantProfile.css';

const ConsultantProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Dr. Nguyễn Thị Hương',
    email: 'huong.nguyen@gynexa.com',
    phone: '0901234567',
    specialty: 'Chuyên khoa Sản Phụ khoa',
    experience: 10,
    bio: 'Chuyên gia về sức khỏe sinh sản với hơn 10 năm kinh nghiệm. Tôi cam kết mang lại sự chăm sóc tốt nhất cho bệnh nhân và luôn cập nhật những kiến thức y khoa mới nhất.',
    avatar:
      'https://www.hoilhpn.org.vn/documents/20182/3458479/28_Feb_2022_115842_GMTbsi_thuhien.jpg/c04e15ea-fbe4-415f-bacc-4e5d4cc0204d',
    address: 'Tp. Hồ Chí Minh, Việt Nam',
    workingHours: {
      start: '08:00',
      end: '17:00',
    },
    consultationFee: {
      video: 300000,
      phone: 250000,
      chat: 200000,
    },
    languages: ['Tiếng Việt', 'English'],
    certifications: [
      'Bằng Tiến sĩ Y khoa - Đại học Y Dược TP.HCM',
      'Chứng chỉ Chuyên khoa I Sản Phụ khoa',
      'Chứng chỉ Tư vấn sức khỏe sinh sản',
    ],
    education: [
      {
        degree: 'Tiến sĩ Y khoa',
        institution: 'Đại học Y Dược TP.HCM',
        year: '2010-2014',
      },
      {
        degree: 'Bác sĩ Y khoa',
        institution: 'Đại học Y Dược TP.HCM',
        year: '2004-2010',
      },
    ],
    achievements: [
      'Giải thưởng Bác sĩ xuất sắc năm 2023',
      'Chứng chỉ đào tạo quốc tế về sức khỏe sinh sản',
      'Tham gia hội thảo khoa học trong nước và quốc tế',
    ],
  });

  const [editedProfile, setEditedProfile] = useState({ ...profile });
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  const handleEdit = () => {
    setIsEditing(true);
    setEditedProfile({ ...profile });
  };

  const handleSave = () => {
    setProfile({ ...editedProfile });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile({ ...profile });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedInputChange = (parent, field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field, defaultValue = '') => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: [...prev[field], defaultValue],
    }));
  };

  const removeArrayItem = (field, index) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handlePasswordChange = () => {
    if (passwords.new !== passwords.confirm) {
      alert('Mật khẩu xác nhận không khớp');
      return;
    }

    if (passwords.new.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    // Handle password change logic here
    console.log('Password change requested');
    setPasswords({ current: '', new: '', confirm: '' });
    setShowPasswordForm(false);
    alert('Đổi mật khẩu thành công');
  };

  const handleAvatarChange = event => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        handleInputChange('avatar', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    { label: 'Tổng số tư vấn', value: '245', icon: User, color: 'blue' },
    { label: 'Đánh giá trung bình', value: '4.9', icon: Star, color: 'yellow' },
    {
      label: 'Năm kinh nghiệm',
      value: profile.experience,
      icon: Award,
      color: 'green',
    },
    {
      label: 'Bệnh nhân hài lòng',
      value: '98%',
      icon: CheckCircle,
      color: 'green',
    },
  ];

  return (
    <div className="consultant-profile">
      <div className="profile-header">
        <div className="profile-header-content">
          <h1>Hồ sơ cá nhân</h1>
          <p>Quản lý thông tin và cài đặt tài khoản của bạn</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button className="btn btn-primary" onClick={handleEdit}>
              <Edit size={20} />
              Chỉnh sửa
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-outline" onClick={handleCancel}>
                <X size={20} />
                Hủy
              </button>
              <button className="btn btn-success" onClick={handleSave}>
                <Save size={20} />
                Lưu
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Stats */}
        <div className="profile-stats">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">
                <stat.icon size={24} />
              </div>
              <div className="stat-info">
                <h3>{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="profile-grid">
          {/* Basic Information */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Thông tin cơ bản</h3>
            </div>
            <div className="card-content">
              <div className="avatar-section">
                <div className="avatar-container">
                  <img
                    src={isEditing ? editedProfile.avatar : profile.avatar}
                    alt="Avatar"
                    className="profile-avatar"
                  />
                  {isEditing && (
                    <label className="avatar-upload">
                      <Camera size={20} />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        hidden
                      />
                    </label>
                  )}
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Họ và tên</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">
                      <User size={16} />
                      <span>{profile.name}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedProfile.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">
                      <Mail size={16} />
                      <span>{profile.email}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Số điện thoại</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedProfile.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">
                      <Phone size={16} />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Địa chỉ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.address}
                      onChange={e =>
                        handleInputChange('address', e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">
                      <MapPin size={16} />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Chuyên môn</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProfile.specialty}
                      onChange={e =>
                        handleInputChange('specialty', e.target.value)
                      }
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">
                      <Award size={16} />
                      <span>{profile.specialty}</span>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Kinh nghiệm (năm)</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedProfile.experience}
                      onChange={e =>
                        handleInputChange(
                          'experience',
                          parseInt(e.target.value)
                        )
                      }
                      className="form-input"
                    />
                  ) : (
                    <div className="form-display">
                      <Calendar size={16} />
                      <span>{profile.experience} năm</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group full-width">
                <label>Giới thiệu</label>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={e => handleInputChange('bio', e.target.value)}
                    className="form-textarea"
                    rows="4"
                  />
                ) : (
                  <div className="form-display">
                    <BookOpen size={16} />
                    <span>{profile.bio}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Working Hours & Fees */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Giờ làm việc & Phí tư vấn</h3>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label>Giờ làm việc</label>
                {isEditing ? (
                  <div className="time-range">
                    <input
                      type="time"
                      value={editedProfile.workingHours.start}
                      onChange={e =>
                        handleNestedInputChange(
                          'workingHours',
                          'start',
                          e.target.value
                        )
                      }
                      className="form-input"
                    />
                    <span>đến</span>
                    <input
                      type="time"
                      value={editedProfile.workingHours.end}
                      onChange={e =>
                        handleNestedInputChange(
                          'workingHours',
                          'end',
                          e.target.value
                        )
                      }
                      className="form-input"
                    />
                  </div>
                ) : (
                  <div className="form-display">
                    <Clock size={16} />
                    <span>
                      {profile.workingHours.start} - {profile.workingHours.end}
                    </span>
                  </div>
                )}
              </div>

              <div className="fees-section">
                <h4>Phí tư vấn</h4>
                <div className="fees-grid">
                  {Object.entries(profile.consultationFee).map(
                    ([type, fee]) => (
                      <div key={type} className="fee-item">
                        <label>
                          {type === 'video' && 'Video Call'}
                          {type === 'phone' && 'Phone Call'}
                          {type === 'chat' && 'Chat'}
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={editedProfile.consultationFee[type]}
                            onChange={e =>
                              handleNestedInputChange(
                                'consultationFee',
                                type,
                                parseInt(e.target.value)
                              )
                            }
                            className="form-input"
                          />
                        ) : (
                          <span className="fee-amount">
                            {fee.toLocaleString('vi-VN')} VNĐ
                          </span>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Ngôn ngữ</h3>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="languages-edit">
                  {editedProfile.languages.map((lang, index) => (
                    <div key={index} className="language-item">
                      <input
                        type="text"
                        value={lang}
                        onChange={e =>
                          handleArrayInputChange(
                            'languages',
                            index,
                            e.target.value
                          )
                        }
                        className="form-input"
                      />
                      <button
                        className="remove-btn"
                        onClick={() => removeArrayItem('languages', index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-btn"
                    onClick={() => addArrayItem('languages', '')}
                  >
                    Thêm ngôn ngữ
                  </button>
                </div>
              ) : (
                <div className="languages-display">
                  {profile.languages.map((lang, index) => (
                    <div key={index} className="language-tag">
                      <Languages size={14} />
                      <span>{lang}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Chứng chỉ & Bằng cấp</h3>
            </div>
            <div className="card-content">
              {isEditing ? (
                <div className="certifications-edit">
                  {editedProfile.certifications.map((cert, index) => (
                    <div key={index} className="certification-item">
                      <input
                        type="text"
                        value={cert}
                        onChange={e =>
                          handleArrayInputChange(
                            'certifications',
                            index,
                            e.target.value
                          )
                        }
                        className="form-input"
                      />
                      <button
                        className="remove-btn"
                        onClick={() => removeArrayItem('certifications', index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                  <button
                    className="add-btn"
                    onClick={() => addArrayItem('certifications', '')}
                  >
                    Thêm chứng chỉ
                  </button>
                </div>
              ) : (
                <div className="certifications-display">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="certification-item-display">
                      <Award size={16} />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Security Settings */}
          <div className="profile-card">
            <div className="card-header">
              <h3>Bảo mật</h3>
            </div>
            <div className="card-content">
              <button
                className="btn btn-outline"
                onClick={() => setShowPasswordForm(true)}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Đổi mật khẩu</h3>
              <button
                className="close-btn"
                onClick={() => setShowPasswordForm(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Mật khẩu hiện tại</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwords.current}
                    onChange={e =>
                      setPasswords(prev => ({
                        ...prev,
                        current: e.target.value,
                      }))
                    }
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Mật khẩu mới</label>
                <div className="password-input">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwords.new}
                    onChange={e =>
                      setPasswords(prev => ({ ...prev, new: e.target.value }))
                    }
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <div className="password-input">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwords.confirm}
                    onChange={e =>
                      setPasswords(prev => ({
                        ...prev,
                        confirm: e.target.value,
                      }))
                    }
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-outline"
                onClick={() => setShowPasswordForm(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary"
                onClick={handlePasswordChange}
              >
                Đổi mật khẩu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultantProfile;
