'use client';

import React, { useState, KeyboardEvent } from 'react';
import { Plus, X, Clock, Ban, Dog, Cigarette, PartyPopper, Users } from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────

export interface HouseRules {
    check_in: string;
    check_out: string;
    quiet_hours: string;
    parties: boolean;
    smoking: boolean;
    pets: boolean;
    max_guests: number;
}

export interface ProximityItem {
    name: string;
    distance: string;
}

export interface SleepingItem {
    room: string;
    bed: string;
    view: string;
}

export type AmenitiesDetail = Record<string, string[]>;

// ─── Default Values ─────────────────────────────────────────────────────

export const DEFAULT_HOUSE_RULES: HouseRules = {
    check_in: '14:00',
    check_out: '11:00',
    quiet_hours: '22:00 - 07:00',
    parties: false,
    smoking: false,
    pets: false,
    max_guests: 4
};

const DEFAULT_AMENITY_CATEGORIES = ['Bathroom', 'Bedroom', 'Entertainment', 'Kitchen', 'Outdoor'];

const FEATURE_PRESETS = [
    'Private Pool', 'Rice Field View', 'WiFi', 'AC', 'Kitchen',
    'Jungle View', 'Garden', 'Parking', 'BBQ Area', 'Bathtub',
    'Breakfast Included', '24/7 Service', 'Laundry', 'Yoga Deck'
];

// ─── Shared Styles ──────────────────────────────────────────────────────

const label = 'block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2';
const inputBase = 'w-full px-3 py-2.5 rounded-lg bg-white border border-admin-forest/10 focus:outline-none focus:border-admin-forest/30 font-mono text-sm text-admin-forest transition-colors';
const toggleBase = 'relative inline-flex items-center h-6 w-11 rounded-full cursor-pointer transition-colors duration-200';
const toggleDot = 'inline-block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200';
const addBtn = 'flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-admin-forest/60 hover:text-admin-forest transition-colors py-2';
const removeBtn = 'p-1 text-admin-forest/30 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors';

// ─── 1. HOUSE RULES EDITOR ─────────────────────────────────────────────

interface HouseRulesEditorProps {
    value: HouseRules;
    onChange: (rules: HouseRules) => void;
}

