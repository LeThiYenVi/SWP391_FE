// components/QuickActionsGrid.jsx - Reusable quick actions component
import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  MessageCircle,
  TestTube,
  Heart,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';
import './QuickActionsGrid.css';

const iconMap = {
  Calendar,
  MessageCircle,
  TestTube,
  Heart,
};

const QuickActionCard = ({ action, onClick }) => {
  const { isAuthenticated } = useAuth();
  const Icon = iconMap[action.icon] || Heart;

  const isDisabled = action.requireAuth && !isAuthenticated;

  const handleClick = e => {
    if (isDisabled) {
      e.preventDefault();
      onClick?.('auth_required', action);
      return;
    }

    onClick?.('action_click', action);
  };

  const gradientMap = {
    pink: 'linear-gradient(135deg, #fce7f3, #ec4899)',
    blue: 'var(--primary-gradient)',
    green: 'linear-gradient(135deg, #dcfce7, #22c55e)',
    purple: 'linear-gradient(135deg, #f3e8ff, #a855f7)',
  };

  const iconColorMap = {
    pink: '#be185d',
    blue: 'var(--primary-dark)',
    green: '#15803d',
    purple: '#7c3aed',
  };

  const cardContent = (
    <div
      className={`quick-action-card ${isDisabled ? 'disabled' : ''}`}
      style={{
        background: gradientMap[action.color] || gradientMap.blue,
      }}
    >
      <div className="quick-action-icon">
        <Icon
          size={32}
          color={iconColorMap[action.color] || iconColorMap.blue}
        />
        {isDisabled && (
          <div className="lock-overlay">
            <Lock size={16} />
          </div>
        )}
      </div>

      <div className="quick-action-content">
        <h3 className="quick-action-title">{action.title}</h3>
        <p className="quick-action-description">{action.description}</p>

        {!isDisabled && (
          <div className="quick-action-arrow">
            <ArrowRight size={20} />
          </div>
        )}

        {isDisabled && (
          <div className="auth-required">
            <Lock size={16} />
            <span>Cần đăng nhập</span>
          </div>
        )}
      </div>
    </div>
  );

  return isDisabled ? (
    <button
      onClick={handleClick}
      className="quick-action-button"
      aria-label={`${action.title} - Cần đăng nhập`}
    >
      {cardContent}
    </button>
  ) : (
    <Link
      to={action.link}
      onClick={handleClick}
      className="quick-action-link"
      aria-label={action.title}
    >
      {cardContent}
    </Link>
  );
};

const QuickActionsGrid = ({
  actions,
  onActionClick,
  title = 'Dịch vụ nhanh',
  loading = false,
}) => {
  const handleActionClick = (type, action) => {
    onActionClick?.(type, action);
  };

  if (loading) {
    return (
      <div className="quick-actions-section">
        <h2 className="section-title">{title}</h2>
        <div className="quick-actions-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="quick-action-card skeleton">
              <div className="skeleton-icon"></div>
              <div className="skeleton-content">
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="quick-actions-section">
      <h2 className="section-title">{title}</h2>
      <div className="quick-actions-grid">
        {actions.map((action, index) => (
          <QuickActionCard
            key={action.id || index}
            action={action}
            onClick={handleActionClick}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActionsGrid;
