import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Copy,
  Check,
  Download,
  Save,
  AlertCircle,
  HelpCircle,
  FileText,
  Calculator,
  RefreshCw,
  Trash2,
  Share2,
  Hash,
  ShoppingBag
} from 'lucide-react';
import {
  Language,
  Platform,
  Tone,
  GeneratedListingContent,
  ProductListing,
  ModelInfo
} from '../types';
import { SAMPLE_PRODUCTS, SampleProductItem } from '../data/sampleProducts';
import { generateListing, saveListing } from '../services/api';
import { calculatePricing } from '../utils/pricing';

interface ListingStudioProps {
  onListingSaved: (listing: ProductListing) => void;
  availableModels: ModelInfo[];
  customApiKey: string;
  onOpenPricingModal: (currentCost: number, currentMargin: number) => void;
}

export const ListingStudio: React.FC<ListingStudioProps> = ({
  onListingSaved,
  availableModels,
  customApiKey,
  onOpenPricingModal
}) => {
  // Form State
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Handmade Crafts');
  const [language, setLanguage] = useState<Language>('English');
  const [platform, setPlatform] = useState<Platform>('Instagram Shop');
  const [tone, setTone] = useState<Tone>('friendly');
  const [targetAudience, setTargetAudience] = useState('');
  const [visualNotes, setVisualNotes] = useState('');

  // Cost & Margin state
  const [unitCost, setUnitCost] = useState<number>(150);
  const [profitMargin, setProfitMargin] = useState<number>(45);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(0);

  // Image Upload State
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMetadata, setImageMetadata] = useState<{ name: string; sizeKb: number; type: string } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Model Selection
  const [selectedModelId, setSelectedModelId] = useState<string>('Qwen/Qwen2.5-72B-Instruct');

  // Generation Output State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<GeneratedListingContent | null>(null);
  const [isSampleData, setIsSampleData] = useState(false);
  const [activeModelUsed, setActiveModelUsed] = useState<string>('');
  const [activeLicense, setActiveLicense] = useState<string>('');
  const [visionNotice, setVisionNotice] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<{ title: string; details: string; showSampleBtn: boolean } | null>(null);

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Categories list
  const CATEGORIES = [
    'Handmade Crafts',
    'Jewelry & Accessories',
    'Fashion & Textiles',
    'Organic Beauty & Wellness',
    'Home Decor & Pottery',
    'Gourmet Food & Bakery',
    'Art & Stationery',
    'Sustainable Living'
  ];

  // Platforms list
  const PLATFORMS: Platform[] = [
    'Instagram Shop',
    'WhatsApp Business Catalog',
    'Etsy',
    'Amazon',
    'Facebook Marketplace',
    'Shopify / Online Store'
  ];

  // Pricing calculation strictly derived from user's cost & margin
  const pricing = calculatePricing({
    materialCost: unitCost,
    packagingCost: 0,
    laborCost: 0,
    shippingCost: 0,
    marginPercent: profitMargin,
    platformFeePercent: platformFeePercent,
    currency: language === 'English' && platform === 'Etsy' ? 'USD' : 'INR'
  });

  // Handle Image File Selection
  const handleImageUpload = (file: File) => {
    setImageError(null);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setImageError('Supported formats: JPG, PNG, WEBP, or GIF.');
      return;
    }

    // Validate size (max 5MB)
    const maxBytes = 5 * 1024 * 1024;
    if (file.size > maxBytes) {
      setImageError(`Image size is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed is 5MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageMetadata({
        name: file.name,
        sizeKb: Math.round(file.size / 1024),
        type: file.type.replace('image/', '').toUpperCase()
      });
    };
    reader.onerror = () => {
      setImageError('Failed to read image file.');
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // Load a Pre-configured Sample Product
  const handleLoadSample = (sample: SampleProductItem) => {
    setProductName(sample.name);
    setCategory(sample.category);
    setLanguage(sample.language);
    setPlatform(sample.platform);
    setTone(sample.tone);
    setUnitCost(sample.unitCost);
    setProfitMargin(sample.profitMargin);
    setPlatformFeePercent(sample.platformFeePercent);
    setTargetAudience(sample.targetAudience);
    setVisualNotes(sample.visualNotes);
    setImagePreview(sample.imageUrl);
    setImageMetadata({
      name: `${sample.id}.jpg`,
      sizeKb: 142,
      type: 'JPEG'
    });
    setImageError(null);
    setErrorMessage(null);

    // Populate pre-verified listing
    setGeneratedOutput(sample.pregenerated);
    setIsSampleData(true);
    setActiveModelUsed('Pre-verified Sample Dataset');
    setActiveLicense('Verified Authentic Product Copy');
    setVisionNotice('Verified handmade product sample. Ready for instant testing or live editing.');
  };

  // Trigger AI Generation
  const handleGenerate = async (forceSampleMode = false) => {
    if (!productName.trim()) {
      setErrorMessage({
        title: 'Product Name Required',
        details: 'Please enter a product title or select one of our instant sample products above.',
        showSampleBtn: true
      });
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setSaveSuccess(false);

    try {
      const response = await generateListing({
        productName,
        category,
        targetAudience,
        language,
        platform,
        tone,
        visualNotes,
        unitCost,
        profitMargin,
        calculatedPrice: pricing.charmPrice,
        modelId: selectedModelId,
        imageBase64: imagePreview || undefined,
        customApiKey,
        isSampleRequested: forceSampleMode
      });

      setGeneratedOutput(response.listing);
      setIsSampleData(response.isSample);
      setActiveModelUsed(response.modelUsed);
      setActiveLicense(response.modelLicense);
      setVisionNotice(response.visionNotice || '');
    } catch (err: any) {
      console.error('Generation error:', err);
      setErrorMessage({
        title: err.code === 'INVALID_HF_TOKEN'
          ? 'Hugging Face Token Issue'
          : err.code === 'NO_CREDENTIALS'
          ? 'Inference Credentials Required'
          : 'AI Inference Notice',
        details: err.message || 'Could not complete inference with the remote server.',
        showSampleBtn: true
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy helper
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Copy All Content
  const handleCopyAll = () => {
    if (!generatedOutput) return;
    const fullText = `=== PRODUCT LISTING ===
Title: ${generatedOutput.title}

Description:
${generatedOutput.description}

Key Features:
${generatedOutput.features.map((f) => `• ${f}`).join('\n')}

Search Tags:
${generatedOutput.searchTags.join(', ')}

Instagram Caption:
${generatedOutput.instagramCaption}

Promotional Announcement:
${generatedOutput.promotionalMessage}

Suggested Price: ₹${pricing.charmPrice} (Calculated with ${profitMargin}% profit margin)
Platform: ${platform}
`;
    handleCopy(fullText, 'all');
  };

  // Download as text or markdown
  const handleDownload = (format: 'txt' | 'md') => {
    if (!generatedOutput) return;
    const fileName = `${productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_listing.${format}`;

    let fileContent = '';
    if (format === 'md') {
      fileContent = `# ${generatedOutput.title}

**Platform:** ${platform} | **Language:** ${language} | **Tone:** ${tone}  
**Suggested Retail Price:** ₹${pricing.charmPrice} *(Based strictly on ₹${unitCost} unit cost + ${profitMargin}% target margin)*

---

## Product Description
${generatedOutput.description}

## Key Features & Benefits
${generatedOutput.features.map((f) => `- ${f}`).join('\n')}

## Search Keywords & Marketplace Tags
${generatedOutput.searchTags.map((t) => `\`${t}\``).join(' ')}

---

## Ready-to-Post Instagram Caption
${generatedOutput.instagramCaption}

---

## Quick Promotional Message (WhatsApp / SMS)
> ${generatedOutput.promotionalMessage}
`;
    } else {
      fileContent = `PRODUCT LISTING: ${generatedOutput.title}
Platform: ${platform}
Language: ${language}
Calculated Price: ₹${pricing.charmPrice}

DESCRIPTION:
${generatedOutput.description}

KEY FEATURES:
${generatedOutput.features.map((f) => `* ${f}`).join('\n')}

SEARCH TAGS:
${generatedOutput.searchTags.join(', ')}

INSTAGRAM CAPTION:
${generatedOutput.instagramCaption}

PROMOTIONAL MESSAGE:
${generatedOutput.promotionalMessage}
`;
    }

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Save to persistent storage / dashboard
  const handleSaveListing = async () => {
    if (!generatedOutput) return;
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const saved = await saveListing({
        productName,
        category,
        language,
        platform,
        tone,
        unitCost,
        profitMargin,
        platformFeePercent,
        calculatedPrice: pricing.recommendedPrice,
        suggestedRetailPrice: pricing.charmPrice,
        targetAudience,
        visualNotes,
        imageUrl: imagePreview || undefined,
        title: generatedOutput.title,
        description: generatedOutput.description,
        features: generatedOutput.features,
        searchTags: generatedOutput.searchTags,
        instagramCaption: generatedOutput.instagramCaption,
        promotionalMessage: generatedOutput.promotionalMessage,
        isSample: isSampleData,
        modelUsed: activeModelUsed,
        modelLicense: activeLicense
      });

      setIsSaving(false);
      setSaveSuccess(true);
      onListingSaved(saved);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save listing:', err);
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Sample Products Quick Ribbon */}
      <div className="mb-6 p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
              Instant Sample Products (1-Click Test)
            </span>
          </div>
          <span className="text-xs text-neutral-500">
            Click any artisan product to auto-fill details & view verified copy
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {SAMPLE_PRODUCTS.map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleLoadSample(sample)}
              className="group text-left p-2.5 border border-neutral-200 hover:border-neutral-900 rounded-lg bg-neutral-50 hover:bg-white transition-all flex items-center gap-2.5"
            >
              <img
                src={sample.imageUrl}
                alt={sample.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-md object-cover border border-neutral-200 shrink-0 group-hover:scale-105 transition-transform"
              />
              <div className="min-w-0">
                <span className="text-xs font-semibold text-neutral-900 block truncate">
                  {sample.name.split('(')[0]}
                </span>
                <span className="text-[11px] text-neutral-500 block truncate">
                  {sample.language} · {sample.platform.split(' ')[0]}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Input Form & Upload (5 Cols on large) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-neutral-900 tracking-tight">
              1. Product Details & Visuals
            </h2>

            {/* Photo Upload Area */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                Product Photography
              </label>

              {imagePreview ? (
                <div className="relative border border-neutral-200 rounded-lg overflow-hidden bg-neutral-900 group">
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    referrerPolicy="no-referrer"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-white text-neutral-900 text-xs font-medium rounded-md hover:bg-neutral-100 shadow-sm"
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setImageMetadata(null);
                      }}
                      className="p-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm"
                      title="Remove Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {imageMetadata && (
                    <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 bg-black/70 backdrop-blur-xs text-[11px] text-neutral-200 rounded flex justify-between">
                      <span className="truncate max-w-[180px]">{imageMetadata.name}</span>
                      <span className="font-mono tabular-nums">{imageMetadata.sizeKb} KB · {imageMetadata.type}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-neutral-300 hover:border-neutral-900 rounded-lg p-6 text-center cursor-pointer bg-neutral-50 hover:bg-neutral-100/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center mx-auto mb-2 text-neutral-500 shadow-2xs">
                    <Upload className="w-5 h-5 text-neutral-700" />
                  </div>
                  <span className="text-xs font-medium text-neutral-800 block">
                    Upload or drag & drop product photo
                  </span>
                  <span className="text-[11px] text-neutral-500 block mt-0.5">
                    JPG, PNG, WEBP, or GIF (up to 5MB)
                  </span>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleImageUpload(e.target.files[0]);
                  }
                }}
              />

              {imageError && (
                <div className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{imageError}</span>
                </div>
              )}
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                Product Name / Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="e.g. Handcrafted Terracotta Chai Cup Set"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
              />
            </div>

            {/* Category & Language Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                  Target Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 font-medium"
                >
                  <option value="English">English</option>
                  <option value="Bengali">Bengali (বাংলা)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                </select>
              </div>
            </div>

            {/* Platform & Tone Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                  Selling Platform
                </label>
                <select
                  value={platform}
                  onChange={(e) => {
                    const p = e.target.value as Platform;
                    setPlatform(p);
                    // Update typical platform commission fee
                    if (p === 'Etsy') setPlatformFeePercent(6.5);
                    else if (p === 'Amazon') setPlatformFeePercent(15);
                    else setPlatformFeePercent(0);
                  }}
                  className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                >
                  {PLATFORMS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                  Copy Tone
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-neutral-100 rounded-lg">
                  {(['friendly', 'professional', 'persuasive'] as Tone[]).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setTone(t)}
                      className={`py-1.5 text-xs font-medium capitalize rounded-md transition-colors ${
                        tone === t
                          ? 'bg-white text-neutral-900 shadow-2xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Eco-conscious homeowners, chai lovers, festival gift buyers"
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors"
              />
            </div>

            {/* Visual Details & Craft Notes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wide">
                  Visual Details, Materials & Maker Notes
                </label>
                <span className="text-[11px] text-neutral-500">For honest AI text input</span>
              </div>
              <textarea
                rows={3}
                value={visualNotes}
                onChange={(e) => setVisualNotes(e.target.value)}
                placeholder="e.g. 100% natural river clay, 150ml capacity, hand-thrown in Krishnanagar, unglazed earthen finish..."
                className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-colors resize-none"
              />
            </div>

            {/* Pricing Suggestion Module (Strict Cost + Margin) */}
            <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Calculator className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-bold text-neutral-900">
                    Cost & Profit-Based Pricing
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenPricingModal(unitCost, profitMargin)}
                  className="text-[11px] font-semibold text-neutral-600 hover:text-neutral-900 underline"
                >
                  Full Breakdown
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">
                    Direct Unit Cost
                  </label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-1.5 text-xs text-neutral-500">₹</span>
                    <input
                      type="number"
                      min="0"
                      value={unitCost}
                      onChange={(e) => setUnitCost(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full pl-6 pr-2 py-1.5 text-xs bg-white border border-neutral-200 rounded-md font-mono tabular-nums"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">
                    Target Margin %
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="5"
                      max="85"
                      value={profitMargin}
                      onChange={(e) => setProfitMargin(Math.max(5, Math.min(85, parseFloat(e.target.value) || 0)))}
                      className="w-full px-2 py-1.5 text-xs bg-white border border-neutral-200 rounded-md font-mono tabular-nums pr-5"
                    />
                    <span className="absolute right-2 top-1.5 text-xs text-neutral-500">%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">
                    Calculated Price
                  </label>
                  <div className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs font-bold font-mono tabular-nums">
                    ₹{pricing.charmPrice}
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-neutral-500 leading-tight">
                * Strictly derived from your ₹{unitCost} cost and {profitMargin}% margin. Never invents speculative market prices.
              </p>
            </div>

            {/* Model Selector */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1.5">
                AI Inference Engine
              </label>
              <select
                value={selectedModelId}
                onChange={(e) => setSelectedModelId(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              >
                {availableModels.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} — {m.license}
                  </option>
                ))}
              </select>
              <span className="block text-[11px] text-neutral-500 mt-1">
                Open-weight model verified on Hugging Face Serverless Inference.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => handleGenerate(false)}
                disabled={isGenerating}
                className="w-full py-3 px-4 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-300 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Generating Professional Copy...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Generate Listing & Marketing Content</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleGenerate(true)}
                disabled={isGenerating}
                className="w-full py-2 px-3 text-xs font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Run Instant Pre-Verified Demo</span>
                <span className="text-[10px] bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded font-mono">
                  Zero-Key
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Output Listing & Marketing Content (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Error / Credentials Notice if needed */}
          {errorMessage && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-amber-900">{errorMessage.title}</h4>
                  <p className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                    {errorMessage.details}
                  </p>
                </div>
              </div>
              {errorMessage.showSampleBtn && (
                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleGenerate(true)}
                    className="px-3 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors"
                  >
                    View Sample Demo Output
                  </button>
                  <span className="text-[11px] text-amber-800">
                    Works offline with zero configuration
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Generated Content Card */}
          {generatedOutput ? (
            <div className="bg-white border border-neutral-200 rounded-xl shadow-xs overflow-hidden">
              {/* Header Bar */}
              <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">
                      Generated Listing
                    </span>
                    {isSampleData ? (
                      <span className="text-[11px] bg-neutral-200 text-neutral-800 font-mono px-2 py-0.5 rounded">
                        Sample Demo Data
                      </span>
                    ) : (
                      <span className="text-[11px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded">
                        Live AI Generated
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-1.5">
                    <span>{activeModelUsed || selectedModelId}</span>
                    <span>·</span>
                    <span>{activeLicense || 'Open License'}</span>
                  </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopyAll}
                    className="px-2.5 py-1.5 bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="Copy everything to clipboard"
                  >
                    {copiedKey === 'all' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>Copy All</span>
                  </button>

                  <button
                    onClick={() => handleDownload('txt')}
                    className="px-2.5 py-1.5 bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="Download as TXT file"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>TXT</span>
                  </button>

                  <button
                    onClick={() => handleDownload('md')}
                    className="px-2.5 py-1.5 bg-white border border-neutral-200 hover:border-neutral-900 text-neutral-700 hover:text-neutral-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                    title="Download as Markdown"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>MD</span>
                  </button>

                  <button
                    onClick={handleSaveListing}
                    disabled={isSaving}
                    className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Listing</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {visionNotice && (
                <div className="px-5 py-2 bg-neutral-100/70 border-b border-neutral-200/60 text-[11px] text-neutral-600 flex items-center gap-2">
                  <span className="font-semibold text-neutral-700">Transparency Notice:</span>
                  <span>{visionNotice}</span>
                </div>
              )}

              {/* Sections Container */}
              <div className="p-5 space-y-6">
                {/* 1. Product Title */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Product Title
                    </span>
                    <button
                      onClick={() => handleCopy(generatedOutput.title, 'title')}
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      {copiedKey === 'title' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Title</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={generatedOutput.title}
                    onChange={(e) =>
                      setGeneratedOutput({ ...generatedOutput, title: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm font-semibold bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                  />
                </div>

                {/* 2. Product Description */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Product Description
                    </span>
                    <button
                      onClick={() => handleCopy(generatedOutput.description, 'desc')}
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      {copiedKey === 'desc' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Description</span>
                    </button>
                  </div>
                  <textarea
                    rows={5}
                    value={generatedOutput.description}
                    onChange={(e) =>
                      setGeneratedOutput({ ...generatedOutput, description: e.target.value })
                    }
                    className="w-full px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed resize-y"
                  />
                </div>

                {/* 3. Key Features */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Key Features & Specifications
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(
                          generatedOutput.features.map((f) => `• ${f}`).join('\n'),
                          'features'
                        )
                      }
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      {copiedKey === 'features' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Bullets</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {generatedOutput.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <span className="text-neutral-400 text-sm">•</span>
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...generatedOutput.features];
                            newFeatures[idx] = e.target.value;
                            setGeneratedOutput({ ...generatedOutput, features: newFeatures });
                          }}
                          className="w-full px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Search Tags & Keywords */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Marketplace Search Tags & Keywords
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(generatedOutput.searchTags.join(', '), 'tags')
                      }
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      {copiedKey === 'tags' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy All Tags</span>
                    </button>
                  </div>
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-lg flex flex-wrap gap-1.5">
                    {generatedOutput.searchTags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCopy(tag, `tag-${idx}`)}
                        className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded text-xs font-medium flex items-center gap-1 transition-colors"
                        title="Click to copy this single tag"
                      >
                        <Hash className="w-3 h-3 text-neutral-400" />
                        <span>{tag}</span>
                        {copiedKey === `tag-${idx}` && (
                          <Check className="w-2.5 h-2.5 text-emerald-600 ml-0.5" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Instagram / Social Caption */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Instagram / Social Media Caption
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(generatedOutput.instagramCaption, 'caption')
                      }
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      {copiedKey === 'caption' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Caption</span>
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={generatedOutput.instagramCaption}
                    onChange={(e) =>
                      setGeneratedOutput({
                        ...generatedOutput,
                        instagramCaption: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900 leading-relaxed resize-y"
                  />
                </div>

                {/* 6. Promotional Message (WhatsApp / SMS / Story) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide">
                      Short Promotional Message (WhatsApp / SMS)
                    </span>
                    <button
                      onClick={() =>
                        handleCopy(generatedOutput.promotionalMessage, 'promo')
                      }
                      className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
                    >
                      {copiedKey === 'promo' ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>Copy Promo</span>
                    </button>
                  </div>
                  <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-neutral-800 leading-relaxed">
                      {generatedOutput.promotionalMessage}
                    </p>
                    <button
                      onClick={() =>
                        handleCopy(generatedOutput.promotionalMessage, 'promo')
                      }
                      className="p-1.5 bg-white border border-neutral-200 rounded text-neutral-600 hover:text-neutral-900 shadow-2xs shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Empty state when no listing generated yet */
            <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-4 text-neutral-600">
                <Sparkles className="w-7 h-7 text-amber-500" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                Ready to Generate Your Product Listing
              </h3>
              <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1.5 leading-relaxed">
                Fill in your product details on the left, upload a photo, and click Generate. Or test immediately with one of our pre-configured artisan samples above.
              </p>
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleLoadSample(SAMPLE_PRODUCTS[0])}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Load Terracotta Chai Cup Sample</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
