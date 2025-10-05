import React, { useRef } from 'react';
import { SparklesIcon } from './SparklesIcon';

interface DesignUploaderProps {
  designFile: File | null;
  setDesignFile: (file: File | null) => void;
  onApplyDesign: () => void;
  isApplyingDesign: boolean;
  isLoading: boolean;
}

export const DesignUploader: React.FC<DesignUploaderProps> = ({
  designFile,
  setDesignFile,
  onApplyDesign,
  isApplyingDesign,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setDesignFile(file);
    } else {
      setDesignFile(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const isDisabled = isApplyingDesign || isLoading;

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-300">Upload Design File</label>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/png, image/jpeg, image/webp"
          disabled={isDisabled}
        />
        <button
          type="button"
          onClick={handleUploadClick}
          disabled={isDisabled}
          className="w-full text-left px-4 py-2.5 bg-gray-700 border-2 border-dashed border-gray-600 rounded-lg hover:bg-gray-600/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className={designFile ? 'text-indigo-400' : 'text-gray-400'}>
            {designFile ? designFile.name : 'Choose a file (PNG recommended)...'}
          </span>
        </button>
      </div>
     
      <button
        type="button"
        onClick={onApplyDesign}
        disabled={isDisabled || !designFile}
        className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300"
      >
        {isApplyingDesign ? (
           <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Applying...
          </>
        ) : (
          <>
            <SparklesIcon />
            Apply Design
          </>
        )}
      </button>
    </div>
  );
};