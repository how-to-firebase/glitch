const functions = require('firebase-functions');
const stats = require('./stats');

exports.stats = functions.database
  .ref('/authenticated/react-chat/{room}/{key}')
  .onCreate(stats);