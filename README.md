# LocalSeller AI

**LocalSeller AI** is a production-ready, responsive web application engineered for small business owners, Instagram boutique sellers, craft makers, and local artisans. It turns product photos and maker notes into ready-to-use e-commerce listings, SEO tags, Instagram captions, and WhatsApp promotional messages.

---

## Key Features

1. **Photo Upload & Previews**:
   - Client & server validation for file formats (JPEG, PNG, WEBP, GIF) and file sizes (< 5MB).
   - High-resolution preview with instant reset or image replacement.
2. **Multi-Platform Listing Generation**:
   - Platforms: Instagram Shop, WhatsApp Business Catalog, Etsy, Amazon, Facebook Marketplace, Shopify.
   - Tones: Professional, Friendly, Persuasive.
   - Outputs: SEO Product Title, Rich Description, Key Benefit Bullets, Search Keywords / Hashtags, Social Media Caption (with emojis, CTA, and price placeholder), and 1-2 sentence Quick Promo Message.
3. **Multilingual Support**:
   - **English**
   - **Bengali (বাংলা)**: Authentic Bengali phrasing and terminology for East Indian and Bangladeshi artisans.
   - **Hindi (हिन्दी)**: Natural Hindi marketing prose and Devanagari script for pan-India sellers.
4. **Transparent Cost-Based Pricing Calculator**:
   - Strictly calculates selling prices based on seller-provided direct unit cost, material costs, labor, and desired profit margin %.
   - **Never invents market prices** or hallucinates competitor pricing. Transparent formula display with psychological rounding suggestions (e.g. ₹299, $19.99).
5. **Real Open-Weight AI Architecture**:
   - Directly integrates open-weight models via Hugging Face Inference Providers.
   - Verified models & licenses:
     - **`Qwen/Qwen2.5-72B-Instruct`**: Apache 2.0 license. Outstanding multilingual performance in English, Hindi, and Bengali.
     - **`meta-llama/Llama-3.3-70B-Instruct`**: Llama 3.3 Community License. High reasoning capability.
     - **`mistralai/Mistral-7B-Instruct-v0.3`**: Apache 2.0 license. Lightweight and responsive.
     - **`gemini-2.5-flash`** (Optional Google GenAI provider): Provides direct multimodal image vision inspection when selected.
   - Honest Vision Protocol: Open-weight text LLMs explicitly state that photos are validated and held as display assets, while copy is generated from seller product specifications without making fake claims of computer vision analysis.
6. **Zero-Friction Sample Demo**:
   - If no API credentials are provided or if an inference provider is temporarily unreachable, users can immediately launch pre-verified Sample Demonstrations in English, Bengali, or Hindi, clearly labeled with a `[Sample Demo Data]` badge.
7. **Listing Dashboard & Local Persistence**:
   - Persistent storage in JSON database (`data/listings.json`).
   - Copy individual sections or copy all text in one click.
   - Download listings as `.txt` or `.md` files.
   - Save drafts, filter by platform, search listings, and view business usage metrics.

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Default / Source |
| :--- | :--- | :--- |
| `HF_TOKEN` | Hugging Face User Access Token (read access). Used for open-weight model inference (`Qwen/Qwen2.5-72B-Instruct`). | Get free at [hf.co/settings/tokens](https://huggingface.co/settings/tokens) |
| `GEMINI_API_KEY` | Optional. Google GenAI API key for direct image vision analysis. | Provided via AI Studio or Google AI Studio |
| `PORT` | Local web server port | `3000` |
| `NODE_ENV` | Environment mode (`development` or `production`) | `development` |

*Note: Tokens are securely managed in the Node.js Express backend and are never leaked to the client bundle.*

---

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run in Development**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

3. **Production Build & Execution**:
   ```bash
   npm run build
   npm start
   ```

---

## AI Model Licenses & Attributions

- **Qwen 2.5 72B Instruct**: Developed by Alibaba Cloud. Released under the **Apache 2.0** permissive license.
- **Llama 3.3 70B Instruct**: Developed by Meta. Released under the **Llama 3.3 Community License**.
- **Mistral 7B Instruct v0.3**: Developed by Mistral AI. Released under the **Apache 2.0** permissive license.
- **Gemini 2.5 Flash**: Google LLC. Accessible via Google GenAI SDK.
