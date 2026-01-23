'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Loader2, AlertCircle, Mail, Calendar } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Subscriber } from '../../../lib/types';
import { useToast } from '../../../components/Toast';
import { handleSupabaseError } from '../../../lib/errorHandler';

export default function SubscribersPage() {
    const { success, error: toastError } = useToast();
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchSubscribers();
    }, []);

    async function fetchSubscribers() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('subscribers')
                .select('*')
                .order('subscribed_at', { ascending: false });

            if (fetchError) throw fetchError;
            setSubscribers(data || []);
        } catch (err: any) {
            setError(handleSupabaseError(err, 'fetching subscribers'));
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, email: string) {
        if (!confirm(`Are you sure you want to delete "${email}"?`)) return;
        setDeleting(id);
        try {
            const { error: deleteError } = await supabase.from('subscribers').delete().eq('id', id);
            if (deleteError) throw deleteError;
            setSubscribers(prev => prev.filter(s => s.id !== id));
            success('Subscriber Removed', `"${email}" has been unsubscribed`);
        } catch (err: any) {
            toastError('Delete Failed', handleSupabaseError(err, 'deleting subscriber'));
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
                <button onClick={fetchSubscribers} className="btn-primary">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Audience</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        Subscribers ({subscribers.length})
                    </h1>
                </div>
                <Link href="/dashboard/subscribers/new" className="btn-primary group">
                    <Plus size={18} />
                    <span>Add Subscriber</span>
                </Link>
            </header>

            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead className="bg-admin-forest/5 text-xs font-mono uppercase tracking-widest text-admin-forest/50">
                            <tr>
                                <th className="py-4 pl-8">Email</th>
                                <th className="py-4">Subscribed At</th>
                                <th className="py-4 text-center pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-forest/5 text-sm">
                            {subscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="py-12 text-center text-admin-forest/40">
                                        No subscribers yet.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map(sub => (
                                    <tr key={sub.id} className="group hover:bg-white/50 transition-colors">
                                        <td className="py-5 pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-admin-sand flex items-center justify-center text-admin-forest/50">
                                                    <Mail size={14} />
                                                </div>
                                                <span className="font-medium text-admin-forest">{sub.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-5 text-admin-forest/60 font-mono text-xs">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(sub.subscribed_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="py-5 pr-8 text-center">
                                            <button
                                                onClick={() => handleDelete(sub.id, sub.email)}
                                                disabled={deleting === sub.id}
                                                className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                            >
                                                {deleting === sub.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
