import React, { useState } from 'react';
import { Plus, Check, Trash2, Edit, XCircle, ArrowLeft } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';

const ColorPalette = () => {
  const { palette, currentColor, setCurrentColor, addColor, removeColor } = useEditorStore();
  const [showPaletteEditor, setShowPaletteEditor] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [newColor, setNewColor] = useState('#ffffff');

  const defaultColors = [
    '#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff', '#ff9900', '#9900ff'
  ];

  const handleAddColor = () => {
    if (newColor && !palette.includes(newColor)) {
      addColor(newColor);
      setNewColor('#ffffff');
      setShowColorPicker(false);
    }
  };

  const openColorPicker = () => {
    setNewColor('#ffffff');
    setShowColorPicker(true);
  };

  const backToPaletteEditor = () => {
    setShowColorPicker(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {palette.map((color) => (
          <div
            key={color}
            className={`relative w-8 h-8 rounded-md cursor-pointer transition-transform hover:scale-110 ${color === currentColor ? 'ring-2 ring-blue-500 transform scale-110' : ''
              }`}
            style={{ backgroundColor: color }}
            onClick={() => setCurrentColor(color)}
          >
            {color === currentColor && (
              <span className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-0.5">
                <Check className="w-3 h-3 text-white" />
              </span>
            )}
          </div>
        ))}

        <button
          className="w-8 h-8 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          onClick={() => setShowPaletteEditor(true)}
          aria-label="Edit color palette"
        >
          <Edit className="w-4 h-4 text-gray-700 dark:text-gray-300" />
        </button>
      </div>

      {/* Current color display */}
      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-md mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: currentColor }}
          ></div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">Current Color</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{currentColor}</p>
          </div>
        </div>
      </div>

      {/* Default color suggestions */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested Colors</p>
        <div className="flex flex-wrap gap-1">
          {defaultColors.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-sm transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{ backgroundColor: color }}
              onClick={() => setCurrentColor(color)}
            ></button>
          ))}
        </div>
      </div>

      {/* Palette Editor Modal */}
      {showPaletteEditor && !showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Color Palette</h3>
              <button
                onClick={() => setShowPaletteEditor(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Current palette colors section */}
            <div className="overflow-y-auto flex-1">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Current Colors</h4>
              {palette.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No colors in palette yet</p>
              ) : (
                <div className="space-y-2">
                  {palette.map((color) => (
                    <div
                      key={color}
                      className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-md"
                    >
                      <div
                        className="w-8 h-8 rounded-md mr-3 border border-gray-300 dark:border-gray-600"
                        style={{ backgroundColor: color }}
                      ></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{color}</span>
                      <button
                        className="p-1.5 bg-red-100 text-red-500 rounded-md hover:bg-red-200 transition-colors"
                        onClick={() => removeColor(color)}
                        aria-label={`Remove color ${color}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={openColorPicker}
                    className="w-full p-2 mt-2 flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700 border border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add new color</span>
                  </button>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={() => setShowPaletteEditor(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Color Picker Modal */}
      {showColorPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={backToPaletteEditor}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to palette</span>
              </button>
              <button
                onClick={() => {
                  setShowColorPicker(false);
                  setShowPaletteEditor(false);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Add New Color</h3>

            <div className="space-y-4 py-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Color</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="h-12 w-12 border-0 p-0 rounded-md"
                  />
                  <input
                    id="colorInput"
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="#RRGGBB"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Suggested Colors</p>
                <div className="flex flex-wrap gap-2">
                  {defaultColors.map((color) => (
                    <button
                      key={color}
                      className="w-8 h-8 rounded-md transition-transform hover:scale-110 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      style={{ backgroundColor: color }}
                      onClick={() => setNewColor(color)}
                    ></button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={backToPaletteEditor}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-black bg-blue-600 rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                onClick={handleAddColor}
              >
                <Plus className="w-4 h-4" />
                Add to Palette
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorPalette;