// キャッシュの名前（バージョンアップ時はここを変える）
const CACHE_NAME = 'kotora-career-v2';

// キャッシュするファイルのリスト
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
  // 外部画像(ロゴ等)がある場合はここに追加するか、
  // オンライン時のみ取得する方針ならそのままでOK
];

// インストール処理
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
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