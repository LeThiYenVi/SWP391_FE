import instance from "./customize-axios";
import { 
  mockUsers, 
  mockAwaitingDesigners, 
  mockFurnitures, 
  mockApiDelay, 
  paginateData, 
  filterUsersByRole, 
  filterFurnituresByName,
  mockNewProducts,
  mockRevenueByDay,
  mockTopDesigners,
  mockOrdersByMonth,
  mockCustomerGrowth,
  mockOrders,
  mockTopProducts
} from "./mockData";


// =============Auth============
const loginDesignerAPI = async (email, password) => {
  try {
    const response = await instance.post('/api/auth/designer/login', {
      email,
      password,
    });
    console.log('Login success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const resetPasswordAPI = async (token, newPassword) => {
  try {
    const response = await instance.post('/api/auth/reset-password', null, {
      params: {
        token,
        newPassword,
      },
    });
    console.log('Reset password success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error.response?.data || error.message);
    throw error;
  }
};


const forgetPasswordAPI = async (email, role) => {
  try {
    const response = await instance.post('/api/auth/forget-password', null, {
      params: {
        email,
        role,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


const registerDesignerAPI = async (name, email, password, applicationUrl) => {
  try {
    const response = await instance.post('/api/auth/designer/register', {
      name,
      email,
      password,
      applicationUrl: applicationUrl,
    });
    console.log('Register success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
};

const applicationResultAPI = async (email, isApproved) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Find the designer in mock data
    const designerIndex = mockAwaitingDesigners.findIndex(d => d.email === email);
    
    if (designerIndex !== -1) {
      // Update the status in mock data
      mockAwaitingDesigners[designerIndex].status = isApproved ? 'approved' : 'rejected';
      
      // If approved, move to main users list
      if (isApproved) {
        const approvedDesigner = { ...mockAwaitingDesigners[designerIndex] };
        approvedDesigner.isActive = true;
        mockUsers.push(approvedDesigner);
      }
    }

    console.log('Application result submitted (mock):', { email, isApproved });
    return { success: true, message: isApproved ? 'Approved successfully' : 'Rejected successfully' };
  } catch (error) {
    console.error('Application result error:', error);
    throw error;
  }
};

const updatePasswordAPI = async (password, newPassword) => {
  try {
    const response = await instance.post('/api/auth/update-password', null, {
      params: {
        password,
        newPassword,
      },
    });
    console.log('Password update success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Password update error:', error.response?.data || error.message);
    throw error;
  }
};


// =============Furniture============

const updateFurnitureAPI = async (id, formData) => {
  try {
    const response = await instance.put(`/api/furnitures/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update furniture success:', response);
    return response;
  } catch (error) {
    console.error('Error updating furniture:', error.response?.data || error.message);
    throw error;
  }
};

const getAllFurnituresAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Paginate the testing services data
    const result = paginateData(mockFurnitures, pageNumber, pageSize);

    console.log('Get testing services success (mock):', result);
    
    // Return in the same format as the original API
    return {
      data: result
    };
  } catch (error) {
    console.error('Get testing services error:', error);
    throw error;
  }
};


const getAllFursByDesAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Filter testing services by designer (for now, return all services)
    // In real implementation, this would filter by designer ID
    const result = paginateData(mockFurnitures, pageNumber, pageSize);

    console.log('Get designer testing services success (mock):', result);
    
    // Return in the same format as the original API
    return {
      data: result
    };
  } catch (error) {
    console.error('Get designer testing services error:', error);
    throw error;
  }
};

const createFurnitureAPI = async (formData) => {
  try {
    const response = await instance.post('/api/furnitures', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Create furniture success:', response);
    return response;
  } catch (error) {
    console.error('Error creating furniture:', error.response?.data || error.message);
    throw error;
  }
};


// =============Design============
const getAllDesignsAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Use testing services data as "designs" in healthcare context
    const result = paginateData(mockFurnitures, pageNumber, pageSize);

    console.log('Get designs success (mock):', result);
    
    // Return in the same format as the original API
    return {
      data: result
    };
  } catch (error) {
    console.error('Get designs error:', error);
    throw error;
  }
};

const getAllDesignsByDesAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Use testing services data as "designs" in healthcare context
    const result = paginateData(mockFurnitures, pageNumber, pageSize);

    console.log('Get designer designs success (mock):', result);
    
    // Return in the same format as the original API
    return {
      data: result
    };
  } catch (error) {
    console.error('Get designs error:', error);
    throw error;
  }
};

const createDesignAPI = async (formData) => {
  try {
    const response = await instance.post('/api/designs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('Create design success:', response);
    return response;
  } catch (error) {
    console.error('Error creating design:', error.response?.data || error.message);
    throw error;
  }
};

const updateDesignAPI = async (id, formData) => {
  try {
    const response = await instance.put(`/api/designs/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('Update design success:', response);
    return response;
  } catch (error) {
    console.error('Error updating design:', error.response?.data || error.message);
    throw error;
  }
};


// =============Order============

const getAllOrdersByDesAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    const response = await instance.get('/api/designer/orders', {
      params: { pageNumber, pageSize },
    });
    console.log('Get all orders by designer success:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error getting orders by designer:', error);
    throw error;
  }
};

const getOrdersById = async (orderId) => {
  try {
    // Add realistic delay for mock API
    await mockApiDelay();
    
    // Find order by ID in mock data
    const order = mockOrders.find(o => o.id === orderId || o.id === String(orderId));
    
    if (!order) {
      throw new Error(`Order with ID ${orderId} not found`);
    }
    
    console.log('Get order by ID success (mock):', order);
    return order;
  } catch (error) {
    console.error(`Error getting order with ID ${orderId}:`, error);
    throw error;
  }
};

const getAllOrdersAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Paginate the orders data
    const result = paginateData(mockOrders, pageNumber, pageSize);

    console.log('Get all orders success (mock):', result);
    return result;
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// =============User============

const getAllAccountsAPI = async (role = null, pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Filter users by role if specified
    let filteredUsers = filterUsersByRole(mockUsers, role);

    // Paginate the results
    const result = paginateData(filteredUsers, pageNumber, pageSize);

    console.log('Get all accounts success (mock):', result);
    return result;
  } catch (error) {
    console.error('Error getting accounts:', error);
    throw error;
  }
};

const getAwaitingDesignersAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Paginate the awaiting designers
    const result = paginateData(mockAwaitingDesigners, pageNumber, pageSize);

    console.log('Get awaiting designers success (mock):', result);
    return result;
  } catch (error) {
    console.error('Error getting awaiting designers:', error);
    throw error;
  }
};

// =============Category============

const getAllCategoriesAPI = async (style = null, pageNumber = -1, pageSize = -1) => {
  try {
    const params = {};

    if (style !== null) {
      // Giữ style là kiểu boolean ngay từ đầu (true hoặc false)
      params.style = style;
    }

    if (pageNumber !== -1) {
      params.pageNumber = pageNumber;
    }

    if (pageSize !== -1) {
      params.pageSize = pageSize;
    }

    const response = await instance.get('/api/categories', { params });
    console.log('Get all categories success:', response);
    return response.data.items;
  } catch (error) {
    console.error('Error getting categories:', error.response?.data || error.message);
    throw error;
  }
};

// =============Product============

const getProductByIdAPI = async (id) => {
  try {
    const response = await instance.get(`/api/products/${id}`);
    console.log('Get product by ID success:', response.data);
    const data = response.data?.data || response.data; 
    return data;
  } catch (error) {
    console.error('Error getting product by ID:', error.response?.data || error.message);
    throw error;
  }
};

const getNewProductsAPI = async (pageNumber = -1, pageSize = -1) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Paginate the new products data
    const result = paginateData(mockNewProducts, pageNumber, pageSize);

    console.log('Get new products success (mock):', result);
    return result;
  } catch (error) {
    console.error('Error getting new products:', error);
    throw error;
  }
};

const createNewProductAPI = async (id) => {
  try {
    const response = await instance.post('/api/products/new', null, {
      params: { id },
    });
    console.log('Create new product success:', response);
    return response;
  } catch (error) {
    console.error('Error creating new product:', error.response?.data || error.message);
    throw error;
  }
};


// ==================Dashboard==================

const getRevenueByDayAPI = async (month, year) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Generate mock revenue data for the specified month/year
    const revenueData = mockRevenueByDay(month, year);

    console.log('Get revenue by day success (mock):', revenueData);
    return revenueData;
  } catch (error) {
    console.error('Error getting revenue by day:', error);
    throw error;
  }
};

