'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';

export default function EditJournalPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;
    const { success, error: toastError } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: 'Travel',
        author: 'StayinUBUD',
        image_url: '',
        published_at: ''
    });

    useEffect(() => {
        fetchPost();
    }, [postId]);

    async function fetchPost() {
        setLoading(true);
        try {
            const { data, error: fetchError } = await supabase
                .from('journal_posts')
                .select('*')
                .eq('id', postId)
                .single();

            const post = validateResult(data, fetchError, 'loading post');

            setForm({
                title: post.title || '',
                slug: post.slug || '',
                excerpt: post.excerpt || '',
                content: post.content || '',
                category: post.category || 'Travel',
                author: post.author || '',
                image_url: post.image_url || '',
                published_at: post.published_at || ''
            });
        } catch (err: any) {
            setError(handleSupabaseError(err, 'loading post'));
        } finally {
            setLoading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Only auto-generate slug on edit if it's empty, otherwise keep existing
        const title = e.target.value;
        setForm(prev => ({ ...prev, title }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            const payload = {
                title: form.title,
                slug: form.slug,
                excerpt: form.excerpt,
                content: form.content,
                category: form.category,
                author: form.author,
                image_url: form.image_url,
                published_at: form.published_at
            };

            const { data, error: updateError } = await supabase
                .from('journal_posts')
                .update(payload)
                .eq('id', postId)
                .select();

            validateResult(data, updateError, 'updating post');

            success('Post Updated', `"${form.title}" saved successfully`);
            router.push('/dashboard/blog');
        } catch (err: any) {
            const msg = handleSupabaseError(err, 'updating post');
            setError(msg);
            toastError('Update Failed', msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
        setDeleting(true);
        try {
            const { error: deleteError } = await supabase.from('journal_posts').delete().eq('id', postId);
            if (deleteError) throw deleteError;
            success('Post Deleted', `"${form.title}" has been removed`);
            router.push('/dashboard/blog');
        } catch (err: any) {
            const msg = handleSupabaseError(err, 'deleting post');
            setError(msg);
            toastError('Delete Failed', msg);
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-admin-forest/50" />
            </div>
        );
    }

    if (error && !form.title) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Link href="/dashboard/blog" className="btn-primary">Back to Journal</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <header className="mb-8 flex justify-between items-start">
                <div>
                    <Link href="/dashboard/blog" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-sm">
                        <ArrowLeft size={16} /> Back to Journal
                    </Link>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">Edit: {form.title}</h1>
                </div>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-outline text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                >
                    {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    Delete
                </button>
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
                    />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-admin-forest/10">
                    <Link href="/dashboard/blog" className="btn-outline">Cancel</Link>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : <><Save size={16} /> Save Changes</>}
                    </button>
                </div>

            </form>
        </div>
    );
}
