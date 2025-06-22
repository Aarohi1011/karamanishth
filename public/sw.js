self.addEventListener('push', function (event) {
  const data = event.data.json();

  console.log("📩 Push received", data); // Optional debug

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192x192.png',
      image: data.image,
      actions: data.actions,
      data: data.data
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  const action = event.action;
  const notification = event.notification;
  const data = notification.data || {};
  let urlToOpen = '/';

  if (action === 'accept' && data.acceptUrl) {
    urlToOpen = data.acceptUrl;
  } else if (action === 'reject' && data.rejectUrl) {
    urlToOpen = data.rejectUrl;
  } else if (data.defaultUrl) {
    urlToOpen = data.defaultUrl;
  }

  event.notification.close();

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
