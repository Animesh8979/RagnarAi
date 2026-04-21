# 🌿 Spice Route — Premium Regional Indian Snacks

> **IILM University | AI Marketing Course (AIMC) | Academic Project Submission**
> **Student:** Anhad Vikal | **Roll No:** 2331233 | **Deadline:** 21st April 2026

---

## 📌 What Is This?

Spice Route is a premium Indian snacks brand website showcasing AI-driven marketing strategies. This is a **fully functional demo** — not just a homepage — featuring:

- 🛒 **Full Cart + Checkout Flow** with 3 payment options (COD, UPI, Card)
- 🗺️ **Interactive SVG Map of India** with animated delivery truck
- 🤖 **AI Recommendation Engine** — a 3-step preference quiz
- 💬 **Built-in AI Chatbot** for product discovery & allergen queries
- 🔍 **Ingredient Transparency Modals** for every product
- 📊 **Visitor Analytics Dashboard** (GoatCounter)
- 📧 **Email Capture** with Formspree integration
- 🛡️ **Trust & Transparency Section** with crisis protocol

---

## 🚀 How to Deploy on GitHub Pages (FREE — Anyone Can Access)

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `spiceroute-website` (or any name)
3. Set it to **Public** (so anyone can access)
4. Click **Create repository**

### Step 2: Push Your Code
Open terminal/PowerShell in `D:\project website Ai` and run:
```bash
cd "D:\project website Ai"
git init
git add -A
git commit -m "Spice Route website"
git remote add origin https://github.com/YOUR_USERNAME/spiceroute-website.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under **Source**, select **Deploy from a branch**
4. Choose **Branch: main**, **Folder: / (root)**
5. Click **Save**
6. Wait 1-2 minutes

### Step 4: Access Your Live Site
Your site will be live at:
```
https://YOUR_USERNAME.github.io/spiceroute-website/
```

**⚠️ IMPORTANT:** This URL is PUBLIC. Anyone with the link can access it — no GitHub account needed. Share this link with your professors and panel judges.

### Already Pushed (Backup)
The code is also on branch `spiceroute-site` of `Animesh8979/RagnarShortsAi`:
```
https://github.com/Animesh8979/RagnarShortsAi/tree/spiceroute-site
```

---

## 📧 Where Do Email Addresses Go?

The recommendation quiz captures email addresses via **Formspree**.

### How to Set It Up:
1. Go to [formspree.io](https://formspree.io) and create a **free account**
2. Click **+ New Form** → name it "Spice Route Leads"
3. You'll get a form endpoint like: `https://formspree.io/f/xyzabc123`
4. Open `index.html` and find line with `action="https://formspree.io/f/xlganjkg"`
5. Replace `xlganjkg` with **your form ID**
6. Save and redeploy

