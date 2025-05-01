import React, { useEffect, useRef } from 'react';
import { useEditorStore } from '../store/editorStore';
import { motion } from 'framer-motion';
import { AlignLeft, AlignCenter, AlignRight, Check, X } from 'lucide-react';

const TextTool: React.FC = () => {
  const {
    text,
    setTextContent,
    setTextPosition,
    setTextFontSize,
    setTextAlignment,
    confirmText,
    cancelText,
    zoom,
    pan
  } = useEditorStore();
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (text.isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [text.isActive]);

  if (!text.isActive) return null;

  const handleDrag = (_: any, info: { offset: { x: number; y: number } }) => {
    setTextPosition(
      text.position.x + info.offset.x / (20 * zoom),
      text.position.y + info.offset.y / (20 * zoom)
    );
  };

  return (
    <>
      {/* Floating Text Box */}
      <motion.div
        drag
        dragMomentum={false}
        onDrag={handleDrag}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="absolute z-30 min-w-[200px]"
        style={{
          left: text.position.x * 20 * zoom + pan.x,
          top: text.position.y * 20 * zoom + pan.y,
          transform: `scale(${text.fontSize})`
        }}
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2">
          <input
            ref={inputRef}
            type="text"
            value={text.content}
            onChange={(e) => setTextContent(e.target.value)}
            className="w-full px-2 py-1 bg-transparent border-none focus:outline-none text-gray-900 dark:text-white font-pixel"
            placeholder="Type your text..."
          />
        </div>
      </motion.div>

      {/* Text Controls */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2 flex items-center gap-4">
        {/* Font Size */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 dark:text-gray-400">Size:</label>
          <select
            value={text.fontSize}
            onChange={(e) => setTextFontSize(Number(e.target.value))}
            className="input py-1 px-2"
          >
            <option value="1">1x</option>
            <option value="2">2x</option>
            <option value="3">3x</option>
          </select>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 border-l border-gray-200 dark:border-gray-700 pl-4">
          <button
            onClick={() => setTextAlignment('left')}
            className={`p-1 rounded ${text.alignment === 'left' ? 'bg-primary-100 dark:bg-primary-900/30' : ''}`}
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlignment('center')}
            className={`p-1 rounded ${text.alignment === 'center' ? 'bg-primary-100 dark:bg-primary-900/30' : ''}`}
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTextAlignment('right')}
            className={`p-1 rounded ${text.alignment === 'right' ? 'bg-primary-100 dark:bg-primary-900/30' : ''}`}
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Confirm/Cancel */}
        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-700 pl-4">
          <button
            onClick={confirmText}
            className="btn-primary py-1 px-3 flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            Confirm
          </button>
          <button
            onClick={cancelText}
            className="btn-secondary py-1 px-3 flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default TextTool;