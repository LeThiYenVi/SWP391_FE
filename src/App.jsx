import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import { CycleProvider } from './context/CycleContext';
import { AppointmentProvider } from './context/AppointmentContext';
import router from './router';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <CycleProvider>
          <AppointmentProvider>
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
          </AppointmentProvider>
        </CycleProvider>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
