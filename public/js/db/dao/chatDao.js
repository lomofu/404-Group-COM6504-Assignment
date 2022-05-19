/**
 * @desc Different methods for chat in IndexedDB.
 * @format */

import { db, CHAT_STORE_NAME } from "/js/db/database.js";

class ChatDao {
  constructor(db) {
    this.db = db;
  }

  /**
   * Get chat data in IndexedDB.
   * @param roomId
   * @returns {Promise<*>}
   */
  async getChatData(roomId) {
    try {
      let tx = await db.transaction(CHAT_STORE_NAME, "readonly");
      let store = await tx.objectStore(CHAT_STORE_NAME);
      let index = await store.index("roomId");
      let readingsList = await index.getAll(IDBKeyRange.only(roomId));
      await tx.complete;
      return readingsList;
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Store chat data in IndexedDB.
   * @param chatObject
   * @returns {Promise<void>}
   */
  async storeChatData(chatObject) {
    try {
      let tx = await db.transaction(CHAT_STORE_NAME, "readwrite");
      let store = await tx.objectStore(CHAT_STORE_NAME);
      await store.put(chatObject);
      await tx.complete;
    } catch (error) {
      console.log("error: I could not store the element. Reason: " + error);
    }
  }
}

export default new ChatDao(db);
