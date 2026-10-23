/* =========================================================
   NORD COMPANY© — loja (front-end de demonstração)
   ========================================================= */

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const brl = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const params = new URLSearchParams(location.search);
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FREE_SHIP = 299;
const PIX_OFF = 0.05;
const COUPONS = { NORD10: 0.1, PRIMEIRACOMPRA: 0.15 };

// ---------- Persistência (só no navegador de quem está vendo) ----------
const db = {
  get(key, fallback) {
    try { const v = localStorage.getItem("corre." + key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem("corre." + key, JSON.stringify(value)); } catch {}
  },
};

let cart = db.get("cart", []);
let wish = db.get("wish", []);

// ---------- Ícones ----------
const I = {
  search: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
  user: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20.5c1.2-3.8 4-5.6 7.5-5.6s6.3 1.8 7.5 5.6"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 20.3S3.5 15.2 3.5 9.1A4.6 4.6 0 0 1 12 6.6a4.6 4.6 0 0 1 8.5 2.5c0 6.1-8.5 11.2-8.5 11.2Z"/></svg>',
  bag: '<svg viewBox="0 0 24 24"><path d="M5 8h14l-1 12.5H6L5 8Z"/><path d="M9 10V6.5a3 3 0 0 1 6 0V10"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  plus: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  minus: '<svg viewBox="0 0 24 24"><path d="M5 12h14"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  arrowUp: '<svg viewBox="0 0 24 24"><path d="M5 19 19 5M8 5h11v11"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><path d="M4 8h16M4 16h16"/></svg>',
  filter: '<svg viewBox="0 0 24 24"><path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/></svg>',
  truck: '<svg viewBox="0 0 24 24"><path d="M3 6h11v10H3zM14 10h4l3 3v3h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/></svg>',
  refresh: '<svg viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/></svg>',
  grid2: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="16"/><rect x="13" y="4" width="7" height="16"/></svg>',
  grid4: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></svg>',
};

// =========================================================
//   Chrome compartilhado: header, sacola, busca, menu, footer
// =========================================================
function renderChrome() {
  const page = document.body.dataset.page;
  const curCat = params.get("cat") || (params.get("fav") ? "" : page === "loja" ? "todos" : "");
  const navLink = (cat, label) =>
    `<a href="loja.html${cat === "todos" ? "" : "?cat=" + cat}" class="link-roll ${curCat === cat ? "is-active" : ""}"><span data-text="${label}">${label}</span></a>`;

  const minimal = document.body.dataset.chrome === "checkout";

  const header = minimal
    ? `<header class="sh sh--min">
        <a href="loja.html" class="sh__back mono">${I.arrow} <span class="sh__hide-sm">Voltar pra loja</span></a>
        <a href="index.html" class="sh__logo">NORD COMPANY<sup>©</sup></a>
        <span class="sh__secure mono">${I.lock} <span class="sh__hide-sm">Compra 100% segura</span></span>
      </header>`
    : `<div class="announce mono" aria-label="Avisos">
        <div class="announce__track">
          ${Array(2).fill(`<span>Frete na faixa acima de ${brl(FREE_SHIP)}</span><b>✦</b><span>Pagou no Pix, ganhou 5%</span><b>✦</b><span>Primeira compra? Usa o cupom PRIMEIRACOMPRA</span><b>✦</b><span>Drop 004 tá no ar</span><b>✦</b>`).join("")}
        </div>
      </div>
      <header class="sh">
        <button class="sh__icon sh__burger" data-open="menu" aria-label="Abrir menu">${I.menu}</button>
        <a href="index.html" class="sh__logo" aria-label="NORD COMPANY início">NORD COMPANY<sup>©</sup></a>
        <nav class="sh__nav" aria-label="Categorias">
          ${navLink("todos", "Tudo")}${navLink("moletons", "Moletons")}${navLink("camisetas", "Camisetas")}${navLink("calcas", "Calças")}${navLink("skate", "Skate")}
        </nav>
        <div class="sh__actions">
          <button class="sh__icon" data-open="search" aria-label="Buscar" data-cursor="Busca">${I.search}</button>
          <a href="conta.html" class="sh__icon sh__hide-sm" aria-label="Minha conta" data-cursor="Conta">${I.user}</a>
          <a href="loja.html?fav=1" class="sh__icon" aria-label="Favoritos" data-cursor="Curti">${I.heart}<i class="sh__count js-wish-count"></i></a>
          <button class="sh__icon sh__bag" data-open="cart" aria-label="Sacola" data-cursor="Sacola">${I.bag}<i class="sh__count js-cart-count"></i></button>
        </div>
      </header>`;

  const chrome = `
    <div class="grain" aria-hidden="true"></div>
    <div class="cursor" aria-hidden="true"><span class="cursor__label"></span></div>
    ${header}
    <div class="scrim" data-close></div>

    <aside class="drawer" id="cart" aria-label="Sacola" aria-hidden="true">
      <div class="drawer__head">
        <h2>Tua sacola <sup class="js-cart-count-txt">0</sup></h2>
        <button class="sh__icon" data-close aria-label="Fechar">${I.close}</button>
      </div>
      <div class="ship js-ship"></div>
      <div class="drawer__body js-cart-body" data-lenis-prevent></div>
      <div class="drawer__foot js-cart-foot"></div>
    </aside>

    <div class="search" id="search" aria-hidden="true">
      <div class="search__top">
        <span class="search__ico">${I.search}</span>
        <input type="search" class="search__input" placeholder="Procura aí: moletom, baggy, shape…" aria-label="Buscar produtos" />
        <button class="sh__icon" data-close aria-label="Fechar busca">${I.close}</button>
      </div>
      <div class="search__chips">
        <span class="mono">A galera tá buscando:</span>
        ${["moletom", "baggy", "tee preta", "shape", "tênis"].map((t) => `<button class="chip" data-term="${t}">${t}</button>`).join("")}
      </div>
      <div class="search__results" data-lenis-prevent></div>
    </div>

    <nav class="mmenu" id="menu" aria-hidden="true">
      <div class="mmenu__head">
        <a href="index.html" class="sh__logo">NORD COMPANY<sup>©</sup></a>
        <button class="sh__icon" data-close aria-label="Fechar menu">${I.close}</button>
      </div>
      <div class="mmenu__links">
        ${Object.entries(CATEGORIES).map(([k, c], i) => `<a href="loja.html${k === "todos" ? "" : "?cat=" + k}" style="--i:${i}"><span class="mono">0${i + 1}</span>${c.label}</a>`).join("")}
      </div>
      <div class="mmenu__foot mono">
        <a href="conta.html">${I.user} Minha conta</a>
        <a href="loja.html?fav=1">${I.heart} Favoritos</a>
      </div>
    </nav>

    <div class="modal" id="sizes" aria-hidden="true">
      <div class="modal__box" data-lenis-prevent>
        <div class="drawer__head"><h2>Guia de medidas</h2><button class="sh__icon" data-close aria-label="Fechar">${I.close}</button></div>
        <p class="modal__lead">Mede uma peça que você já curte e compara aqui. Na dúvida entre dois tamanhos? Vai no maior — a gente é da roupa larga.</p>
        <table class="table">
          <thead><tr><th>Tam.</th><th>Largura</th><th>Comprimento</th><th>Manga</th></tr></thead>
          <tbody>
            <tr><td>P</td><td>58 cm</td><td>68 cm</td><td>22 cm</td></tr>
            <tr><td>M</td><td>61 cm</td><td>71 cm</td><td>23 cm</td></tr>
            <tr><td>G</td><td>64 cm</td><td>74 cm</td><td>24 cm</td></tr>
            <tr><td>GG</td><td>67 cm</td><td>77 cm</td><td>25 cm</td></tr>
            <tr><td>XG</td><td>70 cm</td><td>80 cm</td><td>26 cm</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="toast" role="status" aria-live="polite"></div>`;

  document.body.insertAdjacentHTML("afterbegin", chrome);

  if (!minimal) {
    document.body.insertAdjacentHTML("beforeend", `
      <footer class="sf">
        <div class="sf__top">
          <div class="sf__news">
            <span class="mono sf__label">Lista do próximo drop</span>
            <p>Fica sabendo antes de todo mundo. Prometemos não lotar teu e-mail.</p>
            <form class="sf__form" onsubmit="event.preventDefault(); this.classList.add('is-done'); this.reset();">
              <input type="email" placeholder="seu@email.com" required aria-label="E-mail" />
              <button type="submit" aria-label="Enviar">${I.arrow}</button>
              <span class="mono sf__ok">✦ Tá na lista!</span>
            </form>
          </div>
          <div class="sf__col"><span class="mono sf__label">Loja</span>
            ${Object.entries(CATEGORIES).map(([k, c]) => `<a href="loja.html${k === "todos" ? "" : "?cat=" + k}">${c.label}</a>`).join("")}
          </div>
          <div class="sf__col"><span class="mono sf__label">Ajuda</span>
            <a href="#" data-open="sizes">Guia de medidas</a><a href="conta.html">Meus pedidos</a><a href="#">Trocas e devoluções</a><a href="#">Chama no Whats</a>
          </div>
          <div class="sf__col"><span class="mono sf__label">Segue a gente</span>
            <a href="#">Instagram</a><a href="#">TikTok</a><a href="#">YouTube</a>
          </div>
        </div>
        <div class="sf__word" aria-hidden="true">NORD COMPANY<sup>©</sup></div>
        <div class="sf__bottom mono">
          <span>© 2026 NORD COMPANY© — Faz teu corre</span>
          <span class="sf__pay">Pix · Visa · Master · Elo · Boleto</span>
          <span>Feito na rua — São Paulo, SP</span>
        </div>
      </footer>`);
  }
}

// =========================================================
//   Overlays (sacola, busca, menu, modal)
// =========================================================
let lenis = null;
let openId = null;

function openLayer(id) {
  closeLayer();
  const el = document.getElementById(id);
  if (!el) return;
  openId = id;
  el.classList.add("is-open");
  el.setAttribute("aria-hidden", "false");
  document.body.classList.add("has-layer", "layer-" + id);
  lenis?.stop();
  if (id === "search") setTimeout(() => $(".search__input").focus(), 250);
}

function closeLayer() {
  if (!openId) return;
  const el = document.getElementById(openId);
  el.classList.remove("is-open");
  el.setAttribute("aria-hidden", "true");
  document.body.classList.remove("has-layer", "layer-" + openId);
  openId = null;
  lenis?.start();
}

let toastTimer;
function toast(msg) {
  const t = $(".toast");
  t.innerHTML = `<span class="toast__dot"></span>${msg}`;
  t.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("is-on"), 2600);
}

