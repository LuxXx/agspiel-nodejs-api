const cheerio = require('cheerio');
const format = require('../format.js');

function parseKaeufer(html) {
  let $ = cheerio.load(html);

  let kaeufe = [];

  let kaeufer = $('#kaeufer')[0];
  let tbody = kaeufer.children[3];
  let rows = tbody.children.filter(t => t.name === 'tr');
  rows.forEach(e => {
    let id = +e.children[1].children[0].data.replace('#', '');
    let date = format.longdate(e.children[3].children[0].data.replace(' um', ''));
    let type = e.children[5].children[0].children[0].data;
    let stk = e.children[7].children[0].data.replace(' Stk.', '');
    let price = format.from(e.children[9].children[0].data);
    let value = format.from(e.children[11].children[0].data);
    let a = e.children[13].children[0];
    let wkn = a.type === 'text' ? 0 : +a.attribs.href.substring(31);
    let name = a.type === 'text' ? a.data : a.children[0].data

    kaeufe.push({
      id: id,
      wkn: wkn,
      name: name,
      date: date,
      type: type,
      anzahl: +stk,
      price: price,
      value: value,
    });
  });

  return kaeufe;
}

module.exports = parseKaeufer;
