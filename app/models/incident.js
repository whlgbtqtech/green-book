
// # incident

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var Incident = new mongoose.Schema({
    ucr: {
      type: String,
  },
  crime: {
     type: String
  },
  date: {
      type: Date
  },
  time: {
      type: Date
  },
  case: {
     type: String
  },
  address:{
      type: String
  },
  beat: {
      type: String
  },
  x_coord: {
      type: Number
  },
  y_coord: {
      type: Number
  }
  });

  // virtuals
  Incident.virtual('object').get(function() {
    return 'incident';
  });

  // plugins
  //Incident.plugin(jsonSelect, '-_group -salt -hash');
  Incident.plugin(mongoosePaginate);

  // keep last
  Incident.plugin(iglooMongoosePlugin);

  return mongoose.model('Incident', Incident);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
