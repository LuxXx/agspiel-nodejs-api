const format = require('../format.js');

function live(data) {
  // TODO: transform to numerical values
  // TODO: do the rest

  data = JSON.parse(data);

  data.orders.forEach(o => {
    o.action = o.action.match(/>(.*)</)[1];
    o.diff = o.diff.match(/>(.*)</)[1];
    o.date = o.date.substring(0, o.date.length - 4);
    o.stueckzahl = o.stueckzahl.substring(0, o.stueckzahl.length - 5);
    o.limit = o.limit.replace('&euro;', '');
    o.kurs = o.kurs.replace('&euro;', '');
    o.volumen = o.kurs.replace('&euro;', '');
  });

  return data;
}

module.exports = live;
