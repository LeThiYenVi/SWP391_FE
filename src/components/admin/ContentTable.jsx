import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ImageIcon from '@mui/icons-material/Image';
import ArticleIcon from '@mui/icons-material/Article';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AnnouncementIcon from '@mui/icons-material/Announcement';

const ContentTable = ({ searchTerm }) => {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    type: 'article',
    status: 'draft',
  });

  const pageSize = 10;

  // Mock data for content management
  const mockContents = [
    {
      id: 1,
      title: 'Hướng dẫn xét nghiệm máu',
      content: 'Nội dung hướng dẫn chi tiết về quy trình xét nghiệm máu bao gồm chuẩn bị trước xét nghiệm, quy trình thực hiện và đọc kết quả...',
      type: 'article',
      status: 'published',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      views: 1250,
      thumbnail: 'https://via.placeholder.com/60x60'
    },
    {
      id: 2,
      title: 'Video: Cách chuẩn bị trước xét nghiệm',
      content: 'Video hướng dẫn cách chuẩn bị trước khi đi xét nghiệm, bao gồm việc nhịn ăn, uống nước và các lưu ý quan trọng...',
      type: 'video',
      status: 'published',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      views: 890,
      thumbnail: 'https://via.placeholder.com/60x60'
    },
    {
      id: 3,
      title: 'Infographic: Các loại xét nghiệm phổ biến',
      content: 'Hình ảnh minh họa các loại xét nghiệm thường gặp trong chăm sóc sức khỏe sinh sản và giới tính...',
      type: 'image',
      status: 'draft',
      createdAt: '2024-01-12',
      updatedAt: '2024-01-22',
      views: 456,
      thumbnail: 'https://via.placeholder.com/60x60'
    },
    {
      id: 4,
      title: 'Thông báo: Lịch nghỉ lễ 30/4',
      content: 'Thông báo lịch nghỉ lễ và điều chỉnh lịch làm việc trong dịp lễ 30/4 và 1/5...',
      type: 'announcement',
      status: 'published',
      createdAt: '2024-01-08',
      updatedAt: '2024-01-25',
      views: 2100,
      thumbnail: 'https://via.placeholder.com/60x60'
    },
    {
      id: 5,
      title: 'FAQ: Câu hỏi thường gặp về xét nghiệm',
      content: 'Tổng hợp các câu hỏi thường gặp và câu trả lời chi tiết về các dịch vụ xét nghiệm...',
      type: 'article',
      status: 'review',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-28',
      views: 678,
      thumbnail: 'https://via.placeholder.com/60x60'
    },
    {
      id: 6,
      title: 'Tầm quan trọng của xét nghiệm định kỳ',
      content: 'Bài viết về tầm quan trọng của việc xét nghiệm định kỳ trong việc phát hiện sớm các bệnh lý...',
      type: 'article',
      status: 'published',
      createdAt: '2024-01-03',
      updatedAt: '2024-01-30',
      views: 1456,
      thumbnail: 'https://via.placeholder.com/60x60'
    },
    {
      id: 7,
      title: 'Hướng dẫn đọc kết quả xét nghiệm',
      content: 'Video hướng dẫn cách đọc và hiểu các chỉ số trong kết quả xét nghiệm...',
      type: 'video',
      status: 'draft',
      createdAt: '2024-01-01',
      updatedAt: '2024-02-01',
      views: 234,
      thumbnail: 'https://via.placeholder.com/60x60'
    }
  ];

  useEffect(() => {
    setContents(mockContents);
    setFilteredContents(mockContents);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const filtered = contents.filter(content =>
      content.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.content.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContents(filtered);
    setPage(1); // Reset to first page when search changes
  }, [searchTerm, contents]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'review': return 'info';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return 'Đã xuất bản';
      case 'draft': return 'Bản nháp';
      case 'review': return 'Đang duyệt';
      case 'archived': return 'Lưu trữ';
      default: return status;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'article': return <ArticleIcon />;
      case 'video': return <VideoLibraryIcon />;
      case 'image': return <ImageIcon />;
      case 'announcement': return <AnnouncementIcon />;
      default: return <ArticleIcon />;
    }
  };

  const getTypeText = (type) => {
    switch (type) {
      case 'article': return 'Bài viết';
      case 'video': return 'Video';
      case 'image': return 'Hình ảnh';
      case 'announcement': return 'Thông báo';
      default: return type;
    }
  };

  const handleEdit = (content) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      content: content.content,
      type: content.type,
      status: content.status,
    });
    setOpenDialog(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nội dung này?')) {
      setContents(contents.filter(content => content.id !== id));
    }
  };

  const handleView = (id) => {
    console.log('Xem chi tiết nội dung ID:', id);
    // TODO: Implement view details functionality
  };

  const handleSave = () => {
    if (editingContent) {
      // Update existing content
      setContents(contents.map(content =>
        content.id === editingContent.id
          ? { ...content, ...formData, updatedAt: new Date().toISOString().split('T')[0] }
          : content
      ));
    } else {
      // Add new content
      const newContent = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
        views: 0,
        thumbnail: 'https://via.placeholder.com/60x60'
      };
      setContents([newContent, ...contents]);
    }
    setOpenDialog(false);
    setEditingContent(null);
    setFormData({
      title: '',
      content: '',
      type: 'article',
      status: 'draft',
    });
  };

  const paginatedData = filteredContents.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const totalPages = Math.ceil(filteredContents.length / pageSize);

  return (
    <Box>
      <TableContainer component={Paper} sx={{ borderRadius: '12px', overflow: 'hidden', maxHeight: 600 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 60 }}>STT</TableCell>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 80 }}>Thumbnail</TableCell>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 250 }}>Tiêu đề</TableCell>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 120 }}>Loại</TableCell>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 120 }}>Trạng thái</TableCell>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 100 }}>Lượt xem</TableCell>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 100 }}>Cập nhật</TableCell>
              <TableCell sx={{ bgcolor: '#607d8b', color: 'white', fontWeight: 'bold', minWidth: 120 }}>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((content, index) => (
              <TableRow 
                key={content.id} 
                hover
                sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}
              >
                <TableCell>{(page - 1) * pageSize + index + 1}</TableCell>
                <TableCell>
                  <Avatar
                    src={content.thumbnail}
                    sx={{ width: 40, height: 40 }}
                    variant="rounded"
                  >
                    {getTypeIcon(content.type)}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 500, mb: 0.5 }}>
                      {content.title}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color="text.secondary"
                      sx={{ 
                        display: 'block',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: 200
                      }}
                    >
                      {content.content.substring(0, 50)}...
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {getTypeIcon(content.type)}
                    <Typography variant="body2">
                      {getTypeText(content.type)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(content.status)}
                    color={getStatusColor(content.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {content.views.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {content.updatedAt}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      color="info"
                      onClick={() => handleView(content.id)}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEdit(content)}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete(content.id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, newPage) => setPage(newPage)}
            color="primary"
            size="medium"
          />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingContent ? 'Chỉnh sửa nội dung' : 'Thêm nội dung mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Tiêu đề"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              fullWidth
              required
            />
            <TextField
              label="Nội dung"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              multiline
              rows={4}
              fullWidth
              required
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Loại nội dung</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  label="Loại nội dung"
                >
                  <MenuItem value="article">Bài viết</MenuItem>
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="image">Hình ảnh</MenuItem>
                  <MenuItem value="announcement">Thông báo</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  label="Trạng thái"
                >
                  <MenuItem value="draft">Bản nháp</MenuItem>
                  <MenuItem value="review">Đang duyệt</MenuItem>
                  <MenuItem value="published">Đã xuất bản</MenuItem>
                  <MenuItem value="archived">Lưu trữ</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            disabled={!formData.title || !formData.content}
          >
            {editingContent ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ContentTable;
