
// # hate crime

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var HateCrime = new mongoose.Schema({
     id: {},
     incidentNumber: {
         type: Number
     },
     dateReported: {
         type: Date
     },
     dateOccurred: {
         type: Date
     },
     crimeType: {
         type: String
     },
     biasMotivationGroup: {
         type: String
     },
     biasTargetedAgainst: {
         type: String
     },
     UORDesc: {
         type: String
     },
     NIBRSCode: {
         type: String
     },
     UCRHierarchy: {
         type: String
     },
     ATT_Comp: {
         type: String
     },
     division: {
         type: String
     },
     beat: {
         type: String
     },
     premiseType: {
         type: String
     },
     blockAddress: {
         type: String
     },
     city: {
         type: String
     },
     zipCode: {
         type: Number
     }

  });

  // virtuals
  HateCrime.virtual('object').get(function() {
    return 'hate_crime';
  });

  // plugins
  //HateCrime.plugin(jsonSelect, '-_group -salt -hash');
  HateCrime.plugin(mongoosePaginate);

  // keep last
  HateCrime.plugin(iglooMongoosePlugin);

  return mongoose.model('HateCrime', HateCrime);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
