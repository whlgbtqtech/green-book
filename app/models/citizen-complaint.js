
// # citizen complaint

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var CitizenComplaint = new mongoose.Schema({
      ComplaintType:  {
          type: String
      },
      CCACaseNumber: {
          type: String
      },
      DateReceived: {
          type: Date
      },
      HowReceived: {
          type: String
      },
      District: {
          type: String
      },
      Neighborhood: {
          type: String
      },
      allegation-code: {
          type: String
      },
      description: {
          type: String
      },
      disposition-code: {
          type: String
      },
      respondent-id: {
          type: String
      },
      OfficerSex: {
          type: String
      },
      OfficerRace: {
          type: String
      },
      ComplainantSex: {
          type: String
      },
      ComplainantRace: {
          type: String
      },
      HowClosed:{
          type: String
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
