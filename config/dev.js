/**
 * @format
 * @author lomofu
 * @desc
 * @create 19/Mar/2022 16:00
 */
const dev = {
  mongodb_config: {
    connect: "mongodb://mission.lomofu.com:27017/mission",
    auth: {
      authSource: "admin",
      user: "mission@dev",
      pass: "mission.dev",
    },
  },
};

module.exports = dev;
