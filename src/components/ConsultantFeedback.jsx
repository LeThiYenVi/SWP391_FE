import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Rating,
  Avatar,
  Chip,
  Skeleton,
  Alert,
  Button,
  Collapse
} from '@mui/material';
import {
  Star as StarIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import { getConsultantFeedbackAPI } from '../services/FeedbackService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const ConsultantFeedback = ({ consultantId, consultantName, maxDisplay = 3 }) => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (consultantId) {
      loadFeedbacks();
    }
  }, [consultantId]);

  const loadFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await getConsultantFeedbackAPI(consultantId);
      
      if (response.success && response.data) {
        setFeedbacks(response.data);
      } else {
        setError('Không thể tải đánh giá');
      }
    } catch (error) {
      console.error('Load feedbacks error:', error);
      setError('Có lỗi xảy ra khi tải đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
    return (totalRating / feedbacks.length).toFixed(1);
  };

  const getRatingText = (rating) => {
    if (rating >= 4.5) return 'Xuất sắc';
    if (rating >= 4.0) return 'Tốt';
    if (rating >= 3.5) return 'Khá';
    if (rating >= 3.0) return 'Trung bình';
    return 'Cần cải thiện';
  };

  const displayedFeedbacks = expanded ? feedbacks : feedbacks.slice(0, maxDisplay);

  if (loading) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Box>
          </Box>
          <Skeleton variant="text" width="100%" />
          <Skeleton variant="text" width="80%" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (feedbacks.length === 0) {
    return (
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="body2" color="text.secondary" align="center">
            Chưa có đánh giá nào cho tư vấn viên này
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Box>
      {/* Summary */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
              <PersonIcon />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" component="div">
                {consultantName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {feedbacks.length} đánh giá
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating
              value={parseFloat(calculateAverageRating())}
              precision={0.1}
              readOnly
              size="small"
              sx={{ mr: 1 }}
            />
            <Typography variant="h6" component="span" sx={{ mr: 1 }}>
              {calculateAverageRating()}
            </Typography>
            <Chip 
              label={getRatingText(parseFloat(calculateAverageRating()))}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Feedback List */}
      {displayedFeedbacks.map((feedback, index) => (
        <Card key={feedback.id} sx={{ mb: 1 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'secondary.main', width: 32, height: 32 }}>
                <PersonIcon fontSize="small" />
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Khách hàng
                  </Typography>
                  <Rating
                    value={feedback.rating}
                    readOnly
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    {feedback.createdAt && format(new Date(feedback.createdAt), 'dd/MM/yyyy', { locale: vi })}
                  </Typography>
                </Box>
                
                {feedback.comment && (
                  <Typography variant="body2" color="text.primary">
                    "{feedback.comment}"
                  </Typography>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      ))}

      {/* Show More/Less Button */}
      {feedbacks.length > maxDisplay && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Button
            onClick={() => setExpanded(!expanded)}
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            variant="outlined"
            size="small"
          >
            {expanded ? 'Thu gọn' : `Xem thêm ${feedbacks.length - maxDisplay} đánh giá`}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ConsultantFeedback; 