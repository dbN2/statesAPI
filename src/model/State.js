const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({

    stateCode: {
      type: String,
      required: true,
      unique: true
    },
    funfacts: {
      type: [String]
    },
    capital: {
      type: String
    },
    nickname: {
      type: String
    },
    population: {
      type: Number
    },
    admission: {
      type: String
    },
  });
  
  const State = mongoose.model('State', stateSchema);
  
  module.exports = State;
