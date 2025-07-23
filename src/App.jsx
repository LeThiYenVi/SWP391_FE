import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { WebSocketProvider } from './context/WebSocketContext';
import { CycleProvider } from './context/CycleContext';
import { AppointmentProvider } from './context/AppointmentContext';
import { ConsultantProvider } from './context/ConsultantContext';
import ErrorBoundary from './components/ErrorBoundary';
import { checkVersionAndClearCache } from './utils/cacheUtils';
import router from './router';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    // Kiểm tra version và clear cache nếu cần
    checkVersionAndClearCache();
  }, []);

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <WebSocketProvider>
            <CycleProvider>
              <AppointmentProvider>
                <ConsultantProvider>
                  <RouterProvider router={router} />
                  <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                  />
                </ConsultantProvider>
              </AppointmentProvider>
            </CycleProvider>
          </WebSocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}

export default App;
