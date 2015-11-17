
// # arrest

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var Arrest = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  Arrest.virtual('object').get(function() {
    return 'arrest';
  });

  // plugins
  //Arrest.plugin(jsonSelect, '-_group -salt -hash');
  Arrest.plugin(mongoosePaginate);

  // keep last
  Arrest.plugin(iglooMongoosePlugin);

  return mongoose.model('Arrest', Arrest);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