const getDesignerRevenueByDayAPI = async (month, year) => {
  try {
    const response = await instance.get('/api/dashboard/designer/revenue-by-day', {
      params: { month, year },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getTopDesignersByRevenueAPI = async (topN = 5) => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    // Return top N designers
    const topDesigners = mockTopDesigners.slice(0, topN);

    console.log('Get top designers success (mock):', topDesigners);
    return topDesigners;
  } catch (error) {
    console.error('Error getting top designers:', error);
    throw error;
  }
};

const getOrderStatusByMonthAPI = async () => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    console.log('Get order status by month success (mock):', mockOrdersByMonth);
    return mockOrdersByMonth;
  } catch (error) {
    console.error('Error getting order status by month:', error);
    throw error;
  }
};

const getCustomerGrowthAPI = async () => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    console.log('Get customer growth success (mock):', mockCustomerGrowth);
    return mockCustomerGrowth;
  } catch (error) {
    console.error('Error getting customer growth:', error);
    throw error;
  }
};

const getTopProductsAPI = async () => {
  try {
    // Mock API delay
    await mockApiDelay(500);

    console.log('Get top products success (mock):', mockTopProducts);
    return mockTopProducts;
  } catch (error) {
    console.error('Error getting top products:', error);
    throw error;
  }
};

