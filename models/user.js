const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  name: String,
});

userSchema.methods.encryptPassword = (password) => {
  return bcrypt.hashSync(password, 10)
};

userSchema.methods.comparePassword = (password,password2) =>{
  //console.log("pass: " + password +", this.pass: "+password2);
  return bcrypt.compareSync(password, password2);
};

module.exports = mongoose.model('Users', userSchema);
