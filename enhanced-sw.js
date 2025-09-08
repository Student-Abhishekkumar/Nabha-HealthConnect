// Enhanced Service Worker for Nabha HealthConnect PWA
// Provides advanced offline functionality, background sync, and push notifications

const CACHE_NAME = 'nabha-health-v2.0';
const STATIC_CACHE = 'nabha-static-v2.0';
const DYNAMIC_CACHE = 'nabha-dynamic-v2.0';
const IMAGE_CACHE = 'nabha-images-v2.0';
const API_CACHE = 'nabha-api-v2.0';

// Cache strategies for different resource types
const CACHE_STRATEGIES = {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
    NETWORK_ONLY: 'network-only',
    CACHE_ONLY: 'cache-only'
};

// Essential resources to cache immediately
const ESSENTIAL_RESOURCES = [
    '/enhanced-nabha-health-pwa.html',
    '/manifest.json',
    '/',
    // Add critical CSS and JS files when separated
    // '/css/styles.css',
    // '/js/app.js',
    // '/js/api.js'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/v1/doctors',
    '/api/v1/pharmacies',
    '/api/v1/emergency-contacts',
    '/api/v1/villages',
    '/api/v1/specializations'
];

// Image resources to cache
const IMAGE_RESOURCES = [
    '/assets/img/logo.svg',
    '/assets/img/hero-banner.jpg',
    '/assets/icons/medical-icons.svg'
];

// Background sync tags
const SYNC_TAGS = {
    APPOINTMENT_BOOKING: 'appointment-booking',
    EMERGENCY_ALERT: 'emergency-alert',
    SYMPTOM_ANALYSIS: 'symptom-analysis',
    OFFLINE_ACTIONS: 'offline-actions'
};

// Install event - cache essential resources
self.addEventListener('install', event => {
    console.log('[SW] Install Event - Version 2.0');
    
    event.waitUntil(
        Promise.all([
            // Cache essential resources
            caches.open(STATIC_CACHE).then(cache => {
                console.log('[SW] Caching essential resources');
                return cache.addAll(ESSENTIAL_RESOURCES);
            }),
            
            // Cache API endpoints
            caches.open(API_CACHE).then(cache => {
                console.log('[SW] Caching API endpoints');
                return Promise.all(
                    API_ENDPOINTS.map(endpoint => {
                        return fetch(endpoint).then(response => {
                            if (response.ok) {
                                return cache.put(endpoint, response);
                            }
                        }).catch(err => {
                            console.log(`[SW] Failed to cache API endpoint: ${endpoint}`);
                        });
                    })
                );
            }),
            
            // Cache images
            caches.open(IMAGE_CACHE).then(cache => {
                console.log('[SW] Caching images');
                return cache.addAll(IMAGE_RESOURCES).catch(err => {
                    console.log('[SW] Some images failed to cache');
                });
            })
        ]).then(() => {
            console.log('[SW] All caches initialized');
            return self.skipWaiting();
        }).catch(error => {
            console.error('[SW] Cache initialization failed:', error);
        })
    );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', event => {
    console.log('[SW] Activate Event');
    
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                const validCaches = [STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE, API_CACHE];
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (!validCaches.includes(cacheName)) {
                            console.log(`[SW] Deleting old cache: ${cacheName}`);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            
            // Take control of all pages
            self.clients.claim(),
            
            // Initialize background sync
            initializeBackgroundSync()
        ]).then(() => {
            console.log('[SW] Service worker activated and ready');
            // Notify clients about activation
            broadcastMessage({ type: 'SW_ACTIVATED', version: '2.0' });
        })
    );
});

