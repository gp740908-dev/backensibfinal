'use client';

import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Save, Loader2, Check, LogOut, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { useToast } from '../../../components/Toast';
import { handleSupabaseError } from '../../../lib/errorHandler';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const { success, error: toastError } = useToast();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
    });

    const [password, setPassword] = useState({
        new: '',
        confirm: ''
    });

    useEffect(() => {
        fetchUser();
    }, []);

    async function fetchUser() {
        setLoading(true);
        try {
            const { data: { user }, error } = await supabase.auth.getUser();
            if (error) throw error;

            if (user) {
                setUser(user);
                setProfile({
                    email: user.email || '',
                    name: user.user_metadata?.full_name || ''
                });
            }
        } catch (err: any) {
            toastError('Error', 'Failed to load user profile');
        } finally {
            setLoading(false);
        }
    }

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                data: { full_name: profile.name }
            });

            if (error) throw error;

            setSaved(true);
            success('Profile Updated', 'Your information has been saved.');
            setTimeout(() => setSaved(false), 2000);
        } catch (err: any) {
            toastError('Update Failed', handleSupabaseError(err, 'updating profile'));
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.new !== password.confirm) {
            toastError('Validation Error', 'New passwords do not match');
            return;
        }

        if (password.new.length < 6) {
            toastError('Validation Error', 'Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: password.new
            });

            if (error) throw error;

            success('Password Updated', 'Your password has been changed successfully.');
            setPassword({ new: '', confirm: '' });
        } catch (err: any) {
            toastError('Update Failed', handleSupabaseError(err, 'updating password'));
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-admin-forest/50" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-8">

            {/* Header */}
            <header className="flex justify-between items-end">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Account</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Settings</h1>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-xs font-bold uppercase tracking-wider"
                >
                    <LogOut size={14} /> Sign Out
                </button>
            </header>

            {/* Profile Section */}
            <form onSubmit={handleSaveProfile} className="glass-panel rounded-3xl p-8">
                <h2 className="font-serif text-xl text-admin-forest mb-6 flex items-center gap-2">
                    <User size={20} /> Profile Information
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Display Name</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleProfileChange}
                            className="input-field border-b"
                            placeholder="Your Name"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Email Address</label>
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-admin-forest/40" />
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleProfileChange}
                                className="input-field border-b flex-1 opacity-60 cursor-not-allowed"
                                disabled
                                title="Email cannot be changed"
                            />
                        </div>
                        <p className="text-xs text-admin-forest/50 mt-2">To change your email, please contact a system administrator.</p>
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>
            </form>

            {/* Password Section */}
            <form onSubmit={handleChangePassword} className="glass-panel rounded-3xl p-8">
                <h2 className="font-serif text-xl text-admin-forest mb-6 flex items-center gap-2">
                    <Lock size={20} /> Change Password
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">New Password</label>
                        <input
                            type="password"
                            name="new"
                            value={password.new}
                            onChange={handlePasswordChange}
                            className="input-field border-b"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Confirm New Password</label>
                        <input
                            type="password"
                            name="confirm"
                            value={password.confirm}
                            onChange={handlePasswordChange}
                            className="input-field border-b"
                            placeholder="••••••••"
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button type="submit" disabled={saving || !password.new} className="btn-outline">
                        {saving ? <Loader2 size={16} className="animate-spin" /> : 'Update Password'}
                    </button>
                </div>
            </form>

            {/* Danger Zone */}
            <div className="glass-panel rounded-3xl p-8 border border-red-200 bg-red-50/30">
                <h2 className="font-serif text-xl text-red-600 mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} /> Danger Zone
                </h2>
                <p className="text-sm text-admin-forest/70 mb-4">
                    Deleting your account requires administrative priviledges. Please contact super admin support to process this request permanently.
                </p>
                <button type="button" disabled className="btn-outline text-red-400 border-red-200 cursor-not-allowed opacity-60">
                    Delete Account
                </button>
            </div>

        </div>
    );
}
