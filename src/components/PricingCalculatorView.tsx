import React, { useState } from 'react';
import {
  Calculator,
  ShieldCheck,
  TrendingUp,
  Percent,
  Coins,
  ArrowRight,
  Info,
  DollarSign
} from 'lucide-react';
import { calculatePricing } from '../utils/pricing';

interface PricingCalculatorViewProps {
  initialCost?: number;
  initialMargin?: number;
  onApplyToStudio: (cost: number, margin: number) => void;
}

export const PricingCalculatorView: React.FC<PricingCalculatorViewProps> = ({
  initialCost = 150,
  initialMargin = 45,
  onApplyToStudio
}) => {
  // Input fields
  const [materialCost, setMaterialCost] = useState<number>(initialCost > 0 ? initialCost : 120);
  const [packagingCost, setPackagingCost] = useState<number>(25);
  const [laborHours, setLaborHours] = useState<number>(1);
  const [hourlyRate, setHourlyRate] = useState<number>(100);
  const [shippingCost, setShippingCost] = useState<number>(35);

  const [marginPercent, setMarginPercent] = useState<number>(initialMargin || 45);
  const [platformFeePercent, setPlatformFeePercent] = useState<number>(0);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  const laborCost = laborHours * hourlyRate;
  const totalDirectCost = materialCost + packagingCost + laborCost + shippingCost;

  const pricing = calculatePricing({
    materialCost,
    packagingCost,
    laborCost,
    shippingCost,
    marginPercent,
    platformFeePercent,
    currency
  });

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
            Cost & Profit-Based Pricing Engine
          </h1>
        </div>
        <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
          Calculate sustainable retail pricing strictly from your real craft expenses, time investment, and target profit margin. No unverified market guessing or artificial inflation.
        </p>
      </div>

      {/* Ethics & Transparency Banner */}
      <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-900 leading-relaxed">
          <span className="font-bold">Strict Cost-Plus Mathematical Guarantee: </span>
          LocalSeller AI never invents or guesses external market pricing. All suggested prices and profit margins are computed using verified mathematical formulas based solely on your own supplied cost entries and margin requirements.
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              Direct Unit Expenses
            </h2>
            <div className="flex items-center gap-1 p-0.5 bg-neutral-100 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currency === 'INR' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'
                }`}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  currency === 'USD' ? 'bg-white text-neutral-900 shadow-2xs font-semibold' : 'text-neutral-600'
                }`}
              >
                $ USD
              </button>
            </div>
          </div>

          {/* 1. Raw Materials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Raw Materials & Supplies
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-500 font-mono">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={materialCost}
                  onChange={(e) => setMaterialCost(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-7 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg font-mono tabular-nums focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Clay, fabric, yarn, waxes, oils, hardware
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Packaging & Presentation
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-xs text-neutral-500 font-mono">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  value={packagingCost}
                  onChange={(e) => setPackagingCost(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full pl-7 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg font-mono tabular-nums focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
                />
              </div>
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Boxes, bubble wrap, thank-you cards, ribbons
              </span>
            </div>
          </div>

          {/* 2. Maker Labor & Time */}
          <div className="p-4 bg-neutral-50/80 border border-neutral-200 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800">
                Maker Labor & Time Compensation
              </span>
              <span className="text-xs font-mono font-semibold text-neutral-900 tabular-nums">
                Subtotal: {currencySymbol}{laborCost}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  Hours per Unit
                </label>
                <input
                  type="number"
                  step="0.25"
                  min="0"
                  value={laborHours}
                  onChange={(e) => setLaborHours(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  Hourly Wage ({currencySymbol}/hr)
                </label>
                <input
                  type="number"
                  min="0"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Math.max(0, parseFloat(e.target.value) || 0))}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-md font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* 3. Shipping / Logistics */}
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Estimated Shipping & Courier Subsidy
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs text-neutral-500 font-mono">
                {currencySymbol}
              </span>
              <input
                type="number"
                min="0"
                value={shippingCost}
                onChange={(e) => setShippingCost(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full pl-7 pr-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg font-mono tabular-nums focus:bg-white focus:outline-none focus:ring-1 focus:ring-neutral-900"
              />
            </div>
            <span className="text-[11px] text-neutral-400 mt-1 block">
              Set to 0 if buyer pays shipping separately
            </span>
          </div>

          {/* 4. Target Margin Presets */}
          <div className="space-y-2 border-t border-neutral-100 pt-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700">
                Desired Profit Margin %
              </label>
              <span className="text-sm font-mono font-bold text-neutral-900 tabular-nums">
                {marginPercent}%
              </span>
            </div>
            <div className="flex gap-2">
              {[30, 40, 50, 60, 70].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setMarginPercent(preset)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    marginPercent === preset
                      ? 'bg-neutral-900 text-white font-bold'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {preset}%
                </button>
              ))}
            </div>
            <input
              type="range"
              min="10"
              max="80"
              value={marginPercent}
              onChange={(e) => setMarginPercent(parseInt(e.target.value, 10))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
          </div>

          {/* 5. Platform Commission Channel */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-700">
              Selling Channel Commission / Payment Fee
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Instagram / Direct (0%)', fee: 0 },
                { name: 'Etsy (6.5%)', fee: 6.5 },
                { name: 'Amazon (15%)', fee: 15 }
              ].map((chan) => (
                <button
                  type="button"
                  key={chan.name}
                  onClick={() => setPlatformFeePercent(chan.fee)}
                  className={`p-2 text-xs rounded-lg border text-left transition-colors ${
                    platformFeePercent === chan.fee
                      ? 'bg-neutral-900 text-white border-neutral-900 font-medium'
                      : 'bg-neutral-50 hover:bg-white border-neutral-200 text-neutral-700'
                  }`}
                >
                  <span className="block truncate">{chan.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Output & Breakdown Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-6">
            <h2 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">
              Pricing Formula Breakdown
            </h2>

            {/* Total Cost Basis */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs text-neutral-600">
                <span>Direct Unit Cost Basis:</span>
                <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                  {currencySymbol}{pricing.totalCost}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-600">
                <span>Minimum Breakeven (0% Profit):</span>
                <span className="font-mono font-semibold text-neutral-900 tabular-nums">
                  {currencySymbol}{pricing.breakevenPrice}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-neutral-600">
                <span>Desired Net Profit Margin:</span>
                <span className="font-mono font-semibold text-emerald-700 tabular-nums">
                  +{pricing.marginPercent}%
                </span>
              </div>
              {platformFeePercent > 0 && (
                <div className="flex justify-between items-center text-xs text-neutral-600">
                  <span>Channel Deductions ({platformFeePercent}%):</span>
                  <span className="font-mono tabular-nums text-neutral-500">
                    {currencySymbol}{Math.round((pricing.recommendedPrice * platformFeePercent) / 100)}
                  </span>
                </div>
              )}
            </div>

            {/* Recommended Charm Retail Price */}
            <div className="p-5 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide block">
                Suggested Retail Price
              </span>
              <div className="text-3xl font-extrabold text-emerald-900 font-mono tabular-nums">
                {currencySymbol}{pricing.charmPrice}
              </div>
              <p className="text-xs text-emerald-800 pt-1">
                Net Profit per unit: <strong className="font-mono tabular-nums">{currencySymbol}{pricing.netProfit}</strong>
              </p>
            </div>

            {/* Monthly Volume Projections */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-neutral-700 uppercase tracking-wide block">
                Estimated Net Earnings by Volume
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <span className="text-[11px] text-neutral-500 block">25 sales</span>
                  <span className="text-xs font-bold font-mono tabular-nums text-neutral-900">
                    {currencySymbol}{Math.round(pricing.netProfit * 25)}
                  </span>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <span className="text-[11px] text-neutral-500 block">50 sales</span>
                  <span className="text-xs font-bold font-mono tabular-nums text-neutral-900">
                    {currencySymbol}{Math.round(pricing.netProfit * 50)}
                  </span>
                </div>
                <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg">
                  <span className="text-[11px] text-neutral-500 block">100 sales</span>
                  <span className="text-xs font-bold font-mono tabular-nums text-emerald-700">
                    {currencySymbol}{Math.round(pricing.netProfit * 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <button
              type="button"
              onClick={() => onApplyToStudio(pricing.totalCost, pricing.marginPercent)}
              className="w-full py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <span>Apply Price to Listing Studio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
