/** @format */

import { db, CHAT_STORE_NAME } from "/js/db/database.js";

class ChatDao {
  constructor(db) {
    this.db = db;
  }

  async getChatData(roomId) {
    try {
      console.log("fetching: " + roomId);
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

  async storeChatData(chatObject) {
    try {
      let tx = await db.transaction(CHAT_STORE_NAME, "readwrite");
      let store = await tx.objectStore(CHAT_STORE_NAME);
      await store.put(chatObject);
      await tx.complete;
      console.log("added item to the store! " + JSON.stringify(chatObject));
    } catch (error) {
      console.log("error: I could not store the element. Reason: " + error);
    }
  }
}

export default new ChatDao(db);
