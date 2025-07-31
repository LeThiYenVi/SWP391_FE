import React, { useState, useEffect } from 'react';
import { Rating, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, Typography, IconButton, Alert } from '@mui/material';
import { Edit, Delete, Star } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  submitConsultationFeedbackAPI, 
  getConsultantFeedbackAPI, 
  updateFeedbackAPI, 
  deleteFeedbackAPI 
} from '../services/FeedbackService';

const ConsultantRating = ({ consultantId, consultantName, onRatingChange }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingFeedback, setExistingFeedback] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && consultantId) {
      loadExistingFeedback();
    }
  }, [user, consultantId]);

  const loadExistingFeedback = async () => {
    try {
      const response = await getConsultantFeedbackAPI(consultantId);
      // Response đã được xử lý bởi customize-axios interceptor
      // Kiểm tra xem response có phải là object gốc không (có field success)
      if (response && typeof response === 'object' && response.success !== undefined) {
        // Đây là object gốc từ API, có nghĩa là data = null (chưa có feedback)
        setExistingFeedback(null);
      } else if (response && response !== null) {
        // Đây là data thực tế (đã có feedback)
        // Tìm feedback của user hiện tại
        const userFeedback = response.find(feedback => feedback.userId === user.id);
        if (userFeedback) {
          setExistingFeedback(userFeedback);
          setRating(userFeedback.rating || 0);
          setComment(userFeedback.comment || '');
        }
      }
    } catch (error) {
      console.error('Error loading existing feedback:', error);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập nhận xét');
      return;
    }

    setLoading(true);
    try {
      const feedbackData = {
        consultantId: consultantId,
        rating: rating,
        comment: comment.trim()
      };

      let response;
      if (isEditMode && existingFeedback) {
        response = await updateFeedbackAPI(existingFeedback.id, feedbackData);
        toast.success('Cập nhật đánh giá thành công!');
      } else {
        response = await submitConsultationFeedbackAPI(feedbackData);
        toast.success('Gửi đánh giá thành công!');
      }

      // API trả về data trực tiếp, không có field success
      setExistingFeedback(response);
      setIsEditMode(false);
      setOpenDialog(false);
      if (onRatingChange) {
        onRatingChange(response);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingFeedback) return;

    setLoading(true);
    try {
      await deleteFeedbackAPI(existingFeedback.id);
      toast.success('Xóa đánh giá thành công!');
      setExistingFeedback(null);
      setRating(0);
      setComment('');
      setIsEditMode(false);
      setOpenDeleteDialog(false);
      if (onRatingChange) {
        onRatingChange(null);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa đánh giá';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
    setOpenDialog(true);
  };

  const handleNewRating = () => {
    setIsEditMode(false);
    setRating(0);
    setComment('');
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    if (!isEditMode) {
      setRating(0);
      setComment('');
    }
  };

  if (!user) {
    return (
      <Box sx={{ textAlign: 'center', py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Vui lòng đăng nhập để đánh giá
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 2 }}>
      {existingFeedback ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating value={existingFeedback.rating} readOnly size="small" />
          <Typography variant="body2" color="text.secondary">
            ({existingFeedback.rating}/5)
          </Typography>
          <IconButton size="small" onClick={handleEdit} color="primary">
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setOpenDeleteDialog(true)} color="error">
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      ) : (
        <Button
          variant="outlined"
          size="small"
          startIcon={<Star />}
          onClick={handleNewRating}
          sx={{ mb: 2 }}
        >
          Đánh giá {consultantName}
        </Button>
      )}

      {/* Rating Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? 'Chỉnh sửa đánh giá' : 'Đánh giá ' + consultantName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Số sao đánh giá:
            </Typography>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              size="large"
              sx={{ mb: 2 }}
            />
            
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Nhận xét của bạn"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn với tư vấn viên này..."
              variant="outlined"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Hủy
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={loading || rating === 0 || !comment.trim()}
          >
            {loading ? 'Đang xử lý...' : (isEditMode ? 'Cập nhật' : 'Gửi đánh giá')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
            {loading ? 'Đang xóa...' : 'Xóa'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ConsultantRating; 