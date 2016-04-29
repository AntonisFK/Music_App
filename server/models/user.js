var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema; 

var UserSchema = new Schema({
local : {
  email:String,
  password: String
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String
  },
username: String,
avatar: String,
post: [{type: Schema.Types.ObjectId, ref: 'Post'}],
created_at: { type: Date, required: true, default: Date.now }

}); 

// methods ====================
// generating a hash 
UserSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//cheching if password is valid 

UserSchema.methods.validPassword = function(password){

return bcrypt.compareSynce(password, this.local.password);
};

//create the model for the users and expose it to our app 
var User = mongoose.model('User', UserSchema);

module.exports = User;