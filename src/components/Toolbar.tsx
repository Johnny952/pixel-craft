import React from 'react';
import { 
  Brush, 
  Pipette, 
  Move, 
  Save, 
  Upload, 
  Download, 
  RotateCcw, 
  RotateCw, 
  Trash2
} from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import { exportAsPng } from '../utils/exportUtils';

const Toolbar: React.FC = () => {
  const { 
    tool, 
    setTool, 
    saveToLocalStorage, 
    loadFromLocalStorage,
    exportAsJson,
    importFromJson,
    undo,
    redo,
    canUndo,
    canRedo,
    clearGrid
  } = useEditorStore();
  
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const jsonData = JSON.parse(event.target.result as string);
          importFromJson(jsonData);
        }
      } catch (error) {
        alert('Invalid file format. Please upload a valid JSON file.');
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const tools = [
    { name: 'brush', icon: Brush, label: 'Draw' },
    { name: 'eyedropper', icon: Pipette, label: 'Pick Color' },
    { name: 'pan', icon: Move, label: 'Pan' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Tools</h2>
      
      {/* Drawing Tools */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {tools.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`btn-tool flex flex-col items-center py-2 ${tool === item.name ? 'btn-tool-active' : ''}`}
              onClick={() => setTool(item.name as 'brush' | 'eyedropper' | 'pan')}
              title={item.label}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
      </div>
      
      {/* Undo/Redo */}
      <div className="flex space-x-2 mb-4">
        <button 
          className={`btn-secondary py-1 px-3 flex-1 ${!canUndo ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={undo}
          disabled={!canUndo}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Undo
        </button>
        <button 
          className={`btn-secondary py-1 px-3 flex-1 ${!canRedo ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={redo}
          disabled={!canRedo}
        >
          <RotateCw className="w-4 h-4 mr-1" />
          Redo
        </button>
      </div>
      
      {/* Save/Export/Import */}
      <div className="space-y-2">
        <button 
          className="btn-secondary py-2 w-full flex items-center justify-center"
          onClick={saveToLocalStorage}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Project
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="btn-secondary py-2 flex items-center justify-center"
            onClick={() => exportAsPng(false)}
          >
            <Download className="w-4 h-4 mr-1" />
            Export PNG
          </button>
          
          <button 
            className="btn-secondary py-2 flex items-center justify-center"
            onClick={() => exportAsPng(true)}
          >
            <Download className="w-4 h-4 mr-1" />
            PNG with Grid
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            className="btn-secondary py-2 flex items-center justify-center"
            onClick={exportAsJson}
          >
            <Download className="w-4 h-4 mr-1" />
            Export JSON
          </button>
          
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="sr-only"
              id="json-file-upload"
            />
            <label 
              htmlFor="json-file-upload"
              className="btn-secondary py-2 flex items-center justify-center cursor-pointer"
            >
              <Upload className="w-4 h-4 mr-1" />
              Import JSON
            </label>
          </div>
        </div>
        
        <button 
          className="btn-secondary py-2 w-full flex items-center justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
          onClick={() => {
            if (window.confirm('Are you sure you want to clear the grid? This action cannot be undone.')) {
              clearGrid();
            }
          }}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Grid
        </button>
      </div>
    </div>
  );
};

export default Toolbar;