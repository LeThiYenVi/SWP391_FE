const CACHE_NAME = 'cycle-tracker-v1';
const urlsToCache = [
  '/',
  '/dashboard',
  '/dashboard/cycle-tracking',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/favicon.ico',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        if (response) {
          return response;
        }
        
        return fetch(event.request).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response for caching
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Return offline page for HTML requests
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for cycle data
self.addEventListener('sync', (event) => {
  if (event.tag === 'cycle-data-sync') {
    event.waitUntil(syncCycleData());
  }
});

// Handle cycle data sync when back online
async function syncCycleData() {
  try {
    // Get pending data from IndexedDB
    const pendingData = await getPendingCycleData();
    
    if (pendingData && pendingData.length > 0) {
      // Send data to server
      for (const data of pendingData) {
        await syncDataToServer(data);
      }
      
      // Clear pending data after successful sync
      await clearPendingCycleData();
      
      // Send message to client
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            message: 'Dữ liệu chu kỳ đã được đồng bộ!'
          });
        });
      });
    }
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Mock functions for data sync (to be implemented with actual storage)
async function getPendingCycleData() {
  // Implementation would use IndexedDB
  return [];
}

async function syncDataToServer(data) {
  // Implementation would sync with actual API
  return Promise.resolve();
}

async function clearPendingCycleData() {
  // Implementation would clear IndexedDB
  return Promise.resolve();
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Xem chi tiết',
          icon: '/favicon.ico'
        },
        {
          action: 'close',
          title: 'Đóng',
          icon: '/favicon.ico'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    // Open the app
    event.waitUntil(
      clients.openWindow('/dashboard/cycle-tracking')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/dashboard/cycle-tracking')
    );
  }
}); 