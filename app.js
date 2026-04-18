/* =========================================== */
/*  SPICE ROUTE — Application Logic            */
/*  All product data, quiz, chatbot, map, etc. */
/* =========================================== */

// ============================================
// PRODUCT DATA
// ============================================
const PRODUCTS = [
  {
    id: 0,
    name: "Malabar Pepper Cashews",
    region: "Malabar Coast",
    regionId: "malabar",
    script: "മലബാർ",
    price: 495,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-malabar-pepper-cashews-9VPRCL9p3Td5CqYFtdpzcT.webp",
    story: "Hand-picked from the spice gardens of Wayanad, each cashew is roasted slow with estate-grown Tellicherry pepper.",
    artisan: "Sourced from Rajan Kumar's plantation, Wayanad District",
    ingredients: "Premium W320 Cashew Nuts, Cold-pressed Coconut Oil, Tellicherry Black Pepper (estate-grown), Himalayan Pink Salt, Turmeric Extract",
    allergens: "Tree Nuts (Cashew)",
    color: "#2D5016",
    tags: ["bold", "gifting", "festive"],
    dietary: ["gluten-free"],
    flavor: "Bold pepper heat meets buttery cashew richness"
  },
  {
    id: 1,
    name: "Deccan Lentil Crisps",
    region: "Deccan Plateau",
    regionId: "deccan",
    script: "दख्खन",
    price: 245,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-deccan-lentil-crisps-UF7nJWeDcu8ryyPrDQykQu.webp",
    story: "Sun-baked lentils from the red soils of Telangana, stone-ground with cumin and curry leaf — the way it's been done for centuries.",
    artisan: "Made by Priya Devi's Women's Cooperative, Adilabad",
    ingredients: "Red Masoor Dal, Cumin Seeds, Curry Leaves, Asafoetida (Hing), Rice Bran Oil, Sea Salt, Red Chilli Flakes",
    allergens: "None",
    color: "#8B1A1A",
    tags: ["complex", "everyday", "health"],
    dietary: ["vegan", "gluten-free", "nut-free"],
    flavor: "Earthy lentil crunch with warm cumin undertones"
  },
  {
    id: 2,
    name: "Rajasthani Ker Sangri",
    region: "Rajasthan",
    regionId: "rajasthan",
    script: "राजस्थान",
    price: 375,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-rajasthani-ker-sangri-hQm2HbkNnuzuKNadLM7zhr.webp",
    story: "A desert delicacy of wild-foraged ker berries and sangri beans, preserved with mustard oil and Mathania chillies from the Thar.",
    artisan: "Foraged by Tribal Communities, Barmer District",
    ingredients: "Ker Berries (wild-harvested), Sangri Beans, Mustard Oil (cold-pressed), Mathania Red Chilli, Dried Mango Powder, Turmeric, Nigella Seeds",
    allergens: "Mustard",
    color: "#D4750A",
    tags: ["complex", "gifting", "festive"],
    dietary: ["vegan", "gluten-free", "nut-free"],
    flavor: "Tangy desert heritage with smoky chilli depth"
  },
  {
    id: 3,
    name: "Punjabi Mixture",
    region: "Punjab",
    regionId: "punjab",
    script: "ਪੰਜਾਬ",
    price: 195,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-punjabi-mixture-J9JvpWfkaqjQM4T2cczuYd.webp",
    story: "The legendary Amritsari mixture — sev, peanuts, and chickpea noodles tossed in chaat masala that's been the family recipe for four generations.",
    artisan: "From Harbhajan Singh's family namkeen shop, Amritsar",
    ingredients: "Gram Flour (Besan), Peanuts, Rice Flakes, Sev (Gram Flour Noodles), Chaat Masala, Cumin, Black Salt, Vegetable Oil, Curry Leaves",
    allergens: "Peanuts, Gluten",
    color: "#C9A227",
    tags: ["bold", "everyday"],
    dietary: [],
    flavor: "Classic Punjabi tang with crunchy textural layers"
  },
  {
    id: 4,
    name: "Himalayan Seed Mix",
    region: "Himalayan Foothills",
    regionId: "himalayas",
    script: "हिमालय",
    price: 445,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-himalayan-seed-mix-SSR5anxXpfKRtbF2Wdkcne.webp",
    story: "A high-altitude superfood blend of Himalayan hemp seeds, flax, and pumpkin kernels, lightly roasted with mountain herbs.",
    artisan: "Harvested by Kaml Devi's farming collective, Uttarakhand",
    ingredients: "Hemp Seeds, Pumpkin Seeds, Flax Seeds, Sunflower Seeds, Himalayan Herbs (Timur, Jakhya), Pink Salt, Extra Virgin Olive Oil",
    allergens: "Seeds",
    color: "#2D5016",
    tags: ["light", "health", "everyday"],
    dietary: ["vegan", "gluten-free", "nut-free"],
    flavor: "Clean alpine freshness with nutty seed richness"
  },
  {
    id: 5,
    name: "Vidarbha Chilli Mix",
    region: "Vidarbha",
    regionId: "vidarbha",
    script: "विदर्भ",
    price: 225,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-vidarbha-chilli-mix-4SsZzmAZxwLHGpBgwSYhYi.webp",
    story: "A bold, fiery trail mix from the chilli heartland of Maharashtra — dried Byadgi chillies, roasted peanuts, and toasted gram.",
    artisan: "From the Deshmukh Family Farm, Nagpur",
    ingredients: "Roasted Peanuts, Toasted Bengal Gram, Byadgi Dried Chillies, Jaggery, Sesame Seeds, Curry Leaves, Rock Salt",
    allergens: "Peanuts",
    color: "#8B1A1A",
    tags: ["bold", "everyday", "festive"],
    dietary: ["vegan", "gluten-free"],
    flavor: "Fiery Byadgi heat tempered by sweet jaggery"
  },
  {
    id: 6,
    name: "Kerala Banana Chips",
    region: "Kerala",
    regionId: "kerala",
    script: "കേരളം",
    price: 175,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-kerala-banana-chips-YKaoDSVmLYsXquUaasKgmR.webp",
    story: "Nendran bananas sliced paper-thin and fried in virgin coconut oil — the golden standard of Kerala's snacking tradition.",
    artisan: "Made by Lakshmi Amma's family workshop, Thiruvananthapuram",
    ingredients: "Nendran Banana (Kerala-grown), Virgin Coconut Oil (cold-pressed), Turmeric Powder, Sea Salt",
    allergens: "None",
    color: "#D4750A",
    tags: ["light", "everyday", "gifting"],
    dietary: ["vegan", "gluten-free", "nut-free"],
    flavor: "Sweet plantain with golden coconut oil crispness"
  },
  {
    id: 7,
    name: "Onam Rice Snack",
    region: "Onam Coast",
    regionId: "onam",
    script: "ഓണം",
    price: 215,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663540909458/5bmi393BqpsJVEPKK7mVLb/spice-route-onam-rice-snack-mgnE8pjYXX5YUGfVxqu6yZ.webp",
    story: "Festive rice flakes seasoned with coconut, curry leaf, and black mustard — the taste of Onam celebrations, year round.",
    artisan: "Traditional recipe from the Nair family kitchen, Kochi",
    ingredients: "Flattened Rice (Poha), Grated Coconut, Curry Leaves, Black Mustard Seeds, Green Chillies, Turmeric, Coconut Oil, Roasted Cashew Pieces",
    allergens: "Tree Nuts (Cashew)",
    color: "#2D5016",
    tags: ["sweet", "festive", "gifting"],
    dietary: ["gluten-free"],
    flavor: "Festive coconut sweetness with mustard crackle"
  }
];

