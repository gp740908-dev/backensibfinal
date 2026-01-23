'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, MapPin, Bed, Maximize, Star, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Villa } from '../../../lib/types';

export default function VillasPage() {
    const [villas, setVillas] = useState<Villa[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchVillas();
    }, []);

    async function fetchVillas() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('villas')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setVillas(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load villas');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return;

        setDeleting(id);
        try {
            const { error: deleteError } = await supabase.from('villas').delete().eq('id', id);
            if (deleteError) throw deleteError;
            setVillas(prev => prev.filter(v => v.id !== id));
        } catch (err: any) {
            alert(`Failed to delete: ${err.message}`);
        } finally {
            setDeleting(null);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-admin-forest/50" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <button onClick={fetchVillas} className="btn-primary">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Portfolio</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        My Properties ({villas.length})
                    </h1>
                </div>

                <Link href="/dashboard/villas/new" className="btn-primary group">
                    <Plus size={18} />
                    <span>Add Villa</span>
                </Link>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {villas.map(villa => (
                    <div key={villa.id} className="glass-panel rounded-3xl overflow-hidden group hover:shadow-xl transition-all duration-500 hover:-translate-y-1">

                        {/* Image Header */}
                        <div className="relative h-56 overflow-hidden bg-admin-sand">
                            {villa.image_url ? (
                                <img src={villa.image_url} alt={villa.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-admin-forest/30">
                                    <MapPin size={48} />
                                </div>
                            )}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-admin-forest/80 to-transparent opacity-60"></div>

                            {/* Action Buttons */}
                            <div className="absolute top-4 right-4 flex gap-2">
                                <Link
                                    href={`/dashboard/villas/${villa.id}`}
                                    className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-admin-forest transition-colors"
                                >
                                    <Edit3 size={14} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(villa.id, villa.name)}
                                    disabled={deleting === villa.id}
                                    className="w-8 h-8 rounded-full bg-red-500/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 transition-colors disabled:opacity-50"
                                >
                                    {deleting === villa.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                </button>
                            </div>

                            {/* Title on Image */}
                            <div className="absolute bottom-4 left-4 text-white">
                                <h3 className="font-serif text-2xl">{villa.name}</h3>
                                <div className="flex items-center gap-2 text-xs opacity-80 font-mono">
                                    IDR {(villa.price_per_night / 1000000).toFixed(1)}M / night
                                </div>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-6">

                            {/* Key Metrics */}
                            <div className="grid grid-cols-3 gap-4 pb-6 border-b border-admin-forest/5 mb-6">
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Bedrooms</span>
                                    <span className="font-serif text-lg text-admin-forest">{villa.bedrooms}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Guests</span>
                                    <span className="font-serif text-lg text-admin-forest">{villa.guests}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] uppercase tracking-widest opacity-50 mb-1">Bathrooms</span>
                                    <span className="font-serif text-lg text-admin-forest">{villa.bathrooms}</span>
                                </div>
                            </div>

                            {/* Specs */}
                            <div className="flex justify-between items-center text-xs font-mono text-admin-forest/60">
                                <div className="flex gap-4">
                                    <span className="flex items-center gap-1"><Maximize size={14} /> {villa.building_area} m²</span>
                                </div>
                                <Link href={`/dashboard/villas/${villa.id}`} className="text-admin-forest hover:text-admin-gold transition-colors">
                                    Edit &rarr;
                                </Link>
                            </div>

                        </div>

                    </div>
                ))}

                {/* 'Add New' Placeholder Card */}
                <Link
                    href="/dashboard/villas/new"
                    className="border-2 border-dashed border-admin-forest/10 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 text-admin-forest/30 hover:text-admin-forest/60 hover:border-admin-forest/30 transition-all cursor-pointer group min-h-[400px]"
                >
                    <div className="w-16 h-16 rounded-full bg-admin-forest/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Plus size={32} />
                    </div>
                    <span className="font-serif text-xl">Add New Villa</span>
                </Link>

            </div>

        </div>
    );
}
