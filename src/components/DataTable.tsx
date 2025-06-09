import React, { useState } from 'react';
import { ArrowUpDown, ArrowDownCircle } from 'lucide-react';
import Card from './common/Card';
import Button from './common/Button';
import { CropYieldData, CropType } from '../types';

interface DataTableProps {
  data: CropYieldData[];
  selectedCrop: CropType | 'all';
}

const DataTable: React.FC<DataTableProps> = ({ data, selectedCrop }) => {
  const [sortField, setSortField] = useState<keyof CropYieldData>('yieldValue');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Prepare table data
  const prepareTableData = () => {
    // If all crops selected, we need to aggregate by state and year
    if (selectedCrop === 'all') {
      const aggregatedData: Record<string, any>[] = [];
      const stateYearMap = new Map<string, { total: number, count: number, rainfall: number, temp: number }>();
      
      // Group by state and year
      data.forEach(item => {
        const key = `${item.state}-${item.year}`;
        const current = stateYearMap.get(key) || { total: 0, count: 0, rainfall: 0, temp: 0 };
        
        stateYearMap.set(key, {
          total: current.total + item.yieldValue,
          count: current.count + 1,
          rainfall: (current.rainfall * current.count + item.rainfall) / (current.count + 1),
          temp: (current.temp * current.count + item.temperature) / (current.count + 1),
        });
      });
      
      // Convert to array format
      Array.from(stateYearMap.entries()).forEach(([key, value]) => {
        const [state, year] = key.split('-');
        
        aggregatedData.push({
          id: key,
          state,
          year: parseInt(year),
          crop: 'Average (All Crops)',
          yieldValue: Math.round(value.total / value.count),
          rainfall: Math.round(value.rainfall),
          temperature: value.temp.toFixed(1),
        });
      });
      
      return aggregatedData;
    }
    
    // For specific crop, just format the data
    return data.filter(item => item.crop === selectedCrop).map(item => ({
      id: item.id,
      state: item.state,
      year: item.year,
      crop: item.crop,
      yieldValue: item.yieldValue,
      rainfall: Math.round(item.rainfall),
      temperature: item.temperature.toFixed(1),
    }));
  };
  
  const tableData = prepareTableData();
  
  // Sort data
  const sortedData = [...tableData].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Paginate data
  const paginatedData = sortedData.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  
  // Handle sort
  const handleSort = (field: keyof CropYieldData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // Handle CSV export
  const handleExportCSV = () => {
    // Convert data to CSV
    const headers = ['State', 'Year', 'Crop', 'Yield (kg/ha)', 'Rainfall (mm)', 'Temperature (°C)'];
    const csvData = tableData.map(row => [
      row.state,
      row.year,
      row.crop,
      row.yieldValue,
      row.rainfall,
      row.temperature
    ]);
    
    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `crop_yield_data_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Card title="Detailed Yield Data" className="mb-6">
      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-gray-700 font-medium">
          {selectedCrop === 'all' ? 'Average Yield Across All Crops' : `${selectedCrop} Yield Data`}
        </h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleExportCSV}
          className="flex items-center"
        >
          <ArrowDownCircle size={16} className="mr-1" />
          Export CSV
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('state')}
              >
                <div className="flex items-center">
                  State
                  <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('year')}
              >
                <div className="flex items-center">
                  Year
                  <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('yieldValue')}
              >
                <div className="flex items-center">
                  Yield (kg/ha)
                  <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('rainfall')}
              >
                <div className="flex items-center">
                  Rainfall (mm)
                  <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('temperature')}
              >
                <div className="flex items-center">
                  Temp (°C)
                  <ArrowUpDown size={14} className="ml-1" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {row.state}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.year}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {row.yieldValue.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.rainfall}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {row.temperature}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * rowsPerPage + 1}</span> to{' '}
                <span className="font-medium">
                  {Math.min(page * rowsPerPage, sortedData.length)}
                </span>{' '}
                of <span className="font-medium">{sortedData.length}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border ${
                      page === i + 1
                        ? 'bg-green-50 border-green-500 text-green-600'
                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                    } text-sm font-medium`}
                  >
                    {i + 1}
                  </button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default DataTable;