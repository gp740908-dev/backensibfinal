'use client';

import React, { useEffect, useState } from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface RevenueData {
    totalRevenue: number;
    totalBookings: number;
    confirmedRevenue: number;
    pendingRevenue: number;
    monthlyData: { month: string; revenue: number }[];
}

export default function FinancePage() {
    const [data, setData] = useState<RevenueData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRevenueData();
    }, []);

    async function fetchRevenueData() {
        setLoading(true);
        setError(null);
        try {
            const { data: bookings, error: fetchError } = await supabase
                .from('bookings')
                .select('total_price, status, created_at');

            if (fetchError) throw fetchError;

            const allBookings = bookings || [];

            // Calculate totals (exclude cancelled bookings from total revenue)
            const validBookings = allBookings.filter(b => b.status !== 'cancelled');
            const totalRevenue = validBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
            const confirmedRevenue = allBookings.filter(b => b.status === 'confirmed' || b.status === 'completed').reduce((sum, b) => sum + (b.total_price || 0), 0);
            const pendingRevenue = allBookings.filter(b => b.status === 'pending').reduce((sum, b) => sum + (b.total_price || 0), 0);

            // Monthly breakdown (last 6 months)
            const months: Record<string, number> = {};
            allBookings.forEach(b => {
                if (b.created_at) {
                    const monthKey = new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                    months[monthKey] = (months[monthKey] || 0) + (b.total_price || 0);
                }
            });

            const monthlyData = Object.entries(months).map(([month, revenue]) => ({ month, revenue })).slice(-6);

            setData({
                totalRevenue,
                totalBookings: allBookings.length,
                confirmedRevenue,
                pendingRevenue,
                monthlyData
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load revenue data');
        } finally {
            setLoading(false);
        }
    }

    function handleExportCSV() {
        if (!data) return;
        const rows = [
            ['Month', 'Revenue (IDR)'],
            ...data.monthlyData.map(m => [m.month, m.revenue.toString()]),
            [],
            ['Summary', ''],
            ['Total Revenue', data.totalRevenue.toString()],
            ['Confirmed Revenue', data.confirmedRevenue.toString()],
            ['Pending Revenue', data.pendingRevenue.toString()],
            ['Total Bookings', data.totalBookings.toString()],
        ];
        const csv = rows.map(r => r.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `revenue-report-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const formatPrice = (price: number) => {
        if (price >= 1000000000) return `${(price / 1000000000).toFixed(1)}B`;
        if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
        return new Intl.NumberFormat('id-ID').format(price);
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
                <button onClick={fetchRevenueData} className="btn-primary">Retry</button>
            </div>
        );
    }

    const maxMonthlyRevenue = Math.max(...(data?.monthlyData.map(m => m.revenue) || [1]));

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Financials</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        Revenue & Assets
                    </h1>
                </div>
                <button className="btn-outline" onClick={handleExportCSV}>
                    <Download size={16} /> Export Report
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl bg-admin-forest text-admin-surface relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-10">
                        <DollarSign size={100} />
                    </div>
                    <span className="block font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Total Revenue</span>
                    <h2 className="text-5xl md:text-6xl font-serif mb-4">IDR {formatPrice(data?.totalRevenue || 0)}</h2>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                        <TrendingUp size={16} /> {data?.totalBookings || 0} total bookings
                    </div>
                </div>

                <div className="md:col-span-1 glass-panel p-8 rounded-3xl flex flex-col justify-center">
                    <span className="block font-mono text-xs uppercase tracking-widest opacity-60 mb-2 text-admin-forest">Confirmed</span>
                    <h3 className="text-3xl font-serif text-admin-forest mb-2">IDR {formatPrice(data?.confirmedRevenue || 0)}</h3>
                    <div className="flex items-center gap-2 text-xs text-admin-success font-bold uppercase tracking-wide">
                        <TrendingUp size={14} /> Secured
                    </div>
                </div>

                <div className="md:col-span-1 glass-panel p-8 rounded-3xl flex flex-col justify-center">
                    <span className="block font-mono text-xs uppercase tracking-widest opacity-60 mb-2 text-admin-forest">Pending</span>
                    <h3 className="text-3xl font-serif text-admin-forest mb-2">IDR {formatPrice(data?.pendingRevenue || 0)}</h3>
                    <div className="flex items-center gap-2 text-xs text-yellow-600 font-bold uppercase tracking-wide">
                        Awaiting Confirmation
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Chart */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-serif text-2xl text-admin-forest">Monthly Revenue</h3>
                    </div>

                    {data?.monthlyData && data.monthlyData.length > 0 ? (
                        <>
                            <div className="h-64 w-full flex items-end justify-between gap-2 px-4 border-b border-l border-admin-forest/10">
                                {data.monthlyData.map((item, i) => (
                                    <div
                                        key={i}
                                        className="w-full bg-admin-forest hover:bg-admin-gold transition-colors rounded-t-sm relative group cursor-pointer"
                                        style={{ height: `${(item.revenue / maxMonthlyRevenue) * 100}%`, minHeight: '10px' }}
                                    >
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-admin-forest text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            IDR {formatPrice(item.revenue)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between mt-4 text-xs font-mono text-admin-forest/40 uppercase">
                                {data.monthlyData.map((item, i) => (
                                    <span key={i}>{item.month}</span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-admin-forest/40">
                            No booking data to display
                        </div>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="lg:col-span-1 glass-panel p-8 rounded-3xl">
                    <h3 className="font-serif text-2xl text-admin-forest mb-8">Summary</h3>

                    <div className="space-y-6">
                        <div className="p-4 bg-white/50 rounded-xl">
                            <div className="flex justify-between text-sm font-bold text-admin-forest mb-2">
                                <span>Total Bookings</span>
                                <span>{data?.totalBookings || 0}</span>
                            </div>
                        </div>
                        <div className="p-4 bg-white/50 rounded-xl">
                            <div className="flex justify-between text-sm font-bold text-admin-forest mb-2">
                                <span>Avg. Booking Value</span>
                                <span>IDR {formatPrice((data?.totalRevenue || 0) / Math.max(data?.totalBookings || 1, 1))}</span>
                            </div>
                        </div>
                    </div>

                    <button
                        className="w-full mt-8 py-3 bg-admin-forest/5 rounded-xl text-xs font-bold text-admin-forest hover:bg-admin-forest/10 transition-colors"
                        onClick={() => window.open('/dashboard/bookings', '_self')}
                    >
                        View Detailed Ledger
                    </button>
                </div>

            </div>

        </div>
    );
}
