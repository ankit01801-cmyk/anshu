import React from 'react';
import { ModelType, FabricQuality, StitchingType } from '../App';

interface GenerationOptionsProps {
  modelType: ModelType;
  setModelType: (type: ModelType) => void;
  fabricQuality: FabricQuality;
  setFabricQuality: (quality: FabricQuality) => void;
  stitching: StitchingType;
  setStitching: (stitching: StitchingType) => void;
  isLoading: boolean;
}

const selectBaseClasses = "w-full p-2.5 bg-gray-800 border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed";

export const GenerationOptions: React.FC<GenerationOptionsProps> = ({
  modelType,
  setModelType,
  fabricQuality,
  setFabricQuality,
  stitching,
  setStitching,
  isLoading
}) => {
  return (
    <div className="my-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Model Type Selection */}
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">Display Style</label>
        <div className="flex space-x-2">
          {(['ghost', 'male', 'female'] as ModelType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setModelType(type)}
              disabled={isLoading}
              className={`w-full py-2 px-3 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed
                ${modelType === type 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`
              }
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Fabric Quality Selection */}
      <div>
        <label htmlFor="fabric-quality" className="block mb-2 text-sm font-medium text-gray-300">
          Fabric Quality
        </label>
        <select
          id="fabric-quality"
          value={fabricQuality}
          onChange={(e) => setFabricQuality(e.target.value as FabricQuality)}
          disabled={isLoading}
          className={selectBaseClasses}
        >
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="luxury">Luxury</option>
        </select>
      </div>
      
      {/* Stitching Detail Selection */}
      <div>
        <label htmlFor="stitching-detail" className="block mb-2 text-sm font-medium text-gray-300">
          Stitching Detail
        </label>
        <select
          id="stitching-detail"
          value={stitching}
          onChange={(e) => setStitching(e.target.value as StitchingType)}
          disabled={isLoading}
          className={selectBaseClasses}
        >
          <option value="standard">Standard</option>
          <option value="reinforced">Reinforced</option>
          <option value="decorative">Decorative</option>
        </select>
      </div>
    </div>
  );
};