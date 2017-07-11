const fetcher = require('./fetcher.js');
const parser = require('./parser.js');


function profile(key) {
  if (typeof key === 'string') {
    return fetcher.name(key).then(parser.profile)
  }
  return fetcher.wkn(key).then(parser.profile)
}

function profileByUserID(id) {
  return fetcher.userid(id).then(parser.profile)
}

function agliste() {
  return fetcher.agliste().then(parser.agliste)
}

function indizes() {
  return fetcher.indizes().then(parser.indizes)
}

function chronik(wkn) {
  return fetcher.chronik(wkn).then(parser.chronik)
}

module.exports = {
  profile: profile,
  profileByUserID: profileByUserID,
  agliste: agliste,
  indizes: indizes,
  //TODO:
  depot: null,
  aktionäre: null,
  chronik: chronik, // Kapitalmaßnahmen
};
