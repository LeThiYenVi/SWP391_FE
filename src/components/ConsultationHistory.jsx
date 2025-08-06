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
  console.log('🎯 ConsultationHistory component rendering...');

  const { user } = useAuth();
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [consultationToCancel, setConsultationToCancel] = useState(null);

  useEffect(() => {
    console.log('🚀 ConsultationHistory component mounted, calling fetchConsultations...');
    fetchConsultations();
  }, []);

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching consultations...');

      const response = await getUserBookingsAPI();

      // ✅ After interceptor fix: response = { success, message, data }
      console.log('📋 Consultation History API Response:', response);
      console.log('📋 Response type:', typeof response);
      console.log('📋 Response.success:', response?.success);
      console.log('📋 Response.data:', response?.data);
      console.log('📋 Response.data type:', typeof response?.data);
      console.log('📋 Is response.data array?', Array.isArray(response?.data));

      if (response && response.success && Array.isArray(response.data)) {
        console.log('✅ Setting consultations:', response.data.length, 'items');
        setConsultations(response.data);
      } else {
        console.log('❌ Invalid response structure, setting empty array');
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

  return (
    <Box sx={{ p: 0 }}>
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      ) : consultations.length === 0 ? (
        <Box textAlign="center" py={8}>
          <CalendarIcon sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Chưa có lịch sử tư vấn
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Bạn chưa có buổi tư vấn nào. Hãy đặt lịch tư vấn đầu tiên!
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" fontWeight="600" gutterBottom sx={{ mb: 3, color: '#1976d2' }}>
            📋 Lịch sử tư vấn ({consultations.length} buổi)
          </Typography>

         {/* Danh sách consultations */}
         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
           {consultations.map((consultation) => (
             <Card
               key={consultation.id}
               sx={{
                 border: '1px solid #e3f2fd',
                 borderRadius: 3,
                 overflow: 'hidden',
                 transition: 'all 0.3s ease',
                 '&:hover': {
                   boxShadow: '0 8px 25px rgba(25, 118, 210, 0.15)',
                   transform: 'translateY(-4px)',
                   borderColor: '#1976d2'
                 }
               }}
             >
               <CardContent sx={{ p: 3 }}>
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                   {/* Header với thông tin bác sĩ và trạng thái */}
                   <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                       <Avatar
                         sx={{
                           width: 56,
                           height: 56,
                           background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                           fontSize: '1.5rem',
                           fontWeight: 'bold',
                           boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                         }}
                       >
                         {consultation.consultantName?.charAt(0) || consultation.consultant?.fullName?.charAt(0) || 'C'}
                       </Avatar>
                       <Box>
                         <Typography variant="h6" fontWeight="600" color="primary.main" sx={{ mb: 0.5 }}>
                           {consultation.consultantName || consultation.consultant?.fullName || 'Tư vấn viên'}
                         </Typography>
                         <Typography variant="body2" color="text.secondary">
                           {consultation.consultantSpecialization || consultation.consultant?.specialization || 'Chuyên môn'}
                         </Typography>
                       </Box>
                     </Box>

                     <Chip
                       label={getStatusText(consultation.status)}
                       color={getStatusColor(consultation.status)}
                       sx={{
                         fontWeight: '600',
                         fontSize: '0.75rem',
                         height: 32
                       }}
                     />
                   </Box>

                   {/* Thông tin chi tiết */}
                   <Box
                     sx={{
                       display: 'grid',
                       gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
                       gap: 2,
                       mt: 1
                     }}
                   >
                     {/* Thời gian */}
                     <Box sx={{
                       bgcolor: '#f8f9fa',
                       borderRadius: 2,
                       p: 2,
                       border: '1px solid #e9ecef'
                     }}>
                       <Typography variant="subtitle2" fontWeight="600" color="primary.main" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                         <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                         Thời gian
                       </Typography>
                       <Typography variant="body2" sx={{ mb: 0.5 }}>
                         📅 {consultation.startTime ? format(new Date(consultation.startTime), 'dd/MM/yyyy', { locale: vi }) : 'N/A'}
                       </Typography>
                       <Typography variant="body2">
                         ⏰ {consultation.startTime ? format(new Date(consultation.startTime), 'HH:mm') : 'N/A'} - {consultation.endTime ? format(new Date(consultation.endTime), 'HH:mm') : 'N/A'}
                       </Typography>
                     </Box>

                     {/* Loại tư vấn */}
                     <Box sx={{
                       bgcolor: '#f8f9fa',
                       borderRadius: 2,
                       p: 2,
                       border: '1px solid #e9ecef'
                     }}>
                       <Typography variant="subtitle2" fontWeight="600" color="primary.main" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                         {getConsultationTypeIcon(consultation.consultationType)}
                         <Box sx={{ ml: 1 }}>Loại tư vấn</Box>
                       </Typography>
                       <Typography variant="body2">
                         {consultation.consultationType === 'ONLINE' ? '💻 Tư vấn trực tuyến' : '🏥 Tư vấn trực tiếp'}
                       </Typography>
                       {consultation.meetingLink && (
                         <Typography variant="caption" color="primary.main" sx={{ mt: 0.5, display: 'block' }}>
                           🔗 Có link meeting
                         </Typography>
                       )}
                     </Box>

                     {/* Ghi chú và hành động */}
                     <Box sx={{
                       bgcolor: '#f8f9fa',
                       borderRadius: 2,
                       p: 2,
                       border: '1px solid #e9ecef'
                     }}>
                       <Typography variant="subtitle2" fontWeight="600" color="primary.main" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                         📝 Ghi chú & Hành động
                       </Typography>

                       {consultation.notes ? (
                         <Typography variant="body2" color="text.secondary" sx={{
                           mb: 2,
                           overflow: 'hidden',
                           textOverflow: 'ellipsis',
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical'
                         }}>
                           {consultation.notes}
                         </Typography>
                       ) : (
                         <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontStyle: 'italic' }}>
                           Không có ghi chú
                         </Typography>
                       )}

                       {/* Hành động */}
                       <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                         {consultation.meetingLink && (
                           <Chip
                             label="🔗 Link meeting"
                             color="info"
                             size="small"
                             variant="outlined"
                             sx={{ cursor: 'pointer' }}
                           />
                         )}

                         {consultation.status === 'COMPLETED' && (
                           consultation.hasFeedback ? (
                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                               <Rating
                                 value={consultation.feedbackRating}
                                 readOnly
                                 size="small"
                               />
                               <Chip
                                 label="✅ Đã đánh giá"
                                 color="success"
                                 size="small"
                                 variant="outlined"
                               />
                             </Box>
                           ) : (
                             <Button
                               variant="contained"
                               color="warning"
                               size="small"
                               startIcon={<StarIcon />}
                               onClick={() => handleFeedbackClick(consultation)}
                               sx={{
                                 borderRadius: 2,
                                 textTransform: 'none',
                                 fontWeight: '600'
                               }}
                             >
                               ⭐ Đánh giá
                             </Button>
                           )
                         )}

                         {consultation.status === 'SCHEDULED' && (
                           <Button
                             variant="outlined"
                             color="error"
                             size="small"
                             onClick={() => handleCancelConsultation(consultation)}
                             sx={{
                               borderRadius: 2,
                               textTransform: 'none',
                               fontWeight: '600'
                             }}
                           >
                             ❌ Hủy lịch
                           </Button>
                         )}
                       </Box>
                     </Box>
                   </Box>
                 </Box>
               </CardContent>
             </Card>
           ))}
         </Box>
        </Box>
      )}

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