const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
// it adds username, password field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);



