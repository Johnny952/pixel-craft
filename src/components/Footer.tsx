import React from 'react';
import { Scissors } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-xl text-primary-600 dark:text-primary-500">
                <Scissors className="inline-block w-6 h-6" />
              </span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">PixelCraft</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Design beautiful pixel art patterns for your textile crafts. Perfect for crochet, cross stitch, 
              tapestry and loom projects.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Editor</a></li>
              <li><a href="#patterns" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Patterns</a></li>
              <li><a href="#about" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Connect</h3>
            <ul className="space-y-2">
              <li className="text-gray-600 dark:text-gray-400">hello@pixelcraft.com</li>
              <li className="text-gray-600 dark:text-gray-400">
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Instagram</a>
              </li>
              <li className="text-gray-600 dark:text-gray-400">
                <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pinterest</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            © {currentYear} PixelCraft. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 text-sm text-gray-500 dark:text-gray-500">
            Made with ♥ for craft lovers everywhere
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;