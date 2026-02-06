'use client';

import { motion } from 'framer-motion';
import { SessionTag } from '@/types';

interface TagSelectorProps {
    selectedTag: SessionTag;
    onTagChange: (tag: SessionTag) => void;
}

const TAGS: { tag: SessionTag; label: string; color: string }[] = [
    { tag: 'work', label: 'Work', color: '#E11D48' },
    { tag: 'study', label: 'Study', color: '#3B82F6' },
    { tag: 'creative', label: 'Creative', color: '#8B5CF6' },
    { tag: 'exercise', label: 'Exercise', color: '#10B981' },
    { tag: 'reading', label: 'Reading', color: '#F59E0B' },
    { tag: 'other', label: 'Other', color: '#6B7280' },
];

export function TagSelector({ selectedTag, onTagChange }: TagSelectorProps) {
    const handleTagClick = (tag: SessionTag) => {
        console.log('Tag clicked:', tag);
        onTagChange(tag);
    };

    return (
        <div className="flex flex-wrap gap-2 justify-center">
            {TAGS.map((t) => {
                const isSelected = selectedTag === t.tag;
                return (
                    <motion.button
                        key={t.tag}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleTagClick(t.tag);
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium cursor-pointer select-none"
                        style={{
                            backgroundColor: isSelected ? t.color + '30' : 'rgba(255,255,255,0.05)',
                            border: isSelected
                                ? `2px solid ${t.color}`
                                : '2px solid transparent',
                            color: isSelected ? t.color : 'var(--color-text-secondary)',
                        }}
                        whileHover={{ scale: 1.05, backgroundColor: isSelected ? t.color + '40' : 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {t.label}
                    </motion.button>
                );
            })}
        </div>
    );
}
