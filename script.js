// ===================================================================
// Sinewave Inverters — main script
// ===================================================================

/* ---------- PRELOADER (shows for a minimum ~2s so the intro animation actually plays) ---------- */
(() => {
  const pre = document.getElementById('preloader');
  const MIN_DISPLAY = 2000;
  const shownAt = performance.now();
  const hide = () => {
    const elapsed = performance.now() - shownAt;
    const wait = Math.max(MIN_DISPLAY - elapsed, 0);
    setTimeout(() => pre.classList.add('hidden'), wait);
  };
  if (document.readyState === 'complete') hide();
  else window.addEventListener('load', hide);
  // Safety net: never let the preloader trap a visitor if 'load' is slow
  setTimeout(() => pre.classList.add('hidden'), 4000);
})();

/* ---------- MOBILE MENU ---------- */
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuToggle.classList.remove('open');
  navLinks.classList.remove('open');
}));

/* ---------- STICKY NAV ON SCROLL ---------- */
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- SCROLL REVEAL ---------- */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

/* ---------- COUNT-UP STATS ---------- */
function animateCount(el) {
  const target = parseFloat(el.dataset.count);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const countEls = document.querySelectorAll('.count');
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.6 });
countEls.forEach(el => countObserver.observe(el));

/* ---------- HERO ENERGY PARTICLES ---------- */
const particleWrap = document.getElementById('particles');
const PARTICLE_COUNT = 22;
for (let i = 0; i < PARTICLE_COUNT; i++) {
  const p = document.createElement('span');
  p.className = 'particle';
  const left = Math.random() * 100;
  const size = 2 + Math.random() * 3;
  const duration = 8 + Math.random() * 10;
  const delay = Math.random() * 12;
  const drift = (Math.random() * 60 - 30) + 'px';
  p.style.left = left + '%';
  p.style.width = size + 'px';
  p.style.height = size + 'px';
  p.style.setProperty('--drift', drift);
  p.style.animationDuration = duration + 's';
  p.style.animationDelay = delay + 's';
  particleWrap.appendChild(p);
}

/* ---------- PRODUCT CATALOG ----------
   Battery-only packs — only these configurations are actually manufactured:
   100Ah -> 12V only
   200Ah -> 12V, 24V
   500Ah -> 12V, 24V, 48V

   Complete inverter systems (battery + inverter unit, Bluetooth app control):
   1500VA, 2500VA, 5000VA
------------------------------------------------------------------ */
const CATALOG = {
  100: [12],
  200: [12, 24],
  500: [12, 24, 48]
};
const INVERTERS = [1500, 2500, 5000];
const grid = document.getElementById('productGrid');

function batteryCard(cap, v) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="cap-row">
      <span class="cap">${cap}Ah</span>
      <span class="volt">${v}V</span>
    </div>
    <div class="series">${cap} Ah Battery Pack</div>
    <div class="spec-tags">
      <span>Pure Sine Wave</span>
      <span>LiFePO4</span>
      <span>5yr Warranty</span>
    </div>
    <div class="price-row">
      <span class="price">Price on enquiry</span>
      <a href="#contact" class="enquire">Enquire →</a>
    </div>
  `;
  return card;
}

function inverterCard(va) {
  const card = document.createElement('div');
  card.className = 'product-card';
  card.innerHTML = `
    <div class="cap-row">
      <span class="cap">${va}VA</span>
      <span class="volt">Complete</span>
    </div>
    <div class="series">Complete Inverter System</div>
    <div class="spec-tags">
      <span>Pure Sine Wave</span>
      <span>LiFePO4</span>
      <span>Bluetooth App</span>
      <span>5yr Warranty</span>
    </div>
    <div class="price-row">
      <span class="price">Price on enquiry</span>
      <a href="#contact" class="enquire">Enquire →</a>
    </div>
  `;
  return card;
}

function renderProducts(filter) {
  grid.innerHTML = '';
  const cards = [];

  if (filter === 'inverter') {
    INVERTERS.forEach(va => cards.push(inverterCard(va)));
  } else if (filter === 'all') {
    Object.keys(CATALOG).forEach(cap => CATALOG[cap].forEach(v => cards.push(batteryCard(cap, v))));
    INVERTERS.forEach(va => cards.push(inverterCard(va)));
  } else {
    (CATALOG[filter] || []).forEach(v => cards.push(batteryCard(filter, v)));
  }

  cards.forEach((card, i) => {
    card.style.animationDelay = (i * 0.07) + 's';
    grid.appendChild(card);
  });
}
renderProducts('all');

document.getElementById('filterRow').addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(btn.dataset.filter);
});

/* ---------- AI SUPPORT CHAT WIDGET ---------- */
(() => {
  const widget = document.getElementById('chatWidget');
  const launcher = document.getElementById('chatLauncher');
  const panel = document.getElementById('chatPanel');
  const messagesEl = document.getElementById('chatMessages');
  const typingEl = document.getElementById('chatTyping');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const sendBtn = form.querySelector('.chat-send');

  const GREETING = "Hi! I'm the Sinewave Inverters assistant. Ask me about our LiFePO4 pure sine wave batteries and complete inverter systems — capacities, warranty, technology, or how to become a dealer. For pricing or to place an order, tap the WhatsApp icon above anytime. 🙂";

  let history = []; // { role: 'user' | 'assistant', text }
  let opened = false;
  let sending = false;

  function addMessage(role, text) {
    const div = document.createElement('div');
    div.className = 'msg ' + (role === 'user' ? 'user' : role === 'error' ? 'bot error' : 'bot');
    div.textContent = text;
    messagesEl.appendChild(div);
    messagesEl.scrollTop = messagesEl.scrollHeight;
    return div;
  }

  function openChat() {
    widget.classList.add('open');
    launcher.setAttribute('aria-expanded', 'true');
    opened = true;
    if (messagesEl.children.length === 0) {
      addMessage('bot', GREETING);
    }
    setTimeout(() => input.focus(), 150);
  }

  function closeChat() {
    widget.classList.remove('open');
    launcher.setAttribute('aria-expanded', 'false');
  }

  launcher.addEventListener('click', () => {
    widget.classList.contains('open') ? closeChat() : openChat();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && widget.classList.contains('open')) closeChat();
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text || sending) return;

    addMessage('user', text);
    history.push({ role: 'user', text });
    input.value = '';
    sending = true;
    sendBtn.disabled = true;
    typingEl.hidden = false;
    messagesEl.scrollTop = messagesEl.scrollHeight;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: history.slice(-10) })
      });
      const data = await res.json();

      typingEl.hidden = true;

      if (!res.ok || !data.reply) {
        addMessage('error', (data && data.error) || "Sorry, something went wrong. Please try WhatsApp instead.");
      } else {
        addMessage('bot', data.reply);
        history.push({ role: 'assistant', text: data.reply });
      }
    } catch (err) {
      typingEl.hidden = true;
      addMessage('error', "Couldn't reach support right now. Please try WhatsApp instead.");
    } finally {
      sending = false;
      sendBtn.disabled = false;
      input.focus();
    }
  });
})();

/* ---------- CONTACT FORM -> WHATSAPP ---------- */
const WA_NUMBER = '916376309311';
const form = document.getElementById('enquiryForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const type = document.getElementById('type').value;
  const msg = document.getElementById('msg').value.trim();

  const lines = [
    `Hi Sinewave Inverters, I'd like to enquire.`,
    `Name: ${name}`,
    `Phone: ${phone}`,
    `I am a: ${type}`,
    msg ? `Message: ${msg}` : null
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join('\n'));
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank', 'noopener');
});
