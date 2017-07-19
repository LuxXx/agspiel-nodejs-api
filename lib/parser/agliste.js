const cheerio = require('cheerio');
const format = require('../format.js');

function parseAGListe(html) {
  let $ = cheerio.load(html);

  let aglistentries = $('.aglistentry')
  let liste = [];

  for (var id in aglistentries) {
    if (aglistentries.hasOwnProperty(id) && !isNaN(id)) {
      let e = aglistentries[id].children[0];
      let wkn = e.attribs.href.substring(31);
      let name = e.children[0].data;

      liste.push({
        id: +id,
        wkn: +wkn,
        name: name
      });
    }
  }
  return liste;
}

module.exports = parseAGListe;
