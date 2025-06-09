import React from 'react';
import { 
  ComposableMap, 
  Geographies, 
  Geography,
  Marker
} from 'react-simple-maps';
import { Tooltip } from 'react-tooltip';
import Card from './common/Card';
import { CropType, CropYieldData } from '../types';
import { indiaFeatures } from '../data/indiaMap';

interface MapSectionProps {
  data: CropYieldData[];
  selectedYear: number;
  selectedCrop: CropType | 'all';
  onStateSelect: (state: string) => void;
}

const MapSection: React.FC<MapSectionProps> = ({ 
  data, 
  selectedYear, 
  selectedCrop,
  onStateSelect
}) => {
  // Calculate data for the map
  const getStateData = () => {
    // If all crops are selected, calculate average yield across crops for each state
    const stateMap = new Map<string, { total: number, count: number, code: string }>();
    
    data.forEach(item => {
      if (item.year === selectedYear && (selectedCrop === 'all' || item.crop === selectedCrop)) {
        const current = stateMap.get(item.state) || { total: 0, count: 0, code: item.stateCode };
        stateMap.set(item.state, {
          total: current.total + item.yieldValue,
          count: current.count + 1,
          code: item.stateCode
        });
      }
    });
    
    return Array.from(stateMap.entries()).map(([state, data]) => ({
      state,
      code: data.code,
      value: Math.round(data.total / data.count)
    }));
  };
  
  const stateData = getStateData();
  
  // Find max and min values for color scaling
  const maxValue = Math.max(...stateData.map(d => d.value));
  const minValue = Math.min(...stateData.map(d => d.value));
  
  // Color scale function
  const getColor = (value: number) => {
    // Normalize the value between 0 and 1
    const normalized = (value - minValue) / (maxValue - minValue || 1);
    
    // Create a green color scale from light to dark
    const r = Math.round(230 - normalized * 170);
    const g = Math.round(230 - normalized * 50);
    const b = Math.round(150 - normalized * 100);
    
    return `rgb(${r}, ${g}, ${b})`;
  };

  return (
    <Card title="State-wise Crop Yield" className="mb-6">
      <div className="flex flex-col">
        {/* Enhanced scrollable map container */}
        <div className="w-full h-[500px] overflow-auto border-2 border-gray-300 rounded-lg bg-gradient-to-br from-blue-50 to-green-50 shadow-inner">
          <div className="min-w-[1200px] min-h-[800px] p-6 relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{
                scale: 1800,
                center: [78.9629, 22.5937]
              }}
              width={1200}
              height={800}
              className="w-full h-full"
            >
              {stateData.map((state) => (
                <Marker 
                  key={state.code}
                  coordinates={
                    indiaFeatures.features.find(
                      (f) => f.properties.code === state.code
                    )?.geometry.coordinates as [number, number]
                  }
                  data-tooltip-id="state-tooltip"
                  data-tooltip-content={`${state.state}: ${state.value.toLocaleString()} kg/hectare`}
                  onClick={() => onStateSelect(state.state)}
                >
                  <circle 
                    r={25}
                    fill={getColor(state.value)}
                    stroke="#FFF"
                    strokeWidth={3}
                    style={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.2)';
                      e.currentTarget.style.filter = 'drop-shadow(0 6px 12px rgba(0,0,0,0.25))';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.filter = 'drop-shadow(0 4px 8px rgba(0,0,0,0.15))';
                    }}
                  />
                  <text
                    textAnchor="middle"
                    y={6}
                    style={{
                      fontFamily: "system-ui",
                      fontSize: "12px",
                      fontWeight: "bold",
                      fill: "#FFF",
                      cursor: 'pointer',
                      pointerEvents: 'none',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}
                  >
                    {state.code}
                  </text>
                </Marker>
              ))}
            </ComposableMap>
            
            {/* Scroll indicators */}
            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                  <span>Scroll to explore</span>
                </div>
              </div>
            </div>
          </div>
          <Tooltip id="state-tooltip" className="!bg-gray-800 !text-white !rounded-lg !px-3 !py-2" />
        </div>
        
        {/* Enhanced legend */}
        <div className="mt-6 flex justify-center items-center">
          <div className="flex items-center bg-white rounded-lg p-4 shadow-md border">
            <div className="text-sm font-medium text-gray-700 mr-4">Low Yield</div>
            <div className="flex h-6 border-2 border-gray-300 rounded-lg overflow-hidden shadow-sm">
              {[...Array(8)].map((_, i) => (
                <div 
                  key={i}
                  className="w-8"
                  style={{ backgroundColor: getColor(minValue + (i * (maxValue - minValue) / 7)) }}
                ></div>
              ))}
            </div>
            <div className="text-sm font-medium text-gray-700 ml-4">High Yield</div>
          </div>
        </div>

        {/* Enhanced instructions */}
        <div className="mt-4 text-center space-y-2">
          <div className="text-sm text-gray-600 font-medium">
            Click on a state to filter data | {selectedCrop === 'all' ? 'Average of all crops' : selectedCrop} yield for {selectedYear}
          </div>
          <div className="flex justify-center space-x-4">
            <div className="text-xs text-gray-500 bg-blue-50 px-4 py-2 rounded-full inline-flex items-center border border-blue-200">
              <span className="mr-2">⬅️➡️</span>
              Scroll horizontally to see all regions
            </div>
            <div className="text-xs text-gray-500 bg-green-50 px-4 py-2 rounded-full inline-flex items-center border border-green-200">
              <span className="mr-2">⬆️⬇️</span>
              Scroll vertically for detailed view
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MapSection;