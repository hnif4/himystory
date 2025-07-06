class BookmarkPage {
  async render() {
    return `
      <section class="container">
        <h1>Cerita Tersimpan</h1>
        <p>Ini daftar cerita yang sudah kamu bookmark.</p>
        <div id="bookmarked-stories" class="story-list"></div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.getElementById('bookmarked-stories');
    container.innerHTML = `<p>Belum ada cerita yang disimpan.</p>`;
  }
}

export default BookmarkPage;
