import React from 'react';
import { Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';

interface TopNavProps {
  activeTab: 'studio' | 'listings' | 'pricing' | 'models';
  setActiveTab: (tab: 'studio' | 'listings' | 'pricing' | 'models') => void;
  onLoadQuickSample: () => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  onLoadQuickSample,
  isMobileMenuOpen,
  setIsMobileMenuOpen
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="flex items-center justify-between gap-8 px-6 py-3.5 max-w-7xl mx-auto">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-neutral-600 hover:text-neutral-900 rounded-md"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setActiveTab('studio')}
            className="text-base font-bold tracking-tight text-neutral-900 whitespace-nowrap shrink-0 text-left"
          >
            LocalSeller AI
          </button>
          <span className="hidden sm:inline text-neutral-300">/</span>
          <span className="hidden sm:inline text-xs text-neutral-500 font-medium">
            {activeTab === 'studio' && 'Listing & Marketing Studio'}
            {activeTab === 'listings' && 'Saved Product Listings'}
            {activeTab === 'pricing' && 'Cost & Profit Calculator'}
            {activeTab === 'models' && 'Open-Weight Model Settings'}
          </span>
        </div>

        {/* Zone 2: Clean single-line text navigation links (desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-600">
          <button
            onClick={() => setActiveTab('studio')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'studio' ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Studio
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'listings' ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Saved Listings
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'pricing' ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Pricing Calculator
          </button>
          <button
            onClick={() => setActiveTab('models')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'models' ? 'text-neutral-900 font-semibold' : 'hover:text-neutral-900'
            }`}
          >
            Models & Licenses
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLoadQuickSample}
            className="px-3.5 py-1.5 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-xs"
            title="Load instant pre-verified sample product (no API key required)"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try Sample Product</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-100 bg-white px-6 py-4 space-y-2">
          <button
            onClick={() => {
              setActiveTab('studio');
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-sm font-medium ${
              activeTab === 'studio' ? 'text-neutral-900 font-bold' : 'text-neutral-600'
            }`}
          >
            Listing Studio
          </button>
          <button
            onClick={() => {
              setActiveTab('listings');
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-sm font-medium ${
              activeTab === 'listings' ? 'text-neutral-900 font-bold' : 'text-neutral-600'
            }`}
          >
            Saved Listings
          </button>
          <button
            onClick={() => {
              setActiveTab('pricing');
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-sm font-medium ${
              activeTab === 'pricing' ? 'text-neutral-900 font-bold' : 'text-neutral-600'
            }`}
          >
            Pricing Calculator
          </button>
          <button
            onClick={() => {
              setActiveTab('models');
              setIsMobileMenuOpen(false);
            }}
            className={`block w-full text-left py-2 text-sm font-medium ${
              activeTab === 'models' ? 'text-neutral-900 font-bold' : 'text-neutral-600'
            }`}
          >
            Models & Licenses
          </button>
        </div>
      )}
    </header>
  );
};
