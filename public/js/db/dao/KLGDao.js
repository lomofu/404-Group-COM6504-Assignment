import { db, KLG_STORE_NAME } from "/js/db/database.js";

class KLGDao {
    constructor(db) {
        this.db = db;
    }

    async getKLGData(roomId) {
        try {
            let tx = await db.transaction(KLG_STORE_NAME, "readonly");
            let store = await tx.objectStore(KLG_STORE_NAME);
            let index = await store.index("roomId");
            let readingsList = await index.getAll(IDBKeyRange.only(roomId));
            await tx.complete;
            return readingsList;
        } catch (e) {
            console.log(e);
        }
    }

    async storeKLGData(KLGObject) {
        try {
            let tx = await db.transaction(KLG_STORE_NAME, "readwrite");
            let store = await tx.objectStore(KLG_STORE_NAME);
            await store.put(KLGObject);
            await tx.complete;
        } catch (error) {
            console.log("error: I could not store the element. Reason: " + error);
        }
    }
}

export default new KLGDao(db);