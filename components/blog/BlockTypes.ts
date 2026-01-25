
export type BlockType = 'paragraph' | 'h2' | 'h3' | 'image' | 'quote';

export interface Block {
    id: string;
    type: BlockType;
    content: string; // Text content or Image URL
    caption?: string; // For images
}
