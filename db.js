const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/Storage', {
    useNewUrlParser: true,
    useUnifiedTopology:true
 
},()=>{
    console.log("db connected");
})


// MODEL CREATION
const User = mongoose.model("User", {
    acno: Number,
    uname: String,
    password: String,
    balance: Number,
    transaction: []
})

module.exports = {
    User
}