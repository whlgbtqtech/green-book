
// # employee characteristic

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var EmployeeCharacteristic = new mongoose.Schema({
    name: {
      type: String,
      required: true
    }
  });

  // virtuals
  EmployeeCharacteristic.virtual('object').get(function() {
    return 'employee_characteristic';
  });

  // plugins
  //EmployeeCharacteristic.plugin(jsonSelect, '-_group -salt -hash');
  EmployeeCharacteristic.plugin(mongoosePaginate);

  // keep last
  EmployeeCharacteristic.plugin(iglooMongoosePlugin);

  return mongoose.model('EmployeeCharacteristic', EmployeeCharacteristic);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
