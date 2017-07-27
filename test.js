const agspiel = require('agspiel');
const retrieve = agspiel.retrieve;

retrieve.agliste().then(profile => {
  console.log(profile);
}).catch(console.log);
