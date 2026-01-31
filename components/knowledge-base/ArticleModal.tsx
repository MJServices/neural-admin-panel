
import { useState, useEffect } from 'react';
import { X, Save, Clock, Eye } from 'lucide-react';

interface ArticleModalProps {
    isOpen: boolean;
    mode: 'view' | 'edit';
    article: any;
    onClose: () => void;
    onSave: (articleId: any, data: any) => Promise<boolean>;
}

const ArticleModal = ({ isOpen, mode, article, onClose, onSave }: ArticleModalProps) => {
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (article) {
            setFormData({
                title: article.title,
                category: article.category,
                status: article.status,
                description: article.description
            });
        }
    }, [article]);

    if (!isOpen || !article) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        const success = await onSave(article.id, formData);
        setSaving(false);
        if (success) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${mode === 'view' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'}`}>
                            {mode === 'view' ? <Eye className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {mode === 'view' ? 'Article Details' : 'Edit Article'}
                            </h2>
                            <p className="text-sm text-gray-500">ID: {article.id}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    <form id="article-form" onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                {mode === 'view' ? (
                                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900 font-medium">{article.title}</div>
                                ) : (
                                    <input
                                        type="text"
                                        value={formData.title || ''}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    />
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                {mode === 'view' ? (
                                    <div className="p-3 bg-gray-50 rounded-lg text-gray-900">{article.category}</div>
                                ) : (
                                    <select
                                        value={formData.category || ''}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="General">General</option>
                                        <option value="#Welcome">#Welcome</option>
                                        <option value="#AI">#AI</option>
                                        <option value="Troubleshooting">Troubleshooting</option>
                                    </select>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                {mode === 'view' ? (
                                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${article.status?.toLowerCase() === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                        {article.status}
                                    </div>
                                ) : (
                                    <select
                                        value={formData.status || 'Draft'}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Published">Published</option>
                                    </select>
                                )}
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Description / Excerpt</label>
                                {mode === 'view' ? (
                                    <div className="p-4 bg-gray-50 rounded-lg text-gray-600 min-h-[100px] leading-relaxed">
                                        {article.description}
                                    </div>
                                ) : (
                                    <textarea
                                        value={formData.description || ''}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                                    />
                                )}
                            </div>

                            {mode === 'view' && (
                                <div className="col-span-2 pt-4 border-t flex gap-8 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Eye className="w-4 h-4" />
                                        <span>{article.views?.toLocaleString()} Views</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>Updated: {article.lastUpdate}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                    >
                        {mode === 'view' ? 'Close' : 'Cancel'}
                    </button>
                    {mode === 'edit' && (
                        <button
                            type="submit"
                            form="article-form"
                            disabled={saving}
                            className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-blue-200"
                        >
                            {saving ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>Save Changes</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArticleModal;
