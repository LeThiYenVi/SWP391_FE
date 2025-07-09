import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import './forms.css';

/**
 * 可重用的输入字段组件
 * 支持文本、密码、电子邮件、数字等类型
 */
const InputField = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  autoComplete,
  min,
  max,
  step,
  maxLength,
  pattern,
  readOnly = false,
  fullWidth = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // 确定实际输入类型（用于密码切换显示/隐藏）
  const inputType = type === 'password' && showPassword ? 'text' : type;

  // 处理密码可见性切换
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // 处理焦点事件
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = e => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div
      className={`input-field-container ${
        fullWidth ? 'full-width' : ''
      } ${className}`}
    >
      {label && (
        <label htmlFor={id} className="input-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      )}

      <div
        className={`input-wrapper ${error ? 'has-error' : ''} ${
          isFocused ? 'is-focused' : ''
        } ${disabled ? 'is-disabled' : ''}`}
      >
        {Icon && <Icon className="input-icon" size={18} />}

        <input
          id={id}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className="input-field"
          autoComplete={autoComplete}
          min={min}
          max={max}
          step={step}
          maxLength={maxLength}
          pattern={pattern}
          readOnly={readOnly}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="password-toggle"
            tabIndex="-1"
            aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}

        {error && (
          <div className="error-icon">
            <AlertCircle size={18} />
          </div>
        )}
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

InputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.oneOf([
    'text',
    'password',
    'email',
    'number',
    'tel',
    'date',
    'time',
    'url',
  ]),
  placeholder: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  autoComplete: PropTypes.string,
  min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  readOnly: PropTypes.bool,
  fullWidth: PropTypes.bool,
};

export default InputField;
