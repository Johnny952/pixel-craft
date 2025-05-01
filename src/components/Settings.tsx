import React, { useState } from 'react';
import { CheckCircle2, Settings2 } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

const Settings: React.FC = () => {
  const { gridSize, setGridSize } = useEditorStore();
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [newWidth, setNewWidth] = useState(gridSize.width.toString());
  const [newHeight, setNewHeight] = useState(gridSize.height.toString());
  const [error, setError] = useState('');

  const handleResizeGrid = () => {
    const width = parseInt(newWidth);
    const height = parseInt(newHeight);

    if (isNaN(width) || isNaN(height)) {
      setError('Please enter valid numbers');
      return;
    }

    if (width < 1 || height < 1) {
      setError('Dimensions must be greater than 0');
      return;
    }

    if (width > 100 || height > 100) {
      setError('Maximum grid size is 100x100');
      return;
    }

    setGridSize({ width, height });
    setShowSizeModal(false);
    setError('');
  };

  // Predefined grid sizes
  const gridPresets = [
    { name: 'Small', width: 10, height: 10 },
    { name: 'Medium', width: 20, height: 20 },
    { name: 'Large', width: 50, height: 50 },
    { name: 'Cross Stitch', width: 32, height: 32 },
    { name: 'Crochet', width: 24, height: 24 }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {/* Grid Size */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Grid Size</p>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {gridSize.width} × {gridSize.height}
          </span>
        </div>

        <button
          className="btn-secondary w-full flex items-center justify-center"
          onClick={() => setShowSizeModal(true)}
        >
          <Settings2 className="w-4 h-4 mr-2" />
          Change Grid Size
        </button>
      </div>

      {/* Common Grid Sizes */}
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grid Presets</p>
        <div className="grid grid-cols-2 gap-2">
          {gridPresets.map((preset) => (
            <button
              key={preset.name}
              className="text-xs btn-secondary py-1"
              onClick={() => setGridSize({ width: preset.width, height: preset.height })}
            >
              {preset.name} ({preset.width}×{preset.height})
            </button>
          ))}
        </div>
      </div>

      {/* Grid Size Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Change Grid Size</h3>

            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Width</label>
                <input
                  type="number"
                  value={newWidth}
                  onChange={(e) => setNewWidth(e.target.value)}
                  className="input"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Height</label>
                <input
                  type="number"
                  value={newHeight}
                  onChange={(e) => setNewHeight(e.target.value)}
                  className="input"
                  min="1"
                  max="100"
                />
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p className="flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1 text-primary-500" />
                  Minimum: 1x1, Maximum: 100x100
                </p>
                <p className="mt-1">
                  Changing the grid size will reset empty cells and preserve existing patterns where possible.
                </p>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="btn-secondary"
                  onClick={() => setShowSizeModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  onClick={handleResizeGrid}
                >
                  Resize Grid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;