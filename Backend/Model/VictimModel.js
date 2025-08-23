const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const victimSchema = new Schema({
    name: {
        type: String, //dataType: String
        required: true //Validation: required
    },

    age: {
        type: Number, //dataType: Number
        required: true //Validation: required
    },

    email: {
        type: String, //dataType: String
        required: true //Validation: required
    },

    phone: {
        type: Number, //dataType: String
        required: true //Validation: required
    },

    address: {
        type: String, //dataType: String
        required: true //Validation: required
    },

    description: {
        type: String, //dataType: String
        required: true //Validation: required
    },

    image: {
        type: String, //dataType: String
        required: true //Validation: required
    },

    status: {
        type: String, //dataType: String
        required: true //Validation: required
    },

    date: {
        type: Date, //dataType: Date
        default: Date.now //Default value
    }

});

//Exporting the model
module.exports = mongoose.model(
    "VictimModel", //Model name
    victimSchema  //Schema
)