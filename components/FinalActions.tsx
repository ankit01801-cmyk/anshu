import React from 'react';
import { AdjustIcon } from './AdjustIcon';
import { ResetIcon } from './ResetIcon';

interface FinalActionsProps {
  onAdjustDesign: () => void;
  onStartOver: () => void;
}

export const FinalActions: React.FC<FinalActionsProps> = ({ onAdjustDesign, onStartOver }) => {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
        <button
          type="button"
          onClick={onAdjustDesign}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 transition-all duration-300"
        >
          <AdjustIcon />
          Adjust Design
        </button>
        <button
          type="button"
          onClick={onStartOver}
          className="w-full inline-flex items-center justify-center px-4 py-2.5 border-2 border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-all duration-300"
        >
          <ResetIcon />
          Start Over
        </button>
      </div>
    </div>
  );
};