/**
 * @format
 */

import chatDao from "/js/db/dao/chatDao.js";
import KLGDao from "/js/db/dao/KLGDao.js";
import annotationDao from "/js/db/dao/annotationDao.js";
import storyDao from "/js/db/dao/storyDao.js";
import roomDao from "/js/db/dao/roomDao.js";
import { initDatabase, db } from "/js/db/database.js";

export const useDao = async () => {
  if (!db) await initDatabase();
  return {
    chatDao,
    KLGDao,
    annotationDao,
    storyDao,
    roomDao,
  };
};
