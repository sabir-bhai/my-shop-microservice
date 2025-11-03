import React from "react";
import { X, Download } from "lucide-react";

interface PdfPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string | null;
  onDownload: () => void;
}

const PdfPreviewModal: React.FC<PdfPreviewModalProps> = ({
  isOpen,
  onClose,
  pdfUrl,
  onDownload,
}) => {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <div className="relative w-[90vw] h-[90vh] bg-[#1a1a1a] rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2f2f31]">
          <h2 className="text-xl font-semibold text-white">PDF Preview</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-2"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-hidden p-4">
          <iframe
            src={pdfUrl}
            className="w-full h-full rounded border border-[#2f2f31]"
            title="PDF Preview"
          />
        </div>
      </div>
    </div>
  );
};

export default PdfPreviewModal;