// =========================================================
//   Sacola
// =========================================================
const lineKey = (l) => `${l.id}|${l.size}|${l.color}`;
const cartCount = () => cart.reduce((n, l) => n + l.qty, 0);
const cartSubtotal = () => cart.reduce((s, l) => s + (findProduct(l.id)?.price || 0) * l.qty, 0);

function addToCart(id, size, color, qty = 1) {
  const p = findProduct(id);
  if (!p) return;
  color = color || p.colors[0].name;
  const existing = cart.find((l) => lineKey(l) === `${id}|${size}|${color}`);
  if (existing) existing.qty += qty;
  else cart.push({ id, size, color, qty });
  saveCart();
  bump($(".sh__bag"));
  openLayer("cart");
}

function saveCart() {
  db.set("cart", cart);
  renderCart();
  document.dispatchEvent(new CustomEvent("cart:change"));
}

function bump(el) {
  if (!el) return;
  el.classList.remove("is-bump");
  void el.offsetWidth;
  el.classList.add("is-bump");
}

function renderCart() {
  const count = cartCount();
  $$(".js-cart-count").forEach((el) => { el.textContent = count || ""; el.classList.toggle("is-on", count > 0); });
  $$(".js-cart-count-txt").forEach((el) => (el.textContent = count));
  $$(".js-wish-count").forEach((el) => { el.textContent = wish.length || ""; el.classList.toggle("is-on", wish.length > 0); });

  const body = $(".js-cart-body");
  if (!body) return;
  const sub = cartSubtotal();
  const left = Math.max(0, FREE_SHIP - sub);
  const pct = Math.min(100, (sub / FREE_SHIP) * 100);

  $(".js-ship").innerHTML = count
    ? `<p>${left > 0 ? `Faltam <b>${brl(left)}</b> pro frete sair na faixa` : `<b>Boa!</b> Teu frete saiu na faixa ✦`}</p>
       <div class="ship__bar"><i style="width:${pct}%"></i></div>`
    : "";

  if (!count) {
    body.innerHTML = `
      <div class="empty">
        <span class="empty__ico">${I.bag}</span>
        <h3>Tua sacola tá vazia</h3>
        <p>Bora dar um rolê pela loja e achar umas peças com a tua cara?</p>
        <a href="loja.html" class="btn-solid">Ver as peças ${I.arrow}</a>
      </div>`;
    $(".js-cart-foot").innerHTML = "";
    return;
  }

  body.innerHTML = cart.map((l) => {
    const p = findProduct(l.id);
    return `
      <div class="line" data-key="${lineKey(l)}">
        <a href="produto.html?id=${p.id}" class="line__img"><img src="${IMG(p.images[0], 300)}" alt="${p.name}" /></a>
        <div class="line__info">
          <div class="line__top">
            <a href="produto.html?id=${p.id}" class="line__name">${p.name}</a>
            <span class="line__price">${brl(p.price * l.qty)}</span>
          </div>
          <span class="mono line__meta">${l.color} · Tam. ${l.size}</span>
          <div class="line__bottom">
            <div class="stepper">
              <button data-qty="-1" aria-label="Diminuir">${I.minus}</button>
              <span>${l.qty}</span>
              <button data-qty="1" aria-label="Aumentar">${I.plus}</button>
            </div>
            <button class="line__remove mono" data-remove>Tirar</button>
          </div>
        </div>
      </div>`;
  }).join("");

  const inCart = new Set(cart.map((l) => l.id));
  const suggest = PRODUCTS.filter((p) => !inCart.has(p.id)).sort((a, b) => b.popularity - a.popularity).slice(0, 3);
  body.insertAdjacentHTML("beforeend", `
    <div class="upsell">
      <span class="mono">Combina com o que você escolheu</span>
      <div class="upsell__row">
        ${suggest.map((p) => `
          <a href="produto.html?id=${p.id}" class="upsell__item">
            <img src="${IMG(p.images[0], 300)}" alt="${p.name}" />
            <span>${p.name}</span><b>${brl(p.price)}</b>
          </a>`).join("")}
      </div>
    </div>`);

  $(".js-cart-foot").innerHTML = `
    <div class="sum-row"><span>Subtotal</span><b>${brl(sub)}</b></div>
    <div class="sum-row sum-row--muted"><span>No Pix (5% off)</span><span>${brl(sub * (1 - PIX_OFF))}</span></div>
    <a href="checkout.html" class="btn-solid btn-solid--full" data-cursor="Bora">Fechar pedido ${I.arrow}</a>
    <button class="btn-ghost btn-solid--full" data-close>Continuar comprando</button>`;
}

function toggleWish(id) {
  const has = wish.includes(id);
  wish = has ? wish.filter((w) => w !== id) : [...wish, id];
  db.set("wish", wish);
  $$(`[data-wish="${id}"]`).forEach((b) => b.classList.toggle("is-on", !has));
  renderCart();
  toast(has ? "Tirou dos favoritos" : "Salvo nos favoritos ✦");
  document.dispatchEvent(new CustomEvent("wish:change"));
}

// =========================================================
//   Card de produto
// =========================================================
function productCard(p) {
  const soldAll = p.sizes.every((s) => p.soldOut.includes(s));
  return `
    <article class="pcard rv">
      <div class="pcard__frame">
      <a href="produto.html?id=${p.id}" class="pcard__media" data-cursor="Ver">
        <img src="${IMG(p.images[0], 800)}" alt="${p.name}" loading="lazy" />
        <img src="${IMG(p.images[1], 800)}" alt="" class="pcard__alt" loading="lazy" />
        <div class="pcard__badges">
          ${p.badge ? `<span class="tag ${p.oldPrice ? "tag--hot" : ""}">${p.badge}</span>` : ""}
        </div>
      </a>
      <button class="pcard__wish ${wish.includes(p.id) ? "is-on" : ""}" data-wish="${p.id}" aria-label="Favoritar ${p.name}">${I.heart}</button>
      <div class="pcard__quick">
        <span class="mono">Adiciona rapidinho</span>
        <div class="pcard__sizes">
          ${p.sizes.map((s) => `<button data-quick="${p.id}" data-size="${s}" ${p.soldOut.includes(s) || soldAll ? "disabled" : ""}>${s}</button>`).join("")}
        </div>
      </div>
      </div>
      <div class="pcard__info">
        <a href="produto.html?id=${p.id}" class="pcard__name">${p.name}</a>
        <span class="pcard__price">${p.oldPrice ? `<s>${brl(p.oldPrice)}</s>` : ""}${brl(p.price)}</span>
      </div>
      <div class="pcard__meta">
        <span class="dots">${p.colors.map((c) => `<i style="--c:${c.hex}" title="${c.name}"></i>`).join("")}${p.colors.length > 1 ? `<em class="mono">${p.colors.length} cores</em>` : ""}</span>
        <span class="mono">${brl(p.price * (1 - PIX_OFF))} no Pix</span>
      </div>
    </article>`;
}

