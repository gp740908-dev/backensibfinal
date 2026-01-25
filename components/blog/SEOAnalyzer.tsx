
import React, { useMemo } from 'react';
import { Search, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SEOAnalyzerProps {
    title: string;
    description?: string; // Meta description
    slug: string;
    content: string; // Full text content for analysis
    focusKeyword: string;
}

export const SEOAnalyzer: React.FC<SEOAnalyzerProps> = ({
    title,
    description = '',
    slug,
    content,
    focusKeyword
}) => {
    // Analysis Logic
    const analysis = useMemo(() => {
        const keyword = focusKeyword.toLowerCase();
        const text = content.toLowerCase();
        const titleLower = title.toLowerCase();

        const checks = [
            {
                label: 'Keyword in Title',
                passed: titleLower.includes(keyword),
                msg: 'Add focus keyword to the title.'
            },
            {
                label: 'Keyword in URL (Slug)',
                passed: slug.toLowerCase().includes(keyword),
                msg: 'Add focus keyword to the slug.'
            },
            {
                label: 'Keyword density',
                passed: text.split(keyword).length - 1 > 2,
                msg: 'Use focus keyword at least 3 times in content.'
            },
            {
                label: 'Title Length',
                passed: title.length >= 40 && title.length <= 60,
                msg: 'Title should be 40-60 characters.'
            },
            {
                label: 'Description Length',
                passed: description.length >= 120 && description.length <= 160,
                msg: 'Meta description should be 120-160 characters.'
            }
        ];

        const score = (checks.filter(c => c.passed).length / checks.length) * 100;
        return { checks, score };
    }, [title, description, slug, content, focusKeyword]);

    return (
        <div className="space-y-6">
            {/* 1. Google Preview */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                    <Search size={14} /> Google Search Preview
                </h4>
                <div className="font-sans">
                    <div className="flex items-center gap-2 text-sm text-gray-800 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px]">S</div>
                        <span className="font-bold">StayinUBUD</span>
                        <span className="text-gray-500 text-xs">https://stayinubud.com › journal › {slug}</span>
                    </div>
                    <h3 className="text-xl text-[#1a0dab] hover:underline cursor-pointer truncate mb-1">
                        {title || 'Your Post Title Here'}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                        {description || 'Please enter a meta description to see how it looks in search results...'}
                    </p>
                </div>
            </div>

            {/* 2. Analysis Card */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">SEO Analysis</h4>
                    <span className={`text-lg font-bold ${analysis.score >= 80 ? 'text-green-500' : analysis.score >= 50 ? 'text-orange-500' : 'text-red-500'}`}>
                        {Math.round(analysis.score)}/100
                    </span>
                </div>

                <div className="space-y-3">
                    {analysis.checks.map((check, idx) => (
                        <div key={idx} className="flex items-start gap-3 text-sm">
                            {check.passed ? (
                                <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                            ) : (
                                <AlertCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                            )}
                            <div>
                                <span className={check.passed ? 'text-gray-700' : 'text-gray-500'}>
                                    {check.label}
                                </span>
                                {!check.passed && (
                                    <p className="text-xs text-red-400 mt-0.5">{check.msg}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
