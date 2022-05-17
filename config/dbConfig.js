/**
 * @format
 * @author lomofu
 * @desc
 * @create 19/Mar/2022 16:03
 */
const mongoose = require("mongoose");
const { mongodb_config } = require(`./${process.env.NODE_ENV}`);

mongoose.Promise = global.Promise;

mongoose
  .connect(mongodb_config.connect, {
    ...mongodb_config?.auth,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(
    () => {
      console.log(
        `💻 Connected to DB: ${mongodb_config.connect} successfully!`,
      );
    },
    (err) => console.error("❌ error!" + err),
  );

module.exports = mongoose;
