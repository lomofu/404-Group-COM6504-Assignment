/** @format */


import * as idb from 'https://cdn.jsdelivr.net/npm/idb@7/+esm';

let db;
const DB_NAME = 'db_mission';
const CHAT_STORE_NAME = 'chatdb';

/**
 * it inits the database
 * store chat history
 */
async function initDatabase() {
    if (!db) {
        db = await idb.openDB(DB_NAME, 2, {
            upgrade(upgradeDb, oldVersion, newVersion) {
                if (!upgradeDb.objectStoreNames.contains(CHAT_STORE_NAME)) {
                    let chatDataBase = upgradeDb.createObjectStore(CHAT_STORE_NAME,
                        {keyPath: 'id', autoIncrement: true});
                    chatDataBase.createIndex('roomId','roomId',{unique:false,multiEntry:false});
                    chatDataBase.createIndex('chat','chat',{unique:false,multiEntry:true});
                    chatDataBase.createIndex('username','username',{unique:false,multiEntry:true});
                }
            }
        });

    }
    console.log('db is created');
}

async function storeChatData(chatObject) {
    console.log("inserting: " + JSON.stringify(chatObject));
    if (!db) await initDatabase();
    if (db) {
        try {
            let tx = await db.transaction(CHAT_STORE_NAME, "readwrite");
            let store = await tx.objectStore(CHAT_STORE_NAME);
            await store.put(chatObject);
            await tx.complete;
            console.log("added item to the store! " + JSON.stringify(chatObject));
        } catch (error) {
            console.log("error: I could not store the element. Reason: " + error);
        }
    } else localStorage.setItem(chatObject.sum, JSON.stringify(chatObject));
}


async function getChatData(roomId) {
    if (!db) await initDatabase();
    if (db) {
        try {
            console.log("fetching: " + roomId);
            let tx = await db.transaction(CHAT_STORE_NAME, "readonly");
            let store = await tx.objectStore(CHAT_STORE_NAME);
            let index = await store.index("roomId");
            let readingsList = await index.getAll(IDBKeyRange.only(roomId));
            await tx.complete;
            return readingsList;
            // let max;
            // for (let elem of readingsList){
            //     console.log(elem)
            // }
        } catch (e) {
            console.log(e);
        }


    }
}


window.missionIndexDB = {
    storeChatData,
    getChatData
};