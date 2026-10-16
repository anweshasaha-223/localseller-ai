import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Ensure data directory exists
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'listings.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed listings if file does not exist
const INITIAL_SEED_LISTINGS = [
  {
    id: 'seed-1',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    isSample: true,
    productName: 'Handcrafted Terracotta Chai Cups (Set of 4)',
    category: 'Handmade Crafts',
    language: 'English',
    platform: 'Instagram Shop',
    tone: 'friendly',
    unitCost: 160,
    profitMargin: 45,
    platformFeePercent: 0,
    calculatedPrice: 290,
    suggestedRetailPrice: 299,
    targetAudience: 'Tea connoisseurs, eco-friendly home lovers, aesthetic gift buyers',
    visualNotes: 'Natural terracotta brown with subtle white painted traditional motifs around the rim. Hand-thrown clay with earthy textured finish.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    title: 'Artisanal Terracotta Chai Cup Set | Handcrafted Clay Kulhad (Pack of 4)',
    description: 'Elevate your daily evening chai ritual with our 100% natural, hand-thrown terracotta cups. Crafted by generational clay artisans in West Bengal, each cup retains the authentic, earthy aroma of pure mother earth. Completely unglazed, non-toxic, and naturally porous to keep your chai piping hot. Perfect for mindful mornings or gifting fellow chai lovers.',
    features: [
      'Authentic Kulhad Experience: Imparts a subtle, natural earthen flavor to hot beverages',
      'Generational Craftsmanship: Individually shaped on traditional potter wheels in Krishnanagar',
      '100% Eco-Friendly & Natural: Sourced from sustainable riverbed clay without artificial glazes or chemicals',
      'Comfortable Grip: Ergonomically shaped with 150ml capacity per cup',
      'Safe & Practical: Microwave and hot-beverage friendly'
    ],
    searchTags: [
      'terracotta chai cup',
      'handmade clay kulhad',
      'artisanal pottery',
      'eco friendly kitchenware',
      'indian chai set',
      'handmade gifts',
      'sustainable dining',
      'earthenware mugs'
    ],
    instagramCaption: `There is simply nothing quite like the soothing, earthy aroma of freshly brewed ginger chai in a real clay kulhad. ☕✨

Meet our Handcrafted Terracotta Chai Cup Set — molded with care, sun-baked, and fired in traditional kilns by heritage artisans. Each piece carries subtle one-of-a-kind variations that celebrate the beauty of handmade imperfection.

🏷️ Set of 4: ₹299 (Only 12 sets in this batch!)
📦 Plastic-free, shatter-safe shipping across India.

📩 Tap the link in our bio or send us a DM with "CHAI" to claim your set before they sell out!

#HandmadeInIndia #ChaiLovers #TerracottaCup #ClayPottery #ArtisanMade #VocalForLocal #EcoFriendlyLiving #InstagramShop`,
    promotionalMessage: 'Chai just tastes better in real terracotta! ☕ Our artisan-made 4-cup set is back in stock for only ₹299. DM us to reserve yours!'
  },
  {
    id: 'seed-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    isSample: true,
    productName: 'হাতে বোনা খাঁটি তসর সিল্ক স্কার্ফ (Handwoven Pure Tussar Silk Scarf)',
    category: 'Fashion & Textiles',
    language: 'Bengali',
    platform: 'Facebook Marketplace',
    tone: 'persuasive',
    unitCost: 650,
    profitMargin: 50,
    platformFeePercent: 0,
    calculatedPrice: 1300,
    suggestedRetailPrice: 1299,
    targetAudience: 'উৎসব ও ঘরোয়া অনুষ্ঠানে ঐতিহ্যবাহী সাজ পছন্দ করা নারীরা',
    visualNotes: 'সোনালী-বাদামী প্রাকৃতিক তসর রেশম, লাল ও নীল সুতোর কাঁথা স্টিচ নকশা, প্রান্তভাগে ঐতিহ্যবাহী টার্সেল কাজ।',
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    title: 'হাতে বোনা খাঁটি তসর সিল্ক স্কার্ফ | ঐতিহ্যবাহী নকশী কাঁথা স্টিচ কারুকাজ',
    description: 'বাংলার শতবর্ষের ঐতিহ্যকে নিজের পোশাকে ধারণ করুন। আমাদের এই তসর সিল্ক স্কার্ফটি বীরভূমের গ্রামীণ মহিলা কারিগরদের নিপুণ হাতে বোনা। খাঁটি প্রাকৃতিক তসরের কোমল দীপ্তি এবং রঙিন সুতোর কাঁথা স্টিচের সূক্ষ্ম কাজ আপনাকে যেকোনো উৎসবে এনে দেবে এক অনন্য রুচিশীল ব্যক্তিত্ব। হালকা ও আরামদায়ক হওয়ায় সারা বছর স্বাচ্ছন্দ্যে পরা যায়।',
    features: [
      '১০০% খাঁটি তসর রেশম: প্রাকৃতিক উজ্জ্বলতা ও আরামদায়ক টেক্সচার',
      'হস্তশিল্প কাঁথা স্টিচ: প্রতিটি নকশা বীরভূমের অভিজ্ঞ কারিগরদের হাতে তৈরি',
      'বহুমুখী ব্যবহার: শাড়ি, কুর্তি বা ওয়েস্টার্ন পোশাকের সাথে দুর্দান্ত মানানসই',
      'প্রাকৃতিক রং ও পরিবেশবান্ধব প্রক্রিয়াকরণ',
      'উৎসব ও প্রিয়জনকে উপহার দেওয়ার আদর্শ স্মারক'
    ],
    searchTags: [
      'তসর সিল্ক স্কার্ফ',
      'নকশী কাঁথা স্টিচ',
      'বাংলার হস্তশিল্প',
      'হাতে বোনা স্কার্ফ',
      'tussar silk scarf',
      'kantha stitch dupatta',
      'handmade bengal textile'
    ],
    instagramCaption: `বাংলার ঐতিহ্যের স্পর্শে সাজিয়ে তুলুন নিজেকে! 🌸✨

আমাদের নতুন সংগ্রহে যুক্ত হলো খাঁটি তসর সিল্কের কাঁথা স্টিচ স্কার্ফ। বীরভূমের শিল্পীদের নিখুঁত হাতের বুননে তৈরি এই প্রতিটি স্কার্ফ যেন একেকটি ভালোবাসার গল্প।

✨ বিশেষ অফার মূল্য: মাত্র ₹১,২৯৯ (সীমিত স্টক!)
🚚 সমগ্র ভারতে হোম ডেলিভারি সুবিধা

📩 এখনই অর্ডার করতে ইনবক্সে মেসেজ করুন অথবা হোয়াটসঅ্যাপে যোগাযোগ করুন।

#বাংলারহস্তশিল্প #তসরসিল্ক #কাঁথাস্টিচ #হাতেবোনা #HandmadeWithLove #VocalForLocal #BengalArtisans`,
    promotionalMessage: 'খাঁটি তসর সিল্ক ও কাঁথা স্টিচের অপরূপ মেলবন্ধন! সীমিত সংখ্যক স্কার্ফ উপলব্ধ মাত্র ₹১,২৯৯ টাকায়। দ্রুত মেসেজ করে আপনারটি সংগ্রহ করুন।'
  },
  {
    id: 'seed-3',
    createdAt: new Date().toISOString(),
    isSample: true,
    productName: 'शुद्ध नीम और हल्दी हस्तनिर्मित साबुन (Pure Neem & Turmeric Handmade Soap)',
    category: 'Organic Beauty & Wellness',
    language: 'Hindi',
    platform: 'WhatsApp Business Catalog',
    tone: 'professional',
    unitCost: 65,
    profitMargin: 55,
    platformFeePercent: 0,
    calculatedPrice: 144,
    suggestedRetailPrice: 149,
    targetAudience: 'प्राकृतिक त्वचा देखभाल पसंद करने वाले, मुंहासे और संवेदनशील त्वचा वाले ग्राहक',
    visualNotes: 'हल्के हरे और सुनहरे पीले रंग की प्राकृतिक मार्बल्ड बनावट। साबुन पर सूखा नीम का पत्ता और हर्बल गंध।',
    imageUrl: 'https://images.unsplash.com/photo-1607006314644-8cb23e8022b7?auto=format&fit=crop&w=600&q=80',
    title: 'प्राकृतिक नीम और कस्तूरी हल्दी हस्तनिर्मित साबुन | सल्फेट व पैराबेन मुक्त (100g)',
    description: 'प्राचीन आयुर्वेदिक पद्धति से कोल्ड-प्रोसेस्ड तकनीक द्वारा निर्मित यह साबुन आपकी त्वचा को देता है गहरा पोषण और प्राकृतिक सुरक्षा। ताजे नीम के अर्क और शुद्ध कस्तूरी हल्दी से भरपूर यह साबुन त्वचा के दाग-धब्बे और मुंहासों को कम करने में सहायक है। इसमें किसी भी प्रकार के हानिकारक केमिकल, सल्फेट या कृत्रिम सुगंध का उपयोग नहीं किया गया है।',
    features: [
      'कोल्ड-प्रोसेस्ड विधि: तेलों और जड़ी-बूटियों के प्राकृतिक गुण 100% सुरक्षित',
      'नीम और हल्दी का शक्तिशाली संगम: एंटी-बैक्टीरियल और त्वचा निखारक',
      'प्राकृतिक कोल्ड-प्रेस्ड नारियल तेल व शिया बटर बेस: त्वचा में नमी बनाए रखे',
      'सल्फेट (SLS), पैराबेन और पाम ऑयल मुक्त',
      'संवेदनशील और मुंहासे वाली त्वचा के लिए चर्मरोग परीक्षित'
    ],
    searchTags: [
      'नीम हल्दी साबुन',
      'हस्तनिर्मित साबुन',
      'आयुर्वेदिक स्किनकेयर',
      'ऑर्गेनिक साबुन',
      'neem turmeric soap',
      'handmade herbal soap',
      'chemical free skincare'
    ],
    instagramCaption: `केमिकल भरे साबुनों को कहें अलविदा और अपनाएं प्रकृति का शुद्ध उपहार! 🌿💛

हमारा नया नीम और कस्तूरी हल्दी हस्तनिर्मित साबुन कोल्ड-प्रोसेस्ड तकनीक से 6 हफ्तों तक तैयार किया गया है। यह त्वचा को बिना सूखा किए गहराई से साफ करता है और प्राकृतिक चमक लौटाता है।

🧼 वजन: 100 ग्राम
💰 विशेष कीमत: ₹149 प्रति बार (3 का कॉम्बो मात्र ₹399)

📲 ऑर्डर करने के लिए अभी व्हाट्सएप पर "SOAP" लिखकर भेजें!

#हस्तनिर्मितसाबुन #आयुर्वेद #प्राकृतिकस्किनकेयर #नीमहल्दी #HandmadeSoap #ChemicalFree #OrganicBeauty`,
    promotionalMessage: '100% केमिकल-मुक्त नीम और कस्तूरी हल्दी साबुन! स्वस्थ और चमकती त्वचा के लिए आज ही ऑर्डर करें ₹149 में। संपर्क करें!'
  }
];

