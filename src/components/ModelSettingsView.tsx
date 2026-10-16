import React, { useState } from 'react';
import {
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Key,
  Info,
  Layers,
  Sparkles
} from 'lucide-react';
import { ModelInfo, ServerHealth } from '../types';

interface ModelSettingsViewProps {
  availableModels: ModelInfo[];
  serverHealth: ServerHealth | null;
  customApiKey: string;
  setCustomApiKey: (key: string) => void;
  onRefreshHealth: () => void;
  onLoadQuickSample: () => void;
}

export const ModelSettingsView: React.FC<ModelSettingsViewProps> = ({
  availableModels,
  serverHealth,
  customApiKey,
  setCustomApiKey,
  onRefreshHealth,
  onLoadQuickSample
}) => {
  const [tokenInput, setTokenInput] = useState(customApiKey);
  const [saveNote, setSaveNote] = useState(false);

  const isHfServerConfigured = serverHealth?.providers?.huggingface?.configured;
  const isGeminiServerConfigured = serverHealth?.providers?.gemini?.configured;

  const handleSaveToken = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomApiKey(tokenInput.trim());
    setSaveNote(true);
    setTimeout(() => setSaveNote(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Cpu className="w-5 h-5 text-indigo-600" />
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Open-Weight AI Models & Provider Integrity
          </h1>
        </div>
        <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
          LocalSeller AI connects exclusively to verified, real open-weight models via Hugging Face Serverless Inference Providers and Google GenAI. All model identities, parameters, and licenses are strictly verifiable.
        </p>
      </div>

      {/* Provider Connectivity Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* HF Status */}
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">
              Hugging Face Inference
            </span>
            {isHfServerConfigured || customApiKey ? (
              <span className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 text-xs font-semibold">
                <AlertCircle className="w-3.5 h-3.5" /> Unconfigured
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {isHfServerConfigured
              ? 'Server environment contains an active HF_TOKEN. Open-weight inference is ready.'
              : customApiKey
              ? 'Browser session token active for this visit.'
              : 'Add HF_TOKEN in .env or enter a temporary session token below.'}
          </p>
          <a
            href="https://huggingface.co/settings/tokens"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 pt-1"
          >
            <span>Get free HF read token</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Gemini Status */}
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">
              Google GenAI (Multimodal)
            </span>
            {isGeminiServerConfigured ? (
              <span className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            ) : (
              <span className="flex items-center gap-1 text-neutral-500 text-xs font-semibold">
                Optional
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            {isGeminiServerConfigured
              ? 'GEMINI_API_KEY detected. Direct multimodal photo vision enabled.'
              : 'Multimodal fallback provider. Automatically injected in AI Studio environments.'}
          </p>
        </div>

        {/* Zero-Key Sample Mode */}
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900">
              Zero-Key Sample Demo
            </span>
            <span className="flex items-center gap-1 text-emerald-700 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Available
            </span>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            All sample products function with zero credentials. Outputs are pre-verified authentic artisan product copy.
          </p>
          <button
            onClick={onLoadQuickSample}
            className="text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 pt-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Test instant sample demo</span>
          </button>
        </div>
      </div>

      {/* Verified Open-Weight Models Inventory */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-5">
        <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
          Verified Open-Weight Model Registry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableModels.map((model) => (
            <div
              key={model.id}
              className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">{model.name}</h3>
                  <span className="text-xs font-mono text-neutral-500">{model.id}</span>
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-white border border-neutral-200 text-neutral-800 shrink-0">
                  {model.license}
                </span>
              </div>

              <div className="space-y-1 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Provider:</span>
                  <span className="font-medium text-neutral-800">{model.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Parameters:</span>
                  <span className="font-mono text-neutral-800">{model.parameters}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Multilingual:</span>
                  <span className="text-neutral-800">{model.multilingualStrength}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-neutral-200 text-[11px] text-neutral-500 leading-relaxed">
                <strong>Vision Capability: </strong>
                {model.visionExplanation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Token Entry Form */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-neutral-700" />
          <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
            Session Access Token Override (Optional)
          </h2>
        </div>
        <p className="text-xs text-neutral-500 leading-relaxed">
          If you are running in an environment without server-side environment variables configured, you can supply your temporary Hugging Face user access token (with read permission) for this browser session. It will be passed securely via server headers and never logged.
        </p>

        <form onSubmit={handleSaveToken} className="flex gap-3 items-center">
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            className="flex-1 px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
          >
            Update Session Key
          </button>
        </form>

        {saveNote && (
          <div className="text-xs text-emerald-700 flex items-center gap-1.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Session access token updated successfully.</span>
          </div>
        )}
      </div>

      {/* Honest Vision Disclosure */}
      <div className="p-5 bg-neutral-100 rounded-xl border border-neutral-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-800 uppercase tracking-wide">
          <Info className="w-4 h-4 text-neutral-700" />
          <span>Honest Vision & Multimodal Policy</span>
        </div>
        <p className="text-xs text-neutral-600 leading-relaxed">
          Open-weight language models like Qwen 2.5 72B and Llama 3.3 70B operate on text tokens. LocalSeller AI validates your uploaded product photo format, verifies file size constraints, and stores your product photograph for display and marketing downloads. The descriptive listing copy is generated from your entered maker notes and specifications, ensuring no artificial claims of synthetic computer vision are made. When Gemini 2.5 Flash is selected, genuine multimodal image token analysis is executed.
        </p>
      </div>
    </div>
  );
};
