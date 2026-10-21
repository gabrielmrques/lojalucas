/* =========================================================
   CORRE® — catálogo (dados de demonstração)
   ========================================================= */

const IMG = (id, w = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PHOTO = {
  skateWall: "1547447134-cd3f5c716030",
  hoodieGrey: "1556821840-3a63f95609a7",
  teeBlack: "1583743814966-8936f5b7be1a",
  jeansPile: "1542272604-787c3835535d",
  teeWhite: "1521572163474-6864f9cf17ab",
  sneakers: "1552346154-21d32810aba3",
  teeFarol: "1564859228273-274232fdb516",
  crewFlat: "1620799140408-edc6dcb6d633",
  teeGraphic: "1576566588028-4147f3842f27",
  jeansRipped: "1541099649105-f69ad21f3246",
  skateLedge: "1520045892732-304bc3ac5d8e",
  jacket: "1523398002811-999ca8dec234",
  cruiser: "1531565637446-32307b194362",
  hoodieSmoke: "1509942774463-acf339cf87d5",
};

const CATEGORIES = {
  todos: { label: "Tudo", title: "A loja", blurb: "Tudo que tá rodando na rua agora. Escolhe, prova e bora." },
  moletons: { label: "Moletons", title: "Moletons", blurb: "Pesados, largos e quentinhos. Feitos pra aguentar inverno de SP e tombo na pista." },
  camisetas: { label: "Camisetas", title: "Camisetas", blurb: "Malha grossa, gola que não deforma e caimento boxy. A básica que salva qualquer rolê." },
  calcas: { label: "Calças", title: "Calças", blurb: "Perna larga pra mexer à vontade. Jeans pesado que só fica melhor com o tempo." },
  skate: { label: "Skate & Acessórios", title: "Skate", blurb: "Shape, cruiser e tênis pra quem leva o skate a sério — ou só pra dar um rolê." },
};

const TOP_SIZES = ["P", "M", "G", "GG", "XG"];
const PANTS_SIZES = ["38", "40", "42", "44", "46"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43"];

const PRODUCTS = [
  {
    id: "moletom-pesadao", name: "Moletom Pesadão 480g", cat: "moletons", price: 389, badge: "Novo", isNew: true, popularity: 98,
    colors: [{ name: "Cinza mescla", hex: "#9a9a96" }, { name: "Preto", hex: "#141414" }, { name: "Osso", hex: "#e6dfd2" }],
    sizes: TOP_SIZES, soldOut: ["XG"],
    images: [PHOTO.hoodieGrey, PHOTO.hoodieSmoke, PHOTO.crewFlat],
    desc: "O queridinho da crew. Moletom de 480g, felpado por dentro, com capuz duplo que fica em pé e bolso canguru que cabe tudo — até o celular grandão.",
    fit: "Largão de propósito. Se quiser mais ajustado, pega um número abaixo.",
  },
  {
    id: "tee-oversized-preta", name: "Tee Oversized Breu", cat: "camisetas", price: 179, badge: "Todo mundo quer", popularity: 95,
    colors: [{ name: "Preto", hex: "#141414" }, { name: "Grafite", hex: "#3a3a38" }],
    sizes: TOP_SIZES, soldOut: [],
    images: [PHOTO.teeBlack, PHOTO.teeGraphic, PHOTO.teeWhite],
    desc: "Camiseta oversized em malha 260g, com ombro caído e gola canelada que não deforma. Pode lavar à vontade que ela continua preta.",
    fit: "Oversized. Fica uns 4 dedos abaixo da cintura.",
  },
  {
    id: "calca-baggy-jeans", name: "Calça Baggy Jeans 14oz", cat: "calcas", price: 349, badge: "Baggy", popularity: 92,
    colors: [{ name: "Azul lavado", hex: "#5b6f8a" }, { name: "Preto", hex: "#1b1c1f" }],
    sizes: PANTS_SIZES, soldOut: ["46"],
    images: [PHOTO.jeansPile, PHOTO.jeansRipped, PHOTO.skateLedge],
    desc: "Jeans 14oz, pesado de verdade, com perna larga do quadril até a barra. Quanto mais usa, mais fica com a tua cara.",
    fit: "Cintura no lugar, perna bem larga. Barra comprida pra dobrar.",
  },
  {
    id: "tee-boxy-osso", name: "Tee Boxy Osso", cat: "camisetas", price: 169, badge: "Básica que salva", popularity: 88,
    colors: [{ name: "Off-white", hex: "#ece6da" }, { name: "Branco", hex: "#ffffff" }],
    sizes: TOP_SIZES, soldOut: [],
    images: [PHOTO.teeWhite, PHOTO.teeFarol, PHOTO.teeBlack],
    desc: "A camiseta que você vai querer em todas as cores. Corte boxy, mais curtinha e larga, em malha grossa que não fica transparente.",
    fit: "Boxy: larga e um pouco mais curta. Combina demais com calça baggy.",
  },
  {
    id: "tenis-low-rua", name: "Tênis Low Rua", cat: "skate", price: 459, badge: "Collab", popularity: 90,
    colors: [{ name: "Vermelho e preto", hex: "#b3262b" }],
    sizes: SHOE_SIZES, soldOut: ["38", "43"],
    images: [PHOTO.sneakers, PHOTO.skateLedge, PHOTO.cruiser],
    desc: "Cano baixo, couro resistente e sola que gruda na lixa. Feito em collab com a galera da pista do Anhangabaú.",
    fit: "Forma normal. Se tiver pé largo, sobe meio número.",
  },
  {
    id: "tee-farol", name: "Tee Farol", cat: "camisetas", price: 199, badge: "Tiragem curta", isNew: true, popularity: 84,
    colors: [{ name: "Osso", hex: "#ece6da" }],
    sizes: TOP_SIZES, soldOut: ["P"],
    images: [PHOTO.teeFarol, PHOTO.teeWhite, PHOTO.teeGraphic],
    desc: "Estampa nas costas com silk feito à mão, uma por uma. Só fizemos 150 — depois disso, não volta mais.",
    fit: "Regular com um pouco de folga.",
  },
  {
    id: "crewneck-osso", name: "Crewneck Nuvem", cat: "moletons", price: 329, popularity: 79,
    colors: [{ name: "Off-white", hex: "#ece6da" }, { name: "Cinza", hex: "#9a9a96" }],
    sizes: TOP_SIZES, soldOut: [],
    images: [PHOTO.crewFlat, PHOTO.hoodieGrey, PHOTO.teeWhite],
    desc: "Moletom gola careca, macio que nem nuvem e pesado na medida. Dá pra usar sozinho ou com uma tee por baixo.",
    fit: "Largo, com punho e barra canelados.",
  },
  {
    id: "tee-original", name: "Tee Gato da Sorte", cat: "camisetas", price: 189, badge: "Volta pro estoque", popularity: 81,
    colors: [{ name: "Cinza claro", hex: "#cfcfcb" }],
    sizes: TOP_SIZES, soldOut: [],
    images: [PHOTO.teeGraphic, PHOTO.teeBlack, PHOTO.teeFarol],
    desc: "A estampa que esgotou no Drop 002 voltou. Gato da sorte na frente, porque sorte nunca é demais.",
    fit: "Regular. Se curte largão, pega um acima.",
  },
  {
    id: "calca-destroyed", name: "Calça Wide Rasgada", cat: "calcas", price: 379, popularity: 76,
    colors: [{ name: "Preto lavado", hex: "#2a2b2e" }],
    sizes: PANTS_SIZES, soldOut: ["38"],
    images: [PHOTO.jeansRipped, PHOTO.jeansPile, PHOTO.skateLedge],
    desc: "Jeans com rasgos feitos à mão e patches. Já vem com cara de que viveu muita coisa.",
    fit: "Wide leg, cintura média.",
  },
  {
    id: "shape-maple", name: "Shape Maple 8.25", cat: "skate", price: 299, badge: "Pro model", popularity: 86,
    colors: [{ name: "Natural", hex: "#c9a26b" }],
    sizes: ["8.0", "8.25", "8.5"], soldOut: [],
    images: [PHOTO.skateLedge, PHOTO.skateWall, PHOTO.cruiser],
    desc: "Shape de maple canadense, 7 lâminas, com pop que responde na hora. Arte exclusiva no fundo.",
    fit: "Concave médio. 8.25 é o tamanho que a maioria curte.",
  },
  {
    id: "jaqueta-corta-vento", name: "Corta-Vento Garoa", cat: "moletons", price: 449, oldPrice: 529, badge: "-15%", popularity: 83,
    colors: [{ name: "Preto e branco", hex: "#1a1a1a" }],
    sizes: TOP_SIZES, soldOut: ["P"],
    images: [PHOTO.jacket, PHOTO.hoodieSmoke, PHOTO.hoodieGrey],
    desc: "Corta-vento leve que segura garoa paulistana. Forrado, com capuz escondido na gola e faixa refletiva.",
    fit: "Largo, pra caber moletom por baixo.",
  },
  {
    id: "moletom-fumaca", name: "Moletom Fumaça", cat: "moletons", price: 399, badge: "Novo", isNew: true, popularity: 89,
    colors: [{ name: "Chumbo", hex: "#55565a" }, { name: "Preto", hex: "#141414" }],
    sizes: TOP_SIZES, soldOut: [],
    images: [PHOTO.hoodieSmoke, PHOTO.hoodieGrey, PHOTO.jacket],
    desc: "Lavagem estonada que deixa cada peça única. Capuz grandão e manga comprida pra puxar até a mão.",
    fit: "Largão, manga alongada.",
  },
  {
    id: "cruiser-22", name: "Cruiser Faixa 22\"", cat: "skate", price: 259, oldPrice: 299, badge: "-13%", popularity: 74,
    colors: [{ name: "Cinza", hex: "#8d8f93" }],
    sizes: ["Único"], soldOut: [],
    images: [PHOTO.cruiser, PHOTO.skateLedge, PHOTO.skateWall],
    desc: "Pequeno, leve e fácil de carregar no busão. Rodas macias pra deslizar até em asfalto ruim.",
    fit: "22 polegadas. Cabe na mochila.",
  },
];

const findProduct = (id) => PRODUCTS.find((p) => p.id === id);
