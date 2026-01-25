
'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    bucketName?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    value,
    onChange,
    bucketName = 'Images'
}) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Trigger file input click
    const handlePickClick = () => {
        fileInputRef.current?.click();
    };

    // Client-side WebP Conversion
    const convertToWebP = (file: File): Promise<Blob> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                    reject(new Error('Canvas context not available'));
                    return;
                }
                ctx.drawImage(img, 0, 0);
                canvas.toBlob((blob) => {
                    if (blob) resolve(blob);
                    else reject(new Error('WebP conversion failed'));
                }, 'image/webp', 0.8); // 0.8 Quality
            };
            img.onerror = (e) => reject(e);
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset input so same file can be selected again if needed
        e.target.value = '';

        setUploading(true);
        try {
            // 1. Convert to WebP
            const webpBlob = await convertToWebP(file);
            const fileName = `${Date.now()}-${file.name.split('.')[0]}.webp`;
            const filePath = `${fileName}`;

            // 2. Upload to Supabase
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(filePath, webpBlob, {
                    contentType: 'image/webp',
                    upsert: false
                });

            if (error) throw error;

            // 3. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from(bucketName)
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onChange(publicUrl);

        } catch (err: any) {
            console.error('Upload failed:', err);
            alert('Upload failed: ' + (err.message || 'Unknown error'));
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onChange('');
    };

    return (
        <div className="space-y-4">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {preview ? (
                <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-admin-forest/10 group">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <button
                            type="button"
                            onClick={handlePickClick}
                            className="p-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white transition-colors"
                            title="Replace Image"
                        >
                            <Upload size={20} />
                        </button>
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="p-2 bg-red-500/80 hover:bg-red-600 backdrop-blur-md rounded-lg text-white transition-colors"
                            title="Remove Image"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handlePickClick}
                    disabled={uploading}
                    className="w-full aspect-video rounded-xl border-2 border-dashed border-admin-forest/20 flex flex-col items-center justify-center gap-2 hover:bg-admin-forest/5 hover:border-admin-forest transition-all duration-300 text-admin-forest/60 hover:text-admin-forest"
                >
                    {uploading ? (
                        <>
                            <Loader2 size={32} className="animate-spin" />
                            <span className="text-xs font-mono uppercase tracking-widest">Optimizing & Uploading...</span>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 rounded-full bg-admin-forest/5 flex items-center justify-center mb-2">
                                <ImageIcon size={24} />
                            </div>
                            <span className="font-serif text-lg">Click to Upload Image</span>
                            <span className="text-xs opacity-60">Auto-converted to WebP</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
};
