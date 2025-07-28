import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box, Paper, InputAdornment, Stepper, Step, StepLabel } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import ModernCycleTracking from './modern';

export default function CycleTrackingPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [genderError, setGenderError] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [cycleData, setCycleData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      window.location.href = '/login';
      return;
    }
    fetch('/api/menstrual-cycle/current', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
      .then(async res => {
        const data = await res.json();
        
        // Check for gender validation error
        if (data && data.message && data.message.includes('chưa chọn giới tính')) {
          setGenderError(true);
          return;
        }
        
        if (res.status === 403) {
          setError(data.error || 'Tính năng này chỉ dành cho nữ');
        } else if (res.status === 204 || (data && data.success === false && data.message === 'Bạn chưa có chu kỳ nào trong hệ thống')) {
          setHasData(false);
        } else if (res.status === 200 && data && data.success !== false) {
          setCycleData(data);
          setHasData(true);
        } else {
          setError('Lỗi không xác định');
        }
      })
      .catch((err) => {
        console.error('Error fetching cycle data:', err);
        setError('Không thể kết nối server');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleGoToProfile = () => {
    navigate('/profile');
  };

  if (loading) return <div>Đang tải...</div>;
  
  if (genderError) {
    return (
      <Box sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5fafd'
      }}>
        <Paper elevation={8} sx={{
          maxWidth: 500,
          width: '100%',
          p: { xs: 3, sm: 4 },
          borderRadius: 4,
          bgcolor: '#fff',
          textAlign: 'center',
          boxShadow: '0 16px 64px 0 rgba(143,92,247,0.18)'
        }}>
          <Typography variant="h4" color="#ff6b6b" gutterBottom sx={{ fontWeight: 'bold' }}>
            ⚠️ Bạn chưa chọn giới tính
          </Typography>
          <Typography variant="body1" color="#7f8c8d" sx={{ mb: 3, fontSize: '16px' }}>
            Vui lòng điền giới tính trong trang cá nhân để theo dõi chu kỳ sinh sản.
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleGoToProfile}
            sx={{
              bgcolor: '#8F5CF7',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 600,
              borderRadius: 2,
              px: 4,
              py: 1.5,
              boxShadow: '0 4px 16px 0 rgba(143,92,247,0.3)',
              transition: 'all 0.3s ease',
              '&:hover': { 
                bgcolor: '#651FFF', 
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 20px 0 rgba(143,92,247,0.4)'
              }
            }}
          >
            Đi đến trang cá nhân
          </Button>
        </Paper>
      </Box>
    );
  }
  
  if (error) return <div style={{ color: 'red', fontWeight: 'bold' }}>{error}</div>;
  if (!hasData) return <FirstCycleSetup onSuccess={() => window.location.reload()} />;
  return <ModernCycleTracking data={cycleData} />;
}

const steps = [
  'Chào mừng',
  'Ngày bắt đầu kỳ kinh',
  'Các kỳ kinh trước',
  'Thiết lập chu kỳ',
  'Xác nhận'
];

