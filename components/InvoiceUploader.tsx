
import React, { useRef, useState } from 'react';
import { InvoiceAIService } from '../services/geminiService';
import { AIPrompt, ProcessingItem } from '../types';

interface InvoiceUploaderProps {
  activePrompt: AIPrompt;
  onQueueReady: (items: ProcessingItem[]) => void;
}

const InvoiceUploader: React.FC<InvoiceUploaderProps> = ({ activePrompt, onQueueReady }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const aiService = new InvoiceAIService();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setProgress({ current: 0, total: files.length });
    
    const queue: ProcessingItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const mimeType = file.type;
      
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      try {
        const result = await aiService.processInvoice(base64, activePrompt.content, mimeType);
        queue.push({ data: result, imageUrl: base64, mimeType });
        setProgress(prev => ({ ...prev, current: i + 1 }));
      } catch (err) {
        console.error(`Error procesando archivo ${i + 1}:`, err);
      }
    }

    if (queue.length > 0) {
      onQueueReady(queue);
    } else {
      alert("No se pudo procesar ningún archivo correctamente.");
    }
    
    setIsProcessing(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 text-center border-b border-gray-100">
          <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform -rotate-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Carga por Lotes</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Selecciona una o varias facturas (PDF/Imagen)</p>
        </div>

        <div className="p-8">
          {!isProcessing ? (
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*,application/pdf"
                multiple
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-5 px-6 rounded-2xl shadow-xl shadow-blue-100 transition transform active:scale-95 flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-lg">Procesar Documentos</span>
              </button>
              <div className="flex justify-center space-x-6 text-[10px] font-black text-gray-400 uppercase tracking-widest pt-2">
                <span className="flex items-center"><span className="w-2 h-2 bg-blue-400 rounded-full mr-1.5"></span> Imágenes</span>
                <span className="flex items-center"><span className="w-2 h-2 bg-red-400 rounded-full mr-1.5"></span> Archivos PDF</span>
              </div>
            </div>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-4">
                <div 
                  className="bg-blue-600 h-full transition-all duration-500 ease-out"
                  style={{ width: `${(progress.current / progress.total) * 100}%` }}
                ></div>
              </div>
              <p className="text-blue-600 font-black text-sm uppercase tracking-widest">
                Procesando: {progress.current} de {progress.total}
              </p>
              <p className="text-gray-400 text-xs mt-2 font-medium italic animate-pulse">La IA está leyendo y categorizando sus documentos...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Fix: Adding default export
export default InvoiceUploader;
