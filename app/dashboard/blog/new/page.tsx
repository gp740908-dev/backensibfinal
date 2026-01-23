'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';

export default function NewJournalPostPage() {
    const router = useRouter();
    const { success, error: toastError } = useToast();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Travel',
        author: 'StayinUBUD',
        image_url: '',
        published_at: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setForm(prev => ({ ...prev, title, slug: generateSlug(title) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const { data, error: insertError } = await supabase.from('journal_posts').insert([{
                title: form.title,
                slug: form.slug,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                image_url: form.image_url,
                published_at: form.published_at
            }]).select();

            validateResult(data, insertError, 'creating post');

            success('Post Created', `"${form.title}" published successfully`);
            router.push('/dashboard/blog');
        } catch (err: any) {
            const msg = handleSupabaseError(err, 'creating post');
            setError(msg);
            toastError('Creation Failed', msg);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8">
                <Link href="/dashboard/blog" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-sm">
                    <ArrowLeft size={16} /> Back to Journal
                </Link>
                <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">New Journal Post</h1>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleTitleChange}
                            className="input-field border-b text-xl font-serif"
                            placeholder="Post title..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Slug *</label>
                        <input
                            type="text"
                            name="slug"
                            value={form.slug}
                            onChange={handleChange}
                            className="input-field border-b"
                            placeholder="url-friendly-slug"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Category *</label>
                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            className="input-field border-b"
                            required
                        >
                            <option>Travel</option>
                            <option>Culture</option>
                            <option>Wellness</option>
                            <option>Food</option>
                            <option>Design</option>
                            <option>Guide</option>
                        </select>
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Author *</label>
                        <input
                            type="text"
                            name="author"
                            value={form.author}
                            onChange={handleChange}
                            className="input-field border-b"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Image URL *</label>
                        <input
                            type="url"
                            name="image_url"
                            value={form.image_url}
                            onChange={handleChange}
                            className="input-field border-b"
                            placeholder="https://..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Published At *</label>
                        <input
                            type="text"
                            name="published_at"
                            value={form.published_at}
                            onChange={handleChange}
                            className="input-field border-b"
                            placeholder="January 23, 2024"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Excerpt *</label>
                    <textarea
                        name="excerpt"
                        value={form.excerpt}
                        onChange={handleChange}
                        className="input-field border rounded-xl min-h-[80px] p-4"
                        placeholder="Brief summary for listing pages..."
                        required
                    />
                </div>

                <div>
                    <label className="block font-mono text-xs uppercase tracking-widest text-admin-forest/60 mb-2">Content</label>
                    <textarea
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        className="input-field border rounded-xl min-h-[300px] p-4 font-mono text-sm"
                        placeholder="Write your article content here..."
                    />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-admin-forest/10">
                    <Link href="/dashboard/blog" className="btn-outline">Cancel</Link>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Create Post</>}
                    </button>
                </div>

            </form>
        </div>
    );
}
