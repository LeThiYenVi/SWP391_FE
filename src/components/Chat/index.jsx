import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// ✅ TẠMTHỜI DISABLE CHAT COMPONENT ĐỂ TRÁNH INFINITE LOOP
const Chat = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center p-8 bg-gray-50 rounded-lg shadow-md max-w-md">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          � Tính năng này đang phát triển
        </h2>
        <p className="text-gray-600">
          Chúng tôi đang phát triển tính năng chat để mang lại trải nghiệm tốt hơn.
        </p>
        <p className="text-gray-600 mt-2 mb-6">
          Vui lòng quay lại sau hoặc liên hệ qua hotline để được hỗ trợ.
        </p>

        <Button
          variant="contained"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToDashboard}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 600,
            px: 3,
            py: 1
          }}
        >
          Quay lại Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Chat;