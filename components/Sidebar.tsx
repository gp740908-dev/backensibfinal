'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Map,
    Calendar,
    Users,
    PieChart,
    Settings,
    LogOut,
    Bell,
    X,
    Sparkles,
    FileText
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Overview', icon: Home, href: '/dashboard' },
    { label: 'Properties', icon: Map, href: '/dashboard/villas' },
    { label: 'Bookings', icon: Calendar, href: '/dashboard/bookings' },
    { label: 'Experiences', icon: Sparkles, href: '/dashboard/experiences' },
    { label: 'Blog', icon: FileText, href: '/dashboard/blog' },
    { label: 'Finance', icon: PieChart, href: '/dashboard/finance' },
];


interface SidebarProps {
    mobileOpen?: boolean;
    setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
    const pathname = usePathname();

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-admin-forest text-admin-surface transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden z-50 border-r border-white/5 flex flex-col justify-between py-8
             ${mobileOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0 w-20 md:hover:w-64 group'}
          `}
        >

            {/* Close Button (Mobile Only) */}
            <button
                onClick={() => setMobileOpen?.(false)}
                className="absolute top-4 right-4 text-white/50 hover:text-white md:hidden"
            >
                <X size={24} />
            </button>

            {/* Top: Logo */}
            <div className={`px-6 mb-12 flex items-center gap-4 whitespace-nowrap opacity-100 mt-8 md:mt-0 transition-all duration-300
               ${mobileOpen ? 'opacity-100' : 'opacity-100 md:opacity-100'}
            `}>
                <div className="w-8 h-8 rounded-lg bg-admin-gold flex-shrink-0 flex items-center justify-center text-admin-forest font-serif font-bold italic">
                    S
                </div>
                {/* Text Logic: Visible on Mobile, or on Hover Desktop */}
                <span className={`font-serif text-lg tracking-wide transition-all duration-300 transform
                   ${mobileOpen
                        ? 'opacity-100 translate-x-0'
                        : 'opacity-0 translate-x-4 md:group-hover:opacity-100 md:group-hover:translate-x-0'
                    }
                `}>
                    Stayin<span className="italic">UBUD</span>
                </span>
            </div>

            {/* Center: Nav */}
            <nav className="flex-1 px-4 space-y-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileOpen?.(false)}
                            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 whitespace-nowrap
                              ${isActive
                                    ? 'bg-white/10 text-white'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }
                            `}
                        >
                            <Icon size={20} strokeWidth={1.5} className="flex-shrink-0 relative z-10" />
                            <span
                                className={`font-sans text-sm font-medium tracking-wide transition-all duration-300 delay-75 transform
                                ${mobileOpen
                                        ? 'opacity-100 translate-x-0'
                                        : 'opacity-0 translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0'
                                    }
                              `}
                            >
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute left-0 w-1 h-8 bg-admin-gold rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom: User & Settings */}
            <div className="px-4 space-y-4">
                {/* Settings */}
                <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-4 px-3 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all duration-300 whitespace-nowrap"
                >
                    <Settings size={20} strokeWidth={1.5} className="flex-shrink-0" />
                    <span
                        className={`font-sans text-sm font-medium tracking-wide transition-opacity duration-300 delay-75
                        ${mobileOpen
                                ? 'opacity-100'
                                : 'opacity-0 md:group-hover:opacity-100'
                            }
                      `}
                    >
                        Settings
                    </span>
                </Link>

                <div className="h-px w-full bg-white/10" />

                {/* User Profile */}
                <div className="flex items-center gap-3 px-2 pt-2 cursor-pointer group/profile">
                    <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-admin-sand flex items-center justify-center text-admin-forest font-bold text-xs ring-2 ring-transparent group-hover/profile:ring-admin-gold transition-all">
                            JD
                        </div>
                        <div className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-admin-forest" />
                    </div>
                    <div
                        className={`transition-opacity duration-300 delay-100 whitespace-nowrap overflow-hidden
                        ${mobileOpen
                                ? 'opacity-100'
                                : 'opacity-0 md:group-hover:opacity-100'
                            }
                      `}
                    >
                        <p className="text-xs font-bold text-white">John Doe</p>
                        <p className="text-[10px] text-white/50">Admin</p>
                    </div>
                </div>
            </div>

        </aside>
    );
};
