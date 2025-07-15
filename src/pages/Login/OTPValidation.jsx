import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Mail, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { toast } from 'react-toastify';
import { validateOtpAPI } from '../../services/UsersSevices';
import './login.css';

const OTPValidation = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');

  useEffect(() => {
    // Tìm email từ 3 nguồn theo thứ tự ưu tiên:
    // 1. URL query parameter (từ link trong email)
    // 2. Location state (từ điều hướng trong app)
    // 3. Session storage (đã lưu trước đó)

    const searchParams = new URLSearchParams(location.search);
    const emailFromUrl = searchParams.get('email');
    const storedEmail = sessionStorage.getItem('otpEmail');

    if (emailFromUrl) {
      // Đây là email từ URL (người dùng nhấp vào link trong email)
      setEmail(decodeURIComponent(emailFromUrl));
      sessionStorage.setItem('otpEmail', decodeURIComponent(emailFromUrl));
    } else if (location.state?.email) {
      // Đây là email từ navigation state (điều hướng trong app)
      setEmail(location.state.email);
      sessionStorage.setItem('otpEmail', location.state.email);
    } else if (storedEmail) {
      // Đây là email đã lưu trước đó
      setEmail(storedEmail);
    } else {
      // Không tìm thấy email, chuyển hướng về trang quên mật khẩu
      navigate('/forgot-password', {
        state: { message: 'Vui lòng nhập email của bạn trước' },
      });
    }
  }, [location.state, location.search, navigate]);

  useEffect(() => {
    setTimeout(() => {
      const firstInput = document.getElementById('otp-input-0');
      if (firstInput) {
        firstInput.focus();
        firstInput.select();
      }
    }, 300);
  }, []);

  useEffect(() => {
    const handleClickOutside = e => {
      const inputs = document.querySelectorAll('.otp-input');
      let isInput = false;

      inputs.forEach(input => {
        if (input === e.target) {
          isInput = true;
        }
      });

      if (
        !isInput &&
        document.activeElement &&
        document.activeElement.classList.contains('otp-input')
      ) {
        document.activeElement.blur();
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Helper function to process OTP input - keep only first valid alphanumeric and uppercase it
  const processOtpInput = value => {
    if (!value) return '';

    // Keep only alphanumeric characters
    const alphanumeric = value.replace(/[^a-zA-Z0-9]/g, '');

    // Take only the first character
    const singleChar = alphanumeric.charAt(0);

    // Convert to uppercase
    return singleChar.toUpperCase();
  };

  // Completely redesigned approach to handle OTP input - prevents duplicates
  const handleOtpChange = (e, index) => {
    // Get the DOM element directly
    const inputElement = e.target;

    // We'll handle raw key input directly rather than relying on the input value
    // This bypasses React's controlled input behavior that can cause doubling

    // First, clear any selection to ensure the caret is at the end
    // This helps prevent double character issues on some browsers
    const end = inputElement.selectionEnd || 0;
    inputElement.setSelectionRange(end, end);

    // Get the raw input value - but we'll be careful how we use it
    const rawValue = e.target.value || '';

    // Make a copy of the current OTP state
    const newOtp = [...otp];

    // EMPTY CASE: If the field is cleared, update state to empty
    if (!rawValue) {
      newOtp[index] = '';
      setOtp(newOtp);
      return;
    }

    // DUPLICATE CHECK:
    // React controlled inputs sometimes have issues where typing one character
    // results in the same character being added twice

    // If the current field already has a value AND the input length > 1,
    // this is almost certainly a duplicate character scenario
    const currentValue = otp[index];

    // Critical duplicate prevention logic
    if (rawValue.length > 1 && currentValue !== '') {
      // If the first character in rawValue matches what we already have,
      // then this is a duplicate case
      if (rawValue.startsWith(currentValue)) {
        // Extract additional characters - usually just one
        const extraChar = rawValue.substring(
          currentValue.length,
          rawValue.length
        );
        if (extraChar && index < 5) {
          // Process the extra character
          const validChar = processOtpInput(extraChar);
          if (validChar) {
            // Put it in the next field
            newOtp[index + 1] = validChar;
            setOtp(newOtp);

            // Focus the next field
            setTimeout(() => {
              const nextInput = document.getElementById(
                `otp-input-${index + 1}`
              );
              if (nextInput) {
                nextInput.focus();
                // Position cursor at the end
                const len = nextInput.value.length;
                nextInput.setSelectionRange(len, len);
              }
            }, 0);
          }
        }
        return;
      }
    }

    // NORMAL CASE: Just a single character input or replacement
    // Process it normally
    const singleCharValue = processOtpInput(
      rawValue.charAt(rawValue.length - 1)
    );
    if (!singleCharValue) return;

    // Update the OTP state with the valid character
    newOtp[index] = singleCharValue;
    setOtp(newOtp);

    // Advance to next field if available
    if (index < 5) {
      setTimeout(() => {
        const nextInput = document.getElementById(`otp-input-${index + 1}`);
        if (nextInput) {
          nextInput.focus();
          // Position cursor at the end
          const len = nextInput.value.length;
          nextInput.setSelectionRange(len, len);
        }
      }, 0);
    }
  };

  const handleKeyDown = (e, index) => {
    // IMPORTANT: This pre-emptively handles character input
    // when a field already has a value to prevent duplicates
    if (/^[a-zA-Z0-9]$/.test(e.key) && otp[index] !== '') {
      e.preventDefault(); // Stop default behavior

      // If the user is typing a character and the field is already filled,
      // we want to put that character in the next field instead
      if (index < 5) {
        // Format the character properly
        const nextChar = processOtpInput(e.key);
        if (nextChar) {
          // Update the next field
          const newOtp = [...otp];
          newOtp[index + 1] = nextChar;
          setOtp(newOtp);

          // Move focus to next field
          setTimeout(() => {
            const nextInput = document.getElementById(`otp-input-${index + 1}`);
            if (nextInput) {
              nextInput.focus();
              // Make sure cursor is at the end to prevent further doubling
              const len = nextInput.value.length;
              nextInput.setSelectionRange(len, len);
            }
          }, 0);
        }
      }
      return;
    }

    // Handle backspace
    if (e.key === 'Backspace') {
      if (otp[index] !== '') {
        // If the current field has content, clear it
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // If current field is empty and we're not on the first input, move to previous
        e.preventDefault();
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
    }
    // Handle Delete key - just clear the current field without moving
    else if (e.key === 'Delete') {
      if (otp[index] !== '') {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    }
    // Handle left arrow key
    else if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault();
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
    // Handle right arrow key
    else if (e.key === 'ArrowRight' && index < 5) {
      e.preventDefault();
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
    // Handle Tab key (allow default behavior, just making sure nothing else happens)
    else if (e.key === 'Tab') {
      // Let default tab behavior work naturally
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Vui lòng nhập đầy đủ mã OTP 6 ký tự');
      return;
    }

    if (!/^[A-Z0-9]+$/.test(otpCode)) {
      toast.error('Mã OTP chỉ bao gồm chữ cái (không dấu) và chữ số');
      return;
    }

    if (!email) {
      toast.error(
        'Không tìm thấy email. Vui lòng quay lại trang quên mật khẩu'
      );
      navigate('/forgot-password');
      return;
    }

    setLoading(true);

    try {
      // Gọi validateOtpAPI với email và otpCode sử dụng phương thức POST
      const response = await validateOtpAPI(email, otpCode);
      console.log('OTP validation response:', response);

      // Kiểm tra response từ API - BE trả về {success: true/false, message: "..."}
      if (response && response.success === false) {
        // API trả về success = false
        toast.error(response.message || 'Mã OTP không hợp lệ');
        return;
      }

      // Successful validation - BE trả về {success: true, message: "Mã OTP hợp lệ."}
      if (response && response.success === true) {
        setVerified(true);
        toast.success('Xác thực OTP thành công');

        // Lưu thông tin cần thiết cho reset password
        // BE không trả về token trong validate OTP, chỉ trả về success status
        sessionStorage.setItem('otpVerified', 'true');
        sessionStorage.setItem('otpEmail', email);
        sessionStorage.setItem('otpCode', otpCode);

        // Redirect to reset password sau 1 giây (đủ để người dùng thấy thông báo thành công)
        setTimeout(() => {
          navigate('/reset-password', {
            state: { verified: true, email: email },
          });
        }, 1000);
      } else {
        // Response không có format đúng
        toast.error('Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại sau');
      }
    } catch (error) {
      console.error('OTP validation error:', error);

      // Handle different types of errors
      if (error.response?.data?.message) {
        // Backend trả về lỗi cụ thể
        toast.error(error.response.data.message);
      } else if (error.response?.status === 400) {
        toast.error('Mã OTP không hợp lệ hoặc đã hết hạn');
      } else if (error.response?.status === 401) {
        toast.error('Mã OTP đã hết hạn, vui lòng yêu cầu mã mới');
        // Tự động chuyển đến trang yêu cầu OTP mới sau 2 giây
        setTimeout(() => {
          navigate('/forgot-password', {
            state: {
              email: email,
              message: 'Mã OTP đã hết hạn, vui lòng yêu cầu mã mới',
            },
          });
        }, 2000);
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy yêu cầu OTP. Vui lòng gửi lại yêu cầu');
      } else if (!navigator.onLine) {
        toast.error(
          'Không có kết nối mạng. Vui lòng kiểm tra kết nối của bạn và thử lại'
        );
      } else {
        toast.error(
          'Có lỗi xảy ra trong quá trình xác thực. Vui lòng thử lại sau'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      toast.error(
        'Không tìm thấy email. Vui lòng quay lại trang quên mật khẩu'
      );
      navigate('/forgot-password');
      return;
    }

    // Redirect to forgot-password page with the email to resend
    navigate('/forgot-password', { state: { email: email, resend: true } });
  };

  if (verified) {
    return (
      <div className="login-container">
        <div className="login-left">
          <div className="login-logo">
            <div className="logo-icon"></div>
            <span>Gynexa</span>
          </div>
          <img
            src="https://plus.unsplash.com/premium_photo-1681842975607-f3721c013f38?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Doctors"
            className="doctors-image"
          />
        </div>

        <div className="login-right">
          <div className="login-form">
            <div className="success-icon">
              <CheckCircle size={80} color="#3a99b7" />
            </div>

            <h2>Xác thực thành công</h2>
            <p>
              Mã OTP đã được xác thực. Đang chuyển hướng đến trang đặt lại mật
              khẩu...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="login-logo">
          <div className="logo-icon"></div>
          <span>Gynexa</span>
        </div>
        <img
          src="https://plus.unsplash.com/premium_photo-1681842975607-f3721c013f38?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Doctors"
          className="doctors-image"
        />
      </div>

      <div className="login-right">
        <Link to="/forgot-password" className="close-button">
          ✕
        </Link>

        <div className="login-form">
          <div className="back-link">
            <Link to="/forgot-password">
              <ArrowLeft size={20} />
              Quay lại
            </Link>
          </div>

          <h2>Xác thực OTP</h2>
          <p>
            Nhập mã OTP 6 ký tự đã được gửi đến <strong>{email}</strong>
          </p>

          <div className="email-sent-info">
            <div className="info-item">
              <Mail size={20} />
              <span>Kiểm tra hộp thư đến và spam</span>
            </div>
            <div className="info-item">
              <AlertCircle size={20} />
              <span>Mã OTP sẽ hết hạn sau 15 phút</span>
            </div>
            <div className="info-item">
              <Key size={20} />
              <span>Mã OTP gồm 6 ký tự (chữ cái và số)</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="otp-input-group">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="text"
                  autoCorrect="off"
                  autoCapitalize="characters"
                  spellCheck="false"
                  maxLength={1}
                  pattern="[a-zA-Z0-9]"
                  value={digit}
                  onClick={e => {
                    // Better selection handling to prevent duplicate inputs
                    e.preventDefault();
                    const input = e.target;

                    // Clear selection or position cursor at end
                    setTimeout(() => {
                      if (input.value) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      } else {
                        input.select();
                      }
                    }, 0);
                  }}
                  onFocus={e => {
                    // Position cursor at end or select text on focus
                    const input = e.target;
                    setTimeout(() => {
                      if (input.value) {
                        const len = input.value.length;
                        input.setSelectionRange(len, len);
                      } else {
                        input.select();
                      }
                    }, 0);
                  }}
                  onChange={e => handleOtpChange(e, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                  onPaste={e => {
                    // Always prevent default paste behavior to prevent duplicates
                    e.preventDefault();
                    e.stopPropagation();

                    // Get paste data from clipboard
                    const pasteData = e.clipboardData.getData('text').trim();

                    // Skip if empty
                    if (!pasteData) return;

                    // Extract only the valid characters (alphanumeric)
                    let validChars = '';
                    for (let i = 0; i < pasteData.length; i++) {
                      const char = pasteData.charAt(i);
                      if (/[a-zA-Z0-9]/.test(char)) {
                        validChars += char.toUpperCase();
                      }
                    }

                    // Skip if no valid characters
                    if (!validChars) return;

                    // Create a fresh copy of the OTP array
                    const newOtp = [...otp];

                    // Only use up to 6 characters or what we have
                    const charsToUse = validChars.substring(0, 6);

                    // Zero out any existing values first to prevent weird paste behavior
                    // This is important to prevent duplicate character issues
                    for (let i = 0; i < 6; i++) {
                      newOtp[i] = '';
                    }

                    // Now distribute characters across the inputs
                    for (let i = 0; i < charsToUse.length && i < 6; i++) {
                      newOtp[i] = charsToUse.charAt(i);
                    }

                    // Update the state with the new OTP array
                    setOtp(newOtp);

                    // Focus the field after the last filled position, or the last field if all filled
                    const focusIndex = Math.min(charsToUse.length, 5);

                    // Add a small delay to ensure React has updated the DOM
                    setTimeout(() => {
                      const inputToFocus = document.getElementById(
                        `otp-input-${focusIndex}`
                      );
                      if (inputToFocus) {
                        inputToFocus.focus();

                        // Position cursor at end
                        if (inputToFocus.value) {
                          const len = inputToFocus.value.length;
                          inputToFocus.setSelectionRange(len, len);
                        }
                      }
                    }, 10);
                  }}
                  disabled={loading}
                  className="otp-input"
                />
              ))}
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Đang xác thực...' : 'Xác thực OTP'}
            </button>

            <div className="resend-otp">
              <span>Không nhận được mã OTP?</span>
              <button
                type="button"
                className="resend-link"
                onClick={handleResendOtp}
                disabled={loading}
              >
                Gửi lại mã
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPValidation;
