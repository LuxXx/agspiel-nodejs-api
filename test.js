const agspiel = require('./lib/main.js');
const retrieve = agspiel.retrieve;

retrieve.agliste().then(profile => {
  console.log(profile);
}).catch(console.log);
