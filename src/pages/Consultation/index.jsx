import React from 'react';
import {
  MessageCircle,
  Video,
  Calendar,
  Clock,
  Star,
  ArrowLeft,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Consultation.module.css';

const Consultation = () => {
  const consultationTypes = [
    {
      id: 1,
      type: 'Video Call',
      title: 'Tư vấn qua Video',
      description: 'Gặp mặt trực tiếp với bác sĩ qua video call an toàn',
      icon: Video,
      price: '200.000đ',
      duration: '30 phút',
      popular: true,
    },
    {
      id: 2,
      type: 'Chat',
      title: 'Tư vấn qua Chat',
      description: 'Nhắn tin trực tiếp với bác sĩ, thuận tiện và riêng tư',
      icon: MessageCircle,
      price: '100.000đ',
      duration: '24h',
      popular: false,
    },
    {
      id: 3,
      type: 'Appointment',
      title: 'Đặt lịch hẹn',
      description: 'Đặt lịch tư vấn trực tiếp tại phòng khám',
      icon: Calendar,
      price: '300.000đ',
      duration: '45 phút',
      popular: false,
    },
  ];

  const availableDoctors = [
    {
      id: 1,
      name: 'Dr. Nguyễn Thị Hương',
      specialty: 'Sản phụ khoa',
      experience: '8 năm kinh nghiệm',
      rating: 4.9,
      price: '200.000đ',
      available: true,
      nextSlot: '14:30 hôm nay',
    },
    {
      id: 2,
      name: 'Dr. Lê Văn Minh',
      specialty: 'Tâm lý học',
      experience: '6 năm kinh nghiệm',
      rating: 4.8,
      price: '180.000đ',
      available: true,
      nextSlot: '15:00 hôm nay',
    },
    {
      id: 3,
      name: 'Dr. Trần Thị Lan',
      specialty: 'Nội tiết',
      experience: '10 năm kinh nghiệm',
      rating: 4.9,
      price: '220.000đ',
      available: false,
      nextSlot: 'Ngày mai 9:00',
    },
  ];

  return (
    <div className={styles.consultationPage}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <div className={styles.container}>
          <Link to="/" className={styles.backButton}>
            <ArrowLeft size={20} />
            Quay lại
          </Link>
          <div className={styles.headerContent}>
            <h1>Tư vấn trực tuyến</h1>
            <p>Kết nối với các chuyên gia y tế hàng đầu mọi lúc, mọi nơi</p>
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Consultation Types */}
        <section className={styles.section}>
          <h2>Chọn hình thức tư vấn</h2>
          <div className={styles.consultationGrid}>
            {consultationTypes.map(type => {
              const IconComponent = type.icon;
              return (
                <div
                  key={type.id}
                  className={`${styles.consultationCard} ${
                    type.popular ? styles.popular : ''
                  }`}
                >
                  {type.popular && (
                    <div className={styles.popularBadge}>Phổ biến</div>
                  )}
                  <div className={styles.cardIcon}>
                    <IconComponent size={32} />
                  </div>
                  <h3>{type.title}</h3>
                  <p>{type.description}</p>
                  <div className={styles.cardDetails}>
                    <div className={styles.price}>{type.price}</div>
                    <div className={styles.duration}>
                      <Clock size={16} />
                      {type.duration}
                    </div>
                  </div>
                  <button className={styles.selectButton}>
                    Chọn hình thức này
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* Available Doctors */}
        <section className={styles.section}>
          <h2>Bác sĩ hiện có</h2>
          <div className={styles.doctorsGrid}>
            {availableDoctors.map(doctor => (
              <div key={doctor.id} className={styles.doctorCard}>
                <div className={styles.doctorInfo}>
                  <div className={styles.doctorAvatar}>
                    <img src={`/api/placeholder/80/80`} alt={doctor.name} />
                    <div
                      className={`${styles.status} ${
                        doctor.available ? styles.available : styles.busy
                      }`}
                    >
                      {doctor.available ? 'Có sẵn' : 'Bận'}
                    </div>
                  </div>
                  <div className={styles.doctorDetails}>
                    <h3>{doctor.name}</h3>
                    <p className={styles.specialty}>{doctor.specialty}</p>
                    <p className={styles.experience}>{doctor.experience}</p>
                    <div className={styles.rating}>
                      <Star size={16} fill="#ffd700" color="#ffd700" />
                      <span>{doctor.rating}</span>
                    </div>
                  </div>
                </div>
                <div className={styles.doctorActions}>
                  <div className={styles.consultationInfo}>
                    <div className={styles.price}>{doctor.price}</div>
                    <div className={styles.nextSlot}>
                      <Clock size={14} />
                      {doctor.nextSlot}
                    </div>
                  </div>
                  <button
                    className={`${styles.bookButton} ${
                      !doctor.available ? styles.disabled : ''
                    }`}
                    disabled={!doctor.available}
                  >
                    {doctor.available ? 'Đặt lịch ngay' : 'Không có sẵn'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Emergency Contact */}
        <section className={styles.emergencySection}>
          <div className={styles.emergencyCard}>
            <h3>Cần hỗ trợ khẩn cấp?</h3>
            <p>Liên hệ đường dây nóng 24/7 của chúng tôi</p>
            <div className={styles.emergencyActions}>
              <a href="tel:+84123456789" className={styles.emergencyButton}>
                Gọi ngay: (84) 123-456-789
              </a>
              <button className={styles.chatButton}>Chat khẩn cấp</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Consultation;
