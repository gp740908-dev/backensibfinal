'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Check, Crosshair } from 'lucide-react';

interface MapPickerProps {
    latitude: string;
    longitude: string;
    onLocationChange: (lat: string, lng: string) => void;
}

export const MapPicker: React.FC<MapPickerProps> = ({
    latitude,
    longitude,
    onLocationChange
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempLat, setTempLat] = useState(latitude);
    const [tempLng, setTempLng] = useState(longitude);
    const [searchQuery, setSearchQuery] = useState('');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Default Ubud coordinates
    const DEFAULT_LAT = '-8.5069';
    const DEFAULT_LNG = '115.2625';

    const currentLat = latitude || DEFAULT_LAT;
    const currentLng = longitude || DEFAULT_LNG;

    // Update temp values when props change
    useEffect(() => {
        setTempLat(latitude || DEFAULT_LAT);
        setTempLng(longitude || DEFAULT_LNG);
    }, [latitude, longitude]);

    // Generate embed URL
    const getEmbedUrl = (lat: string, lng: string) => {
        return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM!5e0!3m2!1sen!2sid!4v1700000000000!5m2!1sen!2sid`;
    };

    // Handle search (opens Google Maps search in new tab for reference)
    const handleSearch = () => {
        if (searchQuery) {
            window.open(`https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`, '_blank');
        }
    };

    // Apply selected location
    const handleApply = () => {
        onLocationChange(tempLat, tempLng);
        setIsModalOpen(false);
    };

    // Use current location
    const handleUseCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setTempLat(position.coords.latitude.toFixed(6));
                    setTempLng(position.coords.longitude.toFixed(6));
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Could not get current location. Please enter coordinates manually.');
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    // Preset locations in Ubud
    const PRESET_LOCATIONS = [
        { name: 'Ubud Center', lat: '-8.5069', lng: '115.2625' },
        { name: 'Tegallalang', lat: '-8.4312', lng: '115.2792' },
        { name: 'Monkey Forest', lat: '-8.5186', lng: '115.2588' },
        { name: 'Campuhan Ridge', lat: '-8.5028', lng: '115.2522' },
    ];

    return (
        <div className="space-y-4">
            {/* Preview & Edit Button */}
            <div className="border border-admin-forest/20 rounded-xl overflow-hidden bg-white">
                {/* Map Preview */}
                <div className="relative h-48 w-full bg-gray-100">
                    <iframe
                        src={getEmbedUrl(currentLat, currentLng)}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Location Preview"
                        className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                </div>

                {/* Coordinates Display */}
                <div className="p-4 border-t border-admin-forest/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <MapPin size={16} className="text-admin-forest" />
                            <span className="text-sm font-mono text-admin-forest/70">
                                {currentLat}, {currentLng}
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)}
                            className="px-4 py-2 bg-admin-forest text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-admin-forest/90 transition-colors"
                        >
                            Pick Location
                        </button>
                    </div>
                </div>
            </div>

            {/* Manual Input (Fallback) */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">
                        Latitude
                    </label>
                    <input
                        type="text"
                        value={latitude}
                        onChange={(e) => onLocationChange(e.target.value, longitude)}
                        className="input-field border-b"
                        placeholder="-8.5069"
                    />
                </div>
                <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">
                        Longitude
                    </label>
                    <input
                        type="text"
                        value={longitude}
                        onChange={(e) => onLocationChange(latitude, e.target.value)}
                        className="input-field border-b"
                        placeholder="115.2625"
                    />
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="font-serif text-xl text-admin-forest">Pick Villa Location</h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Map */}
                        <div className="relative flex-1 min-h-[300px] bg-gray-100">
                            <iframe
                                ref={iframeRef}
                                src={getEmbedUrl(tempLat, tempLng)}
                                width="100%"
                                height="100%"
                                style={{ border: 0, minHeight: '300px' }}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Pick Location"
                                className="w-full h-full"
                            />
                            {/* Center marker indicator */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-full pointer-events-none">
                                <div className="flex flex-col items-center">
                                    <MapPin size={32} className="text-red-500 drop-shadow-lg" fill="#ef4444" />
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="p-4 border-t border-gray-200 space-y-4">
                            {/* Search */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search location on Google Maps..."
                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-admin-forest/30"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    type="button"
                                    onClick={handleSearch}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <Search size={18} />
                                </button>
                                <button
                                    type="button"
                                    onClick={handleUseCurrentLocation}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    title="Use Current Location"
                                >
                                    <Crosshair size={18} />
                                </button>
                            </div>

                            {/* Preset Locations */}
                            <div className="flex flex-wrap gap-2">
                                <span className="text-xs text-gray-500 self-center mr-2">Quick Pick:</span>
                                {PRESET_LOCATIONS.map((loc) => (
                                    <button
                                        key={loc.name}
                                        type="button"
                                        onClick={() => {
                                            setTempLat(loc.lat);
                                            setTempLng(loc.lng);
                                        }}
                                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${tempLat === loc.lat && tempLng === loc.lng
                                                ? 'bg-admin-forest text-white border-admin-forest'
                                                : 'bg-white text-admin-forest border-admin-forest/30 hover:border-admin-forest'
                                            }`}
                                    >
                                        {loc.name}
                                    </button>
                                ))}
                            </div>

                            {/* Coordinate Inputs */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Latitude</label>
                                    <input
                                        type="text"
                                        value={tempLat}
                                        onChange={(e) => setTempLat(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-admin-forest/30"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Longitude</label>
                                    <input
                                        type="text"
                                        value={tempLng}
                                        onChange={(e) => setTempLng(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-admin-forest/30"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleApply}
                                    className="px-6 py-2 bg-admin-forest text-white rounded-lg hover:bg-admin-forest/90 transition-colors flex items-center gap-2"
                                >
                                    <Check size={16} />
                                    Apply Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
