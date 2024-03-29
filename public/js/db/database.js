/**
 * @desc Inits the IndexedDB database.
 * @format
 */

import * as idb from "/js/extra/idb/build/index.js";

const DB_NAME = "db_mission";

export const CHAT_STORE_NAME = "chatdb";
export const KLG_STORE_NAME = "klgdb";
export const ANNOTATION_STORE_NAME = "annotationdb";
export const STORY_STORE_NAME = "storydb";
export let db;

/**
 * it inits the database
 */
export async function initDatabase() {
  if (!db) {
    db = await idb.openDB(DB_NAME, 2, {
      upgrade(upgradeDb, oldVersion, newVersion) {
        //Create the chat store
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

        //Create the KLG store
        if (!upgradeDb.objectStoreNames.contains(KLG_STORE_NAME)) {
          let KLGDataBase = upgradeDb.createObjectStore(KLG_STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          KLGDataBase.createIndex("roomId", "roomId", {
            unique: false,
            multiEntry: false,
          });
          KLGDataBase.createIndex("color", "color", {
            unique: false,
            multiEntry: false,
          });
          KLGDataBase.createIndex("name", "name", {
            unique: false,
            multiEntry: false,
          });
          KLGDataBase.createIndex("row", "row", {
            unique: false,
            multiEntry: true,
          });
        }

        //Create the annotation store.
        if (!upgradeDb.objectStoreNames.contains(ANNOTATION_STORE_NAME)) {
          let annotationDataBase = upgradeDb.createObjectStore(
            ANNOTATION_STORE_NAME,
            {
              keyPath: "id",
              autoIncrement: true,
            },
          );
          annotationDataBase.createIndex("roomId", "roomId", {
            unique: false,
            multiEntry: false,
          });
          annotationDataBase.createIndex("annotation", "annotation", {
            unique: false,
            multiEntry: true,
          });
        }

        //Create the story store
        if (!upgradeDb.objectStoreNames.contains(STORY_STORE_NAME)) {
          let storyDataBase = upgradeDb.createObjectStore(STORY_STORE_NAME, {
            keyPath: "id",
          });
          storyDataBase.createIndex("author", "author", {
            unique: false,
            multiEntry: false,
          });
          storyDataBase.createIndex("description", "description", {
            unique: false,
            multiEntry: false,
          });
          storyDataBase.createIndex("image", "image", {
            unique: false,
            multiEntry: false,
          });
          storyDataBase.createIndex("rooms", "rooms", {
            unique: false,
            multiEntry: false,
          });
          storyDataBase.createIndex("title", "title", {
            unique: false,
            multiEntry: false,
          });
          storyDataBase.createIndex("offline", "offline", {
            unique: false,
            multiEntry: false,
          });
        }
      },
    });
  }
}
