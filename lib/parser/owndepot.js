const cheerio = require('cheerio');
const format = require('../format.js');

function parseOwnDepot(html) {

    let data = cheerio.load(html);
  
  
    let aktien = [];
    let aktientbody = data('#depot').children()[1];
  
    aktientbody.children.filter(tr => tr.type !== 'text').forEach(tr => {
  
      let tds = tr.children.filter(td => td.type !== 'text');
  
      let wkn         = tds[0].children[0].children[0].data;
      let name        = tds[0].children[0].children[2].children[0].data;
  
      let notiz       = tds[1].children[0].children[0].data;
  
      let anzahl      = tds[2].children[0].data;
  
      let gKurs       = tds[3].children[0].children[0].data;
      let hKurs       = tds[3].children[1].children[0].data;
      let bKurs       = tds[3].children[4].children[0].data;
  
      let kPreis      = tds[4].children[0].data;
      let kDatum      = tds[4].children[2].data;
  
      let aenderung   = tds[5].children[0];
      
      let tKurs       = tds[6].children[0].children[0].data;
  
      let bWAktie     = tds[7].children[0].data;
  
      let kBW         = tds[8].children[0].children[0].data;
  
      let buchwert    = tds[9].children[0].data;
  
      let wachstum    = tds[10].children[0].data;
  
      let aGAlter     = tds[11].children[0].data;
  
      let oStatus     = tds[12].children[0].data;
  
      let hAktivitaet = tds[13].children[0].data;
      
      let orders      = (!tds[14].children[0].children[0]) ? "" : tds[14].children[0].children[0].data;
  
      let kGV         = tds[15].children[0].data;
  
      let fP          = tds[16].children[0].data;
  
      aenderung = (aenderung.name === 'img') ? 0 : aenderung.children[0].data;
  
      let aktie = {
        wkn: +wkn,
        name: name,
        notiz: notiz,
        anzahl: +anzahl,
        gKurs: format.from(gKurs),
        hKurs: format.from(hKurs),
        bKurs: format.from(bKurs),
        kPreis: format.from(kPreis),
        kDatum: kDatum,
        aenderung: aenderung,
        tKurs: tKurs,
        bWAktie: format.from(bWAktie),
        kBW: format.from(kBW),
        bW: format.from(buchwert),
        wachstum: (!wachstum) ? 0 : +wachstum,
        aGAlter: aGAlter,
        oStatus: oStatus,
        hAktivitaet: hAktivitaet,
        orders: orders,
        kGV: format.from(kGV),
        fP: format.from(fP)
      };
  
      aktien.push(aktie);  
  
    });
  
  
    let anleihen = [];
  
    let tbody = data('#depotAnleihen').find('tbody');
  
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
    let tbody_kredite = data('#depotKredite').find('tbody');
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
    let tbody_zertis = data('#depotZertis').find('tbody');
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

  module.exports = parseOwnDepot;
