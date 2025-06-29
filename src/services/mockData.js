// Mock data for Admin APIs

export const mockUsers = [
  {
    id: 1,
    name: "Nguyễn Văn Admin",
    email: "admin@gmail.com",
    role: 0, // Admin
    createdAt: "2024-01-15T08:30:00Z",
    isActive: true
  },
  {
    id: 2,
    name: "Trần Thị Thiết Kế",
    email: "designer1@gmail.com",
    role: 1, // Designer
    createdAt: "2024-02-20T10:15:00Z",
    isActive: true
  },
  {
    id: 3,
    name: "Lê Văn Thiết Kế",
    email: "designer2@gmail.com",
    role: 1, // Designer
    createdAt: "2024-03-10T14:20:00Z",
    isActive: true
  },
  {
    id: 4,
    name: "Phạm Thị Khách Hàng",
    email: "customer1@gmail.com",
    role: 2, // Customer
    createdAt: "2024-04-05T09:45:00Z",
    isActive: true
  },
  {
    id: 5,
    name: "Hoàng Văn Khách Hàng",
    email: "customer2@gmail.com",
    role: 2, // Customer
    createdAt: "2024-04-15T16:30:00Z",
    isActive: true
  },
  {
    id: 6,
    name: "Vũ Thị Thiết Kế",
    email: "designer3@gmail.com",
    role: 1, // Designer
    createdAt: "2024-05-01T11:00:00Z",
    isActive: true
  },
  {
    id: 7,
    name: "Đỗ Văn Khách Hàng",
    email: "customer3@gmail.com",
    role: 2, // Customer
    createdAt: "2024-05-10T13:15:00Z",
    isActive: true
  },
  {
    id: 8,
    name: "Bùi Thị Admin",
    email: "admin2@gmail.com",
    role: 0, // Admin
    createdAt: "2024-05-20T07:45:00Z",
    isActive: true
  },
  {
    id: 9,
    name: "Cao Văn Thiết Kế",
    email: "designer4@gmail.com",
    role: 1, // Designer
    createdAt: "2024-06-01T12:30:00Z",
    isActive: true
  },
  {
    id: 10,
    name: "Đinh Thị Khách Hàng",
    email: "customer4@gmail.com",
    role: 2, // Customer
    createdAt: "2024-06-15T15:00:00Z",
    isActive: true
  },
  {
    id: 11,
    name: "Võ Văn Khách Hàng",
    email: "customer5@gmail.com",
    role: 2, // Customer
    createdAt: "2024-06-20T10:30:00Z",
    isActive: true
  },
  {
    id: 12,
    name: "Mai Thị Thiết Kế",
    email: "designer5@gmail.com",
    role: 1, // Designer
    createdAt: "2024-06-25T14:45:00Z",
    isActive: true
  }
];

export const mockAwaitingDesigners = [
  {
    id: 13,
    name: "Nguyễn Thị Chờ Duyệt",
    email: "pending1@gmail.com",
    role: 1, // Designer
    createdAt: "2024-06-28T09:00:00Z",
    isActive: false,
    applicationUrl: "https://drive.google.com/file/d/1abc123/view",
    status: "pending"
  },
  {
    id: 14,
    name: "Trần Văn Chờ Duyệt",
    email: "pending2@gmail.com",
    role: 1, // Designer
    createdAt: "2024-06-28T10:30:00Z",
    isActive: false,
    applicationUrl: "https://drive.google.com/file/d/2def456/view",
    status: "pending"
  },
  {
    id: 15,
    name: "Lê Thị Chờ Duyệt",
    email: "pending3@gmail.com",
    role: 1, // Designer
    createdAt: "2024-06-28T14:15:00Z",
    isActive: false,
    applicationUrl: "https://drive.google.com/file/d/3ghi789/view",
    status: "pending"
  },
  {
    id: 16,
    name: "Phạm Văn Chờ Duyệt",
    email: "pending4@gmail.com",
    role: 1, // Designer
    createdAt: "2024-06-29T08:45:00Z",
    isActive: false,
    applicationUrl: "https://drive.google.com/file/d/4jkl012/view",
    status: "pending"
  }
];

