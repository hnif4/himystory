import { getStoryById } from '../../data/api';
import { getAccessToken } from '../../utils/auth';

export default class BookmarkStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialGallery() {
    this.#view.showStoriesListLoading();

    try {
      await this.#cleanInvalidBookmarks();
      const stories = await this.#model.getAll();
      const message = 'Berhasil mendapatkan cerita tersimpan.';

      this.#view.populateBookmarkedStories(message, stories);
    } catch (error) {
      console.error('initialGallery error:', error);
      this.#view.populateBookmarkedStoriesError(error.message);
    } finally {
      this.#view.hideStoriesListLoading();
    }
  }
  async #cleanInvalidBookmarks() {
    const allBookmarks = await this.#model.getAll();
    const token = getAccessToken();
    let hasDeleted = false;

    for (const story of allBookmarks) {
      try {
        const response = await getStoryById(token, story.id);
        if (!response || response.error) {
          await this.#model.delete(story.id);
          console.log(`Cerita ID ${story.id} dihapus karena tidak valid.`);
          hasDeleted = true;
        }
      } catch (err) {
        console.error('Gagal memeriksa cerita favorit:', err);
      }
    }

    if (hasDeleted) {
      this.#view.showToast('Beberapa cerita favorit telah dihapus karena tidak tersedia lagi.');
    }
  }
}
