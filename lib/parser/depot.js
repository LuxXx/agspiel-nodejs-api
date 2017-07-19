const cheerio = require('cheerio');
const format = require('../format.js');

function parseDepot(html) {
  let $ = cheerio.load(html);

  let aktien = [];
  let depotExt = $('#depotExt');
  let aktientbody = depotExt[0].children[3];
  aktientbody.children.filter(tr => tr.type !== 'text').forEach(tr => {
    let tds = tr.children.filter(td => td.type !== 'text');

    let stk = tds[1].children[0].data;
    let bwaktie = tds[4].children[0].data;
    let bw = tds[5].children[0].data;
    let sw = tds[6].children[0].data;
    let geldkurs = tds[3].children[0].children[0].data;
    let handelskurs = tds[3].children[1].children[0].data;
    let briefkurs = tds[3].children[4].children[0].data;
    let aenderung = tds[2].children[0];
    if (aenderung.name === 'img') {
      aenderung = NaN;
    } else {
      aenderung = aenderung.children[0].data;
    }

    let wkn = tds[0].children[0].children[0].data;
    let name = tds[0].children[0].children[2].children[0].data;

    let aktie = {
      wkn: +wkn,
      name: name,
      anzahl: +stk,
      aenderung: +aenderung,
      geldkurs: format.from(geldkurs),
      handelskurs: format.from(handelskurs),
      briefkurs: format.from(briefkurs),
      bwaktie: format.from(bwaktie),
      bw: format.from(bw),
      sw: format.from(sw)
    };
    aktien.push(aktie);
  });

  let anleihen = [];
  let tbody = $('#depotAnleihen').find('tbody');
  tbody[0].children.filter(r => r.type === 'tag').forEach(row => {
    row = row.children.filter(cell => cell.type === 'tag');
    let vol = format.from(row[0].children[0].data);
    let zins = row[1].children[0].data.replace('%', '');
    let zinsbetrag = format.from(row[2].children[0].data);
    let auszahlung = format.from(row[3].children[0].data);
    let laufzeit = row[4].children[0].data;
    let restlaufzeit = row[5].children[0].data;
    let date = row[6].children[0].data.replace(' um', '');
    date = format.date(date, date.substring(10));

    let anleihe = {
      volumen: vol,
      zinssatz: +zins,
      zinsbetrag: zinsbetrag,
      auszahlung: auszahlung,
      laufzeit: laufzeit,
      restlaufzeit: restlaufzeit,
      auszahlungsdatum: date
    };
    anleihen.push(anleihe);
  });

  let kredite = [];
  let tbody_kredite = $('#depotKredite').find('tbody');
  tbody_kredite[0].children.filter(r => r.type === 'tag').forEach(row => {
    row = row.children.filter(cell => cell.type === 'tag');
    let vol = format.from(row[0].children[0].data);
    let zins = row[1].children[0].data.replace('%', '');
    let zinsbetrag = format.from(row[2].children[0].data);
    let auszahlung = format.from(row[3].children[0].data);
    let laufzeit = row[4].children[0].data;
    let restlaufzeit = row[5].children[0].data;
    let date = row[6].children[0].data.replace(' um', '');
    date = format.date(date, date.substring(10));

    let kredit = {
      volumen: vol,
      zinssatz: +zins,
      zinsbetrag: zinsbetrag,
      rueckzahlungsbetrag: auszahlung,
      laufzeit: laufzeit,
      restlaufzeit: restlaufzeit,
      rueckzahlungsdatum: date
    };
    kredite.push(kredit);
  })

  let zertis = [];
  let tbody_zertis = $('#depotZertis').find('tbody');
  tbody_zertis[0].children.filter(r => r.type === 'tag').forEach(row => {
    row = row.children.filter(cell => cell.type === 'tag');
    let betrag = format.from(row[0].children[0].data);
    let hebel = row[1].children[0].data;
    let punkte = format.from(row[2].children[0].data.match(/auf (.*) Pkt./)[1]);
    let typ = row[2].children[0].data.includes('call') ? 'CALL' : 'PUT';
    let auszahlung = format.from(row[3].children[0].data);
    let ablaufdatum = row[4].children[0].data.replace(' um', '');
    ablaufdatum = format.date(ablaufdatum, ablaufdatum.substring(10));

    let zert = {
      betrag: betrag,
      hebel: +hebel,
      typ: typ,
      punkte: punkte,
      auszahlung: auszahlung,
      ablaufdatum: ablaufdatum,
    };
    zertis.push(zert);
  })

  let depot = {
    aktien: aktien,
    anleihen: anleihen,
    kredite: kredite,
    zertifikate: zertis
  }
  return depot;
}

module.exports = parseDepot;
