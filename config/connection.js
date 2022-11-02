const mongoClient = require("mongodb").MongoClient;
const state = {
  db: null,
};
module.exports = {
  connect: (done) => {
    mongoClient.connect(process.env.dbURI, (err, data) => {
      if (err) return done(err);
      state.db = data.db(process.env.dbName);
      done();
    });
  },

  get: () => {
    return state.db;
  },
};