// ============================================
// TYPING EFFECT FOR HERO
// ============================================
function typeHeroTitle() {
  const el = document.getElementById('hero-title');
  const text = "Eight Regions.\nOne India.";
  el.innerHTML = '';
  let i = 0;
  const lines = text.split('\n');
  let html = '';
  let charIndex = 0;
  
  lines.forEach((line, lineIdx) => {
    line.split('').forEach(char => {
      if (char === ' ') {
        html += ' ';
      } else {
        html += `<span class="char" style="animation-delay: ${charIndex * 40 + 400}ms">${char}</span>`;
      }
      charIndex++;
    });
    if (lineIdx < lines.length - 1) {
      html += '<br>';
      charIndex++;
    }
  });
  el.innerHTML = html;
}

// ============================================
// LOGO REVEAL
// ============================================
function initLogoReveal() {
  const overlay = document.getElementById('logo-reveal');
  setTimeout(() => {
    overlay.classList.add('hidden');
    typeHeroTitle();
  }, 2200);
}

// ============================================
// SCROLL NAV
// ============================================
function initScrollNav() {
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

// ============================================
// SCROLL REVEAL
// ============================================
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ============================================
// PRODUCT CATALOGUE
// ============================================
function renderProducts() {
  const grid = document.getElementById('product-grid');
  grid.innerHTML = PRODUCTS.map(p => `
    <div class="product-card fade-up" data-product-id="${p.id}" id="product-${p.id}">
      <div class="pc-image-wrap">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <span class="pc-region-tag" style="background: ${p.color}">${p.region}</span>
      </div>
      <div class="pc-body">
        <h3 class="pc-name">${p.name}</h3>
        <p class="pc-story">${p.story}</p>
        <p class="pc-artisan">${p.artisan}</p>
        <div class="pc-footer">
          <span class="pc-price">₹${p.price}</span>
          ${p.allergens !== 'None' ? `<span class="pc-allergen">⚠ ${p.allergens}</span>` : ''}
        </div>
        <div class="pc-actions">
          <button class="add-to-cart-btn" data-id="${p.id}" onclick="addToCart(${p.id})">
            <span class="cart-text">Add to Cart</span>
            <span class="cart-check">✓ Added</span>
          </button>
          <button class="transparency-badge" onclick="openModal(${p.id})" title="Ingredient Transparency">🔍</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ============================================
// CART SYSTEM (Full Drawer + Checkout)
// ============================================
let cart = [];

function addToCart(id) {
  const btn = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
  
  // Check if already in cart
  if (cart.find(item => item.id === id)) {
    openCartDrawer();
    return;
  }
  
  cart.push({ id, qty: 1 });
  btn.classList.add('added');
  
  const badge = document.getElementById('cart-badge');
  badge.textContent = cart.length;
  badge.classList.add('bump');
  setTimeout(() => badge.classList.remove('bump'), 300);
  
  renderCartDrawer();
  openCartDrawer();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  
  const badge = document.getElementById('cart-badge');
  badge.textContent = cart.length;
  
  // Reset button
  const btn = document.querySelector(`.add-to-cart-btn[data-id="${id}"]`);
  if (btn) btn.classList.remove('added');
  
  renderCartDrawer();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + PRODUCTS[item.id].price * item.qty, 0);
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items');
  const footer = document.getElementById('cart-footer');
  const empty = document.getElementById('cart-empty');
  
  if (cart.length === 0) {
    container.innerHTML = '<p class="cart-empty">Your cart is empty. Explore our collection!</p>';
    footer.style.display = 'none';
    return;
  }
  
  container.innerHTML = cart.map(item => {
    const p = PRODUCTS[item.id];
    return `
      <div class="cart-item">
        <img src="${p.image}" alt="${p.name}" />
        <div class="cart-item-info">
          <div class="cart-item-name">${p.name}</div>
          <div class="cart-item-region">${p.region}</div>
        </div>
        <div class="cart-item-price">₹${p.price}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${p.id})">✕</button>
      </div>
    `;
  }).join('');
  
  footer.style.display = 'block';
  document.getElementById('cart-total-amount').textContent = `₹${getCartTotal()}`;
}

function openCartDrawer() {
  document.getElementById('cart-drawer').classList.add('open');
  document.getElementById('cart-overlay').classList.add('open');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

function initCartDrawer() {
  document.getElementById('nav-cart').addEventListener('click', openCartDrawer);
  document.getElementById('cart-drawer-close').addEventListener('click', closeCartDrawer);
  document.getElementById('cart-overlay').addEventListener('click', closeCartDrawer);
  document.getElementById('checkout-btn').addEventListener('click', openCheckout);
  
  // Checkout close
  document.getElementById('checkout-close').addEventListener('click', closeCheckout);
  document.getElementById('checkout-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'checkout-overlay') closeCheckout();
  });
  
  // Payment option toggle
  document.querySelectorAll('.payment-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
    });
  });
  
  // Checkout form
  document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();
    placeOrder();
  });
}

function openCheckout() {
  closeCartDrawer();
  
  const summary = document.getElementById('checkout-summary');
  summary.innerHTML = cart.map(item => {
    const p = PRODUCTS[item.id];
    return `<div class="checkout-summary-item"><span>${p.name}</span><span>₹${p.price}</span></div>`;
  }).join('') + `<div class="checkout-summary-total"><span>Total</span><span>₹${getCartTotal()}</span></div>`;
  
  document.getElementById('checkout-total-btn').textContent = `₹${getCartTotal()}`;
  document.getElementById('checkout-overlay').classList.add('active');
  document.getElementById('order-success').style.display = 'none';
  document.querySelector('.checkout-body').style.display = 'block';
}

function closeCheckout() {
  document.getElementById('checkout-overlay').classList.remove('active');
}

function placeOrder() {
  const orderId = 'SR-' + Date.now().toString(36).toUpperCase();
  document.getElementById('order-id-display').textContent = orderId;
  
  document.querySelector('.checkout-body').style.display = 'none';
  document.getElementById('order-success').style.display = 'block';
  
  // Clear cart
  cart = [];
  document.getElementById('cart-badge').textContent = '0';
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => btn.classList.remove('added'));
  renderCartDrawer();
}

// ============================================
// INGREDIENT MODAL
// ============================================
function openModal(id) {
  const p = PRODUCTS[id];
  const modal = document.getElementById('ingredient-modal');
  
  document.getElementById('modal-title').textContent = p.name;
  document.getElementById('modal-ingredients').innerHTML = `
    <h4>Full Ingredient List</h4>
    <p>${p.ingredients}</p>
  `;
  document.getElementById('modal-allergens').innerHTML = `
    <h4>Allergen Declaration</h4>
    <p>${p.allergens === 'None' 
      ? '✅ No major allergens present.' 
      : `<span class="allergen-highlight">⚠ Contains: ${p.allergens}</span><br>Manufactured in a facility that also processes peanuts, tree nuts, and sesame.`
    }</p>
  `;
  document.getElementById('modal-source').innerHTML = `
    <h4>Sourcing</h4>
    <p>${p.artisan}</p>
    <p>Region: ${p.region} (${p.script})</p>
    <p>Batch tested on 17 April 2026 — FSSAI Compliant.</p>
  `;
  
  modal.classList.add('active');
}

function initModal() {
  document.getElementById('modal-close').addEventListener('click', () => {
    document.getElementById('ingredient-modal').classList.remove('active');
  });
  
  document.getElementById('ingredient-modal').addEventListener('click', (e) => {
    if (e.target.id === 'ingredient-modal') {
      document.getElementById('ingredient-modal').classList.remove('active');
    }
  });
}

// ============================================
// INDIA MAP — Desktop Tooltips
// ============================================
function initMap() {
  const tooltip = document.getElementById('map-tooltip');
  const dots = document.querySelectorAll('.map-dot');
  
  dots.forEach(dot => {
    dot.addEventListener('mouseenter', (e) => {
      const region = dot.dataset.region;
      const productIdx = parseInt(dot.dataset.product);
      const p = PRODUCTS[productIdx];
      
      tooltip.querySelector('.tooltip-region').textContent = p.region;
      tooltip.querySelector('.tooltip-flavor').textContent = p.flavor;
      tooltip.querySelector('.tooltip-img').src = p.image;
      tooltip.querySelector('.tooltip-img').alt = p.name;
      tooltip.querySelector('.tooltip-name').textContent = p.name;
      tooltip.querySelector('.tooltip-price').textContent = `₹${p.price}`;
      
      // Position tooltip
      const svg = document.querySelector('.india-map-svg');
      const rect = svg.getBoundingClientRect();
      const circle = dot.querySelector('.dot-core');
      const cx = parseFloat(circle.getAttribute('cx'));
      const cy = parseFloat(circle.getAttribute('cy'));
      const scale = rect.width / 600;
      
      tooltip.style.left = `${cx * scale + 20}px`;
      tooltip.style.top = `${cy * scale - 40}px`;
      tooltip.classList.add('visible');
    });
    
    dot.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
    
    dot.addEventListener('click', () => {
      const productIdx = parseInt(dot.dataset.product);
      const card = document.getElementById(`product-${productIdx}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('highlight-pulse');
        setTimeout(() => card.classList.remove('highlight-pulse'), 2200);
      }
    });
  });
  
  // Mobile cards
  renderMobileMapCards();
}

