const fetcher = require('./fetcher.js');
const parser = require('./parser.js');


function profile(key) {
  if (typeof key === 'string') {
    return fetcher.name(key).then(parser.profile)
  }
  return fetcher.wkn(key).then(parser.profile)
}

function agliste() {
  return fetcher.agliste().then(parser.agliste)
}

module.exports = {
  profile: profile,
  agliste: agliste,
  //TODO:
  depot: null,
  aktionäre: null,
  chronik: null, // Kapitalmaßnahmen
};
