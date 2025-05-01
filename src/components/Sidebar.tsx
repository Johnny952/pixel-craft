import React, { useState } from 'react';
import ColorPalette from './ColorPalette';
import Settings from './Settings';
import ImageUploader from './ImageUploader';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

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
  // Estado para controlar qué acordeones están abiertos
  const [openSections, setOpenSections] = useState({
    colorPalette: true,  // Abierto por defecto
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