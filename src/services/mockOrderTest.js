// Test script for order mock APIs
import { getAllOrdersAPI, getOrdersById } from './UsersSevices.js';

async function testOrderAPIs() {
  console.log('=== Testing Order Mock APIs ===');
  
  try {
    // Test getAllOrdersAPI
    console.log('\n1. Testing getAllOrdersAPI (all orders):');
    const allOrders = await getAllOrdersAPI();
    console.log('Result:', allOrders);
    
    console.log('\n2. Testing getAllOrdersAPI with pagination:');
    const paginatedOrders = await getAllOrdersAPI(1, 3);
    console.log('Result:', paginatedOrders);
    
    // Test getOrdersById
    console.log('\n3. Testing getOrdersById with existing ID:');
    const order1 = await getOrdersById('ORD001');
    console.log('Result:', order1);
    
    console.log('\n4. Testing getOrdersById with another existing ID:');
    const order2 = await getOrdersById('ORD005');
    console.log('Result:', order2);
    
    // Test error case
    console.log('\n5. Testing getOrdersById with non-existing ID:');
    try {
      const nonExistentOrder = await getOrdersById('ORD999');
      console.log('Result:', nonExistentOrder);
    } catch (error) {
      console.log('Expected error:', error.message);
    }
    
    console.log('\n=== Order Mock APIs Test Completed ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testOrderAPIs();
