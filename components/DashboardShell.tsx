'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export const DashboardShell = ({ children }: { children: React.ReactNode }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="flex bg-admin-bg min-h-screen relative">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 w-full bg-admin-bg/80 backdrop-blur-md z-40 px-6 py-4 flex items-center justify-between border-b border-admin-forest/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-admin-gold flex items-center justify-center text-admin-forest font-serif font-bold italic">
                        S
                    </div>
                    <span className="font-serif text-lg tracking-wide text-admin-forest">
                        Stayin<span className="italic">UBUD</span>
                    </span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(true)}
                    className="p-2 text-admin-forest hover:bg-admin-forest/5 rounded-lg"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar with Mobile State */}
            <Sidebar
                mobileOpen={mobileMenuOpen}
                setMobileOpen={setMobileMenuOpen}
            />

            {/* Main Content */}
            <main className="flex-1 ml-0 md:ml-20 p-6 md:p-12 pt-24 md:pt-12 transition-all duration-300 w-full relative">
                {/* Background Texture */}
                <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-[0.03] pointer-events-none z-0"></div>
                <div className="relative z-10 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}
        </div>
    );
};
