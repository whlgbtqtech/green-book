
// # calls for service

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var CallsForService = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  CallsForService.virtual('object').get(function() {
    return 'calls_for_service';
  });

  // plugins
  //CallsForService.plugin(jsonSelect, '-_group -salt -hash');
  CallsForService.plugin(mongoosePaginate);

  // keep last
  CallsForService.plugin(iglooMongoosePlugin);

  return mongoose.model('CallsForService', CallsForService);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
