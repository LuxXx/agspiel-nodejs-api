const cheerio = require('cheerio');
const format = require('../format.js');

function parseIndizes(html) {
  let $ = cheerio.load(html);
  let indizes = [];

  let rows = $('#highscoreI').children('tbody').children('tr');

  rows.each((i, e) => {
    let rank = e.children[3].children[0].data.replace('.', '');
    let id = +e.children[5].children[0].attribs.href.substring(31);
    let name = e.children[5].children[0].children[0].data;
    let member = +e.children[9].children[0].data;
    let leiter = e.children[11].children[0];
    let aktivität = e.children[13].children[0].data.replace('%', '');
    let bewerbung = e.children[15].children[0].data.trim() === 'möglich';
    let punkte = +e.children[17].children[0].children[0].data;

    let index = {
      id: id,
      name: name,
      rank: rank,
      member: member,
      leiter: {
        id: leiter.attribs.href.substring(32),
        name: leiter.children[0].data.trim()
      },
      aktivitaet: aktivität,
      bewerbung: bewerbung,
      punkte: punkte
    }
    indizes.push(index);
  });

  return indizes;
}

module.exports = parseIndizes;
