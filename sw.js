// キャッシュの名前（バージョンをv6に変更して強制更新）
const CACHE_NAME = 'kotora-career-v6';

// キャッシュするファイルのリスト
// ★ファイルがすべて存在するので、これらをすべてキャッシュします
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './logo.png',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.6.0/dist/confetti.browser.min.js'
];

// インストール処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // 1つでもファイルがないとキャッシュ登録全体が失敗するため、
      // 確実に存在するファイルだけを指定することが重要です
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// フェッチ処理（オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュにあればそれを返す、なければネットワークへ
      return response || fetch(event.request);
    })
  );
});

// アクティベート処理（古いキャッシュの削除）
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});