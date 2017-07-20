const https = require('https');
const auth = require('./auth.js');

function raw(path, method) {
  return new Promise((resolve, reject) => {
    let data = '';
    const options = {
      hostname: 'www.ag-spiel.de',
      port: 443,
      path: '/' + path,
      method: (method !== undefined ? method.toUpperCase() : 'GET'),
      headers: {
        'Cookie': 'PHPSESSID=' + auth.PHPSESSID + ';ag-spiel=' + auth.agspiel
      }
    };

    const req = https.request(options, (res) => {
      res.setEncoding('binary');
      res.on('data', (d) => {
        data += d;
      });
      res.on('end', () => {
        if (data.includes('Sie müssen sich registrieren'))
          reject('Not logged in')
        resolve(data);
      });
    });
    req.on('error', (e) => {
      console.error(e);
    });
    req.end();
  });
}

function section(section) {
  return raw('index.php?section=' + section);
}
function wkn(wkn) {
  return section('profil&aktie=' + wkn);
}
function name(name) {
  return section('profil&spieler=' + name);
}
function userid(userid) {
  return section('profil&userid=' + userid);
}
function agliste() {
  return section('agliste');
}
function live(order_start, orderlog_start) {
  return raw('ajax_live2.php?order_start=' + order_start + '&orderlog_start' + orderlog_start);
}
function indizes() {
  return section('highscore_indizes');
}
function chronik(wkn) {
  return section('chronik&wkn=' + wkn);
}
function depot(wkn) {
  return section('depot_log&aktie=' + wkn);
}
function agstruktur(wkn) {
  return section('agstruktur&WKN=' + wkn);
}
function kontoauszug(wkn) {
  return section('konto&aktie=' + wkn);
}

function kaeufer(wkn) {
  return section('kaeufer&aktie=' + wkn);
}

module.exports = {
  raw: raw,
  section: section,
  wkn: wkn,
  name: name,
  userid: userid,
  agliste: agliste,
  live: live,
  indizes: indizes,
  chronik: chronik,
  depot: depot,
  agstruktur: agstruktur,
  kontoauszug: kontoauszug,
  kaeufer: kaeufer,
};
