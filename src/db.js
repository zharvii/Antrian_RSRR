const MongoClient = require("mongodb").MongoClient;

const init = () => {
  MongoClient.connect(
    process.env.DB_URL,
    { useUnifiedTopology: true },
    (err, client) => {
      if (err) console.error(err);
      console.log("Connected successfully to database");
      mongodb = client.db(process.env.DB_NAME);
    }
  );
};

const collection = (c) => {
  return mongodb.collection(c);
};

module.exports = {
  init: init,
  collection: collection,
};
