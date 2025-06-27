import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, Typography, Avatar, Stack, MenuItem, Select, FormControl } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {
  getAllAccountsAPI,
  getNewProductsAPI,
  getRevenueByDayAPI,
  getAllOrdersAPI,
  getTopDesignersByRevenueAPI,
  getOrderStatusByMonthAPI,
  getCustomerGrowthAPI,
} from '../../services/UsersSevices';
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
    if (selectedMonth && selectedYear) {
      fetchRevenueData(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  const fetchRevenueData = async (month, year) => {
    try {
      console.log("Fetching data for:", month, year);
      const res = await getRevenueByDayAPI(month, year);
      console.log("Revenue data from API:", res);

      const rawData = res || [];
      console.log("Raw revenue data:", rawData);

      const cleanData = rawData.map(item => ({
        day: Number(item.day),
        revenue: Number(item.revenue),
      }));
      console.log("Clean revenue data:", cleanData);

      setRevenueData(cleanData);
    } catch (err) {
      console.error('Lỗi khi lấy doanh thu theo ngày:', err);
    }
  };

  const fetchTopDesigners = async () => {
    try {
      const res = await getTopDesignersByRevenueAPI(5);
      const data = res || [];
      console.log("Top designers raw data:", data);

      const transformedData = data.map(designer => ({
        name: designer.accountName,
        revenue: designer.totalIncome,
      }));

      setDesignerData(transformedData);
    } catch (err) {
      console.error("Lỗi khi lấy top nhà thiết kế:", err);
    }
  };

  const fetchTotalRevenueFromOrders = async () => {
    try {
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
      const res = await getCustomerGrowthAPI();
      const rawData = res || [];

      const formatted = rawData.map(item => ({
        name: `Tháng ${item.month}`,
        count: item.count,
      }));

      setUserGrowthData(formatted);
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu tăng trưởng khách hàng:', err);
    }
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  useEffect(() => {
    fetchAccounts();
    fetchData();
    fetchTopDesigners();
    fetchTotalRevenueFromOrders();
    fetchOrderSystemData();
    fetchCustomerGrowth();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await getAllAccountsAPI();
      const items = response.items || [];
      const designerCount = items.filter(user => user.role === 1).length;
      setTotalDesigners(designerCount);
    } catch (err) {
      console.error('Error fetching accounts:', err);
    }
  };

  const fetchData = async () => {
    try {
      const res = await getNewProductsAPI();
      const total = res?.items?.length || 0;
      setTotalProducts(total);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  return (
    <Box >
      <Grid container spacing={2} sx={{ mt: 0 }}>
        {/* Total User */}
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '70%', position: 'relative' }}>
            {/* Icon góc phải */}
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar sx={{ bgcolor: '#E9E5FB', width: 56, height: 56 }}>
                <GroupsIcon sx={{ color: '#5B50E5', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography variant="body2" color="textSecondary" fontWeight={500} marginBottom={2}>
              Tổng nhà thiết kế
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>{totalDesigners}</Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingUpIcon sx={{ color: 'green', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'green', fontWeight: 500 }}>8.5%</Typography>
              <Typography variant="body2" color="textSecondary">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Total Order */}
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '70%', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar sx={{ bgcolor: '#FDEBD3', width: 56, height: 56 }}>
                <AccessTimeIcon sx={{ color: '#F59E0B', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography variant="body2" color="textSecondary" fontWeight={500} marginBottom={2}>
              Nhà thiết kế chờ duyệt
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>0</Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingDownIcon sx={{ color: 'red', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'red', fontWeight: 500 }}>0.3%</Typography>
              <Typography variant="body2" color="textSecondary">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Total Pending */}
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '70%', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar sx={{ bgcolor: '#FFEFE3', width: 56, height: 56 }}>
                <InventoryIcon sx={{ color: '#F97316', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography variant="body2" color="textSecondary" fontWeight={500} marginBottom={2}>
              Sản phẩm chờ duyệt
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>{totalProducts}</Typography>

            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingUpIcon sx={{ color: 'green', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'green', fontWeight: 500 }}>1.8%</Typography>
              <Typography variant="body2" color="textSecondary">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Grid>

        {/* Total Sales */}
        <Grid item xs={12} sm={6} md={3} sx={{ flex: 1 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2, height: '70%', position: 'relative' }}>
            <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
              <Avatar sx={{ bgcolor: '#DDF5EC', width: 56, height: 56 }}>
                <ShoppingCartIcon sx={{ color: '#22C55E', fontSize: 30 }} />
              </Avatar>
            </Box>

            <Typography variant="body2" color="textSecondary" fontWeight={500} marginBottom={2}>
              Tổng doanh thu
            </Typography>
            <Typography variant="h4" fontWeight="bold" mt={1}>
              {(orderTotalRevenue % 1000000 === 0
                ? (orderTotalRevenue / 1000000).toFixed(0)
                : (orderTotalRevenue / 1000000).toFixed(2)
              ) + "M VNĐ"
              }
            </Typography>


            <Stack direction="row" alignItems="center" spacing={0.5} mt={2}>
              <TrendingDownIcon sx={{ color: 'red', fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: 'red', fontWeight: 500 }}>4.3%</Typography>
              <Typography variant="body2" color="textSecondary">So với hôm qua</Typography>
            </Stack>
          </Card>
        </Grid>

      </Grid>

      {/* Line Chart */}
      <Card sx={{ mt: 4, p: 3, borderRadius: 3, boxShadow: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={5}>
          <Typography variant="h6" fontWeight="bold">Doanh thu theo ngày trong tháng</Typography>
          <Stack direction="row" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <Select value={selectedMonth} onChange={handleMonthChange}>
                {[...Array(12).keys()].map(i => (
                  <MenuItem key={i + 1} value={i + 1}>{`Tháng ${i + 1}`}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" sx={{ minWidth: 100 }}>
              <Select value={selectedYear} onChange={handleYearChange}>
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
      <Grid container spacing={2} mt={4}>
        {/* Bar chart top 5 nhà thiết kế doanh thu cao */}
        <Grid item xs={12} md={6} sx={{ flex: 1 }}>
          <Card sx={{ p: 3, borderRadius: 3, boxShadow: 2 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>Top nhà thiết kế doanh thu cao</Typography>
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
        </Grid>
      </Grid>

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
