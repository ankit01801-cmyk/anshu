import { GoogleGenAI, Modality } from "@google/genai";
import { ModelType, FabricQuality, StitchingType } from "../App";
import { DesignTransform } from "../components/DesignEditor";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const parseBase64 = (base64: string) => {
    const match = base64.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error("Invalid base64 string");
    }
    return { mimeType: match[1], data: match[2] };
}

/**
 * Generates a plain clothing mockup image using the Gemini API.
 */
export const generateClothingMockup = async (
  userPrompt: string,
  modelType: ModelType,
  fabricQuality: FabricQuality,
  stitching: StitchingType
): Promise<string> => {
  const basePrompt = `A professional 8k ultra-high resolution photorealistic mockup of a plain, unbranded: "${userPrompt}".`;

  let modelDescription = '';
  if (modelType === 'ghost') {
    modelDescription = "The clothing is displayed on a ghost mannequin to highlight the product's shape and design clearly. No humans or models are visible.";
  } else {
    modelDescription = `The clothing is worn by a professional ${modelType} model with a neutral expression, posed to showcase the apparel effectively.`;
  }

  let fabricDescription = '';
  switch (fabricQuality) {
    case 'premium':
      fabricDescription = 'The fabric is of premium quality, showing a detailed and realistic texture, weave, and drape.';
      break;
    case 'luxury':
      fabricDescription = 'The fabric is luxurious and high-end, with an exceptionally detailed texture, sheen, and drape, indicating superior material quality.';
      break;
    default: // standard
      fabricDescription = 'The fabric has a standard, realistic texture.';
      break;
  }

  let stitchingDescription = '';
  switch (stitching) {
    case 'reinforced':
      stitchingDescription = 'The stitching is clearly visible, clean, and reinforced, suggesting durability and high-quality construction.';
      break;
    case 'decorative':
      stitchingDescription = 'Features intricate decorative stitching that is clearly visible and adds a unique design element.';
      break;
    default: // standard
      stitchingDescription = 'Seams and stitching are realistic and well-executed.';
      break;
  }

  const detailedPrompt = `${basePrompt} 
  ${modelDescription} 
  ${fabricDescription} 
  ${stitchingDescription}
  Crucially, the clothing item must be completely blank, with no pre-existing logos, graphics, or designs.
  The background must be a clean, minimalist, neutral gray studio setting.
  Shot on a DSLR camera, 50mm lens, f/1.8, professional studio lighting, creating soft shadows and highlighting all details.
  Focus on hyper-realistic details, textures, and seams.`;

  try {
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: detailedPrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
      throw new Error("API did not return any images.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  } catch (error) {
    console.error("Error calling Gemini API for image generation:", error);
    throw new Error("Failed to generate image from Gemini API.");
  }
};

/**
 * Applies a design to a mockup image using the Gemini image editing model.
 */
export const applyDesignToMockup = async (
  baseImageBase64: string,
  designImageBase64: string,
  transform: DesignTransform
): Promise<string> => {
  try {
    const baseImage = parseBase64(baseImageBase64);
    const designImage = parseBase64(designImageBase64);

    const positionText = `at approximately ${transform.x.toFixed(0)}% from the left and ${transform.y.toFixed(0)}% from the top of the garment's printable area`;
    
    // A scale of 0.25 is a "standard" size. 0.5 is large, 0.1 is small.
    let sizeDescription = '';
    if (transform.scale > 0.4) {
      sizeDescription = 'The design should be very large on the apparel.';
    } else if (transform.scale > 0.2) {
      sizeDescription = 'The design should be a standard, medium size.';
    } else {
      sizeDescription = 'The design should be small, like a pocket logo.';
    }


    const prompt = `You are an expert apparel designer. Apply the second image (the design graphic) onto the first image (the clothing mockup).
    
    Placement Instructions:
    1. Position the center of the design ${positionText}.
    2. ${sizeDescription}
    
    Crucially, the applied design must look photorealistic. It must conform perfectly to the fabric's texture, folds, lighting, and shadows. It should not look like a flat sticker. Integrate it seamlessly and naturally into the clothing.`;


    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: baseImage.data, mimeType: baseImage.mimeType } },
          { inlineData: { data: designImage.data, mimeType: designImage.mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
    if (imagePart && imagePart.inlineData) {
        const base64Data = imagePart.inlineData.data;
        const mimeType = imagePart.inlineData.mimeType;
        return `data:${mimeType};base64,${base64Data}`;
    }

    throw new Error("The API did not return an edited image.");

  } catch (error) {
    console.error("Error calling Gemini API for image editing:", error);
    throw new Error("Failed to apply design using Gemini API.");
  }
};