'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Loader2, AlertCircle, Mail, Check, Trash2, MessageSquare, Phone, Calendar, Eye } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Inquiry } from '../../../lib/types';
import { useToast } from '../../../components/Toast';
import { handleSupabaseError } from '../../../lib/errorHandler';

export default function InquiriesPage() {
    const { success, error: toastError } = useToast();
    const [inquiries, setInquiries] = useState<Inquiry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchInquiries();
    }, []);

    async function fetchInquiries() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('inquiries')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;
            setInquiries(data || []);
        } catch (err: any) {
            setError(handleSupabaseError(err, 'loading inquiries'));
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, newStatus: string) {
        setUpdatingId(id);
        try {
            const updates: any = { status: newStatus };
            if (newStatus === 'replied') {
                updates.replied_at = new Date().toISOString();
            }
            const { error: updateError } = await supabase
                .from('inquiries')
                .update(updates)
                .eq('id', id);
            if (updateError) throw updateError;
            setInquiries(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
            success('Status Updated', `Inquiry marked as ${newStatus}`);
        } catch (err: any) {
            toastError('Update Failed', handleSupabaseError(err, 'updating inquiry'));
        } finally {
            setUpdatingId(null);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this inquiry?')) return;
        setUpdatingId(id);
        try {
            const { error: deleteError } = await supabase.from('inquiries').delete().eq('id', id);
            if (deleteError) throw deleteError;
            setInquiries(prev => prev.filter(i => i.id !== id));
            success('Inquiry Deleted', 'Message removed successfully');
        } catch (err: any) {
            toastError('Delete Failed', handleSupabaseError(err, 'deleting inquiry'));
        } finally {
            setUpdatingId(null);
        }
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch {
            return dateStr;
        }
    };

    const formatWhatsAppLink = (phone?: string, name?: string) => {
        if (!phone) return null;
        const cleanPhone = phone.replace(/\D/g, '');
        const message = encodeURIComponent(`Halo ${name || 'Bapak/Ibu'}, terima kasih telah menghubungi StayinUBUD. `);
        return `https://wa.me/${cleanPhone}?text=${message}`;
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
                <button onClick={fetchInquiries} className="btn-primary">Retry</button>
            </div>
        );
    }

    const newCount = inquiries.filter(i => i.status === 'new').length;

    return (
        <div className="space-y-8">

            {/* Header */}
            <header>
                <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Messages</span>
                <div className="flex items-center gap-4">
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Inquiries</h1>
                    {newCount > 0 && (
                        <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold">{newCount} new</span>
                    )}
                </div>
            </header>

            {/* List */}
            <div className="space-y-4">
                {inquiries.length === 0 ? (
                    <div className="glass-panel rounded-3xl p-12 text-center text-admin-forest/40">
                        <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No inquiries yet</p>
                    </div>
                ) : (
                    inquiries.map(inquiry => (
                        <div
                            key={inquiry.id}
                            className={`glass-panel rounded-2xl p-6 transition-all ${inquiry.status === 'new' ? 'border-l-4 border-admin-gold' : ''}`}
                        >
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest
                      ${inquiry.status === 'new' ? 'bg-yellow-100 text-yellow-700' :
                                                inquiry.status === 'replied' ? 'bg-green-100 text-green-700' :
                                                    'bg-gray-100 text-gray-600'}
                    `}>
                                            {inquiry.status}
                                        </span>
                                        <span className="text-xs text-admin-forest/50 font-mono">{inquiry.type}</span>
                                        <span className="text-xs text-admin-forest/40">{formatDate(inquiry.created_at)}</span>
                                    </div>

                                    <div className="flex items-center gap-3 mb-2">
                                        <p className="font-serif font-medium text-lg">{inquiry.name || 'Anonymous'}</p>
                                        {inquiry.email && (
                                            <a href={`mailto:${inquiry.email}`} className="text-admin-forest/50 hover:text-admin-gold" title="Send Email">
                                                <Mail size={14} />
                                            </a>
                                        )}
                                        {inquiry.whatsapp && (
                                            <a
                                                href={formatWhatsAppLink(inquiry.whatsapp, inquiry.name) || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-600 hover:text-green-700"
                                                title="Reply via WhatsApp"
                                            >
                                                <Phone size={14} />
                                            </a>
                                        )}
                                    </div>

                                    {/* Villa & Dates */}
                                    {(inquiry.villa_name || inquiry.check_in_date) && (
                                        <div className="flex flex-wrap gap-4 text-xs text-admin-forest/60 mb-2">
                                            {inquiry.villa_name && (
                                                <span className="bg-admin-sand px-2 py-1 rounded">{inquiry.villa_name}</span>
                                            )}
                                            {inquiry.check_in_date && inquiry.check_out_date && (
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {inquiry.check_in_date} → {inquiry.check_out_date}
                                                </span>
                                            )}
                                        </div>
                                    )}

                                    <p className="text-admin-forest/70 line-clamp-2">{inquiry.message}</p>

                                    {/* Replied At */}
                                    {inquiry.replied_at && (
                                        <p className="text-xs text-green-600 mt-2">✓ Replied: {formatDate(inquiry.replied_at)}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 shrink-0">
                                    {/* WhatsApp Reply Button */}
                                    {inquiry.whatsapp && (
                                        <a
                                            href={formatWhatsAppLink(inquiry.whatsapp, inquiry.name) || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => {
                                                if (inquiry.status === 'new') {
                                                    updateStatus(inquiry.id, 'replied');
                                                }
                                            }}
                                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2 text-sm"
                                            title="Reply via WhatsApp"
                                        >
                                            <Phone size={16} />
                                            <span className="hidden md:inline">WhatsApp</span>
                                        </a>
                                    )}

                                    {/* View Details */}
                                    <Link
                                        href={`/dashboard/inquiries/${inquiry.id}`}
                                        className="p-2 bg-admin-forest/5 text-admin-forest rounded-lg hover:bg-admin-forest/10 transition-colors"
                                        title="View Details"
                                    >
                                        <Eye size={16} />
                                    </Link>

                                    {/* Mark as Replied (manual) */}
                                    {inquiry.status === 'new' && !inquiry.whatsapp && (
                                        <button
                                            onClick={() => updateStatus(inquiry.id, 'replied')}
                                            disabled={updatingId === inquiry.id}
                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                            title="Mark as Replied"
                                        >
                                            {updatingId === inquiry.id ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        </button>
                                    )}

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(inquiry.id)}
                                        disabled={updatingId === inquiry.id}
                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
