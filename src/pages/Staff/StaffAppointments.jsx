import React, { useState, useEffect } from 'react';
import { Search, Filter, Calendar, Clock, User, ChevronDown, ChevronUp } from 'lucide-react';
import { getAllBookingsForStaffAPI, updateBookingStatusAPI } from '../../services/TestingService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const StaffAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedAppointment, setExpandedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, statusFilter, dateFilter, appointments]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await getAllBookingsForStaffAPI();
      setAppointments(response.data || []);
      setFilteredAppointments(response.data || []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Filter by search term (name or ID)
    if (searchTerm) {
      filtered = filtered.filter(
        (appointment) =>
          appointment.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appointment.bookingId?.toString().includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((appointment) => appointment.status === statusFilter);
    }

    // Filter by date
    if (dateFilter) {
      filtered = filtered.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0];
        return appointmentDate === dateFilter;
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await updateBookingStatusAPI(appointmentId, newStatus);
      // Update local state
      setAppointments(
        appointments.map((appointment) =>
          appointment.bookingId === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );
      // Show success message
      alert(`Trạng thái lịch hẹn đã được cập nhật thành ${newStatus}`);
    } catch (err) {
      console.error('Error updating appointment status:', err);
      alert('Không thể cập nhật trạng thái lịch hẹn. Vui lòng thử lại sau.');
    }
  };

  const toggleExpand = (appointmentId) => {
    if (expandedAppointment === appointmentId) {
      setExpandedAppointment(null);
    } else {
      setExpandedAppointment(appointmentId);
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
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'COMPLETED':
        return 'Hoàn thành';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
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
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý lịch xét nghiệm</h1>

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
              <option value="PENDING">Chờ xác nhận</option>
              <option value="CONFIRMED">Đã xác nhận</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
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

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Không tìm thấy lịch hẹn nào phù hợp với bộ lọc.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Khách hàng
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày hẹn
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dịch vụ
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
              {filteredAppointments.map((appointment) => (
                <React.Fragment key={appointment.bookingId}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{appointment.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(appointment.appointmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {appointment.serviceName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                        {getStatusText(appointment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleExpand(appointment.bookingId)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {expandedAppointment === appointment.bookingId ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedAppointment === appointment.bookingId && (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900">Thông tin chi tiết</h4>
                            <div className="mt-2 space-y-2">
                              <p className="text-sm text-gray-600 flex items-center">
                                <User className="h-4 w-4 mr-2" />
                                Khách hàng: {appointment.customerName}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                Ngày hẹn: {formatDate(appointment.appointmentDate)}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                Giờ hẹn: {formatTime(appointment.appointmentDate)}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">Cập nhật trạng thái</h4>
                            <div className="mt-2 space-x-2">
                              {appointment.status !== 'CONFIRMED' && (
                                <button
                                  onClick={() => handleStatusChange(appointment.bookingId, 'CONFIRMED')}
                                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                                >
                                  Xác nhận
                                </button>
                              )}
                              {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleStatusChange(appointment.bookingId, 'COMPLETED')}
                                  className="px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200"
                                >
                                  Hoàn thành
                                </button>
                              )}
                              {appointment.status !== 'CANCELLED' && (
                                <button
                                  onClick={() => handleStatusChange(appointment.bookingId, 'CANCELLED')}
                                  className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                                >
                                  Hủy
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffAppointments;
