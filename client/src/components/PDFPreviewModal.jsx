import { X, Download } from 'lucide-react';
import Button from './ui/Button';
import Modal from './ui/Modal';

export default function PDFPreviewModal({ open, onClose, pdfUrl, title = 'Invoice Preview' }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <div className="flex items-center gap-2">
                        {pdfUrl && (
                            <a href={pdfUrl} download="invoice.pdf" className="no-underline">
                                <Button variant="accent" size="sm">
                                    <Download size={18} />
                                    Download
                                </Button>
                            </a>
                        )}
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 bg-slate-800 p-0 overflow-hidden relative">
                    {pdfUrl ? (
                        <iframe
                            src={pdfUrl}
                            className="w-full h-full border-0"
                            title="PDF Preview"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-400">
                            Loading PDF...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
