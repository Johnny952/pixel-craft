import { create } from 'zustand';
import { saveAs } from 'file-saver';

type Tool = 'brush' | 'eyedropper' | 'pan' | 'text';

interface TextState {
  isActive: boolean;
  position: { x: number; y: number };
  content: string;
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
}

interface GridSize {
  width: number;
  height: number;
}

interface EditorState {
  grid: string[][];
  gridSize: GridSize;
  palette: string[];
  currentColor: string;
  tool: Tool;
  isDrawing: boolean;
  history: string[][][];
  historyIndex: number;
  zoom: number;
  pan: { x: number; y: number };
  text: TextState;
  
  // Actions
  setGridSize: (size: GridSize) => void;
  setGrid: (grid: string[][]) => void;
  setPixel: (row: number, col: number, color: string) => void;
  setCurrentColor: (color: string) => void;
  addColor: (color: string) => void;
  removeColor: (color: string) => void;
  setTool: (tool: Tool) => void;
  setIsDrawing: (isDrawing: boolean) => void;
  pickColor: (row: number, col: number) => void;
  clearGrid: () => void;
  
  // Text actions
  setTextContent: (content: string) => void;
  setTextPosition: (x: number, y: number) => void;
  setTextFontSize: (size: number) => void;
  setTextAlignment: (alignment: 'left' | 'center' | 'right') => void;
  confirmText: () => void;
  cancelText: () => void;
  
  // History actions
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  
  // Storage actions
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  exportAsJson: () => void;
  importFromJson: (data: any) => void;
  
  // View actions
  setZoom: (zoom: number) => void;
  setPan: (pan: { x: number; y: number }) => void;
  
  // Computed
  canUndo: boolean;
  canRedo: boolean;
}

const initialTextState: TextState = {
  isActive: false,
  position: { x: 0, y: 0 },
  content: '',
  fontSize: 1,
  color: '#000000',
  alignment: 'left'
};

// Create a grid of empty cells
const createEmptyGrid = (width: number, height: number): string[][] => {
  return Array(height).fill(null).map(() => Array(width).fill(''));
};

