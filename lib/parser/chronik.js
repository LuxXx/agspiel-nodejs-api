const cheerio = require('cheerio');
const format = require('../format.js');

function parseChronik(html) {
  let $ = cheerio.load(html);

  let chronik = {
    namechanges: [],
    regname: 'unknown',
    kes: [],
    khs: [],
    uebernahmen: [],
  }

  let t = $('#chronik');

  if (t.html().includes('Es gibt noch keine Chronikeinträge')) {
    return {};
  }

  t.children('tbody').children('tr').each((i, e) => {
    let text = '';
    e.children[3].children.forEach(a => {
      if (a.type === 'text')
        text += a.data;
      else
        text += a.children[0].data;
    });

    let date = e.children[1].children[0].data;
    date = format.date(date);

    if (text.includes('AG wurde unter dem Namen ')) {
      chronik.regname = text.match(/AG wurde unter dem Namen (.*) gegründet/)[1];
      chronik.regdatum = date;
    }
    if (text.includes('Name wurde von ')) {
      let from = text.match(/Name wurde von (.*) in /)[1];
      let to = text.match(/ in (.*) geändert/)[1];
      chronik.namechanges.push({
        datum: date,
        from: from,
        to: to
      })
    }
    if (text.includes('Kapitalherabsetzung')) {
      let stk = text.match(/\((.*) Stk/)[1];
      stk = +format.from(stk);
      let vol = text.match(/, (.*)€/)[1];
      vol = +format.from(vol);
      chronik.khs.push({
        datum: date,
        anzahl: stk,
        volumen: vol
      })
    }
    if (text.includes(' übernommen und dadurch die Anzahl der Aktien seiner AG um ')) {
      let uebernommener = +text.match(/AG hat WKN (.*) übernommen und dadurch die Anzahl der Aktien seiner AG um /)[1].replace('#', '');
      let uebernahmekh = +text.match(/ übernommen und dadurch die Anzahl der Aktien seiner AG um (.*) Stk. reduziert./)[1];
      chronik.uebernahmen.push({
        datum: date,
        uebernommener: uebernommener,
        uebernahmekh: uebernahmekh
      })
    }
    if (text.includes('übernommen.')) {
      let uebernommener = +text.match(/AG hat WKN (.*) übernommen./)[1].replace('#', '');
      chronik.uebernahmen.push({
        datum: date,
        uebernommener: uebernommener,
        uebernahmekh: 0
      })
    }

    if (text.includes('Kapitalerhöhung wurde durchgeführt ')) {
      let stk = text.match(/Kapitalerhöhung wurde durchgeführt \((.*) junge/)[1];

      let volumen = null;
      if (!text.includes(' wurden angeboten, wie viele davon verkauft wurden, ist nicht dokumentiert')) {
        volumen = text.match(/ junge Aktien verkauft im Gesamtwert von (.*)€/)[1];
        volumen = format.from(volumen);
      }

      chronik.kes.push({
        datum: date,
        anzahl: format.from(stk),
        volumen: volumen
      })
    }

    if (text.includes('AG wurde durch WKN #') && text.includes(' übernommen.')) {
      let uebernehmer = text.match(/AG wurde durch WKN #(.*) übernommen\./)[1];
      chronik.uebernehmer = uebernehmer;
      chronik.uebernahmedatum = date;
    }

    if (text.includes('AG wurde liquidiert.')) chronik.liquidationsdatum = date;

  })

  return chronik;
}

module.exports = parseChronik;
