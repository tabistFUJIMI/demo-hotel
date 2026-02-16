// メインJS: スクロールアニメーション、ヘッダー制御、動的コンテンツ
document.addEventListener('DOMContentLoaded', async () => {
  // --- Store Init (JSON fetch) ---
  const inits = [];
  if (typeof NewsStore !== 'undefined' && NewsStore.init) inits.push(NewsStore.init());
  if (typeof RoomsStore !== 'undefined' && RoomsStore.init) inits.push(RoomsStore.init());
  await Promise.all(inits);

  // --- Scroll Header ---
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('header--scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // --- Mobile Menu ---
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('is-open');
        nav.classList.remove('is-open');
      });
    });
  }

  // --- Scroll Reveal ---
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => observer.observe(el));
  }

  // --- Re-observe helper ---
  function reobserve(container) {
    container.querySelectorAll('.reveal').forEach(el => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); obs.unobserve(entry.target); }
        });
      }, { threshold: 0.1 });
      obs.observe(el);
    });
  }

  // --- Dynamic News (Top page) ---
  const newsList = document.getElementById('news-list');
  if (newsList && typeof NewsStore !== 'undefined') {
    const news = NewsStore.getPublished().slice(0, 5);
    newsList.innerHTML = news.map(n => {
      const date = new Date(n.createdAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');
      const tagClass = n.category === '宿泊プラン' ? 'tag-plan' : 'tag-info';
      return `<li>
        <a href="news.html?id=${n.id}">
          <span class="news-date">${date}</span>
          <span class="news-tag ${tagClass}">${n.category}</span>
          <span class="news-text">${n.title}</span>
        </a>
      </li>`;
    }).join('');
  }

  // --- Dynamic Rooms List (Top page) ---
  const roomsList = document.getElementById('rooms-list');
  if (roomsList && typeof RoomsStore !== 'undefined') {
    const rooms = RoomsStore.getPublished();
    roomsList.innerHTML = rooms.map(r => `
      <div class="room-card reveal">
        <div class="room-card-img">
          <img src="${r.image}" alt="${r.name}" loading="lazy">
        </div>
        <div class="room-card-body">
          <h3 class="room-card-name">${r.name}</h3>
          <p class="room-card-type">${r.type}</p>
          <p class="room-card-capacity">定員: ${r.capacity}</p>
          <p class="room-card-price">${r.price}</p>
          <p class="room-card-desc">${r.description}</p>
          <p class="room-card-amenities">${r.amenities}</p>
        </div>
      </div>
    `).join('');
    reobserve(roomsList);
  }
});
