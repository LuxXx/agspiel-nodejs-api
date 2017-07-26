const cheerio = require('cheerio');
const format = require('../format.js');

function parseIndex(html) {
  let $ = cheerio.load(html);

  let name = $('h1')[0].children[0].data.trim();

  let memberTable = $('#indexMember')[0];
  let memberBody = memberTable.children[3];
  let rows = memberBody.children.filter(o => o.type === 'tag');
  rows.pop();
  let member = [];

  let leiterTag = $("span[style='font-size:16px']")[0];
  let leiter = {
    name: leiterTag.children[1].children[0].data,
    id: +leiterTag.children[1].attribs.href.substring(32)
  };
  let stellvertreter = {
    name: leiterTag.children[5].children[0].data,
    id: +leiterTag.children[5].attribs.href.substring(32)
  };
  let pressesprecher = {
    name: leiterTag.children[9].children[0].data,
    id: +leiterTag.children[9].attribs.href.substring(32)
  };
  let gründung = leiterTag.next.data.match(/Gründung: (.*)\n/)[1];
  gründung = format.date(gründung);

  rows.forEach(r => {
    let wkn = +r.children[0].children[0].attribs.href.substring(31);
    let name = r.children[0].children[0].children[0].data.match(/: (.*)/)[1];
    let ceo = r.children[0].children[1].data.match(/ von (.*)/)[1];

    member.push({
      wkn: wkn,
      name: name,
      ceo: ceo,
    });
  });


  return {
    name: name,
    leiter: leiter,
    stellvertreter: stellvertreter,
    pressesprecher: pressesprecher,
    gruendung: gründung,
    mitglieder: member,
  };
}

module.exports = parseIndex;
