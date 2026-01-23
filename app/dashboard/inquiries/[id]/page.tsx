'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2, AlertCircle, Phone, Mail, Calendar, MessageSquare } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { Inquiry } from '../../../../lib/types';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';

export default function InquiryDetailPage() {
    const router = useRouter();
    const params = useParams();
    const inquiryId = params.id as string;
    const { success, error: toastError } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inquiry, setInquiry] = useState<Inquiry | null>(null);
    const [adminNotes, setAdminNotes] = useState('');

    useEffect(() => {
        fetchInquiry();
    }, [inquiryId]);

    async function fetchInquiry() {
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('inquiries')
                .select('*')
                .eq('id', inquiryId)
                .single();

            const result = validateResult(data, fetchError, 'loading inquiry');
            setInquiry(result);
            setAdminNotes(result.admin_notes || '');
        } catch (err: any) {
            setError(handleSupabaseError(err, 'loading inquiry'));
        } finally {
            setLoading(false);
        }
    }

    async function handleSaveNotes() {
        if (!inquiry) return;
        setSaving(true);
        try {
            const { error: updateError } = await supabase
                .from('inquiries')
                .update({ admin_notes: adminNotes })
                .eq('id', inquiryId);

            if (updateError) throw updateError;
            setInquiry(prev => prev ? { ...prev, admin_notes: adminNotes } : null);
            success('Notes Saved', 'Admin notes updated successfully');
        } catch (err: any) {
            toastError('Save Failed', handleSupabaseError(err, 'saving notes'));
        } finally {
            setSaving(false);
        }
    }

    async function updateStatus(newStatus: string) {
        if (!inquiry) return;
        setSaving(true);
        try {
            const updates: any = { status: newStatus };
            if (newStatus === 'replied') {
                updates.replied_at = new Date().toISOString();
            }
            const { error: updateError } = await supabase
                .from('inquiries')
                .update(updates)
                .eq('id', inquiryId);

            if (updateError) throw updateError;
            setInquiry(prev => prev ? { ...prev, ...updates } : null);
            success('Status Updated', `Inquiry marked as ${newStatus}`);
        } catch (err: any) {
            toastError('Update Failed', handleSupabaseError(err, 'updating status'));
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!confirm('Delete this inquiry? This cannot be undone.')) return;
        setDeleting(true);
        try {
            const { error: deleteError } = await supabase.from('inquiries').delete().eq('id', inquiryId);
            if (deleteError) throw deleteError;
            success('Inquiry Deleted', 'Message removed successfully');
            router.push('/dashboard/inquiries');
        } catch (err: any) {
            toastError('Delete Failed', handleSupabaseError(err, 'deleting inquiry'));
            setDeleting(false);
        }
    }

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch {
            return dateStr;
        }
    };

    const formatWhatsAppLink = (phone?: string, name?: string, villaName?: string) => {
        if (!phone) return null;
        const cleanPhone = phone.replace(/\D/g, '');
        let message = `Halo ${name || 'Bapak/Ibu'}, terima kasih telah menghubungi StayinUBUD.`;
        if (villaName) {
            message += ` Mengenai inquiry Anda untuk ${villaName}, `;
        }
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-admin-forest/50" />
            </div>
        );
    }

    if (error || !inquiry) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error || 'Inquiry not found'}</p>
                <Link href="/dashboard/inquiries" className="btn-primary">Back to Inquiries</Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        new: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        replied: 'bg-green-100 text-green-700 border-green-300',
        closed: 'bg-gray-100 text-gray-600 border-gray-300'
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <Link href="/dashboard/inquiries" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-sm">
                        <ArrowLeft size={16} /> Back to Inquiries
                    </Link>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Inquiry Details</h1>
                </div>
                <div className="flex gap-2">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest border ${statusColors[inquiry.status] || 'bg-gray-100'}`}>
                        {inquiry.status}
                    </span>
                    <button
                        onClick={handleDelete}
                        disabled={deleting}
                        className="btn-outline text-red-600 border-red-200 hover:bg-red-50"
                    >
                        {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Guest Info */}
                <div className="glass-panel rounded-3xl p-8">
                    <h2 className="font-serif text-xl mb-6 text-admin-forest flex items-center gap-2">
                        <MessageSquare size={20} /> Guest Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white/50 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-admin-sand flex items-center justify-center text-lg font-bold text-admin-forest">
                                {inquiry.name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <p className="font-serif text-lg">{inquiry.name || 'Anonymous'}</p>
                                <p className="text-xs text-admin-forest/50">{inquiry.type}</p>
                            </div>
                        </div>

                        {inquiry.email && (
                            <div className="flex items-center gap-3 text-sm">
                                <Mail size={16} className="text-admin-forest/50" />
                                <a href={`mailto:${inquiry.email}`} className="hover:text-admin-gold">{inquiry.email}</a>
                            </div>
                        )}

                        {inquiry.whatsapp && (
                            <div className="flex items-center gap-3 text-sm">
                                <Phone size={16} className="text-green-600" />
                                <span>{inquiry.whatsapp}</span>
                            </div>
                        )}

                        {/* Booking Details */}
                        {inquiry.villa_name && (
                            <div className="mt-4 p-4 bg-admin-sand/50 rounded-xl">
                                <p className="text-xs uppercase tracking-widest text-admin-forest/50 mb-2">Interested In</p>
                                <p className="font-serif text-lg">{inquiry.villa_name}</p>
                            </div>
                        )}

                        {inquiry.check_in_date && inquiry.check_out_date && (
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar size={16} className="text-admin-forest/50" />
                                <span>{inquiry.check_in_date} → {inquiry.check_out_date}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message & Actions */}
                <div className="glass-panel rounded-3xl p-8">
                    <h2 className="font-serif text-xl mb-6 text-admin-forest">Message</h2>

                    <div className="p-4 bg-white/50 rounded-xl mb-6">
                        <p className="text-admin-forest/80 whitespace-pre-wrap">{inquiry.message || 'No message provided'}</p>
                    </div>

                    <p className="text-xs text-admin-forest/40 mb-6">Received: {formatDate(inquiry.created_at)}</p>

                    {inquiry.replied_at && (
                        <p className="text-xs text-green-600 mb-6">✓ Replied: {formatDate(inquiry.replied_at)}</p>
                    )}

                    {/* WhatsApp Reply Button */}
                    {inquiry.whatsapp && (
                        <a
                            href={formatWhatsAppLink(inquiry.whatsapp, inquiry.name, inquiry.villa_name) || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                                if (inquiry.status === 'new') {
                                    updateStatus('replied');
                                }
                            }}
                            className="btn-primary bg-green-600 hover:bg-green-700 w-full justify-center mb-4"
                        >
                            <Phone size={18} />
                            Reply via WhatsApp
                        </a>
                    )}

                    {/* Status Actions */}
                    <div className="flex gap-2">
                        {inquiry.status === 'new' && (
                            <button
                                onClick={() => updateStatus('replied')}
                                disabled={saving}
                                className="btn-outline flex-1"
                            >
                                Mark as Replied
                            </button>
                        )}
                        {inquiry.status !== 'closed' && (
                            <button
                                onClick={() => updateStatus('closed')}
                                disabled={saving}
                                className="btn-outline flex-1"
                            >
                                Close
                            </button>
                        )}
                    </div>
                </div>

            </div>

            {/* Admin Notes */}
            <div className="glass-panel rounded-3xl p-8 mt-8">
                <h2 className="font-serif text-xl mb-4 text-admin-forest">Admin Notes</h2>
                <p className="text-sm text-admin-forest/50 mb-4">Internal notes for tracking communication (not visible to guest)</p>

                <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="input-field border rounded-xl min-h-[120px] p-4 mb-4"
                    placeholder="Add notes about this inquiry..."
                />

                <button
                    onClick={handleSaveNotes}
                    disabled={saving}
                    className="btn-primary"
                >
                    {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Notes</>}
                </button>
            </div>

        </div>
    );
}
