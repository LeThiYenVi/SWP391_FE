import React, { useState, useRef } from 'react';
import { Box, Modal, Typography, TextField, Button, MenuItem } from '@mui/material';
import { createTestingServiceAPI } from '../../services/TestingService';
import { toast } from 'react-toastify';

const categories = [
  { value: 'Nội tiết', label: 'Nội tiết' },
  { value: 'Tầm soát ung thư', label: 'Tầm soát ung thư' },
  { value: 'Hình ảnh học', label: 'Hình ảnh học' },
  { value: 'Khác', label: 'Khác' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function AddTestingServiceModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    serviceName: '',
    price: '',
    duration: '',
    description: '',
    preparation: '',
    category: '',
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // refs để focus vào trường lỗi đầu tiên
  const serviceNameRef = useRef();
  const priceRef = useRef();
  const durationRef = useRef();
  const categoryRef = useRef();

  const validate = () => {
    const newErrors = {};
    if (!form.serviceName.trim()) newErrors.serviceName = 'Vui lòng nhập tên dịch vụ.';
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) newErrors.price = 'Giá phải là số lớn hơn 0.';
    if (!form.duration || isNaN(form.duration) || !Number.isInteger(Number(form.duration)) || Number(form.duration) <= 0) newErrors.duration = 'Thời lượng phải là số nguyên dương.';
    if (!form.category) newErrors.category = 'Vui lòng chọn danh mục.';
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const focusFirstError = (errorObj) => {
    if (errorObj.serviceName && serviceNameRef.current) serviceNameRef.current.focus();
    else if (errorObj.price && priceRef.current) priceRef.current.focus();
    else if (errorObj.duration && durationRef.current) durationRef.current.focus();
    else if (errorObj.category && categoryRef.current) categoryRef.current.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      focusFirstError(newErrors);
      return;
    }
    setLoading(true);
    try {
      const payload = {
        serviceName: form.serviceName,
        price: parseFloat(form.price),
        durationMinutes: parseInt(form.duration, 10),
        description: form.description,
        preparation: form.preparation,
        category: form.category,
        isActive: form.isActive,
      };
      await createTestingServiceAPI(payload);
      toast.success('Thêm dịch vụ mới thành công!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error('Thêm dịch vụ thất bại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style} component="form" onSubmit={handleSubmit} autoComplete="off">
        <Typography variant="h6" mb={2} fontWeight={600}>
          Thêm dịch vụ xét nghiệm mới
        </Typography>
        <TextField
          label="Tên dịch vụ *"
          name="serviceName"
          value={form.serviceName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.serviceName}
          helperText={errors.serviceName}
          inputRef={serviceNameRef}
        />
        <TextField
          label="Giá (VND) *"
          name="price"
          value={form.price}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
          error={!!errors.price}
          helperText={errors.price}
          inputRef={priceRef}
          inputProps={{ min: 0, step: 1000 }}
        />
        <TextField
          label="Thời lượng (phút) *"
          name="duration"
          value={form.duration}
          onChange={handleChange}
          type="number"
          fullWidth
          margin="normal"
          error={!!errors.duration}
          helperText={errors.duration}
          inputRef={durationRef}
          inputProps={{ min: 1, step: 1 }}
        />
        <TextField
          label="Mô tả"
          name="description"
          value={form.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Chuẩn bị"
          name="preparation"
          value={form.preparation}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          select
          label="Danh mục *"
          name="category"
          value={form.category}
          onChange={handleChange}
          fullWidth
          margin="normal"
          error={!!errors.category}
          helperText={errors.category}
          inputRef={categoryRef}
        >
          {categories.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
          <Button onClick={onClose} disabled={loading} variant="outlined">Hủy</Button>
          <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: '#4CAF50' }}>
            Lưu
          </Button>
        </Box>
      </Box>
    </Modal>
  );
} 