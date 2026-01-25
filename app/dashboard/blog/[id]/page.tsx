'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2, Trash2, AlertCircle } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';
import { BlogEditor } from '../../../../components/blog/BlogEditor';

export default function EditJournalPostPage() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;
    const { success, error: toastError } = useToast();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [post, setPost] = useState<any>(null);

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

            const fetchedPost = validateResult(data, fetchError, 'loading post');
            setPost(fetchedPost);

        } catch (err: any) {
            setError(handleSupabaseError(err, 'loading post'));
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (postData: any) => {
        setSaving(true);
        setError(null);

        try {
            const payload = {
                title: postData.title,
                slug: postData.slug,
                excerpt: postData.excerpt,
                content: postData.content,
                category: postData.category,
                author: postData.author,
                image_url: postData.image_url,
                published_at: postData.published_at
            };

            const { data, error: updateError } = await supabase
                .from('journal_posts')
                .update(payload)
                .eq('id', postId)
                .select();

            validateResult(data, updateError, 'updating post');

            success('Post Updated', `"${postData.title}" saved successfully`);
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
            success('Post Deleted', `"${post?.title}" has been removed`);
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

    if (error && !post) {
        return (
            <div className="flex flex-col items-center justify-center h-96 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-red-600 mb-4">{error}</p>
                <Link href="/dashboard/blog" className="btn-primary">Back to Journal</Link>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto">
            <header className="mb-4 flex justify-between items-start">
                <Link href="/dashboard/blog" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-xs uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Journal
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="btn-outline text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 text-xs px-3 py-1"
                >
                    {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                    Delete Post
                </button>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <BlogEditor
                initialData={post}
                onSave={handleSave}
                saving={saving}
            />
        </div>
    );
}
