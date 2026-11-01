/**
 * ORCİK - Ürün Kataloğu ve Mağaza Verisi
 * Yiyecekler (Chocorcik, Orcik Dondurması, Orcik Bites, Orcik Protein Bar, Hakiki Orcik vb.)
 * İçecekler (Orcik aromalı süt, Orcik aromalı dibek kahvesi)
 */

const PRODUCTS = [
  // --- YİYECEKLERİMİZ ---
  {
    id: 'chocorcik',
    name: 'Chocorcik',
    category: 'yiyecek',
    categoryName: 'Yiyecekler',
    badge: 'İmza Lezzet',
    rating: 5.0,
    reviewsCount: 78,
    description: 'Geleneksel Elazığ orcikinin çıtır yerli cevizleri ve enfes Belçika çikolatasıyla buluştuğu sıra dışı gurme atıştırmalık.',
    image: 'assets/chocorcik.png',
    options: [
      { weight: '250 gr', price: 289.00, oldPrice: 329.00 },
      { weight: '500 gr', price: 549.00, oldPrice: 620.00 },
      { weight: '1000 gr (Özel Kutu)', price: 990.00, oldPrice: 1150.00 }
    ],
    defaultOptionIndex: 0,
    isPopular: true
  },
  {
    id: 'orcik-dondurmasi',
    name: 'Orcik Dondurması',
    category: 'yiyecek',
    categoryName: 'Yiyecekler',
    badge: 'Özel Soğuk Seri',
    rating: 4.9,
    reviewsCount: 52,
    description: 'Saf keçi sütü, manda kaymağı ve bol hakiki orcik parçacıklarıyla hazırlanan, damakta eriyen artisan dondurma.',
    image: 'assets/dondurma.png',
    options: [
      { weight: '500 ml', price: 219.00, oldPrice: 249.00 },
      { weight: '1000 ml', price: 399.00, oldPrice: 460.00 }
    ],
    defaultOptionIndex: 0,
    isPopular: true
  },
  {
    id: 'orcik-bites',
    name: 'Orcik Bites',
    category: 'yiyecek',
    categoryName: 'Yiyecekler',
    badge: 'Çok Satan',
    rating: 4.9,
    reviewsCount: 64,
    description: 'Tek lokmalık küpler halinde dilimlenmiş, gün boyu enerjinizi yüksek tutacak pratik ve leziz atıştırmalık kutusu.',
    image: 'assets/bites.png',
    options: [
      { weight: '200 gr', price: 179.00, oldPrice: 199.00 },
      { weight: '400 gr', price: 339.00, oldPrice: 380.00 },
      { weight: '800 gr', price: 629.00, oldPrice: 720.00 }
    ],
    defaultOptionIndex: 0,
    isPopular: true
  },
  {
    id: 'orcik-protein-bar',
    name: 'Orcik Protein Bar',
    category: 'yiyecek',
    categoryName: 'Yiyecekler',
    badge: 'Yüksek Protein & Şekersiz',
    rating: 4.8,
    reviewsCount: 46,
    description: 'İlave şekersiz, yüksek bitkisel protein ve lif zengini. Hakiki üzüm şırası, yerli ceviz ve dut özlü sporcu dostu bar.',
    image: 'assets/bar.png',
    options: [
      { weight: 'Tekli Bar (60 gr)', price: 65.00, oldPrice: 75.00 },
      { weight: '12\'li Avantaj Kutusu', price: 699.00, oldPrice: 780.00 }
    ],
    defaultOptionIndex: 0,
    isPopular: true
  },

  // --- İÇECEKLERİMİZ ---
  {
    id: 'orcik-aromali-sut',
    name: 'Orcik Aromalı Süt',
    category: 'icecek',
    categoryName: 'İçecekler',
    badge: 'Yeni Nesil İçecek',
    rating: 4.9,
    reviewsCount: 37,
    description: 'Taze çiftlik sütü ile karamelize üzüm şırası ve kavrulmuş ceviz lezzetinin muhteşem buluşması.',
    image: 'assets/sut.png',
    options: [
      { weight: '250 ml (Tekli Şişe)', price: 45.00, oldPrice: 50.00 },
      { weight: '6\'lı Paket', price: 249.00, oldPrice: 280.00 },
      { weight: '12\'li Koli', price: 469.00, oldPrice: 540.00 }
    ],
    defaultOptionIndex: 0,
    isPopular: true
  },
  {
    id: 'orcik-aromali-dibek-kahvesi',
    name: 'Orcik Aromalı Dibek Kahvesi',
    category: 'icecek',
    categoryName: 'İçecekler',
    badge: 'Harput Özel Harmanı',
    rating: 5.0,
    reviewsCount: 89,
    description: 'Taş dibekte öğütülen geleneksel Harput kahvesi, damla sakızı, menengiç ve orcik ceviz notasının kadifemsi uyumu.',
    image: 'assets/kahve.png',
    options: [
      { weight: '250 gr Kutu', price: 189.00, oldPrice: 215.00 },
      { weight: '500 gr Kutu', price: 349.00, oldPrice: 399.00 },
      { weight: '1000 gr Teneke Kutu', price: 649.00, oldPrice: 750.00 }
    ],
    defaultOptionIndex: 0,
    isPopular: true
  }
];

const PACKAGES = [
  {
    title: 'Chocorcik & Kahve Gurme Seti',
    price: '₺ 469.00',
    oldPrice: '₺ 540.00',
    btnText: 'Seti İncele',
    image: 'assets/chocorcik.png',
    desc: 'Chocorcik (250g) ve Orcik Aromalı Dibek Kahvesi (250g) bir arada.'
  },
  {
    title: 'Orcik Dondurması & Bites Menüsü',
    price: '₺ 539.00',
    oldPrice: '₺ 620.00',
    btnText: 'Menüyü Gör',
    image: 'assets/dondurma.png',
    desc: 'Özel soğuk zincir strafor kutusunda orcik dondurması ve pratik bites.'
  },
  {
    title: 'Yeni Nesil Fit Orcik Paketi',
    price: '₺ 729.00',
    oldPrice: '₺ 830.00',
    btnText: 'Paketi İncele',
    image: 'assets/bar.png',
    desc: '12\'li Orcik Protein Bar ve 6\'lı Orcik Aromalı Süt paketi.'
  },
  {
    title: 'Büyük Harput Sandığı',
    price: '₺ 1,899.00',
    oldPrice: '₺ 2,200.00',
    btnText: 'Sandığı İncele',
    image: 'assets/bites.png',
    desc: 'Chocorcik, orcik bites, dibek kahvesi ve orcik sütü bir arada.'
  }
];

const RECENT_PURCHASES = [
  { name: 'Mehmet A.', city: 'İstanbul', product: 'Chocorcik (500 gr)', time: '1 dakika önce' },
  { name: 'Selin K.', city: 'Ankara', product: 'Orcik Aromalı Dibek Kahvesi', time: '4 dakika önce' },
  { name: 'Emre Y.', city: 'İzmir', product: 'Orcik Dondurması (1000 ml)', time: '8 dakika önce' },
  { name: 'Büşra D.', city: 'Bursa', product: 'Orcik Protein Bar (12\'li Kutu)', time: '14 dakika önce' },
  { name: 'Caner T.', city: 'Elazığ', product: 'Orcik Aromalı Süt (6\'lı Paket)', time: '19 dakika önce' }
];
