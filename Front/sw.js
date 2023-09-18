self.addEventListener("install", e => {
  // console.log("[Service Worker] installed");
  self.skipWaiting();
});

// activate event
self.addEventListener("activate", e => {
  // console.log("[Service Worker] actived", e);
  e.waitUntil(self.clients.claim());
});

// fetch event
self.addEventListener("fetch", e => {
  // console.log("[Service Worker] fetched resource " + e.request.url);
});

self.addEventListener("notificationclick", function (event) {
  //알림 팝업의 버튼 액션
  switch (event.action) {
    case "goTab":
      event.notification.close(); // Notification을 닫습니다.

      event.waitUntil(
        clients
          .matchAll({
            //같은 주소의 페이지가 열려있는 경우 focus

            type: "window",
          })
          .then(function (clientList) {
            // console.log(clientList);
            // for (var i = 0; i < clientList.length; i++) {
            //   var client = clientList[i];

            //   if (client.url === "/" && "focus" in client) {
            //     return client.focus();
            //   }
            // }

            // if (clients.openWindow) {
            //같은 주소가 아닌 경우 새창으로
            var client = clientList[0];
            return client.navigate(event.notification.data);
            // }
          })
      );
      break;
    default:
      // console.log(`Unknown action clicked: '${event.action}'`);
      break;
  }
});
