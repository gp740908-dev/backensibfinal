'use client';

import React, { useState } from 'react';
import { User, Mail, Lock, Save, Loader2, Check } from 'lucide-react';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@stayinubud.com',
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        // Mock save
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.new !== password.confirm) {
            alert('New passwords do not match');
            return;
        }
        setSaving(true);
        // Mock save
        await new Promise(r => setTimeout(r, 1000));
        setSaving(false);
        setPassword({ current: '', new: '', confirm: '' });
        alert('Password updated successfully');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">

            {/* Header */}
            <header>
                <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Account</span>
                <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Settings</h1>
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
                                className="input-field border-b flex-1"
                                disabled
                            />
                        </div>
                        <p className="text-xs text-admin-forest/50 mt-2">Email cannot be changed from here. Contact support.</p>
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
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Current Password</label>
                        <input
                            type="password"
                            name="current"
                            value={password.current}
                            onChange={handlePasswordChange}
                            className="input-field border-b"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">New Password</label>
                        <input
                            type="password"
                            name="new"
                            value={password.new}
                            onChange={handlePasswordChange}
                            className="input-field border-b"
                            placeholder="••••••••"
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
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-8">
                    <button type="submit" disabled={saving || !password.current || !password.new} className="btn-outline">
                        Update Password
                    </button>
                </div>
            </form>

            {/* Danger Zone */}
            <div className="glass-panel rounded-3xl p-8 border border-red-200">
                <h2 className="font-serif text-xl text-red-600 mb-4">Danger Zone</h2>
                <p className="text-sm text-admin-forest/70 mb-4">
                    Permanently delete your account and all associated data. This action cannot be undone.
                </p>
                <button className="btn-outline text-red-600 border-red-300 hover:bg-red-50">
                    Delete Account
                </button>
            </div>

        </div>
    );
}
