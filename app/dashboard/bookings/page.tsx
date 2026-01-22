'use client';

import React, { useState } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, Calendar as CalendarIcon, MoreHorizontal, CheckCircle, Clock } from 'lucide-react';

const BOOKINGS = [
    { id: 'BK-001', guest: 'Sarah Jenkins', villa: 'Villa Niskala', checkIn: 'Jan 24, 2024', checkOut: 'Jan 28, 2024', status: 'Active', total: '12.5M', avatar: 'S' },
    { id: 'BK-002', guest: 'Michael Chen', villa: 'The River House', checkIn: 'Feb 02, 2024', checkOut: 'Feb 10, 2024', status: 'Upcoming', total: '45.0M', avatar: 'M' },
    { id: 'BK-003', guest: 'Emma Watson', villa: 'Estate of Zen', checkIn: 'Jan 10, 2024', checkOut: 'Jan 15, 2024', status: 'Completed', total: '22.0M', avatar: 'E' },
    { id: 'BK-004', guest: 'David Miller', villa: 'Villa Niskala', checkIn: 'Mar 01, 2024', checkOut: 'Mar 05, 2024', status: 'Pending', total: '15.0M', avatar: 'D' },
];

export default function BookingsPage() {
    const [activeTab, setActiveTab] = useState('All');

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Operations</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        Reservations
                    </h1>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-admin-forest/40" />
                        <input type="text" placeholder="Search booking ID or guest..." className="pl-10 pr-4 py-3 rounded-xl bg-white border border-admin-forest/10 focus:outline-none focus:border-admin-forest/30 font-mono text-xs w-64" />
                    </div>
                    <button className="p-3 bg-white border border-admin-forest/10 rounded-xl hover:bg-admin-forest/5 text-admin-forest transition-colors">
                        <Filter size={18} />
                    </button>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-admin-forest/10 font-mono text-xs uppercase tracking-widest">
                {['All', 'Active', 'Upcoming', 'Completed', 'Cancelled'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`pb-4 transition-colors relative
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
                <table className="w-full text-left">
                    <thead className="bg-admin-forest/5 text-xs font-mono uppercase tracking-widest text-admin-forest/50">
                        <tr>
                            <th className="py-4 pl-8">Booking ID</th>
                            <th className="py-4">Guest</th>
                            <th className="py-4">Villa</th>
                            <th className="py-4">Timeline</th>
                            <th className="py-4">Status</th>
                            <th className="py-4 text-right pr-8">Total</th>
                            <th className="py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-admin-forest/5 text-sm">
                        {BOOKINGS.map(booking => (
                            <tr key={booking.id} className="group hover:bg-white/50 transition-colors cursor-pointer">
                                <td className="py-6 pl-8 font-mono text-admin-forest/60">#{booking.id}</td>
                                <td className="py-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-admin-sand flex items-center justify-center text-xs font-bold text-admin-forest">
                                            {booking.avatar}
                                        </div>
                                        <span className="font-serif font-medium text-lg">{booking.guest}</span>
                                    </div>
                                </td>
                                <td className="py-6 text-admin-forest/70">{booking.villa}</td>
                                <td className="py-6 font-mono text-xs">
                                    <div className="flex items-center gap-2 text-admin-forest">
                                        <CalendarIcon size={14} className="opacity-50" />
                                        {booking.checkIn} &rarr; {booking.checkOut}
                                    </div>
                                </td>
                                <td className="py-6">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border
                       ${booking.status === 'Active' ? 'bg-admin-success/10 text-admin-success border-admin-success/20' :
                                            booking.status === 'Upcoming' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                booking.status === 'Pending' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                    'bg-gray-50 text-gray-500 border-gray-100'}
                    `}>
                                        {booking.status}
                                    </span>
                                </td>
                                <td className="py-6 text-right pr-8 font-mono font-medium">IDR {booking.total}</td>
                                <td className="py-6 pr-4 text-right">
                                    <button className="p-2 hover:bg-admin-forest/5 rounded-full text-admin-forest/40 hover:text-admin-forest transition-colors">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination Mock */}
                <div className="p-6 border-t border-admin-forest/5 flex justify-between items-center text-xs font-mono text-admin-forest/50">
                    <span>Showing 1-4 of 28 records</span>
                    <div className="flex gap-2">
                        <button className="p-2 border border-admin-forest/10 rounded-lg hover:bg-admin-forest/5"><ChevronLeft size={14} /></button>
                        <button className="p-2 border border-admin-forest/10 rounded-lg hover:bg-admin-forest/5"><ChevronRight size={14} /></button>
                    </div>
                </div>
            </div>

        </div>
    );
}
