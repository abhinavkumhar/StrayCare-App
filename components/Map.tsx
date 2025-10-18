
import React from 'react';
import { Coordinates } from '../types';
import { MapPinIcon } from './icons';

interface MapProps {
    coordinates: Coordinates | null;
    onManualSelect?: (coords: Coordinates) => void;
    interactive: boolean;
}

const Map: React.FC<MapProps> = ({ coordinates, onManualSelect, interactive }) => {
    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!interactive || !onManualSelect) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Mock conversion of click position to lat/lng
        const latitude = 90 - (y / rect.height) * 180;
        const longitude = (x / rect.width) * 360 - 180;

        onManualSelect({ latitude, longitude });
    };

    const getPinPosition = () => {
        if (!coordinates) return { top: '50%', left: '50%' };
        const top = `${50 - (coordinates.latitude / 180) * 100}%`;
        const left = `${50 + (coordinates.longitude / 360) * 100}%`;
        return { top, left };
    };

    return (
        <div 
            className={`relative w-full h-64 bg-green-200 rounded-lg overflow-hidden border-2 border-primary-light ${interactive ? 'cursor-crosshair' : 'cursor-default'}`}
            onClick={handleMapClick}
        >
            {/* Mock map background */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: 'url(https://picsum.photos/800/400?grayscale)' }}></div>
            <div className="absolute inset-0 bg-primary/10"></div>
            
            {coordinates && (
                <div className="absolute transform -translate-x-1/2 -translate-y-full" style={getPinPosition()}>
                    <MapPinIcon className="w-10 h-10 text-red-500 drop-shadow-lg" />
                </div>
            )}

            {!coordinates && interactive && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <p className="text-white text-lg font-semibold text-center p-4">Click on the map to set location</p>
                </div>
            )}
        </div>
    );
};

export default Map;
