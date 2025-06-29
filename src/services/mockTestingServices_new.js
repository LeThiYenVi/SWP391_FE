// Mock API cho dịch vụ xét nghiệm chăm sóc sức khỏe sinh sản và giới tính
export const mockTestingServicesData = [
  {
    id: 'XN001',
    name: 'Xét nghiệm hormone nữ tổng quát',
    code: 'HN001',
    price: 480000,
    category: 'Nội tiết tố nữ',
    description: 'Bộ xét nghiệm đánh giá toàn diện hormone nữ giới bao gồm Estrogen, Progesterone, LH, FSH',
    duration: '2-3 ngày',
    preparationRequired: 'Nhịn ăn 8-12 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T08:30:00Z',
    updatedAt: '2024-01-15T08:30:00Z'
  },
  {
    id: 'XN002',
    name: 'Xét nghiệm hormone nam tổng quát',
    code: 'HN002',
    price: 420000,
    category: 'Nội tiết tố nam',
    description: 'Bộ xét nghiệm đánh giá toàn diện hormone nam giới bao gồm Testosterone, LH, FSH, Prolactin',
    duration: '2-3 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T08:35:00Z',
    updatedAt: '2024-01-15T08:35:00Z'
  },
  {
    id: 'XN003',
    name: 'Siêu âm tử cung buồng trứng',
    code: 'SA003',
    price: 180000,
    category: 'Hình ảnh học',
    description: 'Siêu âm kiểm tra tình trạng tử cung, buồng trứng và phát hiện bất thường',
    duration: '30 phút',
    preparationRequired: 'Bàng quang đầy nước',
    sampleType: 'Không cần mẫu',
    status: 'active',
    createdAt: '2024-01-15T08:40:00Z',
    updatedAt: '2024-01-15T08:40:00Z'
  },
  {
    id: 'XN004',
    name: 'Xét nghiệm PAP smear',
    code: 'CS004',
    price: 150000,
    category: 'Tầm soát ung thư',
    description: 'Xét nghiệm tầm soát ung thư cổ tử cung bằng phương pháp Pap smear',
    duration: '3-5 ngày',
    preparationRequired: 'Không quan hệ tình dục 24h trước',
    sampleType: 'Tế bào cổ tử cung',
    status: 'active',
    createdAt: '2024-01-15T08:45:00Z',
    updatedAt: '2024-01-15T08:45:00Z'
  },
  {
    id: 'XN005',
    name: 'Xét nghiệm HPV',
    code: 'VR005',
    price: 450000,
    category: 'Vi sinh vật',
    description: 'Xét nghiệm virus HPV gây ung thư cổ tử cung bằng phương pháp PCR',
    duration: '5-7 ngày',
    preparationRequired: 'Không quan hệ tình dục 48h trước',
    sampleType: 'Dịch cổ tử cung',
    status: 'active',
    createdAt: '2024-01-15T08:50:00Z',
    updatedAt: '2024-01-15T08:50:00Z'
  },
  {
    id: 'XN006',
    name: 'Đo mật độ xương',
    code: 'XQ006',
    price: 320000,
    category: 'Xương khớp',
    description: 'Đánh giá mật độ xương phát hiện loãng xương liên quan đến thiếu hụt hormone',
    duration: '45 phút',
    preparationRequired: 'Không dùng thuốc bổ sung canxi 24h trước',
    sampleType: 'Không cần mẫu',
    status: 'active',
    createdAt: '2024-01-15T08:55:00Z',
    updatedAt: '2024-01-15T08:55:00Z'
  },
  {
    id: 'XN007',
    name: 'Xét nghiệm chức năng tuyến giáp',
    code: 'TG007',
    price: 250000,
    category: 'Nội tiết',
    description: 'Kiểm tra TSH, T3, T4 đánh giá chức năng tuyến giáp ảnh hưởng đến sinh sản',
    duration: '1-2 ngày',
    preparationRequired: 'Nhịn ăn 8 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'XN008',
    name: 'Xét nghiệm đường huyết và insulin',
    code: 'DH008',
    price: 120000,
    category: 'Chuyển hóa',
    description: 'Đánh giá đường huyết và kháng insulin ảnh hưởng đến hormone sinh sản',
    duration: '1 ngày',
    preparationRequired: 'Nhịn ăn 10-12 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:05:00Z',
    updatedAt: '2024-01-15T09:05:00Z'
  },
  {
    id: 'XN009',
    name: 'Xét nghiệm vitamin D',
    code: 'VT009',
    price: 180000,
    category: 'Vitamin',
    description: 'Đo nồng độ vitamin D ảnh hưởng đến hormone và sức khỏe sinh sản',
    duration: '2-3 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:10:00Z',
    updatedAt: '2024-01-15T09:10:00Z'
  },
  {
    id: 'XN010',
    name: 'Xét nghiệm sắt huyết thanh',
    code: 'ST010',
    price: 95000,
    category: 'Khoáng chất',
    description: 'Kiểm tra thiếu máu do thiếu sắt ảnh hưởng đến chu kỳ kinh nguyệt',
    duration: '1 ngày',
    preparationRequired: 'Nhịn ăn 8 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 'XN011',
    name: 'Xét nghiệm chức năng gan',
    code: 'CG011',
    price: 140000,
    category: 'Chức năng cơ quan',
    description: 'Đánh giá chức năng gan trong việc xử lý và chuyển hóa hormone',
    duration: '1 ngày',
    preparationRequired: 'Nhịn ăn 8-12 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:20:00Z',
    updatedAt: '2024-01-15T09:20:00Z'
  },
  {
    id: 'XN012',
    name: 'Xét nghiệm chức năng thận',
    code: 'CT012',
    price: 110000,
    category: 'Chức năng cơ quan',
    description: 'Kiểm tra chức năng thận và cân bằng nước muối ảnh hưởng đến hormone',
    duration: '1 ngày',
    preparationRequired: 'Uống đủ nước',
    sampleType: 'Máu và nước tiểu',
    status: 'active',
    createdAt: '2024-01-15T09:25:00Z',
    updatedAt: '2024-01-15T09:25:00Z'
  },
  {
    id: 'XN013',
    name: 'Xét nghiệm AMH',
    code: 'AM013',
    price: 380000,
    category: 'Sinh sản',
    description: 'Đánh giá dự trữ buồng trứng qua hormone Anti-Müllerian',
    duration: '3-5 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:30:00Z',
    updatedAt: '2024-01-15T09:30:00Z'
  },
  {
    id: 'XN014',
    name: 'Xét nghiệm tinh dịch đồ',
    code: 'TD014',
    price: 220000,
    category: 'Sinh sản',
    description: 'Phân tích tinh dịch đánh giá khả năng sinh sản nam giới',
    duration: '2-3 ngày',
    preparationRequired: 'Kiêng quan hệ 2-5 ngày',
    sampleType: 'Tinh dịch',
    status: 'active',
    createdAt: '2024-01-15T09:35:00Z',
    updatedAt: '2024-01-15T09:35:00Z'
  },
  {
    id: 'XN015',
    name: 'Xét nghiệm nhiễm trùng sinh dục',
    code: 'NT015',
    price: 280000,
    category: 'Vi sinh vật',
    description: 'Tầm soát các bệnh nhiễm trùng đường sinh dục phổ biến',
    duration: '3-5 ngày',
    preparationRequired: 'Không dùng kháng sinh 1 tuần trước',
    sampleType: 'Dịch âm đạo/niệu đạo',
    status: 'active',
    createdAt: '2024-01-15T09:40:00Z',
    updatedAt: '2024-01-15T09:40:00Z'
  },
  {
    id: 'XN016',
    name: 'Xét nghiệm HIV',
    code: 'HV016',
    price: 150000,
    category: 'Vi sinh vật',
    description: 'Tầm soát virus HIV bằng phương pháp ELISA và khẳng định Western Blot',
    duration: '1-2 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:45:00Z',
    updatedAt: '2024-01-15T09:45:00Z'
  },
  {
    id: 'XN017',
    name: 'Xét nghiệm Hepatitis B',
    code: 'HB017',
    price: 180000,
    category: 'Vi sinh vật',
    description: 'Tầm soát viêm gan B quan trọng trong mang thai và quan hệ tình dục',
    duration: '1-2 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:50:00Z',
    updatedAt: '2024-01-15T09:50:00Z'
  },
  {
    id: 'XN018',
    name: 'Xét nghiệm Syphilis',
    code: 'SY018',
    price: 120000,
    category: 'Vi sinh vật',
    description: 'Tầm soát bệnh giang mai bằng các xét nghiệm huyết thanh học',
    duration: '1-2 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T09:55:00Z',
    updatedAt: '2024-01-15T09:55:00Z'
  },
  {
    id: 'XN019',
    name: 'Xét nghiệm Herpes simplex',
    code: 'HS019',
    price: 200000,
    category: 'Vi sinh vật',
    description: 'Phát hiện virus Herpes simplex type 1 và 2 gây nhiễm trùng sinh dục',
    duration: '2-3 ngày',
    preparationRequired: 'Không dùng thuốc kháng virus 1 tuần trước',
    sampleType: 'Dịch vết thương/máu',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 'XN020',
    name: 'Xét nghiệm Chlamydia',
    code: 'CL020',
    price: 160000,
    category: 'Vi sinh vật',
    description: 'Phát hiện vi khuẩn Chlamydia trachomatis gây nhiễm trùng đường sinh dục',
    duration: '2-3 ngày',
    preparationRequired: 'Không dùng kháng sinh 1 tuần trước',
    sampleType: 'Dịch niệu đạo/cổ tử cung',
    status: 'active',
    createdAt: '2024-01-15T10:05:00Z',
    updatedAt: '2024-01-15T10:05:00Z'
  },
  {
    id: 'XN021',
    name: 'Xét nghiệm Gonorrhea',
    code: 'GN021',
    price: 140000,
    category: 'Vi sinh vật',
    description: 'Phát hiện vi khuẩn Neisseria gonorrhoeae gây bệnh lậu',
    duration: '2-3 ngày',
    preparationRequired: 'Không dùng kháng sinh 1 tuần trước',
    sampleType: 'Dịch niệu đạo/cổ tử cung',
    status: 'active',
    createdAt: '2024-01-15T10:10:00Z',
    updatedAt: '2024-01-15T10:10:00Z'
  },
  {
    id: 'XN022',
    name: 'Xét nghiệm Prolactin',
    code: 'PR022',
    price: 130000,
    category: 'Nội tiết tố',
    description: 'Đo nồng độ hormone Prolactin ảnh hưởng đến chu kỳ kinh nguyệt',
    duration: '1-2 ngày',
    preparationRequired: 'Nghỉ ngơi 30 phút trước lấy máu',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-15T10:15:00Z'
  },
  {
    id: 'XN023',
    name: 'Xét nghiệm Cortisol',
    code: 'CO023',
    price: 165000,
    category: 'Nội tiết tố',
    description: 'Đánh giá hormone stress Cortisol ảnh hưởng đến sinh sản',
    duration: '1-2 ngày',
    preparationRequired: 'Lấy máu vào buổi sáng 7-9h',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:20:00Z',
    updatedAt: '2024-01-15T10:20:00Z'
  },
  {
    id: 'XN024',
    name: 'Xét nghiệm DHEA-S',
    code: 'DH024',
    price: 175000,
    category: 'Nội tiết tố',
    description: 'Đo hormone DHEA-S liên quan đến rối loạn hormone ở phụ nữ',
    duration: '2-3 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:25:00Z',
    updatedAt: '2024-01-15T10:25:00Z'
  },
  {
    id: 'XN025',
    name: 'Xét nghiệm 17-OH Progesterone',
    code: 'OH025',
    price: 190000,
    category: 'Nội tiết tố',
    description: 'Chẩn đoán tăng sản thượng thận bẩm sinh ảnh hưởng đến sinh sản',
    duration: '2-3 ngày',
    preparationRequired: 'Lấy máu vào buổi sáng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'XN026',
    name: 'Xét nghiệm Androstenedione',
    code: 'AN026',
    price: 185000,
    category: 'Nội tiết tố',
    description: 'Đánh giá hormone nam liên quan đến hội chứng buồng trứng đa nang',
    duration: '2-3 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:35:00Z',
    updatedAt: '2024-01-15T10:35:00Z'
  },
  {
    id: 'XN027',
    name: 'Xét nghiệm SHBG',
    code: 'SH027',
    price: 155000,
    category: 'Nội tiết tố',
    description: 'Đo protein liên kết hormone giới tính đánh giá hormone tự do',
    duration: '2-3 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:40:00Z',
    updatedAt: '2024-01-15T10:40:00Z'
  },
  {
    id: 'XN028',
    name: 'Xét nghiệm Beta hCG',
    code: 'BH028',
    price: 85000,
    category: 'Sinh sản',
    description: 'Xét nghiệm thai định lượng hormone beta hCG trong máu',
    duration: '1 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:45:00Z',
    updatedAt: '2024-01-15T10:45:00Z'
  },
  {
    id: 'XN029',
    name: 'Xét nghiệm Inhibin B',
    code: 'IB029',
    price: 320000,
    category: 'Sinh sản',
    description: 'Đánh giá chức năng tế bào Sertoli và khả năng sinh sản nam',
    duration: '5-7 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:50:00Z',
    updatedAt: '2024-01-15T10:50:00Z'
  },
  {
    id: 'XN030',
    name: 'Xét nghiệm Homocysteine',
    code: 'HC030',
    price: 145000,
    category: 'Chuyển hóa',
    description: 'Đánh giá nguy cơ sảy thai và biến chứng thai kỳ',
    duration: '2-3 ngày',
    preparationRequired: 'Nhịn ăn 12 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T10:55:00Z',
    updatedAt: '2024-01-15T10:55:00Z'
  },
  {
    id: 'XN031',
    name: 'Xét nghiệm Folic Acid',
    code: 'FA031',
    price: 125000,
    category: 'Vitamin',
    description: 'Đo nồng độ acid folic quan trọng trong thai kỳ và sinh sản',
    duration: '2-3 ngày',
    preparationRequired: 'Nhịn ăn 8 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T11:00:00Z',
    updatedAt: '2024-01-15T11:00:00Z'
  },
  {
    id: 'XN032',
    name: 'Xét nghiệm Vitamin B12',
    code: 'VB032',
    price: 135000,
    category: 'Vitamin',
    description: 'Đánh giá thiếu hụt vitamin B12 ảnh hưởng đến thần kinh và sinh sản',
    duration: '2-3 ngày',
    preparationRequired: 'Nhịn ăn 8 tiếng',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T11:05:00Z',
    updatedAt: '2024-01-15T11:05:00Z'
  },
  {
    id: 'XN033',
    name: 'Xét nghiệm karyotype',
    code: 'KT033',
    price: 850000,
    category: 'Di truyền',
    description: 'Phân tích nhiễm sắc thể phát hiện bất thường di truyền ảnh hưởng sinh sản',
    duration: '14-21 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T11:10:00Z',
    updatedAt: '2024-01-15T11:10:00Z'
  },
  {
    id: 'XN034',
    name: 'Xét nghiệm đột biến gen MTHFR',
    code: 'MT034',
    price: 650000,
    category: 'Di truyền',
    description: 'Phát hiện đột biến gen MTHFR liên quan đến sảy thai và dị tật thai',
    duration: '7-10 ngày',
    preparationRequired: 'Không cần chuẩn bị đặc biệt',
    sampleType: 'Máu tĩnh mạch',
    status: 'active',
    createdAt: '2024-01-15T11:15:00Z',
    updatedAt: '2024-01-15T11:15:00Z'
  },
  {
    id: 'XN035',
    name: 'Xét nghiệm fragmentation DNA tinh trùng',
    code: 'FD035',
    price: 950000,
    category: 'Sinh sản',
    description: 'Đánh giá mức độ phân mảnh DNA tinh trùng ảnh hưởng đến thụ tinh',
    duration: '5-7 ngày',
    preparationRequired: 'Kiêng quan hệ 2-5 ngày',
    sampleType: 'Tinh dịch',
    status: 'active',
    createdAt: '2024-01-15T11:20:00Z',
    updatedAt: '2024-01-15T11:20:00Z'
  }
];