function renderMobileMapCards() {
  const container = document.getElementById('india-map-mobile');
  container.innerHTML = PRODUCTS.map(p => `
    <div class="region-card-mobile" onclick="scrollToProduct(${p.id})">
      <div class="rc-name">${p.region}</div>
      <div class="rc-script">${p.script}</div>
      <div class="rc-flavor">${p.flavor}</div>
      <div class="rc-product">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div>
          <div class="rc-pname">${p.name}</div>
          <div class="rc-pprice">₹${p.price}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function scrollToProduct(id) {
  const card = document.getElementById(`product-${id}`);
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.add('highlight-pulse');
    setTimeout(() => card.classList.remove('highlight-pulse'), 2200);
  }
}

// ============================================
// RECOMMENDATION QUIZ
// ============================================
let quizAnswers = {};

function initQuiz() {
  const tiles = document.querySelectorAll('.quiz-tile');
  
  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const step = tile.closest('.quiz-step');
      const stepNum = parseInt(step.dataset.step);
      
      // Deselect others in same step
      step.querySelectorAll('.quiz-tile').forEach(t => t.classList.remove('selected'));
      tile.classList.add('selected');
      
      quizAnswers[stepNum] = tile.dataset.value;
      
      // Update progress dots
      updateProgressDots(stepNum);
      
      // Advance
      setTimeout(() => {
        if (stepNum < 3) {
          step.classList.remove('active');
          document.querySelector(`.quiz-step[data-step="${stepNum + 1}"]`).classList.add('active');
        }
        if (stepNum === 3) {
          document.getElementById('quiz-submit').style.display = 'block';
        }
      }, 350);
    });
  });
  
  document.getElementById('find-snack-btn').addEventListener('click', runRecommendation);
  
  // Check returning visitor
  const lastRec = localStorage.getItem('sr_recommendation');
  if (lastRec) {
    const rv = document.getElementById('returning-visitor');
    rv.style.display = 'block';
    document.getElementById('returning-msg').textContent = `Last time we recommended ${lastRec}. Let's see what we pick today.`;
  }
}