// =========================================================
//   Página: catálogo
// =========================================================
function pageCatalog() {
  const favMode = params.get("fav") === "1";
  const state = {
    cat: CATEGORIES[params.get("cat")] ? params.get("cat") : "todos",
    q: params.get("q") || "",
    sizes: new Set(),
    colors: new Set(),
    max: 600,
    onlyNew: false,
    onlySale: false,
    sort: "hype",
  };
  const cols = db.get("cols", 4);

  const allColors = [...new Map(PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];
  const allSizes = [...new Set(PRODUCTS.flatMap((p) => p.sizes))];

  const main = $("#catalog");
  main.innerHTML = `
    <section class="shop-hero">
      <div class="crumbs mono"><a href="index.html">Início</a><span>/</span><a href="loja.html">Loja</a><span>/</span><b class="js-crumb"></b></div>
      <div class="shop-hero__row">
        <h1 class="shop-hero__title js-title"></h1>
        <div class="shop-hero__side">
          <p class="js-blurb"></p>
          <span class="mono js-count"></span>
        </div>
      </div>
    </section>

    <div class="shop-bar">
      <div class="chips" data-lenis-prevent>
        ${Object.entries(CATEGORIES).map(([k, c]) => `<button class="chip ${!favMode && k === state.cat ? "is-on" : ""}" data-cat="${k}">${c.label}</button>`).join("")}
      </div>
      <div class="shop-bar__tools">
        <button class="tool js-open-filters" data-open="filters">${I.filter}<span>Filtrar</span><i class="tool__n js-fcount"></i></button>
        <label class="tool tool--select">
          <span class="mono">Ordenar</span>
          <select class="js-sort" aria-label="Ordenar por">
            <option value="hype">Em alta</option>
            <option value="new">Novidades</option>
            <option value="low">Menor preço</option>
            <option value="high">Maior preço</option>
          </select>
        </label>
        <div class="tool tool--cols" role="group" aria-label="Colunas">
          <button data-cols="2" aria-label="2 colunas" class="${cols === 2 ? "is-on" : ""}">${I.grid2}</button>
          <button data-cols="4" aria-label="4 colunas" class="${cols === 4 ? "is-on" : ""}">${I.grid4}</button>
        </div>
      </div>
    </div>

    <div class="active-filters js-active"></div>
    <div class="grid js-grid" style="--cols:${cols}"></div>`;

  // Painel de filtros
  document.body.insertAdjacentHTML("beforeend", `
    <aside class="drawer drawer--left" id="filters" aria-hidden="true">
      <div class="drawer__head"><h2>Filtrar</h2><button class="sh__icon" data-close aria-label="Fechar">${I.close}</button></div>
      <div class="drawer__body" data-lenis-prevent>
        <div class="fgroup">
          <span class="mono fgroup__t">Tamanho</span>
          <div class="fsizes">${allSizes.map((s) => `<button data-fsize="${s}">${s}</button>`).join("")}</div>
        </div>
        <div class="fgroup">
          <span class="mono fgroup__t">Cor</span>
          <div class="fcolors">${allColors.map((c) => `<button data-fcolor="${c.name}"><i style="--c:${c.hex}"></i>${c.name}</button>`).join("")}</div>
        </div>
        <div class="fgroup">
          <span class="mono fgroup__t">Até quanto?</span>
          <input type="range" min="150" max="600" step="10" value="600" class="range js-range" aria-label="Preço máximo" />
          <div class="range__labels mono"><span>${brl(150)}</span><b class="js-range-val">${brl(600)}</b></div>
        </div>
        <div class="fgroup">
          <label class="switch"><input type="checkbox" class="js-new" /><span></span> Só novidades</label>
          <label class="switch"><input type="checkbox" class="js-sale" /><span></span> Só promoção</label>
        </div>
      </div>
      <div class="drawer__foot">
        <button class="btn-solid btn-solid--full" data-close>Ver <span class="js-fresult"></span> peças</button>
        <button class="btn-ghost btn-solid--full js-clear">Limpar tudo</button>
      </div>
    </aside>`);

  const grid = $(".js-grid");

  const filtered = () => {
    let list = PRODUCTS.filter((p) => {
      if (favMode && !wish.includes(p.id)) return false;
      if (!favMode && state.cat !== "todos" && p.cat !== state.cat) return false;
      if (state.q && !(p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(state.q.toLowerCase())) return false;
      if (state.sizes.size && !p.sizes.some((s) => state.sizes.has(s) && !p.soldOut.includes(s))) return false;
      if (state.colors.size && !p.colors.some((c) => state.colors.has(c.name))) return false;
      if (p.price > state.max) return false;
      if (state.onlyNew && !p.isNew) return false;
      if (state.onlySale && !p.oldPrice) return false;
      return true;
    });
    const by = {
      hype: (a, b) => b.popularity - a.popularity,
      new: (a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0) || b.popularity - a.popularity,
      low: (a, b) => a.price - b.price,
      high: (a, b) => b.price - a.price,
    };
    return list.sort(by[state.sort]);
  };

  const render = () => {
    const cat = CATEGORIES[state.cat];
    const list = filtered();
    $(".js-title").innerHTML = favMode ? "Teus <em>favoritos</em>" : state.q ? `“${state.q}”` : cat.title === "A loja" ? "A <em>loja</em>" : cat.title;
    $(".js-crumb").textContent = favMode ? "Favoritos" : state.q ? "Busca" : cat.label;
    $(".js-blurb").textContent = favMode ? "As peças que você curtiu ficam guardadas aqui. Quando decidir, é só jogar na sacola." : state.q ? "Achamos isso aqui pra você." : cat.blurb;
    $(".js-count").textContent = `${list.length} ${list.length === 1 ? "peça" : "peças"}`;
    $(".js-fresult").textContent = list.length;

    const nFilters = state.sizes.size + state.colors.size + (state.max < 600) + state.onlyNew + state.onlySale;
    $(".js-fcount").textContent = nFilters || "";
    $(".js-fcount").classList.toggle("is-on", nFilters > 0);

    const pills = [
      ...[...state.sizes].map((s) => [`Tam. ${s}`, () => state.sizes.delete(s)]),
      ...[...state.colors].map((c) => [c, () => state.colors.delete(c)]),
      ...(state.max < 600 ? [[`Até ${brl(state.max)}`, () => (state.max = 600)]] : []),
      ...(state.onlyNew ? [["Novidades", () => (state.onlyNew = false)]] : []),
      ...(state.onlySale ? [["Promoção", () => (state.onlySale = false)]] : []),
      ...(state.q ? [[`Busca: ${state.q}`, () => (state.q = "")]] : []),
    ];
    const act = $(".js-active");
    act.innerHTML = pills.map(([t], i) => `<button class="pill" data-pill="${i}">${t} ${I.close}</button>`).join("");
    act._pills = pills;

    if (!list.length) {
      grid.innerHTML = `
        <div class="empty empty--wide">
          <span class="empty__ico">${favMode ? I.heart : I.search}</span>
          <h3>${favMode ? "Nenhum favorito ainda" : "Não achamos nada com esses filtros"}</h3>
          <p>${favMode ? "Clica no coraçãozinho das peças que você curtir pra guardar aqui." : "Tenta tirar algum filtro ou dá uma olhada em tudo que tem na loja."}</p>
          <a href="loja.html" class="btn-solid">Ver tudo ${I.arrow}</a>
        </div>`;
    } else {
      const cards = list.map(productCard);
      if (!favMode && list.length >= 6) {
        cards.splice(5, 0, `
          <a href="loja.html?cat=moletons" class="promo rv" data-cursor="Bora">
            <img src="${IMG(PHOTO.hoodieSmoke, 900)}" alt="" loading="lazy" />
            <div class="promo__in">
              <span class="mono">Semana do moletom</span>
              <strong>Pagou no Pix,<br /><em>ganhou 5%</em></strong>
              <span class="promo__cta">Ver moletons ${I.arrow}</span>
            </div>
          </a>`);
      }
      grid.innerHTML = cards.join("");
    }
    observeReveals();
  };

  const syncUrl = () => {
    const u = new URL(location.href);
    u.search = "";
    if (favMode) u.searchParams.set("fav", "1");
    else if (state.cat !== "todos") u.searchParams.set("cat", state.cat);
    if (state.q) u.searchParams.set("q", state.q);
    history.replaceState(null, "", u);
  };

  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-cat],[data-fsize],[data-fcolor],[data-cols],[data-pill],.js-clear");
    if (!t) return;
    if (t.dataset.cat) {
      if (favMode) { location.href = "loja.html" + (t.dataset.cat === "todos" ? "" : "?cat=" + t.dataset.cat); return; }
      state.cat = t.dataset.cat;
      $$("[data-cat]").forEach((b) => b.classList.toggle("is-on", b === t));
      $$(".sh__nav a").forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "loja.html" + (state.cat === "todos" ? "" : "?cat=" + state.cat)));
      syncUrl();
      window.scrollTo({ top: Math.min(scrollY, $(".shop-bar").offsetTop - 60) });
    } else if (t.dataset.fsize) {
      state.sizes.has(t.dataset.fsize) ? state.sizes.delete(t.dataset.fsize) : state.sizes.add(t.dataset.fsize);
      t.classList.toggle("is-on");
    } else if (t.dataset.fcolor) {
      state.colors.has(t.dataset.fcolor) ? state.colors.delete(t.dataset.fcolor) : state.colors.add(t.dataset.fcolor);
      t.classList.toggle("is-on");
    } else if (t.dataset.cols) {
      grid.style.setProperty("--cols", t.dataset.cols);
      $$("[data-cols]").forEach((b) => b.classList.toggle("is-on", b === t));
      db.set("cols", +t.dataset.cols);
      return;
    } else if (t.dataset.pill) {
      $(".js-active")._pills[+t.dataset.pill][1]();
      syncFilterUI();
      syncUrl();
    } else if (t.classList.contains("js-clear")) {
      state.sizes.clear(); state.colors.clear(); state.max = 600; state.onlyNew = state.onlySale = false;
      syncFilterUI();
    }
    render();
  });

  const syncFilterUI = () => {
    $$("[data-fsize]").forEach((b) => b.classList.toggle("is-on", state.sizes.has(b.dataset.fsize)));
    $$("[data-fcolor]").forEach((b) => b.classList.toggle("is-on", state.colors.has(b.dataset.fcolor)));
    $(".js-range").value = state.max;
    $(".js-range-val").textContent = brl(state.max);
    $(".js-new").checked = state.onlyNew;
    $(".js-sale").checked = state.onlySale;
  };

  $(".js-range").addEventListener("input", (e) => { state.max = +e.target.value; $(".js-range-val").textContent = brl(state.max); render(); });
  $(".js-new").addEventListener("change", (e) => { state.onlyNew = e.target.checked; render(); });
  $(".js-sale").addEventListener("change", (e) => { state.onlySale = e.target.checked; render(); });
  $(".js-sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
  document.addEventListener("wish:change", () => favMode && render());

  render();
}

