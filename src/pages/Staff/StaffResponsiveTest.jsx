import React from 'react';
import ResponsiveTest from '../../components/ResponsiveTest';

const StaffResponsiveTest = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
          Staff Panel Responsive Design Test
        </h1>
        <p className="text-sm md:text-base text-gray-600 mb-6">
          This page tests the responsive design implementation for the Staff Panel.
          Try resizing your browser window or viewing on different devices.
        </p>
        
        <ResponsiveTest />
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Mobile Navigation Test
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800">Desktop (≥768px)</h3>
            <p className="text-blue-600 text-sm">
              Sidebar should be visible on the left side with full navigation menu.
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-green-800">Mobile (&lt;768px)</h3>
            <p className="text-green-600 text-sm">
              Sidebar should be hidden. Top app bar with hamburger menu should be visible.
              Clicking hamburger menu should open a drawer with navigation options.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
          Content Responsive Test
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-red-50 rounded-lg">
            <h3 className="font-semibold text-red-800">Small Screen</h3>
            <p className="text-red-600 text-sm">
              Single column layout with reduced padding and smaller text.
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold text-yellow-800">Medium Screen</h3>
            <p className="text-yellow-600 text-sm">
              Two column layout with medium padding and normal text.
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-semibold text-purple-800">Large Screen</h3>
            <p className="text-purple-600 text-sm">
              Three column layout with full padding and larger text.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffResponsiveTest;
