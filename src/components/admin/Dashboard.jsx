import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Avatar, Stack, MenuItem, Select, FormControl } from '@mui/material';
import './AdminDashboard.css';
import GroupsIcon from '@mui/icons-material/Groups';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  getAllUsersAPI,
  //getNewProductsAPI,
  //getRevenueByDayAPI,
  //getAllOrdersAPI,
  //getTopDesignersByRevenueAPI,
  //getOrderStatusByMonthAPI,
  //getCustomerGrowthAPI,
} from '../../services/AdminService';

// Import new dashboard API endpoints
import {
  //getDashboardStatsAPI,
  //getReportsOverviewAPI,
  //getReportsBookingsAPI,
  //getReportsFinancialsAPI,
  //getReportsUsersAPI,
  //getReportsConsultantsAPI,
  getReportsServicesAPI
} from '../../services/AdminService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  Legend
} from 'recharts';
// import { Tooltip as MuiTooltip } from '@mui/material';

const Dashboard = () => {
  const [orderTotalRevenue, setOrderTotalRevenue] = useState(0);
  const currentYear = new Date().getFullYear();

  const [selectedMonth, setSelectedMonth] = useState(() => new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());

  const [userGrowthData, setUserGrowthData] = useState([]);
  const [orderSystemData, setOrderSystemData] = useState([]);
  const [designerData, setDesignerData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [totalDesigners, setTotalDesigners] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    // Fetch dashboard stats when component mounts
    fetchDashboardStats();

    // Fetch revenue data when month/year changes
    if (selectedMonth && selectedYear) {
      fetchRevenueData(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const fetchDashboardStats = async () => {
    try {
      // Get dashboard overview stats
      // const statsResponse = await getDashboardStatsAPI();
      // console.log("Dashboard stats:", statsResponse);

      // Update state with dashboard stats
      // if (statsResponse && statsResponse.data) {
      //   const stats = statsResponse.data;
      //   setTotalDesigners(stats.totalConsultants || 0);
      //   setTotalProducts(stats.totalServices || 0);
      //   setOrderTotalRevenue(stats.totalRevenue || 0);
      // }

      // Get overview reports for additional data
      // const overviewResponse = await getReportsOverviewAPI();
      // console.log("Overview reports:", overviewResponse);

    } catch (err) {
      console.error('Lỗi khi lấy thống kê dashboard:', err);
    }
  };

  const fetchRevenueData = async (month, year) => {
    try {
      // Format dates for API
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;

      // Get financial reports with date range
      const response = await getReportsFinancialsAPI(startDate, endDate, 'daily');
      console.log("Financial reports:", response);

      if (response && response.data) {
        const rawData = response.data || [];

        // Transform data for chart
        const cleanData = rawData.map(item => ({
          day: new Date(item.date).getDate(),
          revenue: Number(item.amount || 0),
        }));

        setRevenueData(cleanData);
      }
    } catch (err) {
      console.error('Lỗi khi lấy doanh thu theo ngày:', err);
    }
  };

  const fetchTopDesigners = async () => {
    try {
      // Use new consultants report API
      // const response = await getReportsConsultantsAPI();
      // console.log("Consultants report:", response);

      // if (response && response.data) {
      //   const data = response.data || [];

      //   // Transform data for chart
      //   const transformedData = data.slice(0, 5).map(consultant => ({
      //     name: consultant.fullName || consultant.name,
      //     revenue: consultant.totalRevenue || consultant.totalIncome || 0,
      //   }));

      //   setDesignerData(transformedData);
      // }
    } catch (err) {
      console.error("Lỗi khi lấy báo cáo tư vấn viên:", err);
    }
  };

  const fetchTotalRevenueFromOrders = async () => {
    try {
      // This is now handled in fetchDashboardStats
      // But keep this function for backward compatibility
      const res = await getAllOrdersAPI();
      const orders = res?.items || [];
      const total = orders.reduce((sum, order) => sum + (order.orderPrice || 0), 0);
      setOrderTotalRevenue(total);
    } catch (err) {
      console.error('Lỗi khi tính tổng doanh thu từ đơn hàng:', err);
    }
  };

  const fetchOrderSystemData = async () => {
    try {
      const res = await getOrderStatusByMonthAPI();
      const rawData = res || [];

      const formatted = rawData.map(item => ({
        name: `Tháng ${item.month}`,
        processing: item.processing,
        delivered: item.delivered,
        cancelled: item.cancelled,
      }));

      setOrderSystemData(formatted);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu đơn hàng hệ thống:', err);
    }
  };

  const fetchCustomerGrowth = async () => {
    try {
      // Use new users report API
      // const currentDate = new Date();
      // const startDate = new Date(currentDate.getFullYear(), 0, 1).toISOString().split('T')[0]; // Start of year
      // const endDate = currentDate.toISOString().split('T')[0]; // Today

      // const response = await getReportsUsersAPI(startDate, endDate, 'monthly');
      // console.log("Users report:", response);

      // if (response && response.data) {
      //   const rawData = response.data || [];

      //   // Transform data for chart
      //   const formatted = rawData.map(item => ({
      //     name: `Tháng ${item.period || item.month}`,
      //     count: item.count || item.newUsers || 0,
      //   }));

      //   setUserGrowthData(formatted);
      // }
    } catch (err) {
      console.error('Lỗi khi lấy báo cáo người dùng:', err);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    // Fetch all dashboard data on component mount
    // fetchDashboardStats();
    // fetchTopDesigners();
    fetchOrderSystemData();
    // fetchCustomerGrowth();
    fetchData();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await getAllUsersAPI();
      const items = response.content || response.items || [];
      const designerCount = items.filter(user => user.roleName === 'CONSULTANT').length;
      setTotalDesigners(designerCount);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const fetchData = async () => {
    try {
      // Sửa: truyền pageNumber=1, pageSize=10 để tránh truyền -1
      const res = await getNewProductsAPI(1, 10);
      const total = res?.items?.length || 0;
      setTotalProducts(total);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  return (
    <Box className="admin-dashboard-container">
      <Box sx={{ display: 'flex', gap: 3, mt: 0, flexWrap: 'wrap', p: 2 }}>
        {/* Total User */}
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card className="admin-stat-card" sx={{ height: '180px', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar className="admin-stat-icon">
                <GroupsIcon sx={{ color: '#354766', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography className="admin-stat-title" variant="body2" marginBottom={2}>
              Tổng tư vấn viên
            </Typography>
            <Typography className="admin-stat-value" variant="h4" mt={1}>{totalDesigners}</Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingUpIcon sx={{ color: '#22C55E', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#22C55E', fontWeight: 600 }}>8.5%</Typography>
              <Typography className="admin-stat-trend" variant="body2">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Box>

        {/* Total Order */}
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card className="admin-stat-card" sx={{ height: '180px', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar className="admin-stat-icon">
                <AccessTimeIcon sx={{ color: '#354766', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography className="admin-stat-title" variant="body2" marginBottom={2}>
              Tư vấn viên chờ duyệt
            </Typography>
            <Typography className="admin-stat-value" variant="h4" mt={1}>0</Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingDownIcon sx={{ color: '#EF4444', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 600 }}>0.3%</Typography>
              <Typography className="admin-stat-trend" variant="body2">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Box>

        {/* Total Pending */}
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card className="admin-stat-card" sx={{ height: '180px', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar className="admin-stat-icon">
                <InventoryIcon sx={{ color: '#354766', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography className="admin-stat-title" variant="body2" marginBottom={2}>
              Dịch vụ xét nghiệm
            </Typography>
            <Typography className="admin-stat-value" variant="h4" mt={1}>{totalProducts}</Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingUpIcon sx={{ color: '#22C55E', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#22C55E', fontWeight: 600 }}>1.8%</Typography>
              <Typography className="admin-stat-trend" variant="body2">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Box>

        {/* Total Sales */}
        <Box sx={{ flex: '1 1 300px', minWidth: '250px' }}>
          <Card className="admin-stat-card" sx={{ height: '180px', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar className="admin-stat-icon">
                <ShoppingCartIcon sx={{ color: '#354766', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography className="admin-stat-title" variant="body2" marginBottom={2}>
              Tổng doanh thu
            </Typography>
            <Typography className="admin-stat-value" variant="h4" mt={1}>
              {(orderTotalRevenue % 1000000 === 0
                ? (orderTotalRevenue / 1000000).toFixed(0)
                : (orderTotalRevenue / 1000000).toFixed(2)
              ) + "M VNĐ"
              }
            </Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingDownIcon sx={{ color: '#EF4444', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#EF4444', fontWeight: 600 }}>4.3%</Typography>
              <Typography className="admin-stat-trend" variant="body2">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Box>

      </Box>

      {/* Line Chart */}
      <Card className="admin-chart-container" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography className="admin-chart-title" variant="h6">Doanh thu theo ngày trong tháng</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }} className="admin-form-control">
              <Select
                value={selectedMonth}
                onChange={handleMonthChange}
                sx={{
                  fontWeight: 600,
                  color: '#354766',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(179, 204, 212, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(179, 204, 212, 0.5)',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 200 }
                  },
                  disablePortal: true,
                  keepMounted: false
                }}
              >
                {[...Array(12).keys()].map(i => (
                  <MenuItem key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }} className="admin-form-control">
              <Select
                value={selectedYear}
                onChange={handleYearChange}
                sx={{
                  fontWeight: 600,
                  color: '#354766',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(179, 204, 212, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(179, 204, 212, 0.5)',
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: { maxHeight: 200 }
                  },
                  disablePortal: true,
                  keepMounted: false
                }}
              >
                {[currentYear - 2, currentYear - 1, currentYear].map(year => (
                  <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </Box>

        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#89B9AD" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Card>

      {/* Phần biểu đồ ngang gồm 2 biểu đồ BarChart và Donut Chart */}
      <Box sx={{ display: 'flex', gap: 2, mt: 4, flexWrap: 'wrap' }}>
        {/* Bar chart top 5 tư vấn viên doanh thu cao */}
        <Box sx={{ flex: '1 1 500px', minWidth: '400px' }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Top tư vấn viên doanh thu cao</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={designerData} layout="vertical" margin={{ top: 20, right: 20, left: 18, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" height={20} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" />
                <Tooltip
                  formatter={(value) => [`${value.toLocaleString()} VNĐ`, 'Doanh thu']}
                />
                <Bar dataKey="revenue" fill="#4DA8DA" barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Box>
      </Box>

      {/* Stacked Bar chart đơn hàng toàn hệ thống */}
      <Card sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Đơn hàng toàn hệ thống theo tháng
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orderSystemData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => `${value} đơn`} />
            <Legend />
            <Bar dataKey="processing" fill="#FFD586" name="Đang xử lý" />
            <Bar dataKey="delivered" fill="#84AE92" name="Đã giao" />
            <Bar dataKey="cancelled" fill="#FF9E9E" name="Đã huỷ" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>Tăng trưởng người dùng theo tháng</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userGrowthData}>
            <defs>
              <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUsers)"
              name="Người dùng"
            />
          </AreaChart>
        </ResponsiveContainer>
      </Card>

    </Box>
  );
};

export default Dashboard;
