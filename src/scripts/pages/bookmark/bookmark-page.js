import BookmarkStoryPresenter from './bookmark-story-presenter';
import BookmarkStoryIdb from '../../data/database';

export default class BookmarkStoryPage {
  #presenter;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Cerita Favorit</h1>
        <div class="story-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkStoryPresenter({
      view: this,
      model: BookmarkStoryIdb,
    });

    await this.#presenter.initialGallery();
  }

  showStoriesListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = `
      <div class="loader"></div>
    `;
  }

  hideStoriesListLoading() {
    document.getElementById('stories-list-loading-container').innerHTML = '';
  }

  populateBookmarkedStories(_, stories) {
    if (!stories.length) {
      this.populateBookmarkedStoriesListEmpty();
      return;
    }

    const html = stories.map((story) => `
      <div class="story-card">
        <img src="${story.photoUrl}" alt="${story.name}">
        <div class="story-info">
          <h2>${story.name}</h2>
          <p>${story.description}</p>
          <a href="/#/story/${story.id}" class="btn">Baca Selengkapnya</a>
        </div>
      </div>
    `).join('');

    document.getElementById('stories-list').innerHTML = `
      <div class="story-list">${html}</div>
    `;
  }

  populateBookmarkedStoriesListEmpty() {
    document.getElementById('stories-list').innerHTML = `
      <p class="empty-message">Belum ada cerita favorit yang tersimpan.</p>
    `;
  }

  populateBookmarkedStoriesError(message) {
    document.getElementById('stories-list').innerHTML = `
      <p class="error-message">${message}</p>
    `;
  }
  showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerText = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

}
