
// # assaults on officer

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var AssaultsOnOfficer = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  AssaultsOnOfficer.virtual('object').get(function() {
    return 'assaults_on_officer';
  });

  // plugins
  //AssaultsOnOfficer.plugin(jsonSelect, '-_group -salt -hash');
  AssaultsOnOfficer.plugin(mongoosePaginate);

  // keep last
  AssaultsOnOfficer.plugin(iglooMongoosePlugin);

  return mongoose.model('AssaultsOnOfficer', AssaultsOnOfficer);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
