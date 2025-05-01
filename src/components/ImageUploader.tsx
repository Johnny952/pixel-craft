import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useEditorStore } from '../store/editorStore';
import convert from 'color-convert';

const ImageUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { gridSize, setGrid, palette, addColor } = useEditorStore();

  const findClosestColor = (r: number, g: number, b: number): string => {
    let minDistance = Infinity;
    let closestColor = palette[0];

    // Convert target color to Lab color space
    const targetLab = convert.rgb.lab([r, g, b]);

    palette.forEach(color => {
      // Convert hex to RGB
      const rgb = convert.hex.rgb(color.substring(1));
      // Convert RGB to Lab
      const lab = convert.rgb.lab(rgb);

      // Calculate Euclidean distance in Lab space
      const distance = Math.sqrt(
        Math.pow(targetLab[0] - lab[0], 2) +
        Math.pow(targetLab[1] - lab[1], 2) +
        Math.pow(targetLab[2] - lab[2], 2)
      );

      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    });

    return closestColor;
  };

  const processImage = (image: HTMLImageElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate aspect ratios
    const imageRatio = image.width / image.height;
    const gridRatio = gridSize.width / gridSize.height;

    let sw, sh, sx, sy;
    if (imageRatio > gridRatio) {
      // Image is wider - crop sides
      sh = image.height;
      sw = image.height * gridRatio;
      sy = 0;
      sx = (image.width - sw) / 2;
    } else {
      // Image is taller - crop top/bottom
      sw = image.width;
      sh = image.width / gridRatio;
      sx = 0;
      sy = (image.height - sh) / 2;
    }

    canvas.width = gridSize.width;
    canvas.height = gridSize.height;

    // Draw and scale image
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(image, sx, sy, sw, sh, 0, 0, gridSize.width, gridSize.height);

    // Process pixels
    const newGrid: string[][] = Array(gridSize.height).fill(null)
      .map(() => Array(gridSize.width).fill(''));

    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const color = findClosestColor(pixel[0], pixel[1], pixel[2]);
        newGrid[y][x] = color;
      }
    }

    setGrid(newGrid);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const image = new Image();
      image.onload = () => processImage(image);
      image.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4">
      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="sr-only"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </label>
      </div>

      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Upload an image to convert it into a pixel pattern. The image will be automatically scaled and mapped to your current color palette.
      </p>
    </div>
  );
};

export default ImageUploader;