const getTopProductsWithReviewsAPI = async () => {
  try {
    const response = await instance.get('/api/dashboard/top-products-reviews');
    
    if (Array.isArray(response.data?.data)) {
      return response.data.data;
    }

    if (Array.isArray(response.data)) {
      return response.data;
    }

    if (Array.isArray(response)) {
      return response;
    }

    return [];
  } catch (error) {
    return [];
  }
};

// ==================Conversations==================

const getAllConversationsAPI = async () => {
  try {
    const response = await instance.get(`/api/conversations`);
    console.log("Raw conversation API response:", response);
    if (Array.isArray(response)) return response;
    if (Array.isArray(response?.data)) return response.data;
    return [];
  } catch (error) {
    console.error("Failed to fetch conversations:", error);
    return [];
  }
};

const getConversationByIdAPI = async (id) => {
  try {
    const response = await instance.get(`/api/conversations/${id}`);
    console.log('Messages in conversation:', response);
    return response;
  } catch (error) {
    console.error('Error getting conversation by ID:', error);
    return [];
  }
};


export {
  getAllConversationsAPI,
  getConversationByIdAPI,
  getTopProductsWithReviewsAPI,
  getTopProductsAPI,
  getDesignerRevenueByDayAPI,
  getCustomerGrowthAPI,
  getOrderStatusByMonthAPI,
  getTopDesignersByRevenueAPI,
  getRevenueByDayAPI,
  getProductByIdAPI,
  loginDesignerAPI,
  getAllFurnituresAPI,
  getAllDesignsAPI,
  getAllDesignsByDesAPI,
  getAllFursByDesAPI,
  getAllOrdersByDesAPI,
  getOrdersById,
  getAllOrdersAPI,
  registerDesignerAPI,
  applicationResultAPI,
  updatePasswordAPI,
  forgetPasswordAPI,
  resetPasswordAPI,
  getAllAccountsAPI,
  getAwaitingDesignersAPI,
  createFurnitureAPI,
  getAllCategoriesAPI,
  getNewProductsAPI,
  createNewProductAPI,
  createDesignAPI,
  updateDesignAPI,
  updateFurnitureAPI
};
