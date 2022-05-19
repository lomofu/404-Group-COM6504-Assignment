/**
 * @desc Different methods for room in IndexedDB.
 * @format */

import { db, ANNOTATION_STORE_NAME } from "/js/db/database.js";

class annotationDao{
    constructor(db) {
        this.db = db;
    }

    /**
     * Get Annotation Data in IndexedDB.
     * @param roomId
     * @returns {Promise<*>}
     */
    async getAnnotationData(roomId) {
        try {
            let tx = await db.transaction(ANNOTATION_STORE_NAME, "readonly");
            let store = await tx.objectStore(ANNOTATION_STORE_NAME);
            let index = await store.index("roomId");
            let readingsList = await index.getAll(IDBKeyRange.only(roomId));
            await tx.complete;
            return readingsList;
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Store annotation data in IndexedDB.
     * @param annotationObject
     * @returns {Promise<void>}
     */
    async storeAnnotationData(annotationObject) {
        try {
            let tx = await db.transaction(ANNOTATION_STORE_NAME, "readwrite");
            let store = await tx.objectStore(ANNOTATION_STORE_NAME);
            await store.put(annotationObject);
            await tx.complete;
        } catch (error) {
            console.log("error: I could not store the element. Reason: " + error);
        }
    }

    /**
     * Delete annotation data in IndexedDB.
     * @param roomId
     * @returns {Promise<void>}
     */
    async deleteAnnotationData(roomId) {
        try {
            console.log("Deleting" + roomId);
            let tx = await db.transaction(ANNOTATION_STORE_NAME, "readwrite");
            let store = await tx.objectStore(ANNOTATION_STORE_NAME);
            let index = await store.index("annotation");
            let remove = index.openCursor(roomId);
            remove.then(async cursor => {
                while (cursor) {
                    cursor.delete();
                    cursor = await cursor.continue();
                }
            })
            await tx.complete;
        } catch (error) {
            console.log("error: I could not delete the element. Reason: " + error);
        }
    }

}

export default new annotationDao(db);