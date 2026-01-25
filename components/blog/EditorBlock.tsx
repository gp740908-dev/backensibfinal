
import React, { useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X, Image as ImageIcon, Type, Quote, Heading } from 'lucide-react';
import { Block, BlockType } from './BlockTypes';
import { ImageUpload } from '../ImageUpload';

interface EditorBlockProps {
    block: Block;
    updateBlock: (id: string, content: string, caption?: string) => void;
    removeBlock: (id: string) => void;
}

export const EditorBlock: React.FC<EditorBlockProps> = ({ block, updateBlock, removeBlock }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: block.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.5 : 1
    };

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
        }
    }, [block.content]);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative flex items-start gap-4 p-2 pl-0 -ml-12 hover:bg-gray-50 rounded-xl transition-colors"
        >
            {/* Drag Handle & Actions */}
            <div className="w-10 pt-2 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
                <GripVertical size={20} className="text-gray-300 hover:text-gray-600" />
                <button tabIndex={-1} onClick={() => removeBlock(block.id)} className="text-gray-300 hover:text-red-500">
                    <X size={16} />
                </button>
            </div>

            {/* Block Content */}
            <div className="flex-1 min-w-0">
                {block.type === 'paragraph' && (
                    <textarea
                        ref={textareaRef}
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Type something..."
                        className="w-full bg-transparent resize-none outline-none font-serif text-lg leading-relaxed text-gray-800 placeholder:text-gray-300"
                        rows={1}
                    />
                )}

                {block.type === 'h2' && (
                    <input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Heading 2"
                        className="w-full bg-transparent outline-none font-serif text-3xl font-bold text-gray-900 placeholder:text-gray-300"
                    />
                )}

                {block.type === 'h3' && (
                    <input
                        value={block.content}
                        onChange={(e) => updateBlock(block.id, e.target.value)}
                        placeholder="Heading 3"
                        className="w-full bg-transparent outline-none font-serif text-2xl font-bold text-gray-800 placeholder:text-gray-300"
                    />
                )}

                {block.type === 'quote' && (
                    <div className="flex gap-4 p-6 bg-gray-50 border-l-4 border-admin-forest rounded-r-xl">
                        <Quote size={24} className="text-admin-forest shrink-0" />
                        <textarea
                            ref={textareaRef}
                            value={block.content}
                            onChange={(e) => updateBlock(block.id, e.target.value)}
                            placeholder="Quote text..."
                            className="w-full bg-transparent resize-none outline-none font-serif text-xl italic text-gray-700 placeholder:text-gray-300"
                            rows={1}
                        />
                    </div>
                )}

                {block.type === 'image' && (
                    <div className="space-y-2">
                        <ImageUpload
                            bucketName="Images"
                            value={block.content}
                            onChange={(url) => updateBlock(block.id, url, block.caption)}
                        />
                        {block.content && (
                            <input
                                value={block.caption || ''}
                                onChange={(e) => updateBlock(block.id, block.content, e.target.value)}
                                placeholder="Image caption (text below image)"
                                className="w-full text-center text-sm text-gray-500 bg-transparent outline-none border-none placeholder:text-gray-300"
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Type Indicator (Subtle) */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-20 pointer-events-none">
                {block.type === 'image' && <ImageIcon size={20} />}
                {block.type === 'paragraph' && <Type size={20} />}
                {block.type === 'h2' && <Heading size={20} />}
                {block.type === 'quote' && <Quote size={20} />}
            </div>
        </div>
    );
};
