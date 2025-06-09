import { CropType, CropYieldData } from '../types';

// Generate years from 2010 to 2023
const years = Array.from({ length: 14 }, (_, i) => 2010 + i);

// Indian states with their codes
const states = [
  { name: 'Andhra Pradesh', code: 'AP' },
  { name: 'Assam', code: 'AS' },
  { name: 'Bihar', code: 'BR' },
  { name: 'Chhattisgarh', code: 'CG' },
  { name: 'Gujarat', code: 'GJ' },
  { name: 'Haryana', code: 'HR' },
  { name: 'Himachal Pradesh', code: 'HP' },
  { name: 'Jharkhand', code: 'JH' },
  { name: 'Karnataka', code: 'KA' },
  { name: 'Kerala', code: 'KL' },
  { name: 'Madhya Pradesh', code: 'MP' },
  { name: 'Maharashtra', code: 'MH' },
  { name: 'Odisha', code: 'OD' },
  { name: 'Punjab', code: 'PB' },
  { name: 'Rajasthan', code: 'RJ' },
  { name: 'Tamil Nadu', code: 'TN' },
  { name: 'Telangana', code: 'TG' },
  { name: 'Uttar Pradesh', code: 'UP' },
  { name: 'Uttarakhand', code: 'UK' },
  { name: 'West Bengal', code: 'WB' }
];

// Crop types
const cropTypes = Object.values(CropType);

// Function to generate random number within a range
const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

// Generate mock data
const generateMockData = (): CropYieldData[] => {
  const data: CropYieldData[] = [];
  let id = 1;

  states.forEach(state => {
    cropTypes.forEach(crop => {
      years.forEach(year => {
        // Base values with some crop-specific adjustments
        let baseYield = 0;
        switch(crop) {
          case CropType.RICE: 
            baseYield = randomInRange(1800, 2500); 
            break;
          case CropType.WHEAT: 
            baseYield = randomInRange(2500, 3500); 
            break;
          case CropType.PULSES: 
            baseYield = randomInRange(700, 1100); 
            break;
          case CropType.SUGARCANE: 
            baseYield = randomInRange(65000, 75000); 
            break;
          case CropType.COTTON: 
            baseYield = randomInRange(400, 550); 
            break;
          case CropType.MAIZE: 
            baseYield = randomInRange(2000, 2800); 
            break;
        }

        // State-specific adjustments
        if (['Punjab', 'Haryana', 'Uttar Pradesh'].includes(state.name)) {
          baseYield *= 1.2; // Higher yields in northern agricultural states
        }
        if (['Rajasthan', 'Gujarat'].includes(state.name)) {
          baseYield *= 0.85; // Lower yields in drier states
        }

        // Year trends - gradual increase over time with some fluctuations
        const yearFactor = 1 + (year - 2010) * 0.015 + randomInRange(-0.05, 0.05);
        const yieldValue = baseYield * yearFactor;

        // Generate related metrics
        const rainfall = randomInRange(600, 1500);
        const temperature = randomInRange(24, 32);
        const soilHealth = randomInRange(60, 95);
        const fertilizer = randomInRange(150, 300);

        data.push({
          id: id++,
          state: state.name,
          stateCode: state.code,
          year,
          crop,
          yieldValue: Math.round(yieldValue),
          rainfall,
          temperature,
          soilHealth,
          fertilizer
        });
      });
    });
  });

  return data;
};

export const cropYieldData = generateMockData();

// Helper functions to extract useful data
export const getYears = () => [...new Set(cropYieldData.map(item => item.year))].sort();
export const getStates = () => [...new Set(cropYieldData.map(item => item.state))];
export const getCrops = () => [...new Set(cropYieldData.map(item => item.crop))];

// Function to get filtered data
export const getFilteredData = (
  crop: CropType | 'all',
  startYear: number,
  endYear: number,
  state: string | null
) => {
  return cropYieldData.filter(item => {
    const cropMatch = crop === 'all' || item.crop === crop;
    const yearMatch = item.year >= startYear && item.year <= endYear;
    const stateMatch = !state || item.state === state;
    return cropMatch && yearMatch && stateMatch;
  });
};

// Calculate national average yield for a specific crop and year
export const getNationalAverageYield = (crop: CropType, year: number) => {
  const relevantData = cropYieldData.filter(item => item.crop === crop && item.year === year);
  if (relevantData.length === 0) return 0;
  
  const sum = relevantData.reduce((acc, item) => acc + item.yieldValue, 0);
  return Math.round(sum / relevantData.length);
};