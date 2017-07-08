const https = require('https');
const auth = require('./auth.js')

let PHPSESSID = auth.PHPSESSID;
let agspiel = auth.agspiel;

function raw(path, method) {
  return new Promise(resolve => {
    let data = '';

    const options = {
      hostname: 'www.ag-spiel.de',
      port: 443,
      path: '/' + path,
      method: (method !== undefined ? method.toUpperCase() : 'GET'),
      headers: {
        'Cookie': 'PHPSESSID=' + PHPSESSID + ';ag-spiel=' + agspiel
      }
    };

    const req = https.request(options, (res) => {
      res.on('data', (d) => {
        //process.stdout.write(d);
        data += d;
      });
      res.on('end', () => {
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

function agliste() {
  return section('agliste');
}

module.exports = {
  raw: raw,
  section: section,
  wkn: wkn,
  name: name,
  agliste: agliste
};
