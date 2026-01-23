'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Edit3, Trash2, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { BlogPost } from '../../../lib/types';

export default function BlogPage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    async function fetchPosts() {
        setLoading(true);
        setError(null);
        try {
            const { data, error: fetchError } = await supabase
                .from('blog_posts')
                .select('*')
                .order('created_at', { ascending: false });

            if (fetchError) {
                // Table might not exist yet - show mock/empty state
                if (fetchError.code === '42P01') {
                    setError('Blog posts table does not exist. Please run migration.');
                } else {
                    throw fetchError;
                }
            } else {
                setPosts(data || []);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to load posts');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: string, title: string) {
        if (!confirm(`Delete "${title}"?`)) return;
        setDeleting(id);
        try {
            const { error: deleteError } = await supabase.from('blog_posts').delete().eq('id', id);
            if (deleteError) throw deleteError;
            setPosts(prev => prev.filter(p => p.id !== id));
        } catch (err: any) {
            alert(`Failed to delete: ${err.message}`);
        } finally {
            setDeleting(null);
        }
    }

    async function togglePublish(id: string, currentStatus: boolean) {
        try {
            const { error: updateError } = await supabase
                .from('blog_posts')
                .update({ is_published: !currentStatus })
                .eq('id', id);
            if (updateError) throw updateError;
            setPosts(prev => prev.map(p => p.id === id ? { ...p, is_published: !currentStatus } : p));
        } catch (err: any) {
            alert(`Failed to update: ${err.message}`);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 size={32} className="animate-spin text-admin-forest/50" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle size={48} className="text-yellow-500 mb-4" />
                <p className="text-yellow-700 mb-4">{error}</p>
                <p className="text-sm text-admin-forest/60 mb-4">
                    You need to create the `blog_posts` table in Supabase to use this feature.
                </p>
                <button onClick={fetchPosts} className="btn-outline">Retry</button>
            </div>
        );
    }

    return (
        <div className="space-y-8">

            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <span className="font-mono text-xs uppercase tracking-widest text-admin-forest/50 block mb-2">Content</span>
                    <h1 className="font-serif text-3xl md:text-4xl text-admin-forest">
                        Blog Posts ({posts.length})
                    </h1>
                </div>

                <Link href="/dashboard/blog/new" className="btn-primary group">
                    <Plus size={18} />
                    <span>New Post</span>
                </Link>
            </header>

            {/* Table */}
            <div className="glass-panel rounded-3xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead className="bg-admin-forest/5 text-xs font-mono uppercase tracking-widest text-admin-forest/50">
                            <tr>
                                <th className="py-4 pl-8">Title</th>
                                <th className="py-4">Category</th>
                                <th className="py-4">Author</th>
                                <th className="py-4">Status</th>
                                <th className="py-4 text-center pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-forest/5 text-sm">
                            {posts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-admin-forest/40">
                                        No blog posts yet. Create your first post!
                                    </td>
                                </tr>
                            ) : (
                                posts.map(post => (
                                    <tr key={post.id} className="group hover:bg-white/50 transition-colors">
                                        <td className="py-5 pl-8">
                                            <div>
                                                <p className="font-serif font-medium text-lg">{post.title}</p>
                                                <p className="text-xs text-admin-forest/50 font-mono">/{post.slug}</p>
                                            </div>
                                        </td>
                                        <td className="py-5">
                                            <span className="px-2 py-1 bg-admin-sand rounded text-xs">{post.category}</span>
                                        </td>
                                        <td className="py-5 text-admin-forest/70">{post.author}</td>
                                        <td className="py-5">
                                            <button
                                                onClick={() => togglePublish(post.id, !!post.is_published)}
                                                className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border flex items-center gap-1
                          ${post.is_published
                                                        ? 'bg-green-50 text-green-700 border-green-200'
                                                        : 'bg-gray-50 text-gray-500 border-gray-200'}
                        `}
                                            >
                                                {post.is_published ? <><Eye size={12} /> Published</> : <><EyeOff size={12} /> Draft</>}
                                            </button>
                                        </td>
                                        <td className="py-5 pr-8">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    href={`/dashboard/blog/${post.id}`}
                                                    className="p-2 bg-admin-forest/5 text-admin-forest rounded-lg hover:bg-admin-forest/10 transition-colors"
                                                >
                                                    <Edit3 size={14} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                    disabled={deleting === post.id}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                                >
                                                    {deleting === post.id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
