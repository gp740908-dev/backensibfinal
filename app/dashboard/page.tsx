'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowUpRight, Calendar, DollarSign, Users, Home } from 'lucide-react';

export default function DashboardHome() {
    const container = useRef<HTMLDivElement>(null);

    useGSAP(() => {
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

    }, { scope: container });

    return (
        <div ref={container} className="space-y-12">

            {/* Header */}
            <header className="dashboard-header flex justify-between items-end pb-6 border-b border-admin-forest/5">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Overview</span>
                    <h1 className="font-serif text-4xl md:text-5xl text-admin-forest">
                        Good Morning, <span className="italic text-admin-gold">Administrator</span>
                    </h1>
                </div>
                <div className="hidden md:block text-right">
                    <span className="font-mono text-xs text-admin-forest/60 block">Bali, Indonesia</span>
                    <span className="font-sans font-bold text-admin-forest">Wednesday, 24 Jan</span>
                </div>
            </header>

            {/* Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-6 h-auto md:h-[600px] w-full">

                {/* 1. Revenue (Large Square) */}
                <div className="bento-item glass-panel md:col-span-2 md:row-span-2 p-8 relative overflow-hidden group rounded-3xl flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <DollarSign size={120} className="text-admin-forest" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 rounded-full bg-admin-gold"></span>
                            <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/60">Total Revenue</span>
                        </div>
                        <h2 className="font-serif text-6xl text-admin-forest mb-2">IDR 2.4<span className="text-2xl opacity-50">B</span></h2>
                        <div className="flex items-center gap-2 text-sm font-bold text-admin-success bg-white/50 w-fit px-3 py-1 rounded-full backdrop-blur-sm">
                            <ArrowUpRight size={14} /> +12.5% vs last month
                        </div>
                    </div>

                    <div className="relative z-10 w-full h-32 mt-8 flex items-end gap-2">
                        {/* Mock Chart */}
                        {[40, 65, 45, 80, 55, 90, 70, 85].map((h, i) => (
                            <div key={i} className="flex-1 bg-admin-forest/10 hover:bg-admin-forest/80 transition-colors rounded-t-lg" style={{ height: `${h}%` }}></div>
                        ))}
                    </div>
                </div>

                {/* 2. Occupancy (Tall) */}
                <div className="bento-item glass-panel md:col-span-1 md:row-span-2 p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden group">
                    <div className="absolute inset-0 bg-admin-forest/5 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom"></div>

                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Home size={16} className="text-admin-forest/60" />
                            <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/60">Occupancy</span>
                        </div>
                        <h3 className="font-serif text-4xl text-admin-forest">85%</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/40 rounded-xl border border-white/20">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Villa A</span>
                                <span className="text-admin-success">Booked</span>
                            </div>
                            <div className="w-full h-1 bg-admin-forest/10 rounded-full overflow-hidden">
                                <div className="w-full h-full bg-admin-forest"></div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/40 rounded-xl border border-white/20">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Villa B</span>
                                <span className="text-admin-gold">Cleaning</span>
                            </div>
                            <div className="w-full h-1 bg-admin-forest/10 rounded-full overflow-hidden">
                                <div className="w-[60%] h-full bg-admin-gold"></div>
                            </div>
                        </div>
                        <div className="p-4 bg-white/40 rounded-xl border border-white/20">
                            <div className="flex justify-between text-xs font-bold mb-1">
                                <span>Villa C</span>
                                <span className="text-admin-forest/40">Available</span>
                            </div>
                            <div className="w-full h-1 bg-admin-forest/10 rounded-full overflow-hidden">
                                <div className="w-0 h-full bg-admin-forest"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. New Bookings (Small) */}
                <div className="bento-item glass-panel md:col-span-1 p-6 rounded-3xl flex flex-col justify-center items-center text-center group hover:bg-admin-forest hover:text-admin-surface transition-colors cursor-pointer">
                    <Calendar size={32} className="mb-4 text-admin-forest group-hover:text-admin-gold transition-colors" />
                    <span className="text-4xl font-serif mb-1">14</span>
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">New Requests</span>
                </div>

                {/* 4. Active Guests (Small) */}
                <div className="bento-item glass-panel md:col-span-1 p-6 rounded-3xl flex flex-col justify-center items-center text-center group hover:bg-admin-forest hover:text-admin-surface transition-colors cursor-pointer">
                    <Users size={32} className="mb-4 text-admin-forest group-hover:text-admin-gold transition-colors" />
                    <span className="text-4xl font-serif mb-1">28</span>
                    <span className="font-mono text-xs uppercase tracking-widest opacity-60">Guests On-Site</span>
                </div>

            </div>

            {/* Recent Activity Table */}
            <div className="glass-panel rounded-3xl p-8 bento-item">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-serif text-2xl">Recent Activity</h3>
                    <button className="btn-outline py-2 px-4 text-xs">View All</button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
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
                            {[1, 2, 3].map((_, i) => (
                                <tr key={i} className="group hover:bg-admin-forest/5 transition-colors cursor-pointer">
                                    <td className="py-4 pl-4 font-bold flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-admin-sand flex items-center justify-center text-xs">A</div>
                                        Alice Freeman
                                    </td>
                                    <td className="py-4 opacity-80">Villa Niskala</td>
                                    <td className="py-4 font-mono opacity-60">Jan 24 - Jan 28</td>
                                    <td className="py-4">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
                                    </td>
                                    <td className="py-4 text-right pr-4 font-mono">IDR 12.5M</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