// =========================================================
//   Página: produto
// =========================================================
function pageProduct() {
  const p = findProduct(params.get("id")) || PRODUCTS[0];
  document.title = `${p.name} — NORD COMPANY©`;
  const sel = { color: p.colors[0].name, size: null, qty: 1 };
  const firstAvail = p.sizes.filter((s) => !p.soldOut.includes(s));
  if (p.sizes.length === 1 && firstAvail.length) sel.size = firstAvail[0];

  const main = $("#pdp");
  main.innerHTML = `
    <div class="crumbs mono pdp__crumbs"><a href="index.html">Início</a><span>/</span><a href="loja.html?cat=${p.cat}">${CATEGORIES[p.cat].label}</a><span>/</span><b>${p.name}</b></div>
    <section class="pdp">
      <div class="gallery">
        <div class="gallery__thumbs">
          ${p.images.map((im, i) => `<button class="${i === 0 ? "is-on" : ""}" data-img="${i}" aria-label="Foto ${i + 1}"><img src="${IMG(im, 200)}" alt="" /></button>`).join("")}
        </div>
        <div class="gallery__main" data-cursor="Zoom">
          ${p.images.map((im, i) => `<img src="${IMG(im, 1400)}" alt="${p.name} foto ${i + 1}" class="${i === 0 ? "is-on" : ""}" />`).join("")}
          <span class="gallery__n mono"><b class="js-gn">01</b> / 0${p.images.length}</span>
          ${p.badge ? `<span class="tag gallery__tag ${p.oldPrice ? "tag--hot" : ""}">${p.badge}</span>` : ""}
        </div>
      </div>

      <div class="buy">
        <div class="buy__sticky">
          <span class="mono buy__cat">${CATEGORIES[p.cat].label} · Drop 004</span>
          <h1 class="buy__title">${p.name}</h1>
          <div class="buy__price">
            <b>${brl(p.price)}</b>${p.oldPrice ? `<s>${brl(p.oldPrice)}</s>` : ""}
          </div>
          <p class="buy__terms"><span class="hl">${brl(p.price * (1 - PIX_OFF))} no Pix</span> ou 6x de ${brl(p.price / 6)} sem juros</p>

          <div class="opt">
            <div class="opt__head"><span class="mono">Cor</span><b class="js-color">${sel.color}</b></div>
            <div class="swatches">${p.colors.map((c, i) => `<button class="${i === 0 ? "is-on" : ""}" data-color="${c.name}" style="--c:${c.hex}" aria-label="${c.name}"></button>`).join("")}</div>
          </div>

          <div class="opt js-size-opt">
            <div class="opt__head"><span class="mono">Tamanho</span><button class="opt__link mono" data-open="sizes">Guia de medidas</button></div>
            <div class="sizes">${p.sizes.map((s) => `<button data-size="${s}" class="${sel.size === s ? "is-on" : ""}" ${p.soldOut.includes(s) ? "disabled" : ""}>${s}</button>`).join("")}</div>
            <p class="opt__hint mono js-size-hint">${p.soldOut.length ? `Tamanho riscado = esgotou. Logo volta!` : `Tá com dúvida? Dá uma olhada no guia.`}</p>
          </div>

          <div class="buy__row">
            <div class="stepper stepper--lg">
              <button data-pqty="-1" aria-label="Diminuir">${I.minus}</button>
              <span class="js-pqty">1</span>
              <button data-pqty="1" aria-label="Aumentar">${I.plus}</button>
            </div>
            <button class="btn-solid btn-solid--grow js-add" data-cursor="Bora">Coloca na sacola <span class="js-add-total">— ${brl(p.price)}</span></button>
            <button class="wish-lg ${wish.includes(p.id) ? "is-on" : ""}" data-wish="${p.id}" aria-label="Favoritar">${I.heart}</button>
          </div>

          <div class="perks-mini">
            <div>${I.truck}<span><b>Pediu até 14h, sai hoje.</b> Acima de ${brl(FREE_SHIP)} o frete é na faixa.</span></div>
            <div>${I.refresh}<span><b>Não serviu?</b> A primeira troca é por nossa conta.</span></div>
          </div>

          <form class="cep js-cep">
            <span class="mono">Calcula o frete</span>
            <div class="cep__row">
              <input inputmode="numeric" placeholder="00000-000" maxlength="9" class="js-mask" data-mask="00000-000" aria-label="CEP" required />
              <button type="submit">Calcular</button>
            </div>
            <div class="cep__out"></div>
          </form>

          <div class="acc">
            ${[
              ["Sobre a peça", p.desc],
              ["Caimento", p.fit],
              ["Cuidados", "Lava do avesso, em água fria, e seca na sombra. Nada de secadora — ela agradece e dura muito mais."],
              ["Troca e devolução", "Tem 30 dias pra trocar. A primeira troca é grátis: a gente manda a etiqueta, você só leva nos Correios."],
            ].map(([t, c], i) => `
              <details ${i === 0 ? "open" : ""}><summary>${t}<i>${I.plus}</i></summary><p>${c}</p></details>`).join("")}
          </div>
        </div>
      </div>
    </section>

    <section class="related">
      <div class="related__head">
        <h2 class="section-title">Combina <em>com</em></h2>
        <a href="loja.html?cat=${p.cat}" class="link-arrow">Ver mais ${CATEGORIES[p.cat].label.toLowerCase()} ${I.arrow}</a>
      </div>
      <div class="grid" style="--cols:4">
        ${[...PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id), ...PRODUCTS.filter((x) => x.cat !== p.cat)].slice(0, 4).map(productCard).join("")}
      </div>
    </section>

    <div class="mbar">
      <div><span class="mono">${p.name}</span><b>${brl(p.price)}</b></div>
      <button class="btn-solid js-add">Coloca na sacola</button>
    </div>`;

  // Galeria
  const mainImgs = $$(".gallery__main img");
  const setImg = (i) => {
    mainImgs.forEach((im, k) => im.classList.toggle("is-on", k === i));
    $$("[data-img]").forEach((b, k) => b.classList.toggle("is-on", k === i));
    $(".js-gn").textContent = String(i + 1).padStart(2, "0");
  };
  $$("[data-img]").forEach((b) => b.addEventListener("click", () => setImg(+b.dataset.img)));
  const gm = $(".gallery__main");
  let gi = 0;
  gm.addEventListener("click", () => { if (isTouch) { gi = (gi + 1) % mainImgs.length; setImg(gi); } });
  if (!isTouch) {
    gm.addEventListener("mousemove", (e) => {
      const r = gm.getBoundingClientRect();
      gm.style.setProperty("--zx", ((e.clientX - r.left) / r.width) * 100 + "%");
      gm.style.setProperty("--zy", ((e.clientY - r.top) / r.height) * 100 + "%");
      gm.classList.add("is-zoom");
    });
    gm.addEventListener("mouseleave", () => gm.classList.remove("is-zoom"));
  }
  // swipe
  let sx = null;
  gm.addEventListener("touchstart", (e) => (sx = e.touches[0].clientX), { passive: true });
  gm.addEventListener("touchend", (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { gi = (gi + (dx < 0 ? 1 : -1) + mainImgs.length) % mainImgs.length; setImg(gi); }
    sx = null;
  });

  // Opções
  $$("[data-color]").forEach((b) => b.addEventListener("click", () => {
    sel.color = b.dataset.color;
    $$("[data-color]").forEach((x) => x.classList.toggle("is-on", x === b));
    $(".js-color").textContent = sel.color;
  }));
  $$(".sizes [data-size]").forEach((b) => b.addEventListener("click", () => {
    sel.size = b.dataset.size;
    $$(".sizes [data-size]").forEach((x) => x.classList.toggle("is-on", x === b));
    $(".js-size-opt").classList.remove("is-error");
    $(".js-size-hint").textContent = `Boa escolha. Tamanho ${sel.size} separado pra você.`;
  }));
  $$("[data-pqty]").forEach((b) => b.addEventListener("click", () => {
    sel.qty = Math.max(1, Math.min(9, sel.qty + +b.dataset.pqty));
    $(".js-pqty").textContent = sel.qty;
    $(".js-add-total").textContent = "— " + brl(p.price * sel.qty);
  }));
  $$(".js-add").forEach((b) => b.addEventListener("click", () => {
    if (!sel.size) {
      const opt = $(".js-size-opt");
      opt.classList.remove("is-error"); void opt.offsetWidth; opt.classList.add("is-error");
      $(".js-size-hint").textContent = "Opa, escolhe o tamanho antes.";
      opt.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    addToCart(p.id, sel.size, sel.color, sel.qty);
  }));

  // Frete
  $(".js-cep").addEventListener("submit", (e) => {
    e.preventDefault();
    const v = $(".js-cep input").value.replace(/\D/g, "");
    const out = $(".cep__out");
    if (v.length !== 8) { out.innerHTML = `<p class="cep__err">CEP precisa ter 8 números.</p>`; return; }
    const free = p.price >= FREE_SHIP;
    const sp = v.startsWith("0");
    out.innerHTML = [
      ["Econômico", "5 a 8 dias úteis", free ? 0 : 19.9],
      ["Expresso", "2 a 3 dias úteis", 32.9],
      ...(sp ? [["Motoboy (SP)", "Chega hoje ainda", 24.9]] : []),
    ].map(([n, d, v]) => `<div class="cep__opt"><span><b>${n}</b>${d}</span><b>${v ? brl(v) : "Na faixa"}</b></div>`).join("");
  });

  // Barra mobile
  const mbar = $(".mbar");
  new IntersectionObserver(([en]) => mbar.classList.toggle("is-on", !en.isIntersecting && en.boundingClientRect.top < 0)).observe($(".buy__row"));
}

// =========================================================
//   Página: checkout
// =========================================================
function pageCheckout() {
  const main = $("#checkout");
  const form = { ship: "eco", pay: "pix", coupon: db.get("coupon", null), step: 1 };

  if (!cart.length) {
    main.innerHTML = `
      <div class="empty empty--page">
        <span class="empty__ico">${I.bag}</span>
        <h3>Tua sacola tá vazia</h3>
        <p>Antes de fechar o pedido, escolhe umas peças lá na loja.</p>
        <a href="loja.html" class="btn-solid">Bora pra loja ${I.arrow}</a>
      </div>`;
    return;
  }

  const shipOpts = {
    eco: { name: "Econômico", eta: "5 a 8 dias úteis", price: 19.9 },
    exp: { name: "Expresso", eta: "2 a 3 dias úteis", price: 32.9 },
    moto: { name: "Motoboy", eta: "Hoje, só pra capital de SP", price: 24.9 },
  };

  const totals = () => {
    const sub = cartSubtotal();
    const coupon = form.coupon ? sub * COUPONS[form.coupon] : 0;
    const base = sub - coupon;
    const ship = form.ship === "eco" && base >= FREE_SHIP ? 0 : shipOpts[form.ship].price;
    const pix = form.pay === "pix" ? base * PIX_OFF : 0;
    return { sub, coupon, ship, pix, total: base - pix + ship };
  };

  main.innerHTML = `
    <div class="co">
      <div class="co__main">
        <h1 class="co__title">Bora fechar <em>teu pedido</em></h1>
        <ol class="co__progress mono">
          <li class="is-on" data-pstep="1"><i>1</i>Você</li><li data-pstep="2"><i>2</i>Entrega</li><li data-pstep="3"><i>3</i>Pagamento</li>
        </ol>

        <form class="step is-open" data-step="1" novalidate>
          <header class="step__head"><span class="step__n">01</span><h2>Quem tá comprando?</h2><span class="step__done js-done"></span><button type="button" class="step__edit mono" data-edit="1">Editar</button></header>
          <div class="step__body">
            <div class="fields">
              <label class="field field--full"><span>E-mail</span><input type="email" name="email" required placeholder="voce@email.com" autocomplete="email" /></label>
              <label class="field field--full"><span>Nome completo</span><input name="nome" required placeholder="Como tá no teu documento" autocomplete="name" /></label>
              <label class="field"><span>Celular / WhatsApp</span><input name="cel" required class="js-mask" data-mask="(00) 00000-0000" inputmode="numeric" placeholder="(11) 90000-0000" /></label>
              <label class="field"><span>CPF</span><input name="cpf" required class="js-mask" data-mask="000.000.000-00" inputmode="numeric" placeholder="000.000.000-00" /></label>
            </div>
            <label class="check"><input type="checkbox" checked /><span></span>Quero receber novidades dos drops no e-mail</label>
            <button type="submit" class="btn-solid">Continuar ${I.arrow}</button>
          </div>
        </form>

        <form class="step" data-step="2" novalidate>
          <header class="step__head"><span class="step__n">02</span><h2>Pra onde a gente manda?</h2><span class="step__done js-done"></span><button type="button" class="step__edit mono" data-edit="2">Editar</button></header>
          <div class="step__body">
            <div class="fields">
              <label class="field"><span>CEP</span><input name="cep" required class="js-mask js-cep-co" data-mask="00000-000" inputmode="numeric" placeholder="00000-000" /></label>
              <a class="field__help mono" href="https://buscacepinter.correios.com.br" target="_blank" rel="noopener">Não sei meu CEP</a>
              <label class="field field--full"><span>Rua</span><input name="rua" required placeholder="Rua, avenida…" /></label>
              <label class="field field--sm"><span>Número</span><input name="num" required inputmode="numeric" placeholder="123" /></label>
              <label class="field"><span>Complemento</span><input name="comp" placeholder="Apto, bloco… (opcional)" /></label>
              <label class="field"><span>Bairro</span><input name="bairro" required /></label>
              <label class="field"><span>Cidade</span><input name="cidade" required /></label>
              <label class="field field--sm"><span>UF</span><input name="uf" required maxlength="2" /></label>
            </div>
            <span class="mono step__label">Como quer receber?</span>
            <div class="radios">
              ${Object.entries(shipOpts).map(([k, o]) => `
                <label class="radio"><input type="radio" name="ship" value="${k}" ${k === "eco" ? "checked" : ""} /><span class="radio__dot"></span>
                  <span class="radio__txt"><b>${o.name}</b>${o.eta}</span><b class="radio__price js-ship-${k}"></b></label>`).join("")}
            </div>
            <button type="submit" class="btn-solid">Continuar ${I.arrow}</button>
          </div>
        </form>

        <form class="step" data-step="3" novalidate>
          <header class="step__head"><span class="step__n">03</span><h2>Como vai pagar?</h2></header>
          <div class="step__body">
            <div class="paytabs" role="tablist">
              <button type="button" class="is-on" data-pay="pix"><b>Pix</b><span class="mono">5% off</span></button>
              <button type="button" data-pay="card"><b>Cartão</b><span class="mono">até 6x</span></button>
              <button type="button" data-pay="boleto"><b>Boleto</b><span class="mono">3 dias</span></button>
            </div>

            <div class="paypane is-on" data-pane="pix">
              <div class="note">${I.check}<p><b>Aprovação na hora.</b> Depois de finalizar, aparece o QR Code e o código copia-e-cola. Você ainda ganha 5% de desconto.</p></div>
            </div>

            <div class="paypane" data-pane="card">
              <div class="card-ui">
                <div class="ccard">
                  <div class="ccard__top"><span class="ccard__chip"></span><span class="ccard__brand mono js-cbrand">NORD COMPANY© card</span></div>
                  <span class="ccard__num js-cnum">•••• •••• •••• ••••</span>
                  <div class="ccard__bot mono"><span class="js-cname">NOME NO CARTÃO</span><span class="js-cexp">MM/AA</span></div>
                </div>
                <div class="fields">
                  <label class="field field--full"><span>Número do cartão</span><input name="cnum" class="js-mask js-card" data-mask="0000 0000 0000 0000" inputmode="numeric" placeholder="0000 0000 0000 0000" data-req="card" /></label>
                  <label class="field field--full"><span>Nome impresso</span><input name="cname" class="js-card-name" placeholder="Igual tá no cartão" data-req="card" /></label>
                  <label class="field"><span>Validade</span><input name="cexp" class="js-mask js-card-exp" data-mask="00/00" inputmode="numeric" placeholder="MM/AA" data-req="card" /></label>
                  <label class="field"><span>CVV</span><input name="cvv" class="js-mask" data-mask="0000" inputmode="numeric" placeholder="123" data-req="card" /></label>
                  <label class="field field--full"><span>Parcelas</span><select class="js-inst"></select></label>
                </div>
              </div>
            </div>

            <div class="paypane" data-pane="boleto">
              <div class="note">${I.check}<p><b>Vence em 3 dias úteis.</b> O pedido é separado assim que o banco confirmar o pagamento (até 2 dias úteis).</p></div>
            </div>

            <button type="submit" class="btn-solid btn-solid--full btn-solid--xl js-finish" data-cursor="Bora">Finalizar pedido <span class="js-finish-total"></span></button>
            <p class="co__legal mono">${I.lock} Teus dados ficam protegidos. Ao finalizar você concorda com os termos da loja.</p>
          </div>
        </form>
      </div>

      <aside class="co__side">
        <div class="summary">
          <div class="summary__head"><h3>Resumo</h3><button class="mono" data-open="cart">Editar sacola</button></div>
          <div class="summary__items js-sum-items" data-lenis-prevent></div>
          <form class="coupon js-coupon">
            <input placeholder="Tem cupom?" aria-label="Cupom" />
            <button type="submit">Aplicar</button>
          </form>
          <p class="coupon__msg mono js-coupon-msg">Dica: testa <b>NORD10</b></p>
          <div class="js-sum-totals"></div>
        </div>
        <div class="trust mono">
          <span>${I.lock} Pagamento seguro</span><span>${I.refresh} Troca grátis</span><span>${I.truck} Envio em 24h</span>
        </div>
      </aside>
    </div>`;

  let finished = false;
  const renderSummary = () => {
    if (finished) return;
    if (!cart.length) { location.reload(); return; }
    const t = totals();
    $(".js-sum-items").innerHTML = cart.map((l) => {
      const p = findProduct(l.id);
      return `<div class="sitem"><span class="sitem__img"><img src="${IMG(p.images[0], 200)}" alt="" /><i>${l.qty}</i></span>
        <span class="sitem__txt"><b>${p.name}</b><span class="mono">${l.color} · ${l.size}</span></span><b>${brl(p.price * l.qty)}</b></div>`;
    }).join("");
    $(".js-sum-totals").innerHTML = `
      <div class="sum-row"><span>Subtotal</span><span>${brl(t.sub)}</span></div>
      ${t.coupon ? `<div class="sum-row sum-row--ok"><span>Cupom ${form.coupon} <button class="mono js-rm-coupon">tirar</button></span><span>− ${brl(t.coupon)}</span></div>` : ""}
      <div class="sum-row"><span>Frete · ${shipOpts[form.ship].name}</span><span>${t.ship ? brl(t.ship) : "Na faixa"}</span></div>
      ${t.pix ? `<div class="sum-row sum-row--ok"><span>Desconto Pix</span><span>− ${brl(t.pix)}</span></div>` : ""}
      <div class="sum-row sum-row--total"><span>Total</span><b>${brl(t.total)}</b></div>`;
    $(".js-finish-total").textContent = "— " + brl(t.total);
    const base = t.sub - t.coupon;
    Object.keys(shipOpts).forEach((k) => {
      $(".js-ship-" + k).textContent = k === "eco" && base >= FREE_SHIP ? "Na faixa" : brl(shipOpts[k].price);
    });
    $(".js-inst").innerHTML = [1, 2, 3, 4, 5, 6].map((n) => `<option value="${n}">${n}x de ${brl(t.total / n)} sem juros</option>`).join("");
    $(".js-rm-coupon")?.addEventListener("click", () => { form.coupon = null; db.set("coupon", null); renderSummary(); });
  };
  renderSummary();
  document.addEventListener("cart:change", renderSummary);

  // Cupom
  $(".js-coupon").addEventListener("submit", (e) => {
    e.preventDefault();
    const code = $(".js-coupon input").value.trim().toUpperCase();
    const msg = $(".js-coupon-msg");
    if (COUPONS[code]) {
      form.coupon = code; db.set("coupon", code);
      msg.innerHTML = `✦ Cupom aplicado: ${Math.round(COUPONS[code] * 100)}% off`;
      msg.className = "coupon__msg mono is-ok";
      $(".js-coupon input").value = "";
    } else {
      msg.textContent = "Hmm, esse cupom não rolou. Confere se digitou certinho.";
      msg.className = "coupon__msg mono is-err";
    }
    renderSummary();
  });

  // Passos
  const steps = $$(".step");
  const goto = (n) => {
    form.step = n;
    steps.forEach((s) => {
      const k = +s.dataset.step;
      s.classList.toggle("is-open", k === n);
      s.classList.toggle("is-done", k < n);
    });
    $$("[data-pstep]").forEach((li) => { li.classList.toggle("is-on", +li.dataset.pstep <= n); });
    const target = steps[n - 1];
    setTimeout(() => window.scrollTo({ top: target.getBoundingClientRect().top + scrollY - 100, behavior: "smooth" }), 80);
  };
  $$("[data-edit]").forEach((b) => b.addEventListener("click", () => goto(+b.dataset.edit)));

  const validate = (stepEl) => {
    const inputs = $$("input[required], input[data-req]", stepEl).filter((i) => !i.dataset.req || i.dataset.req === form.pay);
    let ok = true;
    inputs.forEach((i) => {
      const bad = !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value)) || (i.dataset.mask && i.value.length < i.dataset.mask.length - (i.dataset.mask === "0000" ? 1 : 0));
      i.closest(".field").classList.toggle("is-error", bad);
      if (bad && ok) { i.focus(); ok = false; }
    });
    return ok;
  };
  steps.forEach((s) => s.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validate(s)) return;
    const n = +s.dataset.step;
    const fd = Object.fromEntries(new FormData(s));
    if (n === 1) $(".js-done", s).textContent = `${fd.nome.split(" ")[0]} · ${fd.email}`;
    if (n === 2) $(".js-done", s).textContent = `${fd.rua}, ${fd.num} — ${fd.cidade}/${fd.uf.toUpperCase()} · ${shipOpts[form.ship].name}`;
    if (n < 3) goto(n + 1);
    else finish();
  }));
  $$("input").forEach((i) => i.addEventListener("input", () => i.closest(".field")?.classList.remove("is-error")));

  // CEP auto
  $(".js-cep-co").addEventListener("input", (e) => {
    if (e.target.value.replace(/\D/g, "").length !== 8) return;
    const f = e.target.form;
    const fill = { rua: "Rua Augusta", bairro: "Consolação", cidade: "São Paulo", uf: "SP" };
    Object.entries(fill).forEach(([k, v]) => { if (!f[k].value) { f[k].value = v; f[k].closest(".field").classList.add("is-filled"); } });
    f.num.focus();
    toast("Achamos teu endereço ✦");
  });
  $$('input[name="ship"]').forEach((r) => r.addEventListener("change", () => { form.ship = r.value; renderSummary(); }));

  // Pagamento
  $$("[data-pay]").forEach((b) => b.addEventListener("click", () => {
    form.pay = b.dataset.pay;
    $$("[data-pay]").forEach((x) => x.classList.toggle("is-on", x === b));
    $$("[data-pane]").forEach((x) => x.classList.toggle("is-on", x.dataset.pane === form.pay));
    renderSummary();
  }));
  $(".js-card").addEventListener("input", (e) => {
    const v = e.target.value;
    $(".js-cnum").textContent = (v + "•••• •••• •••• ••••".slice(v.length)).slice(0, 19);
    const d = v[0];
    $(".js-cbrand").textContent = d === "4" ? "VISA" : d === "5" ? "MASTERCARD" : d === "6" ? "ELO" : d === "3" ? "AMEX" : "NORD COMPANY© card";
  });
  $(".js-card-name").addEventListener("input", (e) => ($(".js-cname").textContent = e.target.value.toUpperCase() || "NOME NO CARTÃO"));
  $(".js-card-exp").addEventListener("input", (e) => ($(".js-cexp").textContent = e.target.value || "MM/AA"));

  function finish() {
    const t = totals();
    const btn = $(".js-finish");
    btn.classList.add("is-loading");
    btn.innerHTML = `<span class="spin"></span> Processando…`;
    const nome = new FormData(steps[0]).get("nome").split(" ")[0];
    const order = {
      id: "CR-" + Math.floor(10000 + Math.random() * 89999),
      date: new Date().toISOString(),
      items: cart.map((l) => ({ ...l })),
      total: t.total,
      pay: form.pay,
      status: form.pay === "card" ? "Pagamento aprovado" : "Aguardando pagamento",
    };
    setTimeout(() => {
      finished = true;
      db.set("orders", [order, ...db.get("orders", [])]);
      cart = []; saveCart(); db.set("coupon", null);
      success(order, nome);
    }, 1400);
  }

  function success(order, nome) {
    const finder = (x, y) => {
      for (const [x0, y0] of [[0, 0], [18, 0], [0, 18]]) {
        const dx = x - x0, dy = y - y0;
        if (dx < -1 || dy < -1 || dx > 7 || dy > 7) continue;
        if (dx < 0 || dy < 0 || dx > 6 || dy > 6) return false;
        return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4);
      }
      return null;
    };
    const qr = Array.from({ length: 25 * 25 }, (_, i) => {
      const x = i % 25, y = Math.floor(i / 25);
      const f = finder(x, y);
      const on = f === null ? Math.random() > 0.5 : f;
      return on ? `<rect x="${x}" y="${y}" width="1" height="1"/>` : "";
    }).join("");
    main.innerHTML = `
      <section class="done">
        <span class="mono done__tag">✦ Pedido ${order.id}</span>
        <h1 class="done__title">Tá na <em>mão,</em><br />${nome}!</h1>
        <p class="done__lead">${order.pay === "card" ? "Pagamento aprovado. A gente já começou a separar tuas peças." : "Falta só pagar. Assim que confirmar, a gente embala tudo com carinho."} Mandamos os detalhes pro teu e-mail.</p>

        ${order.pay === "pix" ? `
          <div class="pix">
            <svg viewBox="0 0 25 25" class="pix__qr" shape-rendering="crispEdges">${qr}</svg>
            <div class="pix__info">
              <span class="mono">Paga com Pix — ${brl(order.total)}</span>
              <p>Abre o app do banco, escolhe Pix e escaneia o QR Code. Ou copia o código abaixo.</p>
              <div class="pix__code mono"><span>00020126580014br.gov.bcb.pix0136nord-${order.id.toLowerCase()}</span><button class="js-copy">Copiar</button></div>
              <span class="mono pix__timer">O código vale por 30 minutos</span>
            </div>
          </div>` : ""}

        <ol class="track">
          <li class="is-on"><i>${I.check}</i><b>Pedido recebido</b><span class="mono">Agora</span></li>
          <li class="${order.pay === "card" ? "is-on" : ""}"><i>${I.check}</i><b>Pagamento</b><span class="mono">${order.pay === "card" ? "Aprovado" : "Aguardando"}</span></li>
          <li><i>${I.bag}</i><b>Embalando</b><span class="mono">Em breve</span></li>
          <li><i>${I.truck}</i><b>Tá a caminho</b><span class="mono">Te avisamos</span></li>
        </ol>

        <div class="done__ctas">
          <a href="loja.html" class="btn-solid">Continuar comprando ${I.arrow}</a>
          <a href="conta.html" class="btn-ghost">Ver meus pedidos</a>
        </div>
      </section>`;
    window.scrollTo({ top: 0 });
    $(".js-copy")?.addEventListener("click", (e) => { navigator.clipboard?.writeText(e.target.previousElementSibling.textContent).catch(() => {}); e.target.textContent = "Copiado ✦"; });
  }
}

