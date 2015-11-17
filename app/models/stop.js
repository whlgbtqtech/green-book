
// # stop

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var Stop = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  Stop.virtual('object').get(function() {
    return 'stop';
  });

  // plugins
  //Stop.plugin(jsonSelect, '-_group -salt -hash');
  Stop.plugin(mongoosePaginate);

  // keep last
  Stop.plugin(iglooMongoosePlugin);

  return mongoose.model('Stop', Stop);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
