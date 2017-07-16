const cheerio = require('cheerio')
const format = require('./format.js');

function htmlToDOM(html) {
  return cheerio.load(html);
}


function parseProfile(html) {
  let $ = htmlToDOM(html);

  let handelskurs = $('#handelskurs').children('span').first().text();
  handelskurs = format.from(handelskurs);

  let geldkurs = $('#geldkurs').children('span').first().text();
  geldkurs = format.from(geldkurs);

  let briefkurs = $('#briefkurs').children('span').first().text();
  briefkurs = format.from(briefkurs);

  let name = $('title').first().text();
  name = name.substr(0, name.length - 16);

  let wkn = $('#heading').first().text().substring(15);

  let premium = 0;
  if (html.includes('images/premium.png')) premium = 1;
  if (html.includes('images/premium_gold.png')) premium = 2;

  let picture = $('meta[property]').next().attr('content');
  picture = picture !== undefined;

  let userid = 0
  $('a').each((i,e) => {
    if (e.attribs.title === 'Premium schenken')
      userid = +e.attribs.href.substring(28)
  })
  //let userid = +picture.substring(32,picture.length - 4)

  let il = $.html().includes(">i.L.</span>");

  let banned = $.html().includes(">Spieler ist gesperrt</span>");

  let index = $('.member_of').first().children('a').next().attr('href');
  index = index === undefined ? 0 : parseInt(index.split('=')[2]);

  let sw = $('#sw').text().trim();
  sw = sw.substring(12, sw.length - 2);
  sw = format.from(sw);

  let ksd = $('#ksd').text().trim();
  ksd = ksd.substring(6, ksd.length - 1)
  ksd = format.from(ksd);

  let agsxp = $('#agsxp').text().trim();
  agsxp = agsxp.substring(10)
  agsxp = format.from(agsxp);

  let kurs14d = $('#kurs14d').text().trim();
  kurs14d = kurs14d.match('(.*)%')
  if (kurs14d !== null) {
    kurs14d = format.from(kurs14d[1].trim());
  } else {
    kurs14d = NaN;
  }

  let tagesvolumen = $('#tagesvolumen').text().replace('\n', '').replace('\n', '').trim().match(/Tagesvolumen(.*)€/)[1].trim();

  let ceo = $('.big').text()

  let alter = $('#agalter').text().trim().match(/Alter(.*)/)[1]

  let spread = $('#spread').text().replace('\n', '').match(/\)(.*)%/)[1].trim()

  let bargeld = html.match(/\['Bargeld',(.*)\]/)[1]
  let aktien = html.match(/\['Aktien',(.*)\]/)[1]
  let anleihen = html.match(/\['Anleihen',(.*)\]/)[1]
  let zertifikate = html.match(/\['Zertifikate',(.*)\]/)[1]

  let eigenkapital = html.match(/\['Eigenkapital',(.*)\]/)[1]
  let fremdkapital = html.match(/\['Fremdkapital',(.*)\]/)[1]

  let bwaktie = $('#bwproaktie')[0].children[4].data.trim()
  bwaktie = bwaktie.substring(0, bwaktie.length - 2)
  bwaktie = format.from(bwaktie)

  let infos = $('.padding5').find('tbody').find('td');
  let regdate = format.date(infos[1].children[0].data) // reg
  let agregdate = format.date(infos[3].children[0].data) // ag gründung
  let aktienanzahl = infos[5].children[0].data
  aktienanzahl = aktienanzahl.substring(0, aktienanzahl.length - 5) // akt stk
  aktienanzahl = format.from(aktienanzahl)
  let dividende = infos[7].children[0].data.replace('%', '') // div
  let maxzert = infos[9].children[0].data // max zertifikate
  maxzert = maxzert.substring(0, maxzert.length - 15)

  let whs = infos[11].children[0].data // Wachstumshighscore
  whs = whs.substring(0, whs.length - 7)
  if (whs.includes('Noch nicht')) whs = 0;

  let ghs = infos[13].children[0].data // größen highscore
  ghs = ghs.substring(0, ghs.length - 7)
  if (ghs.includes('Noch nicht')) ghs = 0;

  let gehs = infos[15].children[0].data // beste gesamtplatzierung
  gehs = gehs.substring(0, gehs.length - 7)
  if (gehs.includes('Noch nicht')) gehs = 0;

  let ues = infos[17].children[0].data === 'ja'// üs

  let tageshoch = infos[19].children[0].data // tageshoch
  tageshoch = format.from(tageshoch)
  let tagestief = infos[21].children[0].data // tagestief
  tagestief = format.from(tagestief)

  let profile = {
    name: name,
    handelskurs: +handelskurs,
    geldkurs: +geldkurs,
    briefkurs: +briefkurs,
    wkn: +wkn,
    premium: +premium,
    //picture: picture,
    userid: userid,
    il: il,
    banned: banned,
    index: +index,
    sw: +sw,
    bwaktie: bwaktie,
    ksd: +ksd,
    agsxp: +agsxp,
    kurs14d: +kurs14d,
    ceo: ceo,
    spread: +spread,
    tagesvolumen: tagesvolumen,
    bargeld: +bargeld,
    aktien: +aktien,
    anleihen: +anleihen,
    zertifikate: +zertifikate,
    eigenkapital: +eigenkapital,
    fremdkapital: +fremdkapital,
    regdate: regdate,
    agregdate: agregdate,
    aktienanzahl: +aktienanzahl,
    dividende: +dividende,
    maxZertifikate: +maxzert,
    whs: +whs,
    ghs: +ghs,
    gehs: +gehs,
    ues: ues,
    tageshoch: tageshoch,
    tagestief: tagestief

    //am ke machen
    //Sponsor
    //Live
    //Stars
    //HighscorePlatz, Ribbon
    //Onlinestatus
    //IndexRibbon
    //Geldkurs stk
    //letzer handelskurs
    //handelskurs stk
    //briefkurs stk
    //handelskurs date
    // (bw calc aus aktienanzahl und bw_aktie)
    //börsenwert
    //kgv
    //(alter calc from reg date)
    //aktivität

    //letze handelsaktivitäten
    //performance


    //beschreibung

    //Presse

    //History
  }

  // functions:
  // Buchwert
  // Anleihenausschöpfung
  // Zahlungsmittelbestand
  // %Anleihen des Zahlungsmittelbestands
  // Liquidität
  profile.picture = function() {
     return 'https://www.ag-spiel.de/uploads/' + this.userid + '.jpg';
  }
  profile.vg = function() {
     return this.fremdkapital / this.eigenkapital;
  }
  profile.buchwert = function() {
     return this.bwaktie * this.aktienanzahl;
  }



  return profile;
}

