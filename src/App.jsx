import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './context/AuthContext';
import { SimpleWebSocketProvider } from './context/SimpleWebSocketContext';
import { ChatProvider } from './context/ChatContext';
import { CycleProvider } from './context/CycleContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ConsultantProvider } from './context/ConsultantContext';
import ErrorBoundary from './components/ErrorBoundary';
import { checkVersionAndClearCache } from './utils/cacheUtils';
import router from './router/index.js';
// import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    checkVersionAndClearCache();
    // Add small delay to ensure all contexts are ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <SimpleWebSocketProvider>
            <ChatProvider>
              <CycleProvider>
                <AppointmentProvider>
                  <ConsultantProvider>
                    <RouterProvider router={router} />
                    <ToastContainer
                      position="top-right"
                      autoClose={3000}
                      hideProgressBar={false}
                      newestOnTop={true}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss={false}
                      draggable
                      pauseOnHover={true}
                      theme="light"
                      limit={3}
                      preventDuplicates={true}
                      toastClassName="custom-toast"
                    />
                  </ConsultantProvider>
                </AppointmentProvider>
              </CycleProvider>
            </ChatProvider>
          </SimpleWebSocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