// Mock API function để lấy tất cả dịch vụ xét nghiệm
export const getAllTestingServicesAPI = async (page = 1, limit = 10) => {
  // Mô phỏng độ trễ API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = mockTestingServicesData.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      totalCount: mockTestingServicesData.length,
      totalPages: Math.ceil(mockTestingServicesData.length / limit),
      currentPage: page,
      pageSize: limit
    },
    status: 200,
    message: 'Lấy danh sách dịch vụ thành công'
  };
};

// Mock API function để lấy dịch vụ theo ID
export const getTestingServiceByIdAPI = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const service = mockTestingServicesData.find(item => item.id === id);
  
  if (!service) {
    return {
      data: null,
      status: 404,
      message: 'Không tìm thấy dịch vụ'
    };
  }
  
  return {
    data: service,
    status: 200,
    message: 'Lấy thông tin dịch vụ thành công'
  };
};

// Mock API function để tìm kiếm dịch vụ
export const searchTestingServicesAPI = async (searchTerm, category = '', page = 1, limit = 10) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  
  let filteredServices = mockTestingServicesData;
  
  // Lọc theo từ khóa tìm kiếm
  if (searchTerm) {
    filteredServices = filteredServices.filter(service =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Lọc theo danh mục
  if (category) {
    filteredServices = filteredServices.filter(service =>
      service.category === category
    );
  }
  
  // Phân trang
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = filteredServices.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      totalCount: filteredServices.length,
      totalPages: Math.ceil(filteredServices.length / limit),
      currentPage: page,
      pageSize: limit,
      searchTerm: searchTerm,
      category: category
    },
    status: 200,
    message: `Tìm thấy ${filteredServices.length} kết quả`
  };
};