function live(data) {
  // TODO: transform to numerical values
  // TODO: do the rest

  data = JSON.parse(data)

  data.orders.forEach(o => {
    o.action = o.action.match(/>(.*)</)[1]
    o.diff = o.diff.match(/>(.*)</)[1]
    o.date = o.date.substring(0, o.date.length - 4)
    o.stueckzahl = o.stueckzahl.substring(0, o.stueckzahl.length - 5)
    o.limit = o.limit.replace('&euro;', '')
    o.kurs = o.kurs.replace('&euro;', '')
    o.volumen = o.kurs.replace('&euro;', '')
  });


  return data;
}

function parseAGListe(html) {
  let $ = htmlToDOM(html)

  let aglistentries = $('.aglistentry')
  let liste = [];

  for (var id in aglistentries) {
    if (aglistentries.hasOwnProperty(id) && !isNaN(id)) {
      let e = aglistentries[id].children[0]
      let wkn = e.attribs.href.substring(31)
      let name = e.children[0].data

      liste.push({
        id: id,
        wkn: wkn,
        name: name,
      });
    }
  }
  return liste;
}

function parseChronik(html) {
  let $ = htmlToDOM(html)

  let chronik = {
    namechanges: [],
    regname: 'unknown',
    kes: [],
    khs: [],
    uebernahmen: [],
  }

  let t = $('#chronik')

  if (t.html().includes('Es gibt noch keine Chronikeinträge')) {
    return {}
  }

  t.children('tbody').children('tr').each((i, e) => {
    let text = ''
    e.children[3].children.forEach(a => {
      if (a.type === 'text')
        text += a.data
      else
        text += a.children[0].data
    });

    let date = e.children[1].children[0].data
    date = format.date(date)
    
    if (text.includes('AG wurde unter dem Namen ')) {
      chronik.regname = text.match(/AG wurde unter dem Namen (.*) gegründet/)[1]
      chronik.regdatum = date;
    }
    if (text.includes('Name wurde von ')) {
      let from = text.match(/Name wurde von (.*) in /)[1]
      let to = text.match(/ in (.*) geändert/)[1]
      chronik.namechanges.push({
        datum: date,
        from: from,
        to: to
      })
    }
    if (text.includes('Kapitalherabsetzung')) {
      let stk = text.match(/\((.*) Stk/)[1]
      stk = +format.from(stk)
      let vol = text.match(/, (.*)€/)[1]
      vol = +format.from(vol)
      chronik.khs.push({
        datum: date,
        anzahl: stk,
        volumen: vol
      })
    }
    if (text.includes(' übernommen und dadurch die Anzahl der Aktien seiner AG um ')) {
      let uebernommener = +text.match(/AG hat WKN (.*) übernommen und dadurch die Anzahl der Aktien seiner AG um /)[1].replace('#', '')
      let uebernahmekh = +text.match(/ übernommen und dadurch die Anzahl der Aktien seiner AG um (.*) Stk. reduziert./)[1]
      chronik.uebernahmen.push({
        datum: date,
        uebernommener: uebernommener,
        uebernahmekh: uebernahmekh
      })
    }
    if (text.includes('übernommen.')) {
      let uebernommener = +text.match(/AG hat WKN (.*) übernommen./)[1].replace('#', '')
      chronik.uebernahmen.push({
        datum: date,
        uebernommener: uebernommener,
        uebernahmekh: 0
      })
    }

    if (text.includes('Kapitalerhöhung wurde durchgeführt ')) {
      let stk = text.match(/Kapitalerhöhung wurde durchgeführt \((.*) junge/)[1]

      let volumen = null
      if (!text.includes(' wurden angeboten, wie viele davon verkauft wurden, ist nicht dokumentiert')) {
        volumen = text.match(/ junge Aktien verkauft im Gesamtwert von (.*)€/)[1]
        volumen = format.from(volumen)
      }

      chronik.kes.push({
        datum: date,
        anzahl: format.from(stk),
        volumen: volumen
      })
    }

    if (text.includes('AG wurde durch WKN #') && text.includes(' übernommen.')) {
      let uebernehmer = text.match(/AG wurde durch WKN #(.*) übernommen\./)[1]
      chronik.uebernehmer = uebernehmer
      chronik.uebernahmedatum = date
    }

    if (text.includes('AG wurde liquidiert.')) chronik.liquidationsdatum = date

  })

  return chronik;
}


function parseIndizes(html) {
  let $ = htmlToDOM(html);
  let indizes = []

  let rows = $('#highscoreI').children('tbody').children('tr')

  rows.each((i, e) => {
    let rank = e.children[3].children[0].data.replace('.', '')
    let id = +e.children[5].children[0].attribs.href.substring(31)
    let name = e.children[5].children[0].children[0].data
    let member = +e.children[9].children[0].data
    let leiter = e.children[11].children[0]
    let aktivität = e.children[13].children[0].data.replace('%', '')
    let bewerbung = e.children[15].children[0].data.trim() === 'möglich'
    let punkte = +e.children[17].children[0].children[0].data

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
    indizes.push(index)
  });

  return indizes;
}

function parseDepot(html) {
  let $ = htmlToDOM(html)


  let aktien = []
  let depotExt = $('#depotExt')
  let aktientbody = depotExt[0].children[3]
  aktientbody.children.filter(tr => tr.type !== 'text').forEach(tr => {
    let tds = tr.children.filter(td => td.type !== 'text');


    let stk = tds[1].children[0].data
    let bwaktie = tds[4].children[0].data
    let bw = tds[5].children[0].data
    let sw = tds[6].children[0].data
    let geldkurs = tds[3].children[0].children[0].data
    let handelskurs = tds[3].children[1].children[0].data
    let briefkurs = tds[3].children[4].children[0].data
    let aenderung = tds[2].children[0]
    if (aenderung.name === 'img') {
      aenderung = NaN;
    } else {
      aenderung = aenderung.children[0].data;
    }

    let wkn = tds[0].children[0].children[0].data
    let name = tds[0].children[0].children[2].children[0].data

    let aktie = {
      wkn: +wkn,
      name: name,
      anzahl: +stk,
      aenderung: aenderung,
      geldkurs: geldkurs,
      handelskurs: handelskurs,
      briefkurs: briefkurs,
      bwaktie: bwaktie,
      bw: bw,
      sw: sw
    }
    aktien.push(aktie)
  });

  // TODO: Anleihen, Kredite, Zertis

  let depot = {
    aktien: aktien
  }
  return depot
}


module.exports = {
  profile: parseProfile,
  agliste: parseAGListe,
  live: live,
  indizes: parseIndizes,
  chronik: parseChronik,
  depot: parseDepot
};