function updateProgressDots(currentStep) {
  const dots = document.querySelectorAll('.progress-dot');
  dots.forEach(dot => {
    const num = parseInt(dot.dataset.dot);
    dot.classList.remove('active', 'done');
    if (num < currentStep) dot.classList.add('done');
    else if (num === currentStep) dot.classList.add('active');
    // Future steps stay default
    if (currentStep < 3) {
      // Mark next as active after delay
      setTimeout(() => {
        dots.forEach(d => {
          const n = parseInt(d.dataset.dot);
          d.classList.remove('active', 'done');
          if (n <= currentStep) d.classList.add('done');
          if (n === currentStep + 1) d.classList.add('active');
        });
      }, 350);
    } else {
      // All done
      setTimeout(() => {
        dots.forEach(d => d.classList.add('done'));
      }, 350);
    }
  });
}

function runRecommendation() {
  const btn = document.getElementById('find-snack-btn');
  btn.classList.add('loading');
  
  setTimeout(() => {
    const flavor = quizAnswers[1]; // bold, light, sweet, complex
    const occasion = quizAnswers[2]; // everyday, gifting, health, festive
    const dietary = quizAnswers[3]; // nut-free, vegan, gluten-free, none
    
    let scored = PRODUCTS.map(p => {
      let score = 0;
      if (p.tags.includes(flavor)) score += 3;
      if (p.tags.includes(occasion)) score += 2;
      if (dietary === 'none' || p.dietary.includes(dietary)) score += 1;
      if (dietary !== 'none' && !p.dietary.includes(dietary)) score -= 5;
      return { ...p, score };
    });
    
    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 3);
    
    const taglines = [
      `Your palate speaks ${flavor}. We listened.`,
      `For your ${occasion} moment — curated with intention.`,
      `Flavour matched. Region authenticated. Yours to discover.`
    ];
    
    document.getElementById('result-tagline').textContent = taglines[Math.floor(Math.random() * taglines.length)];
    
    document.getElementById('result-products').innerHTML = top.map(p => `
      <div class="result-product-card" onclick="scrollToProduct(${p.id})">
        <img src="${p.image}" alt="${p.name}" loading="lazy" />
        <div class="rpc-name">${p.name}</div>
        <div class="rpc-price">₹${p.price}</div>
      </div>
    `).join('');
    
    document.getElementById('rec-hidden').value = top.map(p => p.name).join(', ');
    
    btn.classList.remove('loading');
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('recommendation-result').style.display = 'block';
    
    // Trigger fade-up
    setTimeout(() => {
      document.querySelector('.result-card').classList.add('visible');
    }, 100);
    
    // Save for returning visitor
    localStorage.setItem('sr_recommendation', top[0].name);
  }, 1800);
}

