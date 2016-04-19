var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Photo = new Schema({
    username: {
    	type: String,
   	},
    images:   {
        type: [String]
    },
    image:   {
        type: String
    },
    date: {
        type:Date,
        default: Date.now()
    }
});


module.exports = mongoose.model('Photo', Photo);