// Mock API function để thêm dịch vụ mới
export const addTestingServiceAPI = async (serviceData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const newService = {
    id: `XN${String(mockTestingServicesData.length + 1).padStart(3, '0')}`,
    ...serviceData,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  mockTestingServicesData.push(newService);
  
  return {
    data: newService,
    status: 201,
    message: 'Thêm dịch vụ thành công'
  };
};

// Mock API function để cập nhật dịch vụ
export const updateTestingServiceAPI = async (id, serviceData) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const serviceIndex = mockTestingServicesData.findIndex(item => item.id === id);
  
  if (serviceIndex === -1) {
    return {
      data: null,
      status: 404,
      message: 'Không tìm thấy dịch vụ để cập nhật'
    };
  }
  
  mockTestingServicesData[serviceIndex] = {
    ...mockTestingServicesData[serviceIndex],
    ...serviceData,
    updatedAt: new Date().toISOString()
  };
  
  return {
    data: mockTestingServicesData[serviceIndex],
    status: 200,
    message: 'Cập nhật dịch vụ thành công'
  };
};

// Mock API function để xóa dịch vụ
export const deleteTestingServiceAPI = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const serviceIndex = mockTestingServicesData.findIndex(item => item.id === id);
  
  if (serviceIndex === -1) {
    return {
      data: null,
      status: 404,
      message: 'Không tìm thấy dịch vụ để xóa'
    };
  }
  
  // Thay vì xóa hoàn toàn, có thể chuyển trạng thái thành 'inactive'
  mockTestingServicesData[serviceIndex].status = 'inactive';
  mockTestingServicesData[serviceIndex].updatedAt = new Date().toISOString();
  
  return {
    data: mockTestingServicesData[serviceIndex],
    status: 200,
    message: 'Vô hiệu hóa dịch vụ thành công'
  };
};

