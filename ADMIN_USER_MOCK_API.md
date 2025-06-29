# Admin Mock API Documentation

## Overview
This document describes the mock API implementation for admin management functionality. The mock data simulates realistic user, testing service, and dashboard data for development and testing purposes.

## Mock Data Structure

### User Object
```javascript
{
  id: number,
  name: string,
  email: string,
  role: number, // 0: Admin, 1: Designer, 2: Customer
  createdAt: string, // ISO date string
  isActive: boolean
}
```

### Awaiting Designer Object
```javascript
{
  id: number,
  name: string,
  email: string,
  role: number, // Always 1 for designers
  createdAt: string, // ISO date string
  isActive: boolean, // Always false for pending
  applicationUrl: string, // Google Drive link
  status: string // "pending", "approved", "rejected"
}
```

### Testing Service Object
```javascript
{
  id: number,
  name: string,
  price: number,
  category: string, // "Huyết học", "Sản khoa", "Nội tiết", "Chẩn đoán hình ảnh", etc.
  designer: string, // Designer name
  designerId: number, // Designer ID
  createdAt: string, // ISO date string
  status: string, // "active", "inactive"
  primaryImage: {
    imageSource: string // Image URL
  },
  description: string,
  materials: string[], // Array of medical equipment
  dimensions: string // Duration/time required
}
```

### Order Object (Payment Service Object)
```javascript
{
  id: string, // Payment ID (e.g., "PAY001")
  designer: {
    id: number,
    name: string // Doctor/Healthcare provider name
  },
  customer: {
    id: number,
    name: string // Patient name
  },
  orderPrice: number, // Total payment amount
  date: string, // ISO date string
  status: string, // "Pending", "Processing", "Delivered", "Refunded", "Cancelled"
  orderDetails: [
    {
      id: number,
      product: {
        id: number,
        name: string, // Medical service name
        price: number
      },
      quantity: number, // Usually 1 for medical services
      detailPrice: number // quantity * price
    }
  ],
  statuses: [
    {
      name: string, // Status name
      time: string // ISO date string
    }
  ]
}
```

### Dashboard Objects
```javascript
// Revenue by day
{
  day: number,
  revenue: number
}

// Top designer
{
  accountName: string,
  totalIncome: number
}

// Order status
{
  month: number,
  processing: number,
  delivered: number,
  cancelled: number
}

// Customer growth
{
  month: number,
  count: number
}

// Order
{
  id: number,
  customerName: string,
  orderPrice: number,
  status: string,
  createdAt: string
}
```

## Available APIs

### 1. getAllAccountsAPI(role, pageNumber, pageSize)
**Purpose**: Get all user accounts with optional filtering and pagination

**Parameters**:
- `role` (optional): Filter by user role (0=Admin, 1=Designer, 2=Customer)
- `pageNumber` (optional): Page number for pagination (-1 for all)
- `pageSize` (optional): Number of items per page (-1 for all)

**Returns**:
```javascript
{
  items: User[], // Array of user objects
  totalCount: number, // Total number of users
  currentPage: number, // Current page number
  totalPages: number // Total number of pages
}
```

**Mock Data**: 12 users total
- 2 Admins (role: 0)
- 5 Designers (role: 1) 
- 5 Customers (role: 2)

### 2. getAwaitingDesignersAPI(pageNumber, pageSize)
**Purpose**: Get designers awaiting approval with pagination

**Parameters**:
- `pageNumber` (optional): Page number for pagination (-1 for all)
- `pageSize` (optional): Number of items per page (-1 for all)

**Returns**:
```javascript
{
  items: AwaitingDesigner[], // Array of awaiting designer objects
  totalCount: number, // Total number of awaiting designers
  currentPage: number, // Current page number
  totalPages: number // Total number of pages
}
```

**Mock Data**: 4 awaiting designers

### 3. applicationResultAPI(email, isApproved)
**Purpose**: Approve or reject a designer application

**Parameters**:
- `email`: Email of the designer to approve/reject
- `isApproved`: Boolean indicating approval status

**Returns**:
```javascript
{
  success: boolean,
  message: string
}
```

**Behavior**:
- Updates the designer's status in mock data
- If approved, moves designer to main users list and sets isActive: true
- Simulates 500ms API delay

### 4. getAllFurnituresAPI(pageNumber, pageSize)
**Purpose**: Get all testing services with pagination

**Parameters**:
- `pageNumber` (optional): Page number for pagination (-1 for all)
- `pageSize` (optional): Number of items per page (-1 for all)

**Returns**:
```javascript
{
  data: {
    items: TestingService[], // Array of testing service objects
    totalCount: number, // Total number of testing services
    currentPage: number, // Current page number
    totalPages: number // Total number of pages
  }
}
```

**Mock Data**: 10 testing services
- Categories: Huyết học, Sản khoa, Nội tiết, Chẩn đoán hình ảnh, Vi sinh, Ung thư học, Sinh hóa, Tim mạch
- Price range: 80,000đ - 1,200,000đ
- All services have realistic medical images from Unsplash

### 5. getAllFursByDesAPI(pageNumber, pageSize)
**Purpose**: Get testing services created by designers (currently returns all services)

**Parameters**:
- `pageNumber` (optional): Page number for pagination (-1 for all)
- `pageSize` (optional): Number of items per page (-1 for all)

