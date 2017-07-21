const cheerio = require('cheerio');
const format = require('../format.js');

function parseTrades(html) {
  let $ = cheerio.load(html);
  let trades = [];

  $('.trade').each((i, e) => {

    let wkn = e.children[0].children[0].children[1].attribs.href.substring(31);

    let name = e.children[0].children[0].children[1].children[0].data;
    name = name.substring(0, name.length - 10);
    let longdiv = e.children[1];

    let sell = longdiv.children[1].children[0].data;
    let stk = sell.match(/Sell (.*) Stk\. zu/)[1];
    let verkaufskurs = sell.match(/ Stk\. zu (.*)€/)[1];
    verkaufskurs = format.from(verkaufskurs);
    let date = sell.match(/€ am (.*) \(#/)[1].replace(' um', '');
    date = format.longdate(date);
    let orderid = +sell.match(/ \(#(.*)\)/)[1];

    let buy = longdiv.children[2].children[0].data;
    let gewKaufpreis = buy.match(/Ø gewichteter Kaufpreis:  (.*)€, Ø gewichteter Kaufzeitpunkt: /)[1];
    gewKaufpreis = format.from(gewKaufpreis);

    let gewKaufzeitpunkt = buy.match(/€, Ø gewichteter Kaufzeitpunkt: (.*), Haltedauer /)[1].replace(' um', '');
    gewKaufzeitpunkt = format.longdate(gewKaufzeitpunkt);

    let haltedauer = buy.match(/, Haltedauer (.*) Tage/)[1];
    haltedauer = format.from(haltedauer);

    let info = longdiv.children[3];
    let sumBuys = info.children[0].children[0].data;
    let sumSells = info.children[1].children[0].data;
    let gewinn = longdiv.children[4];

    let absGewinn = gewinn.children[0].children[1].children[1].children[0].data;
    let relGewinn = gewinn.children[1].children[1].children[0].children[0].data;
    let rendite;
    if (gewinn.children[2].children[1].children[0].data === ' n/a') {
      rendite = NaN;
    } else {
      rendite = format.from(gewinn.children[2].children[1].children[1].children[0].data);
    }

    trades.push({
      wkn: +wkn,
      name: name,
      anzahl: +stk,
      verkaufskurs: verkaufskurs,
      verkaufsdatum: date,
      orderid: orderid,
      gewichteterKaufpreis: gewKaufpreis,
      gewichteterKaufzeitpunkt: gewKaufzeitpunkt,
      haltedauer: haltedauer,
      absGewinn: format.from(absGewinn),
      relGewinn: format.from(relGewinn),
      rendite: rendite,
    });
  });

  return trades;
}

module.exports = parseTrades;
