const cheerio = require('cheerio');
const format = require('../format.js');

function parseKontoauszug(html) {
  let $ = cheerio.load(html);
  let kontoauszug = $('#kontoauszug')[0];
  let tbody = kontoauszug.children[3];

  let array = [];

  tbody.children.filter(o => o.name === 'tr').forEach(row => {
    row.children = row.children.filter(o => o.name === 'td');

    let id = +row.children[0].children[0].data.replace('#', '');
    let date = row.children[1].children[0].data.replace(' um', ''); // TODO: date
    let konto = row.children[2].children[0].data;
    let betrag = row.children[3].children[0].children[0].data;
    let vermerk = row.children[4].children[0].data;

    array.push({
      id: id,
      date: date,
      konto: konto,
      betrag: betrag,
      vermerk: vermerk
    });
  });
  return array;
}

module.exports = parseKontoauszug;
