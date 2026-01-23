'use client';

import React, { useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // Using next/navigation for App Router
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Lock } from 'lucide-react';

import { createClient } from '../utils/supabase/client';

export default function LoginPage() {
    const container = useRef<HTMLDivElement>(null);
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    // ... GSAP ...

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Transition Out
            gsap.to('.login-split-left', { width: '100%', duration: 1, ease: 'power4.inOut' });
            gsap.to('.login-split-right', { xPercent: 100, opacity: 0, duration: 0.8, ease: 'power2.in' });

            setTimeout(() => {
                router.refresh(); // Refresh to update middleware state
                router.push('/dashboard');
            }, 800);

        } catch (err: any) {
            setError(err.message || 'Login failed');
            setLoading(false);

            // Shake animation for error
            gsap.fromTo('.form-element', { x: -10 }, { x: 10, duration: 0.1, repeat: 5, yoyo: true });
        }
    };

    return (
        <div ref={container} className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden bg-admin-bg">

            {/* LEFT: Brand Experience */}
            <div className="login-split-left w-full h-[40vh] md:h-auto md:w-[45%] bg-admin-forest relative flex flex-col justify-between p-8 md:p-12 text-admin-surface z-10 shrink-0">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"></div>
                <div className="relative z-10 brand-reveal">
                    <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-60">Internal System</span>
                </div>

                <div className="relative z-10 mt-8 md:mt-0">
                    <h1 className="brand-reveal font-serif text-5xl md:text-8xl leading-none mb-4 md:mb-6">
                        Stayin<br />
                        <span className="italic text-admin-gold">UBUD</span>
                    </h1>
                    <p className="brand-reveal font-sans text-xs md:text-sm opacity-60 max-w-md leading-relaxed tracking-wide hidden md:block">
                        Access to the sanctuary mainframes. Authorized personnel only.
                    </p>
                </div>

                <div className="relative z-10 brand-reveal hidden md:block">
                    <span className="font-mono text-[10px] opacity-40">SYS.VER.2.0.4</span>
                </div>
            </div>

            {/* RIGHT: Login Interface */}
            <div className="login-split-right w-full md:w-[55%] bg-admin-bg flex flex-col justify-center items-center p-8 md:p-12 relative flex-1">
                <div className="w-full max-w-sm">

                    <div className="mb-8 md:mb-12 form-element">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-admin-forest/5 rounded-full flex items-center justify-center mb-4 md:mb-6">
                            <Lock size={18} className="text-admin-forest" />
                        </div>
                        <h2 className="font-serif text-2xl md:text-3xl text-admin-forest mb-2">Authenticate</h2>
                        <p className="text-admin-forest/50 text-xs md:text-sm">Enter your credentials to proceed.</p>
                        {error && (
                            <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-200">
                                {error}
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 md:space-y-8">
                        <div className="form-element group">
                            <label className="block font-mono text-[10px] md:text-xs uppercase tracking-widest text-admin-forest/60 mb-2 group-focus-within:text-admin-forest transition-colors">
                                ID / Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field py-2 md:py-3 text-sm md:text-base"
                                placeholder="admin@stayinubud.com"
                                required
                            />
                        </div>

                        <div className="form-element group">
                            <label className="block font-mono text-[10px] md:text-xs uppercase tracking-widest text-admin-forest/60 mb-2 group-focus-within:text-admin-forest transition-colors">
                                Security Key
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field py-2 md:py-3 text-sm md:text-base"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="form-element pt-4 md:pt-8">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full justify-center group text-sm md:text-base py-3 md:py-4"
                            >
                                {loading ? 'Verifying...' : 'Access Dashboard'}
                                {!loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </div>
                    </form>

                    <div className="form-element mt-8 md:mt-12 text-center">
                        <a href="#" className="font-mono text-[10px] md:text-xs text-admin-forest/40 hover:text-admin-forest transition-colors border-b border-transparent hover:border-admin-forest/20 pb-1">
                            Lost access credentials?
                        </a>
                    </div>

                </div>
            </div>

        </div>
    );
}
