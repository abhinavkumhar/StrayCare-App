
import React from 'react';
import { Page } from '../types';
import { PawPrintIcon } from './icons';

interface HeaderProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
    const navItems = [
        { page: Page.Report, label: 'Report Animal' },
        { page: Page.Dashboard, label: 'Dashboard' },
        { page: Page.About, label: 'About Us' },
    ];

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
                                onClick={() => setCurrentPage(item.page)}
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
                        {/* Mobile menu button could be added here */}
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
