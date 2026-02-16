// 客室データストア (localStorage)
const ROOMS_KEY = 'demo_hotel_rooms';

const SEED_ROOMS = [
  {
    id: '1',
    name: '富士（ふじ）',
    type: '和室10畳',
    capacity: '2〜4名',
    price: '¥15,000〜/人',
    description: '窓から富士山の雄大な景色をお楽しみいただける、当館で最も広い和室です。',
    amenities: '富士山ビュー、トイレ付き',
    image: 'images/room-japanese.jpg',
    status: 'published',
  },
  {
    id: '2',
    name: '桜（さくら）',
    type: '和室8畳',
    capacity: '2〜3名',
    price: '¥13,000〜/人',
    description: '四季折々の庭園を望む、落ち着いた雰囲気のお部屋です。',
    amenities: '庭園ビュー、トイレ付き',
    image: 'images/room-japanese.jpg',
    status: 'published',
  },
  {
    id: '3',
    name: '竹（たけ）',
    type: '和室8畳',
    capacity: '2〜3名',
    price: '¥13,000〜/人',
    description: '竹林を望む静かなお部屋。読書や瞑想にぴったりの空間です。',
    amenities: '庭園ビュー、トイレ付き',
    image: 'images/room-japanese.jpg',
    status: 'published',
  },
  {
    id: '4',
    name: '楓（かえで）',
    type: '和洋室',
    capacity: '2〜3名',
    price: '¥17,000〜/人',
    description: 'ツインベッドと畳コーナーを備えた、和と洋のいいとこどりのお部屋です。',
    amenities: 'ツインベッド+畳コーナー、富士山ビュー',
    image: 'images/room-hybrid.jpg',
    status: 'published',
  },
  {
    id: '5',
    name: '月（つき）',
    type: '和洋室 露天風呂付き',
    capacity: '2名',
    price: '¥20,000〜/人',
    description: 'プライベートな露天風呂から富士山を望む、当館最上級のお部屋です。',
    amenities: '露天風呂付き、富士山ビュー',
    image: 'images/room-private-bath.jpg',
    status: 'published',
  },
];

const RoomsStore = {
  _cache: null,

  async init() {
    try {
      const res = await fetch('data/rooms.json');
      if (res.ok) {
        this._cache = await res.json();
        return;
      }
    } catch (e) { /* fetch失敗時はlocalStorageフォールバック */ }
    this._cache = null;
  },

  _getAll() {
    if (this._cache) return [...this._cache];
    const raw = localStorage.getItem(ROOMS_KEY);
    if (!raw) {
      localStorage.setItem(ROOMS_KEY, JSON.stringify(SEED_ROOMS));
      return [...SEED_ROOMS];
    }
    return JSON.parse(raw);
  },

  getPublished() {
    return this._getAll().filter(r => r.status === 'published');
  },

  getAll() {
    return this._getAll();
  },

  getById(id) {
    return this._getAll().find(r => r.id === id) || null;
  },

  save(item) {
    const all = this._getAll();
    if (item.id) {
      const idx = all.findIndex(r => r.id === item.id);
      if (idx >= 0) {
        all[idx] = { ...all[idx], ...item };
      }
    } else {
      item.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      item.status = item.status || 'published';
      all.push(item);
    }
    localStorage.setItem(ROOMS_KEY, JSON.stringify(all));
    return item;
  },

  delete(id) {
    const all = this._getAll().filter(r => r.id !== id);
    localStorage.setItem(ROOMS_KEY, JSON.stringify(all));
  },
};

if (typeof module !== 'undefined') module.exports = RoomsStore;
