import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

const PatternViewer: React.FC = () => {
  const { grid, zoom } = useEditorStore();
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'row' | 'column'>('row');
  const [isViewerMode, setIsViewerMode] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isViewerMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewMode === 'row') {
        if (e.key === 'ArrowUp') {
          setActiveIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowDown') {
          setActiveIndex(prev => Math.min(grid.length - 1, prev + 1));
        }
      } else {
        if (e.key === 'ArrowLeft') {
          setActiveIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'ArrowRight') {
          setActiveIndex(prev => Math.min(grid[0].length - 1, prev + 1));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isViewerMode, viewMode, grid]);

  // Calculate cell size based on zoom level
  const cellSize = Math.max(4, Math.floor(20 * zoom));

  if (!isViewerMode) {
    return (
      <button
        className="btn-primary mb-4"
        onClick={() => setIsViewerMode(true)}
      >
        Enter Pattern Viewer
      </button>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Pattern Viewer
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Mode:</span>
            <select
              value={viewMode}
              onChange={(e) => {
                setViewMode(e.target.value as 'row' | 'column');
                setActiveIndex(0);
              }}
              className="input py-1 px-2"
            >
              <option value="row">Row</option>
              <option value="column">Column</option>
            </select>
          </div>
          <button
            className="btn-secondary"
            onClick={() => setIsViewerMode(false)}
          >
            Exit Viewer
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="grid-container relative">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex">
              {row.map((color, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="transition-opacity duration-200"
                  style={{
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: color || 'transparent',
                    opacity: viewMode === 'row'
                      ? rowIndex === activeIndex ? 1 : 0.3
                      : colIndex === activeIndex ? 1 : 0.3,
                    border: '1px solid rgba(0,0,0,0.1)',
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          {viewMode === 'row' ? (
            <>
              <button
                className="btn-secondary p-2"
                onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                className="btn-secondary p-2"
                onClick={() => setActiveIndex(prev => Math.min(grid.length - 1, prev + 1))}
                disabled={activeIndex === grid.length - 1}
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              <button
                className="btn-secondary p-2"
                onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                disabled={activeIndex === 0}
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                className="btn-secondary p-2"
                onClick={() => setActiveIndex(prev => Math.min(grid[0].length - 1, prev + 1))}
                disabled={activeIndex === grid[0].length - 1}
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
        <p>Current {viewMode}: {activeIndex + 1} of {viewMode === 'row' ? grid.length : grid[0].length}</p>
        <p className="mt-1 text-xs">Use arrow keys to navigate</p>
      </div>
    </div>
  );
};

export default PatternViewer;