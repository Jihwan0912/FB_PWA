// Firebase SDK 파일을 importScripts로 로드
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Firebase 설정
const firebaseConfig = {
    apiKey: "AIzaSyBIS0YZ6eC290LZfWTZkIU2-LC5Z-qRadY",
    authDomain: "fb-test-b4125.firebaseapp.com",
    projectId: "fb-test-b4125",
    storageBucket: "fb-test-b4125.firebasestorage.app",
    messagingSenderId: "275535962325",
    appId: "1:275535962325:web:97997bd7910ada21a0c25c",
    measurementId: "G-V98NDB8N6R"
};



// Firebase 초기화
firebase.initializeApp(firebaseConfig);

// Firebase Messaging 초기화
const messaging = firebase.messaging();

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('pwa-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/app.js',
                '/icons/icon-192x192.png',
                '/icons/icon-512x512.png'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

// 백그라운드 푸시 알림 처리
messaging.onBackgroundMessage((payload) => {
    console.log("백그라운드 푸시 알림:", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    // 서비스 워커를 통해 알림 표시
    self.registration.showNotification(notificationTitle, notificationOptions);
});
