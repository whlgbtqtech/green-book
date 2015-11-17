
// # racial profiling arrest

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var RacialProfilingArrest = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  RacialProfilingArrest.virtual('object').get(function() {
    return 'racial_profiling_arrest';
  });

  // plugins
  //RacialProfilingArrest.plugin(jsonSelect, '-_group -salt -hash');
  RacialProfilingArrest.plugin(mongoosePaginate);

  // keep last
  RacialProfilingArrest.plugin(iglooMongoosePlugin);

  return mongoose.model('RacialProfilingArrest', RacialProfilingArrest);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
