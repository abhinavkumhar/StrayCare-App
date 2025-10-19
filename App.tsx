
import React, { useState, useCallback, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import Header from './components/Header';
import ReportForm from './components/ReportForm';
import Dashboard from './components/Dashboard';
import { Report, ReportStatus, Page } from './types';

// Mock Data
const initialReports: Report[] = [
    {
        id: '1',
        imageUrl: 'https://picsum.photos/seed/animal1/600/400',
        timestamp: new Date(Date.now() - 86400000 * 2),
        coordinates: { latitude: 34.0522, longitude: -118.2437 },
        address: '123 Main St, Los Angeles, CA',
        status: ReportStatus.Resolved,
    },
    {
        id: '2',
        imageUrl: 'https://picsum.photos/seed/animal2/600/400',
        timestamp: new Date(Date.now() - 86400000),
        coordinates: { latitude: 40.7128, longitude: -74.0060 },
        address: '456 Oak Ave, New York, NY',
        status: ReportStatus.InProgress,
    },
    {
        id: '3',
        imageUrl: 'https://picsum.photos/seed/animal3/600/400',
        timestamp: new Date(),
        coordinates: { latitude: 41.8781, longitude: -87.6298 },
        address: '789 Pine Ln, Chicago, IL',
        status: ReportStatus.Pending,
    },
];


const AboutPage: React.FC = () => (
    <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
         <h1 className="text-4xl font-bold text-primary-dark mb-4">About StrayCare</h1>
         <p className="text-lg text-gray-700 mb-6">
            StrayCare is a community-driven initiative dedicated to the welfare of stray and injured animals.
            Our mission is to connect compassionate citizens with local animal rescue organizations and authorities to provide timely help to animals in need.
         </p>
         <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1200&auto=format&fit=crop" alt="Happy rescued animals" className="rounded-xl shadow-lg mx-auto aspect-[2/1] object-cover"/>
         <div className="mt-8 text-left space-y-4">
            <h2 className="text-2xl font-bold text-primary-dark text-center">How It Works</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 bg-white p-6 rounded-lg shadow-md">
                <li><strong className="font-semibold text-gray-800">Spot an Animal:</strong> If you see a stray or injured animal, take a clear photo from a safe distance.</li>
                <li><strong className="font-semibold text-gray-800">Upload & Report:</strong> Use our app to upload the photo. We automatically extract the time and GPS location if available. You can also pinpoint the location manually.</li>
                <li><strong className="font-semibold text-gray-800">Notify Rescuers:</strong> Once you submit the report, we instantly alert the nearest registered NGOs and animal rescue teams.</li>
                <li><strong className="font-semibold text-gray-800">Track the Rescue:</strong> You can follow the status of your report on our dashboard, from "Pending" to "Resolved".</li>
            </ol>
         </div>
    </div>
);

const App: React.FC = () => {
    const [reports, setReports] = useState<Report[]>(initialReports);
    const [currentPage, setCurrentPage] = useState<Page>(Page.Report);

    const showToast = useCallback((message: string, type: 'success' | 'error') => {
        if (type === 'success') {
            toast.success(message);
        } else {
            toast.error(message);
        }
    }, []);

    const addReport = useCallback((newReportData: Omit<Report, 'id'>) => {
        const newReport: Report = {
            ...newReportData,
            id: new Date().toISOString() + Math.random(),
        };
        setReports(prevReports => [newReport, ...prevReports]);
        setCurrentPage(Page.Dashboard);
    }, []);
    
    const updateReportStatus = useCallback((id: string, status: ReportStatus) => {
        setReports(prevReports =>
            prevReports.map(report =>
                report.id === id ? { ...report, status } : report
            )
        );
        showToast(`Report status updated to "${status}"`, 'success');
    }, [showToast]);

    const renderPage = () => {
        switch(currentPage) {
            case Page.Report:
                return <ReportForm addReport={addReport} showToast={showToast} />;
            case Page.Dashboard:
                return <Dashboard reports={reports} updateReportStatus={updateReportStatus} />;
            case Page.About:
                return <AboutPage />;
            default:
                return <ReportForm addReport={addReport} showToast={showToast} />;
        }
    }

    return (
        <div className="min-h-screen flex flex-col">
            <Toaster position="top-center" reverseOrder={false} />
            <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <footer className="bg-primary-dark text-white text-center p-4">
                <p>&copy; {new Date().getFullYear()} StrayCare App. Helping those without a voice.</p>
            </footer>
        </div>
    );
};

export default App;