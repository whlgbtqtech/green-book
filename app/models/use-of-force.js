
// # use of force

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var UseOfForce = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  UseOfForce.virtual('object').get(function() {
    return 'use_of_force';
  });

  // plugins
  //UseOfForce.plugin(jsonSelect, '-_group -salt -hash');
  UseOfForce.plugin(mongoosePaginate);

  // keep last
  UseOfForce.plugin(iglooMongoosePlugin);

  return mongoose.model('UseOfForce', UseOfForce);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