// Mock data for Testing Services (thay vì Furniture)
export const mockFurnitures = [
  {
    id: 1,
    name: "Xét nghiệm máu tổng quát",
    price: 150000,
    category: "Huyết học",
    designer: "Trần Thị Thiết Kế",
    designerId: 2,
    createdAt: "2024-02-25T10:00:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
    },
    description: "Xét nghiệm máu cơ bản để kiểm tra tình trạng sức khỏe tổng quát",
    materials: ["Ống nghiệm", "Kim tiêm"],
    dimensions: "Thời gian: 30 phút"
  },
  {
    id: 2,
    name: "Siêu âm thai định kỳ",
    price: 350000,
    category: "Sản khoa",
    designer: "Lê Văn Thiết Kế",
    designerId: 3,
    createdAt: "2024-03-15T14:30:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop"
    },
    description: "Siêu âm theo dõi sự phát triển của thai nhi trong thai kỳ",
    materials: ["Máy siêu âm", "Gel siêu âm"],
    dimensions: "Thời gian: 45 phút"
  },
  {
    id: 3,
    name: "Xét nghiệm hormone tuyến giáp",
    price: 800000,
    category: "Nội tiết",
    designer: "Vũ Thị Thiết Kế",
    designerId: 6,
    createdAt: "2024-05-05T09:15:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop"
    },
    description: "Kiểm tra chức năng tuyến giáp qua các chỉ số TSH, T3, T4",
    materials: ["Ống nghiệm chuyên dụng"],
    dimensions: "Thời gian: 20 phút"
  },
  {
    id: 4,
    name: "Đo mật độ xương",
    price: 1200000,
    category: "Chẩn đoán hình ảnh",
    designer: "Cao Văn Thiết Kế",
    designerId: 9,
    createdAt: "2024-06-02T11:45:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop"
    },
    description: "Đánh giá mật độ xương để phát hiện loãng xương",
    materials: ["Máy DEXA"],
    dimensions: "Thời gian: 60 phút"
  },
  {
    id: 5,
    name: "Xét nghiệm HIV/AIDS",
    price: 200000,
    category: "Vi sinh",
    designer: "Mai Thị Thiết Kế",
    designerId: 12,
    createdAt: "2024-06-26T16:20:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop"
    },
    description: "Xét nghiệm phát hiện virus HIV trong máu",
    materials: ["Kit test HIV", "Ống nghiệm"],
    dimensions: "Thời gian: 15 phút"
  },
  {
    id: 6,
    name: "Tầm soát ung thư cổ tử cung",
    price: 450000,
    category: "Ung thư học",
    designer: "Trần Thị Thiết Kế",
    designerId: 2,
    createdAt: "2024-03-20T13:10:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
    },
    description: "Xét nghiệm Pap smear và HPV để tầm soát ung thư cổ tử cung",
    materials: ["Speculum", "Brush lấy mẫu"],
    dimensions: "Thời gian: 30 phút"
  },
  {
    id: 7,
    name: "Xét nghiệm đường huyết",
    price: 80000,
    category: "Sinh hóa",
    designer: "Lê Văn Thiết Kế",
    designerId: 3,
    createdAt: "2024-04-10T08:30:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop"
    },
    description: "Kiểm tra nồng độ glucose trong máu để chẩn đoán tiểu đường",
    materials: ["Que test đường huyết"],
    dimensions: "Thời gian: 10 phút"
  },
  {
    id: 8,
    name: "Chụp X-quang phổi",
    price: 300000,
    category: "Chẩn đoán hình ảnh",
    designer: "Vũ Thị Thiết Kế",
    designerId: 6,
    createdAt: "2024-05-15T15:45:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=400&h=400&fit=crop"
    },
    description: "Chụp X-quang ngực để kiểm tra tình trạng phổi và tim",
    materials: ["Máy X-quang", "Phim X-quang"],
    dimensions: "Thời gian: 15 phút"
  },
  {
    id: 9,
    name: "Điện tim",
    price: 120000,
    category: "Tim mạch",
    designer: "Cao Văn Thiết Kế",
    designerId: 9,
    createdAt: "2024-06-08T12:00:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=400&fit=crop"
    },
    description: "Đo hoạt động điện của tim để phát hiện bất thường",
    materials: ["Máy điện tim", "Điện cực"],
    dimensions: "Thời gian: 20 phút"
  },
  {
    id: 10,
    name: "Xét nghiệm chức năng gan",
    price: 250000,
    category: "Sinh hóa",
    designer: "Mai Thị Thiết Kế",
    designerId: 12,
    createdAt: "2024-06-28T10:30:00Z",
    status: "active",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
    },
    description: "Kiểm tra các enzyme gan ALT, AST để đánh giá chức năng gan",
    materials: ["Ống nghiệm", "Hóa chất"],
    dimensions: "Thời gian: 25 phút"
  }
];

