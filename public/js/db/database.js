/** @format */

import * as idb from "/js/extra/idb/build/index.js";

const DB_NAME = "db_mission";

export const CHAT_STORE_NAME = "chatdb";
export const KLG_STORE_NAME = "klgdb";
export let db;

/**
 * it inits the database
 * store chat history
 */
export async function initDatabase() {
  if (!db) {
    db = await idb.openDB(DB_NAME, 2, {
      upgrade(upgradeDb, oldVersion, newVersion) {
        if (!upgradeDb.objectStoreNames.contains(CHAT_STORE_NAME)) {
          let chatDataBase = upgradeDb.createObjectStore(CHAT_STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          chatDataBase.createIndex("roomId", "roomId", {
            unique: false,
            multiEntry: false,
          });
          chatDataBase.createIndex("chat", "chat", {
            unique: false,
            multiEntry: true,
          });
          chatDataBase.createIndex("username", "username", {
            unique: false,
            multiEntry: true,
          });
        }

        if (!upgradeDb.objectStoreNames.contains(KLG_STORE_NAME)) {
          let KLGDataBase = upgradeDb.createObjectStore(KLG_STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          KLGDataBase.createIndex("roomId", "roomId", {
            unique: false,
            multiEntry: false,
          });
          KLGDataBase.createIndex("row", "row", {
            unique: false,
            multiEntry: true,
          });
        }
      },
    });
  }
  console.log("db is created");
}