// =========================================================
//   Página: conta
// =========================================================
function pageAccount() {
  const main = $("#account");

  const renderAuth = (mode = "login") => {
    main.innerHTML = `
      <section class="auth">
        <div class="auth__art">
          <img src="${IMG(PHOTO.jacket, 1200)}" alt="" />
          <div class="auth__art-in">
            <span class="mono">Crew NORD COMPANY©</span>
            <h2>Faz parte<br /><em>da crew</em></h2>
            <ul class="mono">
              <li>✦ Fica sabendo dos drops antes</li>
              <li>✦ Acompanha teus pedidos</li>
              <li>✦ Salva teus favoritos</li>
            </ul>
          </div>
        </div>
        <div class="auth__box">
          <div class="auth__tabs">
            <button class="${mode === "login" ? "is-on" : ""}" data-auth="login">Entrar</button>
            <button class="${mode === "signup" ? "is-on" : ""}" data-auth="signup">Criar conta</button>
          </div>
          <form class="auth__form js-auth" novalidate>
            <h1>${mode === "login" ? "E aí, <em>bem-vindo de volta</em>" : "Cola com <em>a gente</em>"}</h1>
            <p>${mode === "login" ? "Entra pra ver teus pedidos e favoritos." : "Leva 30 segundos. Prometemos não encher teu saco."}</p>
            <div class="fields">
              ${mode === "signup" ? `<label class="field field--full"><span>Teu nome</span><input name="nome" required placeholder="Como a gente te chama?" /></label>` : ""}
              <label class="field field--full"><span>E-mail</span><input type="email" name="email" required placeholder="voce@email.com" /></label>
              <label class="field field--full"><span>Senha</span><input type="password" name="senha" required placeholder="${mode === "signup" ? "Mínimo 6 caracteres" : "Tua senha"}" /></label>
            </div>
            ${mode === "login" ? `<a href="#" class="auth__forgot mono">Esqueci a senha</a>` : `<label class="check"><input type="checkbox" checked /><span></span>Quero receber os drops no e-mail</label>`}
            <button type="submit" class="btn-solid btn-solid--full">${mode === "login" ? "Entrar" : "Criar minha conta"} ${I.arrow}</button>
            <div class="auth__or mono"><span>ou</span></div>
            <button type="button" class="btn-ghost btn-solid--full js-social">Continuar com Google</button>
          </form>
        </div>
      </section>`;

    $$("[data-auth]").forEach((b) => b.addEventListener("click", () => renderAuth(b.dataset.auth)));
    const f = $(".js-auth");
    const login = (nome, email) => { db.set("user", { nome, email }); renderDash(); window.scrollTo({ top: 0 }); };
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      let ok = true;
      $$("input[required]", f).forEach((i) => {
        const bad = !i.value.trim() || (i.type === "email" && !/^\S+@\S+\.\S+$/.test(i.value));
        i.closest(".field").classList.toggle("is-error", bad);
        if (bad) ok = false;
      });
      if (!ok) return;
      const fd = Object.fromEntries(new FormData(f));
      login(fd.nome || fd.email.split("@")[0], fd.email);
    });
    $(".js-social").addEventListener("click", () => login("Visitante", "visitante@email.com"));
  };

  const renderDash = (tab = location.hash.replace("#", "") || "pedidos") => {
    const user = db.get("user", null);
    if (!user) return renderAuth();
    const orders = [
      ...db.get("orders", []),
      { id: "CR-31877", date: "2026-08-14T12:00:00Z", items: [{ id: "tee-original", size: "G", color: "Cinza claro", qty: 1 }, { id: "calca-baggy-jeans", size: "42", color: "Azul lavado", qty: 1 }], total: 512.05, pay: "pix", status: "Entregue" },
    ];
    const tabs = { pedidos: "Meus pedidos", favoritos: "Favoritos", enderecos: "Endereços", dados: "Meus dados" };
    const nome = user.nome.split(" ")[0];
    main.innerHTML = `
      <section class="dash">
        <div class="dash__hero">
          <span class="mono">Minha conta</span>
          <h1>E aí, <em>${nome}!</em></h1>
          <p>Bom te ver por aqui. Tudo teu fica guardado nessa página.</p>
        </div>
        <div class="dash__wrap">
          <nav class="dash__nav">
            ${Object.entries(tabs).map(([k, t]) => `<button class="${k === tab ? "is-on" : ""}" data-tab="${k}">${t}${k === "pedidos" ? `<i>${orders.length}</i>` : k === "favoritos" ? `<i>${wish.length}</i>` : ""}</button>`).join("")}
            <button class="dash__out js-logout">Sair</button>
          </nav>
          <div class="dash__pane">
            ${tab === "pedidos" ? orders.map((o) => `
              <article class="order">
                <div class="order__head">
                  <div><b>${o.id}</b><span class="mono">${new Date(o.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span></div>
                  <span class="status ${o.status === "Entregue" ? "status--ok" : o.status.startsWith("Aguard") ? "status--wait" : ""}">${o.status}</span>
                </div>
                <div class="order__items">
                  ${o.items.map((l) => { const p = findProduct(l.id); return `<a href="produto.html?id=${p.id}" class="order__item"><img src="${IMG(p.images[0], 200)}" alt="" /><span><b>${p.name}</b><span class="mono">${l.size} · ${l.qty}x</span></span></a>`; }).join("")}
                </div>
                <div class="order__foot"><span class="mono">${o.pay === "pix" ? "Pix" : o.pay === "card" ? "Cartão" : "Boleto"}</span><b>${brl(o.total)}</b></div>
              </article>`).join("") : ""}
            ${tab === "favoritos" ? (wish.length ? `<div class="grid" style="--cols:3">${PRODUCTS.filter((p) => wish.includes(p.id)).map(productCard).join("")}</div>` : `<div class="empty"><span class="empty__ico">${I.heart}</span><h3>Nada salvo ainda</h3><p>Clica no coração das peças que você curtir.</p><a href="loja.html" class="btn-solid">Ver a loja ${I.arrow}</a></div>`) : ""}
            ${tab === "enderecos" ? `
              <div class="addr">
                <div class="addr__card"><span class="tag">Principal</span><b>Casa</b><p>Rua Augusta, 1500 — apto 42<br />Consolação, São Paulo/SP<br />01304-001</p><button class="mono">Editar</button></div>
                <button class="addr__new">${I.plus}<span>Adicionar endereço</span></button>
              </div>` : ""}
            ${tab === "dados" ? `
              <form class="fields dash__form" onsubmit="event.preventDefault(); toast('Dados salvos ✦');">
                <label class="field field--full"><span>Nome</span><input value="${user.nome}" /></label>
                <label class="field field--full"><span>E-mail</span><input type="email" value="${user.email}" /></label>
                <label class="field"><span>Celular</span><input class="js-mask" data-mask="(00) 00000-0000" placeholder="(11) 90000-0000" /></label>
                <label class="field"><span>Aniversário</span><input class="js-mask" data-mask="00/00/0000" placeholder="dd/mm/aaaa" /></label>
                <button class="btn-solid" type="submit">Salvar ${I.check}</button>
              </form>` : ""}
          </div>
        </div>
      </section>`;
    $$("[data-tab]").forEach((b) => b.addEventListener("click", () => { history.replaceState(null, "", "#" + b.dataset.tab); renderDash(b.dataset.tab); }));
    $(".js-logout").addEventListener("click", () => { db.set("user", null); toast("Até a próxima ✦"); renderAuth(); });
    observeReveals();
  };

  document.addEventListener("wish:change", () => db.get("user", null) && location.hash === "#favoritos" && renderDash("favoritos"));
  renderDash();
}

// =========================================================
//   Busca
// =========================================================
function initSearch() {
  const input = $(".search__input");
  const out = $(".search__results");
  const run = () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      out.innerHTML = `<span class="mono search__label">Mais procurados</span><div class="search__grid">${PRODUCTS.slice().sort((a, b) => b.popularity - a.popularity).slice(0, 4).map(sItem).join("")}</div>`;
      return;
    }
    const list = PRODUCTS.filter((p) => (p.name + " " + p.cat + " " + p.desc).toLowerCase().includes(q));
    out.innerHTML = list.length
      ? `<span class="mono search__label">${list.length} resultado${list.length > 1 ? "s" : ""}</span><div class="search__grid">${list.slice(0, 8).map(sItem).join("")}</div>
         <a href="loja.html?q=${encodeURIComponent(q)}" class="link-arrow search__all">Ver todos os resultados ${I.arrow}</a>`
      : `<p class="search__none">Nada com “${input.value}”. Tenta “moletom” ou “baggy”.</p>`;
  };
  const sItem = (p) => `<a href="produto.html?id=${p.id}" class="sitem-lg"><img src="${IMG(p.images[0], 400)}" alt="" /><b>${p.name}</b><span class="mono">${brl(p.price)}</span></a>`;
  input.addEventListener("input", run);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter" && input.value.trim()) location.href = "loja.html?q=" + encodeURIComponent(input.value.trim()); });
  $$("[data-term]").forEach((b) => b.addEventListener("click", () => { input.value = b.dataset.term; run(); input.focus(); }));
  run();
}

