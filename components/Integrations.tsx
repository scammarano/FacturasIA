
import React, { useState } from 'react';

const Integrations: React.FC = () => {
  const [config, setConfig] = useState({
    webhookUrl: '',
    apiKey: '',
    autoSync: false,
    targetSystem: 'SAP Business One'
  });

  const handleSave = () => {
    alert("Configuración de integración actualizada. El sistema ahora intentará sincronizar facturas validadas.");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center space-x-4 mb-8">
           <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
           </div>
           <div>
              <h2 className="text-2xl font-bold text-gray-800">Conectividad Administrativa</h2>
              <p className="text-sm text-gray-500">Enlace este sistema con su ERP o Software Contable preferido.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Sistema Destino</label>
              <select 
                className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none"
                value={config.targetSystem}
                onChange={e => setConfig({...config, targetSystem: e.target.value})}
              >
                <option>SAP Business One</option>
                <option>Profit Plus</option>
                <option>Saint Enterprise</option>
                <option>Odoo ERP</option>
                <option>Custom Webhook (JSON)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL del Webhook / API Endpoint</label>
              <input 
                type="url" 
                placeholder="https://api.tuempresa.com/v1/facturas"
                className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                value={config.webhookUrl}
                onChange={e => setConfig({...config, webhookUrl: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">API Key / Token de Acceso</label>
              <input 
                type="password" 
                placeholder="••••••••••••••••••••••••"
                className="w-full border p-3 rounded-xl bg-gray-50 focus:ring-2 focus:ring-purple-500 outline-none font-mono text-sm"
                value={config.apiKey}
                onChange={e => setConfig({...config, apiKey: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl border border-purple-100">
               <input 
                type="checkbox" 
                className="w-5 h-5 text-purple-600 rounded"
                checked={config.autoSync}
                onChange={e => setConfig({...config, autoSync: e.target.checked})}
               />
               <label className="text-sm text-purple-900 font-semibold italic">
                  Sincronización automática al validar factura (Real-time)
               </label>
            </div>
          </div>

          <div className="bg-gray-900 rounded-2xl p-6 text-white font-mono text-xs overflow-hidden">
             <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                <span className="text-gray-400">Payload Preview (JSON)</span>
                <span className="text-green-500 uppercase font-bold text-[10px]">Ready</span>
             </div>
             <pre className="text-blue-300">
{`{
  "event": "invoice_validated",
  "data": {
    "id": "INV-8374",
    "rif_supplier": "J-1234567-8",
    "total": 1250.00,
    "currency": "USD",
    "items": [...],
    "digital_copy": "https://cdn.sm...png"
  },
  "timestamp": "${new Date().toISOString()}"
}`}
             </pre>
             <p className="mt-8 text-gray-500 italic">Este bloque muestra el formato de datos que será enviado a su servidor central cada vez que se apruebe una factura.</p>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
           <button 
            onClick={handleSave}
            className="bg-purple-600 hover:bg-purple-700 text-white px-10 py-3 rounded-xl font-bold shadow-xl shadow-purple-100 transition transform active:scale-95"
           >
            Guardar Configuración de Integración
           </button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