// Mock API function để lấy thống kê dịch vụ
export const getTestingServicesStatsAPI = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const activeServices = mockTestingServicesData.filter(s => s.status === 'active');
  
  const stats = {
    totalServices: activeServices.length,
    totalInactiveServices: mockTestingServicesData.length - activeServices.length,
    categories: {},
    averagePrice: 0,
    priceRange: {
      min: Math.min(...activeServices.map(s => s.price)),
      max: Math.max(...activeServices.map(s => s.price))
    },
    sampleTypes: {},
    averageDuration: {}
  };
  
  // Đếm số lượng theo danh mục
  activeServices.forEach(service => {
    if (stats.categories[service.category]) {
      stats.categories[service.category]++;
    } else {
      stats.categories[service.category] = 1;
    }
    
    // Đếm theo loại mẫu
    if (stats.sampleTypes[service.sampleType]) {
      stats.sampleTypes[service.sampleType]++;
    } else {
      stats.sampleTypes[service.sampleType] = 1;
    }
  });
  
  // Tính giá trung bình
  stats.averagePrice = Math.round(
    activeServices.reduce((sum, service) => sum + service.price, 0) / 
    activeServices.length
  );
  
  return {
    data: stats,
    status: 200,
    message: 'Lấy thống kê thành công'
  };
};

// Mock API function để lấy danh sách danh mục
export const getTestingCategoriesAPI = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const categories = [...new Set(mockTestingServicesData.map(service => service.category))];
  
  return {
    data: categories,
    status: 200,
    message: 'Lấy danh sách danh mục thành công'
  };
};

// Mock API function để cập nhật trạng thái dịch vụ
export const updateServiceStatusAPI = async (id, status) => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const serviceIndex = mockTestingServicesData.findIndex(item => item.id === id);
  
  if (serviceIndex === -1) {
    return {
      data: null,
      status: 404,
      message: 'Không tìm thấy dịch vụ'
    };
  }
  
  mockTestingServicesData[serviceIndex].status = status;
  mockTestingServicesData[serviceIndex].updatedAt = new Date().toISOString();
  
  return {
    data: mockTestingServicesData[serviceIndex],
    status: 200,
    message: `Cập nhật trạng thái dịch vụ thành ${status === 'active' ? 'hoạt động' : 'không hoạt động'}`
  };
};
