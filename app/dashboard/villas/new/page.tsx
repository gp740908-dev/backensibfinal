'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';

export default function NewVillaPage() {
    const router = useRouter();
    const { success, error: toastError } = useToast();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        name: '',
        description: '',
        price_per_night: '',
        bedrooms: '',
        guests: '',
        bathrooms: '',
        image_url: '',
        land_area: '',
        building_area: '',
        levels: '1',
        pantry: '1',
        pool_area: '',
        latitude: '',
        longitude: '',
        features: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const payload = {
                name: form.name,
                description: form.description,
                price_per_night: parseFloat(form.price_per_night) || 0,
                bedrooms: parseInt(form.bedrooms) || 1,
                guests: parseInt(form.guests) || 2,
                bathrooms: parseInt(form.bathrooms) || 1,
                image_url: form.image_url,
                land_area: parseFloat(form.land_area) || 0,
                building_area: parseFloat(form.building_area) || 0,
                levels: parseInt(form.levels) || 1,
                pantry: parseInt(form.pantry) || 0,
                pool_area: parseFloat(form.pool_area) || 0,
                latitude: parseFloat(form.latitude) || -8.5,
                longitude: parseFloat(form.longitude) || 115.2,
                features: form.features.split(',').map(f => f.trim()).filter(Boolean)
            };

            const { error: insertError } = await supabase.from('villas').insert([payload]);

            if (insertError) throw insertError;

            success('Villa Created', `"${form.name}" has been added successfully`);
            router.push('/dashboard/villas');
        } catch (err: any) {
            setError(err.message || 'Failed to create villa');
            toastError('Creation Failed', err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <Link href="/dashboard/villas" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-sm">
                    <ArrowLeft size={16} /> Back to Villas
                </Link>
                <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Add New Villa</h1>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-8">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Villa Name *</label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="input-field border-b"
                            placeholder="e.g. Villa Niskala"
                            required
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Description *</label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            className="input-field border rounded-xl min-h-[120px] p-4"
                            placeholder="Describe the villa..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Price per Night (IDR) *</label>
                        <input
                            type="number"
                            name="price_per_night"
                            value={form.price_per_night}
                            onChange={handleChange}
                            className="input-field border-b"
                            placeholder="e.g. 3500000"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Image URL</label>
                        <input
                            type="url"
                            name="image_url"
                            value={form.image_url}
                            onChange={handleChange}
                            className="input-field border-b"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                {/* Specs */}
                <div>
                    <h3 className="font-serif text-xl mb-4 text-admin-forest">Specifications</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Bedrooms</label>
                            <input type="number" name="bedrooms" value={form.bedrooms} onChange={handleChange} className="input-field border-b" min="1" />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Guests</label>
                            <input type="number" name="guests" value={form.guests} onChange={handleChange} className="input-field border-b" min="1" />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Bathrooms</label>
                            <input type="number" name="bathrooms" value={form.bathrooms} onChange={handleChange} className="input-field border-b" min="1" />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Levels</label>
                            <input type="number" name="levels" value={form.levels} onChange={handleChange} className="input-field border-b" min="1" />
                        </div>
                    </div>
                </div>

                {/* Area */}
                <div>
                    <h3 className="font-serif text-xl mb-4 text-admin-forest">Area (m²)</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Land Area</label>
                            <input type="number" name="land_area" value={form.land_area} onChange={handleChange} className="input-field border-b" />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Building Area</label>
                            <input type="number" name="building_area" value={form.building_area} onChange={handleChange} className="input-field border-b" />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Pool Area</label>
                            <input type="number" name="pool_area" value={form.pool_area} onChange={handleChange} className="input-field border-b" />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <h3 className="font-serif text-xl mb-4 text-admin-forest">Location</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Latitude</label>
                            <input type="text" name="latitude" value={form.latitude} onChange={handleChange} className="input-field border-b" placeholder="-8.5069" />
                        </div>
                        <div>
                            <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Longitude</label>
                            <input type="text" name="longitude" value={form.longitude} onChange={handleChange} className="input-field border-b" placeholder="115.2624" />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Features (comma-separated)</label>
                    <input
                        type="text"
                        name="features"
                        value={form.features}
                        onChange={handleChange}
                        className="input-field border-b"
                        placeholder="Private Pool, Rice Field View, Kitchen, WiFi"
                    />
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4 pt-6 border-t border-admin-forest/10">
                    <Link href="/dashboard/villas" className="btn-outline">Cancel</Link>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Create Villa</>}
                    </button>
                </div>

            </form>
        </div>
    );
}
