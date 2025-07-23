import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button, MenuItem, Stack, Grid, Divider, Avatar } from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { createConsultantAPI } from '../../services/AdminService';
import { toast } from 'react-toastify';

const genders = [
  { value: 'MALE', label: 'Nam' },
  { value: 'FEMALE', label: 'Nữ' },
  { value: 'OTHER', label: 'Khác' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '98vw', sm: 540, md: 720 },
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: { xs: 2, sm: 4 },
  maxHeight: '95vh',
  overflowY: 'auto',
};

export default function AddConsultantModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
    dateOfBirth: '',
    address: '',
    gender: '',
    medicalHistory: '',
    biography: '',
    qualifications: '',
    experienceYears: '',
    specialization: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Vui lòng nhập username.';
    if (!form.email.trim()) newErrors.email = 'Vui lòng nhập email.';
    if (!form.password.trim()) newErrors.password = 'Vui lòng nhập mật khẩu.';
    if (!form.fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      let dateOfBirth = form.dateOfBirth;
      if (dateOfBirth) {
        // Nếu là yyyy-MM-dd thì giữ nguyên, nếu là mm/dd/yyyy thì chuyển đổi
        if (dateOfBirth.includes('/')) {
          const [mm, dd, yyyy] = dateOfBirth.split('/');
          dateOfBirth = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
        }
      }
      const payload = {
        ...form,
        dateOfBirth: dateOfBirth || undefined,
        experienceYears: form.experienceYears ? parseInt(form.experienceYears, 10) : undefined
      };
      await createConsultantAPI(payload);
      toast.success('Thêm tư vấn viên thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error('Thêm tư vấn viên thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit} autoComplete="off">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 1 }}>
            <PersonAddAlt1Icon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={700} color="primary.dark" align="center">
            Thêm tư vấn viên mới
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Điền đầy đủ thông tin để tạo tài khoản tư vấn viên
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3} justifyContent="center" alignItems="flex-start">
          {/* Thông tin cá nhân */}
          <Grid item xs={12} md={6}>
            <Box sx={{ px: { xs: 0, md: 2 } }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary" align="center">
                Thông tin cá nhân
              </Typography>
              <Stack spacing={2.2}>
                <TextField label="Username *" name="username" value={form.username} onChange={handleChange} fullWidth error={!!errors.username} helperText={errors.username} size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Email *" name="email" value={form.email} onChange={handleChange} fullWidth error={!!errors.email} helperText={errors.email} size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Mật khẩu *" name="password" type="password" value={form.password} onChange={handleChange} fullWidth error={!!errors.password} helperText={errors.password} size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Họ tên *" name="fullName" value={form.fullName} onChange={handleChange} fullWidth error={!!errors.fullName} helperText={errors.fullName} size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Số điện thoại" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Ngày sinh" name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true, style: { fontSize: 16 } }} size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} />
                <TextField label="Địa chỉ" name="address" value={form.address} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField select label="Giới tính" name="gender" value={form.gender} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }}>
                  {genders.map((option) => (
                    <MenuItem key={option.value} value={option.value} style={{ fontSize: 16 }}>{option.label}</MenuItem>
                  ))}
                </TextField>
                <TextField label="Tiền sử bệnh" name="medicalHistory" value={form.medicalHistory} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
              </Stack>
            </Box>
          </Grid>
          {/* Thông tin chuyên môn */}
          <Grid item xs={12} md={6}>
            <Box sx={{ px: { xs: 0, md: 2 } }}>
              <Typography variant="subtitle1" fontWeight={600} mb={1} color="primary" align="center">
                Thông tin chuyên môn
              </Typography>
              <Stack spacing={2.2}>
                <TextField label="Tiểu sử" name="biography" value={form.biography} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Bằng cấp" name="qualifications" value={form.qualifications} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Kinh nghiệm (năm)" name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
                <TextField label="Chuyên môn" name="specialization" value={form.specialization} onChange={handleChange} fullWidth size="medium" InputProps={{ style: { fontSize: 17, minHeight: 48 } }} InputLabelProps={{ style: { fontSize: 16 } }} />
              </Stack>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3 }} />
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} disabled={loading} variant="outlined" sx={{ minWidth: 100 }}>Hủy</Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#1976d2', minWidth: 120, fontWeight: 600, fontSize: 16 }}>
            Lưu
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 