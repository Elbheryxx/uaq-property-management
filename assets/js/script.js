async function loadSettings() {
  const res = await fetch('data/settings.json');
  const settings = await res.json();
  document.documentElement.style.setProperty('--brand-color', settings.brand_color);
  return settings;
}

const translations = {
  ar: {
    home: 'الرئيسية',
    properties: 'العقارات',
    about: 'من نحن',
    services: 'الخدمات',
    contact: 'تواصل',
    faq: 'الأسئلة الشائعة'
  },
  en: {
    home: 'Home',
    properties: 'Properties',
    about: 'About',
    services: 'Services',
    contact: 'Contact',
    faq: 'FAQ'
  }
};

function applyTranslations(lang) {
  document.body.classList.toggle('en', lang === 'en');
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = translations[lang][key] || el.textContent;
  });
}

function setupLangToggle(settings) {
  const btn = document.getElementById('langToggle');
  if (!btn) return;
  let lang = localStorage.getItem('lang') || settings.default_language;
  applyTranslations(lang);
  btn.addEventListener('click', () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('lang', lang);
    applyTranslations(lang);
  });
}

async function renderProperties() {
  const list = document.getElementById('propertiesList');
  const featured = document.getElementById('featuredList');
  if (!list && !featured) return;
  const res = await fetch('data/properties.json');
  const properties = await res.json();
  if (list) {
    const renderList = (items) => {
      list.innerHTML = '';
      items.forEach(p => list.appendChild(createPropertyCard(p)));
    };
    renderList(properties);
    const purposeFilter = document.getElementById('purposeFilter');
    if (purposeFilter) {
      purposeFilter.addEventListener('change', e => {
        const val = e.target.value;
        const filtered = val ? properties.filter(p => p.purpose === val) : properties;
        renderList(filtered);
      });
    }
  }
  if (featured) {
    featured.innerHTML = '';
    properties.filter(p => p.featured).slice(0, 3).forEach(p => {
      const card = createPropertyCard(p);
      featured.appendChild(card);
    });
  }
}

function createPropertyCard(p) {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${p.images[0]}" alt="${p.title_ar}">
    <div class="container">
      <h3>${p.title_ar}</h3>
      <p>${p.price} ${p.currency}</p>
      <a href="property-details.html?id=${p.id}">تفاصيل</a>
    </div>`;
  return card;
}

async function renderPropertyDetails(settings) {
  const container = document.getElementById('propertyDetails');
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'), 10);
  const res = await fetch('data/properties.json');
  const properties = await res.json();
  const p = properties.find(x => x.id === id);
  if (!p) { container.textContent = 'Not found'; return; }
  container.innerHTML = `
    <h2>${p.title_ar}</h2>
    <p>${p.description_ar}</p>
    <a id="whatsappLink" target="_blank">واتساب</a>
  `;
  const template = settings.whatsapp_template_ar
    .replace('{title_ar}', p.title_ar)
    .replace('{id}', p.id);
  document.getElementById('whatsappLink').href = `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(template)}`;
}

(async () => {
  const settings = await loadSettings();
  setupLangToggle(settings);
  renderProperties();
  renderPropertyDetails(settings);
})();
