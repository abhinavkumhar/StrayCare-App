
import React, { useState } from 'react';
import { Page } from '../types';
import { PawPrintIcon, MenuIcon, XIcon } from './icons';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navItems = [
        { page: Page.Report, label: 'Report Animal' },
        { page: Page.Dashboard, label: 'Dashboard' },
        { page: Page.About, label: 'About Us' },
    ];

    const handleNavClick = (page: Page) => {
        setCurrentPage(page);
        setIsMenuOpen(false); // Close menu on navigation
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <PawPrintIcon className="h-8 w-8 text-primary" />
                        <span className="ml-2 text-2xl font-bold text-primary-dark">StrayCare</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                             <button
                                key={item.page}
                                onClick={() => handleNavClick(item.page)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                                    currentPage === item.page
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-green-100 hover:text-primary-dark'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <div className="md:hidden">
                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary-dark hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                            aria-controls="mobile-menu"
                            aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <XIcon className="block h-6 w-6" />
                            ) : (
                                <MenuIcon className="block h-6 w-6" />
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu, show/hide based on menu state. */}
            {isMenuOpen && (
                <div className="md:hidden" id="mobile-menu">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navItems.map((item) => (
                            <button
                                key={item.page}
                                onClick={() => handleNavClick(item.page)}
                                className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                                    currentPage === item.page
                                        ? 'bg-primary text-white'
                                        : 'text-gray-700 hover:bg-green-100 hover:text-primary-dark'
                                }`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;