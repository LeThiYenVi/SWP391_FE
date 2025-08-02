import React from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const ResponsiveTest = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Responsive Design Test</h2>
      
      <div className="space-y-4">
        <div className="p-4 bg-blue-100 rounded">
          <h3 className="font-semibold">Current Screen Size:</h3>
          <p>Mobile: {isMobile ? '✅' : '❌'}</p>
          <p>Tablet: {isTablet ? '✅' : '❌'}</p>
          <p>Desktop: {isDesktop ? '✅' : '❌'}</p>
        </div>

        <div className="p-4 bg-green-100 rounded">
          <h3 className="font-semibold">Responsive Classes Test:</h3>
          <div className="mobile-hide">This text should be hidden on mobile</div>
          <div className="md:hidden">This text should only show on mobile</div>
          <div className="hidden md:block">This text should be hidden on mobile</div>
        </div>

        <div className="p-4 bg-yellow-100 rounded">
          <h3 className="font-semibold">Button Test:</h3>
          <button className="mobile-button bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg">
            Responsive Button
          </button>
        </div>

        <div className="p-4 bg-purple-100 rounded">
          <h3 className="font-semibold">Table Test:</h3>
          <div className="table-container overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="px-2 md:px-4 py-2">ID</th>
                  <th className="px-2 md:px-4 py-2">Name</th>
                  <th className="px-2 md:px-4 py-2 mobile-hide">Description</th>
                  <th className="px-2 md:px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 md:px-4 py-2">1</td>
                  <td className="px-2 md:px-4 py-2">Test</td>
                  <td className="px-2 md:px-4 py-2 mobile-hide">This column hides on mobile</td>
                  <td className="px-2 md:px-4 py-2">
                    <button className="mobile-button text-xs md:text-sm bg-green-500 text-white px-2 py-1 rounded">
                      Action
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTest;
