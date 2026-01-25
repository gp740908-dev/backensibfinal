
'use client';

import React, { useState } from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Plus, Save, Loader2, Image as ImageIcon, Type, Quote, Heading } from 'lucide-react';
import { Block, BlockType } from './BlockTypes';
import { EditorBlock } from './EditorBlock';
import { SEOAnalyzer } from './SEOAnalyzer';
import { ImageUpload } from '../ImageUpload';

// Helper for UUID if uuid package not available
const generateId = () => Math.random().toString(36).substr(2, 9);

interface BlogEditorProps {
    initialData?: {
        title: string;
        slug: string;
        excerpt: string;
        category: string;
        image_url: string;
        content: string; // HTML or JSON String
        author: string;
        published_at: string;
    };
    onSave: (data: any) => Promise<void>;
    saving: boolean;
}

export const BlogEditor: React.FC<BlogEditorProps> = ({ initialData, onSave, saving }) => {
    // metadata
    const [meta, setMeta] = useState({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        category: initialData?.category || 'Travel',
        image_url: initialData?.image_url || '',
        author: initialData?.author || 'StayinUBUD Team',
        published_at: initialData?.published_at || new Date().toISOString().split('T')[0]
    });

    // Parse initial content to blocks if JSON, otherwise create one HTML block or text block
    const parseInitialBlocks = (): Block[] => {
        if (!initialData?.content) return [{ id: generateId(), type: 'paragraph', content: '' }];
        try {
            // Try parsing as JSON
            const parsed = JSON.parse(initialData.content);
            if (Array.isArray(parsed)) return parsed;
            return [{ id: generateId(), type: 'paragraph', content: initialData.content }];
        } catch (e) {
            // It's HTML string
            // For MVP, just put it in a paragraph block (user might need to clean up HTML tags manually if switching to blocks)
            // Or better, just treat as raw text.
            return [{ id: generateId(), type: 'paragraph', content: initialData.content }];
        }
    };

    const [blocks, setBlocks] = useState<Block[]>(parseInitialBlocks());
    const [activeTab, setActiveTab] = useState<'editor' | 'seo'>('editor');
    const [focusKeyword, setFocusKeyword] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBlocks((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const addBlock = (type: BlockType) => {
        setBlocks([...blocks, { id: generateId(), type, content: '' }]);
    };

    const updateBlock = (id: string, content: string, caption?: string) => {
        setBlocks(blocks.map(b => b.id === id ? { ...b, content, caption } : b));
    };

    const removeBlock = (id: string) => {
        if (blocks.length > 1) {
            setBlocks(blocks.filter(b => b.id !== id));
        }
    };

    const handleSave = () => {
        // Serialize blocks to JSON string
        const contentJSON = JSON.stringify(blocks);
        onSave({ ...meta, content: contentJSON });
    };

    // Calculate Reading Time
    const wordCount = blocks.reduce((acc, b) => acc + b.content.split(/\s+/).length, 0);
    const readingTime = Math.ceil(wordCount / 200);

    return (
        <div className="flex h-[calc(100vh-100px)] gap-6">

            {/* LEFT: Main Editor Canvas */}
            <div className={`flex-1 flex flex-col transition-all duration-300 ${activeTab === 'seo' ? 'w-2/3' : 'w-full'}`}>

                {/* Scrollable Area */}
                <div className="flex-1 overflow-y-auto pr-4 pb-20 custom-scrollbar">

                    {/* Header Image */}
                    <div className="mb-8 group relative aspect-[21/9] bg-gray-100 rounded-2xl overflow-hidden">
                        {meta.image_url ? (
                            <img src={meta.image_url} className="w-full h-full object-cover" alt="Cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                No Cover Image
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-white p-4 rounded-xl shadow-lg w-96">
                                <label className="text-xs font-bold uppercase text-gray-400 mb-2 block">Featured Image</label>
                                <ImageUpload
                                    bucketName="Images"
                                    value={meta.image_url}
                                    onChange={(url) => setMeta(prev => ({ ...prev, image_url: url }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Meta Basic */}
                    <input
                        value={meta.title}
                        onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                        placeholder="Post Title..."
                        className="w-full text-4xl md:text-5xl font-serif font-bold text-admin-forest placeholder:text-gray-300 outline-none bg-transparent mb-6"
                    />

                    <textarea
                        value={meta.excerpt}
                        onChange={(e) => setMeta({ ...meta, excerpt: e.target.value })}
                        placeholder="Write a short excerpt..."
                        className="w-full text-xl font-serif italic text-gray-600 placeholder:text-gray-300 outline-none bg-transparent resize-none mb-12"
                        rows={2}
                    />

                    {/* Canvas Blocks */}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={blocks.map(b => b.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-4 min-h-[500px] pl-12 border-l border-dashed border-gray-200">
                                {blocks.map((block) => (
                                    <EditorBlock
                                        key={block.id}
                                        block={block}
                                        updateBlock={updateBlock}
                                        removeBlock={removeBlock}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>

                    {/* Add Block Toolbar */}
                    <div className="mt-8 flex gap-4 justify-center opacity-40 hover:opacity-100 transition-opacity">
                        <button onClick={() => addBlock('paragraph')} className="p-3 rounded-full hover:bg-gray-100" title="Text">
                            <Type size={20} />
                        </button>
                        <button onClick={() => addBlock('h2')} className="p-3 rounded-full hover:bg-gray-100" title="Heading">
                            <Heading size={20} />
                        </button>
                        <button onClick={() => addBlock('image')} className="p-3 rounded-full hover:bg-gray-100" title="Image">
                            <ImageIcon size={20} />
                        </button>
                        <button onClick={() => addBlock('quote')} className="p-3 rounded-full hover:bg-gray-100" title="Quote">
                            <Quote size={20} />
                        </button>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-6 left-0 right-0 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 flex justify-between items-center shadow-lg">
                    <div className="text-xs text-gray-500 font-mono flex gap-4">
                        <span>{wordCount} words</span>
                        <span>{readingTime} min read</span>
                        <span className="text-green-600">{blocks.length} blocks</span>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab(activeTab === 'editor' ? 'seo' : 'editor')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors ${activeTab === 'seo' ? 'bg-admin-forest text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                        >
                            SEO Suite
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="bg-admin-forest text-white px-6 py-2 rounded-lg text-sm font-bold uppercase hover:bg-admin-forest/90 flex items-center gap-2"
                        >
                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                            Save
                        </button>
                    </div>
                </div>

            </div>

            {/* RIGHT: SEO Sidebar */}
            {activeTab === 'seo' && (
                <div className="w-1/3 min-w-[350px] border-l border-gray-200 pl-6 animate-in slide-in-from-right duration-300">
                    <h3 className="font-serif text-xl mb-6">SEO Power Suite</h3>

                    <div className="mb-6 space-y-4">
                        <div>
                            <label className="label-text">URL Slug</label>
                            <input
                                value={meta.slug}
                                onChange={(e) => setMeta({ ...meta, slug: e.target.value })}
                                className="input-field border-b text-sm"
                            />
                        </div>
                        <div>
                            <label className="label-text">Focus Keyword</label>
                            <input
                                value={focusKeyword}
                                onChange={(e) => setFocusKeyword(e.target.value)}
                                className="input-field border-b text-sm"
                                placeholder="e.g. Luxury Villa Ubud"
                            />
                        </div>
                    </div>

                    <SEOAnalyzer
                        title={meta.title}
                        description={meta.excerpt}
                        slug={meta.slug}
                        content={JSON.stringify(blocks)} // Raw text analysis
                        focusKeyword={focusKeyword}
                    />
                </div>
            )}
        </div>
    );
};
