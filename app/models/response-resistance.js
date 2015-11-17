
// # response resistance

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var ResponseResistance = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  ResponseResistance.virtual('object').get(function() {
    return 'response_resistance';
  });

  // plugins
  //ResponseResistance.plugin(jsonSelect, '-_group -salt -hash');
  ResponseResistance.plugin(mongoosePaginate);

  // keep last
  ResponseResistance.plugin(iglooMongoosePlugin);

  return mongoose.model('ResponseResistance', ResponseResistance);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
