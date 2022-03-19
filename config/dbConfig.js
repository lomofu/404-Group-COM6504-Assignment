/**
 * @format
 * @author lomofu
 * @desc
 * @create 19/Mar/2022 16:03
 */
const mongoose = require("mongoose");
const config = require(`./${process.env.NODE_ENV}`);

mongoose.Promise = global.Promise;

mongoose
  .connect(config.mongodb_config.connect, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log(
        `Connected successfully! Connect DB: ${config.mongodb_config.connect}`,
      );
    },
    (err) => console.error("error!" + err),
  );

module.exports = mongoose;