// =========================================================
//   Utilidades: máscaras, reveals, cursor, header
// =========================================================
function mask(v, pat) {
  const d = v.replace(/\D/g, "");
  let out = "", i = 0;
  for (const ch of pat) {
    if (i >= d.length) break;
    out += ch === "0" ? d[i++] : ch;
  }
  return out;
}
document.addEventListener("input", (e) => {
  if (e.target.classList?.contains("js-mask")) e.target.value = mask(e.target.value, e.target.dataset.mask);
});

let io;
function observeReveals() {
  if (!("IntersectionObserver" in window) || reduceMotion) { $$(".rv").forEach((el) => el.classList.add("in")); return; }
  io ||= new IntersectionObserver((entries) => entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
  }), { rootMargin: "0px 0px -8% 0px" });
  $$(".rv:not(.in)").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + "ms"; io.observe(el); });
}

function initCursor() {
  if (isTouch) return;
  const c = $(".cursor"), label = $(".cursor__label");
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
  const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; c.style.transform = `translate(${cx}px, ${cy}px)`; requestAnimationFrame(loop); };
  loop();
  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest("[data-cursor]");
    if (t) { label.textContent = t.dataset.cursor; c.classList.add("is-active"); }
    else c.classList.remove("is-active");
  });
}

function initHeader() {
  const h = $(".sh");
  if (!h || h.classList.contains("sh--min")) return;
  let last = 0;
  const on = () => {
    const y = scrollY;
    h.classList.toggle("is-scrolled", y > 30);
    h.classList.toggle("is-hidden", y > last && y > 300 && !openId);
    document.body.classList.toggle("is-scrolled", y > 30);
    last = y;
  };
  window.addEventListener("scroll", on, { passive: true });
  on();
}

