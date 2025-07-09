import React from 'react';
import PropTypes from 'prop-types';
import { Loader2 } from 'lucide-react';
import './forms.css';

/**
 * 可重用的按钮组件
 */
const Button = ({
  type = 'button',
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  children,
}) => {
  // 根据变体、大小和状态生成类名
  const buttonClasses = [
    'button',
    `button-${variant}`,
    `button-${size}`,
    fullWidth ? 'button-full-width' : '',
    loading ? 'button-loading' : '',
    disabled ? 'button-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <Loader2
          className="button-spinner"
          size={size === 'small' ? 14 : size === 'large' ? 22 : 18}
        />
      )}

      {!loading && Icon && iconPosition === 'left' && (
        <Icon
          className="button-icon button-icon-left"
          size={size === 'small' ? 14 : size === 'large' ? 22 : 18}
        />
      )}

      <span className="button-text">{children}</span>

      {!loading && Icon && iconPosition === 'right' && (
        <Icon
          className="button-icon button-icon-right"
          size={size === 'small' ? 14 : size === 'large' ? 22 : 18}
        />
      )}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'outline',
    'text',
    'danger',
    'success',
  ]),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Button;
