const agspiel = require('agspiel');
const retrieve = agspiel.retrieve;

retrieve.agliste().then(list => {
  console.log(list);
}).catch(console.log);

/** Gesamtes Depot auslesen
 * retrieve.ownDepot().then(
 *                        msg => console.log(msg));
 * /