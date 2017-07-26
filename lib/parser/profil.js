const cheerio = require('cheerio');
const format = require('../format.js');

function parseProfil(html) {
  let $ = cheerio.load(html);

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

  let userid = 0;
  $('a').each((i,e) => {
    if (e.attribs.title === 'Premium schenken')
      userid = +e.attribs.href.substring(28);
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
  ksd = ksd.substring(6, ksd.length - 1);
  ksd = format.from(ksd);

  let agsxp = $('#agsxp').text().trim();
  agsxp = agsxp.substring(10);
  agsxp = format.from(agsxp);

  let kurs14d = $('#kurs14d').text().trim();
  kurs14d = kurs14d.match('(.*)%');
  if (kurs14d !== null) {
    kurs14d = format.from(kurs14d[1].trim());
  } else {
    kurs14d = NaN;
  }

  let tagesvolumen = $('#tagesvolumen').text().replace('\n', '').replace('\n', '').trim().match(/Tagesvolumen(.*)€/)[1].trim();

  let ceo = $('.big')[0].children[0].data;

  let alter = $('#agalter').text().trim().match(/Alter(.*)/)[1];

  let spread = $('#spread').text().replace('\n', '').match(/\)(.*)%/)[1].trim();

  let bargeld = html.match(/\['Bargeld',(.*)\]/)[1];
  let aktien = html.match(/\['Aktien',(.*)\]/)[1];
  let anleihen = html.match(/\['Anleihen',(.*)\]/)[1];
  let zertifikate = html.match(/\['Zertifikate',(.*)\]/)[1];

  let eigenkapital = html.match(/\['Eigenkapital',(.*)\]/)[1];
  let fremdkapital = html.match(/\['Fremdkapital',(.*)\]/)[1];

  let bwaktie = $('#bwproaktie')[0].children[4].data.trim();
  bwaktie = bwaktie.substring(0, bwaktie.length - 2);
  bwaktie = format.from(bwaktie);

  let infos = $('.padding5').find('tbody').find('td');
  let regdate = format.date(infos[1].children[0].data); // reg
  let agregdate = format.date(infos[3].children[0].data); // ag gründung
  let aktienanzahl = infos[5].children[0].data;
  aktienanzahl = aktienanzahl.substring(0, aktienanzahl.length - 5); // akt stk
  aktienanzahl = format.from(aktienanzahl);
  let dividende = infos[7].children[0].data.replace('%', ''); // div
  let maxzert = infos[9].children[0].data; // max zertifikate
  maxzert = maxzert.substring(0, maxzert.length - 15);

  let whs = infos[11].children[0].data; // Wachstumshighscore
  whs = whs.substring(0, whs.length - 7);
  if (whs.includes('Noch nicht')) whs = 0;

  let ghs = infos[13].children[0].data; // größen highscore
  ghs = ghs.substring(0, ghs.length - 7);
  if (ghs.includes('Noch nicht')) ghs = 0;

  let gehs = infos[15].children[0].data; // beste gesamtplatzierung
  gehs = gehs.substring(0, gehs.length - 7);
  if (gehs.includes('Noch nicht')) gehs = 0;

  let ues = infos[17].children[0].data === 'ja'; // üs

  let tageshoch = infos[19].children[0].data; // tageshoch
  tageshoch = format.from(tageshoch);
  let tagestief = infos[21].children[0].data; // tagestief
  tagestief = format.from(tagestief);


  let admin = $('.admincolor')[0] !== undefined;
  let tutor = $('.tutorcolor')[0] !== undefined;

  let performance = {};
  let perfTable = $('.normalborder')[0].children[1];

  function perf(row, col, name) {
    let p = perfTable.children[row].children[col].children[0];
    if (p.type === 'tag')
      performance[name] = format.from(p.children[0].data);
  }

  perf(2, 5, 'bw14');
  perf(4, 3, 'bw30');
  perf(6, 3, 'bw60');
  perf(8, 3, 'bw90');
  perf(12, 5, 'sw14');
  perf(14, 3, 'sw30');
  perf(16, 3, 'sw60');
  perf(18, 3, 'sw90');

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
    kurs14d: kurs14d,
    ceo: ceo,
    spread: +spread,
    tagesvolumen: tagesvolumen,
    bargeld: +bargeld,
    aktien: +aktien,
    anleihen: +anleihen,
    zertifikate: +zertifikate,
    eigenkapital: +eigenkapital,
    fremdkapital: +fremdkapital,
    regdatum: regdate,
    agregdatum: agregdate,
    aktienanzahl: +aktienanzahl,
    dividende: +dividende,
    maxZertifikate: +maxzert,
    whs: +whs,
    ghs: +ghs,
    gehs: +gehs,
    ues: ues,
    tageshoch: tageshoch,
    tagestief: tagestief,
    admin: admin,
    tutor: tutor,
    performance: performance,

    //am ke machen
    //Sponsor
    //Live
    //Stars
    // mitglied des agsx?
    //HighscorePlatz, Ribbon
    //Onlinestatus
    //IndexRibbon
    //Geldkurs stk
    //letzer handelskurs
    //handelskurs stk
    //briefkurs stk
    //handelskurs date
    // (bw calc aus aktienanzahl und bw_aktie)
    //börsenwert calc
    //kgv
    //(alter calc from reg date)
    //aktivität

    //letze handelsaktivitäten
    //redakteur nur truyo

    //beschreibung

    //Presse

    //History
  };

  $('.red').each((i, e) => {
    let t = e.children[0].data;
    if (t && t.includes('Diese AG befindet sich bald in einer Kapitalerhöhung (')) {
      profile.keankuendigung = {
        anzahl: format.from(t.match(/Diese AG befindet sich bald in einer Kapitalerhöhung \((.*) Stk/)[1]),
        kurs: format.from(t.match(/\/(.*)€ ab /)[1]),
        date: format.longdate(t.match(/€ ab (.*)\)./)[1].replace(' um', '')),
      };
    }
  });

  // functions:
  // Anleihenausschöpfung
  // Zahlungsmittelbestand
  // %Anleihen des Zahlungsmittelbestands
  // Liquidität
  profile.picture = function() {
     return 'https://www.ag-spiel.de/uploads/' + this.userid + '.jpg';
  };
  profile.vg = function() {
     return this.fremdkapital / this.eigenkapital;
  };
  profile.buchwert = function() {
     return this.bwaktie * this.aktienanzahl;
  };

  return profile;
}

module.exports = parseProfil;
