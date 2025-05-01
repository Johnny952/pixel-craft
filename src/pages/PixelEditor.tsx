import React, { useEffect } from 'react';
import PixelGrid from '../components/PixelGrid';
import FloatingToolbar from '../components/FloatingToolbar';
import TextTool from '../components/TextTool';
import { useEditorStore } from '../store/editorStore';

const PixelEditor: React.FC = () => {
  const { loadFromLocalStorage } = useEditorStore();
  
  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className="relative h-[calc(100vh-4rem)]">
      <FloatingToolbar />
      <div className="h-full p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full overflow-hidden">
          <PixelGrid />
          <TextTool />
        </div>
      </div>
    </div>
  );
};

export default PixelEditor;