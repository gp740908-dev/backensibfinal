'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreHorizontal, CheckCircle, XCircle, Loader2, AlertCircle, Eye, Phone, Mail } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Booking, Villa } from '../../../lib/types';
import { useToast } from '../../../components/Toast';
import { handleSupabaseError } from '../../../lib/errorHandler';

export default function BookingsPage() {
    const { success, error: toastError } = useToast();
    const [bookings, setBookings] = useState<(Booking & { villa_name?: string })[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('All');
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('bookings')
                .select(`
          *,
          villas:villa_id (name)
        `)
                .order('created_at', { ascending: false });

            if (fetchError) throw fetchError;

            const formatted = (data || []).map((b: any) => ({
                ...b,
                villa_name: b.villas?.name || 'Unknown Villa'
            }));

            setBookings(formatted);
        } catch (err: any) {
            setError(handleSupabaseError(err, 'loading bookings'));
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, newStatus: 'confirmed' | 'cancelled') {
        setUpdatingId(id);
        try {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', id);

            if (updateError) throw updateError;

            setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
            success(`Booking ${newStatus === 'confirmed' ? 'Confirmed' : 'Cancelled'}`, 'Status updated successfully');
        } catch (err: any) {
            toastError('Update Failed', handleSupabaseError(err, 'updating booking status'));
        } finally {
            setUpdatingId(null);
        }
    }

    const tabFiltered = activeTab === 'All'
        ? bookings
        : bookings.filter(b => b.status.toLowerCase() === activeTab.toLowerCase());

    const filteredBookings = searchQuery.trim()
        ? tabFiltered.filter(b => {
            const q = searchQuery.toLowerCase();
            return (
                b.guest_name?.toLowerCase().includes(q) ||
                b.guest_email?.toLowerCase().includes(q) ||
                b.villa_name?.toLowerCase().includes(q) ||
                b.guest_whatsapp?.toLowerCase().includes(q)
            );
        })
        : tabFiltered;

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

    const formatWhatsAppLink = (phone: string, guestName: string, villaName: string, dates: string, totalPrice: string) => {
        const cleanPhone = phone.replace(/\D/g, '');
        const message = `Hello ${guestName}! 👋

Thank you for your booking request at *StayinUBUD*.

*📋 BOOKING DETAILS*
━━━━━━━━━━━━━━━
🏡 Villa: ${villaName}
📅 Dates: ${dates}
💰 Total: ${totalPrice}

*💳 PAYMENT OPTIONS*
━━━━━━━━━━━━━━━
We accept the following payment methods:

1️⃣ *Bank Transfer*
   BCA: 123-456-7890
   Account Name: PT StayinUBUD

2️⃣ *QRIS*
   We can send you the QRIS code

3️⃣ *Cash on Arrival*
   Pay directly at the villa

*📌 NEXT STEPS*
━━━━━━━━━━━━━━━
• 50% deposit required to confirm booking
• Remaining balance due on check-in day

Please reply to confirm your preferred payment method, and we'll finalize your reservation.

Best regards,
*StayinUBUD Team* 🌴`;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
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
                <button onClick={fetchBookings} className="btn-primary">Retry</button>
            </div>
        );
    }

    const pendingCount = bookings.filter(b => b.status === 'pending').length;

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Operations</span>
                    <div className="flex items-center gap-4">
                        <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                            Reservations ({bookings.length})
                        </h1>
                        {pendingCount > 0 && (
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">{pendingCount} pending</span>
                        )}
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-forest/40" />
                        <input
                            type="text"
                            placeholder="Search guest..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 pr-4 py-3 rounded-xl bg-white border border-admin-forest/10 focus:outline-none focus:border-admin-forest/30 font-mono text-xs w-64"
                        />
                    </div>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-admin-forest/10 font-mono text-xs uppercase tracking-widest overflow-x-auto">
                {['All', 'Pending', 'Confirmed', 'Cancelled', 'Completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 transition-colors relative whitespace-nowrap
              ${activeTab === tab ? 'text-admin-forest' : 'text-admin-forest/40 hover:text-admin-forest/70'}
            `}
                    >
                        {tab}
                        {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-admin-gold"></div>}
                    </button>
                ))}
            </div>

            {/* Table Panel */}
            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-admin-forest/5 text-xs font-mono uppercase tracking-widest text-admin-forest/50">
                            <tr>
                                <th className="py-4 pl-8">Guest</th>
                                <th className="py-4">Villa</th>
                                <th className="py-4">Dates</th>
                                <th className="py-4">Status</th>
                                <th className="py-4 text-right">Total</th>
                                <th className="py-4 text-center pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-forest/5 text-sm">
                            {filteredBookings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-admin-forest/40">
                                        No bookings found.
                                    </td>
                                </tr>
                            ) : (
                                filteredBookings.map(booking => (
                                    <tr key={booking.id} className="group hover:bg-white/50 transition-colors">
                                        <td className="py-5 pl-8">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-admin-sand flex items-center justify-center text-sm font-bold text-admin-forest">
                                                    {booking.guest_name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <p className="font-serif font-medium">{booking.guest_name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        {booking.guest_email && (
                                                            <a href={`mailto:${booking.guest_email}`} className="text-admin-forest/50 hover:text-admin-gold" title={booking.guest_email}>
                                                                <Mail size={12} />
                                                            </a>
                                                        )}
                                                        {booking.guest_whatsapp && (
                                                            <a
                                                                href={formatWhatsAppLink(
                                                                    booking.guest_whatsapp,
                                                                    booking.guest_name,
                                                                    booking.villa_name || '',
                                                                    `${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`,
                                                                    formatPrice(booking.total_price)
                                                                )}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-green-600 hover:text-green-700"
                                                                title={booking.guest_whatsapp}
                                                            >
                                                                <Phone size={12} />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 text-admin-forest/80">{booking.villa_name}</td>
                                        <td className="py-5 font-mono text-xs">
                                            <div className="flex items-center gap-2 text-admin-forest">
                                                <CalendarIcon size={14} className="opacity-50" />
                                                {formatDate(booking.start_date)} → {formatDate(booking.end_date)}
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                        ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        booking.status === 'cancelled' ? 'bg-red-50 text-red-600 border-red-200' :
                                                            'bg-gray-50 text-gray-500 border-gray-200'}
                      `}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-5 text-right font-mono font-medium">
                                            {formatPrice(booking.total_price)}
                                        </td>
                                        <td className="py-5 pr-8">
                                            <div className="flex items-center justify-center gap-2">
                                                {/* WhatsApp Reply Button */}
                                                {booking.guest_whatsapp && (
                                                    <a
                                                        href={formatWhatsAppLink(
                                                            booking.guest_whatsapp,
                                                            booking.guest_name,
                                                            booking.villa_name || '',
                                                            `${formatDate(booking.start_date)} - ${formatDate(booking.end_date)}`,
                                                            formatPrice(booking.total_price)
                                                        )}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                                        title="Reply via WhatsApp"
                                                    >
                                                        <Phone size={14} />
                                                    </a>
                                                )}

                                                {booking.status === 'pending' && (
                                                    <>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, 'confirmed')}
                                                            disabled={updatingId === booking.id}
                                                            className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors disabled:opacity-50"
                                                            title="Confirm"
                                                        >
                                                            {updatingId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                        </button>
                                                        <button
                                                            onClick={() => updateStatus(booking.id, 'cancelled')}
                                                            disabled={updatingId === booking.id}
                                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                                            title="Cancel"
                                                        >
                                                            <XCircle size={14} />
                                                        </button>
                                                    </>
                                                )}
                                                <Link
                                                    href={`/dashboard/bookings/${booking.id}`}
                                                    className="p-2 bg-admin-forest/5 text-admin-forest rounded-lg hover:bg-admin-forest/10 transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={14} />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-admin-forest/5 flex justify-between items-center text-xs font-mono text-admin-forest/50">
                    <span>Showing {filteredBookings.length} of {bookings.length} records</span>
                </div>
            </div>

        </div>
    );
}
