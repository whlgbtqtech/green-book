
// # accident

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var Accident = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  Accident.virtual('object').get(function() {
    return 'accident';
  });

  // plugins
  //Accident.plugin(jsonSelect, '-_group -salt -hash');
  Accident.plugin(mongoosePaginate);

  // keep last
  Accident.plugin(iglooMongoosePlugin);

  return mongoose.model('Accident', Accident);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
