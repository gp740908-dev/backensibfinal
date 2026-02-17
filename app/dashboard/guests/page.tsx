'use client';

import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, MoreHorizontal, Star, Crown, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Booking } from '../../../lib/types';
import { handleSupabaseError } from '../../../lib/errorHandler';

interface GuestProfile {
    id: string;
    name: string;
    email: string;
    whatsapp?: string;
    role: 'VIP' | 'Returning' | 'Standard' | 'New';
    stays: number;
    spent: number;
    lastStay: string;
    country?: string;
}

export default function GuestsPage() {
    const [guests, setGuests] = useState<GuestProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchGuests();
    }, []);

    async function fetchGuests() {
        setLoading(true);
        setError(null);
        try {
            // Fetch all bookings to aggregate guest data
            // We select specific fields needed for aggregation
            const { data, error: fetchError } = await supabase
                .from('bookings')
                .select('id, guest_name, guest_email, guest_whatsapp, total_price, start_date, end_date, status')
                .in('status', ['confirmed', 'completed']); // Only count valid bookings for stats

            if (fetchError) throw fetchError;

            const bookings = data as Booking[] || [];

            // Aggregation map
            const guestMap = new Map<string, GuestProfile>();

            bookings.forEach(booking => {
                const email = booking.guest_email?.toLowerCase().trim();
                // Skip if no email is attached (rare but possible in manual entry)
                if (!email) return;

                const existing = guestMap.get(email);
                const price = booking.total_price || 0;

                if (existing) {
                    existing.stays += 1;
                    existing.spent += price;
                    // Update last stay if this booking is later
                    if (new Date(booking.end_date) > new Date(existing.lastStay)) {
                        existing.lastStay = booking.end_date;
                    }
                    // Update name/phone if missing in existing but present here
                    if (!existing.name && booking.guest_name) existing.name = booking.guest_name;
                    if (!existing.whatsapp && booking.guest_whatsapp) existing.whatsapp = booking.guest_whatsapp;

                    guestMap.set(email, existing);
                } else {
                    guestMap.set(email, {
                        id: email, // use email as ID for deduplication
                        name: booking.guest_name || 'Unknown Guest',
                        email: email,
                        whatsapp: booking.guest_whatsapp,
                        role: 'New', // Will verify after loop
                        stays: 1,
                        spent: price,
                        lastStay: booking.end_date
                    });
                }
            });

            // Convert map to array and calculate Roles
            const guestList = Array.from(guestMap.values()).map(guest => {
                // Logic for Role
                if (guest.spent > 50000000) { // > 50M IDR
                    guest.role = 'VIP';
                } else if (guest.stays > 1) {
                    guest.role = 'Returning';
                } else {
                    guest.role = 'New';
                }
                return guest;
            });

            // Sort by Last Stay descending (most recent guests first)
            guestList.sort((a, b) => new Date(b.lastStay).getTime() - new Date(a.lastStay).getTime());

            setGuests(guestList);

        } catch (err: any) {
            setError(handleSupabaseError(err, 'loading guests'));
        } finally {
            setLoading(false);
        }
    }

    const formatPrice = (price: number) => {
        if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)}B`;
        if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
        return new Intl.NumberFormat('id-ID').format(price);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        } catch {
            return dateStr;
        }
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
                <button onClick={fetchGuests} className="btn-primary">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Community</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        Guest Profiles
                    </h1>
                </div>
                <div className="text-sm font-mono text-admin-forest/60">
                    Total Guests: {guests.length}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {guests.map(guest => (
                    <div key={guest.id} className="glass-panel p-8 rounded-3xl group hover:border-admin-forest/20 transition-all duration-300 relative">

                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-admin-sand mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-3xl font-serif text-admin-forest/40">
                                    {guest.name.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <h3 className="font-serif text-2xl mb-1">{guest.name}</h3>
                            {guest.role !== 'New' && (
                                <span className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest rounded-full px-3 py-1 mt-2
                                    ${guest.role === 'VIP' ? 'bg-admin-gold/20 text-admin-forest' : 'bg-admin-forest/5 text-admin-forest/60'}
                                `}>
                                    {guest.role === 'VIP' && <Crown size={12} className="fill-admin-forest text-transparent" />}
                                    {guest.role} Guest
                                </span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/40">
                                <div className="w-8 h-8 rounded-full bg-admin-forest/5 flex items-center justify-center text-admin-forest">
                                    <Mail size={14} />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-[10px] uppercase tracking-widest opacity-50 mb-0.5">Contact</p>
                                    <p className="text-sm font-medium truncate" title={guest.email}>{guest.email}</p>
                                </div>
                            </div>

                            {guest.whatsapp && (
                                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/40 border border-white/40">
                                    <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                        <Phone size={14} />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="text-[10px] uppercase tracking-widest opacity-50 mb-0.5">WhatsApp</p>
                                        <p className="text-sm font-medium truncate">{guest.whatsapp}</p>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-white/40 border border-white/40 text-center">
                                    <span className="block text-xl font-serif">{guest.stays}</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">Stays</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/40 border border-white/40 text-center">
                                    <span className="block text-xl font-serif">{formatPrice(guest.spent)}</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">Spent</span>
                                </div>
                            </div>

                            <div className="text-center">
                                <span className="text-[10px] uppercase tracking-widest text-admin-forest/40">
                                    Last Stay: {formatDate(guest.lastStay)}
                                </span>
                            </div>
                        </div>

                    </div>
                ))}

                {guests.length === 0 && !loading && (
                    <div className="col-span-full py-12 text-center text-admin-forest/40 glass-panel rounded-3xl">
                        <Star size={48} className="mx-auto mb-4 opacity-30" />
                        <h3 className="text-xl font-serif mb-2">No Guests Yet</h3>
                        <p className="text-sm">Guest profiles will be automatically created when bookings are confirmed.</p>
                    </div>
                )}
            </div>

        </div>
    );
}
