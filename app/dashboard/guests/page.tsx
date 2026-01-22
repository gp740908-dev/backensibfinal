'use client';

import React from 'react';
import { Mail, Phone, MapPin, MoreHorizontal, Star, Crown } from 'lucide-react';

const GUESTS = [
    {
        id: 1,
        name: 'Alice Freeman',
        email: 'alice@example.com',
        role: 'VIP',
        stays: 3,
        spent: '45M',
        country: 'Australia',
        lastStay: 'Jan 2024'
    },
    {
        id: 2,
        name: 'Robert Langdon',
        email: 'robert@harvard.edu',
        role: 'Standard',
        stays: 1,
        spent: '12M',
        country: 'USA',
        lastStay: 'Dec 2023'
    },
    {
        id: 3,
        name: 'Sophie Neveu',
        email: 'sophie@police.fr',
        role: 'Returning',
        stays: 2,
        spent: '28M',
        country: 'France',
        lastStay: 'Nov 2023'
    },
];

export default function GuestsPage() {
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
                <button className="btn-outline">Export CRM Data</button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {GUESTS.map(guest => (
                    <div key={guest.id} className="glass-panel p-8 rounded-3xl group hover:border-admin-forest/20 transition-all duration-300 relative">

                        <div className="absolute top-6 right-6">
                            <button className="text-admin-forest/30 hover:text-admin-forest transition-colors">
                                <MoreHorizontal size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center mb-8">
                            <div className="w-24 h-24 rounded-full bg-admin-sand mb-4 overflow-hidden relative">
                                <div className="absolute inset-0 flex items-center justify-center text-3xl font-serif text-admin-forest/40">
                                    {guest.name.charAt(0)}
                                </div>
                            </div>
                            <h3 className="font-serif text-2xl mb-1">{guest.name}</h3>
                            <span className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-admin-forest/50">
                                <MapPin size={10} /> {guest.country}
                            </span>

                            {guest.role === 'VIP' && (
                                <span className="mt-4 px-3 py-1 bg-admin-gold/20 text-admin-forest text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1">
                                    <Crown size={12} className="fill-admin-forest text-transparent" /> VIP Guest
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
                                    <p className="text-sm font-medium truncate">{guest.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-xl bg-white/40 border border-white/40 text-center">
                                    <span className="block text-xl font-serif">{guest.stays}</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">Stays</span>
                                </div>
                                <div className="p-3 rounded-xl bg-white/40 border border-white/40 text-center">
                                    <span className="block text-xl font-serif">{guest.spent}</span>
                                    <span className="text-[10px] uppercase tracking-widest opacity-50">LTV (IDR)</span>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-6 py-3 border border-dashed border-admin-forest/20 rounded-xl text-xs font-mono uppercase tracking-widest text-admin-forest/60 hover:text-admin-forest hover:border-admin-forest hover:bg-admin-forest/5 transition-all">
                            View Full Profile
                        </button>

                    </div>
                ))}

                {/* Add Guest Card */}
                <div className="border-2 border-dashed border-admin-forest/10 rounded-3xl flex flex-col items-center justify-center p-8 gap-4 text-admin-forest/30 hover:text-admin-forest/60 hover:border-admin-forest/30 transition-all cursor-pointer group min-h-[400px]">
                    <span className="font-serif text-xl">Add Guest</span>
                </div>
            </div>

        </div>
    );
}
