// Test script for Dashboard Mock APIs

import { 
  getAllAccountsAPI, 
  getNewProductsAPI,
  getRevenueByDayAPI,
  getAllOrdersAPI,
  getTopDesignersByRevenueAPI,
  getOrderStatusByMonthAPI,
  getCustomerGrowthAPI,
  getTopProductsAPI
} from '../services/UsersSevices.js';

async function testDashboardMockAPIs() {
  console.log('🚀 Testing Dashboard Mock APIs...\n');

  try {
    // Test 1: Get total designers count
    console.log('👥 Test 1: Get total designers');
    const allUsers = await getAllAccountsAPI();
    const designers = allUsers.items.filter(user => user.role === 1);
    console.log(`Total designers: ${designers.length}`);
    console.log('✅ Passed\n');

    // Test 2: Get new products (pending services)
    console.log('🆕 Test 2: Get new testing services');
    const newProducts = await getNewProductsAPI();
    console.log(`Total pending services: ${newProducts.totalCount}`);
    console.log(`Services:`, newProducts.items.map(p => p.name));
    console.log('✅ Passed\n');

    // Test 3: Get revenue by day for current month
    console.log('💰 Test 3: Get revenue by day (June 2024)');
    const revenueData = await getRevenueByDayAPI(6, 2024);
    console.log(`Revenue data points: ${revenueData.length}`);
    console.log(`First 3 days:`, revenueData.slice(0, 3));
    console.log('✅ Passed\n');

    // Test 4: Get all orders for total revenue calculation
    console.log('📦 Test 4: Get all orders');
    const allOrders = await getAllOrdersAPI();
    const totalRevenue = allOrders.items.reduce((sum, order) => sum + order.orderPrice, 0);
    console.log(`Total orders: ${allOrders.totalCount}`);
    console.log(`Total revenue: ${totalRevenue.toLocaleString()}đ`);
    console.log('✅ Passed\n');

    // Test 5: Get top designers by revenue
    console.log('🏆 Test 5: Get top designers by revenue');
    const topDesigners = await getTopDesignersByRevenueAPI(5);
    console.log(`Top designers:`, topDesigners.map(d => ({ 
      name: d.accountName, 
      revenue: d.totalIncome.toLocaleString() + 'đ'
    })));
    console.log('✅ Passed\n');

    // Test 6: Get order status by month
    console.log('📊 Test 6: Get order status by month');
    const orderStatus = await getOrderStatusByMonthAPI();
    console.log(`Order status data:`, orderStatus);
    console.log('✅ Passed\n');

    // Test 7: Get customer growth
    console.log('📈 Test 7: Get customer growth');
    const customerGrowth = await getCustomerGrowthAPI();
    console.log(`Customer growth data:`, customerGrowth);
    console.log('✅ Passed\n');

    // Test 8: Get top products
    console.log('🔝 Test 8: Get top products');
    const topProducts = await getTopProductsAPI();
    console.log(`Top products:`, topProducts.map(p => ({ 
      name: p.name, 
      sales: p.sales,
      revenue: p.revenue.toLocaleString() + 'đ'
    })));
    console.log('✅ Passed\n');

    // Test 9: Revenue analysis
    console.log('💡 Test 9: Revenue analysis');
    const totalRevenueFromData = revenueData.reduce((sum, day) => sum + day.revenue, 0);
    const avgDailyRevenue = Math.round(totalRevenueFromData / revenueData.length);
    const maxDailyRevenue = Math.max(...revenueData.map(d => d.revenue));
    console.log(`Total monthly revenue: ${totalRevenueFromData.toLocaleString()}đ`);
    console.log(`Average daily revenue: ${avgDailyRevenue.toLocaleString()}đ`);
    console.log(`Max daily revenue: ${maxDailyRevenue.toLocaleString()}đ`);
    console.log('✅ Passed\n');

    // Test 10: Order statistics
    console.log('📋 Test 10: Order statistics');
    const totalProcessing = orderStatus.reduce((sum, month) => sum + month.processing, 0);
    const totalDelivered = orderStatus.reduce((sum, month) => sum + month.delivered, 0);
    const totalCancelled = orderStatus.reduce((sum, month) => sum + month.cancelled, 0);
    const totalOrdersFromStatus = totalProcessing + totalDelivered + totalCancelled;
    console.log(`Total orders from status: ${totalOrdersFromStatus}`);
    console.log(`Processing: ${totalProcessing}, Delivered: ${totalDelivered}, Cancelled: ${totalCancelled}`);
    console.log(`Success rate: ${((totalDelivered / totalOrdersFromStatus) * 100).toFixed(1)}%`);
    console.log('✅ Passed\n');

    console.log('🎉 All Dashboard tests completed successfully!');

  } catch (error) {
    console.error('❌ Dashboard test failed:', error);
  }
}

// Export for use in other files
export { testDashboardMockAPIs };

// Auto-run if this file is imported as a module
// testDashboardMockAPIs();
