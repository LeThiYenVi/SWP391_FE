import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import './forms.css';

/**
 * 可重用的文本区域组件
 */
const TextareaField = ({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  disabled = false,
  required = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className = '',
  fullWidth = true,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  // 处理焦点事件
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = e => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // 计算剩余字符数
  const remainingChars = maxLength ? maxLength - (value?.length || 0) : null;

  return (
    <div
      className={`textarea-field-container ${
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
        className={`textarea-wrapper ${error ? 'has-error' : ''} ${
          isFocused ? 'is-focused' : ''
        } ${disabled ? 'is-disabled' : ''}`}
      >
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          className="textarea-field"
          rows={rows}
          maxLength={maxLength}
        />

        {error && (
          <div className="error-icon">
            <AlertCircle size={18} />
          </div>
        )}
      </div>

      <div className="textarea-footer">
        {error && <p className="error-message">{error}</p>}

        {showCharCount && maxLength && (
          <div
            className={`char-counter ${remainingChars < 20 ? 'warning' : ''}`}
          >
            {remainingChars} ký tự còn lại
          </div>
        )}
      </div>
    </div>
  );
};

TextareaField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  rows: PropTypes.number,
  maxLength: PropTypes.number,
  showCharCount: PropTypes.bool,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default TextareaField;
