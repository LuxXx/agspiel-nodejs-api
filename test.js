const agspiel = require('agspiel');
const retrieve = agspiel.retrieve;

retrieve.agliste().then(list => {
  console.log(list);
}).catch(console.log);
