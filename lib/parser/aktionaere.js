const cheerio = require('cheerio');

function parseAktionaere(html) {
  let $ = cheerio.load(html);
  let aktionaere = [];

  let table = $('table[class=normalborder]')[0];
  let tbody = table.children[0];
  tbody.children = tbody.children.filter(row => row.type === 'tag');
  tbody.children.pop();
  tbody.children.shift();

  tbody.children.forEach(row => {
    let wkn;
    let name;
    if (row.children[0].children[1] === undefined) {
      wkn = 0;
      name = 'Systembank';
    } else {
      wkn = row.children[0].children[1].attribs.href.substring(31); // aktionaer wkn
      name = row.children[0].children[1].children[0].data.match(/\((.*)\)/)[1]; // aktionaer name
    }
    let rank = +row.children[0].children[0].data.replace('.', '').replace('Systembank', ''); // rank
    let stk = row.children[1].children[0].data.replace(/\./g, ''); // stk
    let aenderung = row.children[2].children[0];
    if (aenderung.name === 'img')
      aenderung = NaN;
    else
      aenderung = aenderung.children[0].data;

    let aktionaer = {
      rank: rank,
      wkn: +wkn,
      name: name,
      anzahl: +stk,
      aenderung: +aenderung
    };
    aktionaere.push(aktionaer);
  });
  return aktionaere;
}

module.exports = parseAktionaere;
