import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Rating,
  Skeleton,
  Alert,
  Button
} from '@mui/material';
import {
  ThumbUp as ThumbUpIcon,
  Star as StarIcon
} from '@mui/icons-material';
import { getConsultationFeedbackAPI, getBookingFeedbackAPI } from '../services/FeedbackService';

const FeedbackStatus = ({ consultationId, bookingId, onFeedbackSubmitted, onFeedbackClick }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (consultationId || bookingId) {
      loadFeedback();
    }
  }, [consultationId, bookingId]);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      let response;
      
      if (consultationId) {
        response = await getConsultationFeedbackAPI(consultationId);
      } else if (bookingId) {
        response = await getBookingFeedbackAPI(bookingId);
      } else {
        throw new Error('Không có consultationId hoặc bookingId');
      }
      
      // Response từ customize-axios sẽ có cấu trúc { success, message, data }
      // Nếu success = true và data = null, có nghĩa là chưa có feedback
      // Nếu success = true và data != null, có nghĩa là đã có feedback
      if (response && response.success && response.data) {
        setFeedback(response.data);
      } else {
        setFeedback(null); // Không có feedback
      }
    } catch (error) {
      console.error('Load feedback error:', error);
      if (error.response?.status === 404) {
        setFeedback(null); // Không có feedback
      } else {
        setError('Có lỗi xảy ra khi tải thông tin đánh giá');
      }
    } finally {
      setLoading(false);
    }
  };

  // Refresh feedback khi có feedback mới
  useEffect(() => {
    if (onFeedbackSubmitted) {
      loadFeedback();
    }
  }, [onFeedbackSubmitted]);

  // Refresh feedback khi component được re-render với key mới
  useEffect(() => {
    if (consultationId || bookingId) {
      loadFeedback();
    }
  }, [consultationId, bookingId]);

  // Refresh feedback khi bookingId hoặc consultationId thay đổi
  useEffect(() => {
    if (consultationId || bookingId) {
      loadFeedback();
    }
  }, [consultationId, bookingId]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Skeleton variant="circular" width={20} height={20} />
        <Skeleton variant="text" width={100} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ py: 0 }}>
        {error}
      </Alert>
    );
  }

  if (feedback) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ThumbUpIcon color="success" fontSize="small" />
        <Rating
          value={feedback.rating}
          readOnly
          size="small"
          sx={{ mr: 1 }}
        />
        <Chip
          label="Đã đánh giá"
          color="success"
          size="small"
          variant="outlined"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <StarIcon color="action" fontSize="small" />
      <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
        Chưa đánh giá
      </Typography>
      {onFeedbackClick && (
        <Button
          variant="contained"
          color="success"
          size="small"
          startIcon={<ThumbUpIcon />}
          onClick={onFeedbackClick}
        >
          Đánh giá
        </Button>
      )}
    </Box>
  );
};

export default FeedbackStatus; 