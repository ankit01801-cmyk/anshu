import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface DesignTransform {
  x: number; // percentage from left
  y: number; // percentage from top
  scale: number; // multiplier
}

interface DesignEditorProps {
  baseImageUrl: string;
  designFileUrl: string | null;
  transform: DesignTransform;
  setTransform: (transform: DesignTransform) => void;
  isApplyingDesign: boolean;
}

export const DesignEditor: React.FC<DesignEditorProps> = ({
  baseImageUrl,
  designFileUrl,
  transform,
  setTransform,
  isApplyingDesign,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const designRef = useRef<HTMLDivElement>(null);

  // Refs to store initial positions and dimensions during interactions
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });
  const resizeStartSize = useRef(0);

  const getDesignBaseWidth = () => {
    // This provides a consistent base size for scaling.
    // e.g., A scale of 1 would make the design 20% of the container width.
    return containerRef.current ? containerRef.current.offsetWidth * 0.2 : 100;
  };
  
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isApplyingDesign) return;
    e.preventDefault();
    setIsDragging(true);

    dragStartPos.current = { x: e.clientX, y: e.clientY };
    if (designRef.current) {
        elementStartPos.current = { x: designRef.current.offsetLeft, y: designRef.current.offsetTop };
    }
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isApplyingDesign) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent drag from starting
    setIsResizing(true);
    
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    resizeStartSize.current = getDesignBaseWidth() * transform.scale;
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();

    if (isDragging) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;

        const newX = elementStartPos.current.x + dx;
        const newY = elementStartPos.current.y + dy;
        
        // Clamp position within the container bounds
        const clampedX = Math.max(0, Math.min(newX, containerRect.width));
        const clampedY = Math.max(0, Math.min(newY, containerRect.height));

        const xPercent = (clampedX / containerRect.width) * 100;
        const yPercent = (clampedY / containerRect.height) * 100;

        setTransform({ ...transform, x: xPercent, y: yPercent });
    }

    if (isResizing) {
        const dx = e.clientX - dragStartPos.current.x;
        const dy = e.clientY - dragStartPos.current.y;
        // Use the larger of the two deltas for uniform scaling
        const delta = Math.max(dx, dy); 

        const newSize = resizeStartSize.current + delta;
        const baseWidth = getDesignBaseWidth();
        
        // Clamp scale to reasonable values
        const newScale = Math.max(0.05, Math.min(newSize / baseWidth, 1.5));
        
        setTransform({ ...transform, scale: newScale });
    }
  }, [isDragging, isResizing, transform, setTransform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);


  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full select-none"
      aria-label="Design editor"
    >
      <img
        src={baseImageUrl}
        alt="Base clothing mockup"
        className="w-full h-full object-contain"
        draggable="false"
      />
      {designFileUrl && (
        <div
          ref={designRef}
          className="absolute border-2 border-dashed border-indigo-400/70"
          style={{
            left: `${transform.x}%`,
            top: `${transform.y}%`,
            width: `${getDesignBaseWidth() * transform.scale}px`,
            height: `${getDesignBaseWidth() * transform.scale}px`,
            transform: 'translate(-50%, -50%)',
            cursor: isDragging ? 'grabbing' : 'grab',
            touchAction: 'none',
          }}
          onMouseDown={handleDragStart}
          role="button"
          aria-label="Draggable and resizable design element"
          tabIndex={0}
        >
          <img
            src={designFileUrl}
            alt="Uploaded design"
            className="w-full h-full object-contain pointer-events-none"
            draggable="false"
          />
          <div
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-gray-900 hover:bg-indigo-400"
            style={{ cursor: 'nwse-resize' }}
            onMouseDown={handleResizeStart}
            role="button"
            aria-label="Resize handle"
          />
        </div>
      )}
    </div>
  );
};