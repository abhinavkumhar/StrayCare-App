
import React, { useState, useCallback, ChangeEvent, DragEvent } from 'react';
import { Coordinates, Report, ReportStatus } from '../types';
import Map from './Map';
import { ClockIcon, MapPinIcon, UploadCloudIcon, CrosshairIcon } from './icons';

// Using a global declaration for 'exifr' which is loaded from a CDN
declare global {
    interface Window {
        exifr: any;
    }
}

interface ReportFormProps {
  addReport: (report: Omit<Report, 'id'>) => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const ReportForm: React.FC<ReportFormProps> = ({ addReport, showToast }) => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [dragActive, setDragActive] = useState<boolean>(false);

    const [timestamp, setTimestamp] = useState<Date | null>(null);
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [address, setAddress] = useState<string>('');
    const [isManualLocation, setIsManualLocation] = useState<boolean>(false);

    const resetForm = () => {
        setImageFile(null);
        setImageUrl('');
        setIsProcessing(false);
        setTimestamp(null);
        setCoordinates(null);
        setAddress('');
        setIsManualLocation(false);
    };
    
    const processImage = useCallback(async (file: File) => {
        if (!file) return;
        resetForm();
        setIsProcessing(true);
        setImageFile(file);
        setImageUrl(URL.createObjectURL(file));

        try {
            const exifData = await window.exifr.parse(file);
            if (exifData && exifData.latitude && exifData.longitude) {
                setCoordinates({ latitude: exifData.latitude, longitude: exifData.longitude });
                // Mock reverse geocoding
                setAddress(`Address near ${exifData.latitude.toFixed(4)}, ${exifData.longitude.toFixed(4)}`);
                setIsManualLocation(false);
                showToast('GPS data found in image!', 'success');
            } else {
                setAddress('GPS data not found. Please set location manually.');
                setIsManualLocation(true);
                showToast('GPS data not found in image.', 'error');
            }
            setTimestamp(exifData?.DateTimeOriginal || new Date());
        } catch (error) {
            console.error('Error parsing EXIF data:', error);
            setAddress('Could not read image metadata. Please set location manually.');
            setTimestamp(new Date());
            setIsManualLocation(true);
            showToast('Could not read image metadata.', 'error');
        } finally {
            setIsProcessing(false);
        }
    }, [showToast]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            processImage(e.target.files[0]);
        }
    };
    
    const handleDrag = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processImage(e.dataTransfer.files[0]);
        }
    };
    
    const handleManualLocationSelect = (coords: Coordinates) => {
        setCoordinates(coords);
        setAddress(`Manually selected location: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
    };

    const handleUseCurrentLocation = () => {
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                };
                setCoordinates(coords);
                setAddress(`Current location: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
                showToast('Current location set successfully!', 'success');
            }, () => {
                showToast('Unable to retrieve your location.', 'error');
            });
        } else {
            showToast('Geolocation is not supported by your browser.', 'error');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl || !coordinates || !timestamp) {
            showToast('Please provide an image and ensure location is set.', 'error');
            return;
        }

        const newReport: Omit<Report, 'id'> = {
            imageUrl,
            timestamp,
            coordinates,
            address,
            status: ReportStatus.Pending,
        };

        addReport(newReport);
        showToast('Report submitted successfully!', 'success');
        resetForm();
    };


    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-primary-dark">Report a Stray Animal</h1>
                <p className="text-gray-600 mt-2">Your report can save a life. Upload a photo to get started.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl space-y-6">
                {!imageUrl && (
                     <div onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-lg p-10 text-center transition-colors duration-300 ${dragActive ? 'border-primary bg-green-50' : 'border-gray-300'}`}>
                        <input type="file" id="file-upload" className="hidden" accept="image/jpeg, image/png" onChange={handleFileChange} />
                        <label htmlFor="file-upload" className="cursor-pointer">
                            <UploadCloudIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-700">Drag & drop or <span className="text-primary">browse</span></h3>
                            <p className="text-sm text-gray-500 mt-1">JPEG or PNG. GPS data preferred.</p>
                        </label>
                    </div>
                )}

                {isProcessing && <p>Processing image...</p>}

                {imageUrl && (
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <img src={imageUrl} alt="Uploaded stray" className="rounded-lg shadow-md w-full h-auto object-cover" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-lg text-primary-dark mb-2">Extracted Information</h3>
                                <div className="space-y-3 text-gray-700 bg-secondary p-4 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <ClockIcon className="w-5 h-5 text-primary"/>
                                        <span id="timestamp">{timestamp ? timestamp.toLocaleString() : 'N/A'}</span>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <MapPinIcon className="w-5 h-5 text-primary mt-1"/>
                                        <span id="address">{address || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            {isManualLocation && (
                                <button type="button" onClick={handleUseCurrentLocation} className="w-full flex items-center justify-center gap-2 bg-primary-light text-primary-dark font-semibold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors">
                                    <CrosshairIcon className="w-5 h-5"/>
                                    Use My Current Location
                                </button>
                            )}

                            <div>
                                <h3 className="font-semibold text-lg text-primary-dark mb-2">Location on Map</h3>
                                <Map coordinates={coordinates} onManualSelect={handleManualLocationSelect} interactive={isManualLocation} />
                            </div>
                        </div>
                    </div>
                )}
                
                {imageUrl && !isProcessing && (
                    <div className="flex gap-4">
                        <button type="button" onClick={resetForm} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors">
                            Clear
                        </button>
                        <button type="submit" disabled={!coordinates} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed">
                            Submit Report
                        </button>
                    </div>
                )}

            </form>
        </div>
    );
};

export default ReportForm;
