import { getAccessToken } from '../utils/auth.js';
import { BASE_URL } from '../config.js';

const ENDPOINTS = {
  // Auth
  REGISTER: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,

  //Stories
  STORIES: `${BASE_URL}/stories`,
  STORIES_DETAIL: (id) => `${BASE_URL}/stories/${id}`,
  ADD_STORY: `${BASE_URL}/stories`,
  ADD_STORY_GUEST: `${BASE_URL}/stories/guest`,

  //subscribe
  SUBSCRIBE: `${BASE_URL}/notifications/subscribe`,
  UNSUBSCRIBE: `${BASE_URL}/notifications/subscribe`,


};

export async function getRegistered({ name, email, password }) {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const result = await response.json();
    return { ...result, ok: response.ok };
  } catch (error) {
    return {
      error: true,
      message: 'Gagal terhubung ke server.',
      ok: false,
    };
  }
}

export async function login({ email, password }) {
  try {
    const data = JSON.stringify({ email, password });

    const fetchResponse = await fetch(ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data,
    });

    const json = await fetchResponse.json();

    return {
      ...json,
      ok: fetchResponse.ok,
    };
  } catch (error) {
    return {
      error: true,
      message: 'Terjadi kesalahan saat menghubungi server',
      ok: false,
    };
  }
}

export async function getAllStories(token) {
  const response = await fetch(ENDPOINTS.STORIES, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function getStoryById(token, id) {
  const response = await fetch(ENDPOINTS.STORIES_DETAIL(id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await response.json();
  return { ...result, ok: response.ok };

}

export async function addStory(token, formData) {
  console.log('TOKEN DI API:', token);
  const response = await fetch(ENDPOINTS.ADD_STORY, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  return { ...result, ok: response.ok };
}

export async function addStoryAsGuest(formData) {
  const response = await fetch(ENDPOINTS.ADD_STORY_GUEST, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  return { ...result, ok: response.ok };
}

export function getAboutInfo() {
  return {
    name: 'HimyStory App',
    description: 'Aplikasi cerita inspiratif dari pembelajar Dicoding di berbagai daerah di Indonesia. Anda dapat membaca, menulis, dan melihat lokasi cerita dari pengguna lain.',
    features: [
      '📝 Menambahkan cerita dengan dokumentasi dan lokasi',
      '🗺️ Melihat peta asal pengguna',
      '🔍 Mencari cerita berdasarkan nama atau isi cerita',
      '🔔 Push Notification untuk cerita baru',
      '📬 Fitur subscribe/unsubscribe Web Push',
    ],
  };
}

export async function subscribePushNotification({ endpoint, keys: { p256dh, auth } }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({
    endpoint,
    keys: { p256dh, auth },
  });

  const fetchResponse = await fetch(ENDPOINTS.SUBSCRIBE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}

export async function unsubscribePushNotification({ endpoint }) {
  const accessToken = getAccessToken();
  const data = JSON.stringify({ endpoint });

  const fetchResponse = await fetch(ENDPOINTS.UNSUBSCRIBE, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: data,
  });
  const json = await fetchResponse.json();

  return {
    ...json,
    ok: fetchResponse.ok,
  };
}


