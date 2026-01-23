'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Mail, Phone, MessageSquare, Home, DollarSign, Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { Booking } from '../../../../lib/types';

export default function BookingDetailPage() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<Booking & { villa_name?: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchBooking();
    }, [bookingId]);

    async function fetchBooking() {
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('bookings')
                .select(`
          *,
          villas:villa_id (name)
        `)
                .eq('id', bookingId)
                .single();

            if (fetchError) throw fetchError;
            if (!data) throw new Error('Booking not found');

            setBooking({
                ...data,
                villa_name: data.villas?.name || 'Unknown Villa'
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load booking');
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(newStatus: 'confirmed' | 'cancelled' | 'completed') {
        if (!booking) return;
        setUpdating(true);
        try {
            const { error: updateError } = await supabase
                .from('bookings')
                .update({ status: newStatus })
                .eq('id', bookingId);

            if (updateError) throw updateError;
            setBooking(prev => prev ? { ...prev, status: newStatus } : null);
        } catch (err: any) {
            alert(`Failed to update: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    }

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-admin-forest/50" />
            </div>
        );
    }

    if (error || !booking) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
                <Link href="/dashboard/bookings" className="btn-primary">Back to Bookings</Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        pending: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        confirmed: 'bg-green-100 text-green-700 border-green-300',
        cancelled: 'bg-red-100 text-red-700 border-red-300',
        completed: 'bg-blue-100 text-blue-700 border-blue-300'
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <Link href="/dashboard/bookings" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-sm">
                    <ArrowLeft size={16} /> Back to Bookings
                </Link>
                <div className="flex items-center justify-between">
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Booking Details</h1>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest border ${statusColors[booking.status] || 'bg-gray-100'}`}>
                        {booking.status}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Guest Info */}
                <div className="glass-panel rounded-3xl p-8">
                    <h2 className="font-serif text-xl mb-6 text-admin-forest flex items-center gap-2">
                        <User size={20} /> Guest Information
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white/50 rounded-xl">
                            <div className="w-12 h-12 rounded-full bg-admin-sand flex items-center justify-center text-lg font-bold text-admin-forest">
                                {booking.guest_name?.charAt(0) || '?'}
                            </div>
                            <div>
                                <p className="font-serif text-lg">{booking.guest_name}</p>
                                <p className="text-xs text-admin-forest/50">Guest</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Mail size={16} className="text-admin-forest/50" />
                            <a href={`mailto:${booking.guest_email}`} className="hover:text-admin-gold">{booking.guest_email}</a>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                            <Phone size={16} className="text-admin-forest/50" />
                            <a href={`https://wa.me/${booking.guest_whatsapp?.replace(/\D/g, '')}`} target="_blank" className="hover:text-admin-gold">{booking.guest_whatsapp}</a>
                        </div>

                        {booking.special_request && (
                            <div className="mt-4 p-4 bg-admin-sand/50 rounded-xl">
                                <p className="text-xs uppercase tracking-widest text-admin-forest/50 mb-2 flex items-center gap-2"><MessageSquare size={14} /> Special Request</p>
                                <p className="text-sm">{booking.special_request}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Booking Info */}
                <div className="glass-panel rounded-3xl p-8">
                    <h2 className="font-serif text-xl mb-6 text-admin-forest flex items-center gap-2">
                        <Calendar size={20} /> Reservation Details
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                            <Home size={20} className="text-admin-forest/50" />
                            <div>
                                <p className="font-serif text-lg">{booking.villa_name}</p>
                                <p className="text-xs text-admin-forest/50">Property</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/50 rounded-xl text-center">
                                <p className="text-xs uppercase tracking-widest text-admin-forest/50 mb-1">Check-in</p>
                                <p className="font-mono text-sm">{formatDate(booking.start_date)}</p>
                            </div>
                            <div className="p-4 bg-white/50 rounded-xl text-center">
                                <p className="text-xs uppercase tracking-widest text-admin-forest/50 mb-1">Check-out</p>
                                <p className="font-mono text-sm">{formatDate(booking.end_date)}</p>
                            </div>
                        </div>

                        <div className="p-4 bg-admin-forest text-white rounded-xl flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <DollarSign size={20} />
                                <span className="text-sm uppercase tracking-widest">Total Price</span>
                            </div>
                            <span className="font-serif text-2xl">{formatPrice(booking.total_price)}</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Actions */}
            {booking.status === 'pending' && (
                <div className="mt-8 glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-admin-forest/70">This booking is awaiting confirmation.</p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => updateStatus('cancelled')}
                            disabled={updating}
                            className="btn-outline text-red-600 border-red-200 hover:bg-red-50"
                        >
                            {updating ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                            Decline
                        </button>
                        <button
                            onClick={() => updateStatus('confirmed')}
                            disabled={updating}
                            className="btn-primary bg-green-600 hover:bg-green-700"
                        >
                            {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                            Confirm Booking
                        </button>
                    </div>
                </div>
            )}

            {booking.status === 'confirmed' && (
                <div className="mt-8 glass-panel rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-admin-forest/70">Mark as completed after guest checkout.</p>
                    <button
                        onClick={() => updateStatus('completed')}
                        disabled={updating}
                        className="btn-primary"
                    >
                        {updating ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        Mark as Completed
                    </button>
                </div>
            )}

        </div>
    );
}
