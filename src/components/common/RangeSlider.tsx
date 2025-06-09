import React from 'react';

interface RangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label?: string;
  className?: string;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  label,
  className = '',
}) => {
  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMin = parseInt(e.target.value);
    onChange([Math.min(newMin, value[1] - 1), value[1]]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newMax = parseInt(e.target.value);
    onChange([value[0], Math.max(newMax, value[0] + 1)]);
  };

  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="flex items-center justify-between">
        <div className="flex-1 mr-4">
          <input
            type="range"
            min={min}
            max={max - 1}
            value={value[0]}
            onChange={handleMinChange}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <input
            type="range"
            min={value[0] + 1}
            max={max}
            value={value[1]}
            onChange={handleMaxChange}
            className="w-full"
          />
        </div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-sm text-gray-500">{value[0]}</span>
        <span className="text-sm text-gray-500">{value[1]}</span>
      </div>
    </div>
  );
};

export default RangeSlider;