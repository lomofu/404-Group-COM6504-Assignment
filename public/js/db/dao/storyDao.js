import { db, STORY_STORE_NAME } from "/js/db/database.js";

class storyDao {
    constructor(db) {
        this.db = db;
    }

    async getStoryData() {
        try {
            let tx = await db.transaction(STORY_STORE_NAME, "readonly");
            let store = await tx.objectStore(STORY_STORE_NAME);
            let index = await store.index("id");
            let readingsList = await index.getAll();
            await tx.complete;
            return readingsList;
        } catch (e) {
            console.log(e);
        }
    }

    async storeStoryData(storyObject) {
        try {
            let tx = await db.transaction(STORY_STORE_NAME, "readwrite");
            let store = await tx.objectStore(STORY_STORE_NAME);
            await store.put(storyObject);
            await tx.complete;
        } catch (error) {
            console.log("error: I could not store the element. Reason: " + error);
        }
    }
}

export default new storyDao(db);