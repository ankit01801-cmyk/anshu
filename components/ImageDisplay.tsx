import React from 'react';
import { Spinner } from './Spinner';
import { DesignEditor, DesignTransform } from './DesignEditor';
import { FinalActions } from './FinalActions';

interface ImageDisplayProps {
  baseImageUrl: string | null;
  finalImageUrl: string | null;
  designFileUrl: string | null;
  designTransform: DesignTransform;
  setDesignTransform: (transform: DesignTransform) => void;
  isLoading: boolean;
  isApplyingDesign: boolean;
  error: string | null;
  onAdjustDesign: () => void;
  onStartOver: () => void;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ 
  baseImageUrl, 
  finalImageUrl,
  designFileUrl,
  designTransform,
  setDesignTransform,
  isLoading, 
  isApplyingDesign, 
  error,
  onAdjustDesign,
  onStartOver,
}) => {
  const showLoading = isLoading || isApplyingDesign;

  const renderContent = () => {
    if (showLoading) {
      return (
        <div className="text-center">
          <Spinner />
          <p className="mt-4 text-gray-400">
            {isLoading ? 'Generating your 8K mockup...' : 'Applying your design...'}
          </p>
          <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 p-4">
          <p className="font-bold">An error occurred</p>
          <p>{error}</p>
        </div>
      );
    }
    
    if (finalImageUrl) {
        return (
            <div className="flex flex-col items-center justify-center h-full w-full p-2">
                <img
                    src={finalImageUrl}
                    alt="Final clothing mockup with design"
                    className="max-w-full max-h-[85%] object-contain rounded-md"
                />
                <div className="w-full mt-4">
                    <FinalActions 
                        onAdjustDesign={onAdjustDesign}
                        onStartOver={onStartOver}
                    />
                </div>
            </div>
        )
    }

    if (baseImageUrl) {
        return (
            <DesignEditor 
                baseImageUrl={baseImageUrl}
                designFileUrl={designFileUrl}
                transform={designTransform}
                setTransform={setDesignTransform}
                isApplyingDesign={isApplyingDesign}
            />
        )
    }

    return (
      <div className="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="mt-2">Your generated mockup will appear here.</p>
      </div>
    );
  };

  return (
    <div className="w-full aspect-square bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center p-1 shadow-inner overflow-hidden">
      {renderContent()}
    </div>
  );
};