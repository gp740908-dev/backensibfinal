'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Calendar, DollarSign, Users, Home, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface DashboardData {
    totalRevenue: number;
    totalBookings: number;
    pendingBookings: number;
    totalVillas: number;
    recentBookings: any[];
}

export default function DashboardHome() {
    const container = useRef<HTMLDivElement>(null);
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    async function fetchDashboardData() {
        setLoading(true);
        setError(null);
        try {
            // Fetch all data in parallel
            const [bookingsRes, villasRes] = await Promise.all([
                supabase.from('bookings').select(`
          id, total_price, status, guest_name, start_date, end_date, created_at,
          villas:villa_id (name)
        `).order('created_at', { ascending: false }),
                supabase.from('villas').select('id, name')
            ]);

            if (bookingsRes.error) throw bookingsRes.error;
            if (villasRes.error) throw villasRes.error;

            const bookings = bookingsRes.data || [];
            const villas = villasRes.data || [];

            // Calculate stats
            const totalRevenue = bookings
                .filter(b => b.status === 'confirmed' || b.status === 'completed')
                .reduce((sum, b) => sum + (b.total_price || 0), 0);

            const pendingBookings = bookings.filter(b => b.status === 'pending').length;
            const recentBookings = bookings.slice(0, 5).map(b => ({
                ...b,
                villa_name: b.villas?.name || 'Unknown'
            }));

            setData({
                totalRevenue,
                totalBookings: bookings.length,
                pendingBookings,
                totalVillas: villas.length,
                recentBookings
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    }

    useGSAP(() => {
        if (!loading && data) {
            const tl = gsap.timeline();
            tl.from('.dashboard-header', {
                y: 20,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            })
                .from('.bento-item', {
                    y: 30,
                    opacity: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: 'power2.out'
                }, "-=0.5");
        }
    }, { scope: container, dependencies: [loading, data] });

    const formatPrice = (price: number) => {
        if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)}B`;
        if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
        return new Intl.NumberFormat('id-ID').format(price);
    };

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } catch {
            return dateStr;
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const getCurrentDate = () => {
        return new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
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
                <button onClick={fetchDashboardData} className="btn-primary">Retry</button>
            </div>
        );
    }

    return (
        <div ref={container} className="space-y-12">

            {/* Header */}
            <header className="dashboard-header flex justify-between items-end pb-6 border-b border-admin-forest/5">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Overview</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-admin-forest">
                        {getGreeting()}, <span className="italic text-admin-gold">Administrator</span>
                    </h1>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <span className="font-mono text-xs text-admin-forest/60 block">Bali, Indonesia</span>
                        <span className="font-sans font-bold text-admin-forest">{getCurrentDate()}</span>
                    </div>
                    <button onClick={fetchDashboardData} className="p-2 rounded-full hover:bg-admin-forest/5 transition-colors" title="Refresh">
                        <RefreshCw size={18} className="text-admin-forest/60" />
                    </button>
                </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[500px] w-full">

                {/* 1. Revenue (Large Square) */}
                <div className="bento-item glass-panel md:col-span-2 md:row-span-2 p-8 relative overflow-hidden group rounded-3xl flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <DollarSign size={120} className="text-admin-forest" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-admin-gold"></span>
                            <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/60">Confirmed Revenue</span>
                        </div>
                        <h2 className="font-serif text-5xl md:text-6xl text-admin-forest mb-2">
                            IDR {formatPrice(data?.totalRevenue || 0)}
                        </h2>
                        <div className="flex items-center gap-2 text-sm font-bold text-admin-success bg-white/50 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                            <ArrowUpRight size={14} /> From {data?.totalBookings || 0} bookings
                        </div>
                    </div>

                    <Link href="/dashboard/finance" className="relative z-10 mt-8 text-sm font-bold text-admin-forest hover:text-admin-gold transition-colors">
                        View Finance Details &rarr;
                    </Link>
                </div>

                {/* 2. Properties (Tall) */}
                <div className="bento-item glass-panel md:col-span-1 md:row-span-2 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-admin-forest/5 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"></div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Home size={16} className="text-admin-forest/60" />
                            <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/60">Properties</span>
                        </div>
                        <h3 className="font-serif text-4xl text-admin-forest">{data?.totalVillas || 0}</h3>
                        <p className="text-sm text-admin-forest/60 mt-2">Active villas</p>
                    </div>

                    <Link href="/dashboard/villas" className="relative z-10 text-sm font-bold text-admin-forest hover:text-admin-gold transition-colors">
                        Manage Villas &rarr;
                    </Link>
                </div>

                {/* 3. Pending Bookings (Small) */}
                <Link href="/dashboard/bookings" className="bento-item glass-panel md:col-span-1 p-6 rounded-3xl flex flex-col justify-center items-center text-center group hover:bg-admin-forest hover:text-admin-surface transition-colors cursor-pointer">
                    <Calendar size={32} className="mb-4 text-admin-forest group-hover:text-admin-gold transition-colors" />
                    <span className="text-4xl font-serif mb-1">{data?.pendingBookings || 0}</span>
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">Pending</span>
                </Link>

                {/* 4. Total Bookings (Small) */}
                <Link href="/dashboard/bookings" className="bento-item glass-panel md:col-span-1 p-6 rounded-3xl flex flex-col justify-center items-center text-center group hover:bg-admin-forest hover:text-admin-surface transition-colors cursor-pointer">
                    <Users size={32} className="mb-4 text-admin-forest group-hover:text-admin-gold transition-colors" />
                    <span className="text-4xl font-serif mb-1">{data?.totalBookings || 0}</span>
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">Total Bookings</span>
                </Link>

            </div>

            {/* Recent Activity Table */}
            <div className="glass-panel rounded-3xl p-8 bento-item">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-2xl">Recent Bookings</h3>
                    <Link href="/dashboard/bookings" className="btn-outline py-2 px-4 text-xs">View All</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[600px]">
                        <thead>
                            <tr className="border-b border-admin-forest/10 text-xs font-mono uppercase tracking-widest text-admin-forest/50">
                                <th className="pb-4 pl-4">Guest</th>
                                <th className="pb-4">Property</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4 text-right pr-4">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {data?.recentBookings && data.recentBookings.length > 0 ? (
                                data.recentBookings.map((booking, i) => (
                                    <tr key={booking.id || i} className="group hover:bg-admin-forest/5 transition-colors cursor-pointer">
                                        <td className="py-4 pl-4 font-bold flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-admin-sand flex items-center justify-center text-xs font-bold text-admin-forest">
                                                {booking.guest_name?.charAt(0) || '?'}
                                            </div>
                                            {booking.guest_name || 'Unknown'}
                                        </td>
                                        <td className="py-4 opacity-80">{booking.villa_name}</td>
                                        <td className="py-4 font-mono opacity-60">
                                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-gray-100 text-gray-600'}
                      `}>
                                                {booking.status}
                                            </span>
                                        </td>
                                        <td className="py-4 text-right pr-4 font-mono">IDR {formatPrice(booking.total_price)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-admin-forest/40">
                                        No bookings yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
