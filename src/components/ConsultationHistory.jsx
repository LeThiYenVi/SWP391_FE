import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  AccessTime as TimeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  VideoCall as VideoIcon,
  Message as MessageIcon,
  ThumbUp as ThumbUpIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import FeedbackModal from './FeedbackModal';
import FeedbackStatus from './FeedbackStatus';
import { getUserBookingsAPI } from '../services/ConsultationService';

const ConsultationHistory = () => {
  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [consultationToCancel, setConsultationToCancel] = useState(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
             const response = await getUserBookingsAPI();
       
       // getUserBookingsAPI() trả về response.data (chỉ phần data)
       // Nên response đã là array trực tiếp
       if (response && Array.isArray(response)) {
         setConsultations(response);
       } else if (response && response.data && Array.isArray(response.data)) {
         setConsultations(response.data);
       } else {
         setConsultations([]);
         if (response && response.message) {
           toast.error(response.message);
         }
       }
    } catch (error) {
      console.error('Error fetching consultations:', error);
      toast.error('Không thể tải lịch sử tư vấn');
      setConsultations([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedbackClick = (consultation) => {
    setSelectedConsultation(consultation);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmitted = () => {
    setFeedbackModalOpen(false);
    setSelectedConsultation(null);
    fetchConsultations(); // Refresh data
  };

  const handleCancelConsultation = (consultation) => {
    setConsultationToCancel(consultation);
    setCancelModalOpen(true);
  };

  const confirmCancelConsultation = async () => {
    try {
      // TODO: Gọi API hủy lịch
      // const response = await cancelConsultationAPI(consultationToCancel.id);
      
      // Tạm thời chỉ cập nhật local state
      setConsultations(prev => 
        prev.map(cons => 
          cons.id === consultationToCancel.id 
            ? { ...cons, status: 'CANCELLED' }
            : cons
        )
      );
      
      toast.success('Đã hủy lịch tư vấn thành công!');
      setCancelModalOpen(false);
      setConsultationToCancel(null);
    } catch (error) {
      console.error('Error canceling consultation:', error);
      toast.error('Không thể hủy lịch tư vấn. Vui lòng thử lại!');
    }
  };

  const closeCancelModal = () => {
    setCancelModalOpen(false);
    setConsultationToCancel(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'SCHEDULED':
        return 'primary';
      case 'IN_PROGRESS':
        return 'warning';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'SCHEDULED':
        return 'Đã lên lịch';
      case 'IN_PROGRESS':
        return 'Đang diễn ra';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const getConsultationTypeIcon = (type) => {
    switch (type) {
      case 'ONLINE':
        return <VideoIcon fontSize="small" />;
      case 'IN_PERSON':
        return <PersonIcon fontSize="small" />;
      default:
        return <MessageIcon fontSize="small" />;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (consultations.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Chưa có lịch sử tư vấn
        </Typography>
                 <Typography variant="body2" color="text.secondary">
           Bạn chưa có buổi tư vấn nào. Hãy đặt lịch tư vấn để bắt đầu!
         </Typography>
      </Box>
    );
  }

  return (
    <Box>
             <Typography variant="h5" fontWeight="bold" gutterBottom>
         Lịch sử tư vấn ({consultations.length} buổi)
       </Typography>
      
             <Box>
         {/* Header của bảng */}
         <Box 
           sx={{ 
             display: 'grid', 
             gridTemplateColumns: '1fr 1fr 1fr 1fr 120px',
             gap: 2,
             p: 2,
             bgcolor: 'grey.50',
             borderRadius: 1,
             mb: 2,
             fontWeight: 'bold'
           }}
         >
           <Typography variant="subtitle2" fontWeight="bold">Tư vấn viên</Typography>
           <Typography variant="subtitle2" fontWeight="bold">Thông tin</Typography>
           <Typography variant="subtitle2" fontWeight="bold">Trạng thái</Typography>
           <Typography variant="subtitle2" fontWeight="bold">Ghi chú</Typography>
           <Typography variant="subtitle2" fontWeight="bold" textAlign="center">Hành động</Typography>
         </Box>

         {/* Danh sách consultations */}
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
           {consultations.map((consultation) => (
             <Card key={consultation.id} sx={{ height: '100px' }}>
               <CardContent sx={{ p: 2, height: '100%' }}>
                 <Box 
                   sx={{ 
                     display: 'grid', 
                     gridTemplateColumns: '1fr 1fr 1fr 1fr 120px',
                     gap: 2,
                     height: '100%',
                     alignItems: 'center'
                   }}
                 >
                   {/* Cột 1: Tư vấn viên */}
                   <Box display="flex" alignItems="center">
                     <Avatar 
                       sx={{ 
                         width: 40, 
                         height: 40, 
                         bgcolor: 'primary.main',
                         mr: 2
                       }}
                     >
                       {consultation.consultantName?.charAt(0) || consultation.consultant?.fullName?.charAt(0) || 'C'}
                     </Avatar>
                     <Box>
                       <Typography variant="body2" fontWeight="bold" noWrap>
                         {consultation.consultantName || consultation.consultant?.fullName || 'Tư vấn viên'}
                       </Typography>
                       <Typography variant="caption" color="text.secondary" noWrap>
                         {consultation.consultantSpecialization || consultation.consultant?.specialization || 'Chuyên môn'}
                       </Typography>
                     </Box>
                   </Box>

                   {/* Cột 2: Thông tin */}
                   <Box>
                     <Box display="flex" alignItems="center" mb={0.5}>
                       <CalendarIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                       <Typography variant="body2" noWrap>
                         {consultation.startTime ? format(new Date(consultation.startTime), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                       </Typography>
                     </Box>
                     <Box display="flex" alignItems="center" mb={0.5}>
                       <TimeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                       <Typography variant="body2" noWrap>
                         {consultation.startTime ? format(new Date(consultation.startTime), 'HH:mm') : 'N/A'} - {consultation.endTime ? format(new Date(consultation.endTime), 'HH:mm') : 'N/A'}
                       </Typography>
                     </Box>
                     <Box display="flex" alignItems="center">
                       {getConsultationTypeIcon(consultation.consultationType)}
                       <Typography variant="body2" sx={{ ml: 1 }} noWrap>
                         {consultation.consultationType === 'ONLINE' ? 'Tư vấn trực tuyến' : 'Tư vấn trực tiếp'}
                       </Typography>
                     </Box>
                   </Box>

                   {/* Cột 3: Trạng thái */}
                   <Box display="flex" flexDirection="column" gap={1}>
                     <Chip 
                       label={getStatusText(consultation.status)}
                       color={getStatusColor(consultation.status)}
                       size="small"
                     />
                     {consultation.meetingLink && (
                       <Typography variant="caption" color="primary" sx={{ cursor: 'pointer' }} noWrap>
                         Link meeting
                       </Typography>
                     )}
                   </Box>

                   {/* Cột 4: Ghi chú */}
                   <Box>
                     {consultation.notes && (
                       <Typography variant="body2" color="text.secondary" sx={{ 
                         overflow: 'hidden',
                         textOverflow: 'ellipsis',
                         display: '-webkit-box',
                         WebkitLineClamp: 3,
                         WebkitBoxOrient: 'vertical'
                       }}>
                         {consultation.notes}
                       </Typography>
                     )}
                   </Box>

                   {/* Cột 5: Hành động */}
                   <Box display="flex" justifyContent="center" alignItems="center">
                     {consultation.status === 'COMPLETED' && (
                       consultation.hasFeedback ? (
                         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5 }}>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                             <ThumbUpIcon color="success" fontSize="small" />
                             <Rating
                               value={consultation.feedbackRating}
                               readOnly
                               size="small"
                             />
                           </Box>
                           <Chip
                             label="Đã đánh giá"
                             color="success"
                             size="small"
                             variant="outlined"
                           />
                         </Box>
                       ) : (
                         <Button
                           variant="contained"
                           color="success"
                           size="small"
                           startIcon={<StarIcon />}
                           onClick={() => handleFeedbackClick(consultation)}
                           sx={{ minWidth: '100px' }}
                         >
                           Đánh giá
                         </Button>
                       )
                     )}
                     
                                           {consultation.status === 'SCHEDULED' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleCancelConsultation(consultation)}
                          sx={{ minWidth: '100px' }}
                        >
                          Hủy lịch
                        </Button>
                      )}
                   </Box>
                 </Box>
               </CardContent>
             </Card>
           ))}
         </Box>
       </Box>

             {/* Feedback Modal */}
       <FeedbackModal
         open={feedbackModalOpen}
         onClose={() => setFeedbackModalOpen(false)}
         consultation={selectedConsultation}
         onFeedbackSubmitted={handleFeedbackSubmitted}
       />

       {/* Cancel Consultation Modal */}
       <Dialog
         open={cancelModalOpen}
         onClose={closeCancelModal}
         maxWidth="sm"
         fullWidth
       >
         <DialogTitle sx={{ 
           bgcolor: 'error.light', 
           color: 'white',
           display: 'flex',
           alignItems: 'center',
           gap: 1
         }}>
           <Typography variant="h6" fontWeight="bold">
             ⚠️ Xác nhận hủy lịch tư vấn
           </Typography>
         </DialogTitle>
         <DialogContent sx={{ pt: 3 }}>
           {consultationToCancel && (
             <Box>
               <Typography variant="body1" gutterBottom>
                 Bạn có chắc chắn muốn hủy lịch tư vấn với:
               </Typography>
               <Card sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
                 <Box display="flex" alignItems="center" mb={2}>
                   <Avatar 
                     sx={{ 
                       width: 50, 
                       height: 50, 
                       bgcolor: 'primary.main',
                       mr: 2
                     }}
                   >
                     {consultationToCancel.consultantName?.charAt(0) || consultationToCancel.consultant?.fullName?.charAt(0) || 'C'}
                   </Avatar>
                   <Box>
                     <Typography variant="h6" fontWeight="bold">
                       {consultationToCancel.consultantName || consultationToCancel.consultant?.fullName || 'Tư vấn viên'}
                     </Typography>
                     <Typography variant="body2" color="text.secondary">
                       {consultationToCancel.consultantSpecialization || consultationToCancel.consultant?.specialization || 'Chuyên môn'}
                     </Typography>
                   </Box>
                 </Box>
                 <Box>
                   <Typography variant="body2" sx={{ mb: 1 }}>
                     <strong>Ngày:</strong> {consultationToCancel.startTime ? format(new Date(consultationToCancel.startTime), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                   </Typography>
                   <Typography variant="body2" sx={{ mb: 1 }}>
                     <strong>Giờ:</strong> {consultationToCancel.startTime ? format(new Date(consultationToCancel.startTime), 'HH:mm', { locale: vi }) : 'N/A'} - {consultationToCancel.endTime ? format(new Date(consultationToCancel.endTime), 'HH:mm', { locale: vi }) : 'N/A'}
                   </Typography>
                   <Typography variant="body2">
                     <strong>Loại:</strong> {consultationToCancel.consultationType === 'ONLINE' ? 'Tư vấn trực tuyến' : 'Tư vấn trực tiếp'}
                   </Typography>
                 </Box>
               </Card>
               <Alert severity="warning" sx={{ mt: 2 }}>
                 <Typography variant="body2">
                   <strong>Lưu ý:</strong> Hành động này không thể hoàn tác. Lịch tư vấn sẽ bị hủy vĩnh viễn.
                 </Typography>
               </Alert>
             </Box>
           )}
         </DialogContent>
         <DialogActions sx={{ p: 3, gap: 2 }}>
           <Button 
             onClick={closeCancelModal}
             variant="outlined"
             sx={{ minWidth: '100px' }}
           >
             Hủy bỏ
           </Button>
           <Button 
             onClick={confirmCancelConsultation}
             variant="contained"
             color="error"
             sx={{ minWidth: '100px' }}
           >
             Xác nhận hủy
           </Button>
         </DialogActions>
       </Dialog>
    </Box>
  );
};

export default ConsultationHistory; 