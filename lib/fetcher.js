const https = require('https');
const auth = require('./auth.js');
const querystring = require('querystring');

function raw(path, method, sendData) {
  return new Promise((resolve, reject) => {
    let data = '';

    let postData = querystring.stringify(sendData);

    let headers = method === 'GET' ? {
      'Cookie': 'PHPSESSID=' + auth.PHPSESSID + ';ag-spiel=' + auth.agspiel
    } : {
      'Cookie': 'PHPSESSID=' + auth.PHPSESSID + ';ag-spiel=' + auth.agspiel,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }

    const options = {
      hostname: 'www.ag-spiel.de',
      port: 443,
      path: '/' + path,
      method: (method !== undefined ? method.toUpperCase() : 'GET'),
      headers: headers
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
    if (method === 'POST') req.write(postData);

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
function orderbuch(wkn) {
  return section('orders&wkn=' + wkn);
}

function trades(wkn) {
  return raw('index.php?section=trades&aktie=' + wkn, 'POST', {
    zeitraum: '30'
  });
}
function bilanzen(wkn) {
  return section('bilanzen&wkn=' + wkn);
}
function index(indexId) {
  return section('showgroup&id=' + indexId);
}
function agsx() {
  return section('agsx2');
}
function orders() {
  return section('agorderbuch');
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
  orderbuch: orderbuch,
  trades: trades,
  bilanzen: bilanzen,
  index: index,
  agsx: agsx,
  orders: orders,
};
