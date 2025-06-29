import {
  Box,
  Button,
  TextField,
  IconButton,
  InputAdornment,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useEffect, useState } from 'react';

export default function ChangePasswordDialog({ open, onClose, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
      confirmPassword: formData.newPasswordConfirm,
    });
  };

  useEffect(() => {
    if (open) {
      setFormData({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: '',
      });
    }
  }, [open]);

  const passwordFieldProps = {
    type: showPassword ? 'text' : 'password',
    fullWidth: true,
    margin: 'dense',
    required: true,
    InputProps: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton onClick={togglePasswordVisibility} edge="end" sx={{ color: '#3F5139' }}>
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </InputAdornment>
      ),
    },
    sx: {
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: '#ccc',
        },
        '&:hover fieldset': {
          borderColor: '#3F5139',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#3F5139',
        },
      },
      '& label.Mui-focused': {
        color: '#3F5139',
      },
      input: { color: '#3F5139' },
      mb: 2, 
    },
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ bgcolor: '#3F5139', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
        Đổi mật khẩu
      </DialogTitle>
      <DialogContent sx={{ bgcolor: '#f5f5f5', pb: 3, pt: 2, px: 4 }}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            label="Mật khẩu hiện tại"
            value={formData.oldPassword}
            onChange={handleChange('oldPassword')}
            {...passwordFieldProps}
          />
          <TextField
            label="Mật khẩu mới"
            value={formData.newPassword}
            onChange={handleChange('newPassword')}
            {...passwordFieldProps}
          />
          <TextField
            label="Xác nhận mật khẩu mới"
            value={formData.newPasswordConfirm}
            onChange={handleChange('newPasswordConfirm')}
            {...passwordFieldProps}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 5,
              bgcolor: '#4e5c47',
              textTransform: 'none',
              fontWeight: '600',
              fontSize: '1rem',
              py: 1.5,
              borderRadius: 2,
              ':hover': { bgcolor: '#3d4a38' },
            }}
          >
            Xác nhận
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
