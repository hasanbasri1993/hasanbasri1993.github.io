importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.3/workbox-sw.js');

if (workbox) {
    console.log(`Workbox berhasil dimuat`);

    workbox.precaching.precacheAndRoute([
            {
                url: 'https://unpkg.com/snarkdown@1.0.2/dist/snarkdown.umd.js',
                revision: '1'
            }, {
                url: '/manifest.json',
                revision: '1'
            }, {url: '/nav.html', revision: '1'}, {url: '/index.html', revision: '1'}, {
                url: '/football-club.html',
                revision: '1'
            }, {url: '/pages/home.html', revision: '1'}, {
                url: '/pages/about.html',
                revision: '1'
            }, {url: '/pages/saved.html', revision: '1'}, {
                url: '/css/materialize.min.css',
                revision: '1'
            }, {url: '/css/style.css', revision: '1'}, {url: '/js/materialize.min.js', revision: '1'}, {
                url: '/js/nav.js',
                revision: '1'
            }, {url: '/js/api.js', revision: '1'}, {url: '/js/idb.js', revision: '1'}, {
                url: '/js/db.js',
                revision: '1'
            }, {url: '/js/sw-register.js', revision: '1'}, {
                url: '/icon/favicon.ico',
                revision: '1'
            }, {url: '/icon/favicon-16x16.png', revision: '1'}, {
                url: '/icon/favicon-32x32.png',
                revision: '1'
            }, {url: '/icon/favicon-96x96.png', revision: '1'}, {
                url: '/icon/apple-icon.png',
                revision: '1'
            }, {url: '/icon/android-icon-36x36.png', revision: '1'}, {
                url: '/icon/android-icon-48x48.png',
                revision: '1'
            }, {url: '/icon/android-icon-72x72.png', revision: '1'}, {
                url: '/icon/android-icon-144x144.png',
                revision: '1'
            }, {url: '/icon/android-icon-192x192.png', revision: '1'}, {
                url: '/icon/android-icon-512x512.png',
                revision: '1'
            }, {url: '/icon/apple-icon-57x57.png', revision: '1'}, {
                url: '/icon/apple-icon-60x60.png',
                revision: '1'
            }, {url: '/icon/apple-icon-72x72.png', revision: '1'}
        ],
        {
            ignoreURLParametersMatching: [/.*/]
        });

    workbox.routing.registerRoute(
        /.*(?:png|gif|jpg|jpeg|svg|ico)$/,
        workbox.strategies.cacheFirst({
            cacheName: 'images-cache',
            plugins: [
                new workbox.cacheableResponse.Plugin({
                    statuses: [0, 200]
                }),
                new workbox.expiration.Plugin({
                    maxEntries: 100,
                    maxAgeSeconds: 30 * 24 * 60 * 60,
                }),
            ]
        })
    );


    workbox.routing.registerRoute(
        new RegExp('https://api.football-data.org/'),
        workbox.strategies.staleWhileRevalidate()
    )

    // Caching Google Fonts
    workbox.routing.registerRoute(
        /.*(?:googleapis|gstatic)\.com/,
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'google-fonts-stylesheets',
        })
    );

    workbox.routing.registerRoute(
        /\.(?:js|css)$/,
        new workbox.strategies.StaleWhileRevalidate({
            cacheName: 'static-resources',
        })
    );

    workbox.routing.registerRoute(
        new RegExp('/pages/'),
        workbox.strategies.staleWhileRevalidate({
            cacheName: 'pages'
        })
    );

} else {
    console.log(`Workbox gagal dimuat`);
}

self.addEventListener('push', event => {
    let body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    let options = {
        body: body,
        icon: '/icon/apple-icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});
