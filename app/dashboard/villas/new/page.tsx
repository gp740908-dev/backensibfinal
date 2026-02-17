'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Plus, X } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';
import { ImageUpload } from '../../../../components/ImageUpload';
import { MapPicker } from '../../../../components/MapPicker';
import {
    HouseRulesEditor, AmenitiesEditor, ProximityEditor, SleepingEditor, FeaturesTagInput,
    HouseRules, AmenitiesDetail, ProximityItem, SleepingItem, DEFAULT_HOUSE_RULES
} from '../../../../components/VillaFormFields';

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
        images: [] as string[],
        land_area: '',
        building_area: '',
        levels: '1',
        pantry: '1',
        pool_area: '',
        latitude: '',
        longitude: '',
    });

    const [features, setFeatures] = useState<string[]>([]);
    const [houseRules, setHouseRules] = useState<HouseRules>({ ...DEFAULT_HOUSE_RULES });
    const [amenities, setAmenities] = useState<AmenitiesDetail>({});
    const [proximity, setProximity] = useState<ProximityItem[]>([]);
    const [sleeping, setSleeping] = useState<SleepingItem[]>([]);

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
                features: features,
                images: form.images.filter(Boolean),
                house_rules: houseRules,
                amenities_detail: Object.keys(amenities).length > 0 ? amenities : null,
                proximity_list: proximity.filter(p => p.name.trim()).length > 0 ? proximity.filter(p => p.name.trim()) : null,
                sleeping_arrangements: sleeping.filter(s => s.room.trim()).length > 0 ? sleeping.filter(s => s.room.trim()) : null
            };

            const { data, error: insertError } = await supabase
                .from('villas')
                .insert([payload])
                .select();

            validateResult(data, insertError, 'creating villa');

            success('Villa Created', `"${form.name}" has been added successfully`);
            router.push('/dashboard/villas');
        } catch (err: any) {
            const msg = handleSupabaseError(err, 'creating villa');
            setError(msg);
            toastError('Creation Failed', msg);
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

                    <div className="md:col-span-2">
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Main Image</label>
                        <ImageUpload
                            value={form.image_url}
                            onChange={(url) => setForm(prev => ({ ...prev, image_url: url }))}
                        />
                    </div>

                    {/* Gallery Images */}
                    <div className="md:col-span-2">
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Gallery Images</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {form.images.map((img, idx) => (
                                <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-admin-forest/10 group">
                                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }))}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            <div>
                                <ImageUpload
                                    value=""
                                    onChange={(url) => { if (url) setForm(prev => ({ ...prev, images: [...prev.images, url] })); }}
                                />
                            </div>
                        </div>
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
                    <MapPicker
                        latitude={form.latitude}
                        longitude={form.longitude}
                        onLocationChange={(lat, lng) => setForm(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                    />
                </div>

                {/* Features */}
                <FeaturesTagInput value={features} onChange={setFeatures} />

                {/* House Rules */}
                <HouseRulesEditor value={houseRules} onChange={setHouseRules} />

                {/* Amenities */}
                <AmenitiesEditor value={amenities} onChange={setAmenities} />

                {/* Proximity */}
                <ProximityEditor value={proximity} onChange={setProximity} />

                {/* Sleeping Arrangements */}
                <SleepingEditor value={sleeping} onChange={setSleeping} />

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
