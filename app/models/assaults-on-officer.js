
// # assaults on officer

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var AssaultsOnOfficer = new mongoose.Schema({
      CRNumber: {
          type: String
      },
      DispatchDateTime: {
          type: String
      },
      Class: {
          type: String
      },
      ClassDescription: {
          type: String
      },
      PoliceDistrictNumber: {
          type: Number
      },
      PoliceDistrictName: {
          type: String
      },
      BlockAddress: {
          type: String
      },
      City: {
          type: String
      },
      State: {
          type: String
      },
      ZipCode: {
          type: String
      },
      Agency: {
          type: String
      },
      Place: {
          type: String
      },
      Sector: {
          type: String
      },
      Beat: {
          type: String
      },
      PRA: {
          type: String
      },
      StartDateTime: {
          type: Date
      },
      EndDateTime: {
          type: Date
      },
      Latitude: {
          type: String
      },
      Longitude: {
        type: String
      },
      Location: {
        type: String
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
