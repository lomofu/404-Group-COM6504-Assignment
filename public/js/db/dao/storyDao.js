/** @format */

import { db, STORY_STORE_NAME } from "/js/db/database.js";

class storyDao {
    constructor(db) {
        this.db = db;
    }

    async getOfflineStoryList() {
        const data = await this.getStoryList();
        return data.filter((e) => e.offline);
    }

    async getStoryList() {
        const objectStore = db
            .transaction(STORY_STORE_NAME)
            .objectStore(STORY_STORE_NAME);
        return await objectStore.getAll();
    }

    async storeAStoryData(storyObject) {
        try {
            let tx = await db.transaction(STORY_STORE_NAME, "readwrite");
            let store = await tx.objectStore(STORY_STORE_NAME);
            await store.put(storyObject);
            await tx.complete;
        } catch (error) {
            console.error("error: I could not store the element. Reason: " + error);
        }
    }

    async storeStoryList(list) {
        let tx = await db.transaction(STORY_STORE_NAME, "readwrite");
        let store = await tx.objectStore(STORY_STORE_NAME);
        if (list.length > 0) {
            try {
                for (const e of list) {
                    store.delete(e.id);
                    store.put(e);
                }
                await tx.complete;
            } catch (e) {
                console.error("error: I could not store the list. Reason: " + error);
            }
        } else {
            const data = await this.getStoryList();
            data.forEach((e) => {
                store.delete(e.id);
            });
        }
    }

    async deleteOfflineStoryList() {
        const data = await this.getOfflineStoryList();
        let tx = await db.transaction(STORY_STORE_NAME, "readwrite");
        let store = await tx.objectStore(STORY_STORE_NAME);

        if (data.length > 0) {
            try {
                for (const e of data) {
                    store.delete(e.id);
                }
                await tx.complete;
            } catch (e) {
                console.error("error: I could not store the list. Reason: " + error);
            }
        }
    }
}

export default new storyDao(db);