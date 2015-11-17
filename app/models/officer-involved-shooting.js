
// # officer involved shooting

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var OfficerInvolvedShooting = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  OfficerInvolvedShooting.virtual('object').get(function() {
    return 'officer_involved_shooting';
  });

  // plugins
  //OfficerInvolvedShooting.plugin(jsonSelect, '-_group -salt -hash');
  OfficerInvolvedShooting.plugin(mongoosePaginate);

  // keep last
  OfficerInvolvedShooting.plugin(iglooMongoosePlugin);

  return mongoose.model('OfficerInvolvedShooting', OfficerInvolvedShooting);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
