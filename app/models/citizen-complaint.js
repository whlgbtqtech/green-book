
// # citizen complaint

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var CitizenComplaint = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  CitizenComplaint.virtual('object').get(function() {
    return 'citizen_complaint';
  });

  // plugins
  //CitizenComplaint.plugin(jsonSelect, '-_group -salt -hash');
  CitizenComplaint.plugin(mongoosePaginate);

  // keep last
  CitizenComplaint.plugin(iglooMongoosePlugin);

  return mongoose.model('CitizenComplaint', CitizenComplaint);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
