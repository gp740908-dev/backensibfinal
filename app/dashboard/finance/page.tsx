'use client';

import React from 'react';
import { Download, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

export default function FinancePage() {
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
                <button className="btn-outline">
                    <Download size={16} /> Export Q1 Report
                </button>
            </header>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-2 glass-panel p-8 rounded-3xl bg-admin-forest text-admin-surface relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-8 opacity-10">
                        <DollarSign size={100} />
                    </div>
                    <span className="block font-mono text-xs uppercase tracking-widest opacity-60 mb-2">Net Income (YTD)</span>
                    <h2 className="text-5xl md:text-6xl font-serif mb-4">425.8 <span className="text-2xl opacity-50">M</span></h2>
                    <div className="flex items-center gap-2 text-sm text-green-400">
                        <TrendingUp size={16} /> +24% vs last year
                    </div>
                </div>

                <div className="md:col-span-1 glass-panel p-8 rounded-3xl flex flex-col justify-center">
                    <span className="block font-mono text-xs uppercase tracking-widest opacity-60 mb-2 text-admin-forest">Expenses</span>
                    <h3 className="text-3xl font-serif text-admin-forest mb-2">85.4 <span className="text-lg opacity-50">M</span></h3>
                    <div className="flex items-center gap-2 text-xs text-red-500 font-bold uppercase tracking-wide">
                        <TrendingDown size={14} /> +5% (Maintenance)
                    </div>
                </div>

                <div className="md:col-span-1 glass-panel p-8 rounded-3xl flex flex-col justify-center">
                    <span className="block font-mono text-xs uppercase tracking-widest opacity-60 mb-2 text-admin-forest">Projected (Q2)</span>
                    <h3 className="text-3xl font-serif text-admin-forest mb-2">610.0 <span className="text-lg opacity-50">M</span></h3>
                    <div className="flex items-center gap-2 text-xs text-admin-success font-bold uppercase tracking-wide">
                        <TrendingUp size={14} /> High Season
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Chart */}
                <div className="lg:col-span-2 glass-panel p-8 rounded-3xl">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-serif text-2xl text-admin-forest">Cash Flow</h3>
                        <div className="flex gap-2">
                            {['1M', '3M', '6M', '1Y'].map(range => (
                                <button key={range} className="px-3 py-1 text-xs font-mono rounded-lg hover:bg-admin-forest/5 text-admin-forest/60 hover:text-admin-forest transition-colors">
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Simple Chart Mock */}
                    <div className="h-64 w-full flex items-end justify-between gap-2 px-4 border-b border-l border-admin-forest/10">
                        {[30, 45, 35, 60, 50, 75, 65, 90, 85, 95, 80, 100].map((val, i) => (
                            <div key={i} className="w-full bg-admin-forest hover:bg-admin-gold transition-colors rounded-t-sm relative group" style={{ height: `${val}%` }}>
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-admin-forest text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {val}M
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-xs font-mono text-admin-forest/40 uppercase">
                        <span>Jan</span><span>Dec</span>
                    </div>
                </div>

                {/* Breakdown */}
                <div className="lg:col-span-1 glass-panel p-8 rounded-3xl">
                    <h3 className="font-serif text-2xl text-admin-forest mb-8">Expenses</h3>

                    <div className="space-y-6">
                        {[
                            { label: 'Maintenance', val: 35, color: 'bg-admin-forest' },
                            { label: 'Staff Salaries', val: 25, color: 'bg-admin-gold' },
                            { label: 'Utilities', val: 15, color: 'bg-gray-400' },
                            { label: 'Marketing', val: 10, color: 'bg-gray-300' },
                            { label: 'Waitlist', val: 15, color: 'bg-gray-200' },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-bold text-admin-forest mb-2">
                                    <span>{item.label}</span>
                                    <span>{item.val}%</span>
                                </div>
                                <div className="w-full h-2 bg-admin-forest/5 rounded-full overflow-hidden">
                                    <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.val}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="w-full mt-8 py-3 bg-admin-forest/5 rounded-xl text-xs font-bold text-admin-forest hover:bg-admin-forest/10 transition-colors">
                        View Detailed Ledger
                    </button>
                </div>

            </div>

        </div>
    );
}
