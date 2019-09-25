require('custom-env').env('dev')
const mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.MONGO_DB + '/weather', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log('Connection established...');
    mongoose.connection.db.dropDatabase().then(() => {
        console.log('Database deleted!');
        mongoose.disconnect();
    });
});