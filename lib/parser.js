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
  kurs14d = kurs14d.match('(.*)%')[1].trim()
  kurs14d = format.from(kurs14d);

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


  return {
    name: name,
    handelskurs: +handelskurs,
    geldkurs: +geldkurs,
    briefkurs: +briefkurs,
    wkn: +wkn,
    premium: +premium,
    picture: picture,
    il: il,
    banned: banned,
    index: +index,
    sw: +sw,
    ksd: +ksd,
    agsxp: +agsxp,
    kurs14d: +kurs14d,
    ceo: ceo,
    spread: +spread,
    tagesvolumen: tagesvolumen,
    bargeld: +bargeld,
    aktien: aktien,
    anleihen: anleihen,
    zertifikate: zertifikate,
    eigenkapital: eigenkapital,
    fremdkapital: fremdkapital,


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
    //bw_aktie
    // (bw calc aus aktienanzahl und bw_aktie)
    //börsenwert
    //kgv
    //(alter calc from reg date)
    //aktivität

    //letze handelsaktivitäten
    //performance

    // Spieler reg
    // ag grüdungsdate
    // Aktien-Stückzahl
    //Dividende
    //Max ZertVOl
    //Wachstumshighscore
    //Größenhighscore
    //beste gesamtplatuierung
    //üs
    //tageshoch
    //tagestief
    //beschreibung

    //Presse

    //History


    // functions:
    // VG
    // Buchwert
    // Anleihenausschöpfung
    // Zahlungsmittelbestand
    // %Anleihen des Zahlungsmittelbestands
    // Liquidität

  }
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


module.exports = {
  profile: parseProfile,
  agliste: parseAGListe,
  live: live,
  indizes: parseIndizes,
};