### Where to See Submissions:
- Go to [formspree.io/forms](https://formspree.io/forms)
- Click your form
- All email submissions appear with:
  - **Email address**
  - **Product recommendation** (which products were suggested)
  - **Timestamp**
- You can also get **email notifications** for each submission
- Free tier: **50 submissions/month**

---

## 📊 Where Do Visitor Logs Go?

The site uses **GoatCounter** — a free, privacy-friendly analytics tool (no cookies, GDPR compliant).

### How to Set It Up:
1. Go to [goatcounter.com/signup](https://www.goatcounter.com/signup)
2. Enter site code: `spiceroute`
3. Enter your email and create account
4. Your dashboard will be at: **https://spiceroute.goatcounter.com**

### What You'll See in the Dashboard:
| Data | Description |
|------|-------------|
| **Page Views** | Total visits to each section |
| **Unique Visitors** | How many different people visited |
| **Browsers** | Chrome, Edge, Safari, Firefox breakdown |
| **Devices** | Desktop vs Mobile vs Tablet |
| **Locations** | Country and city of visitors |
| **Referrers** | Where visitors came from (Google, direct, etc.) |
| **Screen Sizes** | What screen resolutions visitors use |

**No cookie banners needed.** GoatCounter is fully privacy-compliant.

---

## 🛒 How the Payment Gateway Works

This is a **demo checkout** — no real money is charged. The checkout flow demonstrates:

1. **Add products to cart** → Cart drawer slides out from the right
2. **Review cart** → See items, prices, total, remove items
3. **Proceed to Checkout** → Full checkout form opens:
   - Shipping details (name, phone, email, address, city, PIN)
   - Payment method selection (COD / UPI / Card)
4. **Place Order** → Animated success screen with order ID
5. **"This is a demo"** notice is clearly shown

> For a real payment gateway, you would integrate Razorpay (₹0 setup, 2% per transaction) by adding their checkout script. This is outside the scope of an academic project.

---

## 🚨 How the Crisis Alert System Works

Designed to demonstrate "Hour 0" incident response times, the Crisis Response Protocol operates entirely outside of normal email queues.
1. **The Trigger:** A prominent red "🚨 Report a Crisis" link in the footer signals radical transparency.
2. **The Form:** Located at `crisis-alert/index.html`, customers enter their Full Name, Batch Number, and Issue Description.
3. **Automated WhatsApp Handoff:** JavaScript instantly formats the report into a structured incident ticket and leverages the `wa.me/` API to route the emergency message directly to the Safety Officer's WhatsApp number (`+91 8979472393`) for immediate intervention.

---

## 🧠 Akkio Predictive Modelling

An external AutoML layer (Akkio) was integrated to predict user conversion probabilities.
- **Accuracy:** The model achieved a **78.4% predictive accuracy**, establishing a baseline for 'high-intent' customer identification. This proof-of-concept is captured in `akkio_predictor_accuracy_screenshot.png`.
- **Business Value:** Enables hyper-precise down-funnel targeting to drastically optimize digital ad spend allocation for the brand.

---

## 📝 AIMC Project Methodology (Mission Summary)

The integration of AI tools across 6 distinct missions forms the core of this project:
1. **Social Media Campaign:** Claude AI prompt sequencing, meticulous cultural curation, and Canva AI creatives.
2. **Social Listening:** Brand24 tracking, Julius AI sentiment analysis, and comprehensive BuzzSumo benchmarking.
3. **Crisis Management:** WhatsApp alert prototype, crisis response templates, and strategic counterfactual analysis.
4. **Customer Analytics:** Claude-synthesized dataset generation and Julius AI-powered RFM segmentation.
5. **Predictive Modelling:** Expanding CRM to 800 records and training via Akkio (78.4% conversion modeling).
6. **Website and Chatbot:** Dark-mode architectural deployment (GitHub Pages), SVG interaction mapping, and Tidio knowledge-base configuration.

*(A detailed methodology document mapping out all 6 missions is provided in `AIMC_Project_Submission_Summary.md`).*

---

## 🗺️ Interactive Features Summary

| Feature | How It Works |
|---------|-------------|
| **Hero Animation** | Logo stroke-draw reveal → character-by-character title → floating product rotation |
| **Floating Particles** | 40 golden spice dots drift across the hero |
| **SVG India Map** | 8 region dots with hover tooltips, click to scroll |
| **Delivery Truck** | Animated SVG truck travels Punjab → Rajasthan → Deccan → Malabar → Kerala |
| **Product Cards** | Hover lift, tricolor bottom bar, artisan reveal |
| **Transparency Modal** | Full ingredients, allergens, sourcing for each product |
| **AI Quiz** | 3 questions → score-based recommendation → email capture |
| **Chatbot** | Keyword AI with quick-reply buttons |
| **Trust Counters** | Animated count-up numbers when scrolled into view |
| **Cart Drawer** | Slide-out panel with product images and remove buttons |
| **Checkout** | Full-form with 3 payment methods |
| **Hamburger Menu** | Animated 3-line → X toggle for mobile |

---

## 🎨 Design System

| Element | Value |
|---------|-------|
| Display Font | Cormorant Garamond (serif) |
| Body Font | DM Sans (sans-serif) |
| Saffron | `#D4750A` |
| Deep Red | `#8B1A1A` |
| Forest Green | `#2D5016` |
| Ivory | `#F5F0E8` |
| Gold | `#C9A227` |
| Background Pattern | Mughal diamond tilework |
| Section Dividers | Gold ornamental SVG |

---

## 📦 Products

| # | Product | Region | Price |
|---|---------|--------|-------|
| 1 | Malabar Pepper Cashews | Malabar Coast | ₹495 |
| 2 | Deccan Lentil Crisps | Deccan Plateau | ₹245 |
| 3 | Rajasthani Ker Sangri | Rajasthan | ₹375 |
| 4 | Punjabi Mixture | Punjab | ₹195 |
| 5 | Himalayan Seed Mix | Himalayas | ₹445 |
| 6 | Vidarbha Chilli Mix | Vidarbha | ₹225 |
| 7 | Kerala Banana Chips | Kerala | ₹175 |
| 8 | Onam Rice Snack | Onam Coast | ₹215 |

---

## 📁 Files

```
D:\project website Ai\
├── index.html      (28KB)  — Complete page structure
├── styles.css      (48KB)  — Premium design system
├── app.js          (39KB)  — All interactivity
├── favicon.svg     (237B)  — Branded icon
└── README.md       (this file)
```

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, animations, glassmorphism, gradients
- **Vanilla JavaScript** — No frameworks, no build step
- **Google Fonts** — Cormorant Garamond + DM Sans
- **GoatCounter** — Visitor analytics
- **Formspree** — Email capture
- **CloudFront** — Product images (CDN-hosted)

**Zero dependencies. No npm. No build step. Just upload and it works.**

---

## 📝 Submission Notes

This project demonstrates the application of AI tools in:
1. **Brand Strategy** — Connoisseur India positioning (not tourist India)
2. **Product Marketing** — Region-specific storytelling for 8 products
3. **Customer Engagement** — AI recommendation quiz + chatbot
4. **Data Collection** — Email capture with personalized offers
5. **Trust Building** — Radical transparency with ingredient/allergen data
6. **Analytics** — Privacy-compliant visitor tracking

Built with AI assistance. All product images are AI-generated mockups for demonstration purposes.

---

*© 2026 Spice Route | IILM University AIMC Project*
