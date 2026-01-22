'use client';

import React from 'react';
import { Plus, MoreVertical, MapPin, Bed, Maximize, Star, Edit3 } from 'lucide-react';

const VILLAS = [
    {
        id: 1,
        name: 'Villa Niskala',
        location: 'Sayan Ridge',
        status: 'Occupied',
        image: 'https://images.unsplash.com/photo-1600596542815-e36cb2907e62?auto=format&fit=crop&q=80&w=800',
        stats: { revenue: '125M', bookings: 8, rating: 4.9 },
        specs: { beds: 3, size: 450 }
    },
    {
        id: 2,
        name: 'The River House',
        location: 'Pejeng',
        status: 'Available',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800',
        stats: { revenue: '98M', bookings: 5, rating: 5.0 },
        specs: { beds: 4, size: 600 }
    },
    {
        id: 3,
        name: 'Estate of Zen',
        location: 'Tegallalang',
        status: 'Maintenance',
        image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&q=80&w=800',
        stats: { revenue: '45M', bookings: 2, rating: 4.8 },
        specs: { beds: 5, size: 850 }
    }
];

export default function VillasPage() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Portfolio</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        My Properties
                    </h1>
                </div>

                <button className="btn-primary group">
                    <Plus size={18} />
                    <span>Add Sanctuary</span>
                </button>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {VILLAS.map(villa => (
                    <div key={villa.id} className="glass-panel rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">

                        {/* Image Header */}
                        <div className="relative h-64 overflow-hidden">
                            <img src={villa.image} alt={villa.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-admin-forest/80 to-transparent opacity-60"></div>

                            {/* Status Badge */}
                            <div className="absolute top-4 left-4">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border border-white/20
                    ${villa.status === 'Occupied' ? 'bg-admin-success/80 text-white' :
                                        villa.status === 'Maintenance' ? 'bg-admin-gold/80 text-admin-forest' :
                                            'bg-white/20 text-white'}
                 `}>
                                    {villa.status}
                                </span>
                            </div>

                            {/* Action Fab */}
                            <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-admin-forest transition-colors">
                                <Edit3 size={14} />
                            </button>

                            {/* Title on Image */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-serif text-2xl">{villa.name}</h3>
                                <div className="flex items-center gap-2 text-xs opacity-80 font-mono">
                                    <MapPin size={12} /> {villa.location}
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6">

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-4 pb-6 border-b border-admin-forest/5 mb-6">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Revenue</span>
                                    <span className="font-serif text-lg text-admin-forest">IDR {villa.stats.revenue}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Bookings</span>
                                    <span className="font-serif text-lg text-admin-forest">{villa.stats.bookings}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Rating</span>
                                    <span className="font-serif text-lg text-admin-forest flex items-center gap-1">
                                        {villa.stats.rating} <Star size={10} className="fill-admin-gold text-admin-gold" />
                                    </span>
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="flex justify-between items-center text-xs font-mono text-admin-forest/60">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1"><Bed size={14} /> {villa.specs.beds} Beds</span>
                                    <span className="flex items-center gap-1"><Maximize size={14} /> {villa.specs.size} m²</span>
                                </div>
                                <button className="text-admin-forest hover:text-admin-gold transition-colors">Details &rarr;</button>
                            </div>

                        </div>

                    </div>
                ))}

                {/* 'Add New' Placeholder Card for visual weight */}
                <div className="border-2 border-dashed border-admin-forest/10 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 text-admin-forest/30 hover:text-admin-forest/60 hover:border-admin-forest/30 transition-all cursor-pointer group h-[480px]">
                    <div className="w-16 h-16 rounded-full bg-admin-forest/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={32} />
                    </div>
                    <span className="font-serif text-xl">Initialize New Asset</span>
                </div>

            </div>

        </div>
    );
}
