const fetcher = require('./fetcher.js');
const parser = require('./parser.js');


function profile(key) {
  if (typeof key === 'number') {
    return fetcher.wkn(key).then(parser.profile);
}
  if (/^\d+$/.exec(key))
    return fetcher.wkn(key).then(parser.profile);
  return fetcher.name(key).then(parser.profile);
}

function profileByUserID(id) {
  return fetcher.userid(id).then(parser.profile);
}

function agliste() {
  return fetcher.agliste().then(parser.agliste);
}

function indizes() {
  return fetcher.indizes().then(parser.indizes);
}

function chronik(wkn) {
  return fetcher.chronik(wkn).then(parser.chronik);
}

function depot(wkn) {
  return fetcher.depot(wkn).then(parser.depot);
}

function aktionaere(wkn) {
  return fetcher.agstruktur(wkn).then(parser.aktionaere);
}

function kontoauszug(wkn) {
  return fetcher.kontoauszug(wkn).then(parser.kontoauszug);
}

function kaeufer(wkn) {
  return fetcher.kaeufer(wkn).then(parser.kaeufer);
}

function orderbuch(wkn) {
  return fetcher.orderbuch(wkn).then(parser.orderbuch);
}

module.exports = {
  profil: profile,
  profile: profile,
  profileByUserID: profileByUserID,
  agliste: agliste,
  indizes: indizes,
  depot: depot,
  chronik: chronik,
  aktionaere: aktionaere,
  kontoauszug: kontoauszug,
  kaeufer: kaeufer,
  orderbuch: orderbuch,
};
