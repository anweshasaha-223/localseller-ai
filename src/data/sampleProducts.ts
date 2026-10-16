import { Language, Platform, Tone, GeneratedListingContent } from '../types';

export interface SampleProductItem {
  id: string;
  name: string;
  category: string;
  language: Language;
  platform: Platform;
  tone: Tone;
  unitCost: number;
  profitMargin: number;
  platformFeePercent: number;
  targetAudience: string;
  visualNotes: string;
  imageUrl: string;
  pregenerated: GeneratedListingContent;
}

export const SAMPLE_PRODUCTS: SampleProductItem[] = [
  {
    id: 'sample-terracotta',
    name: 'Handcrafted Terracotta Chai Cups (Set of 4)',
    category: 'Handmade Crafts',
    language: 'English',
    platform: 'Instagram Shop',
    tone: 'friendly',
    unitCost: 160,
    profitMargin: 45,
    platformFeePercent: 0,
    targetAudience: 'Tea connoisseurs, eco-friendly home hosts, Diwali & housewarming gift seekers',
    visualNotes: 'Natural terracotta red-brown with hand-carved subtle earthen grooves. Smooth polished rim, unglazed organic texture.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    pregenerated: {
      title: 'Handcrafted Terracotta Chai Cup Set | Artisanal Clay Kulhad (Pack of 4)',
      description: 'Elevate your daily evening chai ritual with our 100% natural, hand-thrown terracotta cups. Crafted by generational clay artisans in West Bengal, each cup retains the authentic, earthy aroma of pure mother earth. Completely unglazed, non-toxic, and naturally porous to keep your chai piping hot. Perfect for mindful mornings or gifting fellow chai lovers.',
      features: [
        'Authentic Kulhad Experience: Imparts a natural earthen aroma and flavor to warm tea',
        'Generational Craftsmanship: Hand-thrown on traditional potter wheels by local artisans',
        '100% Eco-Friendly & Chemical-Free: Pure river clay with zero synthetic glazes or lead',
        'Ergonomic Comfort: 150ml volume with balanced heat retention and cozy hand-feel',
        'Safe & Washable: Reusable, microwave-safe, and biodegradable'
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
    }
  },
  {
    id: 'sample-silk-scarf',
    name: 'হাতে বোনা খাঁটি তসর সিল্ক স্কার্ফ (Handwoven Pure Tussar Silk Scarf)',
    category: 'Fashion & Textiles',
    language: 'Bengali',
    platform: 'Facebook Marketplace',
    tone: 'persuasive',
    unitCost: 650,
    profitMargin: 50,
    platformFeePercent: 0,
    targetAudience: 'উৎসব ও ঘরোয়া অনুষ্ঠানে ঐতিহ্যবাহী সাজ পছন্দ করা রুচিশীল নারী',
    visualNotes: 'প্রাকৃতিক সোনালী-ঘিয়ে তসর রেশম, লাল ও নীল সুতোর নিপুণ কাঁথা স্টিচ নকশা, প্রান্তভাগে ঐতিহ্যবাহী রেশম টার্সেল।',
    imageUrl: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=600&q=80',
    pregenerated: {
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
    }
  },
  {
    id: 'sample-neem-soap',
    name: 'शुद्ध नीम और हल्दी हस्तनिर्मित साबुन (Pure Neem & Turmeric Handmade Soap)',
    category: 'Organic Beauty & Wellness',
    language: 'Hindi',
    platform: 'WhatsApp Business Catalog',
    tone: 'professional',
    unitCost: 65,
    profitMargin: 55,
    platformFeePercent: 0,
    targetAudience: 'प्राकृतिक त्वचा देखभाल पसंद करने वाले, मुंहासे और संवेदनशील त्वचा वाले ग्राहक',
    visualNotes: 'हल्के हरे और सुनहरे पीले रंग की प्राकृतिक मार्बल्ड बनावट। साबुन पर सूखा नीम का पत्ता और प्राकृतिक हर्बल सुगंध।',
    imageUrl: 'https://images.unsplash.com/photo-1607006314644-8cb23e8022b7?auto=format&fit=crop&w=600&q=80',
    pregenerated: {
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
  },
  {
    id: 'sample-brass-earrings',
    name: 'Handcrafted Brass Mandala Filigree Earrings',
    category: 'Jewelry & Accessories',
    language: 'English',
    platform: 'Etsy',
    tone: 'persuasive',
    unitCost: 180,
    profitMargin: 60,
    platformFeePercent: 6.5,
    targetAudience: 'Boho fashion lovers, ethnic jewelry collectors, sustainable style enthusiasts',
    visualNotes: 'Antique gold matte brass, detailed concentric mandala cutout patterns with subtle turquoise bead droplets. Lightweight hollow-back design.',
    imageUrl: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=600&q=80',
    pregenerated: {
      title: 'Artisan Brass Mandala Drop Earrings | Antique Gold Boho Statement Jewelry',
      description: 'Add a touch of timeless spiritual elegance to your collection with our Handcrafted Brass Mandala Earrings. Inspired by sacred temple geometry, each pair is intricately hand-cut and etched by master metalsmiths. Finished in a warm antique gold patina with hypoallergenic stainless steel ear-hooks, they offer statement presence without heavy weight on your ears.',
      features: [
        'Hand-Cut Sacred Mandala Design: Symbolizing harmony and inner balance',
        'Ultra-Lightweight Comfort: Weighs under 12 grams per pair for all-day wear',
        'High-Grade Recycled Brass: Sustainable alloy treated with anti-tarnish protective lacquer',
        'Hypoallergenic Ear Hooks: Nickel-free and lead-free for sensitive ears',
        'Artisan Gift Packaging: Shipped in a reusable organic cotton jewelry pouch'
      ],
      searchTags: [
        'brass mandala earrings',
        'boho statement jewelry',
        'handmade antique earrings',
        'ethnic drop earrings',
        'hypoallergenic brass jewelry',
        'spiritual jewelry gift',
        'lightweight dangle earrings',
        'etsy handmade jewelry'
      ],
      instagramCaption: `Wear the harmony of sacred geometry wherever you wander. ✨

Our handcrafted Brass Mandala Earrings catch the golden hour light just right. Master metalsmiths carefully etch every tiny curve from recycled brass before finishing with an anti-tarnish seal.

✨ Weight: Only 12 grams (statement look, cloud-light feel!)
✨ Price: $18.99 / ₹549 with free gift pouch

Tap the photo to shop or send a DM to claim yours today.

#BohoJewelry #MandalaArt #HandmadeEarrings #BrassJewelry #EtsyFinds #SlowFashion #ArtisanMade`,
      promotionalMessage: 'Cloud-light statement earrings inspired by sacred mandalas! Hand-etched brass with anti-tarnish seal. Claim yours now with free pouch!'
    }
  }
];
