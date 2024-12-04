// Firebase 초기화
const firebaseConfig = {
    apiKey: "AIzaSyBIS0YZ6eC290LZfWTZkIU2-LC5Z-qRadY",
    authDomain: "fb-test-b4125.firebaseapp.com",
    projectId: "fb-test-b4125",
    storageBucket: "fb-test-b4125.firebasestorage.app",
    messagingSenderId: "275535962325",
    appId: "1:275535962325:web:97997bd7910ada21a0c25c",
    measurementId: "G-V98NDB8N6R"
};

// Firebase 및 Firestore 초기화
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Firestore 데이터 가져오기 예제
console.log("Firestore 연결 성공");

// Firestore에서 뉴스 데이터를 가져와 동적으로 페이지에 표시
async function fetchNews(category = null) {
    const newsContainer = document.getElementById("news-list");
    newsContainer.innerHTML = "<p>로딩 중...</p>"; // 로딩 메시지 표시

    try {
        // Firestore에서 데이터 가져오기
        let query = db.collection("news"); // Firestore 컬렉션 참조

        // (선택) 카테고리가 있는 경우 필터링
        if (category) {
            query = query.where("category", "==", category);
        }

        const querySnapshot = await query.get();

        // 데이터 표시
        newsContainer.innerHTML = ""; // 기존 데이터 초기화
        querySnapshot.forEach((doc) => {
            const news = doc.data();

            // 뉴스 항목 생성
            const newsItem = document.createElement("li");
            newsItem.innerHTML = `
                <div class="border-b pb-2 mb-2">
                    <h3 class="font-bold text-lg">${news.title}</h3>
                    <p class="text-sm text-gray-600">${news.description}</p>
                    <a href="${news.link}" target="_blank" class="text-blue-500 hover:underline">기사 보기</a>
                </div>
            `;
            newsContainer.appendChild(newsItem);
        });

        // 데이터가 없는 경우 처리
        if (querySnapshot.empty) {
            newsContainer.innerHTML = "<p>뉴스 데이터가 없습니다.</p>";
        }
    } catch (error) {
        console.error("뉴스 데이터를 가져오는 중 오류 발생:", error);
        newsContainer.innerHTML = "<p>데이터를 가져오는 중 오류가 발생했습니다.</p>";
    }
}

// Firebase Cloud Messaging 초기화
const messaging = firebase.messaging();

// Firebase Authentication 초기화
const auth = firebase.auth();

// 서비스 워커 등록
navigator.serviceWorker.register('/firebase-messaging-sw.js')
    .then((registration) => {
        console.log('서비스 워커 등록 성공:', registration);

    })
    .catch((error) => {
        console.error('서비스 워커 등록 실패:', error);
    });

    // 익명 로그인
auth.signInAnonymously()
.then(() => {
    console.log("익명 인증 성공");

    // FCM 토큰 요청
    requestNotificationPermission();
})
.catch((error) => {
    console.error("익명 인증 실패:", error);
});

// FCM 권한 요청
function requestNotificationPermission() {
    Notification.requestPermission()
        .then((permission) => {
            if (permission === "granted") {
                console.log("알림 권한이 허용되었습니다.");
                // 서비스 워커가 정상 등록되었는지 확인 후 FCM 토큰 요청
                messaging.getToken({ vapidKey:'BPE1p72HlE_8-NiKn0F0bjBOOgUexaSIVnfs8EeCzVc2X_AKvRDvb9dds6_0IN70CGcnHg6jWPxF-CMQk_bcCk0'})  // VAPID 키는 Firebase 콘솔에서 확인할 수 있습니다.
                    .then((token) => {
                        console.log("FCM 토큰:", token);
                        // 이 토큰을 서버나 Firestore에 저장할 수 있습니다.
                    })
                    .catch((error) => {
                        console.error("FCM 토큰 가져오기 실패:", error);
                    });
            } else {
                console.log("알림 권한이 거부되었습니다.");
            }
        })
        .catch((error) => {
            console.error("알림 권한 요청 실패:", error);
        });
}
