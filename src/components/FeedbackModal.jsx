import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { submitConsultationFeedbackAPI, getConsultationFeedbackAPI } from '../services/FeedbackService';
import { useAuth } from '../context/AuthContext';

const FeedbackModal = ({ open, onClose, consultation, booking, onFeedbackSubmitted }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [checkingFeedback, setCheckingFeedback] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      setError('Vui lòng chọn đánh giá');
      return;
    }

    if (!comment.trim()) {
      setError('Vui lòng nhập nhận xét');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let feedbackData;
      
      if (consultation) {
        // Feedback for consultation
        feedbackData = {
          consultantId: consultation.consultantId,
          consultationId: consultation.id,
          rating: rating,
          comment: comment.trim()
        };
      } else if (booking) {
        // Feedback for booking/testing service
        feedbackData = {
          consultantId: null, // No consultant for testing services
          bookingId: booking.bookingId,
          rating: rating,
          comment: comment.trim()
        };
      } else {
        throw new Error('Không có thông tin consultation hoặc booking');
      }

      const response = await submitConsultationFeedbackAPI(feedbackData);
      
      // Response đã được xử lý bởi customize-axios interceptor
      // Nếu thành công, response.data sẽ chứa data thực tế
      // Nếu lỗi, sẽ throw error
      toast.success('Gửi phản hồi thành công!');
      onFeedbackSubmitted && onFeedbackSubmitted();
      handleClose();
    } catch (error) {
      console.error('Feedback submission error:', error);
      setError(error.response?.data?.message || error.message || 'Có lỗi xảy ra khi gửi phản hồi');
    } finally {
      setLoading(false);
    }
  };

  // Kiểm tra feedback hiện tại khi modal mở
  useEffect(() => {
    if (open && consultation) {
      checkExistingFeedback();
    }
  }, [open, consultation]);

  const checkExistingFeedback = async () => {
    try {
      setCheckingFeedback(true);
      setError('');
      
      // Kiểm tra từ consultation data trước
      if (consultation.hasFeedback) {
        setExistingFeedback({
          rating: consultation.feedbackRating,
          comment: consultation.feedbackComment,
          createdAt: consultation.feedbackCreatedAt
        });
        setError('Bạn đã đánh giá consultation này rồi');
        setTimeout(() => {
          handleClose();
        }, 2000);
        return;
      }
      
      // Nếu không có trong data, kiểm tra API
      const response = await getConsultationFeedbackAPI(consultation.id);
      // Response đã được xử lý bởi customize-axios interceptor
      // Kiểm tra xem response có phải là object gốc không (có field success)
      if (response && typeof response === 'object' && response.success !== undefined) {
        // Đây là object gốc từ API, có nghĩa là data = null (chưa có feedback)
        setExistingFeedback(null);
      } else if (response && response !== null) {
        // Đây là data thực tế (đã có feedback)
        setExistingFeedback(response);
        setError('Bạn đã đánh giá consultation này rồi');
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        setExistingFeedback(null);
      }
    } catch (error) {
      console.error('Check existing feedback error:', error);
      if (error.response?.status === 404) {
        setExistingFeedback(null);
      } else {
        setError('Có lỗi xảy ra khi kiểm tra đánh giá');
      }
    } finally {
      setCheckingFeedback(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment('');
    setError('');
    setExistingFeedback(null);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          {consultation ? 'Đánh giá tư vấn viên' : 'Đánh giá dịch vụ xét nghiệm'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {consultation?.consultantName || booking?.serviceName}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {checkingFeedback && (
          <Box display="flex" justifyContent="center" alignItems="center" py={3}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Đang kiểm tra đánh giá...</Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {!checkingFeedback && !existingFeedback && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography component="legend" gutterBottom>
                Đánh giá của bạn *
              </Typography>
              <Rating
                name="consultant-rating"
                value={rating}
                onChange={(event, newValue) => {
                  setRating(newValue);
                  setError('');
                }}
                size="large"
                icon={<StarIcon sx={{ fontSize: 40 }} />}
                emptyIcon={<StarIcon sx={{ fontSize: 40, color: 'grey.300' }} />}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {rating === 1 && 'Rất không hài lòng'}
                {rating === 2 && 'Không hài lòng'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Hài lòng'}
                {rating === 5 && 'Rất hài lòng'}
              </Typography>
            </Box>

            <TextField
              autoFocus
              margin="dense"
              label="Nhận xét của bạn *"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
              placeholder="Chia sẻ trải nghiệm của bạn về buổi tư vấn..."
              error={!!error && !comment.trim()}
            />
          </>
        )}

        {existingFeedback && (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h6" color="primary" gutterBottom>
              Bạn đã đánh giá consultation này
            </Typography>
            <Rating
              value={existingFeedback.rating}
              readOnly
              size="large"
              sx={{ mb: 2 }}
            />
            <Typography variant="body1" color="text.secondary">
              {existingFeedback.comment}
            </Typography>
          </Box>
        )}
      </DialogContent>
      
      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={handleClose} disabled={loading || checkingFeedback}>
          Hủy
        </Button>
        {!checkingFeedback && !existingFeedback && (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || rating === 0 || !comment.trim()}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Đang gửi...' : 'Gửi phản hồi'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default FeedbackModal; 