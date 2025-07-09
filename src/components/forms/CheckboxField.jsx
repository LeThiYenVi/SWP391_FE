import React from 'react';
import PropTypes from 'prop-types';
import './forms.css';

/**
 * 可重用的复选框组件
 */
const CheckboxField = ({
  id,
  name,
  label,
  checked,
  onChange,
  error,
  disabled = false,
  required = false,
  className = '',
}) => {
  return (
    <div className={`checkbox-field-container ${className}`}>
      <div
        className={`checkbox-wrapper ${error ? 'has-error' : ''} ${
          disabled ? 'is-disabled' : ''
        }`}
      >
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className="checkbox-input"
        />

        <label htmlFor={id} className="checkbox-label">
          {label}
          {required && <span className="required-mark">*</span>}
        </label>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

CheckboxField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.node.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default CheckboxField;
