import React from 'react';
import {
  Sparkles,
  ShoppingBag,
  Calculator,
  Cpu,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ServerHealth } from '../types';

interface SidebarProps {
  activeTab: 'studio' | 'listings' | 'pricing' | 'models';
  setActiveTab: (tab: 'studio' | 'listings' | 'pricing' | 'models') => void;
  savedCount: number;
  serverHealth: ServerHealth | null;
  onOpenModelSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  serverHealth,
  onOpenModelSettings
}) => {
  const isHfReady = serverHealth?.providers?.huggingface?.configured;
  const isGeminiReady = serverHealth?.providers?.gemini?.configured;

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-neutral-200 flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand Area */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-neutral-900 text-amber-400 flex items-center justify-center font-bold text-lg shadow-sm">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="font-bold text-neutral-900 tracking-tight text-base block leading-none">
                LocalSeller AI
              </span>
              <span className="text-[11px] text-neutral-500 font-medium block mt-1">
                Small Business Studio
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          <button
            onClick={() => setActiveTab('studio')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'studio'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Listing Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('listings')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'listings'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4 shrink-0" />
              <span>Saved Listings</span>
            </div>
            <span
              className={`text-xs font-mono tabular-nums px-2 py-0.5 rounded-md ${
                activeTab === 'listings'
                  ? 'bg-neutral-800 text-neutral-300'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
            >
              {savedCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'pricing'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Calculator className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Pricing Calculator</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              activeTab === 'models'
                ? 'bg-neutral-900 text-white shadow-sm'
                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <Cpu className="w-4 h-4 shrink-0 text-indigo-500" />
            <span>AI Model & Engine</span>
          </button>
        </nav>
      </div>

      {/* Engine & Status Footer */}
      <div className="p-4 border-t border-neutral-100 bg-neutral-50/70">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-700 tracking-wide uppercase">
            Inference Engine
          </span>
          <button
            onClick={onOpenModelSettings}
            className="text-[11px] text-neutral-500 hover:text-neutral-900 hover:underline"
          >
            Configure
          </button>
        </div>

        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-neutral-600">
            <span className="truncate">Qwen 2.5 72B (Apache 2.0)</span>
            {isHfReady ? (
              <span className="flex items-center gap-1 text-emerald-700 font-medium shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5" /> Live
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 font-medium shrink-0">
                <AlertCircle className="w-3.5 h-3.5" /> Sample
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-neutral-500 text-[11px]">
            <span>Multilingual</span>
            <span>EN · BN · HI</span>
          </div>

          <div className="flex items-center justify-between text-neutral-500 text-[11px]">
            <span>Database Storage</span>
            <span>JSON Active</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
