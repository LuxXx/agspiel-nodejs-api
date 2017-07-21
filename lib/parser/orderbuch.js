const cheerio = require('cheerio');
const format = require('../format.js');

function parseOrderbuch(html) {
  let $ = cheerio.load(html);
  let orderbuch = $('#orderbuch')[0];
  let tbody = orderbuch.children[3];
  let rows = tbody.children.filter(o => o.type === 'tag');

  let orders = [];

  rows.forEach(r => {
    let stk = +r.children[1].children[0].data;
    let type = r.children[3].children[0].children[0].data;
    let limit = format.from(r.children[5].children[0].data);
    let volumen = format.from(r.children[7].children[0].data);
    let date = format.longdate(r.children[9].children[0].data.replace(' um', ''));
    orders.push({
      anzahl: stk,
      type: type,
      limit: limit,
      volumen: volumen,
      date: date
    });
  });

  return orders;
}

module.exports = parseOrderbuch;
