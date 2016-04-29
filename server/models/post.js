var mongoose = require('mongoose')

var Schema = mongoose.Schema; 



var PostSchema =  new Schema({
_user: {type: Schema.Types.ObjectId, ref:'User'},
url: String,
name: String, 
artist: String, 
album: String, 
vote: String,
created_at: { type: Date, required: true, default: Date.now }

})

var Post = mongoose.model('Post', PostSchema);

module.exports = Post; 