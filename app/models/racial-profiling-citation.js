
// # racial profiling citation

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var RacialProfilingCitation = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  RacialProfilingCitation.virtual('object').get(function() {
    return 'racial_profiling_citation';
  });

  // plugins
  //RacialProfilingCitation.plugin(jsonSelect, '-_group -salt -hash');
  RacialProfilingCitation.plugin(mongoosePaginate);

  // keep last
  RacialProfilingCitation.plugin(iglooMongoosePlugin);

  return mongoose.model('RacialProfilingCitation', RacialProfilingCitation);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
