// Mock data for healthcare orders
const mockOrders = [
  {
    id: "ORD001",
    designer: {
      id: 1,
      name: "BS. Nguyễn Thị Lan",
      email: "lan.nguyen@healthcenter.com",
      specialty: "Sản phụ khoa"
    },
    customer: {
      id: 2,
      name: "Trần Văn Minh",
      email: "minh.tran@example.com",
      gender: "Nam",
      age: 32
    },
    orderPrice: 500000,
    date: "2024-12-15T10:30:00Z",
    status: "Completed",
    isPaid: true,
    items: [
      {
        id: 1,
        name: "Tư vấn sức khỏe sinh sản",
        quantity: 1,
        price: 500000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 1,
          name: "Tư vấn sức khỏe sinh sản nam giới",
          price: 500000,
          category: "Tư vấn",
          code: "SV001"
        },
        quantity: 1,
        detailPrice: 500000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-14T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-14T10:30:00Z"
      },
      {
        name: "Completed",
        time: "2024-12-15T10:30:00Z"
      }
    ]
  },
  {
    id: "ORD002",
    designer: {
      id: 3,
      name: "BS. Lê Thị Hoa",
      email: "hoa.le@healthcenter.com",
      specialty: "Nội khoa"
    },
    customer: {
      id: 4,
      name: "Phạm Thị Lan",
      email: "lan.pham@example.com",
      gender: "Nữ",
      age: 28
    },
    orderPrice: 750000,
    date: "2024-12-14T14:20:00Z",
    status: "Completed",
    isPaid: true,
    items: [
      {
        id: 2,
        name: "Khám sức khỏe phụ nữ",
        quantity: 1,
        price: 750000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 2,
          name: "Khám sức khỏe sinh sản phụ nữ",
          price: 400000,
          category: "Khám",
          code: "SV002"
        },
        quantity: 1,
        detailPrice: 400000
      },
      {
        product: {
          id: 3,
          name: "Xét nghiệm hormone",
          price: 350000,
          category: "Xét nghiệm",
          code: "SV003"
        },
        quantity: 1,
        detailPrice: 350000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-13T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-13T14:20:00Z"
      },
      {
        name: "Completed",
        time: "2024-12-14T14:20:00Z"
      }
    ]
  },
  {
    id: "ORD003",
    designer: {
      id: 5,
      name: "BS. Hoàng Văn Nam",
      email: "nam.hoang@healthcenter.com",
      specialty: "Da liễu"
    },
    customer: {
      id: 6,
      name: "Võ Thị Mai",
      email: "mai.vo@example.com",
      gender: "Nữ",
      age: 35
    },
    orderPrice: 450000,
    date: "2024-12-13T09:15:00Z",
    status: "Completed",
    isPaid: false,
    items: [
      {
        id: 3,
        name: "Điều trị mụn trứng cá",
        quantity: 1,
        price: 450000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 4,
          name: "Điều trị mụn trứng cá cho nữ",
          price: 450000,
          category: "Điều trị",
          code: "SV004"
        },
        quantity: 1,
        detailPrice: 450000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-12T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-12T09:15:00Z"
      },
      {
        name: "Completed",
        time: "2024-12-13T09:15:00Z"
      }
    ]
  },
  {
    id: "ORD004",
    designer: {
      id: 7,
      name: "BS. Đặng Thị Linh",
      email: "linh.dang@healthcenter.com",
      specialty: "Tâm lý học"
    },
    customer: {
      id: 8,
      name: "Bùi Văn Đức",
      email: "duc.bui@example.com",
      gender: "Nam",
      age: 40
    },
    orderPrice: 800000,
    date: "2024-12-12T16:45:00Z",
    status: "Cancelled",
    isPaid: false,
    items: [
      {
        id: 4,
        name: "Tư vấn tâm lý về tình dục",
        quantity: 1,
        price: 800000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 5,
          name: "Tư vấn tâm lý nam giới",
          price: 500000,
          category: "Tư vấn"
        },
        quantity: 1,
        detailPrice: 500000
      },
      {
        product: {
          id: 6,
          name: "Liệu pháp tâm lý cặp đôi",
          price: 300000,
          category: "Liệu pháp"
        },
        quantity: 1,
        detailPrice: 300000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-11T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-11T16:45:00Z"
      },
      {
        name: "Cancelled",
        time: "2024-12-12T16:45:00Z"
      }
    ]
  },
  {
    id: "ORD005",
    designer: {
      id: 9,
      name: "BS. Ngô Thị Hương",
      email: "huong.ngo@healthcenter.com",
      specialty: "Nội tiết"
    },
    customer: {
      id: 10,
      name: "Lý Thị Kiều",
      email: "kieu.ly@example.com",
      gender: "Nữ",
      age: 25
    },
    orderPrice: 650000,
    date: "2024-12-11T11:30:00Z",
    status: "Cancelled",
    isPaid: false,
    items: [
      {
        id: 5,
        name: "Điều trị rối loạn kinh nguyệt",
        quantity: 1,
        price: 650000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 8,
          name: "Khám và điều trị rối loạn kinh nguyệt",
          price: 650000,
          category: "Điều trị"
        },
        quantity: 1,
        detailPrice: 650000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-10T08:00:00Z"
      },
      {
        name: "Cancelled",
        time: "2024-12-11T11:30:00Z"
      }
    ]
  },
  {
    id: "ORD006",
    designer: {
      id: 1,
      name: "BS. Nguyễn Thị Lan",
      email: "lan.nguyen@healthcenter.com",
      specialty: "Sản phụ khoa"
    },
    customer: {
      id: 11,
      name: "Trương Thị Hải",
      email: "hai.truong@example.com",
      gender: "Nữ",
      age: 30
    },
    orderPrice: 1200000,
    date: "2024-12-10T13:20:00Z",
    status: "Completed",
    isPaid: true,
    items: [
      {
        id: 6,
        name: "Khám thai định kỳ",
        quantity: 1,
        price: 1200000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 9,
          name: "Khám thai 3 tháng cuối",
          price: 800000,
          category: "Khám"
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        product: {
          id: 10,
          name: "Siêu âm 4D thai nhi",
          price: 400000,
          category: "Chẩn đoán"
        },
        quantity: 1,
        detailPrice: 400000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-09T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-09T13:20:00Z"
      },
      {
        name: "Completed",
        time: "2024-12-10T13:20:00Z"
      }
    ]
  },
  {
    id: "ORD007",
    designer: {
      id: 3,
      name: "BS. Lê Thị Hoa",
      email: "hoa.le@healthcenter.com",
      specialty: "Nội khoa"
    },
    customer: {
      id: 12,
      name: "Phan Văn Nga",
      email: "nga.phan@example.com",
      gender: "Nam",
      age: 45
    },
    orderPrice: 900000,
    date: "2024-12-09T08:45:00Z",
    status: "Refund",
    isPaid: true,
    items: [
      {
        id: 7,
        name: "Khám tổng quát nam giới",
        quantity: 1,
        price: 900000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 11,
          name: "Khám tổng quát sức khỏe nam giới",
          price: 900000,
          category: "Khám"
        },
        quantity: 1,
        detailPrice: 900000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-08T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-08T08:45:00Z"
      },
      {
        name: "Completed",
        time: "2024-12-08T17:00:00Z"
      },
      {
        name: "Refund",
        time: "2024-12-08T20:00:00Z"
      },
      {
        name: "Cancelled",
        time: "2024-12-09T08:45:00Z"
      }
    ]
  },
  {
    id: "ORD008",
    designer: {
      id: 5,
      name: "BS. Hoàng Văn Nam",
      email: "nam.hoang@healthcenter.com",
      specialty: "Da liễu"
    },
    customer: {
      id: 13,
      name: "Đinh Thị Quân",
      email: "quan.dinh@example.com",
      gender: "Nữ",
      age: 22
    },
    orderPrice: 350000,
    date: "2024-12-08T15:10:00Z",
    status: "Processing",
    isPaid: false,
    items: [
      {
        id: 8,
        name: "Điều trị mụn cho nữ",
        quantity: 1,
        price: 350000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 12,
          name: "Điều trị mụn bằng laser cho nữ",
          price: 350000,
          category: "Điều trị"
        },
        quantity: 1,
        detailPrice: 350000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-07T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-08T15:10:00Z"
      }
    ]
  },
  {
    id: "ORD009",
    designer: {
      id: 2,
      name: "BS. Trần Minh Đức",
      email: "duc.tran@healthcenter.com",
      specialty: "Tiết niệu"
    },
    customer: {
      id: 14,
      name: "Nguyễn Văn Hùng",
      email: "hung.nguyen@example.com",
      gender: "Nam",
      age: 38
    },
    orderPrice: 850000,
    date: "2024-12-07T09:30:00Z",
    status: "Pending",
    isPaid: false,
    items: [
      {
        id: 9,
        name: "Khám tiết niệu nam",
        quantity: 1,
        price: 850000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 13,
          name: "Khám chuyên khoa tiết niệu nam",
          price: 600000,
          category: "Khám"
        },
        quantity: 1,
        detailPrice: 600000
      },
      {
        product: {
          id: 14,
          name: "Xét nghiệm PSA",
          price: 250000,
          category: "Xét nghiệm"
        },
        quantity: 1,
        detailPrice: 250000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-07T09:30:00Z"
      }
    ]
  },
  {
    id: "ORD010",
    designer: {
      id: 4,
      name: "BS. Võ Thị Lan Anh",
      email: "lananh.vo@healthcenter.com",
      specialty: "Nhi khoa"
    },
    customer: {
      id: 15,
      name: "Lê Thị Tuyết",
      email: "tuyet.le@example.com",
      gender: "Nữ",
      age: 26
    },
    orderPrice: 550000,
    date: "2024-12-06T14:45:00Z",
    status: "Completed",
    isPaid: true,
    items: [
      {
        id: 10,
        name: "Tư vấn sức khỏe sinh sản nữ",
        quantity: 1,
        price: 550000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 15,
          name: "Tư vấn sức khỏe sinh sản cho nữ giới",
          price: 400000,
          category: "Tư vấn"
        },
        quantity: 1,
        detailPrice: 400000
      },
      {
        product: {
          id: 16,
          name: "Hướng dẫn chăm sóc sau sinh",
          price: 150000,
          category: "Tư vấn"
        },
        quantity: 1,
        detailPrice: 150000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-05T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-05T14:45:00Z"
      },
      {
        name: "Completed",
        time: "2024-12-06T14:45:00Z"
      }
    ]
  },
  {
    id: "ORD011",
    designer: {
      id: 6,
      name: "BS. Phạm Văn Hưng",
      email: "hung.pham@healthcenter.com",
      specialty: "Andrology"
    },
    customer: {
      id: 16,
      name: "Trần Thanh Sơn",
      email: "son.tran@example.com",
      gender: "Nam",
      age: 35
    },
    orderPrice: 1800000,
    date: "2024-12-05T10:15:00Z",
    status: "Processing",
    isPaid: true,
    items: [
      {
        id: 11,
        name: "Gói khám nam khoa toàn diện",
        quantity: 1,
        price: 1800000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 17,
          name: "Khám andrologia chuyên sâu",
          price: 800000,
          category: "Khám chuyên khoa"
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        product: {
          id: 18,
          name: "Xét nghiệm tinh dịch đồ",
          price: 500000,
          category: "Xét nghiệm"
        },
        quantity: 1,
        detailPrice: 500000
      },
      {
        product: {
          id: 19,
          name: "Siêu âm Doppler mạch máu",
          price: 500000,
          category: "Chẩn đoán hình ảnh"
        },
        quantity: 1,
        detailPrice: 500000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-04T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-05T10:15:00Z"
      }
    ]
  },
  {
    id: "ORD012",
    designer: {
      id: 7,
      name: "BS. Lê Thị Minh Châu",
      email: "minchau.le@healthcenter.com",
      specialty: "Phụ khoa"
    },
    customer: {
      id: 17,
      name: "Nguyễn Thị Bích",
      email: "bich.nguyen@example.com",
      gender: "Nữ",
      age: 29
    },
    orderPrice: 2200000,
    date: "2024-12-04T14:30:00Z",
    status: "Completed",
    isPaid: true,
    items: [
      {
        id: 12,
        name: "Gói tầm soát ung thư phụ khoa",
        quantity: 1,
        price: 2200000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 20,
          name: "Xét nghiệm tế bào học cổ tử cung",
          price: 400000,
          category: "Xét nghiệm"
        },
        quantity: 1,
        detailPrice: 400000
      },
      {
        product: {
          id: 21,
          name: "Xét nghiệm HPV",
          price: 600000,
          category: "Xét nghiệm"
        },
        quantity: 1,
        detailPrice: 600000
      },
      {
        product: {
          id: 22,
          name: "Siêu âm âm đạo 4D",
          price: 800000,
          category: "Chẩn đoán hình ảnh"
        },
        quantity: 1,
        detailPrice: 800000
      },
      {
        product: {
          id: 23,
          name: "Tư vấn kết quả và phác đồ điều trị",
          price: 400000,
          category: "Tư vấn"
        },
        quantity: 1,
        detailPrice: 400000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-03T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-03T14:30:00Z"
      },
      {
        name: "Completed",
        time: "2024-12-04T14:30:00Z"
      }
    ]
  },
  {
    id: "ORD013",
    designer: {
      id: 8,
      name: "BS. Hoàng Minh Tuấn",
      email: "tuan.hoang@healthcenter.com",
      specialty: "Tâm lý tình dục"
    },
    customer: {
      id: 18,
      name: "Đỗ Văn Hải & Lê Thị Nga",
      email: "hai.do@example.com",
      gender: "Cặp đôi",
      age: "30-28"
    },
    orderPrice: 1500000,
    date: "2024-12-03T16:45:00Z",
    status: "Refund",
    isPaid: true,
    items: [
      {
        id: 13,
        name: "Liệu pháp tâm lý cặp đôi",
        quantity: 3,
        price: 500000
      }
    ],
    orderDetails: [
      {
        product: {
          id: 24,
          name: "Buổi tư vấn tâm lý cặp đôi",
          price: 500000,
          category: "Tư vấn tâm lý"
        },
        quantity: 3,
        detailPrice: 1500000
      }
    ],
    statuses: [
      {
        name: "Pending",
        time: "2024-12-02T08:00:00Z"
      },
      {
        name: "Processing",
        time: "2024-12-02T16:45:00Z"
      },
      {
        name: "Refund",
        time: "2024-12-03T16:45:00Z"
      }
    ]
  }
];