// Fetch event - implement intelligent caching strategies
self.addEventListener('fetch', event => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Skip non-GET requests for caching
    if (request.method !== 'GET') {
        return handleNonGetRequest(event);
    }
    
    // Skip cross-origin requests (except for specific APIs)
    if (url.origin !== self.location.origin && !isAllowedExternalOrigin(url.origin)) {
        return;
    }
    
    // Route requests to appropriate handlers
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(handleAPIRequest(request));
    } else if (isImageRequest(request)) {
        event.respondWith(handleImageRequest(request));
    } else if (isStaticResource(request)) {
        event.respondWith(handleStaticResource(request));
    } else {
        event.respondWith(handleDynamicRequest(request));
    }
});

// Handle API requests with network-first strategy
async function handleAPIRequest(request) {
    const cache = await caches.open(API_CACHE);
    
    try {
        // Try network first for fresh data
        const networkResponse = await fetch(request.clone());
        
        if (networkResponse.ok) {
            // Cache successful responses
            cache.put(request, networkResponse.clone());
            console.log(`[SW] API cache updated: ${request.url}`);
        }
        
        return networkResponse;
    } catch (error) {
        console.log(`[SW] API network failed, trying cache: ${request.url}`);
        
        // Fallback to cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            // Add offline indicator header
            const response = cachedResponse.clone();
            response.headers.set('X-Served-By', 'ServiceWorker-Cache');
            return response;
        }
        
        // Return offline response
        return createOfflineAPIResponse(request);
    }
}

// Handle image requests with cache-first strategy
async function handleImageRequest(request) {
    const cache = await caches.open(IMAGE_CACHE);
    
    // Try cache first
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        console.log(`[SW] Image served from cache: ${request.url}`);
        return cachedResponse;
    }
    
    try {
        // Fetch from network
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
            console.log(`[SW] Image cached: ${request.url}`);
        }
        
        return networkResponse;
    } catch (error) {
        console.log(`[SW] Image failed to load: ${request.url}`);
        return createPlaceholderImage();
    }
}

// Handle static resources with cache-first strategy
async function handleStaticResource(request) {
    const cache = await caches.open(STATIC_CACHE);
    
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
        console.log(`[SW] Static resource from cache: ${request.url}`);
        
        // Update cache in background (stale-while-revalidate)
        fetch(request).then(response => {
            if (response.ok) {
                cache.put(request, response);
                console.log(`[SW] Static cache updated in background: ${request.url}`);
            }
        }).catch(() => {
            // Silently fail background updates
        });
        
        return cachedResponse;
    }
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        // Return offline page for navigation requests
        if (request.mode === 'navigate') {
            const offlinePage = await cache.match('/enhanced-nabha-health-pwa.html');
            return offlinePage || createOfflineResponse();
        }
        
        throw error;
    }
}

// Handle dynamic requests with network-first strategy
async function handleDynamicRequest(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        const cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            console.log(`[SW] Dynamic resource from cache: ${request.url}`);
            return cachedResponse;
        }
        
        // For navigation requests, return the main app
        if (request.mode === 'navigate') {
            const appResponse = await cache.match('/enhanced-nabha-health-pwa.html');
            return appResponse || createOfflineResponse();
        }
        
        throw error;
    }
}

// Handle non-GET requests (POST, PUT, DELETE)
function handleNonGetRequest(event) {
    const request = event.request;
    
    // Handle appointment bookings
    if (request.url.includes('/api/appointments') && request.method === 'POST') {
        event.respondWith(handleAppointmentBooking(request));
        return;
    }
    
    // Handle emergency alerts
    if (request.url.includes('/api/emergency') && request.method === 'POST') {
        event.respondWith(handleEmergencyAlert(request));
        return;
    }
    
    // Default: pass through to network
    event.respondWith(fetch(request));
}

