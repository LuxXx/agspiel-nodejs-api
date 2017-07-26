const cheerio = require('cheerio');

function parseIndex(html) {
  let $ = cheerio.load(html);

  let name = $('h1')[0].children[0].data.trim();

  let memberTable = $('#indexMember')[0];
  let memberBody = memberTable.children[3];
  let rows = memberBody.children.filter(o => o.type === 'tag');
  rows.pop();
  let member = [];


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
    mitglieder: member,
  };
}

module.exports = parseIndex;