// Mock API functions for healthcare orders
export const mockGetAllOrdersAPI = (pageNumber = 1, pageSize = 6) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedOrders = mockOrders.slice(startIndex, endIndex);
      
      const response = {
        items: paginatedOrders,
        totalPages: Math.ceil(mockOrders.length / pageSize),
        totalCount: mockOrders.length,
        currentPage: pageNumber,
        pageSize: pageSize
      };
      
      console.log('Mock API - Get all healthcare orders:', response);
      resolve(response);
    }, 500); // Simulate network delay
  });
};

export const mockGetOrderByIdAPI = (orderId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const order = mockOrders.find(o => o.id === orderId);
      if (order) {
        console.log('Mock API - Get healthcare order by ID:', order);
        resolve(order);
      } else {
        reject(new Error(`Healthcare order with ID ${orderId} not found`));
      }
    }, 300);
  });
};

export const mockUpdateOrderStatusAPI = (orderId, newStatus) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].status = newStatus;
        console.log('Mock API - Update healthcare order status:', mockOrders[orderIndex]);
        resolve(mockOrders[orderIndex]);
      } else {
        reject(new Error(`Healthcare order with ID ${orderId} not found`));
      }
    }, 300);
  });
};

export const mockUpdatePaymentStatusAPI = (orderId, isPaid) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const orderIndex = mockOrders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        mockOrders[orderIndex].isPaid = isPaid;
        console.log('Mock API - Update healthcare payment status:', mockOrders[orderIndex]);
        resolve(mockOrders[orderIndex]);
      } else {
        reject(new Error(`Healthcare order with ID ${orderId} not found`));
      }
    }, 300);
  });
};

// Export mock data for direct access
export { mockOrders };
