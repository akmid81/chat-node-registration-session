const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
   name: {
      type:String,
      required:true,
      unique:true
   },
   hspass: {
      type:String,
      required:true,
      minlength: 3
   }
}, {versionKey:false})

const User = mongoose.model('User', userSchema)

module.exports = User