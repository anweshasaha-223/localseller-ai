export type Language = 'English' | 'Bengali' | 'Hindi';

export type Platform =
  | 'Instagram Shop'
  | 'WhatsApp Business Catalog'
  | 'Etsy'
  | 'Amazon'
  | 'Facebook Marketplace'
  | 'Shopify / Online Store';

export type Tone = 'professional' | 'friendly' | 'persuasive';

export interface GeneratedListingContent {
  title: string;
  description: string;
  features: string[];
  searchTags: string[];
  instagramCaption: string;
  promotionalMessage: string;
}

export interface ProductListing extends GeneratedListingContent {
  id: string;
  createdAt: string;
  productName: string;
  category: string;
  language: Language;
  platform: Platform;
  tone: Tone;
  unitCost?: number;
  profitMargin?: number;
  platformFeePercent?: number;
  calculatedPrice?: number;
  suggestedRetailPrice?: number;
  targetAudience?: string;
  visualNotes?: string;
  imageUrl?: string;
  isSample?: boolean;
  modelUsed?: string;
  modelLicense?: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  license: string;
  licenseType: 'open-source' | 'open-weight' | 'proprietary-api';
  parameters: string;
  multilingualStrength: string;
  supportsVision: boolean;
  visionExplanation: string;
  isDefault: boolean;
}

export interface PricingBreakdown {
  materialCost: number;
  packagingCost: number;
  laborCost: number;
  shippingCost: number;
  totalCost: number;
  marginPercent: number;
  platformFeePercent: number;
  breakevenPrice: number;
  recommendedPrice: number;
  netProfit: number;
  charmPrice: number;
}

export interface ServerHealth {
  status: string;
  timestamp: string;
  providers: {
    huggingface: {
      configured: boolean;
      defaultModel: string;
      license: string;
    };
    gemini: {
      configured: boolean;
      defaultModel: string;
    };
  };
  storage: {
    type: string;
    location: string;
    itemCount: number;
  };
}
