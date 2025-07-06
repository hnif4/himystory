import { openDB } from 'idb';

const DB_NAME = 'himystory-db';
const DB_VERSION = 1;
const STORE_NAME = 'bookmarked-stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
});

const BookmarkStoryIdb = {
    async get(id) {
        return (await dbPromise).get(STORE_NAME, id);
    },
    async getAll() {
        return (await dbPromise).getAll(STORE_NAME);
    },
    async getStoryById(id) {
        if (!id) {
            throw new Error('`id` is required.');
        }
        return (await dbPromise).get(STORE_NAME, id);
    },
    async put(story) {
        if (!Object.hasOwn(story, 'id')) {
            throw new Error('`id` is required to save.');
        }
        return (await dbPromise).put(STORE_NAME, story);
    },
    async delete(id) {
        return (await dbPromise).delete(STORE_NAME, id);
    },
};

export default BookmarkStoryIdb;
