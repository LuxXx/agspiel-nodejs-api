const agspiel = require('./lib/main.js');
const retrieve = agspiel.retrieve;


retrieve.profile('LuxXx').then(profile => {
  console.log(profile)
})