**Returns**: Same as getAllFurnituresAPI

### 6. getNewProductsAPI(pageNumber, pageSize)
**Purpose**: Get new/pending testing services

**Parameters**:
- `pageNumber` (optional): Page number for pagination (-1 for all)
- `pageSize` (optional): Number of items per page (-1 for all)

**Returns**: Paginated response with pending testing services

**Mock Data**: 3 pending testing services

### 7. getRevenueByDayAPI(month, year)
**Purpose**: Get daily revenue data for a specific month/year

**Parameters**:
- `month`: Month number (1-12)
- `year`: Year (e.g., 2024)

**Returns**: Array of daily revenue objects
```javascript
[
  { day: 1, revenue: 1500000 },
  { day: 2, revenue: 1200000 },
  // ... more days
]
```

**Behavior**: Generates realistic revenue data with weekend bonuses and random variations

### 8. getTopDesignersByRevenueAPI(topN)
**Purpose**: Get top designers by revenue

**Parameters**:
- `topN`: Number of top designers to return (default: 5)

**Returns**: Array of top designer objects

**Mock Data**: 5 top designers with revenue ranging from 25M-45M VND

### 9. getAllOrdersAPI(pageNumber, pageSize)
**Purpose**: Get all orders for revenue calculation

**Parameters**:
- `pageNumber` (optional): Page number for pagination (-1 for all)
- `pageSize` (optional): Number of items per page (-1 for all)

**Returns**: Paginated response with order objects

**Mock Data**: 5 orders with total revenue of 12.55M VND

### 10. getOrderStatusByMonthAPI()
**Purpose**: Get order status statistics by month

**Returns**: Array of monthly order status objects

**Mock Data**: 6 months of order status data with processing, delivered, and cancelled counts

### 11. getCustomerGrowthAPI()
**Purpose**: Get customer growth statistics by month

**Returns**: Array of monthly customer growth objects

**Mock Data**: 6 months of customer growth data from 120 to 248 customers

### 12. getTopProductsAPI()
**Purpose**: Get top performing products/services

**Returns**: Array of top product objects with sales and revenue data

**Mock Data**: 3 top testing services with sales counts and revenue

### 13. getAllOrdersAPI(pageNumber, pageSize)
**Purpose**: Get all service payments with pagination

**Parameters**:
- `pageNumber` (optional): Page number for pagination (-1 for all)
- `pageSize` (optional): Number of items per page (-1 for all)

**Returns**:
```javascript
{
  items: Order[], // Array of payment objects
  totalCount: number, // Total number of payments
  currentPage: number, // Current page number
  totalPages: number // Total number of pages
}
```

**Mock Data**: 8 service payments with different statuses and realistic details

### 14. getOrdersById(orderId)
**Purpose**: Get detailed information about a specific service payment

**Parameters**:
- `orderId`: String ID of the payment (e.g., "PAY001")

**Returns**: Single Payment object with full details including services and status history

**Mock Data**: Each payment includes:
- Patient and doctor information
- Payment details with medical services
- Full status history from creation to completion
- Realistic pricing and dates for medical services
```

## Features

### Realistic Data
- Vietnamese names and realistic email addresses
- Proper role assignments and timestamps
- Realistic testing services with actual medical images from Unsplash
- Proper pricing for medical services
- Detailed service descriptions and equipment requirements

### Pagination Support
- Supports both paginated and non-paginated requests
- Returns proper pagination metadata
- Handles edge cases (empty results, invalid pages)

### Filtering Support
- **Users**: Filter by role (Admin, Designer, Customer)
- **Testing Services**: Search by name, category, or designer name
- Maintains consistent filtering logic

### Simulated API Delays
- 500ms delay on all mock API calls
- Provides realistic user experience during development
- Helps test loading states and error handling

## Usage Example

```javascript
// Get all users
const allUsers = await getAllAccountsAPI();

// Get only designers with pagination
const designers = await getAllAccountsAPI(1, 1, 5);

// Get awaiting designers
const awaitingDesigners = await getAwaitingDesignersAPI(1, 10);

// Approve a designer
const result = await applicationResultAPI('pending1@gmail.com', true);

// Get all testing services
const testingServices = await getAllFurnituresAPI();

// Get testing services with pagination
const paginatedServices = await getAllFurnituresAPI(1, 6);

// Get all service payments
const allOrders = await getAllOrdersAPI();

// Get payments with pagination
const paginatedOrders = await getAllOrdersAPI(1, 5);

// Get specific payment details
const orderDetails = await getOrdersById('PAY001');

// Dashboard APIs
const revenueData = await getRevenueByDayAPI(6, 2024);
const topDesigners = await getTopDesignersByRevenueAPI(5);
const allOrders = await getAllOrdersAPI();
const orderStatus = await getOrderStatusByMonthAPI();
const customerGrowth = await getCustomerGrowthAPI();
const newProducts = await getNewProductsAPI();
const topProducts = await getTopProductsAPI();
```

## Integration

The mock API is integrated into the existing service layer by:
1. Importing mock data and utilities from `mockData.js`
2. Replacing real API calls with mock implementations
3. Maintaining the same function signatures and return types
4. Adding realistic delays to simulate network requests

This allows seamless switching between mock and real APIs during development.