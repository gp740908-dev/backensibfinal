'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, Loader2, AlertCircle, Save, X, DollarSign } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Experience } from '../../../lib/types';

export default function ExperiencesPage() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        title: '',
        description: '',
        category: 'Wellness',
        image_url: '',
        price_start_from: '',
        cta_label: 'Inquire Now'
    });

    useEffect(() => {
        fetchExperiences();
    }, []);

    async function fetchExperiences() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('experiences')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setExperiences(data || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load experiences');
        } finally {
            setLoading(false);
        }
    }

    function openNew() {
        setEditingId(null);
        setForm({
            title: '',
            description: '',
            category: 'Wellness',
            image_url: '',
            price_start_from: '',
            cta_label: 'Inquire Now'
        });
        setShowModal(true);
    }

    function openEdit(exp: Experience) {
        setEditingId(exp.id);
        setForm({
            title: exp.title,
            description: exp.description,
            category: exp.category,
            image_url: exp.image_url,
            price_start_from: exp.price_start_from ? String(exp.price_start_from) : '',
            cta_label: exp.cta_label || 'Inquire Now'
        });
        setShowModal(true);
    }

    async function handleSave() {
        setSaving(true);
        try {
            const payload = {
                title: form.title,
                description: form.description,
                category: form.category,
                image_url: form.image_url,
                price_start_from: form.price_start_from ? parseFloat(form.price_start_from) : null,
                cta_label: form.cta_label
            };

            if (editingId) {
                // Update
                const { error: updateError } = await supabase
                    .from('experiences')
                    .update(payload)
                    .eq('id', editingId);
                if (updateError) throw updateError;
                setExperiences(prev => prev.map(e => e.id === editingId ? { ...e, ...payload } : e));
            } else {
                // Create
                const { data: newExp, error: insertError } = await supabase
                    .from('experiences')
                    .insert([payload])
                    .select()
                    .single();
                if (insertError) throw insertError;
                setExperiences(prev => [newExp, ...prev]);
            }
            setShowModal(false);
        } catch (err: any) {
            alert(`Failed to save: ${err.message}`);
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Delete "${title}"?`)) return;
        setDeleting(id);
        try {
            const { error: deleteError } = await supabase.from('experiences').delete().eq('id', id);
            if (deleteError) throw deleteError;
            setExperiences(prev => prev.filter(e => e.id !== id));
        } catch (err: any) {
            alert(`Failed to delete: ${err.message}`);
        } finally {
            setDeleting(null);
        }
    }

    const formatPrice = (price?: number) => {
        if (!price) return null;
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

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
                <button onClick={fetchExperiences} className="btn-primary">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Activities</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        Experiences ({experiences.length})
                    </h1>
                </div>

                <button onClick={openNew} className="btn-primary group">
                    <Plus size={18} />
                    <span>Add Experience</span>
                </button>
            </header>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {experiences.map(exp => (
                    <div key={exp.id} className="glass-panel rounded-2xl overflow-hidden group hover:shadow-lg transition-all">
                        <div className="relative h-40 bg-admin-sand overflow-hidden">
                            {exp.image_url ? (
                                <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-admin-forest/30">No Image</div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute top-3 left-3">
                                <span className="px-2 py-1 bg-white/90 rounded text-xs font-bold">{exp.category}</span>
                            </div>
                            <div className="absolute bottom-3 left-4 right-4">
                                <h3 className="font-serif text-lg text-white truncate">{exp.title}</h3>
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-sm text-admin-forest/70 line-clamp-2 mb-3">{exp.description}</p>
                            {exp.price_start_from && (
                                <div className="flex items-center gap-1 text-sm font-bold text-admin-forest mb-3">
                                    <DollarSign size={14} />
                                    From {formatPrice(exp.price_start_from)}
                                </div>
                            )}
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(exp)} className="flex-1 btn-outline text-xs py-2">
                                    <Edit3 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id, exp.title)}
                                    disabled={deleting === exp.id}
                                    className="px-3 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                >
                                    {deleting === exp.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="glass-panel rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-serif text-2xl text-admin-forest">{editingId ? 'Edit' : 'Add'} Experience</h2>
                            <button onClick={() => setShowModal(false)} className="text-admin-forest/50 hover:text-admin-forest"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                                    className="input-field border-b"
                                    placeholder="e.g. Private Yoga Session"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Category *</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                                    className="input-field border-b"
                                >
                                    <option>Wellness</option>
                                    <option>Adventure</option>
                                    <option>Culture</option>
                                    <option>Dining</option>
                                    <option>Nature</option>
                                    <option>Workshop</option>
                                </select>
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Description *</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    className="input-field border rounded-xl min-h-[100px] p-3"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Image URL *</label>
                                <input
                                    type="url"
                                    value={form.image_url}
                                    onChange={e => setForm(p => ({ ...p, image_url: e.target.value }))}
                                    className="input-field border-b"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Price From (IDR)</label>
                                <input
                                    type="number"
                                    value={form.price_start_from}
                                    onChange={e => setForm(p => ({ ...p, price_start_from: e.target.value }))}
                                    className="input-field border-b"
                                    placeholder="e.g. 500000"
                                />
                            </div>
                            <div>
                                <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">CTA Label</label>
                                <input
                                    type="text"
                                    value={form.cta_label}
                                    onChange={e => setForm(p => ({ ...p, cta_label: e.target.value }))}
                                    className="input-field border-b"
                                    placeholder="e.g. Book Now"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <button onClick={() => setShowModal(false)} className="btn-outline">Cancel</button>
                            <button onClick={handleSave} disabled={saving || !form.title || !form.description || !form.image_url} className="btn-primary">
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {editingId ? 'Save Changes' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
