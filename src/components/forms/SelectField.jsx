import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import './forms.css';

/**
 * 可重用的下拉选择组件
 */
const SelectField = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  placeholder = 'Chọn...',
  error,
  disabled = false,
  required = false,
  icon: Icon,
  className = '',
  fullWidth = true,
}) => {
  return (
    <div
      className={`select-field-container ${
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
        className={`select-wrapper ${error ? 'has-error' : ''} ${
          disabled ? 'is-disabled' : ''
        }`}
      >
        {Icon && <Icon className="select-icon" size={18} />}

        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="select-field"
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <ChevronDown className="select-arrow" size={18} />

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

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  icon: PropTypes.elementType,
  className: PropTypes.string,
  fullWidth: PropTypes.bool,
};

export default SelectField;