// =========================================================
//   Eventos globais
// =========================================================
document.addEventListener("click", (e) => {
  const open = e.target.closest("[data-open]");
  if (open) { e.preventDefault(); openLayer(open.dataset.open); return; }
  if (e.target.closest("[data-close]")) { closeLayer(); return; }

  const w = e.target.closest("[data-wish]");
  if (w) { e.preventDefault(); toggleWish(w.dataset.wish); return; }

  const q = e.target.closest("[data-quick]");
  if (q) { addToCart(q.dataset.quick, q.dataset.size); return; }

  const line = e.target.closest(".line");
  if (line) {
    const l = cart.find((x) => lineKey(x) === line.dataset.key);
    const qty = e.target.closest("[data-qty]");
    if (qty && l) { l.qty += +qty.dataset.qty; if (l.qty < 1) cart = cart.filter((x) => x !== l); saveCart(); }
    if (e.target.closest("[data-remove]")) { cart = cart.filter((x) => x !== l); saveCart(); toast("Peça removida da sacola"); }
  }
});
document.addEventListener("keydown", (e) => e.key === "Escape" && closeLayer());

// =========================================================
//   Boot
// =========================================================
renderChrome();
renderCart();
initSearch();
initCursor();
initHeader();

const pages = { loja: pageCatalog, produto: pageProduct, checkout: pageCheckout, conta: pageAccount };
pages[document.body.dataset.page]?.();
observeReveals();

if (window.Lenis && !reduceMotion) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
  const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
