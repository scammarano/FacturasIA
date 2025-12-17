
import React, { useState, useEffect } from 'react';

interface IntegrationConfig {
  webhookUrl: string;
  apiKey: string;
  autoSync: boolean;
  targetSystem: string;
}

const Integrations: React.FC = () => {
  const [config, setConfig] = useState<IntegrationConfig>({
    webhookUrl: '',
    apiKey: '',
    autoSync: false,
    targetSystem: 'SAP Business One'
  });

  useEffect(() => {
    const savedConfig = localStorage.getItem('sm_integration_config');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('sm_integration_config', JSON.stringify(config));
    alert("Configuración de integración actualizada con éxito. El sistema ahora intentará sincronizar facturas validadas según sus preferencias.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
        <div className="flex items-center space-x-6 mb-12">
           <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center shadow-lg shadow-blue-50">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
           </div>
           <div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tighter uppercase">Conectividad ERP</h2>
              <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1">Interoperabilidad mediante API & Webhooks</p>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Sistema Administrativo / ERP</label>
              <select 
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-black text-slate-700 outline-none transition"
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

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">URL del Webhook (Endpoint)</label>
              <input 
                type="url" 
                placeholder="https://api.empresa.com/v1/sync"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-mono text-sm font-bold text-blue-600 outline-none transition"
                value={config.webhookUrl}
                onChange={e => setConfig({...config, webhookUrl: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Token / API Key de Autorización</label>
              <input 
                type="password" 
                placeholder="••••••••••••••••••••••••"
                className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-500 p-4 rounded-2xl font-mono text-sm outline-none transition"
                value={config.apiKey}
                onChange={e => setConfig({...config, apiKey: e.target.value})}
              />
            </div>

            <div className="flex items-center space-x-4 p-6 bg-blue-50 rounded-[2rem] border border-blue-100">
               <div className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={config.autoSync}
                    onChange={e => setConfig({...config, autoSync: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
               </div>
               <span className="text-[10px] text-blue-900 font-black uppercase tracking-widest leading-tight">
                  Sincronización automática en tiempo real
               </span>
            </div>
          </div>

          <div className="bg-[#1e293b] rounded-[3rem] p-10 text-white font-mono text-[10px] overflow-hidden shadow-2xl relative">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <svg className="w-40 h-40" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
             </div>
             <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <span className="text-blue-400 font-black uppercase tracking-widest">Esquema de Datos (JSON)</span>
                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded text-[8px] font-black uppercase">Válido</span>
             </div>
             <pre className="text-slate-300 whitespace-pre-wrap">
{`{
  "event": "invoice_validated",
  "metadata": {
    "target": "${config.targetSystem}",
    "source": "SmartInvoice AI"
  },
  "payload": {
    "id": "INV-X8374",
    "provider_rif": "J-1234567-8",
    "amount_bs": 12500.00,
    "currency": "USD",
    "digital_link": "https://vault.sm...png"
  },
  "timestamp": "${new Date().toISOString()}"
}`}
             </pre>
             <p className="mt-10 text-slate-500 italic text-[9px] leading-relaxed">
                Este bloque representa el estándar de intercambio de datos. SmartInvoice enviará este objeto a su sistema destino cada vez que un operador apruebe un documento.
             </p>
          </div>
        </div>

        <div className="mt-12 flex justify-end">
           <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-[2rem] font-black shadow-2xl shadow-blue-200 transition transform active:scale-95 text-xs uppercase tracking-widest"
           >
            Implementar Configuración ERP
           </button>
        </div>
      </div>
    </div>
  );
};

export default Integrations;