// Create the store
export const useEditorStore = create<EditorState>((set, get) => ({
  grid: createEmptyGrid(20, 20),
  gridSize: { width: 20, height: 20 },
  palette: ['#000000', '#ffffff', '#ff0000', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
  currentColor: '#000000',
  tool: 'brush' as Tool,
  isDrawing: false,
  history: [],
  historyIndex: -1,
  zoom: 1,
  pan: { x: 0, y: 0 },
  text: initialTextState,
  
  setGridSize: (size: GridSize) => {
    const { grid } = get();
    const newGrid = createEmptyGrid(size.width, size.height);
    
    // Preserve existing cells where possible
    for (let row = 0; row < Math.min(size.height, grid.length); row++) {
      for (let col = 0; col < Math.min(size.width, grid[0].length); col++) {
        newGrid[row][col] = grid[row][col];
      }
    }
    
    set({ 
      grid: newGrid, 
      gridSize: size 
    });
    
    get().saveToHistory();
  },

  setGrid: (newGrid: string[][]) => {
    set({ grid: newGrid });
    get().saveToHistory();
  },
  
  setPixel: (row: number, col: number, color: string) => {
    const { grid } = get();
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return;
    }
    
    if (grid[row][col] !== color) {
      const newGrid = grid.map((r, rIndex) => 
        rIndex === row 
          ? r.map((c, cIndex) => cIndex === col ? color : c) 
          : r
      );
      set({ grid: newGrid });
      
      if (!get().isDrawing) {
        get().saveToHistory();
      }
    }
  },
  
  setCurrentColor: (color: string) => {
    set({ currentColor: color });
  },
  
  addColor: (color: string) => {
    const { palette } = get();
    if (!palette.includes(color)) {
      set({ palette: [...palette, color] });
    }
  },
  
  removeColor: (color: string) => {
    const { palette, currentColor } = get();
    if (palette.length <= 1) return;
    
    const newPalette = palette.filter(c => c !== color);
    set({ 
      palette: newPalette,
      currentColor: currentColor === color ? newPalette[0] : currentColor
    });
  },
  
  setTool: (tool: Tool) => {
    if (tool === 'text') {
      set({ 
        tool,
        text: { ...initialTextState, isActive: true, color: get().currentColor }
      });
    } else {
      set({ 
        tool,
        text: initialTextState
      });
    }
  },
  
  setIsDrawing: (isDrawing: boolean) => {
    const wasDrawing = get().isDrawing;
    set({ isDrawing });
    
    if (wasDrawing && !isDrawing) {
      get().saveToHistory();
    }
  },
  
  pickColor: (row: number, col: number) => {
    const { grid } = get();
    if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
      return;
    }
    
    const color = grid[row][col];
    if (color) {
      set({ currentColor: color, tool: 'brush' });
    }
  },
  
  // Text actions
  setTextContent: (content: string) => {
    set(state => ({
      text: { ...state.text, content }
    }));
  },
  
  setTextPosition: (x: number, y: number) => {
    set(state => ({
      text: { ...state.text, position: { x, y } }
    }));
  },
  
  setTextFontSize: (fontSize: number) => {
    set(state => ({
      text: { ...state.text, fontSize }
    }));
  },
  
  setTextAlignment: (alignment: 'left' | 'center' | 'right') => {
    set(state => ({
      text: { ...state.text, alignment }
    }));
  },
  
  confirmText: () => {
    const { text, grid } = get();
    if (!text.content) return;
    
    // Create a temporary canvas to render the text
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size based on text and font size
    const cellSize = 8 * text.fontSize;
    canvas.width = text.content.length * cellSize;
    canvas.height = cellSize;
    
    // Configure text rendering
    ctx.fillStyle = text.color;
    ctx.font = `${cellSize}px 'Press Start 2P', monospace`;
    ctx.textBaseline = 'top';
    ctx.fillText(text.content, 0, 0);
    
    // Get pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data } = imageData;
    
    // Convert to grid cells
    const startX = Math.floor(text.position.x);
    const startY = Math.floor(text.position.y);
    
    const newGrid = grid.map(row => [...row]);
    
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const i = (y * canvas.width + x) * 4;
        if (data[i + 3] > 128) { // If pixel is visible (alpha > 0.5)
          const gridY = startY + Math.floor(y / cellSize);
          const gridX = startX + Math.floor(x / cellSize);
          
          if (gridY >= 0 && gridY < grid.length && gridX >= 0 && gridX < grid[0].length) {
            newGrid[gridY][gridX] = text.color;
          }
        }
      }
    }
    
    set({ 
      grid: newGrid,
      text: initialTextState,
      tool: 'brush'
    });
    
    get().saveToHistory();
  },
  
  cancelText: () => {
    set({ 
      text: initialTextState,
      tool: 'brush'
    });
  },
  
  clearGrid: () => {
    const { gridSize } = get();
    set({ 
      grid: createEmptyGrid(gridSize.width, gridSize.height)
    });
    get().saveToHistory();
  },
  
  saveToHistory: () => {
    const { grid, history, historyIndex } = get();
    const gridCopy = grid.map(row => [...row]);
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(gridCopy);
    
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },
  
  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        grid: history[newIndex].map(row => [...row]),
        historyIndex: newIndex
      });
    }
  },
  
  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        grid: history[newIndex].map(row => [...row]),
        historyIndex: newIndex
      });
    }
  },
  
  saveToLocalStorage: () => {
    const { grid, gridSize, palette } = get();
    const data = {
      grid,
      gridSize,
      palette,
      version: '1.0.0'
    };
    
    try {
      localStorage.setItem('pixelcraft_project', JSON.stringify(data));
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      alert('Failed to save project. Please try exporting as JSON instead.');
    }
  },
  
  loadFromLocalStorage: () => {
    try {
      const savedData = localStorage.getItem('pixelcraft_project');
      if (savedData) {
        const data = JSON.parse(savedData);
        if (data.grid && data.gridSize && data.palette) {
          set({
            grid: data.grid,
            gridSize: data.gridSize,
            palette: data.palette,
            history: [data.grid.map(row => [...row])],
            historyIndex: 0
          });
        }
      }
    } catch (error) {
      console.error('Failed to load project:', error);
    }
  },
  
  exportAsJson: () => {
    const { grid, gridSize, palette } = get();
    const data = {
      grid,
      gridSize,
      palette,
      version: '1.0.0',
      createdAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    saveAs(blob, `pixel_craft_${new Date().toISOString().slice(0, 10)}.json`);
  },
  
  importFromJson: (data: any) => {
    if (!data.grid || !data.gridSize || !data.palette) {
      throw new Error('Invalid file format');
    }
    
    set({
      grid: data.grid,
      gridSize: data.gridSize,
      palette: data.palette,
      history: [data.grid.map((row: string[]) => [...row])],
      historyIndex: 0
    });
  },
  
  setZoom: (zoom: number) => {
    set({ zoom });
  },
  
  setPan: (pan: { x: number; y: number }) => {
    set({ pan });
  },
  
  get canUndo() {
    return get().historyIndex > 0;
  },
  
  get canRedo() {
    return get().historyIndex < get().history.length - 1;
  }
}));

// Initialize history with the empty grid
if (typeof window !== 'undefined') {
  const initialGrid = createEmptyGrid(20, 20);
  useEditorStore.getState().history = [initialGrid.map(row => [...row])];
  useEditorStore.getState().historyIndex = 0;
}