// Mock data for Dashboard APIs
export const mockNewProducts = [
  {
    id: 1,
    name: "Xét nghiệm tổng quát mới",
    price: 180000,
    category: "Huyết học",
    createdAt: "2024-06-29T08:00:00Z",
    status: "pending",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=400&fit=crop"
    }
  },
  {
    id: 2,
    name: "Siêu âm tim thai",
    price: 400000,
    category: "Sản khoa",
    createdAt: "2024-06-28T14:30:00Z",
    status: "pending",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=400&fit=crop"
    }
  },
  {
    id: 3,
    name: "Xét nghiệm di truyền",
    price: 950000,
    category: "Nội tiết",
    createdAt: "2024-06-27T10:15:00Z",
    status: "pending",
    primaryImage: {
      imageSource: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop"
    }
  }
];

export const mockRevenueByDay = (month, year) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const data = [];
  
  for (let day = 1; day <= daysInMonth; day++) {
    const baseRevenue = 1000000; // 1M VND base
    const randomMultiplier = 0.5 + Math.random() * 1.5; // 0.5x to 2x
    const weekendBonus = (day % 7 === 0 || day % 7 === 1) ? 1.3 : 1; // Weekend bonus
    
    data.push({
      day,
      revenue: Math.round(baseRevenue * randomMultiplier * weekendBonus)
    });
  }
  
  return data;
};

export const mockTopDesigners = [
  {
    accountName: "Dr. Nguyễn Thị Lan",
    totalIncome: 45000000
  },
  {
    accountName: "Dr. Trần Văn Nam",
    totalIncome: 38000000
  },
  {
    accountName: "Dr. Lê Thị Hoa",
    totalIncome: 32000000
  },
  {
    accountName: "Dr. Phạm Văn Minh",
    totalIncome: 28000000
  },
  {
    accountName: "Dr. Hoàng Thị Mai",
    totalIncome: 25000000
  }
];

export const mockOrdersByMonth = [
  { month: 1, unpaid: 15, paid: 45, cancelled: 3 },
  { month: 2, unpaid: 18, paid: 52, cancelled: 5 },
  { month: 3, unpaid: 22, paid: 48, cancelled: 4 },
  { month: 4, unpaid: 20, paid: 55, cancelled: 2 },
  { month: 5, unpaid: 25, paid: 60, cancelled: 6 },
  { month: 6, unpaid: 30, paid: 65, cancelled: 4 }
];

export const mockCustomerGrowth = [
  { month: 1, count: 120 },
  { month: 2, count: 145 },
  { month: 3, count: 168 },
  { month: 4, count: 190 },
  { month: 5, count: 215 },
  { month: 6, count: 248 }
];

