import React, { useEffect } from 'react';
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
import router from './router';
// import 'react-toastify/dist/ReactToastify.css';

function App() {
  useEffect(() => {
    checkVersionAndClearCache();
  }, []);

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
