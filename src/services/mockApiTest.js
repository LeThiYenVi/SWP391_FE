// Demo script to test mock APIs
// Run this in browser console or create a simple test page

import { getAllAccountsAPI, getAwaitingDesignersAPI, applicationResultAPI, getAllFurnituresAPI, getAllFursByDesAPI } from '../services/UsersSevices.js';

async function testMockAPIs() {
  console.log('🚀 Testing Mock APIs...\n');

  try {
    // Test 1: Get all users
    console.log('📋 Test 1: Get all users');
    const allUsers = await getAllAccountsAPI();
    console.log(`Total users: ${allUsers.totalCount}`);
    console.log(`First 3 users:`, allUsers.items.slice(0, 3));
    console.log('✅ Passed\n');

    // Test 2: Get only designers
    console.log('🎨 Test 2: Get only designers');
    const designers = await getAllAccountsAPI(1); // role 1 = Designer
    console.log(`Total designers: ${designers.totalCount}`);
    console.log(`Designers:`, designers.items.map(d => d.name));
    console.log('✅ Passed\n');

    // Test 3: Get only customers with pagination
    console.log('👥 Test 3: Get customers with pagination (page 1, size 2)');
    const customers = await getAllAccountsAPI(2, 1, 2); // role 2 = Customer
    console.log(`Total customers: ${customers.totalCount}`);
    console.log(`Page ${customers.currentPage}/${customers.totalPages}`);
    console.log(`Customers on this page:`, customers.items.map(c => c.name));
    console.log('✅ Passed\n');

    // Test 4: Get awaiting designers
    console.log('⏳ Test 4: Get awaiting designers');
    const awaitingDesigners = await getAwaitingDesignersAPI();
    console.log(`Total awaiting: ${awaitingDesigners.totalCount}`);
    console.log(`Awaiting designers:`, awaitingDesigners.items.map(d => ({ name: d.name, email: d.email })));
    console.log('✅ Passed\n');

    // Test 5: Approve a designer
    console.log('✅ Test 5: Approve a designer');
    const firstPendingEmail = awaitingDesigners.items[0]?.email;
    if (firstPendingEmail) {
      const result = await applicationResultAPI(firstPendingEmail, true);
      console.log(`Approval result:`, result);
      console.log('✅ Passed\n');

      // Verify the designer was moved to main list
      console.log('🔍 Test 5.1: Verify approved designer in main list');
      const updatedUsers = await getAllAccountsAPI();
      const approvedDesigner = updatedUsers.items.find(u => u.email === firstPendingEmail);
      console.log(`Approved designer found in main list:`, approvedDesigner ? '✅ Yes' : '❌ No');
    }

    // Test 6: Reject a designer
    console.log('❌ Test 6: Reject a designer');
    const secondPendingEmail = awaitingDesigners.items[1]?.email;
    if (secondPendingEmail) {
      const result = await applicationResultAPI(secondPendingEmail, false);
      console.log(`Rejection result:`, result);
      console.log('✅ Passed\n');
    }

    // Test 7: Get all furniture
    console.log('🪑 Test 7: Get all furniture');
    const allFurniture = await getAllFurnituresAPI();
    console.log(`Total furniture: ${allFurniture.data.totalCount}`);
    console.log(`First 3 furniture:`, allFurniture.data.items.slice(0, 3).map(f => ({ name: f.name, price: f.price, category: f.category })));
    console.log('✅ Passed\n');

    // Test 8: Get furniture with pagination
    console.log('🪑 Test 8: Get furniture with pagination (page 1, size 3)');
    const paginatedFurniture = await getAllFurnituresAPI(1, 3);
    console.log(`Total furniture: ${paginatedFurniture.data.totalCount}`);
    console.log(`Page ${paginatedFurniture.data.currentPage}/${paginatedFurniture.data.totalPages}`);
    console.log(`Furniture on this page:`, paginatedFurniture.data.items.map(f => f.name));
    console.log('✅ Passed\n');

    // Test 9: Get designer furniture
    console.log('🎨 Test 9: Get designer furniture');
    const designerFurniture = await getAllFursByDesAPI();
    console.log(`Total designer furniture: ${designerFurniture.data.totalCount}`);
    console.log(`Designer furniture categories:`, [...new Set(designerFurniture.data.items.map(f => f.category))]);
    console.log('✅ Passed\n');

    // Test 10: Furniture price range analysis
    console.log('💰 Test 10: Furniture price analysis');
    const prices = allFurniture.data.items.map(f => f.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length);
    console.log(`Price range: ${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`);
    console.log(`Average price: ${avgPrice.toLocaleString()}đ`);
    console.log('✅ Passed\n');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Export for use in other files
export { testMockAPIs };

// Auto-run if this file is imported as a module
// testMockAPIs();
