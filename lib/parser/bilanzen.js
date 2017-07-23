const cheerio = require('cheerio');
const format = require('../format.js');

function parseBilanzen(html) {
  let $ = cheerio.load(html);
  let tables = $('h2');

  let bilanzen = [];

  tables.each((i, e) => {
    let date = e.children[0].data;
    let wertTable = e.next.next;
    let kontoTable = wertTable.next.next;

    let wertbody = wertTable.children[1];

    let parseSpalte = ((i) => {
      //                               zeile       spalte
      let start_date = wertbody.children[0].children[3+i].children[0].data;
      let stk = wertbody.children[2].children[3+i].children[0].data; // aktienabzahl
      let kurs = wertbody.children[4].children[3+i].children[0].data; // kurs
      let aktiendepot = wertbody.children[6].children[3+i].children[0].data; // aktiendepot
      let anleihendepot = wertbody.children[7].children[3+i].children[0].data; // anleihendepot
      let kreditdepot = wertbody.children[9].children[3+i].children[0].data; // kreditdepot
      let zertifikatedepot = wertbody.children[10].children[3+i].children[0].data; // zert
      let gesamtdepotwert = wertbody.children[11].children[3+i].children[0].data; // gesamt
      let bargeld = wertbody.children[12].children[3+i].children[0].data; // bargeld
      let buchwert = wertbody.children[14].children[2+i].children[0].children[0].data; // buchwert
      let bwaktie = wertbody.children[16].children[2+i].children[0].children[0].data; // buchwert aktie
      let sw = wertbody.children[20].children[3+i].children[0].children[0].data; // sw
      let ksd = wertbody.children[22].children[3+i].children[0].data; // ksd
      let platzwachstum = wertbody.children[26].children[3+i].children[0].data; // platz wachstum
      let platzgroeße = wertbody.children[28].children[3+i].children[0].data; // platz größe
      let platzgesamt = wertbody.children[30].children[3+i].children[0].children[0].data; // platz gesamt
      return new Bilanz(start_date, stk, kurs, aktiendepot, anleihendepot, kreditdepot, zertifikatedepot, gesamtdepotwert, bargeld, buchwert, bwaktie, sw, ksd, platzwachstum, platzgroeße, platzgesamt);
    });
    bilanzen.push(parseSpalte(2));
    bilanzen.push(parseSpalte(0));
  });

  return bilanzen;
}

module.exports = parseBilanzen;

function Bilanz(date, stk, kurs, akt, anl, kred, zert, ges, bar, bw, bwaktie, sw, ksd, pw, pgr, pge) {
  this.date = date;
  this.aktienanzahl = format.from(stk.replace(' Stk.', ''));
  this.kurs = format.from(kurs);
  this.aktien = format.from(akt);
  this.anleihen = format.from(anl);
  this.kredit = format.from(kred);
  this.zertifikate = format.from(zert);
  this.gesamtdepot = format.from(ges);
  this.bargeld = format.from(bar);
  this.buchwert = format.from(bw);
  this.bwaktie = format.from(bwaktie);
  this.sw = format.from(sw);
  this.ksd = format.from(ksd);
  this.whs = format.from(pw);
  this.ghs = format.from(pgr);
  this.gehs = format.from(pge);
}
