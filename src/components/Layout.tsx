import React, { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <div className="flex-grow flex">
        <main className="flex-grow relative">
          {children}
          
          {/* Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-30 bg-white dark:bg-gray-800 p-2 rounded-l-lg shadow-lg border border-r-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {isSidebarOpen ? (
              <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </main>
        
        <Sidebar isOpen={isSidebarOpen} />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;