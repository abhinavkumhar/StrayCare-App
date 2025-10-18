
import React from 'react';
import { Report, ReportStatus } from '../types';
import { ClockIcon, MapPinIcon, XIcon } from './icons';
import Map from './Map';

interface ReportModalProps {
  report: Report | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: ReportStatus) => void;
}

const ReportModal: React.FC<ReportModalProps> = ({ report, onClose, onUpdateStatus }) => {
  if (!report) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors">
            <XIcon className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-bold text-primary-dark mb-4">Report Details</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img src={report.imageUrl} alt="Stray animal" className="w-full h-auto object-cover rounded-lg shadow-md mb-4" />
              <div className="space-y-3 text-gray-700">
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-5 h-5 text-primary" />
                  <span>{report.timestamp.toLocaleString()}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPinIcon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <span>{report.address}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Location</h3>
              <Map coordinates={report.coordinates} interactive={false} />
              
              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-2">Update Status</h3>
              <div className="flex gap-2">
                {Object.values(ReportStatus).map((status) => (
                  <button
                    key={status}
                    onClick={() => onUpdateStatus(report.id, status)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                      report.status === status
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-primary-light hover:text-primary-dark'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
