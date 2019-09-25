require('custom-env').env('dev')
const mongoose = require('mongoose');

mongoose.connect('mongodb://' + process.env.MONGO_DB + '/weather', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
    if (err) throw err;
    console.log('Connection established...');
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        names.forEach((model) => {
            mongoose.connection.db.dropCollection(model, function(err, result) {
                console.log(model.name + ' deleted');
            });
        });
        mongoose.disconnect();
    });
});