
import React, { useState, useMemo } from 'react';
import { Report, ReportStatus } from '../types';
import ReportModal from './ReportModal';
import { ClockIcon, MapPinIcon } from './icons';

interface DashboardProps {
  reports: Report[];
  updateReportStatus: (id: string, status: ReportStatus) => void;
}

const ReportCard: React.FC<{ report: Report, onClick: () => void }> = ({ report, onClick }) => {
    const statusColor = {
        [ReportStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [ReportStatus.InProgress]: 'bg-blue-100 text-blue-800',
        [ReportStatus.Resolved]: 'bg-green-100 text-green-800',
    };

    return (
        <div
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden cursor-pointer"
            onClick={onClick}
        >
            <img src={report.imageUrl} alt="Reported animal" className="w-full h-48 object-cover" />
            <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor[report.status]}`}>
                        {report.status}
                    </span>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4 text-primary" />
                        <span>{report.timestamp.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-start gap-2">
                        <MapPinIcon className="w-4 h-4 text-primary mt-0.5" />
                        <span className="truncate">{report.address}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ reports, updateReportStatus }) => {
  const [filter, setFilter] = useState<ReportStatus | 'All'>('All');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const filteredReports = useMemo(() => {
    if (filter === 'All') return reports;
    return reports.filter((report) => report.status === filter);
  }, [reports, filter]);
  
  const sortedReports = useMemo(() => {
    return [...filteredReports].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [filteredReports]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-primary-dark mb-8">Rescue Dashboard</h1>

      <div className="flex justify-center gap-2 mb-8 bg-green-100 p-2 rounded-full">
        {(['All', ...Object.values(ReportStatus)] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
              filter === status ? 'bg-primary text-white shadow-md' : 'text-primary-dark hover:bg-primary-light/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {sortedReports.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedReports.map((report) => (
            <ReportCard key={report.id} report={report} onClick={() => setSelectedReport(report)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No reports found for this filter.</p>
        </div>
      )}

      <ReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onUpdateStatus={updateReportStatus}
      />
    </div>
  );
};

export default Dashboard;
