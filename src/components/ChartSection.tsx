import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import Card from './common/Card';
import { CropType, CropYieldData } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface ChartSectionProps {
  data: CropYieldData[];
  selectedCrop: CropType | 'all';
  yearRange: [number, number];
  selectedState: string | null;
  comparisonMetric: 'rainfall' | 'temperature' | 'fertilizer' | 'soilHealth' | null;
}

const ChartSection: React.FC<ChartSectionProps> = ({
  data,
  selectedCrop,
  yearRange,
  selectedState,
  comparisonMetric,
}) => {
  // Filter data by selected filters
  const filteredData = data.filter(item => {
    const yearMatch = item.year >= yearRange[0] && item.year <= yearRange[1];
    const cropMatch = selectedCrop === 'all' || item.crop === selectedCrop;
    const stateMatch = !selectedState || item.state === selectedState;
    return yearMatch && cropMatch && stateMatch;
  });

  // Generate predicted values using a simple linear regression
  const generatePredictions = (actualData: number[]) => {
    const n = actualData.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    
    actualData.forEach((y, i) => {
      sumX += i;
      sumY += y;
      sumXY += i * y;
      sumXX += i * i;
    });
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    return actualData.map((_, i) => {
      const predicted = slope * i + intercept;
      return predicted * (1 + (Math.random() * 0.1 - 0.05));
    });
  };

  // Prepare state comparison data
  const prepareStateComparisonData = () => {
    const stateAverages = new Map<string, { actual: number; predicted: number }>();
    
    // Calculate average yield for each state
    filteredData.forEach(item => {
      if (!stateAverages.has(item.state)) {
        stateAverages.set(item.state, { actual: 0, predicted: 0 });
      }
      const current = stateAverages.get(item.state)!;
      current.actual = (current.actual + item.yieldValue) / 2;
    });
    
    // Sort states by actual yield and take top 10
    const topStates = Array.from(stateAverages.entries())
      .sort(([, a], [, b]) => b.actual - a.actual)
      .slice(0, 10);
    
    // Generate predictions for top states
    topStates.forEach(([state, data]) => {
      const stateData = filteredData
        .filter(item => item.state === state)
        .map(item => item.yieldValue);
      const predictions = generatePredictions(stateData);
      data.predicted = predictions[predictions.length - 1];
    });
    
    return {
      labels: topStates.map(([state]) => state),
      datasets: [
        {
          label: 'Actual Yield',
          data: topStates.map(([, data]) => data.actual),
          backgroundColor: 'rgba(76, 175, 80, 0.8)',
          borderColor: 'rgba(76, 175, 80, 1)',
          borderWidth: 1,
        },
        {
          label: 'Predicted Yield',
          data: topStates.map(([, data]) => data.predicted),
          backgroundColor: 'rgba(205, 133, 63, 0.8)',
          borderColor: 'rgba(205, 133, 63, 1)',
          borderWidth: 1,
        },
      ],
    };
  };

  // Prepare trend chart options
  const stateComparisonOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: `Top States for ${selectedCrop === 'all' ? 'Overall' : selectedCrop} Production`,
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Yield (t/ha)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'States',
        },
      },
    },
  };

  const stateComparisonData = prepareStateComparisonData();

  return (
    <div className="grid grid-cols-1 gap-6 mb-6">
      <Card title="State-wise Yield Comparison">
        <div className="h-96">
          <Bar options={stateComparisonOptions} data={stateComparisonData} />
        </div>
      </Card>
      
      {comparisonMetric && (
        <Card title={`Yield vs ${getComparisonLabel(comparisonMetric)}`}>
          <div className="h-80">
            <Bar options={comparisonOptions} data={comparisonData} />
          </div>
        </Card>
      )}
    </div>
  );
};

// Helper functions
const getComparisonLabel = (metric: string) => {
  switch (metric) {
    case 'rainfall': return 'Annual Rainfall';
    case 'temperature': return 'Average Temperature';
    case 'fertilizer': return 'Fertilizer Usage';
    case 'soilHealth': return 'Soil Health Index';
    default: return 'Comparison Factor';
  }
};

export default ChartSection;