
import React, { useState } from 'react';
import { AIPrompt } from '../types';

interface PromptManagerProps {
  prompts: AIPrompt[];
  onUpdate: (id: number, content: string) => void;
}

const PromptManager: React.FC<PromptManagerProps> = ({ prompts, onUpdate }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempContent, setTempContent] = useState('');

  const handleEdit = (p: AIPrompt) => {
    setEditingId(p.id);
    setTempContent(p.content);
  };

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, tempContent);
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg className="w-7 h-7 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Gestión de Prompts de IA
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {prompts.map(prompt => (
          <div key={prompt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h3 className="font-bold text-gray-700">{prompt.title}</h3>
              {prompt.isActive && <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">Activo</span>}
            </div>
            <div className="p-6">
              {editingId === prompt.id ? (
                <div className="space-y-4">
                  <textarea
                    className="w-full h-48 p-4 border rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    value={tempContent}
                    onChange={(e) => setTempContent(e.target.value)}
                  />
                  <div className="flex justify-end space-x-3">
                    <button onClick={() => setEditingId(null)} className="px-4 py-2 text-gray-600 font-medium">Cancelar</button>
                    <button onClick={handleSave} className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-lg">Actualizar Instrucciones</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-100 p-4 rounded-lg font-mono text-xs text-gray-600 overflow-x-auto whitespace-pre-wrap">
                    {prompt.content}
                  </div>
                  <button 
                    onClick={() => handleEdit(prompt)}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-bold transition"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Editar Prompt de Extracción
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromptManager;
