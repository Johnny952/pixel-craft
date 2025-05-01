import React from 'react';
import { useEditorStore } from '../store/editorStore';
import { 
  Brush, 
  Pipette, 
  ZoomIn, 
  ZoomOut, 
  Type,
  Columns,
  Move
} from 'lucide-react';

const FloatingToolbar: React.FC = () => {
  const { 
    tool, 
    setTool, 
    currentColor,
    zoom,
    setZoom
  } = useEditorStore();

  const tools = [
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'eyedropper', icon: Pipette, label: 'Color Picker' },
    { id: 'pan', icon: Move, label: 'Pan' },
    { id: 'text', icon: Type, label: 'Add Text' }
  ];

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-10">
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-2">
        {/* Tools */}
        <div className="flex gap-1 border-r border-gray-200 dark:border-gray-700 pr-2">
          {tools.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              className={`p-2 rounded-md transition-colors ${
                tool === id 
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setTool(id as any)}
              title={label}
            >
              <Icon className="w-5 h-5" />
            </button>
          ))}
        </div>

        {/* Current Color */}
        <div className="flex items-center gap-2 border-r border-gray-200 dark:border-gray-700 pr-2">
          <div
            className="w-6 h-6 rounded-md border border-gray-300 dark:border-gray-600"
            style={{ backgroundColor: currentColor }}
          />
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            onClick={() => setZoom(Math.min(5, zoom + 0.1))}
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>

        {/* Pattern View Toggle */}
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-l border-gray-200 dark:border-gray-700"
          title="Toggle Pattern View"
        >
          <Columns className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default FloatingToolbar;