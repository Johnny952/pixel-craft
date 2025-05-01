import React, { useState } from 'react';
import ColorPalette from './ColorPalette';
import Settings from './Settings';
import ImageUploader from './ImageUploader';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Download, Save, Trash2, Upload } from 'lucide-react';
import PatternViewer from './PatternViewer';
import { exportAsPng } from '../utils/exportUtils';
import { useEditorStore } from '../store/editorStore';

interface SidebarProps {
  isOpen: boolean;
}

interface AccordionSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-750 text-left font-medium text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={onToggle}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const {
    saveToLocalStorage,
    exportAsJson,
    importFromJson,
    clearGrid
  } = useEditorStore();

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Estado para controlar qué acordeones están abiertos
  const [openSections, setOpenSections] = useState({
    colorPalette: true,
    saveImportExport: false,
    imageUploader: false,
    settings: false
  });

  // Función para alternar una sección específica
  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

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
        alert(`Invalid file format. Please upload a valid JSON file: ${error}`);
      }
    };
    reader.readAsText(file);

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-80 shrink-0 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 overflow-y-auto fixed right-0 top-0 bottom-0 z-20 md:relative"
        >
          <div className="p-4 space-y-4">
            <PatternViewer />

            {/* Save/Export/Import */}
            <AccordionSection
              title="Save/Export/Import"
              isOpen={openSections.saveImportExport}
              onToggle={() => toggleSection('saveImportExport')}
            >
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
            </AccordionSection>

            <AccordionSection
              title="Color Palette"
              isOpen={openSections.colorPalette}
              onToggle={() => toggleSection('colorPalette')}
            >
              <ColorPalette />
            </AccordionSection>

            <AccordionSection
              title="Image Uploader"
              isOpen={openSections.imageUploader}
              onToggle={() => toggleSection('imageUploader')}
            >
              <ImageUploader />
            </AccordionSection>

            <AccordionSection
              title="Settings"
              isOpen={openSections.settings}
              onToggle={() => toggleSection('settings')}
            >
              <Settings />
            </AccordionSection>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;