export const mockOrders = [
  {
    id: "PAY001",
    designer: {
      id: 1,
      name: "Dr. Nguyễn Văn An"
    },
    customer: {
      id: 1,
      name: "Trần Thị Hoa"
    },
    orderPrice: 2500000,
    date: "2024-01-15T10:30:00Z",
    status: "Đã thanh toán",
    orderDetails: [
      {
        id: 1,
        product: {
          id: 1,
          name: "Xét nghiệm máu tổng quát",
          price: 500000
        },
        quantity: 1,
        detailPrice: 500000
      },
      {
        id: 2,
        product: {
          id: 2,
          name: "Siêu âm thai định kỳ",
          price: 350000
        },
        quantity: 1,
        detailPrice: 350000
      },
      {
        id: 3,
        product: {
          id: 3,
          name: "Xét nghiệm hormone tuyến giáp",
          price: 800000
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        id: 4,
        product: {
          id: 4,
          name: "Tư vấn sức khỏe",
          price: 850000
        },
        quantity: 1,
        detailPrice: 850000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-01-15T10:30:00Z"
      },
      {
        name: "Đã thanh toán",
        time: "2024-01-17T09:15:00Z"
      }
    ]
  },
  {
    id: "PAY002",
    designer: {
      id: 2,
      name: "Dr. Lê Thị Bình"
    },
    customer: {
      id: 2,
      name: "Phạm Văn Cường"
    },
    orderPrice: 1800000,
    date: "2024-01-20T14:45:00Z",
    status: "Chưa thanh toán",
    orderDetails: [
      {
        id: 5,
        product: {
          id: 9,
          name: "Điện tim",
          price: 120000
        },
        quantity: 1,
        detailPrice: 120000
      },
      {
        id: 6,
        product: {
          id: 8,
          name: "Chụp X-quang phổi",
          price: 300000
        },
        quantity: 1,
        detailPrice: 300000
      },
      {
        id: 7,
        product: {
          id: 7,
          name: "Xét nghiệm đường huyết",
          price: 80000
        },
        quantity: 1,
        detailPrice: 80000
      },
      {
        id: 8,
        product: {
          id: 10,
          name: "Xét nghiệm chức năng gan",
          price: 250000
        },
        quantity: 1,
        detailPrice: 250000
      },
      {
        id: 9,
        product: {
          id: 5,
          name: "Xét nghiệm HIV/AIDS",
          price: 200000
        },
        quantity: 1,
        detailPrice: 200000
      },
      {
        id: 10,
        product: {
          id: 6,
          name: "Tầm soát ung thư cổ tử cung",
          price: 450000
        },
        quantity: 1,
        detailPrice: 450000
      },
      {
        id: 11,
        product: {
          id: 4,
          name: "Đo mật độ xương",
          price: 400000
        },
        quantity: 1,
        detailPrice: 400000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-01-20T14:45:00Z"
      }
    ]
  },
  {
    id: "PAY003",
    designer: {
      id: 3,
      name: "Dr. Hoàng Minh Đức"
    },
    customer: {
      id: 3,
      name: "Nguyễn Thị Mai"
    },
    orderPrice: 3200000,
    date: "2024-01-18T09:15:00Z",
    status: "Đã thanh toán",
    orderDetails: [
      {
        id: 12,
        product: {
          id: 4,
          name: "Đo mật độ xương",
          price: 1200000
        },
        quantity: 1,
        detailPrice: 1200000
      },
      {
        id: 13,
        product: {
          id: 3,
          name: "Xét nghiệm hormone tuyến giáp",
          price: 800000
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        id: 14,
        product: {
          id: 2,
          name: "Siêu âm thai định kỳ",
          price: 350000
        },
        quantity: 1,
        detailPrice: 350000
      },
      {
        id: 15,
        product: {
          id: 6,
          name: "Tầm soát ung thư cổ tử cung",
          price: 450000
        },
        quantity: 1,
        detailPrice: 450000
      },
      {
        id: 16,
        product: {
          id: 8,
          name: "Chụp X-quang phổi",
          price: 300000
        },
        quantity: 1,
        detailPrice: 300000
      },
      {
        id: 17,
        product: {
          id: 1,
          name: "Xét nghiệm máu tổng quát",
          price: 100000
        },
        quantity: 1,
        detailPrice: 100000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-01-18T09:15:00Z"
      },
      {
        name: "Đã thanh toán",
        time: "2024-01-20T14:30:00Z"
      }
    ]
  },
  {
    id: "PAY004",
    designer: {
      id: 4,
      name: "Dr. Vũ Thị Lan"
    },
    customer: {
      id: 4,
      name: "Đỗ Văn Nam"
    },
    orderPrice: 950000,
    date: "2024-01-22T16:20:00Z",
    status: "Đã hủy",
    orderDetails: [
      {
        id: 18,
        product: {
          id: 7,
          name: "Xét nghiệm đường huyết",
          price: 80000
        },
        quantity: 1,
        detailPrice: 80000
      },
      {
        id: 19,
        product: {
          id: 10,
          name: "Xét nghiệm chức năng gan",
          price: 250000
        },
        quantity: 1,
        detailPrice: 250000
      },
      {
        id: 20,
        product: {
          id: 5,
          name: "Xét nghiệm HIV/AIDS",
          price: 200000
        },
        quantity: 1,
        detailPrice: 200000
      },
      {
        id: 21,
        product: {
          id: 9,
          name: "Điện tim",
          price: 120000
        },
        quantity: 1,
        detailPrice: 120000
      },
      {
        id: 22,
        product: {
          id: 8,
          name: "Chụp X-quang phổi",
          price: 300000
        },
        quantity: 1,
        detailPrice: 300000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-01-22T16:20:00Z"
      },
      {
        name: "Đã hủy",
        time: "2024-01-22T18:00:00Z"
      }
    ]
  },
  {
    id: "PAY005",
    designer: {
      id: 5,
      name: "Dr. Trần Quốc Bảo"
    },
    customer: {
      id: 5,
      name: "Lý Thị Phương"
    },
    orderPrice: 4100000,
    date: "2024-01-25T11:10:00Z",
    status: "Chưa thanh toán",
    orderDetails: [
      {
        id: 23,
        product: {
          id: 4,
          name: "Đo mật độ xương",
          price: 1200000
        },
        quantity: 1,
        detailPrice: 1200000
      },
      {
        id: 24,
        product: {
          id: 3,
          name: "Xét nghiệm hormone tuyến giáp",
          price: 800000
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        id: 25,
        product: {
          id: 6,
          name: "Tầm soát ung thư cổ tử cung",
          price: 450000
        },
        quantity: 1,
        detailPrice: 450000
      },
      {
        id: 26,
        product: {
          id: 2,
          name: "Siêu âm thai định kỳ",
          price: 350000
        },
        quantity: 1,
        detailPrice: 350000
      },
      {
        id: 27,
        product: {
          id: 8,
          name: "Chụp X-quang phổi",
          price: 300000
        },
        quantity: 1,
        detailPrice: 300000
      },
      {
        id: 28,
        product: {
          id: 10,
          name: "Xét nghiệm chức năng gan",
          price: 250000
        },
        quantity: 1,
        detailPrice: 250000
      },
      {
        id: 29,
        product: {
          id: 5,
          name: "Xét nghiệm HIV/AIDS",
          price: 200000
        },
        quantity: 1,
        detailPrice: 200000
      },
      {
        id: 30,
        product: {
          id: 1,
          name: "Xét nghiệm máu tổng quát",
          price: 150000
        },
        quantity: 1,
        detailPrice: 150000
      },
      {
        id: 31,
        product: {
          id: 9,
          name: "Điện tim",
          price: 120000
        },
        quantity: 1,
        detailPrice: 120000
      },
      {
        id: 32,
        product: {
          id: 7,
          name: "Xét nghiệm đường huyết",
          price: 80000
        },
        quantity: 1,
        detailPrice: 80000
      },
      {
        id: 33,
        product: {
          id: 11,
          name: "Tư vấn dinh dưỡng",
          price: 400000
        },
        quantity: 1,
        detailPrice: 400000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-01-25T11:10:00Z"
      }
    ]
  },
  {
    id: "PAY006",
    designer: {
      id: 1,
      name: "Dr. Nguyễn Văn An"
    },
    customer: {
      id: 6,
      name: "Cao Thị Hạnh"
    },
    orderPrice: 1500000,
    date: "2024-02-01T08:00:00Z",
    status: "Đã hủy",
    orderDetails: [
      {
        id: 34,
        product: {
          id: 4,
          name: "Đo mật độ xương",
          price: 1200000
        },
        quantity: 1,
        detailPrice: 1200000
      },
      {
        id: 35,
        product: {
          id: 8,
          name: "Chụp X-quang phổi",
          price: 300000
        },
        quantity: 1,
        detailPrice: 300000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-02-01T08:00:00Z"
      },
      {
        name: "Đã hủy",
        time: "2024-02-02T15:45:00Z"
      }
    ]
  },
  {
    id: "PAY007",
    designer: {
      id: 2,
      name: "Dr. Lê Thị Bình"
    },
    customer: {
      id: 7,
      name: "Bùi Văn Tâm"
    },
    orderPrice: 2800000,
    date: "2024-02-05T13:30:00Z",
    status: "Chưa thanh toán",
    orderDetails: [
      {
        id: 36,
        product: {
          id: 4,
          name: "Đo mật độ xương",
          price: 1200000
        },
        quantity: 1,
        detailPrice: 1200000
      },
      {
        id: 37,
        product: {
          id: 3,
          name: "Xét nghiệm hormone tuyến giáp",
          price: 800000
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        id: 38,
        product: {
          id: 2,
          name: "Siêu âm thai định kỳ",
          price: 350000
        },
        quantity: 1,
        detailPrice: 350000
      },
      {
        id: 39,
        product: {
          id: 6,
          name: "Tầm soát ung thư cổ tử cung",
          price: 450000
        },
        quantity: 1,
        detailPrice: 450000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-02-05T13:30:00Z"
      }
    ]
  },
  {
    id: "PAY008",
    designer: {
      id: 3,
      name: "Dr. Hoàng Minh Đức"
    },
    customer: {
      id: 8,
      name: "Đinh Thị Oanh"
    },
    orderPrice: 5200000,
    date: "2024-02-10T16:45:00Z",
    status: "Đã thanh toán",
    orderDetails: [
      {
        id: 40,
        product: {
          id: 4,
          name: "Đo mật độ xương",
          price: 1200000
        },
        quantity: 1,
        detailPrice: 1200000
      },
      {
        id: 41,
        product: {
          id: 3,
          name: "Xét nghiệm hormone tuyến giáp",
          price: 800000
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        id: 42,
        product: {
          id: 6,
          name: "Tầm soát ung thư cổ tử cung",
          price: 450000
        },
        quantity: 1,
        detailPrice: 450000
      },
      {
        id: 43,
        product: {
          id: 2,
          name: "Siêu âm thai định kỳ",
          price: 350000
        },
        quantity: 1,
        detailPrice: 350000
      },
      {
        id: 44,
        product: {
          id: 8,
          name: "Chụp X-quang phổi",
          price: 300000
        },
        quantity: 1,
        detailPrice: 300000
      },
      {
        id: 45,
        product: {
          id: 10,
          name: "Xét nghiệm chức năng gan",
          price: 250000
        },
        quantity: 1,
        detailPrice: 250000
      },
      {
        id: 46,
        product: {
          id: 5,
          name: "Xét nghiệm HIV/AIDS",
          price: 200000
        },
        quantity: 1,
        detailPrice: 200000
      },
      {
        id: 47,
        product: {
          id: 1,
          name: "Xét nghiệm máu tổng quát",
          price: 150000
        },
        quantity: 1,
        detailPrice: 150000
      },
      {
        id: 48,
        product: {
          id: 9,
          name: "Điện tim",
          price: 120000
        },
        quantity: 1,
        detailPrice: 120000
      },
      {
        id: 49,
        product: {
          id: 7,
          name: "Xét nghiệm đường huyết",
          price: 80000
        },
        quantity: 1,
        detailPrice: 80000
      },
      {
        id: 50,
        product: {
          id: 12,
          name: "Tư vấn chuyên sâu",
          price: 1300000
        },
        quantity: 1,
        detailPrice: 1300000
      }
    ],
    statuses: [
      {
        name: "Chưa thanh toán",
        time: "2024-02-10T16:45:00Z"
      },
      {
        name: "Đã thanh toán",
        time: "2024-02-15T12:00:00Z"
      }
    ]
  }
];

export const mockTopProducts = [
  {
    id: 1,
    name: "Xét nghiệm máu tổng quát",
    sales: 156,
    revenue: 23400000
  },
  {
    id: 2,
    name: "Siêu âm thai",
    sales: 89,
    revenue: 31150000
  },
  {
    id: 3,
    name: "Điện tim",
    sales: 134,
    revenue: 16080000
  }
];

// Mock API functions with realistic delays
export const mockApiDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const paginateData = (data, pageNumber, pageSize) => {
  if (pageNumber === -1 || pageSize === -1) {
    return {
      items: data,
      totalCount: data.length,
      currentPage: 1,
      totalPages: 1
    };
  }

  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedItems = data.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    totalCount: data.length,
    currentPage: pageNumber,
    totalPages: Math.ceil(data.length / pageSize)
  };
};

export const filterUsersByRole = (users, role) => {
  if (role === null || role === undefined) {
    return users;
  }
  return users.filter(user => user.role === parseInt(role));
};

export const filterFurnituresByName = (testingServices, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return testingServices;
  }
  return testingServices.filter(service => 
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.designer.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterOrdersBySearch = (orders, searchTerm) => {
  if (!searchTerm || searchTerm.trim() === '') {
    return orders;
  }
  return orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.designer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

export const filterOrdersByStatus = (orders, status) => {
  if (!status || status === '') {
    return orders;
  }
  return orders.filter(order => order.status === status);
};
