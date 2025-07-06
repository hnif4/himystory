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
}
