import React, { useState, useEffect } from 'react';
import Header from './Header';
import Filters from './Filters';
import MapSection from './MapSection';
import ChartSection from './ChartSection';
import DataTable from './DataTable';
import { CropType, FilterState } from '../types';
import { cropYieldData, getFilteredData, getYears } from '../data/mockData';

const Dashboard: React.FC = () => {
  // Get min and max years from data
  const years = getYears();
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  
  // Initialize filters
  const [filters, setFilters] = useState<FilterState>({
    cropType: CropType.RICE,
    yearRange: [minYear, maxYear],
    selectedState: null,
    comparisonMetric: null
  });

  // Add temporary filters state
  const [tempFilters, setTempFilters] = useState<FilterState>(filters);
  
  // Get filtered data
  const filteredData = getFilteredData(
    filters.cropType,
    filters.yearRange[0],
    filters.yearRange[1],
    filters.selectedState
  );
  
  // Update temporary filters
  const handleTempFilterChange = (newFilters: Partial<FilterState>) => {
    setTempFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Apply filters when submit is clicked
  const handleFilterSubmit = () => {
    setFilters(tempFilters);
  };
  
  // Handle state selection from map
  const handleStateSelect = (state: string) => {
    const newState = filters.selectedState === state ? null : state;
    setFilters(prev => ({ ...prev, selectedState: newState }));
    setTempFilters(prev => ({ ...prev, selectedState: newState }));
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <Filters 
          filters={tempFilters}
          onFilterChange={handleTempFilterChange}
          onSubmit={handleFilterSubmit}
        />
        
        <MapSection 
          data={cropYieldData}
          selectedYear={filters.yearRange[1]}
          selectedCrop={filters.cropType}
          onStateSelect={handleStateSelect}
        />
        
        <ChartSection 
          data={filteredData}
          selectedCrop={filters.cropType}
          yearRange={filters.yearRange}
          selectedState={filters.selectedState}
          comparisonMetric={filters.comparisonMetric}
        />
        
        <DataTable 
          data={filteredData}
          selectedCrop={filters.cropType}
        />
        
        <div className="bg-white p-4 rounded-lg shadow-md text-center text-sm text-gray-500 mt-6">
          <p>This dashboard uses mock data for demonstration purposes. In a production environment, it would connect to real agricultural databases.</p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;