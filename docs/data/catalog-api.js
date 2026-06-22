/**
 * KicksList Static-First Catalog Layer
 * ------------------------------------
 * The site loads its full sneaker catalog from a baked static file
 * (data/catalog.json, ~20k products). This means the product browsing
 * experience renders instantly and can NEVER white-screen, even if the
 * backend API is asleep or unreachable.
 *
 * `klFetch` is a drop-in replacement for `fetch` used by the frontend:
 *   - Read-only catalog routes (products, categories, search, related…)
 *     are resolved locally from the baked catalog.
 *   - Dynamic routes (price history, price alerts, auth…) are forwarded
 *     to the live backend, so server-powered features still work when the
 *     backend is up — and degrade gracefully when it isn't.
 */
(function () {
  let CATALOG = null;
  let loadPromise = null;

  // Inline fallback guarantees something always renders, even if catalog.json fails.
  const FALLBACK = (window.KicksListFeatured || []).slice();

  function ensureCatalog() {
    if (CATALOG) return Promise.resolve(CATALOG);
    if (loadPromise) return loadPromise;
    loadPromise = fetch('data/catalog.json')
      .then((r) => {
        if (!r.ok) throw new Error('catalog fetch failed');
        return r.json();
      })
      .then((data) => {
        CATALOG = Array.isArray(data) ? data : [];
        return CATALOG;
      })
      .catch(() => {
        // Network/host failure — fall back to the inline snapshot so the UI still works.
        CATALOG = FALLBACK.slice();
        return CATALOG;
      });
    return loadPromise;
  }

  // Kick off the load immediately so data is warm by the time the UI needs it.
  ensureCatalog();

  // ---- Response shim: mimics the parts of fetch() Response the app uses ----
  function jsonResponse(payload, status) {
    return {
      ok: status ? status < 400 : true,
      status: status || 200,
      json: () => Promise.resolve(payload),
    };
  }

  // ---- Helpers mirroring the backend's response shapes exactly ----
  const lc = (s) => (s || '').toString().toLowerCase();
  const priceOf = (p) => (p.lowest != null ? p.lowest : p.price);

  function listProducts(sp) {
    const page = parseInt(sp.get('page') || '1', 10);
    const limit = Math.min(parseInt(sp.get('limit') || '20', 10), 100);
    const brand = sp.get('brand');
    const category = sp.get('category');
    const q = sp.get('q');
    const sort = sp.get('sort');
    const minPrice = sp.get('minPrice');
    const maxPrice = sp.get('maxPrice');

    let items = CATALOG.slice();
    if (brand) items = items.filter((p) => lc(p.brand) === lc(brand));
    if (category) items = items.filter((p) => lc(p.category) === lc(category));
    if (q) {
      const needle = lc(q);
      items = items.filter(
        (p) => lc(p.name).includes(needle) || lc(p.brand).includes(needle)
      );
    }
    if (minPrice) items = items.filter((p) => priceOf(p) != null && priceOf(p) >= Number(minPrice));
    if (maxPrice) items = items.filter((p) => priceOf(p) != null && priceOf(p) <= Number(maxPrice));

    if (sort === 'price-low') items.sort((a, b) => (priceOf(a) || 0) - (priceOf(b) || 0));
    else if (sort === 'price-high') items.sort((a, b) => (priceOf(b) || 0) - (priceOf(a) || 0));
    else if (sort === 'newest')
      items.sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));

    const total = items.length;
    const start = (page - 1) * limit;
    return jsonResponse({
      products: items.slice(start, start + limit),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  }

  function featured() {
    return jsonResponse({ products: CATALOG.filter((p) => p.featured).slice(0, 10) });
  }
  function trending() {
    return jsonResponse({ products: CATALOG.filter((p) => p.trending).slice(0, 10) });
  }
  function newDrops() {
    const sorted = CATALOG.filter((p) => p.releaseDate)
      .slice()
      .sort((a, b) => (b.releaseDate || '').localeCompare(a.releaseDate || ''));
    const seen = {};
    const out = [];
    for (const p of sorted) {
      if (!seen[p.brand] && out.length < 8) {
        seen[p.brand] = true;
        out.push(p);
      }
    }
    return jsonResponse({ products: out });
  }
  function categories() {
    const counts = {};
    for (const p of CATALOG) counts[p.category] = (counts[p.category] || 0) + 1;
    const list = Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return jsonResponse({ categories: list });
  }
  function batch(sp) {
    const ids = (sp.get('ids') || '')
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    const set = new Set(ids);
    return jsonResponse({ products: CATALOG.filter((p) => set.has(p.id)) });
  }
  function productById(id) {
    const p = CATALOG.find((x) => x.id === id);
    if (!p) return jsonResponse({ error: 'Product not found' }, 404);
    return jsonResponse({ product: p });
  }
  function related(id) {
    const p = CATALOG.find((x) => x.id === id);
    if (!p) return jsonResponse({ products: [] });
    const out = CATALOG.filter(
      (x) => x.id !== id && (x.brand === p.brand || x.category === p.category)
    ).slice(0, 4);
    return jsonResponse({ products: out });
  }

  /**
   * Drop-in fetch replacement. Resolves catalog reads locally; forwards
   * everything else (and any non-GET request) to the real backend.
   */
  window.klFetch = function (url, opts) {
    const method = (opts && opts.method ? opts.method : 'GET').toUpperCase();
    let u;
    try {
      u = new URL(url, window.location.origin);
    } catch (e) {
      return fetch(url, opts);
    }
    const path = u.pathname.replace(/\/+$/, '');
    const sp = u.searchParams;

    // Only intercept read-only catalog routes.
    if (method === 'GET' && /\/api\//.test(path)) {
      // Dynamic, server-only routes — always forward.
      if (/\/price-history$/.test(path) || /\/price-alerts/.test(path)) {
        return fetch(url, opts);
      }
      const m = path.match(/\/api\/products\/([^/]+)(?:\/(related|price-history))?$/);

      if (/\/api\/categories$/.test(path)) return ensureCatalog().then(categories);
      if (/\/api\/products\/featured$/.test(path)) return ensureCatalog().then(featured);
      if (/\/api\/products\/trending$/.test(path)) return ensureCatalog().then(trending);
      if (/\/api\/products\/new-drops$/.test(path)) return ensureCatalog().then(newDrops);
      if (/\/api\/products\/batch$/.test(path)) return ensureCatalog().then(() => batch(sp));
      if (/\/api\/products$/.test(path)) return ensureCatalog().then(() => listProducts(sp));
      if (m && m[2] === 'related') return ensureCatalog().then(() => related(parseInt(m[1], 10)));
      if (m && !m[2]) {
        const id = parseInt(m[1], 10);
        if (!isNaN(id)) return ensureCatalog().then(() => productById(id));
      }
    }

    // Everything else (POST/DELETE, auth, alerts, etc.) → live backend.
    return fetch(url, opts);
  };

  // Expose the catalog for any direct use.
  window.KicksListCatalog = { ensureCatalog, get all() { return CATALOG; } };
})();
