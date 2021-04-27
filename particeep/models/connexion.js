var mongoose = require("mongoose");

var options = {
  connectTimeoutMS: 5000,
  useUnifiedTopology: true,
  useNewUrlParser: true,
};

mongoose.connect(
    'mongodb+srv://admin:azerty@cluster0.arufm.mongodb.net/particeep?retryWrites=true&w=majority',

  options,
  function (err) {
    console.log(err);
  }
);

module.exports = mongoose;