'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Loader2, AlertCircle, MessageSquare, Star, Quote } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Review } from '../../../lib/types';
import { useToast } from '../../../components/Toast';
import { handleSupabaseError } from '../../../lib/errorHandler';

export default function ReviewsPage() {
    const { success, error: toastError } = useToast();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, []);

    async function fetchReviews() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setReviews(data || []);
        } catch (err: any) {
            setError(handleSupabaseError(err, 'fetching reviews'));
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, guestName: string) {
        if (!confirm(`Are you sure you want to delete the review by "${guestName}"?`)) return;
        setDeleting(id);
        try {
            const { error: deleteError } = await supabase.from('reviews').delete().eq('id', id);
            if (deleteError) throw deleteError;
            setReviews(prev => prev.filter(r => r.id !== id));
            success('Review Deleted', `Review by "${guestName}" has been removed`);
        } catch (err: any) {
            toastError('Delete Failed', handleSupabaseError(err, 'deleting review'));
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
                <button onClick={fetchReviews} className="btn-primary">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Feedback</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        Guest Reviews ({reviews.length})
                    </h1>
                </div>
                <Link href="/dashboard/reviews/new" className="btn-primary group">
                    <Plus size={18} />
                    <span>Add Review</span>
                </Link>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map(review => (
                    <div key={review.id} className="glass-panel rounded-3xl p-6 flex flex-col justify-between group hover:shadow-lg transition-all h-full">
                        <div>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-2 text-admin-gold">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "" : "opacity-30"} />
                                    ))}
                                </div>
                                {review.is_featured && (
                                    <span className="px-2 py-1 bg-admin-gold/20 text-admin-gold text-[10px] uppercase font-bold tracking-wider rounded-full">Featured</span>
                                )}
                            </div>

                            <div className="relative mb-6">
                                <Quote size={24} className="text-admin-forest/10 absolute -top-2 -left-2" />
                                <p className="font-serif italic text-lg text-admin-forest relative z-10 pl-4">{review.quote}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {review.image_url ? (
                                    <img src={review.image_url} alt={review.guest_name} className="w-10 h-10 rounded-full object-cover border border-admin-forest/10" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-admin-sand flex items-center justify-center text-admin-forest/50">
                                        <MessageSquare size={16} />
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-sm text-admin-forest">{review.guest_name}</p>
                                    <p className="text-xs text-admin-forest/50">{review.source || 'Direct'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 mt-6 pt-4 border-t border-admin-forest/5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                                href={`/dashboard/reviews/${review.id}`}
                                className="p-2 bg-admin-forest/5 text-admin-forest rounded-lg hover:bg-admin-forest/10 transition-colors"
                            >
                                <Edit3 size={14} />
                            </Link>
                            <button
                                onClick={() => handleDelete(review.id, review.guest_name)}
                                disabled={deleting === review.id}
                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                            >
                                {deleting === review.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
