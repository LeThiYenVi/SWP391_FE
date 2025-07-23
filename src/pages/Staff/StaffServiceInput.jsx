import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import { getTestingServicesAPI } from '../../services/TestingService';
import { createTestingServiceAPI, updateTestingServiceAPI, deleteTestingServiceAPI } from '../../services/AdminService';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const StaffServiceInput = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    isActive: true
  });
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [searchTerm, services]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await getTestingServicesAPI();
      setServices(response.data || []);
      setFilteredServices(response.data || []);
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    if (!searchTerm) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter(
      (service) =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredServices(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Tên dịch vụ không được để trống';
    if (!formData.description.trim()) errors.description = 'Mô tả không được để trống';
    if (!formData.price) errors.price = 'Giá không được để trống';
    else if (isNaN(formData.price) || Number(formData.price) <= 0) errors.price = 'Giá phải là số dương';
    if (!formData.duration) errors.duration = 'Thời gian không được để trống';
    else if (isNaN(formData.duration) || Number(formData.duration) <= 0) errors.duration = 'Thời gian phải là số dương';
    if (!formData.category.trim()) errors.category = 'Danh mục không được để trống';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddService = () => {
    setIsAddingService(true);
    setEditingServiceId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      isActive: true
    });
    setFormErrors({});
    setSuccessMessage('');
  };

  const handleEditService = (service) => {
    setIsAddingService(false);
    setEditingServiceId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString(),
      category: service.category,
      isActive: service.isActive
    });
    setFormErrors({});
    setSuccessMessage('');
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này không?')) {
      return;
    }

    try {
      await deleteTestingServiceAPI(serviceId);
      setServices(services.filter(service => service.id !== serviceId));
      setSuccessMessage('Xóa dịch vụ thành công');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting service:', err);
      setError('Không thể xóa dịch vụ. Vui lòng thử lại sau.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const serviceData = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration)
      };

      let response;
      if (isAddingService) {
        response = await createTestingServiceAPI(serviceData);
        setServices([...services, response.data]);
        setSuccessMessage('Thêm dịch vụ mới thành công');
      } else {
        response = await updateTestingServiceAPI(editingServiceId, serviceData);
        setServices(services.map(service => 
          service.id === editingServiceId ? response.data : service
        ));
        setSuccessMessage('Cập nhật dịch vụ thành công');
      }

      // Reset form
      setIsAddingService(false);
      setEditingServiceId(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
        isActive: true
      });

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving service:', err);
      setError(isAddingService ? 'Không thể thêm dịch vụ mới' : 'Không thể cập nhật dịch vụ');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleCancel = () => {
    setIsAddingService(false);
    setEditingServiceId(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      duration: '',
      category: '',
      isActive: true
    });
    setFormErrors({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
    } catch (error) {
      return 'Ngày không hợp lệ';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý dịch vụ xét nghiệm</h1>

      {/* Success message */}
      {successMessage && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Search and Add button */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm dịch vụ..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-pink-500 focus:border-pink-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={handleAddService}
          className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center justify-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Thêm dịch vụ mới
        </button>
      </div>

      {/* Form for adding/editing service */}
      {(isAddingService || editingServiceId) && (
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            {isAddingService ? 'Thêm dịch vụ mới' : 'Chỉnh sửa dịch vụ'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên dịch vụ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500`}
                />
                {formErrors.name && <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.category ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500`}
                />
                {formErrors.category && <p className="mt-1 text-sm text-red-500">{formErrors.category}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá (VNĐ) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500`}
                />
                {formErrors.price && <p className="mt-1 text-sm text-red-500">{formErrors.price}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thời gian (phút) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.duration ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500`}
                />
                {formErrors.duration && <p className="mt-1 text-sm text-red-500">{formErrors.duration}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  className={`w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-2 focus:ring-pink-500 focus:border-pink-500`}
                ></textarea>
                {formErrors.description && <p className="mt-1 text-sm text-red-500">{formErrors.description}</p>}
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dịch vụ đang hoạt động</span>
                </label>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 flex items-center"
              >
                <X className="h-5 w-5 mr-1" />
                Hủy
              </button>
              <button
                type="submit"
                className="bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 flex items-center"
              >
                <Save className="h-5 w-5 mr-1" />
                {isAddingService ? 'Thêm dịch vụ' : 'Lưu thay đổi'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Services List */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">Không tìm thấy dịch vụ nào.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên dịch vụ
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Danh mục
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thời gian
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.category}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(service.price)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{service.duration} phút</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{formatDate(service.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffServiceInput;