// Helper to read listings
function getStoredListings(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SEED_LISTINGS, null, 2), 'utf-8');
      return INITIAL_SEED_LISTINGS;
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_SEED_LISTINGS;
  } catch (err) {
    console.error('Error reading listings file:', err);
    return INITIAL_SEED_LISTINGS;
  }
}

// Helper to write listings
function saveStoredListings(listings: any[]): void {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(listings, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing listings file:', err);
  }
}

// List of real, verified open-weight models available on Hugging Face
const AVAILABLE_MODELS = [
  {
    id: 'Qwen/Qwen2.5-72B-Instruct',
    name: 'Qwen 2.5 72B Instruct',
    provider: 'Hugging Face Inference Providers',
    license: 'Apache 2.0 (Open-Source Permissive)',
    licenseType: 'open-source',
    parameters: '72 Billion',
    multilingualStrength: 'Excellent for English, Bengali (বাংলা), and Hindi (हिन्दी)',
    supportsVision: false,
    visionExplanation: 'Text-only model. Image is validated on client/server and seller visual details are processed without fabricating computer vision.',
    isDefault: true
  },
  {
    id: 'meta-llama/Llama-3.3-70B-Instruct',
    name: 'Llama 3.3 70B Instruct',
    provider: 'Hugging Face Inference Providers',
    license: 'Llama 3.3 Community License (Permissive Open-Weight)',
    licenseType: 'open-weight',
    parameters: '70 Billion',
    multilingualStrength: 'Strong English & Hindi, good Bengali',
    supportsVision: false,
    visionExplanation: 'Text-only model. Product visual notes and maker specifications are utilized directly.',
    isDefault: false
  },
  {
    id: 'mistralai/Mistral-7B-Instruct-v0.3',
    name: 'Mistral 7B Instruct v0.3',
    provider: 'Hugging Face Inference Providers',
    license: 'Apache 2.0 (Open-Source Permissive)',
    licenseType: 'open-source',
    parameters: '7.3 Billion',
    multilingualStrength: 'Fast execution, primary English with basic multilingual support',
    supportsVision: false,
    visionExplanation: 'Text-only lightweight open-source model.',
    isDefault: false
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google GenAI (Direct Multimodal)',
    license: 'Google AI Studio Commercial / Free Tier API',
    licenseType: 'proprietary-api',
    parameters: 'Multimodal Frontier',
    multilingualStrength: 'Native English, Bengali, and Hindi fluency',
    supportsVision: true,
    visionExplanation: 'Native image understanding. Directly inspects uploaded product photography for materials, colors, and textures.',
    isDefault: false
  }
];

