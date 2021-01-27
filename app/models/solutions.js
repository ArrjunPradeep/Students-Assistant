var mongoose = require('mongoose')

const schema = new mongoose.Schema({
    question:String,
    answer:String
})

module.exports = mongoose.model('solutions', schema)