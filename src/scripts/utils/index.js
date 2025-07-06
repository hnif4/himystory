import { getAccessToken, removeAccessToken } from './auth.js';
import { subscribe, unsubscribe, isCurrentPushSubscriptionAvailable } from '../utils/notification-helper';

export function showFormattedDate(date, locale = 'en-US', options = {}) {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  });
}

export function sleep(time = 1000) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export async function updateNavigation() {
  const navList = document.getElementById('nav-list');
  const token = getAccessToken();

  if (!navList) return;

  navList.innerHTML = '';

  if (token) {
    const isSubscribed = await isCurrentPushSubscriptionAvailable();
    const subscribeButtonLabel = isSubscribed ? '🔕 Unsubscribe' : '🔔 Subscribe';

    navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/bookmark">Cerita Favorit</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>
      <li><a href="#/about">About</a></li>
      <li><button id="subscribe-btn" class="nav-button">${subscribeButtonLabel}</button></li>
      <li><a href="#" id="logout-link">Logout</a></li>
    `;

    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();

      const confirmLogout = confirm('Apakah benar Anda ingin keluar dari HimyStory?');

      if (confirmLogout) {
        removeAccessToken();
        localStorage.removeItem('name');
        location.hash = '/login';
        updateNavigation();
      }
    });

    await attachSubscribeButton(); 
  } else {
    navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
      <li><a href="#/add">Tambah Cerita</a></li>
    `;
  }
}

async function attachSubscribeButton() {
  const subscribeBtn = document.getElementById('subscribe-btn');
  if (!subscribeBtn) return;

  subscribeBtn.addEventListener('click', async () => {
    const currentStatus = await isCurrentPushSubscriptionAvailable();
    console.log('[NAVBAR] Tombol diklik. Status:', currentStatus);

    if (currentStatus) {
      console.log('[NAVBAR] Memanggil unsubscribe()');
      await unsubscribe();
    } else {
      console.log('[NAVBAR] Memanggil subscribe()');
      await subscribe();
    }

    updateNavigation();
  });
}


export function transitionHelper({ skipTransition = false, updateDOM }) {
  if (skipTransition || !document.startViewTransition) {
    const updateCallbackDone = Promise.resolve(updateDOM()).then(() => { });
    return {
      ready: Promise.reject(Error('View transitions unsupported')),
      updateCallbackDone,
      finished: updateCallbackDone,
    };
  }
  return document.startViewTransition(updateDOM);
}

export function isServiceWorkerAvailable() {
  return 'serviceWorker' in navigator;
}

export async function registerServiceWorker() {
  if (!isServiceWorkerAvailable()) {
    console.log('Service Worker API unsupported');
    return;
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.bundle.js');
    console.log('Service worker telah terpasang', registration);
  } catch (error) {
    console.log('Failed to install service worker:', error);
  }
}

export function convertBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

