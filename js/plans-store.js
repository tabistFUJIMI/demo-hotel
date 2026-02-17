// 宿泊プランデータストア (JSON file + localStorage fallback)
const PLANS_KEY = 'demo_hotel_plans';

const SEED_PLANS = [
  {
    id: '1',
    title: '【春限定】桜花見プラン',
    description: '桜の名所めぐりと季節の懐石料理を楽しむ春の特別プラン。お部屋に桜のアレンジメントをご用意いたします。',
    category: '季節限定',
    price: 18000,
    image: 'images/room-japanese.jpg',
    status: 'published',
    createdAt: '2026-02-01T09:00:00',
    updatedAt: '2026-02-01T09:00:00',
  },
  {
    id: '2',
    title: 'カップル記念日プラン',
    description: '露天風呂付き客室「月」でのご宿泊、記念日ケーキ、スパークリングワイン付き。大切な方との特別なひとときを。',
    category: '記念日',
    price: 25000,
    image: 'images/room-private-bath.jpg',
    status: 'published',
    createdAt: '2026-01-15T09:00:00',
    updatedAt: '2026-01-15T09:00:00',
  },
  {
    id: '3',
    title: 'ファミリー富士山満喫プラン',
    description: 'お子様歓迎！和室10畳「富士」でゆったり。お子様用浴衣・アメニティ完備。夕食はお部屋食でお気兼ねなく。',
    category: 'ファミリー',
    price: 15000,
    image: 'images/room-japanese.jpg',
    status: 'published',
    createdAt: '2025-12-10T09:00:00',
    updatedAt: '2025-12-10T09:00:00',
  },
];

const PlansStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/plans.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(PLANS_KEY);
    if (!raw) {
      localStorage.setItem(PLANS_KEY, JSON.stringify(SEED_PLANS));
      return [...SEED_PLANS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll()
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAll() {
    return this._getAll().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getById(id) {
    return this._getAll().find(p => p.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    const now = new Date().toISOString();
    if (item.id) {
      const idx = all.findIndex(p => p.id === item.id);
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
    localStorage.setItem(PLANS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(p => p.id !== id);
    localStorage.setItem(PLANS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = PlansStore;
