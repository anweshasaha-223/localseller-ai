import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { ListingStudio } from './components/ListingStudio';
import { SavedListingsView } from './components/SavedListingsView';
import { PricingCalculatorView } from './components/PricingCalculatorView';
import { ModelSettingsView } from './components/ModelSettingsView';
import { ProductListing, ModelInfo, ServerHealth } from './types';
import { getHealth, getModels, getListings } from './services/api';
import { SAMPLE_PRODUCTS } from './data/sampleProducts';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'listings' | 'pricing' | 'models'>('studio');
  const [listings, setListings] = useState<ProductListing[]>([]);
  const [serverHealth, setServerHealth] = useState<ServerHealth | null>(null);
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Cross-tab transfer state for pricing calculator
  const [pricingStudioTransfer, setPricingStudioTransfer] = useState<{ cost: number; margin: number }>({
    cost: 160,
    margin: 45
  });

  // Load initial data
  const loadData = async () => {
    try {
      const [healthData, modelsData, listingsData] = await Promise.all([
        getHealth().catch(() => null),
        getModels().catch(() => []),
        getListings().catch(() => [])
      ]);

      if (healthData) setServerHealth(healthData);
      if (modelsData && modelsData.length > 0) setAvailableModels(modelsData);
      if (listingsData) setListings(listingsData);
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // When a listing is saved
  const handleListingSaved = (saved: ProductListing) => {
    setListings((prev) => {
      const exists = prev.findIndex((l) => l.id === saved.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = saved;
        return copy;
      }
      return [saved, ...prev];
    });
  };

  // When user clicks "Open in Studio" from Saved Listings
  const handleSelectListingForStudio = (listing: ProductListing) => {
    // Switch to studio tab
    setActiveTab('studio');
  };

  // When user triggers quick sample from top nav
  const handleLoadQuickSample = () => {
    setActiveTab('studio');
  };

  // Open pricing modal / tab with current studio values
  const handleOpenPricing = (cost: number, margin: number) => {
    setPricingStudioTransfer({ cost, margin });
    setActiveTab('pricing');
  };

  // Apply pricing calculator result back to studio
  const handleApplyPricingToStudio = (cost: number, margin: number) => {
    setPricingStudioTransfer({ cost, margin });
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row text-neutral-900">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          savedCount={listings.length}
          serverHealth={serverHealth}
          onOpenModelSettings={() => setActiveTab('models')}
        />
      </div>

      {/* Main Viewport Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLoadQuickSample={handleLoadQuickSample}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />

        <main className="flex-1 pb-16">
          {activeTab === 'studio' && (
            <ListingStudio
              onListingSaved={handleListingSaved}
              availableModels={availableModels}
              customApiKey={customApiKey}
              onOpenPricingModal={handleOpenPricing}
            />
          )}

          {activeTab === 'listings' && (
            <SavedListingsView
              listings={listings}
              onSelectListing={handleSelectListingForStudio}
              onRefreshListings={loadData}
              onGoToStudio={() => setActiveTab('studio')}
            />
          )}

          {activeTab === 'pricing' && (
            <PricingCalculatorView
              initialCost={pricingStudioTransfer.cost}
              initialMargin={pricingStudioTransfer.margin}
              onApplyToStudio={handleApplyPricingToStudio}
            />
          )}

          {activeTab === 'models' && (
            <ModelSettingsView
              availableModels={availableModels}
              serverHealth={serverHealth}
              customApiKey={customApiKey}
              setCustomApiKey={setCustomApiKey}
              onRefreshHealth={loadData}
              onLoadQuickSample={handleLoadQuickSample}
            />
          )}
        </main>
      </div>
    </div>
  );
}
