const retrieve = require('./lib/retrieve.js');

retrieve.profile('LuxXx').then(profile => {
  console.log(profile)
})
