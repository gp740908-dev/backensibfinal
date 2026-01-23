'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';

export default function EditReviewPage() {
    const router = useRouter();
    const params = useParams();
    const reviewId = params.id as string;
    const { success, error: toastError } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        guest_name: '',
        quote: '',
        source: '',
        rating: '5',
        image_url: '',
        is_featured: false
    });

    useEffect(() => {
        fetchReview();
    }, [reviewId]);

    async function fetchReview() {
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('reviews')
                .select('*')
                .eq('id', reviewId)
                .single();

            const review = validateResult(data, fetchError, 'loading review');

            setForm({
                guest_name: review.guest_name || '',
                quote: review.quote || '',
                source: review.source || '',
                rating: String(review.rating || 5),
                image_url: review.image_url || '',
                is_featured: review.is_featured || false
            });
        } catch (err: any) {
            setError(handleSupabaseError(err, 'loading review'));
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setForm(prev => ({ ...prev, [e.target.name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { data, error: updateError } = await supabase.from('reviews').update({
                guest_name: form.guest_name,
                quote: form.quote,
                source: form.source,
                rating: parseInt(form.rating) || 5,
                image_url: form.image_url,
                is_featured: form.is_featured
            }).eq('id', reviewId).select();

            validateResult(data, updateError, 'updating review');

            success('Review Updated', `Review by "${form.guest_name}" saved successfully`);
            router.push('/dashboard/reviews');
        } catch (err: any) {
            const msg = handleSupabaseError(err, 'updating review');
            setError(msg);
            toastError('Update Failed', msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        setDeleting(true);
        try {
            const { error: deleteError } = await supabase.from('reviews').delete().eq('id', reviewId);
            if (deleteError) throw deleteError; // delete doesn't always return data unless select() used, assuming void

            success('Review Deleted', `Review has been removed`);
            router.push('/dashboard/reviews');
        } catch (err: any) {
            setError(handleSupabaseError(err, 'deleting review'));
            toastError('Delete Failed', err.message);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-admin-forest/50" />
            </div>
        );
    }

    if (error && !form.guest_name) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Link href="/dashboard/reviews" className="btn-primary">Back to Reviews</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <Link href="/dashboard/reviews" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-sm">
                        <ArrowLeft size={16} /> Back to Reviews
                    </Link>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Edit Review</h1>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-outline text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                    {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete
                </button>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Guest Name *</label>
                        <input
                            type="text"
                            name="guest_name"
                            value={form.guest_name}
                            onChange={handleChange}
                            className="input-field border-b"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Source</label>
                        <input
                            type="text"
                            name="source"
                            value={form.source}
                            onChange={handleChange}
                            className="input-field border-b"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Rating (1-5)</label>
                        <select
                            name="rating"
                            value={form.rating}
                            onChange={handleChange}
                            className="input-field border-b"
                        >
                            <option value="5">5 - Excellent</option>
                            <option value="4">4 - Very Good</option>
                            <option value="3">3 - Average</option>
                            <option value="2">2 - Poor</option>
                            <option value="1">1 - Terrible</option>
                        </select>
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

                <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Quote *</label>
                    <textarea
                        name="quote"
                        value={form.quote}
                        onChange={handleChange}
                        className="input-field border rounded-xl min-h-[120px] p-4 text-lg font-serif italic"
                        required
                    />
                </div>

                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        name="is_featured"
                        id="is_featured"
                        checked={form.is_featured}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-admin-forest/20 text-admin-forest focus:ring-admin-gold"
                    />
                    <label htmlFor="is_featured" className="text-sm font-medium text-admin-forest">Feature this review on homepage</label>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-admin-forest/10">
                    <Link href="/dashboard/reviews" className="btn-outline">Cancel</Link>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>

            </form>
        </div>
    );
}
