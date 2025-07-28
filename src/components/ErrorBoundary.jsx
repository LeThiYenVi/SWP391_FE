import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            padding: '20px',
          }}
        >
          <div
            style={{
              maxWidth: '500px',
              width: '100%',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '40px',
              textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                background: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px auto',
              }}
            >
              <AlertTriangle size={32} color="#ef4444" />
            </div>

            <h1
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: '#1e293b',
                marginBottom: '12px',
              }}
            >
              Đã xảy ra lỗi
            </h1>

            <p
              style={{
                fontSize: '16px',
                color: '#64748b',
                marginBottom: '32px',
                lineHeight: '1.6',
              }}
            >
              Rất tiếc, có điều gì đó không đúng. Hãy thử làm mới trang hoặc
              quay lại trang chủ.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginBottom: '24px',
                  textAlign: 'left',
                  background: '#f1f5f9',
                  padding: '16px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#475569',
                }}
              >
                <summary style={{ cursor: 'pointer', fontWeight: '500' }}>
                  Chi tiết lỗi (Development)
                </summary>
                <pre
                  style={{
                    marginTop: '12px',
                    whiteSpace: 'pre-wrap',
                    fontSize: '12px',
                    overflow: 'auto',
                  }}
                >
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#3a99b7',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={e => (e.target.style.background = '#2d7a91')}
                onMouseOut={e => (e.target.style.background = '#3a99b7')}
              >
                <RefreshCw size={16} />
                Làm mới trang
              </button>

              <Link
                to="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#ffffff',
                  color: '#3a99b7',
                  border: '2px solid #3a99b7',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseOver={e => {
                  e.target.style.background = '#3a99b7';
                  e.target.style.color = '#ffffff';
                }}
                onMouseOut={e => {
                  e.target.style.background = '#ffffff';
                  e.target.style.color = '#3a99b7';
                }}
              >
                <Home size={16} />
                Về trang chủ
              </Link>
            </div>

            <p
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                marginTop: '24px',
              }}
            >
              Nếu lỗi tiếp tục xảy ra, vui lòng liên hệ với bộ phận hỗ trợ.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
