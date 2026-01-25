'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../../../lib/supabase';
import { useToast } from '../../../../components/Toast';
import { handleSupabaseError, validateResult } from '../../../../lib/errorHandler';
import { BlogEditor } from '../../../../components/blog/BlogEditor';

export default function NewJournalPostPage() {
    const router = useRouter();
    const { success, error: toastError } = useToast();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async (postData: any) => {
        setSaving(true);
        setError(null);

        try {
            const { data, error: insertError } = await supabase.from('journal_posts').insert([{
                title: postData.title,
                slug: postData.slug,
                excerpt: postData.excerpt,
                content: postData.content,
                category: postData.category,
                author: postData.author,
                image_url: postData.image_url,
                published_at: postData.published_at
            }]).select();

            validateResult(data, insertError, 'creating post');

            success('Post Created', `"${postData.title}" published successfully`);
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
        <div className="max-w-[1600px] mx-auto">
            <header className="mb-4">
                <Link href="/dashboard/blog" className="flex items-center gap-2 text-admin-forest/60 hover:text-admin-forest mb-4 text-xs uppercase tracking-widest">
                    <ArrowLeft size={16} /> Back to Journal
                </Link>
            </header>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                </div>
            )}

            <BlogEditor
                onSave={handleSave}
                saving={saving}
            />
        </div>
    );
}