// Email form
function initEmailForm() {
  const form = document.getElementById('email-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('rec-email').value;
    const rec = document.getElementById('rec-hidden').value;
    
    // Send to Formspree
    fetch(form.action, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, recommendation: rec })
    }).then(() => {
      form.style.display = 'none';
      document.getElementById('email-success').style.display = 'block';
    }).catch(() => {
      form.style.display = 'none';
      document.getElementById('email-success').style.display = 'block';
    });
  });
}

// ============================================
// CHATBOT
// ============================================
const CHATBOT_RESPONSES = {
  greeting: {
    text: "Namaste! 🙏 I'm the Spice Route Assistant. I can help you discover regional snacks, check allergens, or find the perfect gift. What can I help with?",
    quickReplies: ["Show me products", "Check allergens", "Help me pick a gift", "Tell me about regions"]
  },
  products: {
    text: "We offer 8 premium regional snacks. Here are our bestsellers:",
    followUp: "Which region interests you? Or I can recommend based on your taste preferences!",
    quickReplies: ["Malabar Coast", "Rajasthan", "Punjab", "Something spicy"]
  },
  allergens: {
    text: "Allergen safety is our top priority. Our products are tested and clearly labelled. Which product would you like allergen info for?",
    quickReplies: ["Pepper Cashews", "Lentil Crisps", "Punjabi Mixture", "Himalayan Seeds"]
  },
  gifting: {
    text: "Great taste in gifting! 🎁 For a premium gift, I'd suggest our Malabar Pepper Cashews (₹495) or the Rajasthani Ker Sangri (₹375) — both come with artisan provenance cards. The Onam Rice Snack is perfect for festive occasions.",
    quickReplies: ["Tell me more about Cashews", "View all products", "Dietary restrictions"]
  },
  regions: {
    text: "India's snacking heritage spans 8 distinct regions, each with a unique flavour profile. From the pepper-rich Malabar Coast to the desert delicacies of Rajasthan — every snack tells a story of its land.",
    quickReplies: ["Malabar Coast", "Deccan Plateau", "Rajasthan", "View the map"]
  },
  spicy: {
    text: "You like it hot! 🌶️ Try our Vidarbha Chilli Mix (₹225) — made with Byadgi dried chillies and jaggery. Or go for the Malabar Pepper Cashews (₹495) for a more refined heat with Tellicherry pepper.",
    quickReplies: ["Add Chilli Mix to cart", "Tell me about Malabar", "Something milder"]
  }
};

