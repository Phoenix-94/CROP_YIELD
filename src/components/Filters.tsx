import React from 'react';
import { Filter, Download } from 'lucide-react';
import Select from './common/Select';
import RangeSlider from './common/RangeSlider';
import Button from './common/Button';
import { CropType, FilterState } from '../types';
import { getStates, getYears } from '../data/mockData';

interface FiltersProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onSubmit: () => void;
}

const Filters: React.FC<FiltersProps> = ({ filters, onFilterChange, onSubmit }) => {
  // Prepare options for Select components
  const cropOptions = [
    { value: 'all', label: 'All Crops' },
    ...Object.values(CropType).map(crop => ({ value: crop, label: crop }))
  ];

  const stateOptions = [
    { value: '', label: 'All States' },
    ...getStates().map(state => ({ value: state, label: state }))
  ];

  const comparisonOptions = [
    { value: '', label: 'No Comparison' },
    { value: 'rainfall', label: 'Rainfall' },
    { value: 'temperature', label: 'Temperature' },
    { value: 'fertilizer', label: 'Fertilizer Usage' },
    { value: 'soilHealth', label: 'Soil Health' }
  ];

  const years = getYears();
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);

  // Handle year range change
  const handleYearRangeChange = (yearRange: [number, number]) => {
    onFilterChange({ yearRange });
  };

  // Handle export data
  const handleExportData = () => {
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="flex items-center mb-4">
        <Filter size={20} className="text-green-600 mr-2" />
        <h2 className="text-lg font-semibold">Data Filters</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Crop Type"
          options={cropOptions}
          value={filters.cropType}
          onChange={(value) => onFilterChange({ cropType: value as CropType | 'all' })}
        />
        
        <Select
          label="State"
          options={stateOptions}
          value={filters.selectedState || ''}
          onChange={(value) => onFilterChange({ selectedState: value || null })}
        />
        
        <RangeSlider
          label="Year Range"
          min={minYear}
          max={maxYear}
          value={filters.yearRange}
          onChange={handleYearRangeChange}
        />
        
        <Select
          label="Compare With"
          options={comparisonOptions}
          value={filters.comparisonMetric || ''}
          onChange={(value) => {
            onFilterChange({ 
              comparisonMetric: value ? value as FilterState['comparisonMetric'] : null 
            });
          }}
        />
      </div>
      
      <div className="mt-4 flex justify-end space-x-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExportData}
          className="flex items-center"
        >
          <Download size={16} className="mr-1" />
          Export Data
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onSubmit}
          className="flex items-center"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default Filters;