// Health & Status endpoint
app.get('/api/health', (req: Request, res: Response) => {
  const hfToken = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '';
  const geminiKey = process.env.GEMINI_API_KEY || '';

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: {
      huggingface: {
        configured: Boolean(hfToken && hfToken.trim().length > 0),
        defaultModel: 'Qwen/Qwen2.5-72B-Instruct',
        license: 'Apache 2.0'
      },
      gemini: {
        configured: Boolean(geminiKey && geminiKey.trim().length > 0 && geminiKey !== 'MY_GEMINI_API_KEY'),
        defaultModel: 'gemini-2.5-flash'
      }
    },
    storage: {
      type: 'JSON Persistent Local Storage',
      location: DATA_FILE,
      itemCount: getStoredListings().length
    }
  });
});

// Models list endpoint
app.get('/api/models', (req: Request, res: Response) => {
  res.json({
    models: AVAILABLE_MODELS
  });
});

// Listings GET endpoint
app.get('/api/listings', (req: Request, res: Response) => {
  const listings = getStoredListings();
  res.json({ listings });
});

// Listings POST endpoint
app.post('/api/listings', (req: Request, res: Response) => {
  const listingData = req.body;
  if (!listingData || !listingData.productName) {
    res.status(400).json({ error: 'Missing product name or listing data' });
    return;
  }

  const listings = getStoredListings();
  const newListing = {
    ...listingData,
    id: listingData.id || `listing-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    createdAt: listingData.createdAt || new Date().toISOString(),
    isSample: false
  };

  const existingIndex = listings.findIndex((l) => l.id === newListing.id);
  if (existingIndex >= 0) {
    listings[existingIndex] = newListing;
  } else {
    listings.unshift(newListing);
  }

  saveStoredListings(listings);
  res.json({ success: true, listing: newListing });
});

// Listings DELETE endpoint
app.delete('/api/listings/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const listings = getStoredListings();
  const filtered = listings.filter((l) => l.id !== id);
  saveStoredListings(filtered);
  res.json({ success: true, remainingCount: filtered.length });
});

// AI Generation Endpoint
app.post('/api/generate', async (req: Request, res: Response) => {
  const {
    productName,
    category,
    targetAudience,
    language = 'English',
    platform = 'Instagram Shop',
    tone = 'friendly',
    visualNotes = '',
    unitCost,
    profitMargin,
    calculatedPrice,
    modelId = 'Qwen/Qwen2.5-72B-Instruct',
    imageBase64,
    customApiKey, // optional user-provided HF or Gemini token from settings
    isSampleRequested = false
  } = req.body;

  if (!productName) {
    res.status(400).json({ error: 'Product name is required.' });
    return;
  }

  // If user explicitly asks for Sample Demo listing, return pre-verified sample data immediately
  if (isSampleRequested) {
    const matchedSample = INITIAL_SEED_LISTINGS.find(
      (s) => s.language.toLowerCase() === language.toLowerCase()
    ) || INITIAL_SEED_LISTINGS[0];

    res.json({
      success: true,
      isSample: true,
      modelUsed: 'Pre-verified Sample Demo (No API Call)',
      modelLicense: 'Verified Curated Dataset',
      listing: {
        title: matchedSample.title,
        description: matchedSample.description,
        features: matchedSample.features,
        searchTags: matchedSample.searchTags,
        instagramCaption: matchedSample.instagramCaption,
        promotionalMessage: matchedSample.promotionalMessage
      }
    });
    return;
  }

  const effectiveHfToken = customApiKey || process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '';
  const effectiveGeminiKey = (customApiKey && customApiKey.startsWith('AIza')) ? customApiKey : process.env.GEMINI_API_KEY;

  const isGeminiSelected = modelId === 'gemini-2.5-flash';

  // Construct comprehensive prompt
  const systemPrompt = `You are LocalSeller AI, an expert e-commerce copywriter and marketing strategist specializing in handmade products, small businesses, and social media commerce (Instagram, WhatsApp, Etsy, etc.).
Your task is to generate complete, high-converting, professional listing copy in the requested language: ${language}.

STRICT REQUIREMENTS:
- Tone: ${tone} (e.g. professional, friendly, or persuasive).
- Target Platform: ${platform}.
- Target Audience: ${targetAudience || 'General online shoppers & gift seekers'}.
- Product Category: ${category || 'Handcrafted & artisanal'}.
- Language: Produce all text in ${language} (if Bengali, use authentic Bangla script; if Hindi, use Devanagari script; if English, use English).
- Do NOT invent or speculate about external market prices or competitor costs. If price is mentioned, refer only to the seller's calculated price: ${calculatedPrice ? `₹/${calculatedPrice}` : 'seller price'}.

Return ONLY valid JSON matching this schema with NO markdown code fences and NO preamble:
{
  "title": "Clear, SEO-friendly, enticing title including key product traits (under 120 chars)",
  "description": "Engaging 2-3 paragraph product description detailing craftsmanship, authenticity, sensory appeal, and usage",
  "features": [
    "Feature 1 with clear customer benefit",
    "Feature 2 with material or craftsmanship detail",
    "Feature 3 with dimensions, care, or practical detail",
    "Feature 4 with sustainability or uniqueness trait"
  ],
  "searchTags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7", "tag8"],
  "instagramCaption": "Ready-to-post Instagram/Social caption with engaging hook, compelling story, price placeholder, call to action (e.g. DM to order), and curated hashtags",
  "promotionalMessage": "Short 1-2 sentence high-impact promotional message for WhatsApp Status, SMS, or Instagram Story sticker"
}`;

  const userPrompt = `Product Details:
- Name: ${productName}
- Category: ${category}
- Visual Details / Materials / Maker Notes: ${visualNotes || 'Handcrafted with attention to detail'}
- Target Audience: ${targetAudience || 'Conscious shoppers and gift seekers'}
- Target Platform: ${platform}
- Desired Tone: ${tone}
- Desired Language: ${language}
${calculatedPrice ? `- Seller Selling Price: ${calculatedPrice}` : ''}`;

  // PATH A: Use Gemini 2.5 Flash if requested or if HF token is missing but Gemini Key is available
  if (isGeminiSelected || (!effectiveHfToken && effectiveGeminiKey && effectiveGeminiKey !== 'MY_GEMINI_API_KEY')) {
    if (!effectiveGeminiKey || effectiveGeminiKey === 'MY_GEMINI_API_KEY') {
      res.status(401).json({
        error: 'NO_CREDENTIALS',
        message: 'No Hugging Face Token (HF_TOKEN) or Gemini API Key configured in environment.',
        helpText: 'To run live open-weight AI generation, provide an HF_TOKEN or test our 1-click Sample Demo which works immediately with zero setup.',
        allowSampleFallback: true
      });
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey: effectiveGeminiKey });
      const contents: any[] = [];

      // If user uploaded an image and using Gemini, provide actual image for vision analysis
      if (imageBase64 && imageBase64.includes('base64,')) {
        const parts = imageBase64.split('base64,');
        const mimeType = imageBase64.substring(imageBase64.indexOf(':') + 1, imageBase64.indexOf(';'));
        contents.push({
          inlineData: {
            mimeType: mimeType || 'image/jpeg',
            data: parts[1]
          }
        });
      }

      contents.push({ text: `${systemPrompt}\n\n${userPrompt}` });

      const geminiResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const responseText = geminiResponse.text || '';
      let parsed;
      try {
        parsed = JSON.parse(responseText.replace(/```json\n?|\n?```/g, '').trim());
      } catch (e) {
        throw new Error('Failed to parse AI output as JSON: ' + responseText.substring(0, 200));
      }

      res.json({
        success: true,
        isSample: false,
        modelUsed: 'gemini-2.5-flash',
        modelLicense: 'Google AI Studio Commercial / Free Tier API',
        supportsVision: Boolean(imageBase64),
        visionNotice: imageBase64 ? 'Analyzed image directly via Gemini 2.5 Flash Multimodal Vision.' : 'Text-based generation.',
        listing: parsed
      });
      return;
    } catch (err: any) {
      console.error('Gemini API inference error:', err);
      res.status(502).json({
        error: 'INFERENCE_ERROR',
        provider: 'Google GenAI',
        message: err.message || 'Gemini inference failed.',
        allowSampleFallback: true
      });
      return;
    }
  }

  // PATH B: Hugging Face Serverless Inference for Open-Weight Models
  if (!effectiveHfToken || effectiveHfToken.trim().length === 0) {
    res.status(401).json({
      error: 'NO_CREDENTIALS',
      message: 'No Hugging Face Token (HF_TOKEN) found in environment.',
      helpText: 'To run live open-weight AI generation, add HF_TOKEN to your .env file or test our 1-click Sample Demo which runs with zero setup.',
      allowSampleFallback: true
    });
    return;
  }

  try {
    // We use the standard Hugging Face Router endpoint (OpenAI compatible)
    // Model choices: Qwen/Qwen2.5-72B-Instruct, meta-llama/Llama-3.3-70B-Instruct, mistralai/Mistral-7B-Instruct-v0.3
    const targetModel = modelId || 'Qwen/Qwen2.5-72B-Instruct';
    const modelMeta = AVAILABLE_MODELS.find((m) => m.id === targetModel) || AVAILABLE_MODELS[0];

    const hfEndpoint = 'https://router.huggingface.co/v1/chat/completions';

    const hfPayload = {
      model: targetModel,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.65,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    };

    const hfResponse = await fetch(hfEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveHfToken.trim()}`
      },
      body: JSON.stringify(hfPayload)
    });

    if (!hfResponse.ok) {
      // If router fails or returns error, read body
      const errorText = await hfResponse.text();
      let errorJson: any;
      try {
        errorJson = JSON.parse(errorText);
      } catch {
        errorJson = { message: errorText };
      }

      console.error(`Hugging Face inference error (${hfResponse.status}):`, errorText);

      // Check if it's 401/403 or model loading
      const isAuthError = hfResponse.status === 401 || hfResponse.status === 403;
      res.status(hfResponse.status).json({
        error: isAuthError ? 'INVALID_HF_TOKEN' : 'HF_INFERENCE_ERROR',
        provider: 'Hugging Face Inference Providers',
        model: targetModel,
        status: hfResponse.status,
        message: errorJson.error || errorJson.message || `Hugging Face API returned HTTP ${hfResponse.status}`,
        helpText: isAuthError
          ? 'Your Hugging Face token was rejected. Please verify token permissions (read access) at hf.co/settings/tokens.'
          : 'The open-weight model might be warming up or rate-limited on the free serverless tier.',
        allowSampleFallback: true
      });
      return;
    }

    const hfData = (await hfResponse.json()) as any;
    const rawContent = hfData?.choices?.[0]?.message?.content || '';

    let parsed;
    try {
      const cleanJson = rawContent.replace(/```json\n?|\n?```/g, '').trim();
      parsed = JSON.parse(cleanJson);
    } catch (parseErr) {
      console.warn('Direct JSON parse failed, trying regex match:', rawContent);
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Could not parse valid JSON from model response.');
      }
    }

    res.json({
      success: true,
      isSample: false,
      modelUsed: targetModel,
      modelLicense: modelMeta.license,
      supportsVision: false,
      visionNotice: imageBase64
        ? `Open-weight text model (${targetModel}, ${modelMeta.license}). Photo validated & stored; copy crafted from seller visual notes without synthetic vision claims.`
        : 'Text-based open-weight generation.',
      listing: parsed
    });
  } catch (err: any) {
    console.error('Inference execution error:', err);
    res.status(500).json({
      error: 'EXECUTION_ERROR',
      message: err.message || 'An unexpected error occurred during AI inference.',
      allowSampleFallback: true
    });
  }
});

// Serve frontend in production or through Vite in development
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // In dev: mount Vite middlewares
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In prod: serve dist files
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`LocalSeller AI server running on http://0.0.0.0:${PORT} [${isProduction ? 'production' : 'development'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
