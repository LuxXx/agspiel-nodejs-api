const retrieve = require('./lib/retrieve.js');

retrieve.profile('LuxXx').then(profile => {
  console.log(profile)
})

//retrieve.agliste().then(liste => {
//  console.log(liste)
//})