function FirstCycleSetup({ onSuccess }) {
  const [activeStep, setActiveStep] = useState(0);
  const [recentDate, setRecentDate] = useState('');
  const [historyDates, setHistoryDates] = useState(['']);
  const [cycleLength, setCycleLength] = useState(28);
  const [periodDuration, setPeriodDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleAddHistory = () => setHistoryDates([...historyDates, '']);
  const handleHistoryChange = (idx, value) => {
    const arr = [...historyDates];
    arr[idx] = value;
    setHistoryDates(arr);
  };

  const handleSubmit = async () => {
    setError('');
    if (!recentDate) {
      setError('Vui lòng nhập ngày bắt đầu kỳ kinh gần nhất!');
      setActiveStep(1);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        window.location.href = '/login';
        return;
      }
      
      // Tạo danh sách cycles để gửi
      const cycles = [];
      
      // Thêm kỳ kinh gần nhất
      cycles.push({
        startDate: recentDate,
        cycleLength: cycleLength,
        periodDuration: periodDuration
      });
      
      // Thêm các kỳ kinh trước đó
      historyDates.filter(d => d).forEach(date => {
        cycles.push({
          startDate: date,
          cycleLength: cycleLength,
          periodDuration: periodDuration
        });
      });
      
      const response = await fetch('/api/menstrual-cycle/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(cycles)
      });
      
      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Lỗi khi lưu dữ liệu!');
      }
    } catch (e) {
      setError('Lỗi khi lưu dữ liệu!');
    }
    setLoading(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5fafd'
      }}>
        <Paper elevation={8} sx={{
          maxWidth: 600,
          width: '100%',
          p: { xs: 2, sm: 6 },
          borderRadius: 6,
          bgcolor: '#fff',
          boxShadow: '0 16px 64px 0 rgba(143,92,247,0.18)',
          transition: 'box-shadow 0.3s cubic-bezier(.25,.8,.25,1)'
        }}>
          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              mb: 5,
              '& .MuiStepLabel-label': {
                fontSize: 20,
                fontWeight: 700,
                color: '#B39DDB',
                transition: 'color 0.2s'
              },
              '& .MuiStepIcon-root': {
                fontSize: 38,
                color: '#E1BEE7'
              },
              '& .Mui-active .MuiStepIcon-root': {
                color: '#8F5CF7'
              },
              '& .Mui-active .MuiStepLabel-label': {
                color: '#8F5CF7'
              },
              '& .Mui-completed .MuiStepIcon-root': {
                color: '#B39DDB'
              },
              '& .Mui-completed .MuiStepLabel-label': {
                color: '#B39DDB',
                fontWeight: 700
              },
              '& .MuiStepConnector-line': { borderColor: '#E1BEE7' }
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {activeStep === 0 && (
            <>
              <Typography variant="h3" fontWeight="bold" color="#8F5CF7" mb={2} align="center">
                Chào mừng bạn!
              </Typography>
              <Typography variant="h5" color="#B39DDB" mb={4} align="center" fontWeight={600}>
                Bắt đầu theo dõi chu kỳ kinh nguyệt
              </Typography>
              <Typography mb={4} color="#7C4DFF" align="center" fontSize={18}>
                Hãy nhập thông tin để hệ thống dự đoán và nhắc nhở chính xác hơn.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <Button variant="contained" sx={{
                  bgcolor: '#8F5CF7',
                  color: '#fff',
                  fontSize: 20,
                  fontWeight: 700,
                  borderRadius: 4,
                  px: 5,
                  py: 1.5,
                  boxShadow: '0 4px 24px 0 rgba(143,92,247,0.12)',
                  transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#651FFF', transform: 'scale(1.04)' }
                }} onClick={handleNext}>
                  Bắt đầu
                </Button>
              </Box>
            </>
          )}

          {activeStep === 1 && (
            <>
              <Typography fontWeight="bold" mb={3} color="#8F5CF7" align="center" fontSize={22}>
                Ngày bắt đầu kỳ kinh gần nhất của bạn là?
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Box
                  sx={{
                    border: '2px solid #8F5CF7',
                    borderRadius: 4,
                    p: 2,
                    bgcolor: '#fff',
                    boxShadow: '0 4px 24px 0 rgba(143,92,247,0.10)',
                    display: 'inline-block'
                  }}
                >
                  <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    value={recentDate ? dayjs(recentDate) : null}
                    onChange={val => setRecentDate(val ? val.format('YYYY-MM-DD') : '')}
                    format="DD/MM/YYYY"
                    slotProps={{
                      actionBar: { actions: [] },
                    }}
                    sx={{
                      '& .MuiPickersDay-root': {
                        color: '#8F5CF7',
                        '&.Mui-selected': {
                          backgroundColor: '#8F5CF7',
                        }
                      },
                      '& .MuiPickersDay-today': {
                        borderColor: '#8F5CF7'
                      },
                      '& .MuiPickersCalendarHeader-label': {
                        color: '#8F5CF7',
                        fontWeight: 700
                      },
                      '& .MuiPickersArrowSwitcher-root button': {
                        color: '#8F5CF7'
                      }
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack} sx={{ fontSize: 18 }}>Quay lại</Button>
                <Button variant="contained" sx={{
                  bgcolor: '#8F5CF7', color: '#fff', fontSize: 18, fontWeight: 700, borderRadius: 3, px: 4, py: 1.2,
                  boxShadow: '0 4px 16px 0 rgba(143,92,247,0.10)', transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#651FFF', transform: 'scale(1.04)' }
                }} onClick={handleNext} disabled={!recentDate}>
                  Tiếp tục
                </Button>
              </Box>
            </>
          )}

          {activeStep === 2 && (
            <>
              <Typography fontWeight="bold" mb={3} color="#8F5CF7" align="center" fontSize={22}>
                Bạn có nhớ các kỳ kinh trước không? (Không bắt buộc)
              </Typography>
              {historyDates.map((date, idx) => (
                <DatePicker
                  key={idx}
                  label={`Kỳ kinh trước #${idx + 1}`}
                  value={date ? dayjs(date) : null}
                  onChange={val => handleHistoryChange(idx, val ? val.format('YYYY-MM-DD') : '')}
                  format="DD/MM/YYYY"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        mb: 2,
                        bgcolor: '#fff',
                        borderRadius: 2,
                        fontSize: 18,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#8F5CF7'
                          },
                          '&:hover fieldset': {
                            borderColor: '#651FFF'
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#8F5CF7'
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#8F5CF7'
                        },
                        '& .MuiSvgIcon-root': {
                          color: '#8F5CF7'
                        }
                      }
                    }
                  }}
                />
              ))}
              <Button
                onClick={handleAddHistory}
                variant="outlined"
                sx={{
                  mb: 3,
                  color: '#8F5CF7',
                  borderColor: '#8F5CF7',
                  fontWeight: 600,
                  borderRadius: 2,
                  fontSize: 18,
                  px: 3,
                  '&:hover': { bgcolor: '#E1BEE7', borderColor: '#7C4DFF', color: '#7C4DFF' }
                }}
              >
                + Thêm kỳ kinh
              </Button>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack} sx={{ fontSize: 18 }}>Quay lại</Button>
                <Button variant="contained" sx={{
                  bgcolor: '#8F5CF7', color: '#fff', fontSize: 18, fontWeight: 700, borderRadius: 3, px: 4, py: 1.2,
                  boxShadow: '0 4px 16px 0 rgba(143,92,247,0.10)', transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#651FFF', transform: 'scale(1.04)' }
                }} onClick={handleNext}>
                  Tiếp tục
                </Button>
              </Box>
            </>
          )}

          {activeStep === 3 && (
            <>
              <Typography fontWeight="bold" mb={3} color="#8F5CF7" align="center" fontSize={22}>
                Thiết lập chu kỳ của bạn
              </Typography>
              <TextField
                label="Chu kỳ trung bình (ngày)"
                type="number"
                value={cycleLength}
                onChange={e => setCycleLength(e.target.value)}
                fullWidth
                sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2, fontSize: 18 }}
              />
              <TextField
                label="Số ngày hành kinh trung bình"
                type="number"
                value={periodDuration}
                onChange={e => setPeriodDuration(e.target.value)}
                fullWidth
                sx={{ mb: 3, bgcolor: '#fff', borderRadius: 2, fontSize: 18 }}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack} sx={{ fontSize: 18 }}>Quay lại</Button>
                <Button variant="contained" sx={{
                  bgcolor: '#8F5CF7', color: '#fff', fontSize: 18, fontWeight: 700, borderRadius: 3, px: 4, py: 1.2,
                  boxShadow: '0 4px 16px 0 rgba(143,92,247,0.10)', transition: 'all 0.2s',
                  '&:hover': { bgcolor: '#651FFF', transform: 'scale(1.04)' }
                }} onClick={handleNext}>
                  Tiếp tục
                </Button>
              </Box>
            </>
          )}

          {activeStep === 4 && (
            <>
              <Typography fontWeight="bold" mb={3} color="#8F5CF7" align="center" fontSize={22}>
                Xác nhận thông tin
              </Typography>
              <Typography mb={2} fontSize={18}>Ngày bắt đầu kỳ kinh gần nhất: <b>{recentDate}</b></Typography>
              <Typography mb={2} fontSize={18}>Các kỳ kinh trước: <b>{historyDates.filter(d => d).join(', ') || 'Không có'}</b></Typography>
              <Typography mb={2} fontSize={18}>Chu kỳ trung bình: <b>{cycleLength} ngày</b></Typography>
              <Typography mb={3} fontSize={18}>Số ngày hành kinh trung bình: <b>{periodDuration} ngày</b></Typography>
              {error && <Typography color="error" mb={2} align="center">{error}</Typography>}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button onClick={handleBack} sx={{ fontSize: 18 }}>Quay lại</Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{
                    ml: 2,
                    py: 1.5,
                    fontWeight: 700,
                    fontSize: 20,
                    borderRadius: 4,
                    bgcolor: '#8F5CF7',
                    color: '#fff',
                    boxShadow: '0 4px 24px 0 rgba(143,92,247,0.12)',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: '#651FFF', transform: 'scale(1.04)' }
                  }}
                >
                  {loading ? 'Đang lưu...' : 'Hoàn tất'}
                </Button>
              </Box>
            </>
          )}
        </Paper>
      </Box>
    </LocalizationProvider>
  );
}

// TODO: Bạn giữ nguyên hoặc import lại CycleDashboard như cũ ở đây
// import CycleDashboard from './CycleDashboard';
