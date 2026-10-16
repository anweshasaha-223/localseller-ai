import { PricingBreakdown } from '../types';

export function calculatePricing(params: {
  materialCost: number;
  packagingCost: number;
  laborCost: number;
  shippingCost: number;
  marginPercent: number;
  platformFeePercent: number;
  currency?: 'INR' | 'USD';
}): PricingBreakdown {
  const materialCost = Math.max(0, Number(params.materialCost) || 0);
  const packagingCost = Math.max(0, Number(params.packagingCost) || 0);
  const laborCost = Math.max(0, Number(params.laborCost) || 0);
  const shippingCost = Math.max(0, Number(params.shippingCost) || 0);

  const totalCost = materialCost + packagingCost + laborCost + shippingCost;
  const marginPercent = Math.min(85, Math.max(5, Number(params.marginPercent) || 40));
  const platformFeePercent = Math.min(30, Math.max(0, Number(params.platformFeePercent) || 0));

  // Breakeven price: Selling price where profit = 0 after platform commission
  const breakevenFactor = 1 - platformFeePercent / 100;
  const breakevenPrice = breakevenFactor > 0 ? totalCost / breakevenFactor : totalCost;

  // Target Selling Price formula:
  // Selling Price = Total Cost / (1 - (Margin% + PlatformFee%) / 100)
  const deductionFactor = 1 - (marginPercent + platformFeePercent) / 100;
  const recommendedPrice =
    deductionFactor > 0.05
      ? totalCost / deductionFactor
      : totalCost * (1 + marginPercent / 100);

  const feeAmount = (recommendedPrice * platformFeePercent) / 100;
  const netProfit = Math.max(0, recommendedPrice - totalCost - feeAmount);

  // Suggested charm / psychological price (e.g. 299, 499, 999 or .99)
  let charmPrice = Math.round(recommendedPrice);
  if (params.currency === 'USD') {
    charmPrice = Math.floor(recommendedPrice) + 0.99;
  } else {
    // Default INR rounding to clean psychological price ending in 9 or 99
    if (recommendedPrice <= 200) {
      charmPrice = Math.ceil(recommendedPrice / 10) * 10 - 1; // e.g. 149
    } else if (recommendedPrice <= 1000) {
      charmPrice = Math.ceil(recommendedPrice / 50) * 50 - 1; // e.g. 299, 349, 499
    } else {
      charmPrice = Math.ceil(recommendedPrice / 100) * 100 - 1; // e.g. 1299, 1499
    }
  }

  return {
    materialCost,
    packagingCost,
    laborCost,
    shippingCost,
    totalCost: Math.round(totalCost * 100) / 100,
    marginPercent,
    platformFeePercent,
    breakevenPrice: Math.round(breakevenPrice * 100) / 100,
    recommendedPrice: Math.round(recommendedPrice * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    charmPrice: Math.max(totalCost, charmPrice)
  };
}
