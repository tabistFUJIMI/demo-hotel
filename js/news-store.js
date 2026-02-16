// お知らせデータストア (localStorage)
const NEWS_KEY = 'demo_hotel_news';

const SEED_NEWS = [
  {
    id: '1',
    title: 'ホームページを開設しました',
    body: '<p>この度、ふじみDXラボ温泉 ゆ縁の宿のホームページを開設いたしました。</p><p>客室やお料理、温泉の情報など、最新情報をお届けしてまいります。今後ともよろしくお願いいたします。</p>',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2026-02-10T09:00:00',
    updatedAt: '2026-02-10T09:00:00',
  },
  {
    id: '2',
    title: '冬の特別プラン「富士見の湯」のご案内',
    body: '<p>この冬限定の特別プランが始まりました。露天風呂付き客室「月」で、雪化粧の富士山を眺めながらの贅沢なひとときをお過ごしください。</p><p>地元食材をふんだんに使った特別懐石もご用意しております。</p>',
    category: '宿泊プラン',
    status: 'published',
    createdAt: '2026-02-01T09:00:00',
    updatedAt: '2026-02-01T09:00:00',
  },
  {
    id: '3',
    title: '年末年始の営業について',
    body: '<p>年末年始は通常営業です。12/31〜1/3は特別料金となります。</p><p>ご予約はお早めにお願いいたします。</p>',
    category: 'お知らせ',
    status: 'published',
    createdAt: '2025-12-20T09:00:00',
    updatedAt: '2025-12-20T09:00:00',
  },
];

const NewsStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/news.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(NEWS_KEY);
    if (!raw) {
      localStorage.setItem(NEWS_KEY, JSON.stringify(SEED_NEWS));
      return [...SEED_NEWS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(n => n.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAll() {
    return this._getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return this._getAll().find(n => n.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(n => n.id === item.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item, updatedAt: now };
      }
    } else {
      item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      item.createdAt = now;
      item.updatedAt = now;
      item.status = item.status || 'published';
      all.push(item);
    }
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(n => n.id !== id);
    localStorage.setItem(NEWS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = NewsStore;
