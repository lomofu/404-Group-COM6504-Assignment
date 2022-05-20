/**
 * @desc Different methods for story in IndexedDB.
 * @format
 */

import { db, STORY_STORE_NAME } from "/js/db/database.js";

class storyDao {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get story list when offline.
   * @returns {Promise<*>}
   */
  async getOfflineStoryList() {
    const data = await this.getStoryList();
    return data.filter((e) => e.offline);
  }

  /**
   * Get story list in IndexedDB.
   * @returns {Promise<*>}
   */
  async getStoryList() {
    const objectStore = db
      .transaction(STORY_STORE_NAME)
      .objectStore(STORY_STORE_NAME);
    const list = await objectStore.getAll();
    list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    return list;
  }

  async getStoryDetail(id) {
    const list = await this.getStoryList();
    return list.find((e) => e.id == id);
  }

  /**
   * Store story data in IndexedDB.
   * @param storyObject
   * @returns {Promise<void>}
   */
  async storeAStoryData(storyObject) {
    try {
      let tx = await db.transaction(STORY_STORE_NAME, "readwrite");
      let store = await tx.objectStore(STORY_STORE_NAME);
      await store.put(storyObject);
      await tx.complete;
      return storyObject.id;
    } catch (error) {
      console.error("error: I could not store the element. Reason: " + error);
    }
  }

  /**
   * Store story list in IndexedDB.
   * @param list
   * @returns {Promise<void>}
   */
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

  /**
   * Delete offline story list when system online.
   * @returns {Promise<void>}
   */
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
