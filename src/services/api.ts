import { ProductListing, ModelInfo, ServerHealth, Language, Platform, Tone } from '../types';

export interface GenerateParams {
  productName: string;
  category: string;
  targetAudience: string;
  language: Language;
  platform: Platform;
  tone: Tone;
  visualNotes?: string;
  unitCost?: number;
  profitMargin?: number;
  calculatedPrice?: number;
  modelId?: string;
  imageBase64?: string;
  customApiKey?: string;
  isSampleRequested?: boolean;
}

export interface GenerateResult {
  success: boolean;
  isSample: boolean;
  modelUsed: string;
  modelLicense: string;
  supportsVision?: boolean;
  visionNotice?: string;
  listing: {
    title: string;
    description: string;
    features: string[];
    searchTags: string[];
    instagramCaption: string;
    promotionalMessage: string;
  };
}

export async function getHealth(): Promise<ServerHealth> {
  const res = await fetch('/api/health');
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function getModels(): Promise<ModelInfo[]> {
  const res = await fetch('/api/models');
  if (!res.ok) throw new Error('Failed to fetch models');
  const data = await res.json();
  return data.models;
}

export async function getListings(): Promise<ProductListing[]> {
  const res = await fetch('/api/listings');
  if (!res.ok) throw new Error('Failed to fetch listings');
  const data = await res.json();
  return data.listings;
}

export async function saveListing(listing: Partial<ProductListing>): Promise<ProductListing> {
  const res = await fetch('/api/listings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(listing)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to save listing');
  }
  const data = await res.json();
  return data.listing;
}

export async function deleteListing(id: string): Promise<boolean> {
  const res = await fetch(`/api/listings/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Failed to delete listing');
  const data = await res.json();
  return data.success;
}

export async function generateListing(params: GenerateParams): Promise<GenerateResult> {
  const res = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  const data = await res.json();
  if (!res.ok) {
    const err: any = new Error(data.message || 'Generation request failed');
    err.code = data.error;
    err.status = res.status;
    err.helpText = data.helpText;
    err.allowSampleFallback = data.allowSampleFallback;
    throw err;
  }

  return data;
}
