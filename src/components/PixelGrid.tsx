import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../store/editorStore';

const PixelGrid: React.FC = () => {
  const {
    grid,
    gridSize,
    currentColor,
    setPixel,
    tool,
    pickColor,
    isDrawing,
    setIsDrawing,
    zoom,
    pan,
    setPan
  } = useEditorStore();
  
  const gridRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });

  // Calculate cell size based on available space and zoom level
  const cellSize = Math.max(4, Math.floor(20 * zoom));
  
  // Handle cell click
  const handleCellClick = (rowIndex: number, colIndex: number) => {
    if (tool === 'eyedropper') {
      pickColor(rowIndex, colIndex);
    } else { // Default to brush
      setPixel(rowIndex, colIndex, currentColor);
    }
  };

  // Handle mouse events for drawing
  const handleMouseDown = (rowIndex: number, colIndex: number, e: React.MouseEvent) => {
    // Middle mouse button (pan)
    if (e.button === 1) {
      e.preventDefault();
      setIsDragging(true);
      setStartPanPoint({ x: e.clientX, y: e.clientY });
      return;
    }
    
    // Left mouse button (draw)
    if (e.button === 0) {
      setIsDrawing(true);
      handleCellClick(rowIndex, colIndex);
    }
  };

  const handleMouseEnter = (rowIndex: number, colIndex: number) => {
    if (isDrawing && tool === 'brush') {
      setPixel(rowIndex, colIndex, currentColor);
    }
  };

  // Pan functionality
  const handleGridMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || e.button === 0 && tool === 'pan') {
      e.preventDefault();
      setIsDragging(true);
      setStartPanPoint({ x: e.clientX, y: e.clientY });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - startPanPoint.x;
        const dy = e.clientY - startPanPoint.y;
        setPan({
          x: pan.x + dx,
          y: pan.y + dy
        });
        setStartPanPoint({ x: e.clientX, y: e.clientY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsDrawing(false);
    };

    // Handle scroll for zooming
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        useEditorStore.getState().setZoom(Math.max(0.5, Math.min(5, zoom + delta)));
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    const gridElement = gridRef.current;
    if (gridElement) {
      gridElement.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      if (gridElement) {
        gridElement.removeEventListener('wheel', handleWheel);
      }
    };
  }, [isDragging, startPanPoint, pan, zoom, setIsDrawing, isDrawing, setPan]);

  return (
    <div 
      ref={gridRef}
      className="pixel-grid overflow-auto relative"
      style={{ 
        cursor: tool === 'eyedropper' ? 'crosshair' : 
               tool === 'pan' ? 'grab' : 'default',
        height: '70vh'
      }}
      onMouseDown={handleGridMouseDown}
    >
      <div 
        className="transform origin-center transition-transform duration-100"
        style={{ 
          transform: `translate(${pan.x}px, ${pan.y}px)`,
          display: 'inline-block'
        }}
      >
        <div className="bg-white dark:bg-gray-800 inline-block p-1 border border-gray-300 dark:border-gray-700">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((color, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="pixel-grid-cell transition-colors"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: color || 'transparent',
                    borderWidth: cellSize > 8 ? '1px' : '0',
                  }}
                  onMouseDown={(e) => handleMouseDown(rowIndex, colIndex, e)}
                  onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 px-2 py-1 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
        {Math.round(zoom * 100)}% | {gridSize.width}×{gridSize.height}
      </div>
    </div>
  );
};

export default PixelGrid;