// Handle appointment booking with background sync
async function handleAppointmentBooking(request) {
    try {
        const response = await fetch(request.clone());
        
        if (response.ok) {
            return response;
        } else {
            throw new Error('Network request failed');
        }
    } catch (error) {
        console.log('[SW] Appointment booking failed, storing for background sync');
        
        // Store for background sync
        const requestData = await request.clone().json();
        await storeForBackgroundSync(SYNC_TAGS.APPOINTMENT_BOOKING, {
            url: request.url,
            method: request.method,
            headers: Object.fromEntries(request.headers.entries()),
            body: requestData,
            timestamp: Date.now()
        });
        
        // Register background sync
        await self.registration.sync.register(SYNC_TAGS.APPOINTMENT_BOOKING);
        
        // Return optimistic response
        return new Response(JSON.stringify({
            success: true,
            id: 'offline-' + Date.now(),
            status: 'pending-sync',
            message: 'Appointment will be confirmed when online'
        }), {
            status: 202,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Handle emergency alerts with background sync
async function handleEmergencyAlert(request) {
    try {
        const response = await fetch(request.clone());
        return response;
    } catch (error) {
        console.log('[SW] Emergency alert failed, storing for background sync');
        
        const requestData = await request.clone().json();
        await storeForBackgroundSync(SYNC_TAGS.EMERGENCY_ALERT, {
            url: request.url,
            method: request.method,
            body: requestData,
            timestamp: Date.now(),
            priority: 'high'
        });
        
        await self.registration.sync.register(SYNC_TAGS.EMERGENCY_ALERT);
        
        return new Response(JSON.stringify({
            success: true,
            message: 'Emergency alert will be sent when online',
            status: 'queued'
        }), {
            status: 202,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

// Background sync event handler
self.addEventListener('sync', event => {
    console.log(`[SW] Background sync triggered: ${event.tag}`);
    
    switch (event.tag) {
        case SYNC_TAGS.APPOINTMENT_BOOKING:
            event.waitUntil(syncAppointments());
            break;
        case SYNC_TAGS.EMERGENCY_ALERT:
            event.waitUntil(syncEmergencyAlerts());
            break;
        case SYNC_TAGS.SYMPTOM_ANALYSIS:
            event.waitUntil(syncSymptomAnalyses());
            break;
        default:
            event.waitUntil(syncOfflineActions());
    }
});

// Sync pending appointments
async function syncAppointments() {
    try {
        const pendingAppointments = await getStoredData(SYNC_TAGS.APPOINTMENT_BOOKING);
        
        for (const appointment of pendingAppointments) {
            try {
                const response = await fetch(appointment.url, {
                    method: appointment.method,
                    headers: appointment.headers || { 'Content-Type': 'application/json' },
                    body: JSON.stringify(appointment.body)
                });
                
                if (response.ok) {
                    await removeStoredData(SYNC_TAGS.APPOINTMENT_BOOKING, appointment.timestamp);
                    console.log('[SW] Appointment synced successfully');
                    
                    // Notify client
                    broadcastMessage({
                        type: 'APPOINTMENT_SYNCED',
                        data: await response.json()
                    });
                } else {
                    throw new Error(`HTTP ${response.status}`);
                }
            } catch (error) {
                console.error('[SW] Failed to sync appointment:', error);
                // Keep in queue for retry
            }
        }
    } catch (error) {
        console.error('[SW] Appointment sync failed:', error);
    }
}

// Sync emergency alerts
async function syncEmergencyAlerts() {
    try {
        const pendingAlerts = await getStoredData(SYNC_TAGS.EMERGENCY_ALERT);
        
        for (const alert of pendingAlerts) {
            try {
                const response = await fetch(alert.url, {
                    method: alert.method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(alert.body)
                });
                
                if (response.ok) {
                    await removeStoredData(SYNC_TAGS.EMERGENCY_ALERT, alert.timestamp);
                    console.log('[SW] Emergency alert synced successfully');
                    
                    broadcastMessage({
                        type: 'EMERGENCY_ALERT_SYNCED',
                        data: await response.json()
                    });
                }
            } catch (error) {
                console.error('[SW] Failed to sync emergency alert:', error);
            }
        }
    } catch (error) {
        console.error('[SW] Emergency alert sync failed:', error);
    }
}

// Sync symptom analyses
async function syncSymptomAnalyses() {
    try {
        const pendingAnalyses = await getStoredData(SYNC_TAGS.SYMPTOM_ANALYSIS);
        
        for (const analysis of pendingAnalyses) {
            // Sync with analytics endpoint
            try {
                await fetch('/api/analytics/symptoms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(analysis.body)
                });
                
                await removeStoredData(SYNC_TAGS.SYMPTOM_ANALYSIS, analysis.timestamp);
            } catch (error) {
                console.error('[SW] Failed to sync symptom analysis:', error);
            }
        }
    } catch (error) {
        console.error('[SW] Symptom analysis sync failed:', error);
    }
}

// Push notification handler
self.addEventListener('push', event => {
    console.log('[SW] Push notification received');
    
    let notificationData = {
        title: 'Nabha HealthConnect',
        body: 'You have a new notification',
        icon: '/assets/icons/icon-192.png',
        badge: '/assets/icons/badge-72.png',
        tag: 'default'
    };
    
    if (event.data) {
        try {
            const data = event.data.json();
            notificationData = { ...notificationData, ...data };
        } catch (error) {
            console.error('[SW] Failed to parse push notification data');
        }
    }
    
    // Customize notification based on type
    if (notificationData.type === 'appointment-reminder') {
        notificationData.title = 'Appointment Reminder';
        notificationData.body = `Your appointment with ${notificationData.doctor} is tomorrow at ${notificationData.time}`;
        notificationData.actions = [
            { action: 'confirm', title: 'Confirm', icon: '/assets/icons/confirm.png' },
            { action: 'reschedule', title: 'Reschedule', icon: '/assets/icons/reschedule.png' }
        ];
    } else if (notificationData.type === 'medicine-reminder') {
        notificationData.title = 'Medicine Reminder';
        notificationData.body = `Time to take your ${notificationData.medicine}`;
        notificationData.actions = [
            { action: 'taken', title: 'Taken', icon: '/assets/icons/check.png' },
            { action: 'snooze', title: 'Remind Later', icon: '/assets/icons/snooze.png' }
        ];
    }
    
    event.waitUntil(
        self.registration.showNotification(notificationData.title, notificationData)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('[SW] Notification clicked');
    event.notification.close();
    
    let targetUrl = '/enhanced-nabha-health-pwa.html';
    
    if (event.action === 'confirm') {
        targetUrl += '#appointments';
    } else if (event.action === 'reschedule') {
        targetUrl += '#appointments?action=reschedule';
    } else if (event.action === 'taken') {
        // Log medicine taken
        logMedicineTaken(event.notification.data);
        return;
    } else if (event.notification.data && event.notification.data.url) {
        targetUrl = event.notification.data.url;
    }
    
    event.waitUntil(
        clients.matchAll({ includeUncontrolled: true }).then(clientList => {
            // Check if app is already open
            for (const client of clientList) {
                if (client.url === targetUrl && 'focus' in client) {
                    return client.focus();
                }
            }
            
            // Open new window/tab
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});

// Utility functions
function isAllowedExternalOrigin(origin) {
    const allowedOrigins = [
        'https://api.nabha-health.gov.in',
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
    ];
    return allowedOrigins.includes(origin);
}

function isImageRequest(request) {
    return request.destination === 'image' || 
           /\.(jpg|jpeg|png|gif|webp|svg|ico)$/i.test(request.url);
}

function isStaticResource(request) {
    return /\.(css|js|html|json)$/i.test(request.url) || 
           request.url.includes('/manifest.json');
}

// Create offline responses
function createOfflineResponse() {
    return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Offline - Nabha HealthConnect</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 2rem; }
                .offline { color: #666; }
            </style>
        </head>
        <body>
            <div class="offline">
                <h1>🏥 Nabha HealthConnect</h1>
                <h2>You are currently offline</h2>
                <p>Some features may be limited. The app will work normally when you're back online.</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        </body>
        </html>
    `, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
    });
}

function createOfflineAPIResponse(request) {
    return new Response(JSON.stringify({
        error: 'offline',
        message: 'This feature requires internet connection',
        offline: true,
        timestamp: Date.now()
    }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
    });
}

function createPlaceholderImage() {
    // Return a simple placeholder SVG
    const placeholderSVG = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="200" fill="#E3F2FD"/>
            <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#1976D2">
                Image unavailable offline
            </text>
        </svg>
    `;
    
    return new Response(placeholderSVG, {
        status: 200,
        headers: { 'Content-Type': 'image/svg+xml' }
    });
}

// IndexedDB functions for storing offline data
async function storeForBackgroundSync(tag, data) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('NabhaHealthOffline', 1);
        
        request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains('syncQueue')) {
                db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
            }
        };
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            
            store.add({ tag, data, timestamp: Date.now() });
            
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        };
        
        request.onerror = () => reject(request.error);
    });
}

async function getStoredData(tag) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('NabhaHealthOffline', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['syncQueue'], 'readonly');
            const store = transaction.objectStore('syncQueue');
            
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                const allData = getAllRequest.result;
                const taggedData = allData
                    .filter(item => item.tag === tag)
                    .map(item => item.data);
                resolve(taggedData);
            };
            
            getAllRequest.onerror = () => reject(getAllRequest.error);
        };
        
        request.onerror = () => reject(request.error);
    });
}

