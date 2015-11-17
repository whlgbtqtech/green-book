
// # body cam meta

var jsonSelect = require('mongoose-json-select');
var mongoosePaginate = require('mongoose-paginate');

exports = module.exports = function(mongoose, iglooMongoosePlugin) {

  var BodyCamMeta = new mongoose.Schema({
    evidence_id: {
      type: String,
      required: true
  },
  id_exteral: {
      type: String,
      reuired: false
  },
  created_date_record_start: {
      type: Date,
      required: false
  },
  date_record_end: {
      type: Date,
      required: false
  },
  flag: {
      type: Boolean,
      required: false
  },
  content_type: {
      type: String
  },
  size_mb: {
      type: Number
  },
  duration_seconds: {
      type: Number
  },
  owner_first_name: {
      type: String
  },
  owner_last_name: {
      type: String
  },
  owner_badge_id: {
      type: Number
  },
  categories: {
      type: String
  },
  evidence_tags: {
      type: String
  }
  });

  // virtuals
  BodyCamMeta.virtual('object').get(function() {
    return 'body_cam_meta';
  });

  // plugins
  //BodyCamMeta.plugin(jsonSelect, '-_group -salt -hash');
  BodyCamMeta.plugin(mongoosePaginate);

  // keep last
  BodyCamMeta.plugin(iglooMongoosePlugin);

  return mongoose.model('BodyCamMeta', BodyCamMeta);
};

exports['@singleton'] = true;
exports['@require'] = [ 'igloo/mongo', 'igloo/mongoose-plugin' ];
