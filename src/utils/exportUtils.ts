import { toPng } from 'html-to-image';
import { saveAs } from 'file-saver';
import { useEditorStore } from '../store/editorStore';

/**
 * Exports the current pixel grid as a PNG image
 * @param showGrid Whether to include grid lines in the exported image
 */
export const exportAsPng = async (showGrid: boolean = false) => {
  const { grid, gridSize } = useEditorStore.getState();
  
  // Create a temporary canvas element
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  
  // We'll use a larger pixel size for the exported image
  const pixelSize = 20;
  canvas.width = gridSize.width * pixelSize;
  canvas.height = gridSize.height * pixelSize;
  
  // Fill with a white background for transparent cells
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw each pixel
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      const color = grid[row][col];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(
          col * pixelSize, 
          row * pixelSize, 
          pixelSize, 
          pixelSize
        );
      }
    }
  }
  
  // Draw grid lines if requested
  if (showGrid) {
    ctx.strokeStyle = '#dddddd';
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= gridSize.width; x++) {
      ctx.beginPath();
      ctx.moveTo(x * pixelSize, 0);
      ctx.lineTo(x * pixelSize, canvas.height);
      ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= gridSize.height; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * pixelSize);
      ctx.lineTo(canvas.width, y * pixelSize);
      ctx.stroke();
    }
  }
  
  // Convert canvas to blob and download
  canvas.toBlob((blob) => {
    if (blob) {
      saveAs(blob, `pixel_craft_${new Date().toISOString().slice(0, 10)}${showGrid ? '_with_grid' : ''}.png`);
    }
  });
};