export const HouseRulesEditor: React.FC<HouseRulesEditorProps> = ({ value, onChange }) => {
    const update = (key: keyof HouseRules, val: any) => {
        onChange({ ...value, [key]: val });
    };

    const Toggle = ({ checked, onToggle, label: lbl, icon: Icon }: { checked: boolean; onToggle: () => void; label: string; icon: React.ElementType }) => (
        <button type="button" onClick={onToggle} className="flex items-center justify-between p-4 rounded-xl border border-admin-forest/10 hover:border-admin-forest/20 transition-colors bg-white group">
            <div className="flex items-center gap-3">
                <Icon size={18} className={checked ? 'text-green-600' : 'text-admin-forest/30'} />
                <span className="text-sm font-medium text-admin-forest">{lbl}</span>
            </div>
            <div className={`${toggleBase} ${checked ? 'bg-green-500' : 'bg-admin-forest/15'}`}>
                <span className={`${toggleDot} ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
            </div>
        </button>
    );

    return (
        <div className="space-y-6">
            <h3 className="font-serif text-xl text-admin-forest">House Rules</h3>

            {/* Times */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className={label}><Clock size={12} className="inline mr-1.5" />Check-in Time</label>
                    <input
                        type="time"
                        value={value.check_in}
                        onChange={(e) => update('check_in', e.target.value)}
                        className={inputBase}
                    />
                </div>
                <div>
                    <label className={label}><Clock size={12} className="inline mr-1.5" />Check-out Time</label>
                    <input
                        type="time"
                        value={value.check_out}
                        onChange={(e) => update('check_out', e.target.value)}
                        className={inputBase}
                    />
                </div>
                <div>
                    <label className={label}>Quiet Hours</label>
                    <input
                        type="text"
                        value={value.quiet_hours}
                        onChange={(e) => update('quiet_hours', e.target.value)}
                        placeholder="e.g. 22:00 - 07:00"
                        className={inputBase}
                    />
                </div>
            </div>

            {/* Max Guests */}
            <div className="max-w-xs">
                <label className={label}><Users size={12} className="inline mr-1.5" />Max Guests</label>
                <input
                    type="number"
                    value={value.max_guests}
                    onChange={(e) => update('max_guests', parseInt(e.target.value) || 1)}
                    min={1}
                    className={inputBase}
                />
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Toggle checked={value.pets} onToggle={() => update('pets', !value.pets)} label="Pets Allowed" icon={Dog} />
                <Toggle checked={value.smoking} onToggle={() => update('smoking', !value.smoking)} label="Smoking Allowed" icon={Cigarette} />
                <Toggle checked={value.parties} onToggle={() => update('parties', !value.parties)} label="Parties Allowed" icon={PartyPopper} />
            </div>
        </div>
    );
};

// ─── 2. AMENITIES EDITOR ────────────────────────────────────────────────

interface AmenitiesEditorProps {
    value: AmenitiesDetail;
    onChange: (amenities: AmenitiesDetail) => void;
}

export const AmenitiesEditor: React.FC<AmenitiesEditorProps> = ({ value, onChange }) => {
    const [newItems, setNewItems] = useState<Record<string, string>>({});

    const addItem = (category: string) => {
        const item = (newItems[category] || '').trim();
        if (!item) return;
        const current = value[category] || [];
        if (current.includes(item)) return;
        onChange({ ...value, [category]: [...current, item] });
        setNewItems(prev => ({ ...prev, [category]: '' }));
    };

    const removeItem = (category: string, idx: number) => {
        const current = [...(value[category] || [])];
        current.splice(idx, 1);
        if (current.length === 0) {
            const next = { ...value };
            delete next[category];
            onChange(next);
        } else {
            onChange({ ...value, [category]: current });
        }
    };

    const [newCategory, setNewCategory] = useState('');
    const addCategory = () => {
        const cat = newCategory.trim();
        if (!cat || value[cat]) return;
        onChange({ ...value, [cat]: [] });
        setNewCategory('');
    };

    const categories = [...new Set([...DEFAULT_AMENITY_CATEGORIES, ...Object.keys(value)])];

    return (
        <div className="space-y-6">
            <h3 className="font-serif text-xl text-admin-forest">Amenities Detail</h3>

            <div className="space-y-5">
                {categories.filter(cat => value[cat] !== undefined || DEFAULT_AMENITY_CATEGORIES.includes(cat)).map(category => (
                    <div key={category} className="p-4 rounded-xl border border-admin-forest/10 bg-white">
                        <h4 className="font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-3">{category}</h4>

                        {/* Items */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {(value[category] || []).map((item, idx) => (
                                <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-admin-forest/5 text-admin-forest text-xs font-medium rounded-full">
                                    {item}
                                    <button type="button" onClick={() => removeItem(category, idx)} className="hover:text-red-500 transition-colors">
                                        <X size={12} />
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Add Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newItems[category] || ''}
                                onChange={(e) => setNewItems(prev => ({ ...prev, [category]: e.target.value }))}
                                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem(category); } }}
                                placeholder={`Add ${category.toLowerCase()} item...`}
                                className={`${inputBase} flex-1`}
                            />
                            <button type="button" onClick={() => addItem(category)} className="px-3 py-2 bg-admin-forest/5 hover:bg-admin-forest/10 rounded-lg transition-colors">
                                <Plus size={16} className="text-admin-forest" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Category */}
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    <label className={label}>Add Custom Category</label>
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCategory(); } }}
                        placeholder="e.g. Family, Safety..."
                        className={inputBase}
                    />
                </div>
                <button type="button" onClick={addCategory} className="px-4 py-2.5 bg-admin-forest/5 hover:bg-admin-forest/10 rounded-lg transition-colors text-xs font-bold uppercase tracking-wider text-admin-forest">
                    Add
                </button>
            </div>
        </div>
    );
};

// ─── 3. PROXIMITY EDITOR ────────────────────────────────────────────────

interface ProximityEditorProps {
    value: ProximityItem[];
    onChange: (list: ProximityItem[]) => void;
}

export const ProximityEditor: React.FC<ProximityEditorProps> = ({ value, onChange }) => {
    const addItem = () => {
        onChange([...value, { name: '', distance: '' }]);
    };

    const updateItem = (idx: number, key: keyof ProximityItem, val: string) => {
        const updated = [...value];
        updated[idx] = { ...updated[idx], [key]: val };
        onChange(updated);
    };

    const removeItem = (idx: number) => {
        onChange(value.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-4">
            <h3 className="font-serif text-xl text-admin-forest">Nearby Places</h3>

            {value.map((item, idx) => (
                <div key={idx} className="flex gap-3 items-center p-3 rounded-xl border border-admin-forest/10 bg-white">
                    <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(idx, 'name', e.target.value)}
                        placeholder="Place name"
                        className={`${inputBase} flex-1`}
                    />
                    <input
                        type="text"
                        value={item.distance}
                        onChange={(e) => updateItem(idx, 'distance', e.target.value)}
                        placeholder="e.g. 15 min drive"
                        className={`${inputBase} w-40`}
                    />
                    <button type="button" onClick={() => removeItem(idx)} className={removeBtn}>
                        <X size={16} />
                    </button>
                </div>
            ))}

            <button type="button" onClick={addItem} className={addBtn}>
                <Plus size={14} /> Add Place
            </button>
        </div>
    );
};

// ─── 4. SLEEPING ARRANGEMENTS EDITOR ────────────────────────────────────

interface SleepingEditorProps {
    value: SleepingItem[];
    onChange: (list: SleepingItem[]) => void;
}

export const SleepingEditor: React.FC<SleepingEditorProps> = ({ value, onChange }) => {
    const addItem = () => {
        onChange([...value, { room: '', bed: '', view: '' }]);
    };

    const updateItem = (idx: number, key: keyof SleepingItem, val: string) => {
        const updated = [...value];
        updated[idx] = { ...updated[idx], [key]: val };
        onChange(updated);
    };

    const removeItem = (idx: number) => {
        onChange(value.filter((_, i) => i !== idx));
    };

    const bedOptions = ['1 King Bed', '1 Queen Bed', '2 Twin Beds', '1 Single Bed', '1 Sofa Bed', 'Bunk Beds'];

    return (
        <div className="space-y-4">
            <h3 className="font-serif text-xl text-admin-forest">Sleeping Arrangements</h3>

            {value.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-admin-forest/10 bg-white">
                    <div className="flex gap-3 items-start">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <label className={label}>Room Name</label>
                                <input
                                    type="text"
                                    value={item.room}
                                    onChange={(e) => updateItem(idx, 'room', e.target.value)}
                                    placeholder="e.g. Bedroom 1"
                                    className={inputBase}
                                />
                            </div>
                            <div>
                                <label className={label}>Bed Type</label>
                                <select
                                    value={item.bed}
                                    onChange={(e) => updateItem(idx, 'bed', e.target.value)}
                                    className={inputBase}
                                >
                                    <option value="">Select...</option>
                                    {bedOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={label}>View</label>
                                <input
                                    type="text"
                                    value={item.view}
                                    onChange={(e) => updateItem(idx, 'view', e.target.value)}
                                    placeholder="e.g. Jungle View"
                                    className={inputBase}
                                />
                            </div>
                        </div>
                        <button type="button" onClick={() => removeItem(idx)} className={`${removeBtn} mt-6`}>
                            <X size={16} />
                        </button>
                    </div>
                </div>
            ))}

            <button type="button" onClick={addItem} className={addBtn}>
                <Plus size={14} /> Add Room
            </button>
        </div>
    );
};

// ─── 5. FEATURES TAG INPUT ──────────────────────────────────────────────

interface FeaturesTagInputProps {
    value: string[];
    onChange: (features: string[]) => void;
}

export const FeaturesTagInput: React.FC<FeaturesTagInputProps> = ({ value, onChange }) => {
    const [input, setInput] = useState('');

    const addTag = (tag: string) => {
        const trimmed = tag.trim();
        if (!trimmed || value.includes(trimmed)) return;
        onChange([...value, trimmed]);
    };

    const removeTag = (idx: number) => {
        onChange(value.filter((_, i) => i !== idx));
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(input);
            setInput('');
        } else if (e.key === 'Backspace' && !input && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const availablePresets = FEATURE_PRESETS.filter(p => !value.includes(p));

    return (
        <div className="space-y-4">
            <label className={label}>Features</label>

            {/* Tags + Input wrapper */}
            <div className="flex flex-wrap gap-2 p-3 rounded-xl border border-admin-forest/10 bg-white min-h-[48px] focus-within:border-admin-forest/30 transition-colors">
                {value.map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-admin-forest text-white text-xs font-bold rounded-full uppercase tracking-wider">
                        {tag}
                        <button type="button" onClick={() => removeTag(idx)} className="hover:text-red-200 transition-colors">
                            <X size={12} />
                        </button>
                    </span>
                ))}
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={value.length === 0 ? 'Type a feature and press Enter...' : 'Add more...'}
                    className="flex-1 min-w-[120px] outline-none bg-transparent text-sm text-admin-forest placeholder:text-admin-forest/30"
                />
            </div>

            {/* Preset Chips */}
            {availablePresets.length > 0 && (
                <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-admin-forest/40 mb-2 block">Quick Add</span>
                    <div className="flex flex-wrap gap-1.5">
                        {availablePresets.map(preset => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => addTag(preset)}
                                className="px-3 py-1.5 text-[11px] font-medium border border-dashed border-admin-forest/20 rounded-full text-admin-forest/50 hover:border-admin-forest/40 hover:text-admin-forest hover:bg-admin-forest/5 transition-all"
                            >
                                + {preset}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
