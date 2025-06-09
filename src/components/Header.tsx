import React from 'react';
import { Sprout, BarChart2, TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-green-700 text-white py-4 px-6 shadow-md">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Sprout size={28} className="text-amber-400" />
            <div>
              <h1 className="text-2xl font-bold">Crop Yield Analytics</h1>
              <p className="text-sm text-green-100">Indian Agricultural Performance Dashboard</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <BarChart2 size={16} />
              <span className="text-sm">Data-Driven Insights</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp size={16} />
              <span className="text-sm">Agricultural Trends</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;