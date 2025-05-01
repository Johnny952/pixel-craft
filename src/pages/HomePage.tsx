import React from 'react';

const HomePage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Design Beautiful Textile Patterns with PixelCraft
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Create, edit, and export pixel-perfect patterns for crochet, cross stitch, 
          tapestry, and more - all in your browser.
        </p>
        <div className="flex justify-center space-x-4">
          <a 
            href="#" 
            className="btn-primary px-8 py-3 text-lg"
          >
            Start Creating
          </a>
          <a 
            href="#about" 
            className="btn-secondary px-8 py-3 text-lg"
          >
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;