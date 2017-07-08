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
    sw: sw,
    ksd: ksd,
    agsxp: agsxp,
    kurs14d: kurs14d,
    ceo: ceo,
    spread: spread,
    tagesvolumen: tagesvolumen,


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
    //börsenwert
    //kgv
    //alter
    //aktivität

    //letze handelsaktivitäten
    //performance
    // EK / FK
    // Bargeld
    // Aktiendepotwert // Im Depot rechnen?
    // Anleihenvolumen // Aus Anlehen berechnen?

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

  }
}

function parseAGListe(html) {
  // TODO
  let liste = [];
  return liste;
}


module.exports = {
  profile: parseProfile,
  agliste: parseAGListe,
};
