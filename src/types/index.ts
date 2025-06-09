export interface CropYieldData {
  id: number;
  state: string;
  stateCode: string;
  year: number;
  crop: CropType;
  yieldValue: number;
  rainfall: number;
  temperature: number;
  soilHealth: number;
  fertilizer: number;
}

export enum CropType {
  RICE = 'Rice',
  WHEAT = 'Wheat',
  PULSES = 'Pulses',
  SUGARCANE = 'Sugarcane',
  COTTON = 'Cotton',
  MAIZE = 'Maize',
}

export interface IndianState {
  id: string;
  state: string;
  value: number;
}

export interface FilterState {
  cropType: CropType | 'all';
  yearRange: [number, number];
  selectedState: string | null;
  comparisonMetric: 'rainfall' | 'temperature' | 'fertilizer' | 'soilHealth' | null;
}