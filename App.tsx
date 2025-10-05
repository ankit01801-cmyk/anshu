import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { ImageDisplay } from './components/ImageDisplay';
import { generateClothingMockup, applyDesignToMockup } from './services/geminiService';
import { GenerationOptions } from './components/GenerationOptions';
import { DesignUploader } from './components/DesignUploader';
import { DesignTransform } from './components/DesignEditor';

export type ModelType = 'ghost' | 'male' | 'female';
export type FabricQuality = 'standard' | 'premium' | 'luxury';
export type StitchingType = 'standard' | 'reinforced' | 'decorative';


const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A black oversized hoodie.');
  const [baseImageUrl, setBaseImageUrl] = useState<string | null>(null);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isApplyingDesign, setIsApplyingDesign] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [modelType, setModelType] = useState<ModelType>('ghost');
  const [fabricQuality, setFabricQuality] = useState<FabricQuality>('premium');
  const [stitching, setStitching] = useState<StitchingType>('standard');

  const [designFile, setDesignFile] = useState<File | null>(null);
  const [designFileUrl, setDesignFileUrl] = useState<string | null>(null);

  const [designTransform, setDesignTransform] = useState<DesignTransform>({
    x: 50,
    y: 40,
    scale: 0.25,
  });

  useEffect(() => {
    if (designFile) {
      const url = URL.createObjectURL(designFile);
      setDesignFileUrl(url);
      // Reset transform when new file is uploaded
      setDesignTransform({ x: 50, y: 40, scale: 0.25 });
      return () => URL.revokeObjectURL(url);
    } else {
      setDesignFileUrl(null);
    }
  }, [designFile]);


  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleGenerateMockup = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setBaseImageUrl(null);
    setFinalImageUrl(null);
    setDesignFile(null);

    try {
      const generatedImageUrl = await generateClothingMockup(
        prompt,
        modelType,
        fabricQuality,
        stitching
      );
      setBaseImageUrl(generatedImageUrl);
    } catch (err) {
      console.error(err);
      setError('Failed to generate base mockup. Please check your prompt and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, modelType, fabricQuality, stitching]);

  const handleApplyDesign = useCallback(async () => {
    if (!designFile || !baseImageUrl || isApplyingDesign) return;

    setIsApplyingDesign(true);
    setError(null);
    setFinalImageUrl(null);

    try {
      const designImageBase64 = await fileToBase64(designFile);
      const finalImage = await applyDesignToMockup(
        baseImageUrl,
        designImageBase64,
        designTransform
      );
      setFinalImageUrl(finalImage);
    } catch (err) {
      console.error(err);
      setError('Failed to apply the design. Please try a different design file or position.');
    } finally {
      setIsApplyingDesign(false);
    }
  }, [designFile, baseImageUrl, designTransform, isApplyingDesign]);
  
  const handleStartOver = () => {
    setBaseImageUrl(null);
    setFinalImageUrl(null);
    setDesignFile(null);
    setError(null);
    setPrompt('A black oversized hoodie.');
  };

  const handleAdjustDesign = () => {
    setFinalImageUrl(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <Header />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 items-start">
          
          <div className="lg:sticky lg:top-8 space-y-6">
            <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-indigo-300 mb-3">Step 1: Describe the Apparel</h2>
                <PromptInput
                  prompt={prompt}
                  setPrompt={setPrompt}
                  onSubmit={handleGenerateMockup}
                  isLoading={isLoading}
                />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-300 mb-3">Options</h3>
                <GenerationOptions
                  modelType={modelType}
                  setModelType={setModelType}
                  fabricQuality={fabricQuality}
                  setFabricQuality={setFabricQuality}
                  stitching={stitching}
                  setStitching={setStitching}
                  isLoading={isLoading || !!baseImageUrl}
                />
              </div>
            </div>

            {baseImageUrl && !finalImageUrl && (
              <div className="p-6 bg-gray-800/50 border border-gray-700/50 rounded-lg shadow-xl">
                <h2 className="text-xl font-semibold text-indigo-300 mb-4">Step 2: Upload & Position Design</h2>
                <DesignUploader
                  designFile={designFile}
                  setDesignFile={setDesignFile}
                  onApplyDesign={handleApplyDesign}
                  isApplyingDesign={isApplyingDesign}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
          
          <div className="w-full">
            <ImageDisplay
              baseImageUrl={baseImageUrl}
              finalImageUrl={finalImageUrl}
              designFileUrl={designFileUrl}
              designTransform={designTransform}
              setDesignTransform={setDesignTransform}
              isLoading={isLoading}
              isApplyingDesign={isApplyingDesign}
              error={error}
              onAdjustDesign={handleAdjustDesign}
              onStartOver={handleStartOver}
            />
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;