async function removeStoredData(tag, timestamp) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('NabhaHealthOffline', 1);
        
        request.onsuccess = () => {
            const db = request.result;
            const transaction = db.transaction(['syncQueue'], 'readwrite');
            const store = transaction.objectStore('syncQueue');
            
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                const allData = getAllRequest.result;
                const itemToDelete = allData.find(item => 
                    item.tag === tag && item.data.timestamp === timestamp
                );
                
                if (itemToDelete) {
                    store.delete(itemToDelete.id);
                }
                
                resolve();
            };
        };
    });
}

// Broadcast message to all clients
function broadcastMessage(message) {
    self.clients.matchAll().then(clients => {
        clients.forEach(client => {
            client.postMessage(message);
        });
    });
}

// Initialize background sync on activation
function initializeBackgroundSync() {
    // Register for periodic sync if supported
    if ('periodicSync' in self.registration) {
        return self.registration.periodicSync.register('data-sync', {
            minInterval: 24 * 60 * 60 * 1000 // Once per day
        });
    }
    return Promise.resolve();
}

// Handle periodic sync
self.addEventListener('periodicsync', event => {
    if (event.tag === 'data-sync') {
        event.waitUntil(performDataSync());
    }
});

async function performDataSync() {
    console.log('[SW] Performing periodic data sync');
    
    // Sync all pending operations
    await Promise.all([
        syncAppointments(),
        syncEmergencyAlerts(),
        syncSymptomAnalyses()
    ]);
    
    // Update cached API data
    await updateAPICache();
}

async function updateAPICache() {
    const cache = await caches.open(API_CACHE);
    
    for (const endpoint of API_ENDPOINTS) {
        try {
            const response = await fetch(endpoint);
            if (response.ok) {
                await cache.put(endpoint, response);
                console.log(`[SW] Updated cache for ${endpoint}`);
            }
        } catch (error) {
            console.log(`[SW] Failed to update cache for ${endpoint}`);
        }
    }
}

function logMedicineTaken(data) {
    // Log medicine taken to IndexedDB or send to server
    fetch('/api/medicine/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            medicine: data.medicine,
            timestamp: Date.now(),
            action: 'taken'
        })
    }).catch(error => {
        console.log('[SW] Failed to log medicine taken:', error);
    });
}

console.log('[SW] Enhanced Service Worker loaded successfully - v2.0');