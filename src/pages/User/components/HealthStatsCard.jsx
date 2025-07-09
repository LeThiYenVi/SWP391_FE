// components/HealthStatsCard.jsx - Reusable health stats component
import React from 'react';
import {
  Calendar,
  Heart,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  Activity,
} from 'lucide-react';
import './HealthStatsCard.css';

const iconMap = {
  Calendar,
  Heart,
  MessageCircle,
  TrendingUp,
  AlertCircle,
  Activity,
};

const HealthStatsCard = ({ stat, onClick, className = '' }) => {
  const Icon = iconMap[stat.icon] || Activity;

  const getTrendClass = trend => {
    switch (trend) {
      case 'warning':
        return 'trend-warning';
      case 'active':
        return 'trend-active';
      case 'positive':
        return 'trend-positive';
      default:
        return 'trend-normal';
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(stat);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className={`health-stats-card ${getTrendClass(stat.trend)} ${className}`}
      style={{
        backgroundColor: stat.bgColor,
        borderLeft: `4px solid ${stat.color}`,
      }}
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      tabIndex={onClick ? 0 : -1}
      role={onClick ? 'button' : 'region'}
      aria-label={`${stat.title}: ${stat.value} ${stat.label}`}
    >
      <div className="health-stats-content">
        <div className="health-stats-info">
          <h4 className="health-stats-title">{stat.title}</h4>
          <p className="health-stats-value" style={{ color: stat.color }}>
            {stat.value}
          </p>
          <p className="health-stats-label">{stat.label}</p>

          {stat.trend === 'warning' && (
            <div className="health-stats-alert">
              <AlertCircle size={16} />
              <span>Cần chú ý</span>
            </div>
          )}

          {stat.trend === 'active' && (
            <div className="health-stats-active">
              <Activity size={16} />
              <span>Đang hoạt động</span>
            </div>
          )}
        </div>

        <div className="health-stats-icon" style={{ color: stat.color }}>
          <Icon size={36} />
        </div>
      </div>
    </div>
  );
};

// Grid component for multiple health stats
export const HealthStatsGrid = ({ stats, onStatClick, loading = false }) => {
  if (loading) {
    return (
      <div className="health-stats-grid">
        {[1, 2, 3].map(i => (
          <div key={i} className="health-stats-card skeleton">
            <div className="skeleton-content">
              <div className="skeleton-text"></div>
              <div className="skeleton-text short"></div>
              <div className="skeleton-icon"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="health-stats-grid">
      {stats.map((stat, index) => (
        <HealthStatsCard
          key={stat.id || index}
          stat={stat}
          onClick={onStatClick}
        />
      ))}
    </div>
  );
};

export default HealthStatsCard;
