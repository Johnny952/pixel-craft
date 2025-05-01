import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon, Scissors } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        }`}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-2xl text-primary-600 dark:text-primary-500">
            <Scissors className="inline-block w-7 h-7" />
          </span>
          <span className="text-xl font-bold text-gray-900 dark:text-white">PixelCraft</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLinks />
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-100" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-gray-100" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="Open menu"
          >
            {isOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg">
            <div className="p-4 flex flex-col space-y-4">
              <NavLinks mobile onClick={() => setIsOpen(false)} />
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

interface NavLinksProps {
  mobile?: boolean;
  onClick?: () => void;
}

const NavLinks: React.FC<NavLinksProps> = ({ mobile, onClick }) => {
  const navItems = [
    { label: 'Editor', href: '#' },
    //{ label: 'Patterns', href: '#patterns' },
    //{ label: 'About', href: '#about' }
  ];

  return (
    <>
      {navItems.map((item) => (
        <a
          key={item.label}
          href={item.href}
          onClick={onClick}
          className={`${mobile ? 'block py-2' : ''
            } font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors`}
        >
          {item.label}
        </a>
      ))}
    </>
  );
};

export default Navbar;