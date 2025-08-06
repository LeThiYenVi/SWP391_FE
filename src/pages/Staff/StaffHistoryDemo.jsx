import React from 'react';
import StaffHistory from './StaffHistory';

const StaffHistoryDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Staff History Demo</h1>
        <StaffHistory />
      </div>
    </div>
  );
};

export default StaffHistoryDemo;
