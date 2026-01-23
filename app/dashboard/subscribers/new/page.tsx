'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';

export default function NewSubscriberPage() {
    const router = useRouter();
    const { success, error: toastError } = useToast();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { data, error: insertError } = await supabase.from('subscribers').insert([{
                email: email,
                subscribed_at: new Date().toISOString()
            }]).select();

            validateResult(data, insertError, 'creating subscriber');

            success('Subscriber Added', `"${email}" has been added successfully`);
            router.push('/dashboard/subscribers');
        } catch (err: any) {
            const msg = handleSupabaseError(err, 'creating subscriber');
            setError(msg);
            toastError('Creation Failed', msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <header className="mb-8">
                <Link href="/dashboard/subscribers" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-sm">
                    <ArrowLeft size={16} /> Back to Subscribers
                </Link>
                <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Add Subscriber</h1>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-6">
                <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Email Address *</label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="input-field border-b text-lg"
                        placeholder="user@example.com"
                        required
                    />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-admin-forest/10">
                    <Link href="/dashboard/subscribers" className="btn-outline">Cancel</Link>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Add Subscriber</>}
                    </button>
                </div>
            </form>
        </div>
    );
}
