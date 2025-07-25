import StoryDetailPresenter from './story-detail-presenter.js';
import * as API from '../../data/api.js';
import { showFormattedDate } from '../../utils';
import { getAccessToken } from '../../utils/auth.js';
import StoryMap from '../../utils/map.js';
import BookmarkStoryIdb from '../../data/database.js';

export default class StoryDetailPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="detail-title">📖 Detail Cerita</h1>

        <div id="story-detail" class="story-detail"></div>

        <h2 class="detail-map-title">📍 Lokasi pada Peta</h2>
        <div id="detail-map" style="height: 400px; margin-top: 20px;"></div>
      </section>
    `;
  }

  async afterRender() {

    const url = window.location.hash;
    const id = url.split('/')[2];

    this.#presenter = new StoryDetailPresenter({
      view: this,
      model: API,
    });

    this.showLoading();

    const token = getAccessToken();
    await this.#presenter.loadStoryById(id, token);
  }

  async showStoryDetail(story, locationName) {
    
    const detailContainer = document.getElementById('story-detail');
    detailContainer.innerHTML = `
      <div class="story-card detail-card">
        <img class="detail-img" src="${story.photoUrl}" alt="${story.name}">
        <div class="story-info">
          <h2>${story.name}</h2>
          <p class="detail-description">${story.description}</p>
          <small><strong>Dibuat pada:</strong> ${showFormattedDate(story.createdAt, 'id-ID')}</small><br>
          <small><strong>Lokasi:</strong> ${locationName}</small>
          <div style="margin-top: 1rem;">
          <button id="bookmark-btn" class="btn-bookmark">Simpan Cerita</button>
          </div>
        </div>
      </div>
    `;

    // Cek apakah sudah dibookmark
    const bookmarkBtn = document.getElementById('bookmark-btn');
    const isBookmarked = await BookmarkStoryIdb.get(story.id);

    bookmarkBtn.innerHTML = isBookmarked
      ? '<i class="fas fa-bookmark"></i> Buang Cerita'
      : '<i class="far fa-bookmark"></i> Simpan Cerita';


    bookmarkBtn.addEventListener('click', async () => {
      const current = await BookmarkStoryIdb.get(story.id);

      if (current) {
        await BookmarkStoryIdb.delete(story.id);
        bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i> Simpan Cerita';
      } else {
        await BookmarkStoryIdb.put(story);
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i> Buang Cerita';
      }


    });

  }

  async showMapMarker({ lat, lon, name }) {
    const storyMap = new StoryMap('detail-map');
    await storyMap.addPopupMarker({ lat, lon, name });
  }

  showError(message) {
    document.getElementById('story-detail').innerHTML = `<p style="color: red;">${message}</p>`;
  }

  showLoading() {
    document.getElementById('story-detail').innerHTML = '<p>Loading...</p>';
  }
}
