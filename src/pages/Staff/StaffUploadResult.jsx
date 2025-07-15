import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { getAllBookingsForStaffAPI, markResultsReadyAPI } from '../../services/TestingService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const StaffUploadResult = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('SAMPLE_COLLECTED');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [resultFile, setResultFile] = useState(null);
  const [resultNotes, setResultNotes] = useState('');
  const [resultDate, setResultDate] = useState(
    format(new Date(), 'yyyy-MM-dd\'T\'HH:mm')
  );
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [searchTerm, statusFilter, dateFilter, bookings]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await getAllBookingsForStaffAPI();
      setBookings(response.data || []);
      setFilteredBookings(response.data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by search term (name or ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.bookingId?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((booking) => {
        const bookingDate = new Date(booking.appointmentDate).toISOString().split('T')[0];
        return bookingDate === dateFilter;
      });
    }

    setFilteredBookings(filtered);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type (PDF, DOC, DOCX, JPG, PNG)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        alert('Chỉ chấp nhận file PDF, DOC, DOCX, JPG, PNG');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Kích thước file không được vượt quá 10MB');
        return;
      }
      
      setResultFile(file);
    }
  };

  const handleUploadResult = async () => {
    if (!selectedBooking || !resultFile) {
      alert('Vui lòng chọn lịch hẹn và file kết quả');
      return;
    }

    setUploading(true);
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('resultFile', resultFile);
      formData.append('resultDate', resultDate);
      formData.append('notes', resultNotes);

      await markResultsReadyAPI(selectedBooking.bookingId, formData);
      
      // Update local state
      const updatedBookings = bookings.map(booking => 
        booking.bookingId === selectedBooking.bookingId 
          ? { ...booking, status: 'RESULTS_READY', resultDate, resultNotes, resultFile: resultFile.name } 
          : booking
      );
      
      setBookings(updatedBookings);
      setSelectedBooking(null);
      setResultFile(null);
      setResultNotes('');
      
      // Show success message
      alert('Đã upload kết quả xét nghiệm thành công!');
    } catch (err) {
      console.error('Error uploading result:', err);
      alert('Không thể upload kết quả xét nghiệm. Vui lòng thử lại sau.');
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  const formatTime = (dateString) => {
    try {
      return format(new Date(dateString), 'HH:mm', { locale: vi });
    } catch (error) {
      return 'Giờ không hợp lệ';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SAMPLE_COLLECTED':
        return 'bg-purple-100 text-purple-800';
      case 'RESULTS_READY':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'SAMPLE_COLLECTED':
        return 'Đã lấy mẫu';
      case 'RESULTS_READY':
        return 'Kết quả sẵn sàng';
      case 'COMPLETED':
        return 'Hoàn thành';
      default:
        return status;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Lỗi!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Nhập kết quả xét nghiệm</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc ID..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="SAMPLE_COLLECTED">Đã lấy mẫu</option>
              <option value="RESULTS_READY">Kết quả sẵn sàng</option>
            </select>
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Không tìm thấy lịch hẹn nào cần nhập kết quả.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-gray-50 rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Khách hàng
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dịch vụ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày lấy mẫu
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking) => (
                    <tr 
                      key={booking.bookingId} 
                      className={`hover:bg-gray-50 ${selectedBooking?.bookingId === booking.bookingId ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{booking.bookingId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.serviceName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {booking.sampleCollectionDate ? 
                          `${formatDate(booking.sampleCollectionDate)} ${formatTime(booking.sampleCollectionDate)}` : 
                          'Chưa lấy mẫu'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {booking.status === 'SAMPLE_COLLECTED' ? (
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Nhập kết quả
                          </button>
                        ) : booking.status === 'RESULTS_READY' ? (
                          <span className="text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Đã có kết quả
                          </span>
                        ) : (
                          <span className="text-gray-400">Chưa sẵn sàng</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upload Result Form */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {selectedBooking ? 'Nhập kết quả xét nghiệm' : 'Chọn lịch hẹn để nhập kết quả'}
          </h2>

          {selectedBooking ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Khách hàng:</span> {selectedBooking.customerName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Dịch vụ:</span> {selectedBooking.serviceName}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Ngày lấy mẫu:</span> {
                    selectedBooking.sampleCollectionDate ? 
                    formatDate(selectedBooking.sampleCollectionDate) : 
                    'Chưa có thông tin'
                  }
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày có kết quả
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500"
                  value={resultDate}
                  onChange={(e) => setResultDate(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  File kết quả xét nghiệm
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-pink-500">
                        <span>Chọn file</span>
                        <input 
                          id="file-upload" 
                          name="file-upload" 
                          type="file" 
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">hoặc kéo thả</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG tối đa 10MB
                    </p>
                  </div>
                </div>
                {resultFile && (
                  <div className="mt-2 p-2 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      <FileText className="inline h-4 w-4 mr-1" />
                      {resultFile.name} ({formatFileSize(resultFile.size)})
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú kết quả
                </label>
                <textarea
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Nhập ghi chú về kết quả xét nghiệm..."
                  value={resultNotes}
                  onChange={(e) => setResultNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleUploadResult}
                  disabled={uploading || !resultFile}
                  className="flex-1 bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    ) : (
                      <CheckCircle className="h-5 w-5 mr-2" />
                    )}
                    {uploading ? 'Đang upload...' : 'Xác nhận kết quả'}
                  </div>
                </button>
                <button
                  onClick={() => {
                    setSelectedBooking(null);
                    setResultFile(null);
                    setResultNotes('');
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-gray-500 text-center">Vui lòng chọn một lịch hẹn từ danh sách để nhập kết quả xét nghiệm</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffUploadResult;