function initChatbot() {
  const trigger = document.getElementById('chatbot-trigger');
  const chatWindow = document.getElementById('chatbot-window');
  const closeBtn = document.getElementById('chatbot-close');
  const sendBtn = document.getElementById('chatbot-send');
  const input = document.getElementById('chatbot-input');
  
  trigger.addEventListener('click', () => {
    chatWindow.style.display = 'flex';
    trigger.style.display = 'none';
    addBotMessage(CHATBOT_RESPONSES.greeting.text, CHATBOT_RESPONSES.greeting.quickReplies);
  });
  
  closeBtn.addEventListener('click', () => {
    chatWindow.style.display = 'none';
    trigger.style.display = 'block';
  });
  
  sendBtn.addEventListener('click', handleChatInput);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatInput();
  });
}

function handleChatInput() {
  const input = document.getElementById('chatbot-input');
  const msg = input.value.trim();
  if (!msg) return;
  
  addUserMessage(msg);
  input.value = '';
  
  // Process
  setTimeout(() => {
    const response = processChat(msg.toLowerCase());
    addBotMessage(response.text, response.quickReplies);
    if (response.followUp) {
      setTimeout(() => addBotMessage(response.followUp), 800);
    }
  }, 500 + Math.random() * 500);
}

function processChat(msg) {
  // Product queries
  if (msg.includes('product') || msg.includes('snack') || msg.includes('show')) {
    return CHATBOT_RESPONSES.products;
  }
  if (msg.includes('allergen') || msg.includes('allergy') || msg.includes('nut') || msg.includes('gluten')) {
    return CHATBOT_RESPONSES.allergens;
  }
  if (msg.includes('gift') || msg.includes('present')) {
    return CHATBOT_RESPONSES.gifting;
  }
  if (msg.includes('region') || msg.includes('map') || msg.includes('india')) {
    return CHATBOT_RESPONSES.regions;
  }
  if (msg.includes('spicy') || msg.includes('hot') || msg.includes('chilli') || msg.includes('heat')) {
    return CHATBOT_RESPONSES.spicy;
  }
  
  // Specific products
  if (msg.includes('malabar') || msg.includes('cashew') || msg.includes('pepper cashew')) {
    const p = PRODUCTS[0];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  if (msg.includes('lentil') || msg.includes('deccan')) {
    const p = PRODUCTS[1];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  if (msg.includes('rajasthan') || msg.includes('ker') || msg.includes('sangri')) {
    const p = PRODUCTS[2];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  if (msg.includes('punjab') || msg.includes('mixture')) {
    const p = PRODUCTS[3];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  if (msg.includes('himalaya') || msg.includes('seed')) {
    const p = PRODUCTS[4];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  if (msg.includes('vidarbha') || msg.includes('chilli mix')) {
    const p = PRODUCTS[5];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  if (msg.includes('banana') || msg.includes('kerala') || msg.includes('chips')) {
    const p = PRODUCTS[6];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  if (msg.includes('onam') || msg.includes('rice snack')) {
    const p = PRODUCTS[7];
    return { text: `${p.name} (₹${p.price}) — ${p.story} Allergens: ${p.allergens}.`, quickReplies: ["Add to cart", "See all products"] };
  }
  
  // Cart actions
  if (msg.includes('add') && msg.includes('cart')) {
    return { text: "I'd love to add that! For now, you can click the 'Add to Cart' button on any product card above. Each product has a gold button ready for you. 🛒", quickReplies: ["View products", "Help me choose"] };
  }
  
  // Mild/light preferences
  if (msg.includes('mild') || msg.includes('light') || msg.includes('gentle')) {
    return { text: "For a gentler palate, try our Kerala Banana Chips (₹175) — pure Nendran banana in coconut oil. Or the Himalayan Seed Mix (₹445) for a clean, nutty flavour.", quickReplies: ["Banana Chips", "Himalayan Seeds", "View all"] };
  }
  
  // Price
  if (msg.includes('cheap') || msg.includes('affordable') || msg.includes('budget')) {
    return { text: "Best value picks: Kerala Banana Chips at ₹175, Punjabi Mixture at ₹195, and Onam Rice Snack at ₹215. Premium taste, honest pricing.", quickReplies: ["Banana Chips", "Punjabi Mixture", "View all"] };
  }
  
  // Vegan
  if (msg.includes('vegan')) {
    const vegan = PRODUCTS.filter(p => p.dietary.includes('vegan'));
    return { text: `We have ${vegan.length} vegan options: ${vegan.map(p => p.name).join(', ')}. All clearly labelled! 🌱`, quickReplies: vegan.slice(0, 3).map(p => p.name.split(' ').slice(0, 2).join(' ')) };
  }
  
  // Default
  return {
    text: "I can help with product info, allergen details, regional stories, gifting suggestions, or dietary recommendations. What interests you most?",
    quickReplies: ["Show products", "Check allergens", "Gift ideas", "Explore regions"]
  };
}

function addBotMessage(text, quickReplies) {
  const container = document.getElementById('chatbot-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg bot';
  div.textContent = text;
  
  if (quickReplies && quickReplies.length) {
    const qr = document.createElement('div');
    qr.className = 'chat-quick-replies';
    quickReplies.forEach(reply => {
      const btn = document.createElement('button');
      btn.className = 'quick-reply-btn';
      btn.textContent = reply;
      btn.addEventListener('click', () => {
        addUserMessage(reply);
        // Remove quick replies
        qr.remove();
        setTimeout(() => {
          const response = processChat(reply.toLowerCase());
          addBotMessage(response.text, response.quickReplies);
        }, 400);
      });
      qr.appendChild(btn);
    });
    div.appendChild(qr);
  }
  
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function addUserMessage(text) {
  const container = document.getElementById('chatbot-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg user';
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ============================================
// ACCORDION (Crisis Response)
// ============================================
function initAccordion() {
  const toggle = document.getElementById('crisis-toggle');
  const content = document.getElementById('crisis-content');
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    content.classList.toggle('open');
  });
}

// ============================================
// FOOTER ABOUT TOGGLE
// ============================================
function initFooterAbout() {
  document.getElementById('built-with-ai-toggle').addEventListener('click', (e) => {
    e.preventDefault();
    const about = document.getElementById('footer-about');
    about.style.display = about.style.display === 'none' ? 'block' : 'none';
  });
}

// ============================================
// HERO PRODUCT ROTATION
// ============================================
function initHeroRotation() {
  const img = document.getElementById('hero-product-img');
  let current = 0;
  
  setInterval(() => {
    current = (current + 1) % PRODUCTS.length;
    img.style.opacity = 0;
    img.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      img.src = PRODUCTS[current].image;
      img.alt = PRODUCTS[current].name;
      img.style.opacity = 1;
      img.style.transform = 'scale(1)';
    }, 400);
  }, 4000);
  
  img.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
}

// ============================================
// TRUST STATS COUNTER ANIMATION
// ============================================
function initTrustCounters() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;
  
  let animated = false;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        stats.forEach(stat => {
          const target = parseInt(stat.dataset.count);
          const duration = 1500;
          const start = performance.now();
          
          function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out quad
            const eased = 1 - (1 - progress) * (1 - progress);
            const current = Math.round(eased * target);
            stat.textContent = current;
            
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          }
          
          requestAnimationFrame(animate);
        });
      }
    });
  }, { threshold: 0.3 });
  
  const trustSection = document.querySelector('.trust-stats');
  if (trustSection) observer.observe(trustSection);
}

// ============================================
// FLOATING SPICE PARTICLES (Hero Canvas)
// ============================================
function initParticles() {
  const canvas = document.getElementById('hero-particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const particles = [];
  const count = 40;
  
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.2 - 0.1,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() > 0.5 ? '201,162,39' : '212,117,10' // gold or saffron
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.opacity})`;
      ctx.fill();
      
      // Subtle glow
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue}, ${p.opacity * 0.15})`;
      ctx.fill();
      
      p.x += p.dx;
      p.y += p.dy;
      
      // Wrap around
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
    });
    
    requestAnimationFrame(draw);
  }
  
  draw();
}

// ============================================
// HAMBURGER MOBILE MENU
// ============================================
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;
  
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });
  
  // Close on link click
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

// ============================================
// INIT
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  initLogoReveal();
  initScrollNav();
  renderProducts();
  initScrollReveal();
  initMap();
  initQuiz();
  initEmailForm();
  initChatbot();
  initModal();
  initAccordion();
  initFooterAbout();
  initHeroRotation();
  initTrustCounters();
  initParticles();
  initHamburger();
  initCartDrawer();
});
