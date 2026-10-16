import React, { useState } from 'react';
import {
  Search,
  Filter,
  Trash2,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Tag
} from 'lucide-react';
import { ProductListing, Platform, Language } from '../types';
import { deleteListing } from '../services/api';

interface SavedListingsViewProps {
  listings: ProductListing[];
  onSelectListing: (listing: ProductListing) => void;
  onRefreshListings: () => void;
  onGoToStudio: () => void;
}

export const SavedListingsView: React.FC<SavedListingsViewProps> = ({
  listings,
  onSelectListing,
  onRefreshListings,
  onGoToStudio
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter listings
  const filteredListings = listings.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlatform =
      platformFilter === 'all' || item.platform === platformFilter;

    const matchesLanguage =
      languageFilter === 'all' || item.language === languageFilter;

    return matchesSearch && matchesPlatform && matchesLanguage;
  });

  // Calculate usage stats
  const totalListings = listings.length;
  const sampleCount = listings.filter((l) => l.isSample).length;
  const avgMargin =
    totalListings > 0
      ? Math.round(
          listings.reduce((acc, curr) => acc + (curr.profitMargin || 40), 0) /
            totalListings
        )
      : 0;

  // Platform breakdown
  const platformCounts: { [key: string]: number } = {};
  listings.forEach((l) => {
    platformCounts[l.platform] = (platformCounts[l.platform] || 0) + 1;
  });
  let topPlatform = 'None';
  let maxCount = 0;
  Object.entries(platformCounts).forEach(([plat, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topPlatform = plat;
    }
  });

  const handleCopyCaption = (item: ProductListing) => {
    navigator.clipboard.writeText(item.instagramCaption);
    setCopiedId(`caption-${item.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAll = (item: ProductListing) => {
    const text = `=== ${item.title} ===
Description:
${item.description}

Features:
${item.features.map((f) => `• ${f}`).join('\n')}

Tags:
${item.searchTags.join(', ')}

Instagram Caption:
${item.instagramCaption}

Promo Message:
${item.promotionalMessage}
`;
    navigator.clipboard.writeText(text);
    setCopiedId(`all-${item.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing from history?')) return;
    setDeletingId(id);
    try {
      await deleteListing(id);
      onRefreshListings();
    } catch (err) {
      console.error('Failed to delete listing:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownload = (item: ProductListing) => {
    const fileName = `${item.productName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_listing.txt`;
    const text = `PRODUCT LISTING: ${item.title}
Platform: ${item.platform}
Language: ${item.language}
Tone: ${item.tone}
Suggested Price: ₹${item.suggestedRetailPrice || item.calculatedPrice || 'N/A'}

DESCRIPTION:
${item.description}

KEY FEATURES:
${item.features.map((f) => `* ${f}`).join('\n')}

SEARCH TAGS:
${item.searchTags.join(', ')}

INSTAGRAM CAPTION:
${item.instagramCaption}

PROMOTIONAL MESSAGE:
${item.promotionalMessage}
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Usage Analytics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide">
              Total Saved Listings
            </span>
            <Layers className="w-4 h-4 text-neutral-400" />
          </div>
          <span className="text-2xl font-bold font-mono tabular-nums text-neutral-900">
            {totalListings}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">
            Persisted in JSON database
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide">
              Top Selling Channel
            </span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-base font-bold text-neutral-900 truncate block">
            {topPlatform}
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">
            {maxCount} listings created
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide">
              Avg Profit Margin
            </span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold font-mono tabular-nums text-emerald-700">
            {avgMargin}%
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">
            Derived from unit costs
          </span>
        </div>

        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wide">
              Demo vs Custom
            </span>
            <Sparkles className="w-4 h-4 text-indigo-500" />
          </div>
          <span className="text-base font-bold font-mono tabular-nums text-neutral-900">
            {totalListings - sampleCount} Custom / {sampleCount} Demo
          </span>
          <span className="text-[11px] text-neutral-500 block mt-1">
            Verified sample products
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search saved listings by title, material, or keyword..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none"
          >
            <option value="all">All Channels</option>
            <option value="Instagram Shop">Instagram Shop</option>
            <option value="WhatsApp Business Catalog">WhatsApp Catalog</option>
            <option value="Etsy">Etsy</option>
            <option value="Amazon">Amazon</option>
            <option value="Facebook Marketplace">Facebook Marketplace</option>
            <option value="Shopify / Online Store">Shopify</option>
          </select>

          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none"
          >
            <option value="all">All Languages</option>
            <option value="English">English</option>
            <option value="Bengali">Bengali (বাংলা)</option>
            <option value="Hindi">Hindi (हिन्दी)</option>
          </select>

          <button
            onClick={onGoToStudio}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors whitespace-nowrap ml-auto"
          >
            + Create New Listing
          </button>
        </div>
      </div>

      {/* Listings List */}
      {filteredListings.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center shadow-xs">
          <Layers className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-900">No listings found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
            {searchTerm || platformFilter !== 'all' || languageFilter !== 'all'
              ? 'Try adjusting your search query or channel filters.'
              : 'You have not saved any listings yet. Create your first listing in the studio!'}
          </p>
          <div className="mt-4">
            <button
              onClick={onGoToStudio}
              className="px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Go to Listing Studio
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs hover:border-neutral-300 transition-colors flex flex-col md:flex-row gap-5 items-start justify-between"
            >
              {/* Product Thumbnail & Core Info */}
              <div className="flex gap-4 items-start flex-1 min-w-0">
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-lg object-cover border border-neutral-200 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 shrink-0">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                )}

                <div className="space-y-1.5 min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-bold text-neutral-900 truncate">
                      {item.title || item.productName}
                    </h4>
                    {item.isSample && (
                      <span className="text-[10px] bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded font-mono">
                        Demo
                      </span>
                    )}
                  </div>

                  {/* Clean unboxed metadata with typographic separators */}
                  <div className="flex flex-wrap items-center gap-1.5 text-xs text-neutral-500">
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.platform}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.language}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{item.tone}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Price breakdown pill-free */}
                  <div className="pt-1 flex items-center gap-3 text-xs">
                    <span className="font-semibold text-neutral-900 font-mono tabular-nums">
                      Suggested: ₹{item.suggestedRetailPrice || item.calculatedPrice || '—'}
                    </span>
                    {item.profitMargin && (
                      <span className="text-emerald-700 font-mono tabular-nums">
                        +{item.profitMargin}% Margin
                      </span>
                    )}
                    {item.unitCost && (
                      <span className="text-neutral-500 font-mono tabular-nums">
                        Cost: ₹{item.unitCost}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex md:flex-col gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => onSelectListing(item)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  title="Open and edit in Listing Studio"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Studio</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopyCaption(item)}
                    className="p-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg text-xs transition-colors"
                    title="Copy Instagram Caption"
                  >
                    {copiedId === `caption-${item.id}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    onClick={() => handleDownload(item)}
                    className="p-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg text-xs transition-colors"
                    title="Download listing as text"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId === item.id}
                    className="p-1.5 bg-neutral-50 hover:bg-red-50 border border-neutral-200 text-neutral-500 hover:text-red-600 rounded-lg text-xs transition-colors"
                    title="Delete listing"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
